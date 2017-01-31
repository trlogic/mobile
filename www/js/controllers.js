angular.module('app.controllers', [])
  
.controller('uploadCtrl', ['$scope','$cordovaCamera',  '$stateParams', '$ionicHistory', '$firebaseArray', '$http','$ionicPopup',
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $cordovaCamera, $stateParams,  $ionicHistory, $firebaseArray, $http,$ionicPopup) {

   var fb = firebase.database();
    
   // $ionicHistory.clearHistory();
    
    var fbAuth = firebase.auth();
    
     $scope.showAlert = function(message) {
                  
                   var alertPopup = $ionicPopup.alert({
                     title: 'Message',
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

    var api_key = 'AIzaSyDIcCzFDoWB_JoZ6i0eYb6GR1UFR7seYB4';

     
            $scope.takePicture = function(){

            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                targetWidth: 500,
                targetHeight: 500,
                correctOrientation: true,
                cameraDirection: 0,
                encodingType: Camera.EncodingType.JPEG
            };

             var faceImage = false;
             var personImage = false;


        $cordovaCamera.getPicture(options).then(function(imagedata){

         //alert($scope.detection_type);

          var vision_api_json =  {
                "requests": [
                  { 
                  "image": {
                      
                      "content":  imagedata,
                      
                     } 
                    ,
                  "features": [
                      {
                        "type": "LABEL_DETECTION",
                        "maxResults":10
                      }
                    ]
                  }
                ]
              };

                  var server = 'https://vision.googleapis.com/v1/images:annotate?key=' + api_key;
              //  var file_contents = JSON.stringify(vision_api_json);

                              //alert(JSON.stringify(vision_api_json));

                                        $http({
                                  method: 'POST',//GET-POST
                                  url: server,
                                  data: vision_api_json,
                                  dataType: 'json',
                                  headers: {
                                     "Content-Type": "application/json"
                                 }
                          }).success(function (data) {//Success handling
                              //alert(data);
                              //alert(JSON.stringify(data.responses));
                              
                    for ( var i=0 ; i < data.responses[0].labelAnnotations.length; i++) {
                        
                                    console.log(data.responses[0].labelAnnotations[i].description);
                                    //alert(data.responses[0].labelAnnotations[i].description);
                                     
                                     if (data.responses[0].labelAnnotations[i].description == 'face' && data.responses[0].labelAnnotations[i].score >= 0.9 ){
                                      
                                   //   alert('faceImage = true');
                                      faceImage=true;

                                     } 

                                     if (data.responses[0].labelAnnotations[i].description == 'person' && data.responses[0].labelAnnotations[i].score >= 0.9){
                                      
                                      //alert('personImage = true');

                                      personImage=true;

                                     }    
                      }
                          


                                        //alert(personImage);
                                        //alert(faceImage);
                                        
                                        if ( personImage==true && faceImage==true ) {

                                              userReference.set({
                                                image: imagedata,
                                                trustpoint: 0
                                              }).then(function() {
                                                $scope.showAlert('Image has been uploaded');
                                            });
                                        //, function(error) {
                                          //  console.error(error);
                                          //};    

                                           //$scope.data.current_image = "data:image/jpeg;base64," + imagedata;
                                           $scope.data.image_description = '';
                                           $scope.data.locale = '';

                                       }  

                                       else {

                                            $scope.showAlert('PLease upload a real person face image !!');

                                       }


                              //alert(data.responses[0].labelAnnotations[0].description);
                              //var res = JSON.parse(data.responses[0].labelAnnotations[0]);
    
                              //var key = $scope.detection_types[$scope.detection_type] + 'Annotations';
                              //$scope.image_description = res.responses[0][key][0].description; 
                               
                          }).error(function (data, status) {//Error handling
                                
                                //alert(data);
                                 $scope.showAlert('Error while saving picture!!');

                            });
           
       });
    }



}])
   
.controller('trustmeterCtrl', ['$scope', '$stateParams', '$ionicHistory', '$firebaseArray','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicHistory,$firebaseArray,$ionicPopup) {
 var fb = firebase.database();
    
   // $ionicHistory.clearHistory();
   // $scope.images = [];
    
   $scope.showAlert = function(message) {
                  
                   var alertPopup = $ionicPopup.alert({
                     title: 'Message',
                     template: message
                   });
               }

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
          
       $scope.trustOrNot = function(user,trust){

        //alert(user.$id);

        var newPoint ;

        var mes = '';

        if (trust) {
          newPoint = user.trustpoint + 10 ;
          mes = 'You Trusted this guy, Good LUCK !'
        }

        else {

          newPoint = user.trustpoint - 10 ;
          mes = 'You did not trust this guy, BAD LUCK !'
        }
         

        // alert(newPoint);

        var trustReference = fb.ref("users/" + user.$id  );

          trustReference.once('value', function(snapshot) {

              //snapshot.val = snapshot.val + 10 ;

               if( snapshot.val() === null ) {
        
        /* does not exist */
     } else {

        var snapRef = snapshot.ref;

                snapRef.update({
                  trustpoint: newPoint
                });
          
               $scope.showAlert(mes);
                
    }
 
              
          });

       }
    
        
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
   
.controller('pointtableCtrl', ['$scope', '$stateParams','$ionicHistory', '$firebaseArray','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicHistory,$firebaseArray,$ionicPopup) {
 var fb = firebase.database();
    
   // $ionicHistory.clearHistory();
   // $scope.images = [];
    
   $scope.showAlert = function(message) {
                  
                   var alertPopup = $ionicPopup.alert({
                     title: 'Message',
                     template: message
                   });
               }

    var fbAuth = firebase.auth();

    if(fbAuth) {

        var userReference = fb.ref(
          "users/").orderByChild('trustpoint').limitToLast(10);


        
        
       // var imageReference = fb.ref("users/" + fbAuth.currentUser.uid + "/image");
         // imageReference.on('value', function(snapshot) {
           // alert('Snapshot.val:' + snapshot.val());

        //updateStarCount(postElement, snapshot.val());
            //$scope.picture = snapshot.val();

            //alert('Picture:' + $scope.picture);

      $scope.items = $firebaseArray(userReference);
}

}])



.controller('nopointtableCtrl', ['$scope', '$stateParams','$ionicHistory', '$firebaseArray','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicHistory,$firebaseArray,$ionicPopup) {
 var fb = firebase.database();
    
   // $ionicHistory.clearHistory();
   // $scope.images = [];
    
   $scope.showAlert = function(message) {
                  
                   var alertPopup = $ionicPopup.alert({
                     title: 'Message',
                     template: message
                   });
               }

    var fbAuth = firebase.auth();

    if(fbAuth) {

        var userReference = fb.ref(
          "users/").orderByChild('trustpoint').limitToFirst(10);


       // var imageReference = fb.ref("users/" + fbAuth.currentUser.uid + "/image");
         // imageReference.on('value', function(snapshot) {
           // alert('Snapshot.val:' + snapshot.val());

        //updateStarCount(postElement, snapshot.val());
            //$scope.picture = snapshot.val();

            //alert('Picture:' + $scope.picture);

      $scope.items = $firebaseArray(userReference);

}

}])

