'use strict';

/* Controllers */

YundaApp.controller('AppCtrl', function ($scope, $rootScope, $location, $http, $modal) {

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
    $scope.printPage = $location.path() == '/print'
    $scope.$on('$routeChangeSuccess', function () {
        $scope.printPage = $location.path() == '/print'
    });
    $rootScope.view_tab = "aa"
    $rootScope.change_tab = function (tab) {
        if(tab == "aa" || tab == "ab" || tab == "ac"){
            $rootScope.openTab.setA = true
            $rootScope.openTab.setB = false
            $rootScope.openTab.setC = false
            $rootScope.openTab.setD = false

        } else if(tab == "ba" || tab == "bb" || tab == "bc" || tab == "bd"){
            $rootScope.openTab.setA = false
            $rootScope.openTab.setB = true
            $rootScope.openTab.setC = false
            $rootScope.openTab.setD = false

        } else if(tab == "ca" || tab == "cb" || tab == "cc"){
            $rootScope.openTab.setA = false
            $rootScope.openTab.setB = false
            $rootScope.openTab.setC = true
            $rootScope.openTab.setD = false

        } else if(tab == "da" || tab == "db" || tab == "dc"){
            $rootScope.openTab.setA = false
            $rootScope.openTab.setB = false
            $rootScope.openTab.setC = false
            $rootScope.openTab.setD = true

        }
        $rootScope.view_tab = tab
    }
    $rootScope.openTab = {
        setA : false,
        setB : false,
        setC : false,
        setD : false

    }
    $rootScope.isAdmin = false
        $rootScope.$watch("currentUser", function() {
            if($rootScope.currentUser != undefined) {
                if($rootScope.currentUser.role != YD.User.ROLE_ADMIN){
                    $rootScope.isAdmin = false
                } else {
                    $rootScope.isAdmin = true
                }
            }

        })
    //$rootScope.isSmallPackageAllowed = true
    //var setting = new YD.SystemSetting()
    //setting.isSmallPackageAllowed = $rootScope.isSmallPackageAllowed
    //setting.save(null, {
    //    success: function(s) {
    //        console.log("setting saved")
    //    }
    //})
    $rootScope.reloadSystemSetting = function () {
        var SYSTEM_SETTING_ID = "557a8a2fe4b0fe935ead7847"
        var query = new AV.Query(YD.SystemSetting)
        query.get(SYSTEM_SETTING_ID, {
            success: function (s) {
                $rootScope.systemSetting = s
                $rootScope.isSmallPackageAllowed = s.isSmallPackageAllowed
                $scope.$apply()
            },
            error: function (s, error) {

            }
        })
    }
    $rootScope.reloadSystemSetting()
    $scope.openWeChat = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_wechat',
            controller: 'WechatCtrl',
            scope: $scope,
            size: "sm",
            windowClass: 'center-modal'
        });
    }
    $rootScope.badgeTotalCount = 0
    $rootScope.badgeAdminTotalCount = 0

})

/* Navbar Controller*/

YundaApp.controller('NavbarCtrl', function ($scope, $rootScope, $modal, $window) {

    if (YD.User.current() != undefined) {
        $rootScope.currentUser = YD.User.current()
    } else {
        $rootScope.currentUser = new YD.User()
    }
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_login',
            controller: 'LoginCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (user) {
            //console.log("modal is closed. ")
            if (user != undefined) {
                    $rootScope.currentUser = user
                if($rootScope.currentUser.role != YD.User.ROLE_ADMIN){
                    $rootScope.isAdmin = false
                } else {
                    $rootScope.isAdmin = true
                }
                console.log("$rootScope.isAdmin: "+ $rootScope.isAdmin)
                var address = new YD.Address()
                address.id = $rootScope.currentUser.addressId
                address.fetch().then(function (address) {
                    $rootScope.currentUser.address = address
                })

            } else {
                //console.log("modal user undefined")
            }
        })
    }
    $scope.logOut = function () {
        YD.User.logOut()
        // Do stuff after successful login.
        $rootScope.currentUser = new YD.User()
        if($rootScope.currentUser.role != YD.User.ROLE_ADMIN){
            $rootScope.isAdmin = false
        } else {
            $rootScope.isAdmin = true
        }

        $window.location.href = '/'
    }

    $scope.isActive = function () {
        return true
        //if($scope.currentUser != undefined){
        //    return true
        //} else return false
    }


})

YundaApp.controller('WechatCtrl', function ($scope, $modalInstance) {
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})


/* Login Controller*/
YundaApp.controller('LoginCtrl', function ($scope, $modalInstance, $modal) {
    $scope.dismissViewController = function () {
        $scope.isLoading = false;
        $scope.promote = undefined;
        $modalInstance.close();
    }
    $scope.login = function () {
        $scope.isLoading = true;
        $scope.promote = "Logging in";
        YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
            success: function (user) {

                $modalInstance.close(user)
            },
            error: function (user, error) {
                $scope.$apply(function () {
                    // The login failed. Check error to see why.
                    $scope.isLoading = false;
                    alert("登陆失败！ " + error.message);
                });
            }
        })
    }


    $scope.signup = function () {
        $scope.isLoading = true;
        $scope.promote = "Signing up";

        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_signup',
            controller: 'SignupCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.currentUser.set("email", $scope.currentUser.username)
            $scope.currentUser.role = YD.User.ROLE_USER
            $scope.currentUser.signUp(null, {
                success: function (user) {
                    // Hooray! Let them use the app now.
                    $scope.dismissViewController();
                    alert("已注册成功，请登陆!")
                },
                error: function (user, error) {
                    // Show the error message somewhere and let the user try again.
                    $scope.$apply(function () {
                        // Show the error message somewhere and let the user try again.
                        $scope.isLoading = false;
                        alert("注册失败： " + error.message);
                    });
                }
            })
        })
    }


    $scope.resetPassword = function () {
        $scope.isLoading = true;
        $scope.promote = "Requesting password";
        YD.User.requestPasswordReset($scope.currentUser.username, {
            success: function () {
                alert("密码重设成功，请查收email")
                $scope.dismissViewController();
            },
            error: function (error) {
                $scope.$apply(function () {
                    $scope.isLoading = false;
                    alert("Reset failed " + error.message);
                });
            }
        });
    }
})

YundaApp.controller('SignupCtrl', function ($scope, $modalInstance) {
    $scope.passwordRepeat
    //$scope.isPasswordIdentical = $scope.currentUser.password == $scope.passwordRepeat

    $scope.signup = function () {
        if ($scope.currentUser.password != $scope.passwordRepeat) {
            alert("确认密码失败，请重新输入！")
            return
        } else {
            $modalInstance.close()
        }
    }
    $scope.dismissViewController = function () {
        $scope.isLoading = false;
        $scope.promote = undefined;
        $modalInstance.dismiss();
    }
})

