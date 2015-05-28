'use strict';

/* Controllers */

YundaApp.controller('AppCtrl', function ($scope, $rootScope,$location, $http) {

    $http({
        method: 'GET',
        url: '/api/name'
    }).
        success(function (data, status, headers, config) {
            $scope.name = data.name
        }).
        error(function (data, status, headers, config) {
            $scope.name = 'Error!'
        })
    $scope.printPage = $location.path() == '/partials/print'
//Stripe

})

/* Navbar Controller*/

YundaApp.controller('NavbarCtrl', function ($scope, $rootScope, $modal, $window) {

    if (YD.User.current() != undefined) {
        $rootScope.currentUser = YD.User.current()
    } else {
        $rootScope.currentUser = new YD.User()
    }
    $scope.open = function () {
        console.log("Nabar Ctrl login():")
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_login',
            controller: 'LoginCtrl',
            scope: $scope,
            size: 'lg',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (user) {
            //console.log("modal is closed. ")
            if (user != undefined) {
                $rootScope.currentUser = user
            } else {
                //console.log("modal user undefined")
            }
        })
    }
    $scope.logOut = function () {
        YD.User.logOut()
        // Do stuff after successful login.
        $rootScope.currentUser = new YD.User()
        $window.location.href = '/'
    }

    $scope.isActive = function() {
        return true
        //if($scope.currentUser != undefined){
        //    return true
        //} else return false
    }
})


/* Login Controller*/
YundaApp.controller('LoginCtrl', function ($scope, $modalInstance) {
    $scope.login = function () {
        YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
            success: function (user) {
                $modalInstance.close(user)
            },
            error: function(user, error) {
                alert('登陆失败, ' + error.message)
            }
        })
    }

    $scope.signup = function () {
        $modalInstance.dismiss('cancel')
        $scope.currentUser.set("email", $scope.currentUser.username)
        $scope.currentUser.signUp(null, {
            success: function (user) {
                // Hooray! Let them use the app now.
                $scope.isLoading = false
                $modalInstance.close(user)
            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                $scope.isLoading = false
                alert("Sign up failed " + error.message)
            }
        })
    }
    $scope.resetPassword = function () {
        $scope.promote = "Requesting password"
        AV.User.requestPasswordReset($scope.currentUser.username, {
            success: function () {
                $modalInstance.close()
            },
            error: function (error) {
                alert("Reset failed " + error.message)
            }
        })
    }
})

YundaApp.controller('HomeCtrl', function ($rootScope, $scope, $modal){
    $scope.trackingNumber
    $scope.trackingList
    $scope.resultList = []

    $scope.trackingInfo = function () {
        //console.log("tracking info: " + $scope.trackingList)
        $scope.trackingList = $scope.trackingNumber.split("\n")
        for (var i = 0; i < $scope.trackingList.length; i++) {
            console.log("NOW SPLIT: " + i + " - " + $scope.trackingList[i])
        }
        var query = new AV.Query("FreightIn")
        query.containedIn("trackingNumber", $scope.trackingList)
        query.equalTo("user", $scope.currentUser)
        query.find({
            success: function (list) {
                console.log("list length:  " + list.length)
                for (var i = 0; i < list.length; i++) {
                    list[i].info = "待发货"
                    $scope.resultList.push(list[i])
                }
            },
            error: function (error) {
                console.log("LF FIn ERROR: " + error.message)
            }
        })

        query = new AV.Query("Freight")
        query.containedIn("trackingNumber", $scope.trackingList)
        query.equalTo("user", $scope.currentUser)
        query.find({
            success: function (list) {
                console.log("LIST LENGTH: " + list.length)

                for (var i = 0; i < list.length; i++) {
                    list[i].info = "已发货"
                    $scope.resultList.push(list[i])
                }
            }
        })
        if ($scope.resultList != undefined) {
            console.log("In ResultListUndefined")
            for (var i = 0; i < $scope.resultList.length; i++) {
                //console.log("Result: " + i + " - " + $scope.resultList[i].info + $scope.resultList[i].trackingNumber)

            }
            //6917246211814
            //8498950010019

            var modalInstance = $modal.open({
                templateUrl: 'partials/modal_tracking',
                controller: 'TrackingCtrl',
                scope: $scope,
                size: 'lg',
                resolve: {
                    resultList: function () {
                        return $scope.resultList
                    }
                },
                windowClass: 'center-modal'
            })
        }
    }
    $scope.login = function () {
        console.log("username: " + $scope.currentUser.username)
        YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
            success: function (user) {
                $rootScope.currentUser = user
                $scope.$apply()
                console.log("successfuly login via main page login")
            },
            error: function(user, error) {
                alert('登陆失败, ' + error.message)
            }
        })
    }

    $scope.signup = function () {
        $scope.currentUser.set("email", $scope.currentUser.username)
        $scope.currentUser.signUp(null, {
            success: function (user) {
                // Hooray! Let them use the app now.
                $scope.isLoading = false
            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                $scope.isLoading = false
                alert("Sign up failed " + error.message)
            }
        })
    }
    $scope.resetPassword = function () {
        $scope.promote = "Requesting password"
        AV.User.requestPasswordReset($scope.currentUser.username, {
            success: function () {
            },
            error: function (error) {
                alert("Reset failed " + error.message)
            }
        })
    }
    $scope.newsList = []
    $scope.newsList[0] = {
        title: "news 1"
    }
    $scope.newsList[1] = {
        title: "news 2"
    }
})

