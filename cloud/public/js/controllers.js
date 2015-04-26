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
YundaApp.controller('DashboardCtrl', function($scope, $modal) {
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

    $scope.updatePassword = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_password',
            controller: 'UpdatePasswordCtrl',
            scope: $scope,
            size: 'lg'

        });
        modalInstance.result.then(function() {
            console.log("updatePassword(): user's password has been updated");
        });
    }

    $scope.updateUser = function() {

    }


    /* getting recipient */
    $scope.reloadAddress = function() {
        var query = new AV.Query("Address");
         query.equalTo("user", $scope.currentUser);
         if (YD.User.current() != undefined) {
            query.find({
            success: function (results) {
                $scope.recipientAddresses = results;
                $scope.$apply();
                console.log("address list has been reloaded");
            },
            error: function (error) {
                alert("Getting Recipient Addresses Error: " + error.code + " " + error.message);
            }
        });
    }
    }
    $scope.reloadAddress();
    /* search recipients */
    $scope.searchRecipient = function(){

        var query = new AV.Query("Address");
        query.equalTo("user", $scope.currentUser);
        query.equalTo("recipient", $scope.recipientLookup);
        if (YD.User.current() != undefined) {
            query.find({
                success: function (results) {
                    $scope.recipientAddresses = results;
                    $scope.$apply();
                    console.log("address list has been reloaded");
                },
                error: function (error) {
                    alert("Getting Recipient Addresses Error: " + error.code + " " + error.message);
                }
            });
        }
    }

    /* add a new recipient */
    $scope.addNewAddress = function() {
        var address = new YD.Address();
        if($scope.currentUser != undefined) {
            address.user = $scope.currentUser;
            $scope.editAddress(address);
        }
        else {
            console.log("addNewAddress(): currentUser is not defined");
        }
    }

    $scope.editAddress = function(address) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_address',
            controller: 'EditAddressCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
            address: function() {
                return address;
            }
        }
        });
        modalInstance.result.then(function() {
            $scope.reloadAddress();
            console.log("addNewAddress(): new address is added");
        });
    }

    $scope.deleteAddress = function(address) {
        alert("deleting!");
        address.destroy().then(function(address) {
            $scope.reloadAddress();

        }, function(error) {
            alert(error.message);
        });
    }
});

YundaApp.controller('freightInArrivedCtrl', function($scope) {
    $scope.reloadFreightInArrived = function(){
        var query = new AV.Query("FreightIn");

        query.equalTo("user", $scope.currentUser);
        query.equalTo("statusGroup", YD.FreightIn.STATUS_ARRIVED);
        query.find({
            success: function(results) {
                $scope.freightIns = results;
                $scope.$apply();
                console.log("FreightIn arrived is shown");
            },
            error: function (error) {
                alert("Getting Freight In Error: " + error.code + " " + error.message);
            }
        });
    };
    $scope.reloadFreightInArrived();
    $scope.freightInConfirm = function(freightIn) {
        freightIn.statusGroup.pop(); //get rid of status 200
        freightIn.statusGroup.push(YD.Freight.STATUS_CONFIRMED);
        freightIn.save().then(function(freightIn) {
            $scope.reloadFreightInArrived();
        })
    }
});