YundaApp.controller('HomeCtrl', function ($rootScope, $scope, $modal, $window) {
    $scope.trackingNumber
    $scope.trackingList
    $scope.resultList = []
    console.log("In Home Ctrl -- balanceInDollar: " + $scope.currentUser.balanceInDollar)

    $scope.logOut = function () {
        YD.User.logOut()
        // Do stuff after successful login.
        $rootScope.currentUser = new YD.User()
        if($rootScope.currentUser.role != YD.User.ROLE_ADMIN){
            $rootScope.isAdmin = false
        } else {
            $rootScope.isAdmin = true
        }

        $window.location.href = '/'
    }
    //$scope.updatePassword = function () {
    //    var modalInstance = $modal.open({
    //        templateUrl: 'partials/modal_password',
    //        controller: 'UpdatePasswordCtrl',
    //        scope: $scope,
    //        size: 'sm',
    //        windowClass: 'center-modal'
    //
    //    })
    //    modalInstance.result.then(function () {
    //        console.log("updatePassword(): user's password has been updated")
    //    })
    //}

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
//\            for (var i = 0; i < $scope.resultList.length; i++) {
//                //console.log("Result: " + i + " - " + $scope.resultList[i].info + $scope.resultList[i].trackingNumber)
//
//            }
            //6917246211814
            //8498950010019

            var modalInstance = $modal.open({
                templateUrl: 'partials/modal_tracking',
                controller: 'TrackingCtrl',
                scope: $scope,
                windowClass: 'center-modal',
                size: 'lg',
                resolve: {
                    resultList: function () {
                        return $scope.resultList
                    }
                }
            })
        }
    }

    $scope.login = function () {
        $scope.isLoading = true;
        $scope.promote = "Logging in";
        YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
            success: function (user) {
                $rootScope.currentUser = user
                if($rootScope.currentUser.role != YD.User.ROLE_ADMIN){
                    $rootScope.isAdmin = false
                } else {
                    $rootScope.isAdmin = true
                }
                console.log("$rootScope.isAdmin: "+ $rootScope.isAdmin)

                var address = new YD.Address()
                address.id = $rootScope.currentUser.addressId
                address.fetch().then(function (address) {
                    $rootScope.currentUser.address = address
                })

                //$scope.dismissViewController();
                $scope.$apply()
                console.log("successfuly login via main page login")
            },
            error: function (user, error) {
                $scope.$apply(function () {
                    // The login failed. Check error to see why.
                    $scope.isLoading = false;
                    alert("登陆失败！ " + error.message);
                });
            }
        })
    }

    $scope.signup = function () {
        $scope.isLoading = true;
        $scope.promote = "Signing up";

        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_signup',
            controller: 'SignupCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.currentUser.set("email", $scope.currentUser.username)
            $scope.currentUser.role = YD.User.ROLE_USER
            $scope.currentUser.signUp(null, {
                success: function (user) {
                    // Hooray! Let them use the app now.
                    $scope.dismissViewController(user);
                    alert("已注册成功，请登陆!")
                },
                error: function (user, error) {
                    // Show the error message somewhere and let the user try again.
                    $scope.$apply(function () {
                        // Show the error message somewhere and let the user try again.
                        $scope.isLoading = false;
                        alert("注册失败： " + error.message);
                    });
                }
            })
        })
    }
    $scope.resetPassword = function () {
        $scope.isLoading = true;
        $scope.promote = "Requesting password";
        YD.User.requestPasswordReset($scope.currentUser.username, {
            success: function () {
                alert("密码重设成功，请查收email")
                $scope.dismissViewController();
            },
            error: function (error) {
                $scope.$apply(function () {
                    $scope.isLoading = false;
                    alert("Reset failed " + error.message);
                });
            }
        });
    }
    $scope.newsList = []
    $scope.newsList[0] = {
        title: "news 1"
    }
    $scope.newsList[1] = {
        title: "news 2"
    }
})

YundaApp.controller('TrackingCtrl', function ($scope, $modalInstance, resultList) {
    console.log("resultlist: " + resultList.length)
    $scope.resultList = resultList
    $scope.close = function () {
        $modalInstance.close()
    }
})

YundaApp.controller('MyTrackingCtrl', function ($scope) {
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
    $scope.addSlide = function () {
        var newWidth = 600 + slides.length + 1
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/300',
            text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        })
    }
    for (var i = 0; i < 4; i++) {
        $scope.addSlide()
    }
})
YundaApp.controller('ManualCtrl', function ($scope) {
    $scope.freightIn = new YD.FreightIn()
    $scope.submitFreightIn = function () {
        $scope.freightIn.status = YD.FreightIn.STATUS_MANUAL
        $scope.freightIn.user = $scope.currentUser
        $scope.freightIn.save(null, {
            success: function (f) {
                console.log("MANUAL frieghtin saved ")
            },
            error: function (f, error) {
                console.log("MANUAL frieghtin NOT saved " + error.message)

            }
        })
    }
})

YundaApp.controller('ReturnGoodsCtrl', function ($scope) {
    $scope.reloadFreightReturn = function () {
        var query = new AV.Query("FreightReturn")
        query.equalTo("user", $scope.currentUser)
        query.equalTo("status", YD.FreightReturn.STATUS_PENDING)
        if ($scope.currentUser.id != undefined) {
            query.find({
                success: function (result) {

                    console.log("RETURN find return list, length: " + result.length)
                    $scope.returnList = result
                    for (var i = 0; i < $scope.returnList.length; i++) {
                        if ($scope.returnList[i].status == YD.FreightReturn.STATUS_PENDING) {
                            $scope.returnList[i].status = "等待韵达处理"
                        } else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_AWAITING) {
                            $scope.returnList[i].status = "等待用户确认"
                        }
                    }
                    $scope.$apply()
                },
                error: function (error) {

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
                /*-------------------------------------------------*/
                /*  change user's freight and freightIn to cancel  */
                /*-------------------------------------------------*/
                var query1 = new AV.Query(YD.Freight)
                query1.equalTo("user", $scope.currentUser)
                query1.equalTo("trackingNumber", $scope.returnFreight.trackingNumber)
                query1.find({
                    success: function(list) {
                        for(var i = 0; i < list.length; i++) {
                            list[i].status = YD.Freight.STATUS_CANCELED
                            list[i].save()
                        }
                    },
                    error: function(error) {
                        alert("ERROR: " + error.message)
                    }
                })
                var query2 = new AV.Query(YD.FreightIn)
                query2.equalTo("user", $scope.currentUser)
                query2.equalTo("trackingNumber", $scope.returnFreight.trackingNumber)
                query2.find({
                    success: function(list) {
                        for(var i = 0; i < list.length; i++) {
                            list[i].status = YD.FreightIn.STATUS_CANCELED
                            list[i].save()
                        }
                        alert("退货申请成功，请等待处理")
                    },
                    error: function(error) {
                        alert("ERROR: " + error.message)
                    }
                })
            },
            error: function (returnFreight, error) {
                console.log("RETURN NOT saved" + error.message)
            }
        })
        $scope.reloadFreightReturn()
    }
    $scope.confirmReturn = function (freight) {
        if (freight.status == YD.FreightReturn.STATUS_PENDING) {
            alert("客服还未处理，请耐心等待")
        } else {
            $scope.currentUser.balance -= freight.amount
            $scope.currentUser.save(null, {
                success: function (user) {
                    console.log("RETURN user has been charged")
                    alert("退货成功！相应费用已扣除")
                },
                error: function (user, error) {
                    console.log("RETURN user has NOT been charged: " + error.message)
                }
            })
        }

    }
})

YundaApp.controller('ReturnBalanceCtrl', function($scope) {
    $scope.reloadReturnBalance = function() {
        var query = new AV.Query("Transaction")
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status",
            [YD.Transaction.STATUS_PENDING_RETURN_BALANCE, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE])
        query.find({
            success: function(list) {
                $scope.transactionList = list
                for(var i = 0; i < $scope.transactionList.length; i++) {
                    if($scope.transactionList[i].status == YD.Transaction.STATUS_PENDING_RETURN_BALANCE)
                    $scope.transactionList[i].status = "正在等待处理"
                   else if($scope.transactionList[i].status == YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE)
                    $scope.transactionList[i].status = "已退款"

                    var tmp = $scope.transactionList[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                    if(tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();
                    $scope.transactionList[i].createdAt = tmp_date
                    //console.log("In ReturnBalance Ctrl -- image" + "[" + i + "]" + $scope.transactionList[i].adminEvidence.url())
                    $scope.transactionList[i].adminEvidence = $scope.transactionList[i].adminEvidence.url()
                }
                console.log("Return Balance reloaded: " + list.length)
                $scope.$apply()
            },
            error: function(error) {
                console.log("return balance ERROR: " + error.message)
            }
        })
    }
    $scope.reloadReturnBalance()

        $scope.returnBalance = new YD.Transaction()
        $scope.applyReturn = function () {
            $scope.returnBalance.amount = parseInt($scope.returnAmount)
            if ($scope.returnBalance.amount > $scope.currentUser.balanceInDollar) {
                alert("数额超过账号金额，现为：" + $scope.currentUser.balanceInDollar + "，请重新申请")
                return
            } else {
                $scope.returnBalance.user = $scope.currentUser
                $scope.returnBalance.status = YD.Transaction.STATUS_PENDING_RETURN_BALANCE
                $scope.returnBalance.save(null, {
                    success: function (t) {
                        alert("申请成功！请等待处理")
                        $scope.reloadReturnBalance()
                        $scope.$apply()
                    },
                    error: function (t, error) {
                        alert("申请失败：" + error.message)
                    }
                })
            }
    }
})

/* Dashboard Controller*/
YundaApp.controller('DashboardCtrl', function ($scope, $rootScope, $modal) {
    $scope.badgeACount = 0
    $scope.badgeBCount = 0
    $scope.badgeCCount = 0
    $scope.badgeDCount = 0
    $scope.badgeECount = 0
    $scope.oneAtATime = true
    //$scope.change_tab = function (tab) {
    //    $scope.view_tab = tab
    //}
    $scope.$watch('badgeTotalCount', function (newVal) {
        console.log("In Dashboard $watch BadgeTotal now: " + newVal)
    })

    /* getting user's address */


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
        if ($scope.currentUser.id != undefined) {
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
                alert("更新成功！")


            },
            error: function (user, error) {
                console.log("update_user() fail: " + error.id + error.message)
            }
        })
    }
})

