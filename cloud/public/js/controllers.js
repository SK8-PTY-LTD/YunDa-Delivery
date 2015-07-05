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
                $rootScope.smallPackageInitial = s.smallPackageInitial
                $rootScope.smallPackageContinue = s.smallPackageContinue
                $rootScope.normalPackageInitial = s.normalPackageInitial
                $rootScope.normalPackageContinue = s.normalPackageContinue
                $rootScope.systemStreet = s.systemStreet
                $rootScope.systemCity = s.systemCity
                $rootScope.systemState = s.systemState
                $rootScope.systemZipcode = s.systemZipcode
                $scope.$apply()
            },
            error: function (s, error) {

            }
        })
    }
    $rootScope.reloadSystemSetting()

    $rootScope.reloadNews = function() {
        var query = new AV.Query(YD.News)
        query.find({
            success: function(list) {
                $rootScope.newsList = list
                $scope.$apply()
            },
            error: function(error) {
                alert("找新闻出错")
            }
        })
    }
    $rootScope.reloadNews()


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
YundaApp.controller('LoginCtrl', function ($scope, $rootScope, $modalInstance, $modal) {
    $scope.dismissViewController = function () {
        $scope.isLoading = false;
        $scope.promote = undefined;
        $modalInstance.close();
    }
    $scope.login = function () {
        $scope.isLoading = true;
        $scope.promote = "正在登陆...";
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
        //$scope.isLoading = true;
        //$scope.promote = "Signing up";

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
            $scope.currentUser.balance = 0
            $scope.currentUser.pendingBalance = 0
            $scope.currentUser.reward = 0

            $scope.currentUser.signUp(null, {
                success: function (user) {
                    // Hooray! Let them use the app now.
                    $scope.$apply(function() {
                        $scope.currentUser.stringId = user.stringId
                        $scope.currentUser.numberId = user.numberId
                    })


                    $scope.dismissViewController();
                    alert("已注册成功，请登陆!")
                    YD.User.logOut()
                    // Do stuff after successful login.
                    $rootScope.currentUser = new YD.User()

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
    //console.log("In Home Ctrl -- balanceInDollar: " + $scope.currentUser.balanceInDollar)

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

                var query1 = new AV.Query("Freight")
                query1.containedIn("trackingNumber", $scope.trackingList)
                query1.equalTo("user", $scope.currentUser)
                query1.find({
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
                } else {
                    alert("没有结果！")
                    return
                }
            },
            error: function (error) {
                console.log("LF FIn ERROR: " + error.message)
            }
        })


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
            $scope.currentUser.balance = 0
            $scope.currentUser.pendingBalance = 0
            $scope.currentUser.reward = 0

            $scope.currentUser.signUp(null, {
                success: function (user) {
                    // Hooray! Let them use the app now.
                    //$scope.dismissViewController(user);
                    $scope.$apply(function() {
                        $scope.isLoading = false
                        $scope.currentUser.stringId = user.stringId
                        $scope.currentUser.numberId = user.numberId
                        $scope.isLoading = false

                    })


                    alert("已注册成功，请登陆!")
                    YD.User.logOut()
                    // Do stuff after successful login.
                    $rootScope.currentUser = new YD.User()

                    $window.location.href = '/'

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

YundaApp.controller('TrackingCtrl', function ($scope, $modalInstance, resultList) {
    console.log("resultlist: " + resultList.length)
    $scope.resultList = resultList
    $scope.close = function () {
        $modalInstance.close()
    }
})

YundaApp.controller('MyTrackingCtrl', function ($scope, $modal) {
    //$scope.trackingNumber
    //$scope.trackingList
    $scope.resultList = []

    $scope.reloadTracking = function () {
        var query = new AV.Query("Freight")
        query.containedIn("status", [YD.Freight.STATUS_DELIVERED])
        query.equalTo("user", $scope.currentUser)
        query.include("address")
        query.find({
            success: function (list) {
                //console.log("LIST LENGTH: " + list.length)
                $scope.freights = list
                if ($scope.freights != undefined) {
                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freights[i].updatedAt = tmp_date
                        if($scope.freights[i].status == YD.Freight.STATUS_DELIVERED)
                            $scope.freights[i].info = "已送达"
                        //if($scope.freights[i].status == YD.Freight.STATUS_CANCELED)
                        //    $scope.freights[i].status = "取消"
                        var statusGroup = $scope.freights[i].statusGroup
                            for (var j = 0; j < statusGroup.length; j++) {
                                var statusString = ""
                                var status = statusGroup[j]
                                if (status == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
                                    statusString += "直接送达; "
                                }

                                if (status == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
                                    statusString += "加固; "
                                }

                                if (status == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
                                    statusString += "减重; "
                                }

                                if (status == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                                    statusString += "普通分箱; "
                                }

                                if (status == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED) {
                                    statusString += "精确分箱; "
                                }
                            }
                        $scope.freights[i].oepration = statusString
                    }
                }
            }
        })
    }

    $scope.reloadTracking()

    $scope.openRecipientInfo = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_recipientDetails',
            controller: 'RecipientDetailsCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                freight: function() {
                    return f
                }
            },
            windowClass: 'center-modal'
        })
    }
})


YundaApp.controller('RecipientDetailsCtrl', function($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.close = function(){
        $modalInstance.dismiss()
    }
    var addressToString = ""
    addressToString = freight.address.country + freight.address.state + freight.address.city + freight.address.suburb + freight.address.street1
    if (freight.address.street2 != undefined) {
        addressToString += freight.address.street2 + " " + freight.address.postalCode
    } else {
        addressToString += " " + freight.address.postalCode
    }
    $scope.address = addressToString
})
YundaApp.controller('CarouseCtrl', function ($scope) {
    $scope.myInterval = 5000
    var slides = $scope.slides = [
        {
            image: '/image/banner1.jpg'
        },
        {
            image: 'image/banner2.jpg'
        },
        {
            image: 'image/banner3.jpg'
        }
    ]
    //$scope.addSlide = function () {
    //    var newWidth = 600 + slides.length + 1
    //    slides.push({
    //        image: 'http://placekitten.com/' + newWidth + '/300',
    //        text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4] + ' ' +
    //        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    //    })
    //}
    //for (var i = 0; i < 4; i++) {
    //    $scope.addSlide()
    //}

})
YundaApp.controller('ManualCtrl', function ($scope) {
    $scope.freightIn = new YD.FreightIn()


    $scope.reloadManual = function () {
        var query = new AV.Query(YD.FreightIn)
        query.equalTo("user", $scope.currentUser)
        query.equalTo("status", YD.FreightIn.STATUS_MANUAL)
        query.find({
            success: function (list) {
                $scope.freights = list
                for (var i = 0; i < list.length; i++) {
                    var tmp = $scope.freights[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                    if (tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();
                    $scope.freights[i].createdAt = tmp_date
                }
            }
        })
    }

    $scope.reloadManual()
    $scope.submitFreightIn = function () {
        $scope.freightIn.status = YD.FreightIn.STATUS_MANUAL
        $scope.freightIn.user = $scope.currentUser
        $scope.freightIn.weight = 0
        $scope.freightIn.save(null, {
            success: function (f) {
                console.log("MANUAL frieghtin saved ")
                alert("运单已上传成功!")
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
        query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED])
        if ($scope.currentUser.id != undefined) {
            query.find({
                success: function (result) {

                    console.log("RETURN find return list, length: " + result.length)
                    $scope.returnList = result
                    for (var i = 0; i < $scope.returnList.length; i++) {
                        if ($scope.returnList[i].status == YD.FreightReturn.STATUS_PENDING) {
                            $scope.returnList[i].status = "等待昀達处理"
                        } else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_FINISHED) {
                            $scope.returnList[i].status = "已处理"
                        } else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_REFUSED) {
                            $scope.returnList[i].status = "昀達拒绝退货"
                        }
                        var tmp = $scope.returnList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.returnList[i].createdAt = tmp_date
                        if($scope.returnList[i].adminEvidence != undefined)
                        $scope.returnList[i].adminEvidence = $scope.returnList[i].adminEvidence.url()

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
                alert("退货成功！")
        }

    }
})

YundaApp.controller('ReturnBalanceCtrl', function($scope) {
    $scope.reloadReturnBalance = function() {
        var query = new AV.Query("Transaction")
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status",
            [YD.Transaction.STATUS_PENDING_RETURN_BALANCE, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_REFUSED_RETURN_BALANCE])
        query.find({
            success: function(list) {
                $scope.transactionList = list
                for(var i = 0; i < $scope.transactionList.length; i++) {
                    if($scope.transactionList[i].status == YD.Transaction.STATUS_PENDING_RETURN_BALANCE)
                    $scope.transactionList[i].status = "正在等待处理"
                   else if($scope.transactionList[i].status == YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE)
                    $scope.transactionList[i].status = "已退款"
                    else if($scope.transactionList[i].status == YD.Transaction.STATUS_REFUSED_RETURN_BALANCE)
                        $scope.transactionList[i].status = "昀達拒绝付款"

                    var tmp = $scope.transactionList[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                    if(tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();
                    $scope.transactionList[i].createdAt = tmp_date
                    //console.log("In ReturnBalance Ctrl -- image" + "[" + i + "]" + $scope.transactionList[i].adminEvidence.url())
                    if($scope.transactionList[i].adminEvidence != undefined)
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
    $scope.systemStreet = $rootScope.systemStreet
    $scope.systemCity = $rootScope.systemCity
    $scope.systemState = $rootScope.systemState
    $scope.systemZipcode = $rootScope.systemZipcode

    console.log("In Dashboard -- user balance: " + $scope.currentUser.balance)
    console.log("In Dashboard -- user balanceInDollar: " + $scope.currentUser.balanceInDollar + " | type: " + typeof($scope.currentUser.balanceInDollar))
    console.log("In Dashboard -- user pendingBalance: " + $scope.currentUser.get("pendingBalance") + " | type: " + typeof($scope.currentUser.get("pendingBalance")))
    console.log("In Dashboard -- user pendingBalanceInDollar: " + $scope.currentUser.pendingBalanceInDollar + " | type: " + typeof($scope.currentUser.pendingBalanceInDollar))

    //$scope.change_tab = function (tab) {
    //    $scope.view_tab = tab
    //}
    $scope.$watch('badgeTotalCount', function (newVal) {
        console.log("In Dashboard $watch BadgeTotal now: " + newVal)
    })
    console.log("stringId: " + $scope.currentUser.stringId)
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
            query.include("identity")
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
        query.include("identity")

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
            size: 'md',
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

    $scope.showRecipientDetails = function(address) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showRecipientDetails',
            controller: 'ShowRecipientDetails',
            scope: $scope,
            size: 'md',
            resolve: {
                address: function () {
                    return address
                }
            },
            windowClass: 'center-modal'
        })
    }
})

YundaApp.controller('ShowRecipientDetails', function($scope, $modalInstance, address) {
    $scope.address = address
    $scope.close = function() {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('DeleteAddressCtrl', function ($scope, $modalInstance, address) {
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
        console.log("UpdateUserCtrl -- addressId: " + $scope.currentUser.addressId)

        address.id = $scope.currentUser.addressId
        address.fetch().then(function (address) {
            $scope.address = address
            console.log("UpdateUserCtrl -- address fetched: " + $scope.address.id)
        })
    } else {
        $scope.address = new YD.Address()
        console.log("UpdateUserCtrl -- new address created: " + $scope.address.id)

    }

    $scope.update_user = function () {

        $scope.address.user = $scope.currentUser
        $scope.address.save(null, {
            success: function (address) {
                console.log("update_user() save address success")
                $scope.currentUser.addressId = address.id
                $scope.currentUser.save(null, {
                    success: function (user) {
                        console.log("update_user() success")
                        //console.log("update_user() success mobile: " + user.mobilePhoneNumber)
                        alert("更新成功！")
                    },
                    error: function (user, error) {
                        console.log("update_user() fail: " + error.id + error.message)
                    }
                })
            },
            error: function (a, error) {
                console.log("update_user() save address fail : " + error.message)
            }
        })

        //$scope.currentUser.mobilePhoneNumber = '23232323'

    }
})

YundaApp.controller('freightInArrivedCtrl', function ($scope, $rootScope, $modal, $filter) {
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.reloadFreightInArrived = function () {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("FreightIn")
            query.equalTo("user", $scope.currentUser)
            query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE])

            query.find({
                success: function (results) {
                    $scope.$apply(function () {
                        //console.log("FreightIn arrived is shown TRACKING: " + results[0].status)
                        $scope.freightIns = results

                        for (var i = 0; i < $scope.freightIns.length; i++) {
                            //format date
                            var tmp = $scope.freightIns[i].createdAt
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes()
                            else
                                tmp_date += tmp.getMinutes();
                            $scope.freightIns[i].createdAt = tmp_date

                            //format status
                            if($scope.freightIns[i].status == YD.FreightIn.STATUS_ARRIVED)
                                $scope.freightIns[i].status = "等待入库"
                            else if($scope.freightIns[i].status == YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE)
                                $scope.freightIns[i].status = "待开箱检查"
                            else if($scope.freightIns[i].status == YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE)
                                $scope.freightIns[i].status = "已开箱检查"
                        }
                        $rootScope.badgeTotalCount -= $scope.badgeACount
                        $scope.badgeACount = results.length
                        $rootScope.badgeTotalCount += $scope.badgeACount
                        console.log("Badge A now: " + $scope.badgeACount)
                        console.log("BadgeTotal now: " + $rootScope.badgeTotalCount)

                    })
                    //console.log("FreightIn arrived is shown")
                },
                error: function (error) {
                    alert("Getting Freight In Error: " + error.code + " " + error.message)
                }
            })
        }
    }
    $scope.reloadFreightInArrived()
    $scope.openNotesWithImage = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_openNotesWithImage',
            controller: 'OpenNotesWithImageCtrl',
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

        })
    }
    $scope.leaveComments = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_leaveComments',
            controller: 'LeaveCommentsCtrl',
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
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
        })

    }
    $scope.freightInConfirm = function (freightIn) {
        if ($scope.currentUser.id != undefined) {
            freightIn.status = YD.FreightIn.STATUS_CONFIRMED
            freightIn.save().then(function (freightIn) {
                console.log("freightInConfirm()-- freightIn.status updated: " + freightIn.status)
                $scope.reloadFreightInArrived()
                alert("已确认入库")

            }, function (freightIn, error) {
                console.log(error.message)
            })
        }
    }

    $scope.checkPackage = function(freightIn) {

        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_checkPackage',
            controller: 'CheckPackageCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.isLoading = true;
            $scope.promote = "正在提交，请稍候...";
            freightIn.status = YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE
            freightIn.save(null,{
                success: function(f) {
                    $scope.currentUser.balanceInDollar -= 3.5
                    $scope.currentUser.save(null, {
                        success: function(u) {
                            var transaction = new YD.Transaction()
                            //transaction.record = data;
                            transaction.status = YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE
                            transaction.amount = -3.5;
                            transaction.user = $scope.currentUser
                            transaction.save(null, {
                                success: function(t) {
                                    $scope.reloadFreightInArrived()
                                    $scope.isLoading = false
                                    $scope.promote = ""
                                    alert("申请验货成功!请耐心等待管理员处理，并关注此运单的管理员反馈")
                                },
                                error: function(t, error) {
                                    alert("出错！" + error.message)
                                    $scope.isLoading = false
                                    $scope.promote = ""
                                }
                            })
                        },
                        error: function(u, error) {
                            alert("出错！" + error.message)
                            $scope.isLoading = false
                            $scope.promote = ""
                        }
                    })
                },
                error: function(f, error) {
                    alert("出错！" + error.message)
                    $scope.isLoading = false
                    $scope.promote = ""
                }
            })

        })
    }
})

