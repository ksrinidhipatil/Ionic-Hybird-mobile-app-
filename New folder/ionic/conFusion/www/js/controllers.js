angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $ionicModal.fromTemplateUrl('/templates/reserve.html',{
    scope: $scope
  }).then(function (modal) {
    $scope.reserveForm = modal;
  });

  $scope.closeReserve = function () {
    $scope.reserveForm.hide();
  };

  $scope.reserve = function () {
    $scope.reserveForm.show();
  };

  $scope.doReserve = function () {
    console.log('Doing Reservation', $scope.reservation);

    $timeout(function () {
      $scope.closeReserve();
    }, 1000);
  };
  })

  .controller('MenuController', ['$scope', 'menuFactory','dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', function ($scope, menuFactory,dishes, favoriteFactory, baseURL, $ionicListDelegate) {
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    $scope.dishes =dishes;

    $scope.addFavorite = function (index) {
      console.log("index is " + index);
      favoriteFactory.addToFavorites(index);
      $ionicListDelegate.closeOptionButtons();
    };


    $scope.select = function(setTab) {
      $scope.tab = setTab;

      if (setTab === 2) {
        $scope.filtText = "appetizer";
      }
      else if (setTab === 3) {
        $scope.filtText = "mains";
      }
      else if (setTab === 4) {
        $scope.filtText = "dessert";
      }
      else {
        $scope.filtText = "";
      }
    };

    $scope.isSelected = function (checkTab) {
      return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
    };
  }])

  .controller('ContactController', ['$scope', function($scope) {

    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

    var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

    $scope.sendFeedback = function() {

      console.log($scope.feedback);

      if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
        $scope.invalidChannelSelection = true;
        console.log('incorrect');
      }
      else {
        $scope.invalidChannelSelection = false;
        feedbackFactory.save($scope.feedback);
        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
        $scope.feedback.mychannel="";
        $scope.feedbackForm.$setPristine();
        console.log($scope.feedback);
      }
    };
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory','dish','favoriteFactory','baseURL', '$ionicPopover','$ionicModal',function($scope, $stateParams, menuFactory,dish,favoriteFactory, baseURL,$ionicPopover,$ionicModal) {
    $scope.baseURL = baseURL;
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message="Loading ...";

    $ionicPopover.fromTemplateUrl('/templates/dish-detail-popover.html',{
      scope : $scope
    }).then(function (popover) {
      $scope.dish_detail = popover;
    });

    $scope.openPopover = function ($event) {
      $scope.dish_detail.show($event)
    };

    $scope.closePopover = function () {
      $scope.dish_detail.hide()
    };
    $scope.addFavorite = function (index) {
      console.log("index is " + index);
      favoriteFactory.addToFavorites(index);
      $scope.dish_detail.hide();
    };


    $ionicModal.fromTemplateUrl('/templates/commentForm.html',{
      scope:$scope
    }).then(function (modal) {
      $scope.feedback = modal;
    });

    $scope.closeCommentForm = function () {
      $scope.feedback.hide();
    };

    $scope.commentModal = function () {
      $scope.feedback.show();
      $scope.dish_detail.hide();
    };
    $scope.newComment = {rating:5, comment:"", author:"", date:""};
    $scope.doComment = function () {
      $scope.newComment.date = new Date().toISOString();
      console.log($scope.newComment);
      $scope.dish.comments.push($scope.newComment);
      menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
      $scope.closeCommentForm();
      $scope.newComment = {rating: 5, comment: "", author: "", date: ""};
    };


    $scope.dish = dish;

    $scope.newComment = {rating:5, comment:"", author:"", date:""};

    $scope.submitComment = function () {



    }
  }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

    $scope.mycomment = {rating:5, comment:"", author:"", date:""};

    $scope.submitComment = function () {

      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);

      $scope.dish.comments.push($scope.mycomment);
      menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);

      $scope.commentForm.$setPristine();

      $scope.mycomment = {rating:5, comment:"", author:"", date:""};
    }
  }])

  // implement the IndexController and About Controller here

  .controller('IndexController', ['$scope', 'dish','promotion', 'leader', 'baseURL', function($scope, dish, promotion,leader, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = leader;
    $scope.dish = dish;
    $scope.promotion =promotion;
  }])

  .controller('AboutController', ['$scope', 'corporateFactory','leaders','baseURL', function($scope, corporateFactory, leaders,baseURL) {
    $scope.baseURL = baseURL;
    $scope.leaders = corporateFactory.query();
    console.log($scope.leaders);

  }])

  .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.favorites = favorites;

    $scope.dishes = dishes;
    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
      console.log($scope.shouldShowDelete);
    };

    $scope.deleteFavorite = function (index) {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm Delete',
        template: 'Are you sure you want to delete this item?'
      });

      confirmPopup.then(function (res) {
        if (res) {
          console.log('Ok to delete');
          favoriteFactory.deleteFromFavorites(index);
        } else {
          console.log('Canceled delete');
        }
      });

      $scope.shouldShowDelete = false;

    }

  }])

  .filter('favoriteFilter', function () {
    return function (dishes, favorites) {
      var out = [];
      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
          if (dishes[j].id === favorites[i].id)
            out.push(dishes[j]);
        }
      }
      return out;

    }});


