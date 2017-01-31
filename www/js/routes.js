angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.upload'
      2) Using $state.go programatically:
        $state.go('tabsController.upload');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab1/page3
      /page1/tab2/page3
  */
  .state('tabsController.upload', {
    url: '/page3',
    views: {
      'tab1': {
        templateUrl: 'templates/upload.html',
        controller: 'uploadCtrl'
      },
      'tab2': {
        templateUrl: 'templates/upload.html',
        controller: 'uploadCtrl'
      }
    }
  })

  .state('tabsController.trustmeter', {
    url: '/page9',
    views: {
      'tab1': {
        templateUrl: 'templates/trustmeter.html',
        controller: 'trustmeterCtrl'
      }
    }
  })


.state('tabsController.pointtable', {
    url: '/page10',
    views: {
      'tab3': {
        templateUrl: 'templates/pointtable.html',
        controller: 'pointtableCtrl'
      }
    }
  })

.state('tabsController.nopointtable', {
    url: '/page11',
    views: {
      'tab4': {
        templateUrl: 'templates/nopointtable.html',
        controller: 'nopointtableCtrl'
      }
    }
  })


  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signUp', {
    url: '/page7',
    templateUrl: 'templates/signUp.html',
    controller: 'signUpCtrl'
  })

  .state('page', {
    url: '/page8',
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
  })

$urlRouterProvider.otherwise('/page5')

  

});