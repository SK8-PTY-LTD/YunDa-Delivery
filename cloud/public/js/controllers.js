'use strict';

/* Controllers */

YundaApp.controller('AppCtrl', function ($scope, $rootScope, $http) {

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
//Stripe

});

/* Navbar Controller*/

YundaApp.controller('NavbarCtrl', function ($scope, $rootScope, $modal, $window) {

    if (YD.User.current() != undefined) {
        $rootScope.currentUser = YD.User.current();
    } else {
        $rootScope.currentUser = new YD.User();
    }
    $scope.open = function () {
        console.log("Nabar Ctrl login():");
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_login',
            controller: 'LoginCtrl',
            scope: $scope,
            size: 'lg',
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function (user) {
            //console.log("modal is closed. ");
            if (user != undefined) {
                $rootScope.currentUser = user;
            } else {
                //console.log("modal user undefined");
            }
        });
    };
    $scope.logOut = function () {
        YD.User.logOut();
        // Do stuff after successful login.
        $rootScope.currentUser = new YD.User();
        $window.location.href = '/';
    };

    $scope.isActive = function() {
        return true;
        //if($scope.currentUser != undefined){
        //    return true;
        //} else return false;
    }
});


/* Login Controller*/
YundaApp.controller('LoginCtrl', function ($scope, $modalInstance) {
    $scope.login = function () {
        YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
            success: function (user) {
                $modalInstance.close(user);
            },
            error: function(user, error) {
                alert('登陆失败, ' + error.message);
            }
        });
    };

    $scope.signup = function () {
        $modalInstance.dismiss('cancel');
        $scope.currentUser.set("email", $scope.currentUser.username);
        $scope.currentUser.signUp(null, {
            success: function (user) {
                // Hooray! Let them use the app now.
                $scope.isLoading = false;
                $modalInstance.close(user);
            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                $scope.isLoading = false;
                alert("Sign up failed " + error.message);
            }
        });
    };
    $scope.resetPassword = function () {
        $scope.promote = "Requesting password";
        AV.User.requestPasswordReset($scope.currentUser.username, {
            success: function () {
                $modalInstance.close();
            },
            error: function (error) {
                alert("Reset failed " + error.message);
            }
        });
    }
});

YundaApp.controller('HomeCtrl', function ($rootScope, $scope, $modal){
    $scope.trackingList = [];
    $scope.trackingInfo = function() {
       var modalInstance = $modal.open({
           templateUrl: 'partials/modal_tracking',
           controller: 'TrackingCtrl',
           scope: $scope,
           size: 'sm',
           resolve: {
               trackingList: function () {
                   return trackingList;
               }
           },
           windowClass: 'center-modal'
       });
   };
    $scope.login = function () {
        console.log("username: " + $scope.currentUser.username);
        YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
            success: function (user) {
                $rootScope.currentUser = user;
                $scope.$apply();
                console.log("successfuly login via main page login");
            },
            error: function(user, error) {
                alert('登陆失败, ' + error.message);
            }
        });
    };

    $scope.signup = function () {
        $scope.currentUser.set("email", $scope.currentUser.username);
        $scope.currentUser.signUp(null, {
            success: function (user) {
                // Hooray! Let them use the app now.
                $scope.isLoading = false;
            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                $scope.isLoading = false;
                alert("Sign up failed " + error.message);
            }
        });
    };
    $scope.resetPassword = function () {
        $scope.promote = "Requesting password";
        AV.User.requestPasswordReset($scope.currentUser.username, {
            success: function () {
            },
            error: function (error) {
                alert("Reset failed " + error.message);
            }
        });
    };
    $scope.newsList = [];
    $scope.newsList[0] = {
        title: "news 1"
    };
    $scope.newsList[1] = {
        title: "news 2"
    };
});

YundaApp.controller('CarouseCtrl', function ($scope) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/300',
            text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    for (var i=0; i<4; i++) {
        $scope.addSlide();
    }
});