YundaApp.controller('freightInArrivedCtrl', function ($scope, $rootScope, $filter) {
    $scope.reloadFreightInArrived = function () {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("FreightIn")
            query.equalTo("user", $scope.currentUser)
            query.equalTo("status", YD.FreightIn.STATUS_ARRIVED)

            query.find({
                success: function (results) {
                    $scope.$apply(function () {
                    //console.log("FreightIn arrived is shown TRACKING: " + results[0].status)
                    $scope.freightIns = results
                    for (var i = 0; i < $scope.freightIns.length; i++) {
                        var tmp = $scope.freightIns[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        _
                        $scope.freightIns[i].createdAt = tmp_date
                    }


                        $rootScope.badgeTotalCount -= $scope.badgeACount
                        $scope.badgeACount = results.length
                        $rootScope.badgeTotalCount += $scope.badgeACount
                        console.log("Badge A now: " + $scope.badgeACount)
                        console.log("BadgeTotal now: " + $rootScope.badgeTotalCount)

                    })
                    console.log("FreightIn arrived is shown")


                },
                error: function (error) {
                    alert("Getting Freight In Error: " + error.code + " " + error.message)
                }
            })
        }
    }
    $scope.reloadFreightInArrived()
    $scope.freightInConfirm = function (freightIn) {
        if ($scope.currentUser.id != undefined) {
            freightIn.status = YD.FreightIn.STATUS_CONFIRMED
            freightIn.save().then(function (freightIn) {
                console.log("freightInConfirm()-- freightIn.status updated: " + freightIn.status)
                $scope.reloadFreightInArrived()

            }, function (freightIn, error) {
                console.log(error.message)
            })
        }
    }
})

