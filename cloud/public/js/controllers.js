'use strict';

/* Controllers */

YundaApp.controller('AppCtrl', function ($scope, $http) {

    $http({
        method: 'GET',
        url: '/api/name'
    }).
        success(function (data, status, headers, config) {
            $scope.name = data.name;
        }).
        error(function (data, status, headers, config) {
            $scope.name = 'Error!';
        });

});


/* Navbar Controller*/

YundaApp.controller('NavbarCtrl', function($scope, $rootScope, $modal) {
    $scope.navTest = "about";

    if (YD.User.current() != undefined){
        $rootScope.currentUser = YD.User.current();
    } else {
        $rootScope.currentUser = new YD.User();
    }
    $scope.open = function (){
        console.log("Nabar Ctrl login():");
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_login',
            controller: 'LoginCtrl',
            scope: $scope,
            size: 'lg'
        });
        modalInstance.result.then(function(user) {
            console.log("modal is closed. result: " + callback);
            if(user != undefined) {
                $rootScope.currentUser = user;
            } else {
                console.log("modal user undefied");
            }
        });
    };
    $scope.logOut = function() {
        YD.User.logOut();
        // Do stuff after successful login.
        $rootScope.currentUser = new YD.User();
    }
});


/* Login Controller*/
YundaApp.controller('LoginCtrl', function($scope, $modalInstance) {
    $scope.login = function () {
        YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
            success: function(user) {
                $modalInstance.close(user);
            }
        });
    };

    $scope.signup = function () {
        $modalInstance.dismiss('cancel');
        $scope.currentUser.set("email", $scope.currentUser.username);
        $scope.currentUser.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.
                $scope.isLoading = false;
                $modalInstance.close(user);
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                $scope.isLoading = false;
                alert("Sign up failed " + error.message);
            }
        });
    };
    $scope.resetPassword = function() {
        $scope.promote = "Requesting password";
        AV.User.requestPasswordReset($scope.currentUser.username, {
            success: function() {
                $modalInstance.close();
            },
            error: function(error) {
                alert("Reset failed " + error.message);
            }
        });
    }
});

/* Dashboard Controller*/
YundaApp.controller('DashboardCtrl', function($scope) {
   $scope.oneAtATime = true;
    $scope.view_tab = "aa";
    $scope.change_tab = function(tab){
        $scope.view_tab = tab;
    };

    /* getting user's address */
    var address = new YD.Address();
    address.objectId = $scope.currentUser.addressId;
    address.fetch().then(function(address) {
        $scope.currentUser.address = address;
    });
    $scope.updateUser = function() {

    }
    /* getting recipient */
    var query = new AV.Query("YD.Address");
    query.equalTo("user", $scope.currentUser);
    if (YD.User.current() != undefined) {
        query.find({
            success: function (results) {
                $scope.currentUser.recipientAddresses = results;
            },
            error: function (error) {
                alert("Getting Recipient Addresses Error: " + error.code + " " + error.message);
            }
        });
    }
    /* search recipients */
    $scope.searchRecipient = function(){
    $scope.recipientLookup = "";
    var lookupList = new Array();
    for(var i=0; i<$scope.currentUser.recipientAddresses.length; i++) {
        if($scope.currentUser.recipientAddresses[i].recipient === $scope.recipientLookup){
            lookupList.push($scope.currentUser.recipientAddresses[i]);
        }
    }
        $scope.lookupList = lookupList;
    }

    /* add a new recipient */
    $scope.addNewAddress = function (){
        console.log("dashboard Ctrl login():");
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_login',
            controller: 'AddAddressCtrl',
            scope: $scope,
            size: 'sm'
        });
        modalInstance.result.then(function(address) {
            console.log("address modal is closed. result: " + address);
            address.save(null, {
                success: function(address) {
                    // The save was successful.
                    console.log("address is saved. address id: " + address.objectId);

                },
                error: function(address, error) {
                    // The save failed.  Error is an instance of AV.Error.
                    "Saving Addresses Error: " + error.code + " " + error.message
                }
            });
        });
    };
});

/* add address contrller */

    YundaApp.controller('AddAddressCtrl', function($scope, $modalInstance){

        $scope.addNewAddressSubmit = function (){
            var newAddress = new YD.Address();
            newAddress.country = $scope.country;
            newAddress.city = $scope.city;
            newAddress.state = $scope.state;
            newAddress.suburb = $scope.suburb;
            newAddress.street1 = $scope.street1;
            newAddress.street2 = $scope.street2;
            newAddress.postalCode = $scope.postalCode;
            newAddress.recipient = $scope.recipient;
            newAddress.user = $scope.currentUser;
            modalInstance.close(newAddress);
        }
    });



// AngularJS Google Maps loader

YundaApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

YundaApp.controller('ContactController', function($scope, uiGmapGoogleMapApi) {
    $scope.map = { center: { latitude: -33.8764458, longitude: 151.2047273}, zoom: 17};

    $scope.marker = {
        id: 0,
        coords: {
            latitude: -33.8764458,
            longitude: 151.2047273
        }
    };
    uiGmapGoogleMapApi.then(function(maps) {

    });
});