/* Dashboard Controller*/
YundaApp.controller('DashboardCtrl', function ($scope, $modal) {
    $scope.oneAtATime = true;
    $scope.view_tab = "aa";
    $scope.change_tab = function (tab) {
        $scope.view_tab = tab;
    };

    /* getting user's address */
    var address = new YD.Address();
    address.id = $scope.currentUser.addressId;
    address.fetch().then(function (address) {
        $scope.currentUser.address = address;
    });

    $scope.updatePassword = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_password',
            controller: 'UpdatePasswordCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'

        });
        modalInstance.result.then(function () {
            console.log("updatePassword(): user's password has been updated");
        });
    };


    /* getting recipient */
    $scope.reloadAddress = function () {
        if($scope.currentUser.id != undefined){
            console.log("reloadAddress: ADDRESS");

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
    };
    $scope.reloadAddress();
    /* search recipients */
    $scope.searchRecipient = function () {

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
    $scope.addNewAddress = function () {
        var address = new YD.Address();
        if ($scope.currentUser.id != undefined) {
            address.user = $scope.currentUser;
            $scope.editAddress(address);
        }
        else {
            console.log("addNewAddress(): currentUser is not defined");
        }
    };

    $scope.editAddress = function (address) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_address',
            controller: 'EditAddressCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                address: function () {
                    return address;
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            $scope.reloadAddress();
            console.log("addNewAddress(): new address is added");
        });
    };

    $scope.deleteAddress = function (address) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_deleteAddress',
            controller: 'DeleteAddressCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                address: function () {
                    return address;
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            $scope.reloadAddress();
            console.log("Delete address: success");
        })

    };

    $scope.getRecipient = function () {

        var query = new AV.Query("Address");
        query.equalTo("user", $scope.currentUser);
        query.find({
            success: function (results) {
                $scope.addressList = results;
                //console.log("GetRecipient ADDRESS got : " + results.length);
            },
            error: function (res, error) {
                alert("Getting Recipient: " + error.code + " " + error.message);
            }
        });
    };
});

YundaApp.controller('DeleteAddressCtrl', function ($scope, $modalInstance, address) {
    alert("deleting!");
    $scope.confirmDelete = function () {
        address.destroy().then(function (address) {
            $modalInstance.close(address);
        }, function (address, error) {
            alert(error.message);
        });
    };
    $scope.cancelDelete = function () {
        $modalInstance.dismiss();
    }

});

YundaApp.controller('UpdateUserCtrl', function ($scope) {
    var address = new YD.Address();

    if ($scope.currentUser.addressId != undefined) {
        address.id = $scope.currentUser.addressId;
        address.fetch().then(function (address) {
            $scope.address = address;
        });
    } else {
        $scope.address = new YD.Address();
    }

    $scope.update_user = function () {
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
        if ($scope.address.id != undefined) {
            $scope.currentUser.addressId = $scope.address.id;
        }
        else {
            var address = new YD.Address();
            address = $scope.address;
            address.recipient = $scope.currentUser.realName;
            address.user = $scope.currentUser;

            address.save(null, {
                success: function (address) {
                    console.log("update_user() save address success");
                    $scope.currentUser.addressId = address.id;
                },
                error: function (address, error) {
                    console.log("update_user() save address fail : " + error.id + error.message);
                }
            });
        }
        //$scope.currentUser.mobilePhoneNumber = '23232323';
        $scope.currentUser.save(null, {
            success: function (user) {
                console.log("update_user() success");
                console.log("update_user() success mobile: " + user.mobilePhoneNumber);

            },
            error: function (user, error) {
                console.log("update_user() fail: " + error.id + error.message);
            }
        });
    };
});

YundaApp.controller('freightInArrivedCtrl', function ($scope) {
    $scope.reloadFreightInArrived = function () {
        if($scope.currentUser.id != undefined){
        var query = new AV.Query("FreightIn");
        query.equalTo("user", $scope.currentUser);
        query.equalTo("status", YD.FreightIn.STATUS_ARRIVED);

        query.find({
            success: function (results) {
                //console.log("FreightIn arrived is shown TRACKING: " + results[0].status);
                $scope.freightIns = results;
                $scope.$apply();
                console.log("FreightIn arrived is shown");
            },
            error: function (error) {
                alert("Getting Freight In Error: " + error.code + " " + error.message);
            }
        });}
    };
    $scope.reloadFreightInArrived();
    $scope.freightInConfirm = function (freightIn) {
        if($scope.currentUser.id != undefined){
        freightIn.status = YD.FreightIn.STATUS_CONFIRMED;
        freightIn.save().then(function (freightIn) {
            console.log("freightInConfirm()-- freightIn.status updated: " + freightIn.status);

            $scope.reloadFreightInArrived();

        }, function (freightIn, error) {
            console.log(error.message);
        });
    }};
});