YundaApp.controller('freightInConfirmedCtrl', function ($scope, $rootScope, $modal, $filter) {
    $scope.PRICE = 10
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
            $scope.getRecipient()
            console.log("addNewAddress(): new address is added")
        })
    }

    $scope.getRecipient = function () {

        var query = new AV.Query("Address")
        query.equalTo("user", $scope.currentUser)
        query.find({
            success: function (results) {
                $scope.addressList = results
            },
            error: function (res, error) {
                alert("Getting Recipient: " + error.code + " " + error.message)
            }
        })
    }
    $scope.reloadFreightInConfirmed = function () {
        if ($scope.currentUser.id != undefined) {
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
                        var tmp = $scope.freightIns[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freightIns[i].createdAt = tmp_date
                        $scope.freightIns[i].status = "已确认入库"

                    }

                    $scope.getRecipient()
                    $scope.$apply(function () {
                        $rootScope.badgeTotalCount -= $scope.badgeBCount
                        $scope.badgeBCount = results.length
                        $rootScope.badgeTotalCount += $scope.badgeBCount
                        console.log("Badge B now: " + $scope.badgeBCount)
                        console.log("BadgeTotal now: " + $rootScope.badgeTotalCount)
                    })
                    console.log("FreightIn confirmed is shown")
                },
                error: function (error) {
                    alert("Getting Freight In Error: " + error.id + " " + error.message)
                }
            })
        }
    }
    $scope.reloadFreightInConfirmed()
    $scope.chooseAddress = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseRecipientAddress',
            controller: 'ChooseAddressCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                addressList: function () {
                    return $scope.addressList
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenAddress) {
            freightIn.address = chosenAddress
            alert("已成功选取收件人")
        })
    }

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
        //console.log("address is chosen, address: " + address.id)
        //console.log("address is chosen, freightIn: " + freightIn.id)
        //console.log("address is chosen: " + $scope.freightIns[index].address)
        freightIn.address = address
    }

    $scope.generateFreight = function (freightIn) {
        if (freightIn.address == undefined) {
            alert("Choose address first")
            console.log("address is undefined")
        } else {
            var freight = new YD.Freight()
            //freight.address = null
            //freight.freightIn = freightIn
            freight.address = freightIn.address
            freight.estimatedPrice = freightIn.weight * $scope.PRICE

            console.log("est price: " + freight.estimatedPrice)
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
            //freight.estimatedPrice = freightIn.weight * $scope.PRICE
            freight.status = YD.Freight.STATUS_INITIALIZED
            freight.save(null, {
                success: function (freight) {
                    console.log("freight has been saved: " + freight.id)
                    $scope.badgeCount += 1
                    freightIn.status = YD.FreightIn.STATUS_FINISHED
                    freightIn.save(null, {
                        success: function (freightIn) {
                            console.log("freightIn has been saved: " + freightIn.id)
                            $scope.badgeCount -= 1
                        },
                        error: function (freightIn, error) {
                            console.log("ERROR: freightIn not save: " + error.code + " - " + error.message)
                        }
                    })
                },
                error: function (freight, error) {
                    console.log("ERROR: freight not save: " + error.code + " - " + error.message)
                }
            })
            $scope.reloadFreightInConfirmed()

        }
    }

    $scope.generateDeliveryFreight = function (freightIn) {
        if (freightIn.address == undefined) {
            alert("Choose address first")
        } else {
            //var test = AV.Object.extend("Freight")
            //var freight = new test()
            var freight = new YD.Freight
            freight.address = null
            //freight.freightIn = freightIn
            //freight.set("freightIn", freightIn)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION)

            freight.user = $scope.currentUser
            freight.weight = freightIn.weight
            freight.trackingNumber = freightIn.trackingNumber
            //freight.estimatedPrice = freightIn.weight * $scope.PRICE
            freight.status = YD.Freight.STATUS_INITIALIZED
            freight.save(null, {
                success: function (freight) {
                    console.log("freight has been saved: " + freight.id)
                    //$scope.badgeCount -= 1
                    freightIn.status = YD.FreightIn.STATUS_FINISHED;
                    freightIn.save(null, {
                        success: function (freightIn) {
                            console.log("freightIn has been saved: " + freightIn.id)
                            //$scope.badgeCount += 1

                        },
                        error: function (freightIn, error) {
                            console.log("ERROR: freightIn not save: " + error.code + " - " + error.message)
                        }
                    })
                },
                error: function (freight, error) {
                    console.log("ERROR: freight not save: " + error.code + " - " + error.message)
                    console.log("ERROR: freight.status: " + typeof(freight.get("status")))
                }
            })

        }
        $scope.reloadFreightInConfirmed()
    }

    $scope.generateAllFreight = function () {
        for (var i = 0; i < $scope.freightIns.length; i++) {
            if ($scope.freightIns[i].selection == true) {
                if ($scope.freightIns[i].address == undefined)
                    alert("请先选择每个运单的收件地址")
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

YundaApp.controller('FreightPendingCtrl', function($scope, $rootScope) {

    $scope.getStatus = function () {

        for (var i = 0; i < $scope.freights.length; i++) {
            //$scope.freights[i].statusToString = " "
            var statusList = $scope.freights[i].statusGroup
            var statusString = ' '

            if ($scope.freights[i].statusGroup != undefined) {
                for (var j = 0; j < statusList.length; j++) {
                    if (statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
                        statusString += "等待最后确认; "
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
                        statusString += "等待加固; "
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
                        statusString += "等待减重; "
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
                        statusString += "等待开箱检查; "
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "等待普通分箱; "
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED) {
                        statusString += "等待精确分箱; "
                    }
                }
            }

            //statusString.substr(0, statusString.length - 22)   //remove trailing comma
            $scope.freights[i].statusToString = statusString
        }

    }
    $scope.reloadFreight = function() {
        var query = new AV.Query(YD.Freight)
        query.equalTo("status", YD.Freight.STATUS_INITIALIZED)
        query.equalTo("user", $scope.currentUser)
        query.find({
            success: function(list) {
                $scope.$apply(function() {
                    $scope.freights = list
                    for(var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":" ;
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freights[i].updatedAt = tmp_date

                    }
                    $rootScope.badgeTotalCount -= $scope.badgeECount
                    $scope.badgeECount = list.length
                    $rootScope.badgeTotalCount += $scope.badgeECount
                    $scope.getStatus()
                })
            }
        })
    }

    $scope.reloadFreight()
})

YundaApp.controller('ChooseAddressCtrl', function($scope, $modalInstance, addressList) {
    $scope.addressList = addressList
    $scope.chooseRecipient = function(address){
            $scope.address = address
            console.log("chosen address: " + address.recipient)

    }
    $scope.cancel = function() {
        $modalInstance.dismiss()
    }
    $scope.confirmChoose = function() {
        $modalInstance.close($scope.address)
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

        if ($scope.identityFront != undefined) {
            //console.log("In fileUpload back: " + $scope.identityFront[0].name)
            //console.log("In fileUpload front: " + $scope.identityBack[0].name)
            var frontName = $scope.currentUser.realName + 'front.jpg'
            var avFileFront = new AV.File(frontName, $scope.identityFront[0])

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

YundaApp.controller('FreightConfirmedCtrl', function ($scope, $rootScope, $modal) {
    //$scope.baojin = 0
    //$scope.baoshuijin = 0
    $scope.BAO_JIN = 0.02
    $scope.BAO_SHUI_JIN = 0.05
    //$scope.PRICE = 10
    $scope.options = [{name: "小包裹渠道"}, {name: "普通渠道"}]
    $scope.reward = {
        amount : 0
    }
    $scope.taxInsurance = {
        amount : 0
    }
    $scope.insurance = {
        value : 0,
        amount : 0
    }
    //status to string
    $scope.getStatus = function () {

        for (var i = 0; i < $scope.freights.length; i++) {
            //$scope.freights[i].statusToString = " "
            var statusList = $scope.freights[i].statusGroup
            var statusString = ' '

            if ($scope.freights[i].statusGroup != undefined) {
                for (var j = 0; j < statusList.length; j++) {
                    if (statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
                        statusString += "最后确认; \n"
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
                        statusString += "已加固;\n"
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
                        statusString += "已减重;\n"
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
                        statusString += "已开箱检查;\n"
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "已普通分箱;\n"
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED) {
                        statusString += "已精确分箱; \n"
                    }
                }
            }

            //statusString.substr(0, statusString.length - 22)   //remove trailing comma
            $scope.freights[i].statusToString = statusString
        }

    }

    //$scope.output = function() {
    //    console.log("$scope.selectedMethod: " + $scope.selectedMethod.name)
    //
    //    console.log("$scope.selectedMethod: " + ($scope.selectedMethod.name === '小包裹渠道'))
    //}
    $scope.reloadFreightConfirmed = function () {
        if ($scope.currentUser.id != undefined) {
            console.log("reloadFreightConfirmned: FREIGHT")
            var query = new AV.Query("Freight")
            query.equalTo("user", $scope.currentUser)
            query.equalTo("status", YD.Freight.STATUS_PENDING_FINISHED)
            query.include("user")
            query.find({
                success: function (results) {
                    $scope.freights = results
                    //Provide delivery method options based on $rootScope.isSmallPackageAllowed
                    if(!$rootScope.isSmallPackageAllowed) {
                        $scope.options = [{name: "普通渠道"}]
                    }
                    //get ready for payment selection checkboxes.
                    for (var i = 0; i < $scope.freights.length; i++) {
                        $scope.freights[i].selection = false
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":" ;
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freights[i].createdAt = tmp_date
                        $scope.freights[i].estimatedPrice = $scope.freights[i].weight * $scope.PRICE

                    }

                    $scope.getStatus()
                    $scope.$apply(function () {
                        $rootScope.badgeTotalCount -= $scope.badgeCCount
                        $scope.badgeCCount = results.length
                        $rootScope.badgeTotalCount += $scope.badgeCCount
                        console.log("Badge C now: " + $scope.badgeCCount)
                        console.log("BadgeTotal now: " + $rootScope.badgeTotalCount)
                    })
                    console.log("Freight confirmed is shown, length: " + $scope.freights.length)


                },
                error: function (error) {
                    alert("Getting Freight Error: " + error.code + " " + error.message)
                }
            })
        }
    }

    $scope.reloadFreightConfirmed()

    $scope.provideOptions = function(){
        if($scope.weight > 6.6 && $scope.options.length == 2){
            $scope.options = [{name: "普通渠道"}] // only 普通包裹 available
        } else if($scope.weight <= 6.6 && $scope.options.length == 1 && $rootScope.isSmallPackageAllowed) {
            $scope.options = [{name: "小包裹渠道"}, {name: "普通渠道"}]
        }
    }
    $scope.total = 0
    $scope.totalWeight = 0
    //$scope.insurance = {value: 0, amount: 0}


    $scope.$watch("insurance.value", function(newVal) {
        if(newVal.value != 0) {
            console.log("In watch: insuranceValue: " + $scope.insurance.value)
            $scope.insurance.amount = ($scope.insurance.value * $scope.BAO_JIN).toFixed(2)
            console.log("In watch: insuranceAmount: " + $scope.insurance.amount)

        } else
            console.log("In watch: newVal == 0")

    })

    $scope.selecting = function (freight) {
        if (freight.selection == true) {
            $scope.total += freight.estimatedPrice
            $scope.totalWeight += freight.weight
            //$scope.totalAmount += 1
            $scope.provideOptions()
        }
        if (freight.selection == false) {
            $scope.total -= freight.estimatedPrice
            $scope.totalWeight -= freight.weight
            //$scope.totalAmount -= 1
            $scope.provideOptions()

        }
    }


    $scope.payment = function () {
        var paymentAmount = 0;
        if ($scope.confirmTC == false) {
            alert("付款必须先同意条款")
            return
        } else if ($scope.rewardAmount < $scope.currentUser.reward) {
            console.log("reward.amount: " + $scope.reward.amount + " | user.reward: " + $scope.currentUser.reward)
            alert("输入使用积分大于现有积分，请重新输入")
            return
        } else {
            var paymentList = []
            for (var i = 0; i < $scope.freights.length; i++) {
                if ($scope.freights[i].selection == true) {
                    paymentList.push($scope.freights[i])
                    $scope.freights[i].status = YD.Freight.STATUS_PENDING_DELIVERY
                }
            }
            //paymentAmount += $scope.total
            if($scope.totalWeight < 2) {
                $scope.totalWeight = 2
            }
            if($scope.selectedMethod.name === '小包裹渠道') {
                var FIRST_CHARGE = 4.25
                var CONTINUE_CHARGE = 4.25
                paymentAmount = FIRST_CHARGE + ($scope.totalWeight - 1) * CONTINUE_CHARGE
            } else if ($scope.selectedMethod.name === '普通渠道') {
                var FIRST_CHARGE = 8
                var CONTINUE_CHARGE = 4.3
                paymentAmount = FIRST_CHARGE + ($scope.totalWeight - 1) * CONTINUE_CHARGE
            }

            if ($scope.confirmInsurance && $scope.confirmTaxInsurance && $scope.confirmReward) {//add insurance, tax insurance and use reward
                paymentAmount = paymentAmount + parseInt($scope.insurance.amount) + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 - (parseInt($scope.reward.amount) / 100).toFixed(2)
            } else if ($scope.confirmTaxInsurance && $scope.confirmReward) {  // add tax insurance, and use reward
                paymentAmount = paymentAmount + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 - (parseInt($scope.reward.amount) / 100).toFixed(2)

            } else if ($scope.confirmInsurance && $scope.confirmReward) { // add insurance, and use reward
                paymentAmount = paymentAmount + parseInt($scope.insurance.amount) - (parseInt($scope.reward.amount) / 100).toFixed(2)

            } else if ($scope.confirmTaxInsurance) {// add tax insurance
                paymentAmount = paymentAmount + paymentAmount * parseInt($scope.taxInsurance.amount) / 100
                console.log("taxInsurance.amount: " + parseInt($scope.taxInsurance.amount) / 100)

            } else if ($scope.confirmInsurance) {// add insurance
                paymentAmount = paymentAmount + parseInt($scope.insurance.amount)

            } else if ($scope.confirmReward) { // use reward
                paymentAmount = paymentAmount -  (parseInt($scope.reward.amount) / 100).toFixed(2)

            } else {
            }

            console.log("In payment -- here is the paymentAmount: " + paymentAmount)
            console.log("In payment -- here is the userbalance: " + $scope.currentUser.balance)
            console.log("In payment -- here is the balanceInDollar: " + $scope.currentUser.balanceInDollar)


            if ($scope.currentUser.balanceInDollar < paymentAmount) {
                alert("余额不足，请先充值: balanceInDollar || paymentAmount " + $scope.currentUser.balanceInDollar + " || " + paymentAmount)
                console.log("balance not enough")
                return
            } else {
                $scope.currentUser.balanceInDollar -= paymentAmount
                console.log("balance - success")
                //var transaction = new YD.Transaction()
                ////transaction.record = data;
                //transaction.status = YD.Transaction.STATUS_RECHARGE;
                //transaction.amount = paymentAmount * -1;
                //transaction.save(null, {
                //    success: function (t) {
                //        console.log("transaction saved")
                //        AV.Object.saveAll(paymentList, {
                //            success: function (list) {
                //                console.log("confirmSplit: freightList has been saved")
                //                $scope.currentUser.save(null, {
                //                    success: function (user) {
                //                        console.log("currentUser balance saved")
                //                        alert("扣款成功, 剩余金额为: $" + user.balanceInDollar )
                //                        $scope.reloadFreightConfirmed()
                //
                //                    },
                //                    error: function (user, err) {
                //                        console.log("Substrat balance err: " + err.message)
                //                    }
                //                })
                //            },
                //            error: function (freights, error) {
                //                console.log("ERROR: confirmSplit: freightList has not been saved" + error.id + " - " + error.message)
                //            }
                //        })
                //    },
                //    error: function (t, error) {
                //        console.log("transaction not saved " + error.message)
                //    }
                //})
            }
        }
    }
})

YundaApp.controller('FreightDeliveryCtrl', function ($scope, $rootScope, $filter) {
    $scope.reloadFreight = function () {
        if ($scope.currentUser.id != undefined) {
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
                        //console.log("statusToString: " + statusToString)

                        else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERING)
                            statusToString = "正在发货"
                        else if ($scope.freights[i].status == YD.Freight.STATUS_PASSING_CUSTOM)
                            statusToString = "正在清关"
                        else if ($scope.freights[i].status == YD.Freight.STATUS_FINAL_DELIVERY)
                            statusToString = "国内运寄中"
                        else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERED)
                            statusToString = "已到达"
                        else {
                        }
                        $scope.freights[i].statusToString = statusToString
                        //console.log("statusToSTring: " + $scope.freights[i].statusToString)
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":" ;
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freights[i].createdAt = tmp_date
                    }

                    $scope.$apply(function () {

                        $rootScope.badgeTotalCount -= $scope.badgeDCount
                        $scope.badgeDCount = results.length
                        $rootScope.badgeTotalCount += $scope.badgeDCount
                        console.log("Badge D now: " + $scope.badgeDCount)
                        console.log("BadgeTotal now: " + $rootScope.badgeTotalCount)
                    })
                    console.log("Freight delivery confirmed is shown")

                },
                error: function (error) {
                    alert("ERROR: Getting Freight delivery: " + error.id + " " + error.message)
                }
            })
        }
    }
    $scope.reloadFreight()
})

YundaApp.controller('ChangeAddressCtrl', function($scope, $modal) {
    $scope.changeAddressFreight = new YD.FreightChangeAddress()
    $scope.reloadChangeAddress = function() {
        var query = new AV.Query("FreightChangeAddress")
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status", [YD.FreightChangeAddress.STATUS_AWAITING, YD.FreightChangeAddress.STATUS_CONFIRMED])
        query.find({
            success: function(list) {
                $scope.$apply(function(){
                    $scope.freights = list
                    console.log("In ChangeAddressCtrl -- find F: " + list.length)

                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freights[i].createdAt = tmp_date
                        if($scope.freights[i].status == YD.FreightChangeAddress.STATUS_AWAITING)
                            $scope.freights[i].status = "等待处理"
                        else if($scope.freights[i].status == YD.FreightChangeAddress.STATUS_CONFIRMED)
                            $scope.freights[i].status = "已处理"

                        if($scope.freights[i].adminEvidence != undefined){
                            $scope.freights[i].adminEvidence = $scope.freights[i].adminEvidence.url()
                            $scope.freights[i].hasEvidence = true
                        } else {
                            $scope.freights[i].hasEvidence = false
                        }

                    }
                })

            },
            error: function(error) {
                console.log("ERROR Reloading: " + error.message)
            }

        })
    }
    $scope.reloadChangeAddress()

    $scope.chooseRecipient = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseRecipientAddress',
            controller: 'ChooseAddressCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                addressList: function () {
                    return $scope.recipientAddresses
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenAddress) {
            $scope.changeAddressFreight.address = chosenAddress
            alert("已成功选取收件人")
        })
    }

    $scope.addNewRecipient = function () {
            var address = new YD.Address()
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
                console.log("addNewAddress(): new address is added")
                $scope.reloadAddress()
            })


    }

    $scope.applyChangeAddress = function() {
        $scope.changeAddressFreight.user = $scope.currentUser
        $scope.changeAddressFreight.status = YD.FreightChangeAddress.STATUS_AWAITING
        $scope.changeAddressFreight.save(null, {
            success: function(f) {
                console.log("In ChangeAddressCtrl -- f.id: " + f.id)
                alert("申请成功，请等待处理")
                $scope.reloadChangeAddress()
            },
            error: function(f, error) {
                alert("申请失败！" + error.message)
                console.log("ERR: " + error.message)
            }
        })
    }

})