YundaApp.controller('CheckPackageCtrl', function($scope, $modalInstance) {
    $scope.confirm = function() {
        $modalInstance.close()
    }
    $scope.close = function() {
        $modalInstance.dismiss()
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
            size: 'md',
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

    $scope.mergePackage = function () {
        var freightInList = []
        for (var i = 0; i < $scope.freightIns.length; i++) {
            if ($scope.freightIns[i].selection == true)
                freightInList.push($scope.freightIns[i])
        }
        if(freightInList.length <= 1) {
            alert("物品合包数量必须大于一件！")
            return
        }
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseAddress',
            controller: 'mergePackageCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freightInList: function () {
                    return freightInList
                },
                addressList: function () {
                    return $scope.addressList
                }
            },
            windowClass: 'center-modal'
        })

        modalInstance.result.then(function () {
            $scope.reloadFreightInConfirmed()
            alert("合包成功！")

            console.log("mergePackage: merge successfully")
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
                            reduceWeight: false
                        }
                        $scope.freightIns[i].selection = false
                        $scope.freightIns[i].estimatePrice = $scope.freightIns[i].weight * $scope.PRICE
                        var tmp = $scope.freightIns[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freightIns[i].createdAt = tmp_date
                        //$scope.freightIns[i].status = "已确认入库"

                    }

                    $scope.getRecipient()
                    $scope.$apply(function () {
                        $rootScope.badgeTotalCount -= $scope.badgeBCount
                        $scope.badgeBCount = results.length
                        $rootScope.badgeTotalCount += $scope.badgeBCount

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

    $scope.chooseSplitType = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseSplitType',
            controller: 'ChooseSplitTypeCtrl',
            scope: $scope,
            size: 'sm',

            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenType) {
            //freightIn.address = chosenAddress
            //alert("已成功选取收件人")
            if(chosenType === "normal")
            $scope.splitPackage(freightIn)
            else if(chosenType === "charge")
            $scope.splitPackagePremium(freightIn)
        })
    }
    $scope.chooseAddress = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseRecipientAddress',
            controller: 'ChooseAddressCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                addressList: function () {
                    return $scope.addressList
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenAddress) {
            freightIn.address = chosenAddress
            //alert("已成功选取收件人")
        })
    }

    $scope.splitPackage = function (freightIn) {
        if(freightIn.isSplit || freightIn.isSplitPremium) {
            alert("您已经进行过分包")
            return
        }

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
            freightIn.status = YD.FreightIn.STATUS_FINISHED
            freightIn.save(null, {
                success: function(f) {
                    alert("分箱完成！请等待页面刷新后，分别对分出的包裹进行操作(每个分出的包裹都可以进行单独的操作，如加固，减重等)")
                    $scope.reloadFreightInConfirmed()

                }
            })
            console.log("addNewAddress(): new address is added")
        })
    }
    $scope.splitPackagePremium = function (freightIn) {
        if(freightIn.isSplit || freightIn.isSplitPremium) {
            alert("您已经进行过分包")
            return
        }
        alert("精确分包将收取费用！($3.5)")
        if($scope.currentUser.balanceInDollar < 3.5) {
            alert("账户金额不足，请先充值！")
            return
        }
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
        modalInstance.result.then(function () {
            freightIn.status = YD.FreightIn.STATUS_FINISHED
            freightIn.save(null, {
                success: function(f) {
                    console.log("balance: " +  $scope.currentUser.balanceInDollar)
                    $scope.currentUser.balanceInDollar -= 3.5
                    $scope.currentUser.save(null, {
                        success: function(u) {
                            console.log("after balance: " +  $scope.currentUser.balanceInDollar)

                            var transaction = new YD.Transaction()
                            //transaction.record = data;
                            transaction.status = YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE
                            transaction.amount = -3.5;
                            transaction.user = $scope.currentUser
                            //$scope.currentUser.reward +=  Math.round(paymentAmount)
                            transaction.save(null, {
                                success: function(t) {
                                    $scope.reloadFreightInConfirmed()

                                    alert("分箱完成！已扣除相关费用！请等待页面刷新后，分别对分出的包裹进行操作(每个分出的包裹都可以进行单独的操作，如加固，减重等)");

                                },
                                error: function(t, error) {
                                    alert("错误!" + error.message)
                                }
                            })
                        }
                    })
                }
            })
            console.log("addNewAddress(): new address is added")
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

            }
            freight.user = $scope.currentUser
            freight.weight = freightIn.weight
            freight.trackingNumber = freightIn.trackingNumber
            //freight.estimatedPrice = freightIn.weight * $scope.PRICE
            freight.status = YD.Freight.STATUS_INITIALIZED
            freight.comments = freightIn.comments
            if(freightIn.isSplit) {
                freight.isSplit = true
                freight.splitReference = freightIn.splitReference
                freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
            }

            if(freightIn.isSplitPremium) {
                freight.isSplitPremium = true
                freight.splitReference = freightIn.splitReference
                freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED)
            }
            freight.save(null, {
                success: function (freight) {
                    console.log("freight has been saved: " + freight.id)
                    $scope.badgeCount += 1
                    freightIn.status = YD.FreightIn.STATUS_FINISHED
                    freightIn.save(null, {
                        success: function (freightIn) {
                            console.log("freightIn has been saved: " + freightIn.id)
                            alert("生成运单成功!")
                            $scope.reloadFreightInConfirmed()
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

        }
    }

    $scope.generateDeliveryFreight = function (freightIn) {
        if (freightIn.address == undefined) {
            alert("Choose address first")
        } else {
            //var test = AV.Object.extend("Freight")
            //var freight = new test()
            var freight = new YD.Freight
            freight.address = freightIn.address
            //freight.freightIn = freightIn
            //freight.set("freightIn", freightIn)
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION)

            freight.user = $scope.currentUser
            freight.weight = freightIn.weight
            freight.trackingNumber = freightIn.trackingNumber
            //freight.estimatedPrice = freightIn.weight * $scope.PRICE
            freight.status = YD.Freight.STATUS_INITIALIZED
            freight.comments = freightIn.comments
            if(freightIn.isSplit) {
                freight.isSplit = true
                freight.splitReference = freightin.splitReference
            }
            if(freightIn.isSplitPremium) {
                freight.isSplitPremium = true
                freight.splitReference = freightIn.splitReference
                freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED)
            }
            freight.save(null, {
                success: function (freight) {
                    console.log("freight has been saved: " + freight.id)
                    //$scope.badgeCount -= 1
                    freightIn.status = YD.FreightIn.STATUS_FINISHED;
                    freightIn.save(null, {
                        success: function (freightIn) {
                            console.log("freightIn has been saved: " + freightIn.id)
                            //$scope.badgeCount += 1
                            alert("运单已生成")

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


    $scope.openComments = function(f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_leaveComments',
            controller: 'LeaveFreightCommentsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function() {
                    return f;
                }
            },
            windowClass: 'center-modal'
        })

        modalInstance.result.then(function () {
            alert("保存成功!")

        })
    }

    $scope.openNotes = function(f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_openNotes',
            controller: 'OpenFreightNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function() {
                    return f;
                }
            },
            windowClass: 'center-modal'
        })

    }

})

YundaApp.controller('ChooseSplitTypeCtrl', function($scope, $modalInstance) {
    $scope.confirm = function() {
        $modalInstance.close("normal")
    }

    $scope.confirmCharge = function() {
        $modalInstance.close("charge")
    }

    $scope.close = function() {
        $modalInstance.dismiss()
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
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":" ;
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freights[i].updatedAt = tmp_date

                    }
                    //$rootScope.badgeTotalCount -= $scope.badgeECount
                    $scope.badgeECount = list.length
                    //$rootScope.badgeTotalCount += $scope.badgeECount
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


YundaApp.controller('mergePackageCtrl', function ($scope, $modalInstance, freightInList, $modal) {
    $scope.checkboxModel = {}
    $scope.checkboxModel.addPackage = false
    $scope.freightInList = freightInList

    //
    //$scope.mergeChooseRecipient = function (address) {
    //    $scope.chosenAddress = address
    //    console.log("Chosen Address: " + $scope.chosenAddress.country)
    //
    //}
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
    $scope.getRecipient()


    $scope.chooseRecipient = function () {
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
            $scope.chosenAddress = chosenAddress
            alert("已成功选取收件人: "+ chosenAddress.recipient)
        })
    }
    $scope.addNewRecipient = function () {
        var address = new YD.Address()
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_address',
            controller: 'EditAddressCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                address: function () {
                    return address
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            console.log("addNewAddress(): new address is added")
            $scope.getRecipient()
            alert("添加新收件人成功！")
        })
    }
    $scope.confirmMergePackage = function () {

        var freight = new YD.Freight()
        for (var i = 0; i < freightInList.length; i++) {
            freight.add("freightInGroup", freightInList[i].trackingNumber)
        }
        //freight.freightInGroup = freightInList
        freight.address = $scope.chosenAddress
        freight.user = $scope.currentUser
        freight.weight = 0
        //freight.set("status", 0)
        freight.status = 0
        freight.comments = $scope.addedComment
        freight.add("statusGroup", YD.Freight.STATUS_PENDING_MERGE_PACKAGE)

        if($scope.checkboxModel.addPackage == true) {
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING)
        }
        freight.isMerge = true

        freight.save(null, {
            success: function (freight) {
                console.log("freight has been saved: " + freight.id)
                for(var i = 0; i < freight.statusGroup.length; i++) {
                    console.log("In MergeCtrl -- status: " + freight.statusGroup[i])
                }

                for(var i = 0; i < freight.freightInGroup.length; i++) {
                    console.log("In MergeCtrl -- freightin: " + freight.freightInGroup[i])
                }

                for (var i = 0; i < freightInList.length; i++) {
                    freightInList[i].status = YD.FreightIn.STATUS_FINISHED
                }
                AV.Object.saveAll(freightInList, {
                    success: function (list) {
                        console.log("mergePackage: freightList has been saved")
                        $modalInstance.close()
                    },
                    error: function (error) {
                        console.log("ERROR: mergePackage: freightList has not been saved" + error.id + " - " + error.message)
                    }
                })
            },
            error: function (freight, error) {
                console.log("ERROR: freight not save: " + error.code + " - " + error.message)
            }
        })



    }

    $scope.cancelMergePackage = function () {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('OpenNotesWithImageCtrl', function($scope, $modalInstance, freightIn) {
    $scope.freightIn = freightIn
    $scope.close = function() {
        $modalInstance.close()
    }
})

YundaApp.controller('LeaveCommentsCtrl', function($scope, $modalInstance, freightIn) {
    var query = new AV.Query(YD.FreightIn)
    query.get(freightIn.id, {
        success: function(f) {
            $scope.$apply(function() {
                $scope.freightIn = f
                console.log("LeaveNoteCtrl -- freight.id: " + $scope.freightIn.notes)
            })

        },
        error: function(f, error) {
            console.log("LeaveNoteCtrl -- ERR: " + error.message)
        }
    })

    $scope.saveComments = function() {
        $scope.freightIn.save(null, {
            success: function(f) {
                console.log("LeaveNoteCtrl -- ")
                $modalInstance.close()
            },
            error: function(f) {
                console.log("LeaveNotesCtrl -- ERR: " + error.message)
            }
        })
    }
    $scope.close = function() {
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

YundaApp.controller('FreightConfirmedCtrl', function ($scope, $rootScope, $modal) {
    //$scope.baojin = 0
    //$scope.baoshuijin = 0
    $scope.BAO_JIN = 0.02
    $scope.BAO_SHUI_JIN = 0.05
    $scope.smallPackageInitial = $rootScope.smallPackageInitial
    $scope.smallPackageContinue = $rootScope.smallPackageContinue
    $scope.normalPackageInitial = $rootScope.normalPackageInitial
    $scope.normalPackageContinue = $rootScope.normalPackageContinue
    //$scope.PRICE = 8
    $scope.options = [{name: "小包裹渠道", value : 0}, {name: "普通渠道", value : 1}]
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
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":" ;
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
    $scope.exceedWeight = {}
    $scope.exceedWeight.amount = 0

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
            if(freight.exceedWeight != undefined) {
                if(freight.exceedWeight > freight.weight)
                $scope.exceedWeight.amount += freight.exceedWeight - freight.weight
            }
        }
        if (freight.selection == false) {
            $scope.total -= freight.estimatedPrice
            $scope.totalWeight -= freight.weight
            //$scope.totalAmount -= 1
            $scope.provideOptions()
            if(freight.exceedWeight != undefined) {
                if(freight.exceedWeight > freight.weight)
                    $scope.exceedWeight.amount -= freight.exceedWeight - freight.weight
            }
        }
    }


    $scope.payment = function () {
        var paymentAmount = 0;
        var NUMBER = 'number';
        if ($scope.confirmTC == false) {
            alert("付款必须先同意条款")
            return
        } else if ($scope.reward.amount > $scope.currentUser.reward) {
            console.log("reward.amount: " + $scope.reward.amount + " | user.reward: " + $scope.currentUser.reward)
            alert("输入使用YD币大于账户现有YD币，请重新输入")
            return
        } else if($scope.selectedMethod.name == undefined){
            alert("请先选择运输渠道!")
            return
        } else if($scope.confirmInsurance && $scope.insurance.value <= 0) {
            alert("请输入正确的总申报价值!")
            return
        } else if($scope.confirmTaxInsurance && $scope.taxInsurance.amount <= 0) {
            alert("请输入正确的总保税金比例!")
            return
        } else if($scope.confirmReward && $scope.reward.amount <= 0) {
            alert("请输入正确的使用YD币点数!")
            return
        } else if(typeof($scope.reward.amount) != 'number' || typeof($scope.insurance.value) != 'number' || typeof($scope.taxInsurance.amount) != 'number') {
            alert("请输入数字金额！")
            console.log("TYPE is: " + typeof($scope.insurance.value)  )
            return
        }
        else{
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
                var FIRST_CHARGE = $scope.smallPackageInitial
                var CONTINUE_CHARGE = $scope.smallPackageContinue
                paymentAmount = FIRST_CHARGE + ($scope.totalWeight - 1) * CONTINUE_CHARGE
            } else if ($scope.selectedMethod.name === '普通渠道') {
                var FIRST_CHARGE = $scope.normalPackageInitial
                var CONTINUE_CHARGE = $scope.normalPackageContinue
                paymentAmount = FIRST_CHARGE + ($scope.totalWeight - 1) * CONTINUE_CHARGE
            }

            if ($scope.confirmInsurance && $scope.confirmTaxInsurance && $scope.confirmReward) {//add insurance, tax insurance and use reward
                paymentAmount = paymentAmount + parseInt($scope.insurance.amount) + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 - parseFloat((parseInt($scope.reward.amount) / 100).toFixed(2)) + $scope.exceedWeight.amount

            } else if ($scope.confirmTaxInsurance && $scope.confirmReward) {  // add tax insurance, and use reward
                paymentAmount = paymentAmount + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 - parseFloat((parseInt($scope.reward.amount) / 100).toFixed(2)) + $scope.exceedWeight.amount

            } else if ($scope.confirmInsurance && $scope.confirmReward) { // add insurance, and use reward
                paymentAmount = paymentAmount + parseInt($scope.insurance.amount) - parseFloat((parseInt($scope.reward.amount) / 100).toFixed(2)) + $scope.exceedWeight.amount

            } else if ($scope.confirmInsurance && $scope.confirmTaxInsurance) { // add insurance and tax insurance
                paymentAmount = paymentAmount + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 + parseInt($scope.insurance.amount)  + $scope.exceedWeight.amount

            } else if ($scope.confirmTaxInsurance) {// add tax insurance
                paymentAmount = paymentAmount + paymentAmount * parseInt($scope.taxInsurance.amount) / 100  + $scope.exceedWeight.amount

            } else if ($scope.confirmInsurance) {// add insurance
                paymentAmount = paymentAmount + parseInt($scope.insurance.amount)  + $scope.exceedWeight.amount

            } else if ($scope.confirmReward) { // use reward
                paymentAmount = paymentAmount -  parseFloat((parseInt($scope.reward.amount) / 100).toFixed(2))  + $scope.exceedWeight.amount

            } else {
            }

            console.log("In payment -- here is the paymentAmount: " + paymentAmount)
            console.log("In payment -- here is the userbalance: " + $scope.currentUser.balance)
            console.log("In payment -- here is the balanceInDollar: " + $scope.currentUser.balanceInDollar)


            if ($scope.currentUser.balanceInDollar < paymentAmount) {
                alert("账户余额不足，请先充值!")
                console.log("balance not enough")
                return
            } else {
                $scope.currentUser.balanceInDollar -= paymentAmount
                //console.log("balance - success")
                var transaction = new YD.Transaction()
                //transaction.record = data;
                transaction.status = YD.Transaction.STATUS_CONSUME;
                transaction.amount = paymentAmount * -1;
                transaction.user = $scope.currentUser
                $scope.currentUser.reward +=  Math.round(paymentAmount)
                transaction.save(null, {
                    success: function (t) {
                        console.log("transaction saved")
                        AV.Object.saveAll(paymentList, {
                            success: function (list) {
                                console.log("confirmSplit: freightList has been saved")
                                $scope.currentUser.save(null, {
                                    success: function (user) {
                                        console.log("currentUser balance saved")
                                        alert("扣款成功,系统自动赠送相应YD币！剩余金额为: $" + user.balanceInDollar + ", 当前YD币为: " + user.reward)
                                        $scope.reloadFreightConfirmed()
                                    },
                                    error: function (user, err) {
                                        console.log("Substrat balance err: " + err.message)
                                    }
                                })
                            },
                            error: function (freights, error) {
                                console.log("ERROR: confirmSplit: freightList has not been saved" + error.id + " - " + error.message)
                            }
                        })
                    },
                    error: function (t, error) {
                        console.log("transaction not saved " + error.message)
                    }
                })
            }
        }
    }

    $scope.openComments = function(f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_leaveComments',
            controller: 'LeaveFreightCommentsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function() {
                    return f;
                }
            },
            windowClass: 'center-modal'
        })

        modalInstance.result.then(function () {
            alert("保存成功!")

        })
    }

    $scope.openNotes = function(f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_openNotes',
            controller: 'OpenFreightNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function() {
                    return f;
                }
            },
            windowClass: 'center-modal'
        })

    }
})