YundaApp.controller('TrackingCtrl', function($scope, $modalInstance, resultList) {
    $scope.resultList = resultList
    $scope.close = function() {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('MyTrackingCtrl', function($scope) {
    //$scope.trackingNumber
    //$scope.trackingList
    $scope.resultList = []

    $scope.reloadTracking = function () {
        //console.log("tracking info: " + $scope.trackingList)
        //$scope.trackingList = $scope.trackingNumber.split("\n")
        //for (var i = 0; i < $scope.trackingList.length; i++) {
        //    console.log("NOW SPLIT: " + i + " - " + $scope.trackingList[i])
        //}
        var query = new AV.Query("FreightIn")
        //query.containedIn("trackingNumber", $scope.trackingList)
        query.equalTo("user", $scope.currentUser)
        query.find({
            success: function (list) {
                console.log("list length:  " + list.length)
                for (var i = 0; i < list.length; i++) {
                    list[i].info = "待发货"
                    $scope.resultList.push(list[i])
                }
            },
            error: function (error) {
                console.log("LF FIn ERROR: " + error.message)
            }
        })

        query = new AV.Query("Freight")
        //query.containedIn("trackingNumber", $scope.trackingList)
        query.equalTo("user", $scope.currentUser)
        query.find({
            success: function (list) {
                console.log("LIST LENGTH: " + list.length)

                for (var i = 0; i < list.length; i++) {
                    list[i].info = "已发货"
                    $scope.resultList.push(list[i])
                }
            }
        })
        if ($scope.resultList != undefined) {
            console.log("In ResultListUndefined")
            for (var i = 0; i < $scope.resultList.length; i++) {
                console.log("Result: " + i + " - " + $scope.resultList[i].info + $scope.resultList[i].trackingNumber)

            }
            //6917246211814
            //8498950010019
        }
    }

    $scope.reloadTracking()

})

YundaApp.controller('CarouseCtrl', function ($scope) {
    $scope.myInterval = 5000
    var slides = $scope.slides = []
    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/300',
            text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        })
    }
    for (var i=0; i<4; i++) {
        $scope.addSlide()
    }
})
YundaApp.controller('ManualCtrl', function($scope) {
    $scope.freightIn = new YD.FreightIn()
    $scope.submitFreightIn = function() {
        $scope.freightIn.status =  YD.FreightIn.STATUS_MANUAL
        $scope.freightIn.user = $scope.currentUser
        $scope.freightIn.save(null, {
            success: function(f) {
                console.log("MANUAL frieghtin saved ")
            },
            error: function(f, error) {
                console.log("MANUAL frieghtin NOT saved " + error.message)

            }
        })
    }
})

YundaApp.controller('ReturnCtrl', function($scope) {
    $scope.reloadFreightReturn = function() {
        var query = new AV.Query("FreightReturn")
        query.equalTo("user", $scope.currentUser)
        query.equalTo("status", YD.FreightReturn.STATUS_PENDING)
        if($scope.currentUser.id != undefined) {
            query.find({
                success: function(result) {

                    console.log("RETURN find return list, length: " + result.length)
                    $scope.returnList = result
                    for(var i = 0; i < $scope.returnList.length; i++) {
                       if($scope.returnList[i].status == YD.FreightReturn.STATUS_PENDING) {
                           $scope.returnList[i].status = "等待韵达处理"
                       } else if($scope.returnList[i].status == YD.FreightReturn.STATUS_AWAITING) {
                           $scope.returnList[i].status = "等待用户确认"
                       }
                    }
                    $scope.$apply()
                },
                error: function(error) {

                }
            })
        }
    }
    $scope.reloadFreightReturn()
    $scope.returnFreight = new YD.FreightReturn()
    $scope.applyReturn = function () {
        $scope.returnFreight.user = $scope.currentUser
        $scope.returnFreight.status = YD.FreightReturn.STATUS_PENDING
        $scope.returnFreight.save(null, {
            success: function (returnFreight) {
                console.log("RETURN saved")
            }, error: function (returnFreight, error) {
                console.log("RETURN NOT saved" + error.message)
            }
        })
        $scope.reloadFreightReturn()
    }
    $scope.confirmReturn = function(freight){
        if(freight.status == YD.FreightReturn.STATUS_PENDING) {
            alert("请耐心等待客服处理")
        } else {
            $scope.currentUser.balance -= fregiht.amount
            $scope.currentUser.save(null, {
               success: function(user) {
                   console.log("RETURN user has been charged")
               },
                error: function(user, error) {
                    console.log("RETURN user has NOT been charged: " + error.message)
                }
            })
        }

    }
})

/* Dashboard Controller*/
YundaApp.controller('DashboardCtrl', function ($scope, $modal) {
    $scope.oneAtATime = true
    $scope.view_tab = "aa"
    $scope.change_tab = function (tab) {
        $scope.view_tab = tab
    }

    /* getting user's address */
    var address = new YD.Address()
    address.id = $scope.currentUser.addressId
    address.fetch().then(function (address) {
        $scope.currentUser.address = address
    })

    $scope.updatePassword = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_password',
            controller: 'UpdatePasswordCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'

        })
        modalInstance.result.then(function () {
            console.log("updatePassword(): user's password has been updated")
        })
    }


    /* getting recipient */
    $scope.reloadAddress = function () {
        if($scope.currentUser.id != undefined){
            console.log("reloadAddress: ADDRESS")

            var query = new AV.Query("Address")
        query.equalTo("user", $scope.currentUser)
        if (YD.User.current() != undefined) {
            query.find({
                success: function (results) {
                    $scope.recipientAddresses = results
                    $scope.$apply()
                    console.log("address list has been reloaded")
                },
                error: function (error) {
                    alert("Getting Recipient Addresses Error: " + error.code + " " + error.message)
                }
            })
        }
        }
    }
    $scope.reloadAddress()
    /* search recipients */
    $scope.searchRecipient = function () {

        var query = new AV.Query("Address")
        query.equalTo("user", $scope.currentUser)
        query.equalTo("recipient", $scope.recipientLookup)
        if (YD.User.current() != undefined) {
            query.find({
                success: function (results) {
                    $scope.recipientAddresses = results
                    $scope.$apply()
                    console.log("address list has been reloaded")
                },
                error: function (error) {
                    alert("Getting Recipient Addresses Error: " + error.code + " " + error.message)
                }
            })
        }
    }

    /* add a new recipient */
    $scope.addNewAddress = function () {
        var address = new YD.Address()
        if ($scope.currentUser.id != undefined) {
            address.user = $scope.currentUser
            $scope.editAddress(address)
        }
        else {
            console.log("addNewAddress(): currentUser is not defined")
        }
    }

    $scope.editAddress = function (address) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_address',
            controller: 'EditAddressCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                address: function () {
                    return address
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.reloadAddress()
            console.log("addNewAddress(): new address is added")
        })
    }

    $scope.deleteAddress = function (address) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_deleteAddress',
            controller: 'DeleteAddressCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                address: function () {
                    return address
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.reloadAddress()
            console.log("Delete address: success")
        })

    }

    $scope.getRecipient = function () {

        var query = new AV.Query("Address")
        query.equalTo("user", $scope.currentUser)
        query.find({
            success: function (results) {
                $scope.addressList = results
                //console.log("GetRecipient ADDRESS got : " + results.length)
            },
            error: function (res, error) {
                alert("Getting Recipient: " + error.code + " " + error.message)
            }
        })
    }
})