YundaApp.controller('DashboardSearchCtrl', function ($scope, $modal) {
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

            //6917246211814
            //8498950010019
            var modalInstance = $modal.open({
                templateUrl: 'partials/modal_tracking',
                controller: 'TrackingCtrl',
                scope: $scope,
                windowClass: 'center-modal',
                size: 'lg',
                resolve: {
                    resultList: function () {
                        return $scope.resultList
                    }
                }
            })
        }
    }
})
/* Edit address controller */

YundaApp.controller('EditAddressCtrl', function ($scope, $modalInstance, address) {

    $scope.address = address
    $scope.saveAddressSubmit = function () {
        $scope.address.user = $scope.currentUser
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
    $scope.FIXED_RATE = 6.4
    $scope.$watch('CNY', function (newVal, oldVal) {
        console.log("CNY new value : " + newVal)
        if (!newVal) {
            $scope.USD = 0
        } else
            $scope.USD = (newVal / $scope.FIXED_RATE).toFixed(2)
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
                            $scope.currentUser.reward += Math.round($scope.USD)
                            $scope.currentUser.save(null, {
                                success: function (user) {
                                    alert("充值成功！系统赠送积分: " + Math.round($scope.USD))
                                },
                                error: function (user, error) {

                                }
                            })
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
    $scope.reloadZhifubao = function () {
        var query = new AV.Query("Transaction")
        query.equalTo("user", $scope.currentUser)
        query.equalTo("status", YD.Transaction.STATUS_ZHIFUBAO)
        query.find({
            success: function (list) {
                console.log("In ZhifubaoCtrl -- :" + list.length )
                $scope.$apply(function () {
                    $scope.transactions = list
                    for (var i = 0; i < $scope.transactions.length; i++) {
                        var tmp = $scope.transactions[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.transactions[i].createdAt = tmp_date
                        $scope.transactions[i].status = "等待处理"
                    }
                })
            }
        })
    }
    $scope.reloadZhifubao()

    $scope.zhifubaoPayment = function () {
        console.log("typeof recharegeAmount: " + typeof($scope.rechargeAmount))
        console.log("typeof 1: " + typeof(1))

        if ($scope.rechargeAmount <= 0 || typeof($scope.rechargeAmount) != typeof(1)) {
            alert("请输入正确充值金额！")
            return
        } else {
            var transaction = new YD.Transaction()
            transaction.status = YD.Transaction.STATUS_ZHIFUBAO;
            transaction.amount = $scope.rechargeAmount
            transaction.user = $scope.currentUser
            transaction.save(null, {
                success: function (t) {
                    console.log("transaction saved")
                    alert("提交成功！金额为: $"+ t.amount + ",请等待管理员处理")
                    $scope.reloadZhifubao()
                },
                error: function (t, error) {
                    console.log("transaction not saved " + error.id + ' - ' + error.message)
                }
            })
        }
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
        if ($scope.currentUser.id != undefined) {
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
            }
        }
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
        if ($scope.currentUser.id != undefined) {
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
                query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED, YD.Transaction.STATUS_STRIPE])
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
        }
    }
})

YundaApp.controller('AdminCtrl', function ($scope, $rootScope) {
    $scope.oneAtATime = true
    $scope.openTab = {
        setE : false,
        setF : false,
        setG : false,
        setH : false
    }
    $scope.view_tab = "ca"
    $scope.openTab.setG = true
    $scope.change_tab = function (tab) {

        if(tab == "aa" || tab == "ab" || tab == "ac"){

            $scope.openTab.setE = true
            $scope.openTab.setF = false
            $scope.openTab.setG = false
            $scope.openTab.setH = false
        } else if(tab == "ba" || tab == "bb" || tab == "bc" || tab == "bd"){

            $scope.openTab.setE = false
            $scope.openTab.setF = true
            $scope.openTab.setG = false
            $scope.openTab.setH = false
        } else if(tab == "ca" || tab == "cb" || tab == "cc"){

            $scope.openTab.setE = false
            $scope.openTab.setF = false
            $scope.openTab.setG = true
            $scope.openTab.setH = false
        } else if(tab == "da" || tab == "db" || tab == "dc"){

            $scope.openTab.setE = false
            $scope.openTab.setF = false
            $scope.openTab.setG = false
            $scope.openTab.setH = true
        }
        $scope.view_tab = tab

    }

    $scope.badgeAAdminCount = 0
    $scope.badgeBAdminCount = 0
    $scope.adminBadge = {}
    $scope.adminBadge.C = 0
    $scope.adminBadge.D = 0
    $scope.adminBadge.E = 0
    $scope.adminBadge.F = 0
    $scope.adminBadge.G = 0
    $scope.adminBadge.H = 0


    $scope.isLoading = false
    $scope.promote = undefined
    $scope.showProgressBar = function (message) {
        $scope.isLoading = true
        $scope.promote = message
    }
    $scope.hideProgressBar = function () {
        $scope.isLoading = false
        $scope.promote = undefined
        //$scope.$apply()
        console.log("probar hidden ")
    }

})

YundaApp.controller('AdminFreightInArriveCtrl', function ($scope, $rootScope, $modal) {
    $scope.freightIn
    var user
    var query = new AV.Query("FreightIn")
    query.containedIn("status", [YD.FreightIn.STATUS_MANUAL, YD.FreightIn.STATUS_ARRIVED]);
    query.include("user")
    if($scope.currentUser.role == YD.User.ROLE_ADMIN) {

        query.find({
        success: function (list) {
            $scope.$apply(function () {
                $rootScope.badgeAdminTotalCount -= $scope.badgeAAdminCount
                $scope.badgeAAdminCount = list.length
                $rootScope.badgeAdminTotalCount += $scope.badgeAAdminCount
                $scope.freightIn = list
                for (var i = 0; i < $scope.freightIn.length; i++) {
                    $scope.freightIn[i].selection = false
                    var tmp = $scope.freightIn[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                    if(tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();_
                    $scope.freightIn[i].createdAt = tmp_date
                }
                $rootScope.badgeAdminTotalCount -= $scope.badgeAAdminCount
                $scope.badgeAAdminCount = list.length
                $rootScope.badgeAdminTotalCount += $scope.badgeAAdminCount
                console.log("Badge A now: " + $scope.badgeAAdminCount)
                console.log("BadgeAdminTotal now: " + $rootScope.badgeAdminTotalCount)
            })
        }
    })
    }
    $scope.saveComment = function () {
        if($scope.currentUser.role == YD.User.ROLE_ADMIN) {

            $scope.showProgressBar("正在保存留言...")
            for (var i = 0; i < $scope.freightIn.length; i++) {
                console.log("f comments is: " + $scope.freightIn[i].comments)
            }
            AV.Object.saveAll($scope.freightIn, {
                success: function (list) {
                    console.log("list of comment saved")
                    $scope.hideProgressBar()
                    alert("留言保存成功！")
                },
                error: function (error) {

                }
            })
        }
    }
    $scope.showDetails = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetails',
            controller: 'ShowDetailsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    }

})

YundaApp.controller("ShowDetailsCtrl", function($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.close = function() {
        $modalInstance.dismiss()
    }
})

YundaApp.controller("AdminSystemCtrl", function($scope, $rootScope) {
    $scope.selected = $rootScope.isSmallPackageAllowed
    console.log("In AdminSys -- isSmall: " + $scope.selected)


    $scope.confirm = function() {
        console.log("In AdminSyst -- $scope.selected: " + $scope.selected)
        if($scope.selected != $rootScope.isSmallPackageAllowed) {
            $rootScope.systemSetting.isSmallPackageAllowed = $scope.selected
            $rootScope.systemSetting.save(null, {
                success: function(s) {
                    $rootScope.reloadSystemSetting()
                    alert("修改已保存！")

                }
            })

        }

    }
})

YundaApp.controller('AdminFreightInConfirmCtrl', function ($scope, $rootScope, $modal) {
    $scope.freightIn
    $scope.showDetails = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetails',
            controller: 'ShowDetailsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    }
    var query = new AV.Query("FreightIn")
    query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED)
    query.include("user")
    query.find({
        success: function (list) {
            $scope.freightIn = list
            $scope.$apply(function () {
                $rootScope.badgeAdminTotalCount -= $scope.badgeBAdminCount
                $scope.badgeBAdminCount = list.length
                $rootScope.badgeAdminTotalCount += $scope.badgeBAdminCount
                for (var i = 0; i < $scope.freightIn.length; i++) {
                    $scope.freightIn[i].selection = false
                    var tmp = $scope.freightIn[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                    if(tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();_
                    $scope.freightIn[i].createdAt = tmp_date
                }
                console.log("Badge B now: " + $scope.badgeBAdminCount)
                console.log("BadgeAdminTotal now: " + $rootScope.badgeAdminTotalCount)
            })
        }
    })
    $scope.saveComment = function () {
        $scope.showProgressBar("正在保存留言...")

        AV.Object.saveAll($scope.freightIn, {
            success: function (list) {
                console.log("list of comment saved")
                alert("留言保存成功！")
                $scope.hideProgressBar()
            },
            error: function (error) {

            }
        })
    }
})

YundaApp.controller("AdminFreightConfirmCtrl", function ($scope, $rootScope, $window, $modal) {
    $scope.showDetails = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetails',
            controller: 'ShowDetailsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    }
    $scope.getStatus = function () {
        for (var i = 0; i < $scope.freight.length; i++) {
            //$scope.freight[i].statusToString = " "
            var statusList = $scope.freight[i].statusGroup
            var statusString = ' '

            if ($scope.freight[i].statusGroup != undefined) {
                for (var j = 0; j < statusList.length; j++) {
                    if (statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
                        statusString += "等待用户最后确认; "
                        //console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
                        statusString += "等待加固; "
                        //console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
                        statusString += "等待减重; "
                        //console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
                        statusString += "等待开箱检查; "
                        //console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "等待普通分箱; "
                        //console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }

                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED) {
                        statusString += "等待精确分箱; "
                        //console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }
                }
            }

            //statusString.substr(0, statusString.length - 22)   //remove trailing comma
            $scope.freight[i].statusToString = statusString
            //console.log("HERE IS STRING LENGTH: " + $scope.freight[i].statusToString.length)
        }

    }
    $scope.reloadFreight = function () {
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_INITIALIZED)
        query.include("user")
        query.find({
            success: function (list) {
                $scope.$apply(function(){


                $scope.freight = list
                for (var i = 0; i < $scope.freight.length; i++) {
                    $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freight[i].updatedAt = tmp_date
                    }

                $scope.getStatus()
                })
                $scope.$apply(function() {
                    $scope.adminBadge.C = list.length
                    console.log("Badge c: " + $scope.adminBadge.C)
                })

            },
            error: function (error) {
                console.log("AdminFregihtConfirmCtr ERR: " + error.message)
            }
        })
    }
    $scope.reloadFreight()
    $scope.printAll = function () {
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

        //$window.location.href = '/partials/print'
    }
    $scope.saveComment = function () {
        $scope.showProgressBar("正在保存留言...")
        for (var i = 0; i < $scope.freight.length; i++) {
            //console.log("f comments is: " + $scope.freightIn[i].comments)
        }
        AV.Object.saveAll($scope.freight, {
            success: function (list) {
                console.log("list of comment saved")
                $scope.hideProgressBar()
                alert("留言保存成功！")
            },
            error: function (error) {

            }
        })
    }
})

YundaApp.controller('AdminFreightFinishCtrl', function ($scope, $modal) {
    $scope.showDetails = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetails',
            controller: 'ShowDetailsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    }
    $scope.reloadFreight = function () {
        console.log("finished print")
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_PENDING_FINISHED)
        query.include("user")
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freight = list
                    $scope.adminBadge.D = list.length
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freight[i].updatedAt = tmp_date
                    }
                    $scope.adminBadge.D = list.length

                })


            },
            error: function (error) {
                console.log("AdminAdminFreightFinishCtrl ERROR: " + error.message)
            }
        })
    }
    $scope.reloadFreight()
    $scope.saveComment = function () {
        $scope.showProgressBar("正在保存留言...")
        for (var i = 0; i < $scope.freight.length; i++) {
            //console.log("f comments is: " + $scope.freight[i].comments)
        }
        AV.Object.saveAll($scope.freight, {
            success: function (list) {
                console.log("list of comment saved")
                $scope.hideProgressBar()
                alert("留言保存成功！")
            },
            error: function (error) {

            }
        })
    }

})