YundaApp.controller('freightInConfirmedCtrl', function ($scope, $modal) {
    $scope.PRICE = 10;
    $scope.reloadFreightInConfirmed = function () {
        if($scope.currentUser.id != undefined){
        var query = new AV.Query("FreightIn");
        query.equalTo("user", $scope.currentUser);
        query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED);
        query.find({
            success: function (results) {
                $scope.freightIns = results;
                for (var i = 0; i < $scope.freightIns.length; i++) {
                    $scope.freightIns[i].checkboxModel = {
                        delivery: false,
                        addPackage: false,
                        reduceWeight: false,
                        checkPackage: false,
                        splitPackage: false,
                        splitPackagePremium: false
                    };
                    $scope.freightIns[i].selection = false;
                    $scope.freightIns[i].estimatePrice = $scope.freightIns[i].weight * $scope.PRICE;
                    //$scope.freightIns[i].address = ' ';
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
            error: function ( error) {
                alert("Getting Freight In Error: " + error.id + " " + error.message);
            }
        });}
    };
    $scope.reloadFreightInConfirmed();


    $scope.splitPackage = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_splitPackage',
            controller: 'SplitPackageCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightIn: function () {
                    return freightIn;
                }
            },
            windowClass: 'center-modal'

        });
        modalInstance.result.then(function () {
            //$scope.checkboxModel.splitPackage = true;
            //$scope.checkboxModel.splitPackagePremium = false;
            //freightIn.notes = notes;
            freightIn.status = YD.FreightIn.STATUS_FINISHED;
            freightIn.save().then(function () {
                //freightIn notes have been saved
            });

            console.log("addNewAddress(): new address is added");
            $scope.reloadFreightInConfirmed();
        });
    };
    $scope.splitPackagePremium = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_splitPackage',
            controller: 'SplitPackagePremiumCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightIn: function () {
                    return freightIn;
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function (notes) {
            console.log("addNewAddress(): new address is added");
            $scope.checkboxModel.splitPackagePremium = true;
            $scope.checkboxModel.splitPackage = false;
            freightIn.notes = notes;
            freightIn.save().then(function () {
                //freightIn notes have been saved
            });
        });
    };


    $scope.chooseRecipient = function (freightIn, address) {
        console.log("address is chosen, address: " + address.id);
        console.log("address is chosen, freightIn: " + freightIn.id);
        //console.log("address is chosen: " + $scope.freightIns[index].address);
        freightIn.address = address;
    };

    $scope.generateFreight = function (freightIn) {
        if (freightIn.address == undefined) {
            alert("Choose address first");
        } else {
            var freight = new YD.Freight();
            //freight.address = null;
            freight.freightIn = freightIn;
            freight.address = freightIn.address;
            //freight.statusGroup = $scope.getStatusList(freightIn);
            if (freightIn.checkboxModel != undefined) {
                if (freightIn.checkboxModel.delivery == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION);

                if (freightIn.checkboxModel.addPackage == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING);

                if (freightIn.checkboxModel.reduceWeight == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_REDUCE_WEIGHT);

                if (freightIn.checkboxModel.checkPackage == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_CHECK_PACKAGE);

                if (freightIn.checkboxModel.splitPackage == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);

                if (freightIn.checkboxModel.splitPackagePremium == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED);
            }
            freight.user = $scope.currentUser;
            freight.weight = freightIn.weight;
            freight.trackingNumber = freightIn.trackingNumber;
            freight.status = 0;
            freight.save(null, {
                success: function (freight) {
                    console.log("freight has been saved: " + freight.id);
                },
                error: function (freight, error) {
                    console.log("ERROR: freight not save: " + error.code + " - " + error.message);
                }
            });
            freightIn.status = YD.FreightIn.STATUS_FINISHED;
            freightIn.save(null, {
                success: function (freightIn) {
                    console.log("freightIn has been saved: " + freightIn.id);
                },
                error: function (freightIn, error) {
                    console.log("ERROR: freightIn not save: " + error.code + " - " + error.message);
                }
            });
            $scope.reloadFreightInConfirmed();

        }
    };

    $scope.generateDeliveryFreight = function (freightIn) {
        if (freightIn.address == undefined) {
            alert("Choose address first");
        } else {
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
                success: function (freight) {
                    console.log("freight has been saved: " + freight.id);
                },
                error: function (freight, error) {
                    console.log("ERROR: freight not save: " + error.code + " - " + error.message);
                }
            });
            freightIn.status = YD.FreightIn.STATUS_FINISHED;
            freightIn.save(null, {
                success: function (freightIn) {
                    console.log("freightIn has been saved: " + freightIn.id);
                },
                error: function (freightIn, error) {
                    console.log("ERROR: freightIn not save: " + error.code + " - " + error.message);
                }
            });
        }
        $scope.reloadFreightInConfirmed();
    };

    $scope.generateAllFreight = function () {
        for (var i = 0; i < $scope.freightIns.length; i++) {
            if ($scope.freightIns[i].selection == true) {
                if ($scope.freightIns[i].address == undefined)
                    alert("choose address first");
                else {
                    $scope.generateFreight($scope.freightIns[i]);
                    $scope.reloadFreightInConfirmed();
                }
            }
        }
    };

    $scope.mergePackage = function () {
        var freightInList = [];
        for (var i = 0; i < $scope.freightIns.length; i++) {
            if ($scope.freightIns[i].selection == true)
                freightInList.push($scope.freightIns[i]);
        }
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseAddress',
            controller: 'mergePackageCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightInList: function () {
                    return freightInList;
                }
            },
            windowClass: 'center-modal'
        });

        modalInstance.result.then(function () {
            $scope.reloadFreightInConfirmed();
            console.log("mergePackage: merge successfully");
        });
    };

});
YundaApp.controller('mergePackageCtrl', function ($scope, $modalInstance, freightInList) {
    $scope.getRecipient();

    $scope.mergeChooseRecipient = function (address) {
        $scope.chosenAddress = address;
        console.log("Chosen Address: " + $scope.chosenAddress.country);

    };

    $scope.confirmMergePackage = function () {
        var freight = new YD.Freight();
        freight.freightInGroup = freightInList;
        freight.address = $scope.chosenAddress;
        freight.user = $scope.currentUser;
        freight.weight = 0;
        freight.status = 0;
        freight.save(null, {
            success: function (freight) {
                console.log("freight has been saved: " + freight.id);
            },
            error: function (freight, error) {
                console.log("ERROR: freight not save: " + error.code + " - " + error.message);
            }
        });

        for (var i = 0; i < freightInList.length; i++) {
            freightInList[i].status = YD.FreightIn.STATUS_FINISHED;
        }
        AV.Object.saveAll(freightInList, {
            success: function (list) {
                console.log("mergePackage: freightList has been saved");
            },
            error: function (error) {
                console.log("ERROR: mergePackage: freightList has not been saved" + error.id + " - " + error.message);
            }
        });

        $modalInstance.close();
    };

    $scope.cancelMergePackage = function () {
        $modalInstance.dismiss();
    };
});