YundaApp.controller('DeleteAddressCtrl', function ($scope, $modalInstance, address) {
    alert("deleting!")
    $scope.confirmDelete = function () {
        address.destroy().then(function (address) {
            $modalInstance.close(address)
        }, function (address, error) {
            alert(error.message)
        })
    }
    $scope.cancelDelete = function () {
        $modalInstance.dismiss()
    }

})

YundaApp.controller('UpdateUserCtrl', function ($scope) {
    var address = new YD.Address()

    if ($scope.currentUser.addressId != undefined) {
        address.id = $scope.currentUser.addressId
        address.fetch().then(function (address) {
            $scope.address = address
        })
    } else {
        $scope.address = new YD.Address()
    }

    $scope.update_user = function () {
        if ($scope.address.id != undefined) {
            $scope.currentUser.addressId = $scope.address.id
        }
        else {
            var address = new YD.Address()
            address = $scope.address
            address.recipient = $scope.currentUser.realName
            address.user = $scope.currentUser

            address.save(null, {
                success: function (address) {
                    console.log("update_user() save address success")
                    $scope.currentUser.addressId = address.id
                },
                error: function (address, error) {
                    console.log("update_user() save address fail : " + error.id + error.message)
                }
            })
        }
        //$scope.currentUser.mobilePhoneNumber = '23232323'
        $scope.currentUser.save(null, {
            success: function (user) {
                console.log("update_user() success")
                console.log("update_user() success mobile: " + user.mobilePhoneNumber)

            },
            error: function (user, error) {
                console.log("update_user() fail: " + error.id + error.message)
            }
        })
    }
})

YundaApp.controller('freightInArrivedCtrl', function ($scope) {
    $scope.reloadFreightInArrived = function () {
        if($scope.currentUser.id != undefined){
        var query = new AV.Query("FreightIn")
        query.equalTo("user", $scope.currentUser)
        query.equalTo("status", YD.FreightIn.STATUS_ARRIVED)

        query.find({
            success: function (results) {
                //console.log("FreightIn arrived is shown TRACKING: " + results[0].status)
                $scope.freightIns = results
                $scope.$apply()
                console.log("FreightIn arrived is shown")
            },
            error: function (error) {
                alert("Getting Freight In Error: " + error.code + " " + error.message)
            }
        })}
    }
    $scope.reloadFreightInArrived()
    $scope.freightInConfirm = function (freightIn) {
        if($scope.currentUser.id != undefined){
        freightIn.status = YD.FreightIn.STATUS_CONFIRMED
        freightIn.save().then(function (freightIn) {
            console.log("freightInConfirm()-- freightIn.status updated: " + freightIn.status)

            $scope.reloadFreightInArrived()

        }, function (freightIn, error) {
            console.log(error.message)
        })
    }}
})