YundaApp.controller('AdminFreightPaidCtrl', function ($scope, $rootScope, $modal) {
    $scope.showDetails = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetails',
            controller: 'ShowDetailsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    }
    $scope.reloadPaidFreight = function () {
        console.log("realod paid")
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_PENDING_DELIVERY)
        query.include("user")
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.adminBadge.E = list.length

                    $scope.freight = list
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freight[i].updatedAt = tmp_date
                        $scope.freight[i].selection = false

                    }
                })

            },
            error: function (error) {
                console.log("AdminFreightPaid ERROR: " + error.message)
            }
        })
    }
    $scope.saveComment = function () {
        $scope.showProgressBar("正在保存留言...")
        for (var i = 0; i < $scope.freight.length; i++) {
            //console.log("f comments is: " + $scope.freight[i].comments)
        }
        AV.Object.saveAll($scope.freight, {
            success: function (list) {
                console.log("list of comment saved")
                $scope.hideProgressBar()
                alert("留言保存成功！")
            },
            error: function (error) {

            }
        })
    }
    $scope.reloadPaidFreight()
    $scope.printAll = function () {
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

    }
})

YundaApp.controller('AdminFreightClearCtrl', function ($scope, $modal) {
    $scope.showDetails = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetails',
            controller: 'ShowDetailsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    }
    var clearList = []
    $scope.reloadDeliveryFreight = function () {
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_DELIVERING)
        query.include("user")
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freight = list
                    $scope.adminBadge.F = list.length
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freight[i].updatedAt = tmp_date
                        $scope.freight[i].selection = false
                    }
                })



            },
            error: function (error) {
                console.log("AdminFreightPaid ERROR: " + error.message)
            }
        })
    }
    $scope.saveComment = function () {
        $scope.showProgressBar("正在保存留言...")
        for (var i = 0; i < $scope.freight.length; i++) {
            //console.log("f comments is: " + $scope.freight[i].comments)
        }
        AV.Object.saveAll($scope.freight, {
            success: function (list) {
                console.log("list of comment saved")
                $scope.hideProgressBar()
                alert("留言保存成功！")
            },
            error: function (error) {

            }
        })
    }
    $scope.reloadDeliveryFreight()
    $scope.deliver = function () {
        for (var i = 0; i < $scope.freight.length; i++) {
            if ($scope.freight[i].selection == true) {
                console.log("This one " + i + "has been added")
                $scope.freight[i].status = YD.Freight.STATUS_PASSING_CUSTOM
                clearList.push($scope.freight[i])
            }
        }
        AV.Object.saveAll(clearList, {
            success: function (list) {
                $scope.$apply(function() {
                    console.log("AdminFreightClearCtrl: freightList has been saved")
                    $scope.reloadDeliveryFreight()
                })


            },
            error: function (error) {
                console.log("ERROR: AdminFreightClearCtrl: freightList has not been saved" + error.message)
            }
        })
    }
})