YundaApp.controller('fileUploadCtrl', function ($scope) {
    //$scope.identityFrontList;
    //$scope.identityBackList;
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files;
        $scope.$apply();
    };

    $scope.filesChangedBack = function (elm) {
        $scope.identityBack = elm.files;
        $scope.$apply();
    };
    $scope.uploadIdentity = function () {
        //console.log("In fileUpload back: " + $scope.identityBack);
        //console.log("In fileUpload front: " + $scope.identityFront);

        if ($scope.identityFront != undefined && $scope.identityBack != undefined) {
            //console.log("In fileUpload back: " + $scope.identityFront[0].name);
            //console.log("In fileUpload front: " + $scope.identityBack[0].name);
            var frontName = $scope.currentUser.realName + 'front.jpg';
            var backName = $scope.currentUser.realName + 'back.jpg';
            var avFileFront = new AV.File(frontName, $scope.identityFront[0]);
            var avFileBack = new AV.File(backName, $scope.identityBack[0]);

            $scope.currentUser.identityFront = avFileFront;
            $scope.currentUser.identityBack = avFileBack;
            $scope.currentUser.save(null, {
                success: function (img) {
                    console.log("In FileUploadCtrl: ID image has been saved");
                },
                error: function (img, error) {
                    console.log("ERROR: In FileUploadCtrl: ID image not been saved: " + error.id + error.message);

                }
            });
        } else {
            alert("Please upload file first");
        }
    };

});