YundaApp.controller('freightInConfirmedCtrl', function ($scope, $modal) {
    $scope.PRICE = 10
    $scope.reloadFreightInConfirmed = function () {
        if($scope.currentUser.id != undefined){
        var query = new AV.Query("FreightIn")
        query.equalTo("user", $scope.currentUser)
        query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED)
        query.find({
            success: function (results) {
                $scope.freightIns = results
                for (var i = 0; i < $scope.freightIns.length; i++) {
                    $scope.freightIns[i].checkboxModel = {
                        delivery: false,
                        addPackage: false,
                        reduceWeight: false,
                        checkPackage: false,
                        splitPackage: false,
                        splitPackagePremium: false
                    }
                    $scope.freightIns[i].selection = false
                    $scope.freightIns[i].estimatePrice = $scope.freightIns[i].weight * $scope.PRICE
                    //$scope.freightIns[i].address = ' '
                }
                $scope.getRecipient()
                $scope.$apply()
                console.log("FreightIn confirmed is shown")
                //for(var i = 0; i < $scope.freightIns.length; i++){
                //    console.log("delivery: " + $scope.freightIns[i].checkboxModel.delivery)
                //    console.log("addPackage: " + $scope.freightIns[i].checkboxModel.addPackage)
                //    console.log("reduceWeight: " + $scope.freightIns[i].checkboxModel.reduceWeight)
                //    console.log("checkPackage: " + $scope.freightIns[i].checkboxModel.checkPackage)
                //    console.log("splitPackage: " + $scope.freightIns[i].checkboxModel.splitPackage)
                //    console.log("splitPackagePremium: " + $scope.freightIns[i].checkboxModel.splitPackagePremium)
                //
                //}
            },
            error: function ( error) {
                alert("Getting Freight In Error: " + error.id + " " + error.message)
            }
        })}
    }
    $scope.reloadFreightInConfirmed()


    $scope.splitPackage = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_splitPackage',
            controller: 'SplitPackageCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightIn: function () {
                    return freightIn
                }
            },
            windowClass: 'center-modal'

        })
        modalInstance.result.then(function () {
            //$scope.checkboxModel.splitPackage = true
            //$scope.checkboxModel.splitPackagePremium = false
            //freightIn.notes = notes
            freightIn.status = YD.FreightIn.STATUS_FINISHED
            freightIn.save().then(function () {
                //freightIn notes have been saved
            })

            console.log("addNewAddress(): new address is added")
            $scope.reloadFreightInConfirmed()
        })
    }
    $scope.splitPackagePremium = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_splitPackage',
            controller: 'SplitPackagePremiumCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightIn: function () {
                    return freightIn
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (notes) {
            console.log("addNewAddress(): new address is added")
            $scope.checkboxModel.splitPackagePremium = true
            $scope.checkboxModel.splitPackage = false
            freightIn.notes = notes
            freightIn.save().then(function () {
                //freightIn notes have been saved
            })
        })
    }


    $scope.chooseRecipient = function (freightIn, address) {
        console.log("address is chosen, address: " + address.id)
        console.log("address is chosen, freightIn: " + freightIn.id)
        //console.log("address is chosen: " + $scope.freightIns[index].address)
        freightIn.address = address
    }

    $scope.generateFreight = function (freightIn) {
        if (freightIn.address == undefined) {
            alert("Choose address first")
        } else {
            var freight = new YD.Freight()
            //freight.address = null
            freight.freightIn = freightIn
            freight.address = freightIn.address
            //freight.statusGroup = $scope.getStatusList(freightIn)
            if (freightIn.checkboxModel != undefined) {
                if (freightIn.checkboxModel.delivery == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION)

                if (freightIn.checkboxModel.addPackage == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING)

                if (freightIn.checkboxModel.reduceWeight == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_REDUCE_WEIGHT)

                if (freightIn.checkboxModel.checkPackage == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_CHECK_PACKAGE)

                if (freightIn.checkboxModel.splitPackage == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)

                if (freightIn.checkboxModel.splitPackagePremium == true)
                    freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED)
            }
            freight.user = $scope.currentUser
            freight.weight = freightIn.weight
            freight.trackingNumber = freightIn.trackingNumber
            freight.status = 0
            freight.save(null, {
                success: function (freight) {
                    console.log("freight has been saved: " + freight.id)
                },
                error: function (freight, error) {
                    console.log("ERROR: freight not save: " + error.code + " - " + error.message)
                }
            })
            freightIn.status = YD.FreightIn.STATUS_FINISHED
            freightIn.save(null, {
                success: function (freightIn) {
                    console.log("freightIn has been saved: " + freightIn.id)
                },
                error: function (freightIn, error) {
                    console.log("ERROR: freightIn not save: " + error.code + " - " + error.message)
                }
            })
            $scope.reloadFreightInConfirmed()

        }
    }

    $scope.generateDeliveryFreight = function (freightIn) {
        if (freightIn.address == undefined) {
            alert("Choose address first")
        } else {
            var freight = new YD.Freight()
            //freight.address = null
            freight.freightIn = freightIn
            //freight.statusGroup = $scope.getStatusList(freightIn)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION)

            freight.user = $scope.currentUser
            freight.weight = freightIn.weight
            freight.trackingNumber = freightIn.trackingNumber
            freight.status = YD.Freight.STATUS_INITIALIZED
            freight.save(null, {
                success: function (freight) {
                    console.log("freight has been saved: " + freight.id)
                },
                error: function (freight, error) {
                    console.log("ERROR: freight not save: " + error.code + " - " + error.message)
                }
            })
            freightIn.status = YD.FreightIn.STATUS_FINISHED;
            freightIn.save(null, {
                success: function (freightIn) {
                    console.log("freightIn has been saved: " + freightIn.id)
                },
                error: function (freightIn, error) {
                    console.log("ERROR: freightIn not save: " + error.code + " - " + error.message)
                }
            })
        }
        $scope.reloadFreightInConfirmed()
    }

    $scope.generateAllFreight = function () {
        for (var i = 0; i < $scope.freightIns.length; i++) {
            if ($scope.freightIns[i].selection == true) {
                if ($scope.freightIns[i].address == undefined)
                    alert("choose address first")
                else {
                    $scope.generateFreight($scope.freightIns[i])
                    $scope.reloadFreightInConfirmed()
                }
            }
        }
    }

    $scope.mergePackage = function () {
        var freightInList = []
        for (var i = 0; i < $scope.freightIns.length; i++) {
            if ($scope.freightIns[i].selection == true)
                freightInList.push($scope.freightIns[i])
        }
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseAddress',
            controller: 'mergePackageCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightInList: function () {
                    return freightInList
                }
            },
            windowClass: 'center-modal'
        })

        modalInstance.result.then(function () {
            $scope.reloadFreightInConfirmed()
            console.log("mergePackage: merge successfully")
        })
    }

})
YundaApp.controller('mergePackageCtrl', function ($scope, $modalInstance, freightInList) {
    $scope.getRecipient()

    $scope.mergeChooseRecipient = function (address) {
        $scope.chosenAddress = address
        console.log("Chosen Address: " + $scope.chosenAddress.country)

    }

    $scope.confirmMergePackage = function () {
        var freight = new YD.Freight()
        freight.freightInGroup = freightInList
        freight.address = $scope.chosenAddress
        freight.user = $scope.currentUser
        freight.weight = 0
        freight.status = 0
        freight.save(null, {
            success: function (freight) {
                console.log("freight has been saved: " + freight.id)
            },
            error: function (freight, error) {
                console.log("ERROR: freight not save: " + error.code + " - " + error.message)
            }
        })

        for (var i = 0; i < freightInList.length; i++) {
            freightInList[i].status = YD.FreightIn.STATUS_FINISHED
        }
        AV.Object.saveAll(freightInList, {
            success: function (list) {
                console.log("mergePackage: freightList has been saved")
            },
            error: function (error) {
                console.log("ERROR: mergePackage: freightList has not been saved" + error.id + " - " + error.message)
            }
        })

        $modalInstance.close()
    }

    $scope.cancelMergePackage = function () {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('fileUploadCtrl', function ($scope) {
    //$scope.identityFrontList
    //$scope.identityBackList
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }

    $scope.filesChangedBack = function (elm) {
        $scope.identityBack = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        //console.log("In fileUpload back: " + $scope.identityBack)
        //console.log("In fileUpload front: " + $scope.identityFront)

        if ($scope.identityFront != undefined && $scope.identityBack != undefined) {
            //console.log("In fileUpload back: " + $scope.identityFront[0].name)
            //console.log("In fileUpload front: " + $scope.identityBack[0].name)
            var frontName = $scope.currentUser.realName + 'front.jpg'
            var backName = $scope.currentUser.realName + 'back.jpg'
            var avFileFront = new AV.File(frontName, $scope.identityFront[0])
            var avFileBack = new AV.File(backName, $scope.identityBack[0])

            $scope.currentUser.identityFront = avFileFront
            $scope.currentUser.identityBack = avFileBack
            $scope.currentUser.save(null, {
                success: function (img) {
                    console.log("In FileUploadCtrl: ID image has been saved")
                },
                error: function (img, error) {
                    console.log("ERROR: In FileUploadCtrl: ID image not been saved: " + error.id + error.message)

                }
            })
        } else {
            alert("Please upload file first")
        }
    }

})

YundaApp.controller('FreightConfirmedCtrl', function ($scope) {

    //status to string
    $scope.getStatus = function () {

        for (var i = 0; i < $scope.freights.length; i++) {
            //$scope.freights[i].statusToString = " "
            var statusList = $scope.freights[i].statusGroup
            var statusString = ' '

            if ($scope.freights[i].statusGroup != undefined) {
                for (var j = 0; j < statusList.length; j++) {
                    if (statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
                        statusString += "等待用户最后确认; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
                        statusString += "等待加固; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
                        statusString += "等待减重; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
                        statusString += "等待开箱检查; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "等待普通分箱; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED) {
                        statusString += "等待精确分箱; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }
                }
            }

            //statusString.substr(0, statusString.length - 22)   //remove trailing comma
            $scope.freights[i].statusToString = statusString
            console.log("HERE IS STRING LENGTH: " + $scope.freights[i].statusToString.length)
        }

    }

    $scope.reloadFreightConfirmed = function () {
        if($scope.currentUser.id != undefined){
            console.log("reloadFreightConfirmned: FREIGHT")
        var query = new AV.Query("Freight")
        query.equalTo("user", $scope.currentUser)
        //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
        //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED)
        //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_REDUCE_WEIGHT)
        //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING)
        //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_CHECK_PACKAGE)
        //query.equalTo("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION)
        query.equalTo("status", YD.Freight.STATUS_INITIALIZED)
            query.include("user")
        query.find({
            success: function (results) {
                $scope.freights = results

                //get ready for payment selection checkboxes.
                for (var i = 0; i < $scope.freights.length; i++) {
                    $scope.freights[i].selection = false
                }
                $scope.getStatus()
                $scope.$apply()
                console.log("Freight confirmed is shown, length: " + $scope.freights.length)
                console.log("Freight confirmed is shown, weight: " + $scope.freights.weight)


            },
            error: function (error) {
                alert("Getting Freight Error: " + error.code + " " + error.message)
            }
        })}
    }

    $scope.reloadFreightConfirmed()

    $scope.payment = function () {
        //1. check $scope.freights[i].selection and add all the values.
        //
        //2. change all freights' status to 500
        if ($scope.confirmTC == false) {
            alert("付款必须先同意条款")
        } else {
            var paymentList = []
            var paymentInTotal
            for (var i = 0; i < $scope.freights.length; i++) {
                if ($scope.freights[i].selection == true) {
                    //@todo reduce the credit
                    paymentInTotal += 0
                    paymentList.push($scope.freights[i])
                    $scope.freights[i].status = YD.Freight.STATUS_PENDING_DELIVERY

                }
            }
            AV.Object.saveAll(paymentList, {
                success: function (list) {
                    console.log("confirmSplit: freightList has been saved")
                },
                error: function (freights, error) {
                    console.log("ERROR: confirmSplit: freightList has not been saved" + error.id + " - " + error.message)
                }
            })
        }
    }
})

YundaApp.controller('FreightDeliveryCtrl', function ($scope) {
    $scope.reloadFreight = function () {
        if($scope.currentUser.id != undefined){
            console.log("reoloadFreight: FREIGHT")

            var query = new AV.Query("Freight")
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status",
            [YD.Freight.STATUS_PENDING_DELIVERY, YD.Freight.STATUS_DELIVERING, YD.Freight.STATUS_PASSING_CUSTOM, YD.Freight.STATUS_FINAL_DELIVERY, YD.Freight.STATUS_DELIVERED])
        query.find({
            success: function (results) {
                $scope.freights = results
                console.log("Freight DELIVERY confirmed is shown, length: " + results.length)
                var statusToString = ""
                for (var i = 0; i < $scope.freights.length; i++) {
                    //console.log("In for loop, status is: " + statusToString)

                    if ($scope.freights[i].status == YD.Freight.STATUS_PENDING_DELIVERY)
                        statusToString = "Pending Delivery"
                    //console.log("statusToSTring: " + statusToString)

                    else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERING)
                        statusToString = "正在发货"
                    else if ($scope.freights[i].status == Freight.STATUS_PASSING_CUSTOM)
                        statusToString = "正在清关"
                    else if ($scope.freights[i].status == YD.Freight.STATUS_FINAL_DELIVERY)
                        statusToString = "国内运寄中"
                    else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERED)
                        statusToString = "已到达"
                    else {
                    }
                    $scope.freights[i].statusToString = statusToString
                    //console.log("statusToSTring: " + $scope.freights[i].statusToString)
                }
                $scope.$apply()
                console.log("Freight delivery confirmed is shown")

            },
            error: function (error) {
                alert("ERROR: Getting Freight delivery: " + error.id + " " + error.message)
            }
        })}
    }
    $scope.reloadFreight()


})
/* Edit address controller */