YundaApp.controller('AdminChineseFreightCtrl', function ($scope, $modal) {
    $scope.showDetails = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetails',
            controller: 'ShowDetailsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    }
    $scope.reloadChineseFreight = function () {
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_PASSING_CUSTOM)
        query.include("user")
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freight = list
                    $scope.adminBadge.G = list.length
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freight[i].updatedAt = tmp_date
                        $scope.freight[i].selection = false
                    }
                })


                for (var i = 0; i < $scope.freight.length; i++) {
                    $scope.freight[i].selection = false
                }
            },
            error: function (error) {
                console.log("AdminFreightPaid ERROR: " + error.message)
            }
        })
    }
    $scope.reloadChineseFreight()
    $scope.saveComment = function () {
        $scope.showProgressBar("正在保存留言...")
        for (var i = 0; i < $scope.freight.length; i++) {
            //console.log("f comments is: " + $scope.freight[i].comments)
        }
        AV.Object.saveAll($scope.freight, {
            success: function (list) {
                console.log("list of comment saved")
                $scope.hideProgressBar()
                alert("留言保存成功！")
            },
            error: function (error) {

            }
        })
    }
    $scope.addInfo = function (freight) {
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
    $scope.finalDeliver = function () {
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

YundaApp.controller('AdminFinalDeliveryCtrl', function ($scope, $modal) {
    $scope.showDetails = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetails',
            controller: 'ShowDetailsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    }
    $scope.reloadFinalDelivery = function () {
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_FINAL_DELIVERY)
        query.include("user")
        query.find({
            success: function (list) {
                $scope.freight = list
                $scope.$apply(function () {
                    $scope.adminBadge.H = list.length
                    console.log("in FInal H badge: " + $scope.adminBadge.H)
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freight[i].updatedAt = tmp_date
                    }
                })

                console.log("reloadFinalDelivery: " + list.length)
            },
            error: function (error) {
                console.log("AdminFreightPaid ERROR: " + error.message)
            }
        })
    }
    $scope.reloadFinalDelivery()
    $scope.saveComment = function () {
        $scope.showProgressBar("正在保存留言...")
        for (var i = 0; i < $scope.freight.length; i++) {
            //console.log("f comments is: " + $scope.freight[i].comments)
        }
        AV.Object.saveAll($scope.freight, {
            success: function (list) {
                console.log("list of comment saved")
                $scope.hideProgressBar()
                alert("留言保存成功！")
            },
            error: function (error) {

            }
        })
    }

})