YundaApp.controller('FreightConfirmedCtrl', function ($scope) {

    //status to string
    $scope.getStatus = function () {

        for (var i = 0; i < $scope.freights.length; i++) {
            //$scope.freights[i].statusToString = " ";
            var statusList = $scope.freights[i].statusGroup;
            var statusString = ' ';

            if ($scope.freights[i].statusGroup != undefined) {
                for (var j = 0; j < statusList.length; j++) {
                    if (statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
                        statusString += "Pending Final Confirmation; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString);
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
                        statusString += "Pending Extra Packaging; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString);
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
                        statusString += "Pending Reduce Weight; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString);
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
                        statusString += "Pending Check Packaging; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString);
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "Pending Split Packaging; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString);
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED) {
                        statusString += "Pending Split Packaging; ";
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString);
                    }
                }
            }

            //statusString.substr(0, statusString.length - 22);   //remove trailing comma
            $scope.freights[i].statusToString = statusString;
            console.log("HERE IS STRING LENGTH: " + $scope.freights[i].statusToString.length);
        }

    };

    $scope.reloadFreightConfirmed = function () {
        if($scope.currentUser.id != undefined){
            console.log("reloadFreightConfirmned: FREIGHT");
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
            success: function (results) {
                $scope.freights = results;

                //get ready for payment selection checkboxes.
                for (var i = 0; i < $scope.freights.length; i++) {
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
        });}
    };

    $scope.reloadFreightConfirmed();

    $scope.payment = function () {
        //1. check $scope.freights[i].selection and add all the values.
        //
        //2. change all freights' status to 500
        var paymentList = [];
        for (var i = 0; i < $scope.freights.length; i++) {
            if ($scope.freights[i].selection == true) {
                paymentList.push($scope.freights[i]);
                $scope.freights[i].status = YD.Freight.STATUS_PENDING_DELIVERY;
            }
        }
        AV.Object.saveAll(paymentList, {
            success: function (list) {
                console.log("confirmSplit: freightList has been saved");
            },
            error: function (freights, error) {
                console.log("ERROR: confirmSplit: freightList has not been saved" + error.id + " - " + error.message);
            }
        });
    }
});

YundaApp.controller('FreightDeliveryCtrl', function ($scope) {
    $scope.reloadFreight = function () {
        if($scope.currentUser.id != undefined){
            console.log("reoloadFreight: FREIGHT");

            var query = new AV.Query("Freight");
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status",
            [YD.Freight.STATUS_PENDING_DELIVERY, YD.Freight.STATUS_DELIVERING, YD.Freight.STATUS_PASSING_CUSTOM, YD.Freight.STATUS_FINAL_DELIVERY, YD.Freight.STATUS_DELIVERED]);
        query.find({
            success: function (results) {
                $scope.freights = results;
                console.log("Freight DELIVERY confirmed is shown, length: " + results.length);
                var statusToString = "";
                for (var i = 0; i < $scope.freights.length; i++) {
                    //console.log("In for loop, status is: " + statusToString);

                    if ($scope.freights[i].status == YD.Freight.STATUS_PENDING_DELIVERY)
                        statusToString = "Pending Delivery";
                    //console.log("statusToSTring: " + statusToString);

                    else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERING)
                        statusToString = "Delivery";
                    else if ($scope.freights[i].status == Freight.STATUS_PASSING_CUSTOM)
                        statusToString = "Passing Custom";
                    else if ($scope.freights[i].status == YD.Freight.STATUS_FINAL_DELIVERY)
                        statusToString = "Final delivery";
                    else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERED)
                        statusToString = "Delivered";
                    else {
                    }
                    $scope.freights[i].statusToString = statusToString;
                    //console.log("statusToSTring: " + $scope.freights[i].statusToString);
                }
                $scope.$apply();
                console.log("Freight delivery confirmed is shown");

            },
            error: function (error) {
                alert("ERROR: Getting Freight delivery: " + error.id + " " + error.message);
            }
        });}
    };
    $scope.reloadFreight();


});
/* Edit address controller */