YundaApp.controller('EditAddressCtrl', function ($scope, $modalInstance, address) {

    $scope.address = address
    $scope.saveAddressSubmit = function () {
        $scope.address.save().then(function (address) {
            $modalInstance.close(address)
        }, function (error) {
            alert(error.message)
        })
    }
})
YundaApp.controller('SplitPackageCtrl', function ($scope, $modalInstance, freightIn) {
    $scope.notes
    $scope.amount = 0
    $scope.getRecipient()

    $scope.freightList = []
    $scope.generateFreightList = function () {
        console.log("changed to: " + $scope.amount)
        $scope.freightList = []
        for (var i = 0; i < $scope.amount; i++) {
            $scope.freightList[i] = new YD.Freight()
            $scope.freightList[i].freightIn = freightIn
            $scope.freightList[i].status = 0
            var statusList = []
            statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
            $scope.freightList[i].statusGroup = statusList

            $scope.freightList[i].user = freightIn.user
        }
    }
    $scope.splitChooseRecipient = function (address, freight) {
        freight.address = address

    }

    $scope.confirmSplit = function () {
        AV.Object.saveAll($scope.freightList, {
            success: function (list) {
                console.log("confirmSplit: freightList has been saved")
            },
            error: function (error) {
                console.log("ERROR: confirmSplit: freightList has not been saved")
            }
        })
        $modalInstance.close()
    }
})