YundaApp.controller('AdminViewUserCtrl', function ($scope) {
    var query = new AV.Query("_User")
    query.find({
        success: function (users) {
            console.log("AdminViewUser, length: " + users.length)
            $scope.$apply(function(){
                $scope.users = users
                for (var i = 0; i < $scope.users.length; i++) {
                    var tmp = $scope.users[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                    if(tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();_
                    $scope.users[i].createdAt = tmp_date
                    $scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
                }
            })

        },
        error: function (error) {
            console.log("AdminViewUser ERR: " + error.message)
        }
    })

    $scope.showDetails = function (user) {
        $scope.newUser = user
        $scope.$watch('newUser', function (newVal) {
        }, true)
    }

})

YundaApp.controller('AddInfoCtrl', function ($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.confirmAddInfo = function () {
        $scope.freight.status = YD.Freight.STATUS_FINAL_DELIVERY
        $scope.freight.save(null, {
            success: function (result) {
                $modalInstance.close()
            },
            error: function (result, error) {
                console.log("AddInfoCtrl ERROR: " + error.message)
            }
        })
    }
    $scope.cancelAddInfo = function () {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('AdminReturnBalanceCtrl', function($scope, $modal) {
    $scope.reloadReturnBalance = function() {
        var query = new AV.Query("Transaction")
        query.include("user")
        query.equalTo("status", YD.Transaction.STATUS_PENDING_RETURN_BALANCE)
        query.find({
            success: function (list) {
                $scope.$apply(function() {
                    $scope.transactionList = list
                    console.log("admin return balance: " + list.length)
                    for (var i = 0; i < $scope.transactionList.length; i++) {
                        console.log("In AdminReturnBalanceCtrl -- user balance is: " + $scope.transactionList[i].user.balance)
                        var tmp = $scope.transactionList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.transactionList[i].createdAt = tmp_date


                    }
                })

            },
            error: function (list, error) {
                console.log("admin return balance ERR: " + error.message)
            }
        })
    }
    $scope.reloadReturnBalance()

    $scope.confirmReturn = function(transaction) {
        console.log("InReturnBalance Ctr -- user balance: " + (transaction.user.balance/100).toFixed(2) + " | amount: " + transaction.amount )
        if(transaction.amount > (transaction.user.balance/100).toFixed(2)) {
            alert("用户余额为：" + (transaction.user.balance/100).toFixed(2) + ", 请联系用户修改金额")
            return
        } else {
            var modalInstance = $modal.open({
                templateUrl: 'partials/modal_adminEvidence',
                controller: 'AdminAddEvidenceCtrl',
                scope: $scope,
                size: 'sm',
                windowClass: 'center-modal',
                resolve: {
                    transaction: function() {
                        return transaction
                    }
                }
            })
            modalInstance.result.then(function () {
                transaction.user.balance -= transaction.amount
                transaction.user.save(null, {
                    success: function (user) {
                        alert("退款已处理！")
                        $scope.reloadReturnBalance()
                    }
                })

            })
        }
    }
})

YundaApp.controller('AdminAddEvidenceCtrl', function($scope, transaction, $modalInstance) {
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        //console.log("In fileUpload back: " + $scope.identityBack)
        //console.log("In fileUpload front: " + $scope.identityFront)

        if ($scope.identityFront != undefined) {
            $scope.isLoading = true
            $scope.promote = "正在上传..."
            console.log("In fileUpload back: " + $scope.identityFront[0].name)
            //console.log("In fileUpload front: " + $scope.identityBack[0].name)
            var frontName = transaction.id + 'evidence.jpg'
            transaction.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
            transaction.status = YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE
            transaction.save(null, {
                success: function(t) {
                    console.log("In AdminAddEvidenceCtrl -- upload sucessful")
                    $scope.$apply(function(){
                        $scope.isLoading = false
                        $scope.promote = ""
                    })
                    $modalInstance.close()
                },
                error: function(error) {
                    alert("照片上传不成功！"+ error.message)
                    $modalInstance.dismiss()
                }
            })

        } else {
            alert("Please upload file first")
        }
    }
})

YundaApp.controller('AdminAddEvidenceChangeAddressCtrl', function($scope, freight, $modalInstance) {
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        //console.log("In fileUpload back: " + $scope.identityBack)
        //console.log("In fileUpload front: " + $scope.identityFront)

        if ($scope.identityFront != undefined) {
            $scope.isLoading = true
            $scope.promote = "正在上传..."
            console.log("In fileUpload back: " + $scope.identityFront[0].name)
            //console.log("In fileUpload front: " + $scope.identityBack[0].name)
            var frontName = freight.id + 'evidence.jpg'
            freight.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
            freight.status = YD.FreightChangeAddress.STATUS_CONFIRMED
            freight.save(null, {
                success: function(f) {
                    console.log("In AdminAddEvidenceCtrl -- upload sucessful")
                    $scope.$apply(function(){
                        $scope.isLoading = false
                        $scope.promote = ""
                    })
                    $modalInstance.close()
                },
                error: function(error) {
                    alert("照片上传不成功！"+ error.message)
                    $modalInstance.dismiss()
                }
            })

        } else {
            alert("Please upload file first")
        }
    }
})

YundaApp.controller('AdminReturnGoodsCtrl', function($scope) {
    $scope.isLoading = false
    $scope.promote = ""
    $scope.reloadReturnGoods = function() {
        var query = new AV.Query(YD.FreightReturn)
        query.equalTo("status", YD.FreightReturn.STATUS_PENDING)
        query.include("user")
        query.find({
            success: function (list) {
                $scope.$apply(function(){
                    $scope.goodsList = list
                    for (var i = 0; i < $scope.goodsList.length; i++) {
                        var tmp = $scope.goodsList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.goodsList[i].createdAt = tmp_date
                    }
                })

            },
            error: function (list, error) {
                console.log("In AdminReturnGoodsCtrl -- ERROR: " + error.message)
            }
        })

    }
    $scope.reloadReturnGoods()

    $scope.confirmReturn = function(freightReturn) {
        $scope.isLoading = true
        $scope.promote = "正在保存"
        freightReturn.status = YD.FreightReturn.STATUS_FINISHED
        freightReturn.save(null, {
            success: function(f) {
                $scope.$apply(function() {
                    $scope.isLoading = false
                    $scope.promote = ""
                    $scope.reloadReturnGoods()
                })

            }
        })
    }
})

YundaApp.controller('AdminChangeAddressCtrl', function($scope, $modal) {
    $scope.reloadChangeAddress = function() {
        var query = new AV.Query(YD.FreightChangeAddress)
        query.equalTo("status", YD.FreightChangeAddress.STATUS_AWAITING)
        query.include("user")
        query.find({
            success: function(list) {
                $scope.$apply(function() {
                    $scope.freights = list
                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freights[i].createdAt = tmp_date
                    }

                })
            }
        })
    }
    $scope.reloadChangeAddress()

    $scope.confirmChange = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_adminEvidence',
            controller: 'AdminAddEvidenceChangeAddressCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal',
            resolve: {
                freight: function () {
                    return freight
                }
            }
        })
        modalInstance.result.then(function () {

                alert("已确认！")
                $scope.reloadChangeAddress()

        })

    }
})

YundaApp.controller('AdminZhifubaoCtrl', function($scope) {
    $scope.reloadZhifubao = function() {
        var query = new AV.Query("Transaction")
        query.equalTo("status", YD.Transaction.STATUS_ZHIFUBAO)
        query.include("user")
        query.find({
            success: function(list) {
                $scope.$apply(function() {
                    console.log("AdminZhifubao -- length: " + list.length)
                    $scope.transactions = list
                    for(var i = 0; i < $scope.transactions.length; i++) {
                            var tmp = $scope.transactions[i].createdAt
                            var tmp_date = tmp.getFullYear() + "/" + tmp.getMonth() + "/" + tmp.getDay() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes()
                            else
                                tmp_date += tmp.getMinutes();
                            $scope.transactions[i].createdAt = tmp_date
                    }
                })
            }
        })
    }
    $scope.reloadZhifubao()
    $scope.confirmRecharge = function(transaction) {
        transaction.user.reward = Math.round(transaction.amount)
        transaction.user.balanceInDollar += transaction.amount
        transaction.status = YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED
        transaction.save(null, {
            success: function(t) {
                console.log("transaction saved -- reward: " + Math.round(t.amount) + " | amount: " + t.amount)
                transaction.user.save(null, {
                    success: function(u) {
                        alert("操作成功！")
                        $scope.reloadZhifubao()
                    }
                })
            }
        })

    }
})

YundaApp.controller('PrintController', function ($scope, $rootScope) {
    //console.log("is printpage: " + $scope.printPage)
    $scope.freightList = $rootScope.freightList
    if( $scope.freightList.length == 0) {
        $scope.isShow = true
    }
    //for (var i = 0; i < $scope.freightList.length; i++) {
    //    console.log("In PrintController -- " + $scope.freightList[i].trackingNumber)
    //}

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
    $scope.map = {
        center: {
            latitude: 45.420447,
            longitude: -122.504119
        }, zoom: 17
    }


    $scope.marker = {
        id: 0,
        coords: {
            latitude: 45.420447,
            longitude: -122.504119
        }
    }
    uiGmapGoogleMapApi.then(function (maps) {

    })
})