YundaApp.controller('OpenFreightNotesCtrl', function($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.close = function() {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('LeaveFreightCommentsCtrl', function($scope, $modalInstance, freight) {
    $scope.freightIn = freight
    $scope.saveComments = function() {
        $scope.freightIn.save(null, {
            success: function(f) {
                $modalInstance.close()
            },
            error: function(f,error) {
                alert("错误！")
                console.log("ERROR: " + error.message)
                $modalInstance.dismiss()
            }
        })
    }
    $scope.close = function() {
        $modalInstance.dismiss()
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
                            statusToString = "等待发货"
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
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":" ;
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
    $scope.origin = {}
    $scope.origin.address = ""
    $scope.ischosenAddress = false

    $scope.isLoading = false
    $scope.promote = ""
    $scope.isSearch = false
    $scope.changeAddressFreight = new YD.FreightChangeAddress()
    $scope.reloadChangeAddress = function() {
        var query = new AV.Query("FreightChangeAddress")
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status", [YD.FreightChangeAddress.STATUS_AWAITING, YD.FreightChangeAddress.STATUS_CONFIRMED, YD.FreightChangeAddress.STATUS_REFUSED])
        query.find({
            success: function(list) {
                $scope.$apply(function(){
                    $scope.freights = list
                    console.log("In ChangeAddressCtrl -- find F: " + list.length)

                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.freights[i].createdAt = tmp_date
                        if($scope.freights[i].status == YD.FreightChangeAddress.STATUS_AWAITING)
                            $scope.freights[i].status = "等待处理"
                        else if($scope.freights[i].status == YD.FreightChangeAddress.STATUS_CONFIRMED)
                            $scope.freights[i].status = "已处理"
                        else if($scope.freights[i].status == YD.FreightChangeAddress.STATUS_REFUSED)
                            $scope.freights[i].status = "拒绝处理"

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

    $scope.searchForFreight = function () {
        var ref = $scope.changeAddressFreight.reference
        if (ref == undefined) {
            alert("请先输入运单号")
            return
        } else {
            $scope.isLoading = true
            $scope.promote = "正在查找..."
            $scope.isSearch = true


            var query = new AV.Query(YD.Freight)
            query.include("address")
            //query.equalTo("objectId", ref)
            console.log("ref: " + ref)
            query.get(ref, {
                success: function (f) {
                    console.log("Found freight:  " + f.status)
                    $scope.freight = f
                    var addressToString = ""
                    if ($scope.freight.address != undefined) {
                        $scope.freight.recipient = $scope.freight.address.recipient
                        addressToString = $scope.freight.address.country + $scope.freight.address.state + $scope.freight.address.city + $scope.freight.address.suburb + $scope.freight.address.street1
                        if ($scope.freight.address.street2 != undefined) {
                            addressToString += $scope.freight.address.street2
                        }
                        $scope.origin.address = addressToString
                        console.log("freightaddress: " + $scope.freight.address)
                        $scope.isLoading = false
                        $scope.promote = ""
                        $scope.isSearch = false
                        $scope.$apply()
                    } else {
                        alert("此运单没有收货地址！")
                        $scope.freight.address="无地址"
                        $scope.isLoading = false
                        $scope.promote = ""
                        $scope.isSearch = false
                        $scope.$apply()
                        return
                    }

                },
                error: function(f, error) {
                    alert("没有找到！请检查单号是否有误")
                    $scope.isLoading = false
                    $scope.promote = ""
                    $scope.isSearch = false
                    $scope.$apply()
                    return
                }
            })

        }

    }
    $scope.chooseRecipient = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseRecipientAddress',
            controller: 'ChooseAddressCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                addressList: function () {
                    return $scope.recipientAddresses
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenAddress) {
            $scope.changeAddressFreight.address = chosenAddress
            $scope.chosenAddress = chosenAddress.recipient + chosenAddress.country + chosenAddress.state + chosenAddress.city + chosenAddress.suburb + chosenAddress.street1
            if (chosenAddress.street2 != undefined) {
                $scope.chosenAddress += chosenAddress.street2
            }

            //alert("已成功选取收件人")
            $scope.ischosenAddress = true
        })
    }

    $scope.addNewRecipient = function () {
            var address = new YD.Address()
            var modalInstance = $modal.open({
                templateUrl: 'partials/modal_address',
                controller: 'EditAddressCtrl',
                scope: $scope,
                size: 'md',
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
        query.containedIn("objectId", $scope.trackingList)
        query.equalTo("user", $scope.currentUser)
        query.find({
            success: function (list) {
                console.log("list length:  " + list.length)
                for (var i = 0; i < list.length; i++) {
                    list[i].info = "待发货"
                    $scope.resultList.push(list[i])
                }
                var  query1 = new AV.Query("Freight")
                query1.containedIn("objectId", $scope.trackingList)
                query1.equalTo("user", $scope.currentUser)
                query1.find({
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
                } else {
                    alert("没有结果！")
                    return
                }
            },
            error: function (error) {
                console.log("LF FIn ERROR: " + error.message)
            }
        })
//@todo combine these two

    }
})
/* Edit address controller */

YundaApp.controller('EditAddressCtrl', function ($scope, $modalInstance, address) {
    $scope.isLoading = false
    $scope.promote = ""
    $scope.isSaving = false;
    $scope.address = address
    if(!$scope.address.identity) {
        $scope.identity = new YD.Identity();
    } else {
        $scope.identity = $scope.address.identity;
    }
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }

    $scope.filesChangedBack = function (elm) {
        $scope.identityBack = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        //console.log("In fileUpload back: " + $scope.identityBack[0])
        //console.log("In fileUpload front: " + $scope.identityFront[0])

        if ($scope.identityFront != undefined && $scope.identityBack != undefined) {
            //console.log("In fileUpload back: " + $scope.identityFront[0].name)
            //console.log("In fileUpload front: " + $scope.identityBack[0].name)
            $scope.isLoading = true
            $scope.promote = "正在上传身份证照片，请稍后..."
            $scope.isSaving = true;
            var frontName = 'front.jpg'
            var backName = 'back.jpg'
            var avFileFront = new AV.File(frontName, $scope.identityFront[0])
            var avFileBack = new AV.File(backName, $scope.identityBack[0])

            //var identity = new YD.Identity();

            $scope.identity.identityFront = avFileFront
            $scope.identity.identityBack = avFileBack
            $scope.identity.save(null, {
                success: function(id) {
                    alert("身份证上传成功,请保存修改")
                    $scope.identity = id;
                    $scope.isLoading = false
                    $scope.promote = ""
                    $scope.isSaving = false
                    $scope.$apply()
                },
                error: function(id, error) {
                    alert("错误！: " + error.message);
                    $scope.isLoading = false
                    $scope.promote = ""
                    $scope.isSaving = false
                    $scope.$apply()

                }
            });

        } else {
            alert("请先上传身份证照片.")

        }
    }

    $scope.saveAddressSubmit = function () {
        $scope.address.user = $scope.currentUser
        $scope.address.identity = $scope.identity;
        $scope.isLoading = true
        $scope.promote = "正在保存..."
        $scope.address.save(null, {
            success: function(address) {
                alert("成功保存收件人信息！")
                $scope.isLoading = false
                $scope.promote = ""
                $modalInstance.close(address)
            },
            error: function(address, error) {
                alert("出错！" + error.message)
                $scope.isLoading = false
                $scope.promote = ""
                $modalInstance.dismiss()
            }
        });
    }
    $scope.close = function() {
        $modalInstance.dismiss()
    }

})
YundaApp.controller('SplitPackageCtrl', function ($scope, $modalInstance, freightIn) {
    $scope.notes
    $scope.amount = 0
    $scope.isPremium = false
    $scope.getRecipient()

    $scope.freightList = []
    $scope.generateFreightList = function () {
        //console.log("changed to: " + $scope.amount)
        $scope.freightList = []
        for (var i = 0; i < $scope.amount; i++) {
            $scope.freightList[i] = new YD.FreightIn()
            //$scope.freightList[i].freightIn = freightIn
            $scope.freightList[i].status = YD.FreightIn.STATUS_CONFIRMED
            var statusList = []
            var index = i+1
            //statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
            //$scope.freightList[i].statusGroup = statusList
            $scope.freightList[i].user = freightIn.user
            $scope.freightList[i].splitReference = "普通分箱" + index + "/" + $scope.amount + ", 原单号为: " + freightIn.trackingNumber
            $scope.freightList[i].isSplit = true
            $scope.freightList[i].trackingNumber = freightIn.trackingNumber + "_split" + index + "/" + $scope.amount+"*"
            $scope.freightList[i].weight = 0
        }
    }
    //$scope.splitChooseRecipient = function (address, freight) {
    //    freight.address = address
    //}
    $scope.close = function() {
        $modalInstance.dismiss()
    }
    $scope.confirmSplit = function () {
        AV.Object.saveAll($scope.freightList, {
            success: function (list) {
                $modalInstance.close()
                console.log("confirmSplit: freightList has been saved")
            },
            error: function (error) {
                console.log("ERROR: confirmSplit: freightList has not been saved")
            }
        })
    }
})

YundaApp.controller('SplitPackagePremiumCtrl', function ($scope, $modalInstance, freightIn) {
    $scope.notes
    $scope.amount = 0
    $scope.getRecipient()
    $scope.isPremium = true
    $scope.freightList = []

    $scope.generateFreightList = function () {
        //console.log("changed to: " + $scope.amount)
        $scope.freightList = []
        for (var i = 0; i < $scope.amount; i++) {
            $scope.freightList[i] = new YD.FreightIn()
            //$scope.freightList[i].freightIn = freightIn
            $scope.freightList[i].status = YD.FreightIn.STATUS_CONFIRMED
            var statusList = []
            var index = i+1
            //statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
            //$scope.freightList[i].statusGroup = statusList
            $scope.freightList[i].user = freightIn.user
            $scope.freightList[i].splitReference = "精确分箱" + index + "/" + $scope.amount + ", 原单号为: " + freightIn.trackingNumber
            $scope.freightList[i].isSplitPremium = true
            $scope.freightList[i].trackingNumber = freightIn.trackingNumber + "_split" + index + "/" + $scope.amount+"*"
            $scope.freightList[i].weight = 0
        }
    }
    //$scope.splitChooseRecipient = function (address, freight) {
    //    freight.address = address
    //}
    $scope.close = function() {
        $modalInstance.dismiss()
    }
    $scope.confirmSplit = function () {
        AV.Object.saveAll($scope.freightList, {
            success: function (list) {
                $modalInstance.close()

                console.log("confirmSplit: freightList has been saved")
            },
            error: function (error) {
                console.log("ERROR: confirmSplit: freightList has not been saved")
            }
        })
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
    $scope.$watch('CNY', function (newVal) {
        if (newVal != 0 || newVal != undefined) {
            $scope.USD = ((newVal / $scope.FIXED_RATE) * (1 + 0.29) + 0.3).toFixed(2)
            $scope.USD = parseFloat($scope.USD)
        }
    }, true)


    $scope.stripePayment = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_stripe',
            controller: 'StripeCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                USD: function() {
                    return $scope.USD;
                }
            },
            windowClass: 'center-modal'
        })

        modalInstance.result.then(function () {
            alert("充值成功!")

        })
    }
})


YundaApp.controller('StripeCtrl', function ($scope, $rootScope, $modalInstance, USD) {
    $scope.USD = USD
    $scope.isPaid = false
    $scope.stripeCallback = function (status, response) {
        //$http.post('https://api.stripe.com/v1/charges', { token: response.id })
        console.log("STRIPECTRL Token: " + response.id)
        $scope.isLoading = true
        $scope.promote = "正在支付，请稍候..."
        $scope.isPaid = true
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
                    transaction.user = $scope.currentUser
                    transaction.save(null, {
                        success: function (t) {
                            console.log("transaction saved, now user balance: " + $scope.currentUser.balanceInDollar)
                            $scope.currentUser.balanceInDollar = $scope.currentUser.balanceInDollar + t.amount
                            console.log("+= balanceInDollar: " + $scope.currentUser.balanceInDollar + " | t.amount: " + t.amount)
                            $scope.currentUser.save(null, {
                                success: function(u) {
                                    console.log("user saved, now user balance: " + $scope.currentUser.balanceInDollar)

                                    $scope.isLoading = false;
                                    $scope.promote = ""
                                    $scope.isPaid = false
                                    $modalInstance.close()
                                },
                                error: function(u, error) {
                                    alert("出错！" + error.message)
                                    $modalInstance.dismiss()
                                }
                            })

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
    $scope.FIXED_RATE = 6.4
    $scope.rechargeAmount = 0
    $scope.rechargeAmountDollar = 0
    $scope.record = ''
    $scope.isLoading = false;
    $scope.promote = ""

    $scope.reloadZhifubao = function () {
        var query = new AV.Query("Transaction")
        query.equalTo("user", $scope.currentUser)
        query.equalTo("status", YD.Transaction.STATUS_ZHIFUBAO)
        query.find({
            success: function (list) {
                console.log("In ZhifubaoCtrl -- :" + list.length )
                $scope.$apply(function () {
                    $scope.transactionList = list
                    for (var i = 0; i < $scope.transactionList.length; i++) {
                        var tmp = $scope.transactionList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.transactionList[i].createdAt = tmp_date
                        $scope.transactionList[i].status = "等待处理"
                    }
                })
            }
        })
    }
    $scope.reloadZhifubao()

    $scope.$watch('rechargeAmount', function (newVal) {
        if (newVal != 0 || newVal != undefined) {
            $scope.rechargeAmountDollar = (parseInt(newVal) / $scope.FIXED_RATE).toFixed(2)
            //$scope.rechargeAmountDollar = parseFloat($scope.rechargeAmountDollar)
        }
    }, true)

    $scope.zhifubaoPayment = function () {
        $scope.isPaying = true;
        $scope.isLoading = true;
        $scope.promote = "正在提交，请稍候..."
        if ($scope.rechargeAmount <= 0 || typeof($scope.rechargeAmount) != typeof(1)) {
            alert("请输入正确充值金额！")
            $scope.isPaying = false;
            $scope.isLoading = false;
            $scope.promote = "";
            return
        }
        if ($scope.record == undefined || $scope.record =='') {
            alert("请先输入支付宝交易号！")
            $scope.isPaying = false;
            $scope.isLoading = false;
            $scope.promote = "";
            return
        }
        else {
            var transaction = new YD.Transaction()
            transaction.status = YD.Transaction.STATUS_ZHIFUBAO;
            transaction.amount = parseFloat($scope.rechargeAmountDollar)
            transaction.user = $scope.currentUser
            transaction.record = $scope.record
            console.log("In Zhifubao Ctrl -- rechargeAmount: " + $scope.rechargeAmount + " | type: " + typeof($scope.rechargeAmount))
            console.log("In Zhifubao Ctrl -- rechargeAmountDollar: " + $scope.rechargeAmountDollar + " | type: " + typeof($scope.rechargeAmountDollar))
            $scope.currentUser.pendingBalanceInDollar =  parseFloat(($scope.currentUser.pendingBalanceInDollar + (parseInt($scope.rechargeAmount) / $scope.FIXED_RATE)).toFixed(2))
            console.log("user pendingBalance: " + $scope.currentUser.pendingBalance)
            console.log("user pendingBalanceInDollar: " + $scope.currentUser.pendingBalanceInDollar)
            if ($scope.currentUser == undefined) {
                alert('系统错误，请重新登陆！')
                return
            }
            transaction.save(null, {
                success: function (t) {
                    console.log("transaction saved")
                    $scope.currentUser.save(null, {
                        success: function (u) {
                            console.log("user pendingbalance: " + u.pendingBalance)
                            alert("提交成功！待处理账户金额为: $" + u.pendingBalanceInDollar + ",请等待管理员处理 ")
                            $scope.reloadZhifubao()
                            $scope.isPaying = false;
                            $scope.isLoading = false;
                            $scope.promote = "";
                        }
                    })
                },
                error: function (t, error) {
                    console.log("transaction not saved " + error.id + ' - ' + error.message);
                    $scope.reloadZhifubao()
                    $scope.isPaying = false;
                    $scope.isLoading = false;
                    $scope.promote = "";
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
            //if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            //    var date = new Date()
            //    var hour = date.getHours()
            //    var minute = date.getMinutes()
            //    $scope.dt1 = new Date($scope.dt1)
            //    $scope.dt2 = new Date($scope.dt2)
            //    $scope.dt1.setHours(hour)
            //    $scope.dt1.setMinutes(minute)
            //    $scope.dt2.setHours(hour)
            //    $scope.dt2.setMinutes(minute)
            //    //console.log("date 1: " + $scope.dt1)
            //    //console.log("date 2: " + $scope.dt2)
            //    console.log("reloadTransaction: Transaction")

                var query = new AV.Query("Transaction")
                query.equalTo("user", $scope.currentUser)
                //query.greaterThanOrEqualTo("createdAt", $scope.dt1)
                //query.lessThanOrEqualTo("createdAt", $scope.dt2)
                query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE])

                query.find({
                    success: function (tList) {
                        $scope.transactionList = tList;
                        for (var i = 0; i < tList.length; i++) {
                            if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME) {
                                $scope.transactionList[i].status = '消费';
                            } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE) {
                                $scope.transactionList[i].status = '精确分箱费用';
                            } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE) {
                                $scope.transactionList[i].status = '开箱检查费用';
                            }
                            var tmp = $scope.transactionList[i].createdAt
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes()
                            else
                                tmp_date += tmp.getMinutes();
                            _
                            $scope.transactionList[i].createdAt = tmp_date
                        }
                        $scope.$apply()

                        console.log("DatePicker: get all transaction successful: " + tList.length)
                    },
                    error: function (tList, err) {
                        console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

                    }
                })
            //}
            //else {
            //    alert("choose date first")
            //}
        }
    }
    $scope.reloadTransaction()
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
            //if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
                //var date = new Date()
                //var hour = date.getHours()
                //var minute = date.getMinutes()
                //$scope.dt1 = new Date($scope.dt1)
                //$scope.dt2 = new Date($scope.dt2)
                //$scope.dt1.setHours(hour)
                //$scope.dt1.setMinutes(minute)
                //$scope.dt2.setHours(hour)
                //$scope.dt2.setMinutes(minute)
                ////console.log("date 1: " + $scope.dt1)
                ////console.log("date 2: " + $scope.dt2)
                //console.log("TRANSACTION 2: FREIGHT")

                var query = new AV.Query("Transaction")
                //query.greaterThanOrEqualTo("createdAt", $scope.dt1)
                //query.lessThanOrEqualTo("createdAt", $scope.dt2)
                query.equalTo("user", $scope.currentUser)
                query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED, YD.Transaction.STATUS_STRIPE])
                query.find({
                    success: function (tList) {
                        $scope.transactionList = tList
                        for (var i = 0; i < tList.length; i++) {
                            if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO) {
                                $scope.transactionList[i].status = '支付宝充值(待审核)'
                            } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_STRIPE) {
                                $scope.transactionList[i].status = '信用卡充值'

                            } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED) {
                                $scope.transactionList[i].status = '支付宝充值'

                            } else {
                            }
                            var tmp = $scope.transactionList[i].createdAt
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes()
                            else
                                tmp_date += tmp.getMinutes();
                            _
                            $scope.transactionList[i].createdAt = tmp_date
                        }
                        $scope.$apply()
                        console.log("DatePicker: get all transaction successful: " + tList.length)
                    },
                    error: function (tList, err) {
                        console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

                    }
                })
            //}
            //else {
            //    alert("choose date first")
            //}
        }
    }

    $scope.reloadTransaction()
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
    $scope.adminBadge.I = 0
    $scope.adminBadge.J = 0
    $scope.adminBadge.K = 0
    $scope.adminBadge.L = 0


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
    $scope.reloadFreightIn = function () {
        var query = new AV.Query("FreightIn")
        query.containedIn("status", [YD.FreightIn.STATUS_MANUAL, YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE]);
        query.include("user")
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
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
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

    $scope.reloadFreightIn()
    $scope.addNotes = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj : function() {
                    var tmp = {
                        freight: freightIn,
                        type: "freightIn"
                    }
                    return tmp
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
        })
    }

    $scope.freightInDelivered = function (freightIn) {
        freightIn.status = YD.FreightIn.STATUS_ARRIVED
        freightIn.save(null, {
            success: function (f) {
                alert("已更改状态！")
                $scope.reloadFreightIn()
            },
            error: function (f, error) {
                alert("出错！" + error.message)
            }
        })

    }

    $scope.freightInAddInfo = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addCheckingInfo',
            controller: 'CheckingInfoCtrl',
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
            // 扣手续费3.5
            console.log("user balance now: " + freightIn.user.balanceInDollar)
            freightIn.user.balanceInDollar -= 3.5
            freightIn.user.save(null, {
                success: function(u) {
                    console.log("手续费已付,: " + u.balanceInDollar)

                    $scope.reloadFreightIn()
                    alert("验货信息保存成功！")
            },
                error: function(u, error) {
                    console.log("error: " + error.message)
                }
            })

        })
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