YundaApp.controller('SplitPackagePremiumCtrl', function ($scope, $modalInstance) {
    $scope.notes
    $scope.amount = 0
    $scope.getRecipient()
    $scope.freightList = []
    $scope.generateFreightList = function () {
        console.log("changed to: " + $scope.amount)
        $scope.freightList = []
        for (var i = 0; i < $scope.amount; i++) {
            $scope.freightList[i] = new YD.Freight()
            $scope.freightList[i].freightIn = freightIn;
            $scope.freightList[i].status = 0;
            var statusList = [];
            statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
            $scope.freightList[i].user = freigntIn.user;
        }
    }

    $scope.splitChooseRecipient = function (address, freight) {
        freight.address = address;

    }

    $scope.confirmSplit = function () {
        AV.Object.saveAll($scope.freightList, {
            success: function (list) {
                console.log("confirmSplit: freightList has been saved")
            },
            error: function (error) {
                console.log("ERROR: confirmSplit: freightList has not been saved")

            }
        })
        $modalInstance.close()
    }
})
/* update password*/
YundaApp.controller('UpdatePasswordCtrl', function ($scope, $modalInstance) {
    $scope.savePassword = function () {
        $scope.currentUser.password = $scope.newPassword;
        $scope.currentUser.save().then(function (user) {
            $modalInstance.close(user)
        })
    }
})

YundaApp.controller('RechargeCtrl', function ($scope, $modal) {
    $scope.FIXED_RATE = 6.4;
    $scope.$watch('CNY', function (newVal, oldVal) {
        console.log("CNY new value : " + newVal)
        $scope.USD = (newVal / $scope.FIXED_RATE).toFixed(2)
        console.log("USD : " + $scope.USD)
    }, true)


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
        })

        modalInstance.result.then(function () {
            //$scope.reloadAddress()
            //console.log("addNewAddress(): new address is added")
        })
    }
})


YundaApp.controller('StripeCtrl', function ($scope, $rootScope, $modalInstance) {

    $scope.stripeCallback = function (status, response) {
        //$http.post('https://api.stripe.com/v1/charges', { token: response.id })
        console.log("STRIPECTRL Token: " + response.id)
        AV.Cloud.run('createCharge', {
                //source: response.id,
                source: response.id,
                amount: $scope.USD * 100,
                currency: 'usd',
                description: $scope.currentUser.realName
            },
            {
                success: function (data) {
                    var transaction = new YD.Transaction()
                    transaction.record = data;
                    transaction.status = YD.Transaction.STATUS_STRIPE;
                    transaction.amount = $scope.USD;
                    transaction.save(null, {
                        success: function (t) {
                            console.log("transaction saved")
                            $modalInstance.close()
                        },
                        error: function (t, error) {
                            console.log("transaction not saved " + error.id + ' - ' + error.message)
                        }
                    })
                },
                error: function (error) {

                }
            })
    }
})

YundaApp.controller('ZhifubaoCtrl', function ($scope) {
    $scope.zhifubaoPayment = function () {
        var transaction = new YD.Transaction()
        transaction.status = YD.Transaction.STATUS_ZHIFUBAO;
        transaction.save(null, {
            success: function (t) {
                console.log("transaction saved")
            },
            error: function (t, error) {
                console.log("transaction not saved " + error.id + ' - ' + error.message)
            }
        })

    }
})

YundaApp.controller('ConsumeRecordCtrl', function ($scope) {

    $scope.open1 = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.opened1 = true;
    }

    $scope.open2 = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.opened2 = true;
    }
    //$scope.showCMD = function() {
    //    console.log('Show dt1: ' + $scope.dt1)
    //}
    $scope.reloadTransaction = function () {
        if($scope.currentUser.id != undefined){
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            $scope.dt1 = new Date($scope.dt1)
            $scope.dt2 = new Date($scope.dt2)
            $scope.dt1.setHours(hour)
            $scope.dt1.setMinutes(minute)
            $scope.dt2.setHours(hour)
            $scope.dt2.setMinutes(minute)
            //console.log("date 1: " + $scope.dt1)
            //console.log("date 2: " + $scope.dt2)
            console.log("reloadTransaction: Transaction")

            var query = new AV.Query("Transaction")
            query.greaterThanOrEqualTo("createdAt", $scope.dt1)
            query.lessThanOrEqualTo("createdAt", $scope.dt2)
            query.containedIn("status", [YD.Transaction.STATUS_CONSUME])

            query.find({
                success: function (tList) {
                    $scope.transactionList = tList;
                    for (var i = 0; i < tList.length; i++) {
                        if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME) {
                            $scope.transactionList[i].status = '消费';
                        }
                    }
                    $scope.$apply()

                    console.log("DatePicker: get all transaction successful: " + tList.length)
                },
                error: function (tList, err) {
                    console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

                }
            })
        }
        else {
            alert("choose date first")
        }}
    }
})

