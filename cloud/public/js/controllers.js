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
            size: 'lg',
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function(user) {
            console.log("modal is closed. ");
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
    address.id = $scope.currentUser.addressId;
    address.fetch().then(function(address) {
        $scope.currentUser.address = address;
    });

    $scope.updatePassword = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_password',
            controller: 'UpdatePasswordCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'

        });
        modalInstance.result.then(function() {
            console.log("updatePassword(): user's password has been updated");
        });
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
    };

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
    };

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
        },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function() {
            $scope.reloadAddress();
            console.log("addNewAddress(): new address is added");
        });
    };

    $scope.deleteAddress = function(address) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_deleteAddress',
            controller: 'DeleteAddressCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                address: function() {
                    return address;
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function() {
            $scope.reloadAddress();
            console.log("Delete address: success");
        })

    }
});

YundaApp.controller('DeleteAddressCtrl', function($scope, $modalInstance, address) {
    alert("deleting!");
    $scope.confirmDelete = function() {
        address.destroy().then(function(address) {
            $modalInstance.close(address);
        }, function(address, error) {
            alert(error.message);
        });
    };
    $scope.cancelDelete = function() {
        $modalInstance.dismiss();
    }

});

YundaApp.controller('UpdateUserCtrl', function($scope) {
    var address = new YD.Address();

    if($scope.currentUser.addressId != undefined) {
        address.id = $scope.currentUser.addressId;
        address.fetch().then(function(address) {
            $scope.address = address;
        });
    } else {
        $scope.address = new YD.Address();
    }

    $scope.update_user = function() {
        //var address = new YD.Address();
        //address.user = $scope.currentUser;
        //address.country = $scope.country;
        //address.city = $scope.city;
        //address.state = $scope.state;
        //address.suburb = $scope.suburb;
        //address.street1 = $scope.street1;
        //address.street2 = $scope.street2;
        //address.postalCode = $scope.postalCode;
        //$scope.currentUser.address = address;
        //$scope.currentUser.address = $scope.address;
        if($scope.address.id != undefined) {
            $scope.currentUser.addressId = $scope.address.id;
        }
        else {
            var address = new YD.Address();
            address = $scope.address;
            address.recipient = $scope.currentUser.realName;
            address.user = $scope.currentUser;

            address.save(null, {
                success: function(address) {
                    console.log("update_user() save address success");
                    $scope.currentUser.addressId = address.id;
                },
                error: function(address, error) {
                    console.log("update_user() save address fail : " + error.id + error.message);
                }
            });
        }
        //$scope.currentUser.mobilePhoneNumber = '23232323';
        $scope.currentUser.save(null, {
            success: function(user) {
                console.log("update_user() success");
                console.log("update_user() success mobile: " + user.mobilePhoneNumber);

            },
            error: function(user, error) {
                console.log("update_user() fail: " + error.id + error.message);
            }
        });
    };
});