YundaApp.controller("AddNotesCtrl", function($scope, $modalInstance, freight_obj) {
    $scope.freight = freight_obj.freight
    var subClass
    if(freight_obj.type == "freightIn") {
        subClass = YD.FreightIn
    } else {
        subClass = YD.Freight
    }

    $scope.save = function() {
        $scope.freight.save(null, {
            success: function(f) {
                console.log("saved: " + f.notes)
                $modalInstance.close()
            },
            error: function(f,error) {
                $modalInstance.dismiss()
            }
        })
    }
    $scope.close = function() {
        $modalInstance.dismiss()
    }


})

YundaApp.controller("CheckingInfoCtrl", function($scope, $modalInstance, freightIn) {
    $scope.freightIn = freightIn

    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.save = function () {
        //console.log("In fileUpload back: " + $scope.identityBack)
        //console.log("In fileUpload front: " + $scope.identityFront)

        if ($scope.identityFront != undefined) {
            $scope.isLoading = true
            $scope.promote = "正在保存留言和照片..."
            //console.log("In fileUpload back: " + $scope.identityFront[0].name)
            //console.log("In fileUpload front: " + $scope.identityBack[0].name)
            var frontName = freightIn.id + 'evidence.jpg'
            $scope.freightIn.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
            $scope.freightIn.status = YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE
            $scope.freightIn.save(null, {
                success: function(f) {
                    console.log("In CheckingInfoCtrl -- upload sucessful")
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
            alert("请先上传验货照片")
            return
        }
    }
    $scope.close = function() {
        $modalInstance.dismiss()
    }

})

YundaApp.controller("ShowDetailsCtrl", function($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.close = function() {
        $modalInstance.dismiss()
    }
})

YundaApp.controller("AdminSystemCtrl", function ($scope, $rootScope) {
    $scope.selected = $rootScope.isSmallPackageAllowed
    $scope.smallPackageInitial = $rootScope.smallPackageInitial
    $scope.smallPackageContinue = $rootScope.smallPackageContinue
    $scope.normalPackageInitial = $rootScope.normalPackageInitial
    $scope.normalPackageContinue = $rootScope.normalPackageContinue
    $scope.systemStreet = $rootScope.systemStreet
    $scope.systemCity = $rootScope.systemCity
    $scope.systemState = $rootScope.systemState
    $scope.systemZipcode = $rootScope.systemZipcode

    $scope.confirm = function () {
        $rootScope.systemSetting.isSmallPackageAllowed = $scope.selected
        $rootScope.systemSetting.smallPackageInitial = $scope.smallPackageInitial
        $rootScope.systemSetting.smallPackageContinue = $scope.smallPackageContinue
        $rootScope.systemSetting.normalPackageInitial = $scope.normalPackageInitial
        $rootScope.systemSetting.normalPackageContinue = $scope.normalPackageContinue
        $rootScope.systemStreet = $scope.systemStreet
        $rootScope.systemCity = $scope.systemCity
        $rootScope.systemState = $scope.systemState
        $rootScope.systemZipcode = $scope.systemZipcode


        $rootScope.systemSetting.save(null, {
            success: function (s) {
                alert("修改已保存！")
                $rootScope.reloadSystemSetting()

            },
            error: function (s, error) {
                alert("系统错误！" + error.message)
            }
        })


    }
})

YundaApp.controller("AdminNewsCtrl", ["$scope", "$rootScope", "$modal", function ($scope, $rootScope, $modal) {
    //$scope.newsList = $rootScope.newsList
    //$scope.addNews = function() {
    //    var news = new YD.News()
    //    news.title = ""
    //    news.link = ""
    //    $scope.editNews(news)
    //}
    $scope.reloadNews = function() {

    }
    $scope.newNews = new YD.News()
    $scope.addNews = function() {
        if($scope.newNews.title == undefined || $scope.newNews.link == undefined){
            alert("请先填写好新闻的标题和链接")
            return
        } else {
            $scope.newNews.save(null, {
                success: function(n) {
                    alert("添加成功！")
                    $rootScope.reloadNews()
                    $scope.newNews = new YD.News()
                },
                error: function(n, error) {
                    alert("出错！" + error.message)
                }
            })
        }
    }

    $scope.editNews = function (news) {
        console.log("Editing news")
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_editNews',
            controller: 'EditNewsCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                news: function () {
                    return news
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $rootScope.reloadNews()
            alert("编辑新闻成功!")
            console.log("Notes(): user's notes added")
        })
    }

    $scope.confirmDeleteNews = function(news) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_doubleConfirm',
            controller: 'DoubleConfirmCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.deleteNews(news)
        })
    }

    $scope.deleteNews = function(news) {
        news.destroy({
            success: function(n) {
                $rootScope.reloadNews()
                alert("删除成功！")
            },
            error: function(n, error){
                alert("出错！" + error.message)
            }
        })
    }
}])