YundaApp.controller('RechargeRecordCtrl', function ($scope) {
    $scope.open1 = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.opened1 = true;
        console.log("opened1: " + $scope.opened1)

    }

    $scope.open2 = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.opened2 = true;
        console.log("opened2: " + $scope.opened2)


    }
    $scope.reloadTransaction = function () {
        if($scope.currentUser.id != undefined){
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            $scope.dt1 = new Date($scope.dt1)
            $scope.dt2 = new Date($scope.dt2)
            $scope.dt1.setHours(hour)
            $scope.dt1.setMinutes(minute)
            $scope.dt2.setHours(hour)
            $scope.dt2.setMinutes(minute)
            //console.log("date 1: " + $scope.dt1)
            //console.log("date 2: " + $scope.dt2)
            console.log("TRANSACTION 2: FREIGHT")

            var query = new AV.Query("Transaction")
            query.greaterThanOrEqualTo("createdAt", $scope.dt1)
            query.lessThanOrEqualTo("createdAt", $scope.dt2)
            query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_STRIPE])
            query.find({
                success: function (tList) {
                    $scope.transactionList = tList
                    for (var i = 0; i < tList.length; i++) {
                        if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME) {
                            $scope.transactionList[i].status = '消费'
                        }
                        else if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO) {
                            $scope.transactionList[i].status = '支付宝充值'
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_STRIPE) {
                            $scope.transactionList[i].status = '信用卡充值'

                        } else {
                        }

                    }
                    $scope.$apply()
                    console.log("DatePicker: get all transaction successful: " + tList.length)
                },
                error: function (tList, err) {
                    console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

                }
            })
        }
        else {
            alert("choose date first")
        }
    }}
})

YundaApp.controller('AdminCtrl', function($scope) {
    $scope.oneAtATime = true
    $scope.view_tab = "aa"
    $scope.change_tab = function (tab) {
        $scope.view_tab = tab
    }

})

YundaApp.controller('AdminFreightInArriveCtrl', function ($scope) {
    $scope.freightIn;
    var user
    var query = new AV.Query("FreightIn")
    query.containedIn("status", [YD.FreightIn.STATUS_MANUAL, YD.FreightIn.STATUS_ARRIVED]);
    query.include("user")
    query.find({
        success: function (list) {
            $scope.freightIn = list
        }
    })
    $scope.saveComment = function () {
        for(var i = 0; i < $scope.freightIn.length; i++) {
            console.log("f comments is: " + $scope.freightIn[i].comments)
        }
        AV.Object.saveAll($scope.freightIn, {
            success: function(list) {
                console.log("list of comment saved")
            },
            error: function(error) {

            }
        })
    }

})

YundaApp.controller('AdminFreightInConfirmCtrl', function ($scope) {
    $scope.freightIn;
    var query = new AV.Query("FreightIn")
    query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED)
    query.include("user")
    query.find({
        success: function (list) {
            $scope.freightIn = list
        }
    })
    $scope.saveComment = function () {
        for(var i = 0; i < $scope.freightIn.length; i++) {
            console.log("f comments is: " + $scope.freightIn[i].comments)
        }
        AV.Object.saveAll($scope.freightIn, {
            success: function(list) {
                console.log("list of comment saved")
            },
            error: function(error) {

            }
        })
    }
})

YundaApp.controller("AdminFreightConfirmCtrl", function($scope, $rootScope, $window) {
    $scope.getStatus = function () {
        for (var i = 0; i < $scope.freight.length; i++) {
            //$scope.freight[i].statusToString = " "
            var statusList = $scope.freight[i].statusGroup
            var statusString = ' '

            if ($scope.freight[i].statusGroup != undefined) {
                for (var j = 0; j < statusList.length; j++) {
                    if (statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
                        statusString += "等待用户最后确认; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
                        statusString += "等待加固; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
                        statusString += "等待减重; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
                        statusString += "等待开箱检查; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "等待普通分箱; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED) {
                        statusString += "等待精确分箱; "
                        console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }
                }
            }

            //statusString.substr(0, statusString.length - 22)   //remove trailing comma
            $scope.freight[i].statusToString = statusString
            console.log("HERE IS STRING LENGTH: " + $scope.freight[i].statusToString.length)
        }

    }
    $scope.reloadFreight = function() {
    var query = new AV.Query("Freight")
    query.equalTo("status", YD.Freight.STATUS_INITIALIZED)
    query.include("user")
    query.find({
        success: function(list) {

            $scope.freight = list
            for (var i = 0; i < $scope.freight.length; i++) {
                $scope.freight[i].selection = false
            }
            $scope.getStatus()
        },
        error: function(error){
            console.log("AdminFregihtConfirmCtr ERR: "  + error.message)
        }
    })
    }
    $scope.reloadFreight()
    $scope.printAll = function() {
        $rootScope.freightList = []
        for (var i = 0; i < $scope.freight.length; i++) {
            if ($scope.freight[i].selection == true) {
                console.log("This one " + i + "has been added")
                    //$scope.generateFreight($scope.freightIn[i])
                    //$scope.reloadFreightInConfirmed()
                $rootScope.freightList.push($scope.freight[i])
            }
        }
        $scope.reloadFreight()
        $scope.$apply()

        //$window.location.href = '/partials/print'
    }
})