YundaApp.controller('freightInArrivedCtrl', function($scope) {
    $scope.reloadFreightInArrived = function(){
        var query = new AV.Query("FreightIn");
        query.equalTo("user", $scope.currentUser);
        query.equalTo("status", YD.FreightIn.STATUS_ARRIVED);

        query.find({
            success: function(results) {
                //console.log("FreightIn arrived is shown TRACKING: " + results[0].status);
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

        freightIn.status = YD.FreightIn.STATUS_CONFIRMED;
        freightIn.save().then(function(freightIn) {
        console.log("freightInConfirm()-- freightIn.status updated: " + freightIn.status);

        $scope.reloadFreightInArrived();

        }, function(freightIn, error) {
            console.log(error.message);
        });
    }
});

YundaApp.controller('freightInConfirmedCtrl', function($scope, $modal) {
    $scope.reloadFreightInConfirmed = function(){
        var query = new AV.Query("FreightIn");
        query.equalTo("user", $scope.currentUser);
        query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED);
        query.find({
            success: function(results) {
                $scope.freightIns = results;
                for(var i = 0; i < $scope.freightIns.length; i++){
                    $scope.freightIns[i].checkboxModel = {
                        delivery : false,
                        addPackage : false,
                        reduceWeight : false,
                        checkPackage : false,
                        splitPackage : false,
                        splitPackagePremium : false
                    };
                    $scope.freightIns[i].selection = false;
                    $scope.freightIns[i].address = '';

                }
                $scope.getRecipient();
                $scope.$apply();
                console.log("FreightIn confirmed is shown");
                //for(var i = 0; i < $scope.freightIns.length; i++){
                //    console.log("delivery: " + $scope.freightIns[i].checkboxModel.delivery);
                //    console.log("addPackage: " + $scope.freightIns[i].checkboxModel.addPackage);
                //    console.log("reduceWeight: " + $scope.freightIns[i].checkboxModel.reduceWeight);
                //    console.log("checkPackage: " + $scope.freightIns[i].checkboxModel.checkPackage);
                //    console.log("splitPackage: " + $scope.freightIns[i].checkboxModel.splitPackage);
                //    console.log("splitPackagePremium: " + $scope.freightIns[i].checkboxModel.splitPackagePremium);
                //
                //}
            },
            error: function (freightin, error) {
                alert("Getting Freight In Error: " + error.code + " " + error.message);
            }
        });
    };
    $scope.reloadFreightInConfirmed();

    //
    //$scope.getStatusList = function(freightIn) {
    //    var statusList = [];
    //    if(freightIn.checkboxModel.delivery == true)
    //        statusList.push(YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION);
    //
    //    if(freightIn.checkboxModel.addPackage == true)
    //        statusList.push(YD.Freight.STATUS_PENDING_EXTRA_PACKAGING);
    //
    //    if(freightIn.checkboxModel.reduceWeight == true)
    //        statusList.push(YD.Freight.STATUS_PENDING_REDUCE_WEIGHT);
    //
    //    if(freightIn.checkboxModel.checkPackage == true)
    //        statusList.push(YD.Freight.STATUS_PENDING_CHECK_PACKAGE);
    //
    //    if(freightIn.checkboxModel.splitPackage == true)
    //        statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);
    //n
    //    if(freightIn.checkboxModel.splitPackagePremium == true)
    //        statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED);
    //
    //    return statusList;
    //};

    $scope.splitPackage = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_splitPackage',
            controller: 'SplitPackageCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightIn: function() {
                    return freightIn;
                }
            },
            windowClass: 'center-modal'

        });
        modalInstance.result.then(function() {
            //$scope.checkboxModel.splitPackage = true;
            //$scope.checkboxModel.splitPackagePremium = false;
            //freightIn.notes = notes;
            freightIn.status = 999;
            freightIn.save().then(function(){
                //freightIn notes have been saved
            });

            console.log("addNewAddress(): new address is added");
            $scope.reloadFreightInConfirmed();
        });
    };
    $scope.splitPackagePremium = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_splitPackage',
            controller: 'SplitPackagePremiumCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightIn: function() {
                    return freightIn;
                }
            },
            windowClass: 'center-modal'
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
    };

    $scope.getRecipient = function() {
        var query = new AV.Query("Address");
        query.equalTo("user", $scope.currentUser);
        query.find({
            success: function(results) {
                $scope.addressList = results;
                console.log("GetRecipient ADDRESS got : " + results.length);
            },
            error: function (res, error) {
                alert("Getting Recipient: " + error.code + " " + error.message);
            }
        });
    };

    $scope.chooseRecipient = function (freightIn) {
        console.log("address is chosen: " + freightIn.address);
    };

    $scope.generateFreight = function(freightIn){
        var freight = new YD.Freight();
        //freight.address = null;
        freight.freightIn = freightIn;
        //freight.statusGroup = $scope.getStatusList(freightIn);
        if(freightIn.checkboxModel != undefined) {
        if(freightIn.checkboxModel.delivery == true)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION);

        if(freightIn.checkboxModel.addPackage == true)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING);

        if(freightIn.checkboxModel.reduceWeight == true)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_REDUCE_WEIGHT);

        if(freightIn.checkboxModel.checkPackage == true)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_CHECK_PACKAGE);

        if(freightIn.checkboxModel.splitPackage == true)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);

        if(freightIn.checkboxModel.splitPackagePremium == true)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED);
        }
        freight.user = $scope.currentUser;
        freight.weight = freightIn.weight;
        freight.trackingNumber = freightIn.trackingNumber;
        freight.status = 0;
        freight.save(null, {
            success: function(freight) {
                console.log("freight has been saved: " + freight.id);
            },
            error: function(freight, error){
                console.log("ERROR: freight not save: " + error.code + " - " + error.message);
            }
        });
        freightIn.status = 999;
        freightIn.save(null, {
            success: function(freightIn) {
                console.log("freightIn has been saved: " + freightIn.id);
            },
            error: function(freightIn, error){
                console.log("ERROR: freightIn not save: " + error.code + " - " + error.message);
            }
        });
    };

    $scope.generateDeliveryFreight = function(freightIn){
        var freight = new YD.Freight();
        //freight.address = null;
        freight.freightIn = freightIn;
        //freight.statusGroup = $scope.getStatusList(freightIn);
        freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION);

        freight.user = $scope.currentUser;
        freight.weight = freightIn.weight;
        freight.trackingNumber = freightIn.trackingNumber;
        freight.status = 0;
        freight.save(null, {
            success: function(freight) {
                console.log("freight has been saved: " + freight.id);
            },
            error: function(freight, error){
                console.log("ERROR: freight not save: " + error.code + " - " + error.message);
            }
        });
        freightIn.status = 999;
        freightIn.save(null, {
            success: function(freightIn) {
                console.log("freightIn has been saved: " + freightIn.id);
            },
            error: function(freightIn, error){
                console.log("ERROR: freightIn not save: " + error.code + " - " + error.message);
            }
        });
    };

    $scope.generateAllFreight = function() {
        for (var i = 0; i <$scope.freightIns.length; i++){
            if($scope.freightIns[i].selection == true) {
                $scope.generateFreight($scope.freightIns[i]);
                $scope.reloadFreightInConfirmed();
            }
        }
    };
});

    YundaApp.controller('FreightConfirmedCtrl', function($scope) {

        //status to string
        $scope.getStatus = function() {

            for (var i = 0; i < $scope.freights.length; i++) {
                //$scope.freights[i].statusToString = " ";
                var statusList = $scope.freights[i].statusGroup;
                var statusString = ' ';

                if($scope.freights[i].statusGroup != undefined){
                               for(var j = 0; j < statusList.length; j++) {
                    if(statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION){
                        statusString += "Pending Final Confirmation; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " +  statusString);}

                    if(statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING){
                        statusString += "Pending Extra Packaging; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " +  statusString);}

                    if(statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT){
                        statusString += "Pending Reduce Weight; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " +  statusString);}

                    if(statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE){
                        statusString += "Pending Check Packaging; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString);}

                    if(statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE){
                        statusString += "Pending Split Packaging; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " +  statusString);}

                    if(statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED){
                        statusString += "Pending Split Packaging; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " +  statusString);}
                }
                }

                //statusString.substr(0, statusString.length - 22);   //remove trailing comma
                $scope.freights[i].statusToString = statusString;
                console.log("HERE IS STRING LENGTH: " + $scope.freights[i].statusToString.length);
            }

        };

        $scope.reloadFreightConfirmed = function(){
            var query = new AV.Query("Freight");
            query.equalTo("user", $scope.currentUser);
            //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);
            //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED);
            //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_REDUCE_WEIGHT);
            //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING);
            //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_CHECK_PACKAGE);
            //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION);
            query.equalTo("status", 0);
            query.find({
                success: function(results) {
                    $scope.freights = results;

                    //get ready for payment selection checkboxes.
                    for(var i = 0; i<$scope.freights.length; i++) {
                        $scope.freights[i].selection = false;
                    }
                    $scope.getStatus();
                    $scope.$apply();
                    console.log("Freight confirmed is shown, length: " + $scope.freights.length);
                    console.log("Freight confirmed is shown, weight: " + $scope.freights.weight);


                },
                error: function (error) {
                    alert("Getting Freight Error: " + error.code + " " + error.message);
                }
            });
        };

        $scope.reloadFreightConfirmed();

        $scope.payment = function() {
            //1. check $scope.freights[i].selection and add all the values.
            //
            //2. change all freights' status to 500
            var paymentList = [];
            for (var i = 0; i <$scope.freights.length; i++){
                if($scope.freights[i].selection == true) {
                    paymentList.push($scope.freights[i]);
                    $scope.freights[i].status = YD.Freight.STATUS_PENDING_DELIVERY;
                }
            }
            AV.Object.saveAll(paymentList, {
                success: function(list) {
                    console.log("confirmSplit: freightList has been saved");
                },
                error: function(freights, error){
                    console.log("ERROR: confirmSplit: freightList has not been saved" + error.id + " - " + error.message);
                }
            });
        }
    });

    YundaApp.controller('FreightDeliveryCtrl',function($scope) {
        $scope.reloadFreight = function(){
            var query = new AV.Query("Freight");
            query.equalTo("user", $scope.currentUser);
            query.containedIn("status",
                [YD.Freight.STATUS_PENDING_DELIVERY, YD.Freight.STATUS_DELIVERING, YD.Freight.STATUS_PASSING_CUSTOM, YD.Freight.STATUS_FINAL_DELIVERY, YD.Freight.STATUS_DELIVERED]);
            query.find({
                success: function(results) {
                    $scope.freights = results;
                    console.log("Freight DELIVERY confirmed is shown, length: " + results.length);
                    var statusToString = "";
                    for(var i = 0; i< $scope.freights.length; i++) {
                        //console.log("In for loop, status is: " + statusToString);

                        if($scope.freights[i].status == YD.Freight.STATUS_PENDING_DELIVERY)
                           statusToString = "Pending Delivery";
                            //console.log("statusToSTring: " + statusToString);

                        else if($scope.freights[i].status == YD.Freight.STATUS_DELIVERING)
                            statusToString = "Delivery";
                        else if($scope.freights[i].status == Freight.STATUS_PASSING_CUSTOM)
                            statusToString = "Passing Custom";
                        else if($scope.freights[i].status == YD.Freight.STATUS_FINAL_DELIVERY)
                            statusToString = "Final delivery";
                        else if($scope.freights[i].status == YD.Freight.STATUS_DELIVERED)
                            statusToString = "Delivered";
                        else {}
                        $scope.freights[i].statusToString = statusToString;
                        //console.log("statusToSTring: " + $scope.freights[i].statusToString);
                    }
                    $scope.$apply();
                    console.log("Freight delivery confirmed is shown");

                },
                error: function (list, error) {
                    alert("ERROR: Getting Freight delivery: " + error.code + " " + error.message);
                }
            });
        };
        $scope.reloadFreight();


    });