YundaApp.controller('EditNewsCtrl', ["$scope", "$modalInstance", "news", function($scope, $modalInstance, news) {
    $scope.news = news

    $scope.save = function() {
        $scope.news.save(null, {
            success: function(n) {
                $modalInstance.close()
            },
            error: function(n, error) {
                alert("错误！" + error.message)
            }
        })
    }

    $scope.cancel = function() {
        $modalInstance.dismiss()
    }
}])

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
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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
    $scope.addNotes = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj : function() {
                    var tmp = {
                        freight: freightIn,
                        type: "freightIn"
                    }
                    return tmp
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
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

    $scope.showDetailsWithMerge = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showDetailsWithMerge',
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
            $scope.freight[i].isMerge = false
            var statusList = $scope.freight[i].statusGroup
            var statusString = ''

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

                    if (statusList[j] == YD.Freight.STATUS_PENDING_MERGE_PACKAGE) {
                        statusString += "等待合包; "
                        $scope.freight[i].isMerge = true
                        //console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
                    }
                }
            }
            $scope.freight[i].statusToString = statusString
        }

    }
    $scope.reloadFreight = function () {
        var query = new AV.Query("Freight")
        query.equalTo("status", YD.Freight.STATUS_INITIALIZED)
        query.include("user")
        query.include("address")
        query.find({
            success: function (list) {
                $scope.$apply(function(){


                $scope.freight = list
                for (var i = 0; i < $scope.freight.length; i++) {
                    $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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
    $scope.addNotes = function(freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj : function() {
                    var tmp = {
                        freight: freightIn,
                        type: "freightIn"
                    }
                    return tmp
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
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
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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
    $scope.addNotes = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj : function() {
                    var tmp = {
                        freight: freight,
                        type: "freight"
                    }
                    return tmp
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
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
        query.include("address")

        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.adminBadge.E = list.length

                    $scope.freight = list
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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
    //$scope.saveComment = function () {
    //    $scope.showProgressBar("正在保存留言...")
    //    for (var i = 0; i < $scope.freight.length; i++) {
    //        //console.log("f comments is: " + $scope.freight[i].comments)
    //    }
    //    AV.Object.saveAll($scope.freight, {
    //        success: function (list) {
    //            console.log("list of comment saved")
    //            $scope.hideProgressBar()
    //            alert("留言保存成功！")
    //        },
    //        error: function (error) {
    //
    //        }
    //    })
    //}
    $scope.addNotes = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj : function() {
                    var tmp = {
                        freight: freight,
                        type: "freight"
                    }
                    return tmp
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
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
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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
    //$scope.saveComment = function () {
    //    $scope.showProgressBar("正在保存留言...")
    //    for (var i = 0; i < $scope.freight.length; i++) {
    //        //console.log("f comments is: " + $scope.freight[i].comments)
    //    }
    //    AV.Object.saveAll($scope.freight, {
    //        success: function (list) {
    //            console.log("list of comment saved")
    //            $scope.hideProgressBar()
    //            alert("留言保存成功！")
    //        },
    //        error: function (error) {
    //
    //        }
    //    })
    //}

    $scope.addNotes = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj : function() {
                    var tmp = {
                        freight: freight,
                        type: "freight"
                    }
                    return tmp
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
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
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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
    //$scope.saveComment = function () {
    //    $scope.showProgressBar("正在保存留言...")
    //    for (var i = 0; i < $scope.freight.length; i++) {
    //        //console.log("f comments is: " + $scope.freight[i].comments)
    //    }
    //    AV.Object.saveAll($scope.freight, {
    //        success: function (list) {
    //            console.log("list of comment saved")
    //            $scope.hideProgressBar()
    //            alert("留言保存成功！")
    //        },
    //        error: function (error) {
    //
    //        }
    //    })
    //}

    $scope.addNotes = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj : function() {
                    var tmp = {
                        freight: freight,
                        type: "freightIn"
                    }
                    return tmp
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
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
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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

    $scope.addNotes = function(freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj : function() {
                    var tmp = {
                        freight: freight,
                        type: "freightIn"
                    }
                    return tmp
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("添加留言成功!")
            console.log("Notes(): user's notes added")
        })
    }
    $scope.doubleConfirm = function(f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_doubleConfirm',
            controller: 'DoubleConfirmCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.confirmFreightTerminated(f)
        })
    }
    $scope.confirmFreightTerminated = function(f) {
        f.status = YD.Freight.STATUS_DELIVERED
        f.save(null, {
            success: function(f) {
                $scope.reloadFinalDelivery()
                alert("操作成功")
            },
            error: function(f,error) {
                alert("出错！" + error.message)
            }
        })
    }
})

YundaApp.controller('DoubleConfirmCtrl', function($scope, $modalInstance) {
    $scope.confirm = function() {
        $modalInstance.close()
    }
    $scope.close = function() {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('AdminViewUserCtrl', function ($scope) {
    $scope.query = ""
    $scope.searchedString = false
    $scope.searchedNumber = false
    $scope.isLoading = false
    $scope.promote = ""
    $scope.reloadUser = function(){
        var query = new AV.Query("_User")
    query.find({
        success: function (users) {
            console.log("AdminViewUser, length: " + users.length)
            $scope.$apply(function(){
                $scope.users = users
                for (var i = 0; i < $scope.users.length; i++) {
                    var tmp = $scope.users[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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
    })}
    $scope.reloadUser()

    $scope.searchForUser = function (type) {
        $scope.isLoading = true
        $scope.promote = "正在查询,请稍候..."
        if (type == 'string') {
            console.log("in string search")
            var query = new AV.Query("_User")
            query.equalTo("stringId", $scope.queryString)
            //query.equalTo("userName", $scope.query)
            query.find({
                success: function (list) {
                    console.log("list.lenght: " + list.length)
                    $scope.users = list
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.users[i].createdAt = tmp_date
                        $scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
                    }
                    $scope.searchedString = true
                    $scope.searchedNumber = false
                    $scope.isLoading = false
                    $scope.promote = ""
                    $scope.$apply()

                },
                error: function (error) {
                    $scope.isLoading = false
                    $scope.promote = ""
                    alert("错误！" + error.message)

                }
            })
        }
        else {
            console.log("in numberId search")

            var query = new AV.Query("_User")
            query.equalTo("numberId", $scope.queryNumber)
            //query.equalTo("userName", $scope.query)
            query.find({
                success: function (list) {
                    console.log("list.lenght: " + list.length)

                    $scope.users = list
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if(tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();_
                        $scope.users[i].createdAt = tmp_date
                        $scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
                    }
                    $scope.searchedString = false
                    $scope.searchedNumber = true
                    $scope.isLoading = false
                    $scope.promote = ""
                    $scope.$apply()

                },
                error: function (error) {
                    $scope.isLoading = false
                    $scope.promote = ""
                    alert("错误！" + error.message)

                }
            })
        }
    }

    $scope.$watch("queryString", function(newVal) {
        if(!$scope.searchedString) {
            return
        } else {
            if(newVal === "" || newVal === undefined)
            $scope.reloadUser()
        }

    })
    $scope.$watch("queryNumber", function(newVal) {
        if(!$scope.searchedNumber) {
            return
        } else {
            if(newVal === "" || newVal === undefined)
                $scope.reloadUser()
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
                    $scope.adminBadge.J = list.length
                    console.log("admin return balance: " + list.length)
                    for (var i = 0; i < $scope.transactionList.length; i++) {
                        console.log("In AdminReturnBalanceCtrl -- user balance is: " + $scope.transactionList[i].user.balance)
                        var tmp = $scope.transactionList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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
    $scope.refuseReturn = function(transaction) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addReason',
            controller: 'AdminAddRefuseReason',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'

        })
        modalInstance.result.then(function (notes) {
            transaction.notes = notes
            transaction.status = YD.Transaction.STATUS_REFUSED_RETURN_BALANCE
            transaction.save(null, {
                success: function(t) {
                    alert("已成功处理！")
                    $scope.reloadReturnBalance()
                },
                error: function(f, error) {
                    alert("出错！" + error.message)
                }
            })

        })

    }
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
                    alert("上传成功！")
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

YundaApp.controller('AdminReturnGoodsCtrl', function($scope, $modal) {
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
                    $scope.adminBadge.K = list.length

                    for (var i = 0; i < $scope.goodsList.length; i++) {
                        var tmp = $scope.goodsList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
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

    $scope.refuseReturn = function(freightReturn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addReason',
            controller: 'AdminAddRefuseReason',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'

        })
        modalInstance.result.then(function (notes) {
            freightReturn.notes = notes
            freightReturn.status = YD.FreightReturn.STATUS_REFUSED
            freightReturn.save(null, {
                success: function(f) {
                    alert("已成功处理！")
                    $scope.reloadReturnGoods()
                },
                error: function(f, error) {
                    alert("出错！" + error.message)
                }
            })

        })

    }

    $scope.confirmReturn = function(freightReturn) {

        //$scope.isLoading = true
        //$scope.promote = "正在保存"

            var modalInstance = $modal.open({
                templateUrl: 'partials/modal_adminEvidence',
                controller: 'AdminAddEvidenceReturnGoodsCtrl',
                scope: $scope,
                size: 'sm',
                windowClass: 'center-modal',
                resolve: {
                    freight: function() {
                        return freightReturn
                    }
                }
            })
            modalInstance.result.then(function () {

                alert("已成功处理！")
                $scope.reloadReturnGoods()
            })

    }
})

YundaApp.controller('AdminAddRefuseReason', function($scope, $modalInstance) {
    $scope.notes
    $scope.save = function() {
        $modalInstance.close($scope.notes)
    }
    $scope.close = function() {
        $modalInstance.dismiss()
    }
})

YundaApp.controller('AdminAddEvidenceReturnGoodsCtrl', function($scope, $modalInstance, freight) {
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
            freight.status = YD.FreightReturn.STATUS_FINISHED
            freight.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
            freight.save(null, {
                success: function(f) {
                    $scope.$apply(function() {
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
            alert("先上传照片")
            $scope.isLoading = false
            $scope.promote = ""
            $scope.$apply()
        }
    }
})

YundaApp.controller('AdminChangeAddressCtrl', function($scope, $modal) {
    $scope.reloadChangeAddress = function() {
        var query = new AV.Query(YD.FreightChangeAddress)
        query.equalTo("status", YD.FreightChangeAddress.STATUS_AWAITING)
        query.include("user")
        query.include("address")
        query.find({
            success: function(list) {
                $scope.$apply(function() {
                    $scope.freights = list
                    $scope.adminBadge.L = list.length

                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freights[i].createdAt = tmp_date

                        var addressToString
                        if ($scope.freights[i].address != undefined) {

                            addressToString =   $scope.freights[i].address.recipient+ " - " + $scope.freights[i].address.country + $scope.freights[i].address.state + $scope.freights[i].address.city + $scope.freights[i].address.suburb + $scope.freights[i].address.street1
                            if ($scope.freights[i].address.street2 != undefined) {
                                addressToString += $scope.freights[i].address.street2 + " " + $scope.freights[i].address.postalCode
                            } else {
                                addressToString += " " + $scope.freights[i].address.postalCode
                            }
                            $scope.freights[i].addressDetail = addressToString
                        }
                    }


                })
            }
        })
    }
    $scope.reloadChangeAddress()

    $scope.refuseReturn = function(freightCA) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addReason',
            controller: 'AdminAddRefuseReason',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'

        })
        modalInstance.result.then(function (notes) {
            freightCA.notes = notes
            freightCA.status = YD.FreightChangeAddress.STATUS_REFUSED
            freightCA.save(null, {
                success: function(f) {
                    alert("已成功处理！")
                    $scope.reloadChangeAddress()
                },
                error: function(f, error) {
                    alert("出错！" + error.message)
                }
            })

        })

    }

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
        var query = new AV.Query(YD.Transaction)
        query.equalTo("status", YD.Transaction.STATUS_ZHIFUBAO);
        query.include("user")
        query.find({
            success: function(list) {
                $scope.$apply(function() {
                    console.log("AdminZhifubao -- length: " + list.length)
                    $scope.transactionList = list
                    $scope.adminBadge.I = list.length

                    for(var i = 0; i < $scope.transactionList.length; i++) {
                            var tmp = $scope.transactionList[i].createdAt
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes()
                            else
                                tmp_date += tmp.getMinutes();
                            $scope.transactionList[i].createdAt = tmp_date
                        //console.log("In AdminZhifubaoCtr -- user[i].getDate(): " + tmp.getDate() + " | " + tmp)
                    }
                })
            }
        })
    }
    $scope.reloadZhifubao()
    $scope.confirmRecharge = function (transaction) {

        $scope.isLoading = true
        $scope.promote = "正在处理..."
        AV.Cloud.run('increaseUserBalance', {
                //source: response.id,
                id: transaction.id,
                role: $scope.currentUser.role
            },
            {
                success: function () {
                    $scope.isLoading = false
                    $scope.promote = ""
                    alert("操作成功！")
                    $scope.reloadZhifubao()
                },
                error: function (error) {
                    console.log("In AdminZhifubaoCtrl -- ERROR: " + error.message)
                }
            })

    }
})

YundaApp.controller('PrintController', function ($scope, $rootScope) {
    //console.log("is printpage: " + $scope.printPage)
    $scope.freightList = $rootScope.freightList
    for (var i = 0; i < $scope.freightList.length; i++) {
        $scope.freightList[i].checkModel = {}
        $scope.freightList[i].checkModel.isDelivery = false
        $scope.freightList[i].checkModel.isExtraPackaging = false
        $scope.freightList[i].checkModel.isReduceWeight = false
        $scope.freightList[i].checkModel.isSplit = false
        $scope.freightList[i].checkModel.isSplitCharge = false
        //$scope.freightList[i].checkModel.isReduceWeight = false


        for(var j = 0; j < $scope.freightList[i].statusGroup.length; j++) {
            var status = $scope.freightList[i].statusGroup[j]
            if(status == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION)
                $scope.freightList[i].checkModel.isDelivery = true
            if(status == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING)
                $scope.freightList[i].checkModel.isExtraPackaging = true
            if(status == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT)
                $scope.freightList[i].checkModel.isReduceWeight = true
            if(status == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
                $scope.freightList[i].checkModel.isSplit = true
            if(status == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED)
                $scope.freightList[i].checkModel.isSplitCharge = true

        }
        var freight = $scope.freightList[i]
        var addressToString
        if (freight.address != undefined) {
            freight.recipient = freight.address.recipient
            freight.recipientPhone = freight.address.contactNumber
            addressToString = freight.address.country + freight.address.state + freight.address.city + freight.address.suburb + freight.address.street1
            if (freight.address.street2 != undefined) {
                addressToString += freight.address.street2 + " " + freight.address.postalCode
            } else {
                addressToString += " " + freight.address.postalCode
            }
            freight.address = addressToString
        }
        var tmp = $scope.freightList[i].createdAt
        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
        if (tmp.getMinutes() < 10)
            tmp_date += "0" + tmp.getMinutes()
        else
            tmp_date += tmp.getMinutes();
        $scope.freightList[i].createdAt = tmp_date
    }
    if ($scope.freightList.length == 0) {
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

    $scope.submitEnquiryForm = function() {
        $scope.enquiry.receiver = "mike.li@sk8.asia";
        AV.Cloud.run('sendEmail', $scope.enquiry, {
            success: function() {
                alert("感谢您的留言！我们将及时跟您回复！");
            },
            error: function(error) {
                console.log("ERROR: " + error.message)
            }
        });
    }
})