YundaApp.controller('AdminFreightFinishCtrl', function ($scope) {
    $scope.reloadFreight = function() {
        console.log("finished print" )
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_PENDING_FINISHED)
        query.include("user")
        query.find({
            success: function(list) {
                $scope.freight = list
            },
            error: function(error) {
                console.log("AdminAdminFreightFinishCtrl ERROR: " + error.message)
            }
        })
    }
    $scope.reloadFreight()

})

YundaApp.controller('AdminFreightPaidCtrl', function($scope, $rootScope) {
    $scope.reloadPaidFreight = function() {
        console.log("realod paid")
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_PENDING_DELIVERY)
        query.include("user")
        query.find({
            success: function(list) {
                $scope.freight = list
                for (var i = 0; i < $scope.freight.length; i++) {
                    $scope.freight[i].selection = false
                }
            },
            error: function(error) {
                console.log("AdminFreightPaid ERROR: " + error.message)
            }
        })
    }
    $scope.reloadPaidFreight()
    $scope.printAll = function() {
        $rootScope.freightList = []
        for (var i = 0; i < $scope.freight.length; i++) {
            if ($scope.freight[i].selection == true) {
                console.log("This one " + i + "has been added")
                //$scope.generateFreight($scope.freightIn[i])
                //$scope.reloadFreightInConfirmed()
                $rootScope.freightList.push($scope.freight[i])
            }
        }
        $scope.reloadPaidFreight()
        $scope.$apply()

    }
})

YundaApp.controller('AdminFreightClearCtrl', function($scope) {
    var clearList = []
    $scope.reloadDeliveryFreight = function() {
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_DELIVERING)
        query.include("user")
        query.find({
            success: function(list) {
                $scope.freight = list
                for (var i = 0; i < $scope.freight.length; i++) {
                    $scope.freight[i].selection = false
                }
            },
            error: function(error) {
                console.log("AdminFreightPaid ERROR: " + error.message)
            }
        })
    }
    $scope.reloadDeliveryFreight()
    $scope.deliver = function() {
        for (var i = 0; i < $scope.freight.length; i++) {
            if ($scope.freight[i].selection == true) {
                console.log("This one " + i + "has been added")
                //$scope.generateFreight($scope.freightIn[i])
                //$scope.reloadFreightInConfirmed()
                $scope.freight[i].status = YD.Freight.STATUS_PASSING_CUSTOM
                clearList.push($scope.freight[i])
            }
        }
        AV.Object.saveAll(clearList, {
            success: function (list) {
                console.log("AdminFreightClearCtrl: freightList has been saved")
                $scope.reloadDeliveryFreight()
                $scope.$apply()
            },
            error: function (error) {
                console.log("ERROR: AdminFreightClearCtrl: freightList has not been saved" + error.message)
            }
        })
    }
})

YundaApp.controller('AdminChineseFreightCtrl', function($scope, $modal) {
    $scope.reloadChineseFreight = function() {
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_PASSING_CUSTOM)
        query.include("user")
        query.find({
            success: function(list) {
                $scope.freight = list
                for (var i = 0; i < $scope.freight.length; i++) {
                    $scope.freight[i].selection = false
                }
            },
            error: function(error) {
                console.log("AdminFreightPaid ERROR: " + error.message)
            }
        })
    }
    $scope.reloadChineseFreight()
    $scope.addInfo = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addInfo',
            controller: 'AddInfoCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })


        modalInstance.result.then(function () {
            $scope.reloadChineseFreight()
            $scope.$apply()
            console.log("AdminChineseFreightCtrl: merge successfully")
        })
    }
    $scope.finalDeliver = function() {
        var deliveryList = []
        for (var i = 0; i < $scope.freight.length; i++) {
            if ($scope.freight[i].selection == true) {
                $scope.freight[i].status = YD.Freight.STATUS_FINAL_DELIVERY
                deliveryList.push($scope.freight[i])
            }
        }
        AV.Object.saveAll(deliveryList, {
            success: function (list) {
                console.log("AdminChineseFreightCtrl: freightList has been saved")
                $scope.reloadChineseFreight()
                $scope.$apply()
            },
            error: function (error) {
                console.log("ERROR: AdminChineseFreightCtrl: freightList has not been saved" + error.message)
            }
        })
    }
})

YundaApp.controller('AdminFinalDeliveryCtrl', function($scope) {
    $scope.reloadFinalDelivery = function() {
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_FINAL_DELIVERY)
        query.include("user")
        query.find({
            success: function(list) {
                $scope.freight = list
                console.log("reloadFinalDelivery: " + list.length)
            },
            error: function(error) {
                console.log("AdminFreightPaid ERROR: " + error.message)
            }
        })
    }
    $scope.reloadFinalDelivery()
})

YundaApp.controller('AddInfoCtrl', function($scope, $modalInstance, freight) {
     $scope.freight = freight
     $scope.confirmAddInfo = function() {
         $scope.freight.status  = YD.Freight.STATUS_FINAL_DELIVERY
         $scope.freight.save(null, {
             success: function(result) {
                 $modalInstance.close()
             },
             error: function(result, error) {
                 console.log("AddInfoCtrl ERROR: " + error.message)
             }
         })
     }
    $scope.cancelAddInfo = function() {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('PrintController', function($scope, $rootScope) {
    $scope.freightList = $rootScope.freightList
    for(var i = 0; i < $scope.freightList.length; i++) {
        console.log("In Print: " + $scope.freightList[i].trackingNumber)
    }

})
// AngularJS Google Maps loader

YundaApp.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    })
})


YundaApp.controller('ContactController', function ($scope, uiGmapGoogleMapApi) {
    $scope.map = {center: {latitude: -33.8764458, longitude: 151.2047273}, zoom: 17}

    $scope.marker = {
        id: 0,
        coords: {
            latitude: -33.8764458,
            longitude: 151.2047273
        }
    }
    uiGmapGoogleMapApi.then(function (maps) {

    })
})