YundaApp.controller('EditAddressCtrl', function ($scope, $modalInstance, address) {

    $scope.address = address;
    $scope.saveAddressSubmit = function () {
        $scope.address.save().then(function (address) {
            $modalInstance.close(address);
        }, function (error) {
            alert(error.message);
        });
    }
});
YundaApp.controller('SplitPackageCtrl', function ($scope, $modalInstance, freightIn) {
    $scope.notes;
    $scope.amount = 0;
    $scope.getRecipient();

    $scope.freightList = [];
    $scope.generateFreightList = function () {
        console.log("changed to: " + $scope.amount);
        $scope.freightList = [];
        for (var i = 0; i < $scope.amount; i++) {
            $scope.freightList[i] = new YD.Freight();
            $scope.freightList[i].freightIn = freightIn;
            $scope.freightList[i].status = 0;
            var statusList = [];
            statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);
            $scope.freightList[i].statusGroup = statusList;

            $scope.freightList[i].user = freightIn.user;
        }
    };
    $scope.splitChooseRecipient = function (address, freight) {
        freight.address = address;

    };

    $scope.confirmSplit = function () {
        AV.Object.saveAll($scope.freightList, {
            success: function (list) {
                console.log("confirmSplit: freightList has been saved");
            },
            error: function (error) {
                console.log("ERROR: confirmSplit: freightList has not been saved");
            }
        });
        $modalInstance.close();
    };
});

YundaApp.controller('SplitPackagePremiumCtrl', function ($scope, $modalInstance) {
    $scope.notes;
    $scope.amount = 0;
    $scope.getRecipient();
    $scope.freightList = [];
    $scope.generateFreightList = function () {
        console.log("changed to: " + $scope.amount);
        $scope.freightList = [];
        for (var i = 0; i < $scope.amount; i++) {
            $scope.freightList[i] = new YD.Freight();
            $scope.freightList[i].freightIn = freightIn;
            $scope.freightList[i].status = 0;
            var statusList = [];
            statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE);
            $scope.freightList[i].user = freigntIn.user;
        }
    };

    $scope.splitChooseRecipient = function (address, freight) {
        freight.address = address;

    };

    $scope.confirmSplit = function () {
        AV.Object.saveAll($scope.freightList, {
            success: function (list) {
                console.log("confirmSplit: freightList has been saved");
            },
            error: function (error) {
                console.log("ERROR: confirmSplit: freightList has not been saved");

            }
        });
        $modalInstance.close();
    };
});
/* update password*/
YundaApp.controller('UpdatePasswordCtrl', function ($scope, $modalInstance) {
    $scope.savePassword = function () {
        $scope.currentUser.password = $scope.newPassword;
        $scope.currentUser.save().then(function (user) {
            $modalInstance.close(user);
        })
    }
});

YundaApp.controller('RechargeCtrl', function ($scope, $modal) {
    $scope.FIXED_RATE = 6.4;
    $scope.$watch('CNY', function (newVal, oldVal) {
        console.log("CNY new value : " + newVal);
        $scope.USD = (newVal / $scope.FIXED_RATE).toFixed(2);
        console.log("USD : " + $scope.USD);
    }, true);


    $scope.stripePayment = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_stripe',
            controller: 'StripeCtrl',
            scope: $scope,
            size: 'sm',
            //resolve: {
            //    address: function() {
            //        return address;
            //    }
            //},
            windowClass: 'center-modal'
        });

        modalInstance.result.then(function () {
            //$scope.reloadAddress();
            //console.log("addNewAddress(): new address is added");
        });
    };
});


YundaApp.controller('StripeCtrl', function ($scope, $rootScope, $modalInstance) {

    $scope.stripeCallback = function (status, response) {
        //$http.post('https://api.stripe.com/v1/charges', { token: response.id });
        console.log("STRIPECTRL Token: " + response.id);
        AV.Cloud.run('createCharge', {
                //source: response.id,
                source: response.id,
                amount: $scope.USD * 100,
                currency: 'usd',
                description: $scope.currentUser.realName
            },
            {
                success: function (data) {
                    var transaction = new YD.Transaction();
                    transaction.record = data;
                    transaction.status = YD.Transaction.STATUS_STRIPE;
                    transaction.amount = $scope.USD;
                    transaction.save(null, {
                        success: function (t) {
                            console.log("transaction saved");
                            $modalInstance.close();
                        },
                        error: function (t, error) {
                            console.log("transaction not saved " + error.id + ' - ' + error.message);
                        }
                    });
                },
                error: function (error) {

                }
            });
    };
});