YundaApp.controller('freightInConfirmedCtrl', function($scope, $modal) {
    $scope.reloadFreightInConfirmed = function(){
        var query = new AV.Query("FreightIn");

        query.equalTo("user", $scope.currentUser);
        query.equalTo(status, YD.FreightIn.STATUS_ARRIVED);
        query.find({
            success: function(results) {
                $scope.freightIns = results;
                $scope.$apply();
                console.log("FreightIn confirmed is shown");

            },
            error: function (error) {
                alert("Getting Freight In Error: " + error.code + " " + error.message);
            }
        });
    };
    $scope.reloadFreightInConfirmed();

    $scope.checkboxModel = {
        delivery : false,
        addPackage : false,
        reduceWeight : false,
        checkPackage : false,
        splitPackage : false,
        splitPackagePremium : false
    };
    $scope.getStatusList = function() {
        var statusList = [];
        if($scope.checkboxModel.delivery == true)
            statusList.push(YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION);

        if($scope.checkboxModel.addPackage == true)
            statusList.push(YD.Freight.STATUS_PENDING_EXTRA_PACKAGING);

        if($scope.checkboxModel.reduceWeight == true)
            statusList.push(YD.Freight.STATUS_PENDING_REDUCE_WEIGHT);

        if($scope.checkboxModel.checkPackage == true)
            statusList.push(YD.Freight.STATUS_PENDING_CHECK_PACKAGE);

        if($scope.checkboxModel.splitPackage == true)
            statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);

        if($scope.checkboxModel.splitPackagePremium == true)
            statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED);

        return statusList;
    };

    $scope.splitPackage = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_splitPackage',
            controller: 'SplitPackageCtrl',
            scope: $scope,
            size: 'sm'
        });
        modalInstance.result.then(function(notes) {
            $scope.checkboxModel.splitPackage = true;
            $scope.checkboxModel.splitPackagePremium = false;
            freightIn.notes = notes;
            freightIn.save().then(function(){
                //freightIn notes have been saved
            });

            console.log("addNewAddress(): new address is added");
        });
    };
    $scope.splitPackagePremium = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_splitPackagePremium',
            controller: 'SplitPackage',
            scope: $scope,
            size: 'sm'
        });
        modalInstance.result.then(function(notes) {
            console.log("addNewAddress(): new address is added");
            $scope.checkboxModel.splitPackagePremium = true;
            $scope.checkboxModel.splitPackage = false;
            freightIn.notes = notes;
            freightIn.save().then(function(){
                //freightIn notes have been saved
            });
        });
    }

    $scope.generateFreight = function(freightIn){
        var freight = new YD.Freight();
        freight.address = null;
        freight.freightIn = freightIn;
        freight.statusGroup = $scope.getStatusList();
        freight.user = $scope.currentUser;
        freight.weight = freightIn.weight;

        freight.save().then(function(freight) {
            console.log("Freight is saved");
        });
    };

});

    YundaApp.controller('FreightConfirmedCtrl', function($scope) {
        $scope.reloadFreightConfirmed = function(){
            var query = new AV.Query("Freight");
            query.equalTo("user", $scope.currentUser);
            query.containsAll("statusGroup", [200, 210, 220, 230, 240, 300]);
            query.find({
                success: function(results) {
                    $scope.freights = results;
                    $scope.$apply();
                    console.log("Freight confirmed is shown");

                },
                error: function (error) {
                    alert("Getting Freight Error: " + error.code + " " + error.message);
                }
            });
        };
        $scope.reloadFreightConfirmed();

    });
/* Edit address contrller */

    YundaApp.controller('EditAddressCtrl', function($scope, $modalInstance, address){

        $scope.address = address;
        $scope.saveAddressSubmit = function() {
            $scope.address.save().then(function(address) {
                $modalInstance.close(address);
            }, function(error) {
                alert(error.message);
            });
        }
    });
    YundaApp.controller('SplitPackageCtrl', function($scope, $modalInstance) {
        $scope.notes;
        $scope.confirmSplit = function() {
            $modalInstance.close($scope.notes);
        };
    });

    YundaApp.controller('SplitPackagePremiumCtrl', function($scope, $modalInstance) {
        $scope.notes;
        $scope.confirmSplit = function() {
            $modalInstance.close($scope.notes);
        };
    });
/* update password*/
    YundaApp.controller('UpdatePasswordCtrl', function ($scope, $modalInstance) {
        $scope.savePassword = function() {
            $scope.currentUser.password = $scope.newPassword;
            $scope.currentUser.save().then(function(user) {
                $modalInstance.close(user);
            })
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