/* Edit address controller */

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
    YundaApp.controller('SplitPackageCtrl', function($scope, $modalInstance, freightIn) {
        $scope.notes;
        $scope.amount = 0;
        $scope.freightList = [];
        $scope.generateFreightList = function() {
            console.log("changed to: " + $scope.amount);
            $scope.freightList = [];
            for(var i = 0; i<$scope.amount; i++) {
                $scope.freightList[i] = new YD.Freight();
                $scope.freightList[i].freightIn = freightIn;
                $scope.freightList[i].status = 0;
                var statusList = [];
                statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);
                $scope.freightList[i].statusGroup = statusList;

                $scope.freightList[i].user = freightIn.user;
            }
        };

        $scope.confirmSplit = function() {
            AV.Object.saveAll($scope.freightList, {
                success: function(list) {
                    console.log("confirmSplit: freightList has been saved");
                },
                error: function(error){
                    console.log("ERROR: confirmSplit: freightList has not been saved");
                }
            });
            $modalInstance.close();
        };
    });

    YundaApp.controller('SplitPackagePremiumCtrl', function($scope, $modalInstance) {
        $scope.notes;
        $scope.amount = 0;
        $scope.freightList = [];
        $scope.generateFreightList = function() {
            console.log("changed to: " + $scope.amount);
            $scope.freightList = [];
            for(var i = 0; i<$scope.amount; i++) {
                $scope.freightList[i] = new YD.Freight();
                $scope.freightList[i].freightIn = freightIn;
                $scope.freightList[i].status = 0;
                var statusList = [];
                statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);
                $scope.freightList[i].user = freigntIn.user;
            }
        };
        $scope.confirmSplit = function() {
            AV.Object.saveAll($scope.freightList, {
                success: function(list) {
                    console.log("confirmSplit: freightList has been saved");
                },
                error: function(error){
                    console.log("ERROR: confirmSplit: freightList has not been saved");

                }
            });
            $modalInstance.close();
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