YundaApp.controller('ZhifubaoCtrl', function ($scope) {
    $scope.zhifubaoPayment = function () {
        var transaction = new YD.Transaction();
        transaction.status = YD.Transaction.STATUS_ZHIFUBAO;
        transaction.save(null, {
            success: function (t) {
                console.log("transaction saved");
            },
            error: function (t, error) {
                console.log("transaction not saved " + error.id + ' - ' + error.message);
            }
        });

    }
})

YundaApp.controller('ConsumeRecordCtrl', function ($scope) {

    $scope.open1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1 = true;
    };

    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    };
    //$scope.showCMD = function() {
    //    console.log('Show dt1: ' + $scope.dt1);
    //}
    $scope.reloadTransaction = function () {
        if($scope.currentUser.id != undefined){
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            var date = new Date();
            var hour = date.getHours();
            var minute = date.getMinutes();
            $scope.dt1 = new Date($scope.dt1);
            $scope.dt2 = new Date($scope.dt2);
            $scope.dt1.setHours(hour);
            $scope.dt1.setMinutes(minute);
            $scope.dt2.setHours(hour);
            $scope.dt2.setMinutes(minute);
            //console.log("date 1: " + $scope.dt1);
            //console.log("date 2: " + $scope.dt2);
            console.log("reloadTransaction: Transaction");

            var query = new AV.Query("Transaction");
            query.greaterThanOrEqualTo("createdAt", $scope.dt1);
            query.lessThanOrEqualTo("createdAt", $scope.dt2);
            query.containedIn("status", [YD.Transaction.STATUS_CONSUME]);

            query.find({
                success: function (tList) {
                    $scope.transactionList = tList;
                    for (var i = 0; i < tList.length; i++) {
                        if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME) {
                            $scope.transactionList[i].status = '消费';
                        }
                    }
                    $scope.$apply();

                    console.log("DatePicker: get all transaction successful: " + tList.length);
                },
                error: function (tList, err) {
                    console.log("DatePicker: get all transaction not successful: " + err.id + err.message);

                }
            });
        }
        else {
            alert("choose date first");
        }}
    };
});

YundaApp.controller('RechargeRecordCtrl', function ($scope) {
    $scope.open1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1 = true;
        console.log("opened1: " + $scope.opened1);

    };

    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
        console.log("opened2: " + $scope.opened2);


    };
    $scope.reloadTransaction = function () {
        if($scope.currentUser.id != undefined){
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            var date = new Date();
            var hour = date.getHours();
            var minute = date.getMinutes();
            $scope.dt1 = new Date($scope.dt1);
            $scope.dt2 = new Date($scope.dt2);
            $scope.dt1.setHours(hour);
            $scope.dt1.setMinutes(minute);
            $scope.dt2.setHours(hour);
            $scope.dt2.setMinutes(minute);
            //console.log("date 1: " + $scope.dt1);
            //console.log("date 2: " + $scope.dt2);
            console.log("TRANSACTION 2: FREIGHT");

            var query = new AV.Query("Transaction");
            query.greaterThanOrEqualTo("createdAt", $scope.dt1);
            query.lessThanOrEqualTo("createdAt", $scope.dt2);
            query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_STRIPE]);
            query.find({
                success: function (tList) {
                    $scope.transactionList = tList;
                    for (var i = 0; i < tList.length; i++) {
                        if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME) {
                            $scope.transactionList[i].status = '消费';
                        }
                        else if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO) {
                            $scope.transactionList[i].status = '支付宝充值';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_STRIPE) {
                            $scope.transactionList[i].status = '信用卡充值';

                        } else {
                        }

                    }
                    $scope.$apply();
                    console.log("DatePicker: get all transaction successful: " + tList.length);
                },
                error: function (tList, err) {
                    console.log("DatePicker: get all transaction not successful: " + err.id + err.message);

                }
            });
        }
        else {
            alert("choose date first");
        }
    }};
});
// AngularJS Google Maps loader

YundaApp.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});


YundaApp.controller('ContactController', function ($scope, uiGmapGoogleMapApi) {
    $scope.map = {center: {latitude: -33.8764458, longitude: 151.2047273}, zoom: 17};

    $scope.marker = {
        id: 0,
        coords: {
            latitude: -33.8764458,
            longitude: 151.2047273
        }
    };
    uiGmapGoogleMapApi.then(function (maps) {

    });
});

