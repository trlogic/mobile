angular.module('app.controllers', [])
  
.controller('uploadCtrl', ['$scope', '$stateParams', '$ionicHistory', '$firebaseArray', '$cordovaCamera', '$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicHistory,$firebaseArray,$cordovaCamera,$ionicPopup) {

   var fb = firebase.database();
    
   // $ionicHistory.clearHistory();
    
    var fbAuth = firebase.auth();
    
     $scope.showAlert = function(message) {
                  
                   var alertPopup = $ionicPopup.alert({
                     title: 'Error !',
                     template: message
                   });
               }

   // $scope.image = '';
    
    if(fbAuth) {
        var userReference = fb.ref("users/" + fbAuth.currentUser.uid);
        var imageReference = fb.ref("users/" + fbAuth.currentUser.uid + "/image");
          imageReference.on('value', function(snapshot) {
            //alert('Snapshot.val:' + snapshot.val());

        //updateStarCount(postElement, snapshot.val());
            $scope.picture = snapshot.val();

           //alert('Picture:' + $scope.picture);
          });
        
    } else {
        $state.go("login");
    }
     
    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
                   userReference.set({
            image: imageData,
            trustpoint: 0
                }).then(function() {
                    $scope.showAlert('Image has been uploaded');
            });
        }, function(error) {
            console.error(error);
        });
    }


}])
   
.controller('trustmeterCtrl', ['$scope', '$stateParams', '$ionicHistory', '$firebaseArray', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicHistory,$firebaseArray) {
 var fb = firebase.database();
    
   // $ionicHistory.clearHistory();
   // $scope.images = [];
    
    var fbAuth = firebase.auth();

    if(fbAuth) {
        var userReference = fb.ref(
          "users/");
       // var imageReference = fb.ref("users/" + fbAuth.currentUser.uid + "/image");
         // imageReference.on('value', function(snapshot) {
           // alert('Snapshot.val:' + snapshot.val());

        //updateStarCount(postElement, snapshot.val());
            //$scope.picture = snapshot.val();

            //alert('Picture:' + $scope.picture);

      $scope.images = $firebaseArray(userReference);
          

    
        
} else {
        $state.go("login");
    }
      

 $scope.message = function(mes) {
     alert(mes);
 }



}])
      
.controller('loginCtrl', ['$scope', '$stateParams', '$firebaseArray', '$state','$firebaseAuth','$ionicHistory','$ionicPopup','$rootScope',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $state,$firebaseAuth,$ionicHistory,$ionicPopup,$rootScope) {
     
      //  alert( $scope.error);

       // $scope.error = '';
    
    var fbAuth = firebase.auth();
    
      $scope.showAlert = function(message) {
                  
                   var alertPopup = $ionicPopup.alert({
                     title: 'Error !',
                     template: message
                   });
               }

    $scope.login = function(username,password) {
      
       $scope.error = '';
       
             fbAuth.signInWithEmailAndPassword(username, password).then(function(authData){
                $ionicHistory.nextViewOptions({
                  historyRoot: true   //1
                  });
             
             $rootScope.extras = true;  //2
          	 
             $state.go('tabsController.trustmeter');},
                function(error){
                  
                  $scope.showAlert(error.message);

                  //alert(error.message);
                 //  alert(error.message);
                     //$scope.error = error.message;
                     //$state.go('login');
                    //$state.go("tabsController.trustmeter");
                    
                });
        
    }



}])
   
.controller('signUpCtrl', ['$scope', '$stateParams', '$firebaseArray', '$state','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $state, $ionicPopup) {

     $scope.data = {
        'username': '',
        'password': ''
    }

    $scope.showAlert = function(message) {
                  
                   var alertPopup = $ionicPopup.alert({
                     title: 'Error !',
                     template: message
                   });
               }

    
    var fbAuth = firebase.auth();
    
        $scope.register = function(username, password) {

     
         //fbAuth.$createUser({email: username, password: password}).then(function(userData) {
        fbAuth.createUserWithEmailAndPassword($scope.data.username, $scope.data.password).catch(function(error) {
          console.error("ERROR: " + error);
          $scope.error = 'Error registering ';
          //alert(error
            return fbAuth.signInWithEmailAndPassword(username,password);
        }).then(function(authData) {
            $state.go("tabsController.trustmeter");
        }).catch(function(error) {
            console.error("ERROR: " + error);
           $scope.showAlert(error.message);
        });
    }

    



}])
   
.controller('pageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 