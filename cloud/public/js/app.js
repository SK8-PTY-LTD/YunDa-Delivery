'use strict';
/* app.js */
var YundaApp = angular.module('YundaApp', ['ngRoute',
    'ui.bootstrap',
    'uiGmapgoogle-maps',
    //'stripe',
    'barcodeGenerator',
    'ngSanitize'
]).config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/home'
        }).
        when('/home', {
            templateUrl: 'partials/home'
        }).
        when('/help', {
            templateUrl: 'partials/help'
        }).
        when('/faq', {
            templateUrl: 'partials/faq'
        }).
        when('/responsibility', {
            templateUrl: 'partials/responsibility'
        }).
        when('/forbidden', {
            templateUrl: 'partials/forbidden'
        }).
        when('/reperation', {
            templateUrl: 'partials/reperation'
        }).
        when('/about', {
            templateUrl: 'partials/about'
        }).
        when('/contact', {
            templateUrl: 'partials/contact'
        }).
        when('/service', {
            templateUrl: 'partials/service'
        }).
        when('/dashboard', {
            templateUrl: 'partials/dashboard'
        }).
        when('/administrator', {
            templateUrl: 'partials/administrator',
            controller: 'AdminCtrl'
        }).
        when('/print', {
            templateUrl: 'partials/print'
        }).
        when('/normalGoods', {
            templateUrl: 'partials/normalGoods'
        }).
        when('/test', {
            templateUrl: 'partials/print_form'
        }).
        when('/pay', {
            templateUrl: 'partials/pay'
        }).
        when('/payReturn', {
            templateUrl: 'partials/payReturn'
        }).
        when('/payReturnFail', {
            templateUrl: 'partials/payReturnFail'
        }).
        when('/verifyEmail', {
            templateUrl: 'partials/verify'
        }).
        otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
    //For JS SDK
    AV.initialize("umouw51mkumgpt72hhir61xemo3b7q2n5js0zce3b96by895", "svsw3nybfcax9ssw7czti2fk86ak9gp6ekrb00essagscyrg");
});
/* controllers.js */
YundaApp.controller('AppCtrl', function ($scope, $rootScope, $location, $http, $modal, $window) {
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
        $scope.printPage = $location.path() == '/print';
    });
    $rootScope.view_tab = "aa";
    $rootScope.change_tab = function (tab) {
        if (tab == "aa" || tab == "ab" || tab == "ac") {
            $rootScope.openTab.setA = true;
            $rootScope.openTab.setB = false;
            $rootScope.openTab.setC = false;
            $rootScope.openTab.setD = false;
        } else if (tab == "ba" || tab == "bb" || tab == "bc" || tab == "bd") {
            $rootScope.openTab.setA = false;
            $rootScope.openTab.setB = true;
            $rootScope.openTab.setC = false;
            $rootScope.openTab.setD = false;
        } else if (tab == "ca" || tab == "cb" || tab == "cc") {
            $rootScope.openTab.setA = false;
            $rootScope.openTab.setB = false;
            $rootScope.openTab.setC = true;
            $rootScope.openTab.setD = false;
        } else if (tab == "da" || tab == "db" || tab == "dc") {
            $rootScope.openTab.setA = false;
            $rootScope.openTab.setB = false;
            $rootScope.openTab.setC = false;
            $rootScope.openTab.setD = true;
        }
        $rootScope.view_tab = tab;
        $rootScope.$broadcast('user' + tab);
    }
    $rootScope.openTab = {
        setA: false,
        setB: false,
        setC: false,
        setD: false
    }
    $rootScope.isAdmin = false;
    $rootScope.$watch("currentUser", function () {
        if ($rootScope.currentUser != undefined) {
            if ($rootScope.currentUser.role != YD.User.ROLE_ADMIN) {
                $rootScope.isAdmin = false;
            } else {
                $rootScope.isAdmin = true;
            }
        }
    })
    $rootScope.reloadSystemSetting = function () {
        var SYSTEM_SETTING_ID = "557a8a2fe4b0fe935ead7847"
        var query = new AV.Query(YD.SystemSetting)
        query.get(SYSTEM_SETTING_ID, {
            success: function (s) {
                $rootScope.systemSetting = s;
                $scope.$apply();
            },
            error: function (s, error) {
            }
        })
    }
    $rootScope.reloadSystemSetting()
    $rootScope.reloadNews = function () {
        var query = new AV.Query(YD.News);
        query.find({
            success: function (list) {
                $rootScope.newsList = list
                for (var i = 0; i < list.length; i++) {
                    var tmp = $scope.newsList[i].createdAt;
                    var tmp_date = "(" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + ")";
                    $scope.newsList[i].dateToString = tmp_date;
                }
                $scope.$apply();
            },
            error: function (error) {
                alert("找新闻出错");
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
    $rootScope.kindList = [{
        "name": "母婴用品"
    }, {
        "name": "保健品"
    }, {
        "name": "手表首饰"
    }, {
        "name": "护肤彩妆"
    }, {
        "name": "电子产品"
    }, {
        "name": "家用电器"
    }, {
        "name": "儿童用品"
    }, {
        "name": "包包箱包"
    }, {
        "name": "服装鞋帽"
    }, {
        "name": "食品"
    }];
    $scope.getButtonArray = function (count) {
        var mod = count % 10;
        var div = count / 10 - mod / 10;
        if (mod > 0) {
            return new Array(Math.round(div) + 1);
        } else {
            return new Array(Math.round(div));
        }
    };
    $scope.LIMIT_NUMBER = 10;

    $rootScope.logOutAndRedirect = function () {
        //$rootScope.currentUser.isLoggedIn = false;
        $rootScope.currentUser.save(null, {
            success: function () {
                YD.User.logOut();
                // Do stuff after successful login.
                $rootScope.currentUser = new YD.User();
                $window.location.href = '/';
                $scope.$apply();
            },
            error: function (u, error) {
                console.log("User log out error: " + error.message);
                $rootScope.currentUser = new YD.User();
                $window.location.href = '/';
            }
        });
    };

    $rootScope.checkUserAfterLogIn = function () {
        if ($rootScope.currentUser.lastLoginDate != undefined) {
            var lastLogin = $rootScope.currentUser.lastLoginDate;
            var cur = new Date();
            var timeDiff = Math.abs(cur.getTime() - lastLogin.getTime());
            var diff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diff > 7) {
                $rootScope.logOut();
            } else {
                $rootScope.currentUser.lastLoginDate = cur;

            }
        } else {
            $rootScope.currentUser.lastLoginDate = new Date();

        }
        //$rootScope.currentUser.isLoggedIn = true;
        $rootScope.currentUser.save();

    }
});
YundaApp.controller('NavbarCtrl', function ($scope, $rootScope, $modal, $window) {
    if (YD.User.current() != undefined) {
        //$rootScope.currentUser = YD.User.current();
        //$rootScope.currentUser.fetch();
        if (YD.User.current().role != YD.User.ROLE_ADMIN && YD.User.current().role != 190) {
            $rootScope.currentUser = new YD.User();
        } else {
            $rootScope.currentUser = YD.User.current();
            $rootScope.currentUser.fetch();
            //Admin logged in, do nothing
        }

    } else {
        $rootScope.currentUser = new YD.User();
    }
    //$rootScope.currentUser = new YD.User();

    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_login',
            controller: 'LoginCtrl',
            scope: $scope,
            size: 'sm',
            backdrop: 'static',
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function (user) {
            if (user != undefined) {
                $rootScope.currentUser = user;
                //if($rootScope.currentUser.isLoggedIn) {
                //    YD.User.logOut();
                //    $rootScope.currentUser = new YD.User();
                //    alert("此帐号已在其他地方登录");
                //    $window.location.href = '/';
                //
                //}
                //$scope.checkUserAfterLogIn();

                if ($rootScope.currentUser.role != YD.User.ROLE_ADMIN) {
                    $rootScope.isAdmin = false;
                } else {
                    $rootScope.isAdmin = true;
                }
                var address = new YD.Address();
                address.id = $rootScope.currentUser.addressId;
                address.fetch().then(function (address) {
                    $rootScope.currentUser.address = address;
                });
            }
        });
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
                    if (error.code == 216) {
                        alert("登陆失败！邮箱未验证，请先去邮箱验证YD账号再尝试登录");
                    } else if (error.code == 210) {
                        alert("登陆失败！密码错误!");
                    } else if (error.code == 211) {
                        alert("登陆失败！找不到用户!");
                    } else {
                        alert("登陆失败！ " + error.message);
                    }
                });
            }
        })
    }
    $scope.signup = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_signup',
            controller: 'SignupCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.currentUser.email = $scope.currentUser.email.toLowerCase();
            $scope.currentUser.stringId = $scope.currentUser.stringId.toLowerCase();
            if (!$scope.currentUser.stringId.match(/^([a-zA-Z]+)$/)) {
                alert("用户名只可以输入英文字母，请重新输入");
                return;
            } else if ($scope.currentUser.password.length < 8) {
                alert("登陆密码必须大于8位，请重新输入");
                return;
            } else if ($scope.currentUser.stringId.length < 5 || $scope.currentUser.stringId.length > 8) {
                alert("用户名长度为5-8位，请重新输入！");
                return;
            }
            $scope.currentUser.set("username", $scope.currentUser.email)
            $scope.currentUser.role = YD.User.ROLE_USER
            $scope.currentUser.balance = 0
            $scope.currentUser.pendingBalance = 0
            $scope.currentUser.rewardBalance = 0
            $scope.currentUser.accumulatedReward = 450;
            $scope.currentUser.signUp(null, {
                success: function (user) {
                    $scope.$apply(function () {
                        $scope.currentUser.stringId = user.stringId
                        $scope.currentUser.numberId = user.numberId
                    })
                    $scope.dismissViewController();
                    alert("已注册成功，请到邮箱内点击链接激活账号!")
                    YD.User.logOut()
                    $rootScope.currentUser = new YD.User()
                },
                error: function (user, error) {
                    $scope.$apply(function () {
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
                alert("请前往您的电子邮箱重置密码");
                $scope.dismissViewController();
            },
            error: function (error) {
                $scope.$apply(function () {
                    $scope.isLoading = false;
                    alert("请先提供电子邮箱地址");
                });
            }
        });
    }
})
YundaApp.controller('SignupCtrl', function ($scope, $modalInstance) {
    $scope.passwordRepeat
    $scope.emailExist = false;
    $scope.nameExist = false;
    $scope.signup = function () {
        if ($scope.currentUser.password != $scope.passwordRepeat) {
            alert("确认密码失败，请重新输入！");
            return;
        } else if (!$scope.currentUser.mobile && !$scope.currentUser.contactNumber) {
            alert("联系方式需至少填一项！");
            return;
        } else if ($scope.currentUser.stringId.length < 5 || $scope.currentUser.stringId.length > 8) {
            alert("用户名长度为5-8位，请重新输入！");
            return;
        } else if ($scope.currentUser.password.length < 8) {
            alert("登陆密码必须大于8位，请重新输入");
            return;
        } else {
            $scope.isLoading = true;
            $scope.promote = "正在注册...";
            var query = new AV.Query(YD.User);
            query.equalTo("email", $scope.currentUser.email);
            query.count({
                success: function (count) {
                    if (count === 1) {
                        $scope.emailExist = true;
                        alert("邮箱已被占用，请重新输入！");
                        return;
                    } else {
                        var newQuery = new AV.Query(YD.User);
                        newQuery.equalTo("stringId", $scope.currentUser.stringId);
                        newQuery.count({
                            success: function (count) {
                                if (count === 1) {
                                    $scope.nameExist = true;
                                    alert("用户名已被占用，请重新输入！");
                                    return;
                                } else {
                                    $modalInstance.close();
                                }
                            }
                        });
                    }
                },
                error: function (error) {
                    alert("错误！" + error.message);
                }
            });
        }
    };
    $scope.dismissViewController = function () {
        $scope.isLoading = false;
        $scope.promote = undefined;
        $modalInstance.dismiss();
    }
    $scope.checkExistence = function (type) {
        $scope.emailExist = false;
        $scope.nameExist = false;
        var query = new AV.Query(YD.User);
        if (type == 'email') {
            query.equalTo("email", $scope.currentUser.email);
        } else if (type == 'stringId') {
            query.equalTo("stringId", $scope.currentUser.stringId);
        }
        query.count({
            success: function (count) {
                if (count == 1) {
                    if (type == 'email') {
                        $scope.emailExist = true;
                    } else if (type == 'stringId') {
                        $scope.nameExist = true;
                    }
                }
                $scope.$apply();
            },
            error: function (error) {
                alert("错误！" + error.message);
            }
        });
    };
});
YundaApp.controller('HomeCtrl', function ($rootScope, $scope, $modal, $window) {
    $scope.trackingNumber;
    $scope.trackingList;
    $scope.testing = 'Hey!\n what \n';
    $scope.resultList = [];
    $scope.resetPassword = function () {
        if (!$scope.currentUser.username) {
            alert("请先填写您的")
        }
        $scope.isLoading = true;
        $scope.promote = "Requesting password";
        YD.User.requestPasswordReset($scope.currentUser.username, {
            success: function () {
                alert("密码重设成功，请查收email");
            },
            error: function (error) {
                $scope.$apply(function () {
                    $scope.isLoading = false;
                    alert("Reset failed " + error.message);
                });
            }
        });
    };

    $scope.updatePassword = function () {
        var r = confirm('是否确认修改密码？');
        if (!r) {

        } else {
            YD.User.requestPasswordReset($scope.currentUser.username, {
                success: function () {
                    alert("请前往您的电子邮箱重置密码");
                    YD.User.logOut();
                    $rootScope.currentUser = new YD.User;
                    $window.location.href = '/';

                },
                error: function (error) {
                    $scope.$apply(function () {
                        $scope.isLoading = false;
                        alert("请先提供电子邮箱地址");
                    });
                }
            });
        }

    };
    $scope.isSearching = false;
    $scope.trackingInfo = function () {
        $scope.isSearching = true;
        $scope.trackingList = $scope.trackingNumber.split("\n");

        var query1 = new AV.Query(YD.Freight);
        query1.containedIn("trackingNumber", $scope.trackingList);
        var query2 = new AV.Query(YD.Freight);
        query2.containedIn("YDNumber", $scope.trackingList);
        var query3 = new AV.Query(YD.Freight);
        query3.containedIn("RKNumber", $scope.trackingList);
        var query = AV.Query.or(query1, query2, query3);
        query.include("address");
        query.include("shipping");
        query.include("user");
        query.find({ //find normal package
            success: function (list) {
                if (list.length >= $scope.trackingList.length) {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/modal_tracking',
                        controller: 'TrackingCtrl',
                        scope: $scope,
                        windowClass: 'center-modal',
                        size: 'lg',
                        resolve: {
                            resultList: function () {
                                return list;
                            }
                        }
                    });
                    $scope.$apply(function () {
                        $scope.isSearching = false;
                    });
                } else {
                    // find split package
                    var query1 = new AV.Query(YD.Freight);
                    query1.equalTo("id", "dummyIdForDummyQuery");
                    for (var i = 0; i < $scope.trackingList.length; i++) {
                        var number = $scope.trackingList[i];
                        var pattern = "(" + number + ")";
                        console.log("pattern: " + pattern);
                        var query2 = new AV.Query(YD.Freight);
                        query2.matches('trackingNumber', new RegExp(pattern, 'g'));
                        query1 = AV.Query.or(query1, query2);
                    }
                    var query3 = new AV.Query(YD.Freight);
                    query3.equalTo("id", "dummyIdForDummyQuery");

                    for (var i = 0; i < $scope.trackingList.length; i++) {
                        var number = $scope.trackingList[i];
                        var pattern = "(" + number + ")";
                        var query4 = new AV.Query(YD.Freight);
                        query4.matches('RKNumber', new RegExp(pattern, 'g'));
                        query3 = AV.Query.or(query3, query4);
                    }
                    var query = AV.Query.or(query1, query3);
                    query.include("address");
                    query.include("shipping");
                    query.include("user");
                    query.find({
                        success: function (splitList) {

                            if (splitList.length != 0) {
                                var modalInstance = $modal.open({
                                    templateUrl: 'partials/modal_tracking',
                                    controller: 'TrackingCtrl',
                                    scope: $scope,
                                    windowClass: 'center-modal',
                                    size: 'lg',
                                    resolve: {
                                        resultList: function () {
                                            return splitList;
                                        }
                                    }
                                });
                                $scope.$apply(function () {
                                    $scope.isSearching = false;

                                });
                            } else {
                                // find merge package
                                var query1 = new AV.Query(YD.Freight);
                                query1.equalTo("id", "dummyIdForDummyQuery");
                                for (var i = 0; i < $scope.trackingList.length; i++) {
                                    var number = $scope.trackingList[i];
                                    var pattern = "(" + number + ")";
                                    console.log("pattern: " + pattern);
                                    var query2 = new AV.Query(YD.Freight);
                                    query2.matches('RKCombine', new RegExp(pattern, 'g'));
                                    query1 = AV.Query.or(query1, query2);
                                }
                                var query3 = new AV.Query(YD.Freight);
                                query3.equalTo("id", "dummyIdForDummyQuery");

                                for (var i = 0; i < $scope.trackingList.length; i++) {
                                    var number = $scope.trackingList[i];
                                    var pattern = "(" + number + ")";
                                    var query4 = new AV.Query(YD.Freight);
                                    query4.matches('TNCombine', new RegExp(pattern, 'g'));
                                    query3 = AV.Query.or(query3, query4);
                                }
                                var query = AV.Query.or(query1, query3);
                                query.include("address");
                                query.include("shipping");
                                query.include("user");
                                query.find({
                                    success: function (mergeList) {
                                        if (mergeList.length != 0) {
                                            var modalInstance = $modal.open({
                                                templateUrl: 'partials/modal_tracking',
                                                controller: 'TrackingCtrl',
                                                scope: $scope,
                                                windowClass: 'center-modal',
                                                size: 'lg',
                                                resolve: {
                                                    resultList: function () {
                                                        return splitList;
                                                    }
                                                }
                                            });
                                            $scope.$apply(function () {
                                                $scope.isSearching = false;

                                            });
                                        } else {
                                            alert("找不到结果!");
                                            $scope.$apply(function () {
                                                $scope.isSearching = false;

                                            });
                                            return;
                                        }
                                    },
                                    error: function (error) {
                                        console.log("merge list finding ERROR: " + error.message);
                                        $scope.$apply(function () {
                                            $scope.isSearching = false;

                                        });
                                    }
                                });
                            }
                        },
                        error: function (error) {
                            console.log("split list finding ERROR: " + error.message);
                            $scope.$apply(function () {
                                $scope.isSearching = false;

                            });
                        }
                    });
                }
            },
            error: function (error) {
                console.log("1st level tracking ERROR: " + error.message);
                $scope.$apply(function () {
                    $scope.isSearching = false;

                });
            }
        });
    };

    $scope.login = function () {
        $scope.isLoading = true;
        $scope.promote = "Logging in";
        YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
            success: function (user) {
                $rootScope.currentUser = user;

                //if($rootScope.currentUser.isLoggedIn) {
                //    YD.User.logOut();
                //    $rootScope.currentUser = new YD.User();
                //    alert("此帐号已在其他地方登录");
                //    $window.location.href = '/';
                //
                //}
                //$scope.checkUserAfterLogIn();

                if ($rootScope.currentUser.role != YD.User.ROLE_ADMIN) {
                    $rootScope.isAdmin = false
                } else {
                    $rootScope.isAdmin = true
                }
                var address = new YD.Address()
                address.id = $rootScope.currentUser.addressId
                address.fetch().then(function (address) {
                    $rootScope.currentUser.address = address
                });
                $scope.$apply();
            },
            error: function (user, error) {
                $scope.$apply(function () {
                    // The login failed. Check error to see why.
                    $scope.isLoading = false;
                    if (error.code == 216) {
                        alert("登陆失败！邮箱未验证，请先去邮箱验证YD账号再尝试登录");
                    } else if (error.code == 210) {
                        alert("登陆失败！密码错误!");
                    } else if (error.code == 211) {
                        alert("登陆失败！找不到用户!");
                    } else {
                        alert("登陆失败！ " + error.message);
                    }
                });
            }
        })
    }
    $scope.signup = function () {
        //$scope.isLoading = true;
        //$scope.promote = "注册...";
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_signup',
            controller: 'SignupCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            $scope.currentUser.email = $scope.currentUser.email.toLowerCase();
            $scope.currentUser.stringId = $scope.currentUser.stringId.toLowerCase();
            if (!$scope.currentUser.stringId.match(/^([a-zA-Z]+)$/)) {
                alert("用户名只可以输入英文字母，请重新输入");
                return;
            }
            if ($scope.currentUser.password.length < 8) {
                alert("登陆密码必须大于8位，请重新输入");
                return;
            }
            $scope.currentUser.set("username", $scope.currentUser.email);
            $scope.currentUser.role = YD.User.ROLE_USER
            $scope.currentUser.balance = 0
            $scope.currentUser.pendingBalance = 0
            $scope.currentUser.rewardBalance = 0
            $scope.currentUser.accumulatedReward = 450;
            $scope.currentUser.signUp(null, {
                success: function (user) {
                    // Hooray! Let them use the app now.
                    //$scope.dismissViewController(user);
                    $scope.$apply(function () {
                        $scope.isLoading = false
                        $scope.currentUser.stringId = user.stringId
                        $scope.currentUser.numberId = user.numberId
                        $scope.isLoading = false
                    })
                    alert("已注册成功，请到邮箱内点击链接激活账号!")
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
    };
    $scope.resetPassword = function () {
        $scope.isLoading = true;
        $scope.promote = "Requesting password";
        YD.User.requestPasswordReset($scope.currentUser.username, {
            success: function () {
                alert("密码重设成功，请查收email");
                $scope.dismissViewController();
            },
            error: function (error) {
                $scope.$apply(function () {
                    $scope.isLoading = false;
                    alert("Reset failed " + error.message);
                });
            }
        });
    };
});
YundaApp.controller('TrackingCtrl', function ($scope, $modal, $modalInstance, resultList) {
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showOperationDetails',
            controller: 'ShowOperationDetailsCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.freights = resultList;
    for (var i = 0; i < resultList.length; i++) {
        var f = $scope.freights[i];
        var tmp = $scope.freights[i].createdAt;
        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
        if (tmp.getMinutes() < 10)
            tmp_date += "0" + tmp.getMinutes();
        else
            tmp_date += tmp.getMinutes();
        $scope.freights[i].createdAtToString = tmp_date;
        var tmp = $scope.freights[i].confirmDate;
        if(tmp != undefined) {
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
                tmp_date += "0" + tmp.getMinutes();
            else
                tmp_date += tmp.getMinutes();
            $scope.freights[i].confirmDateToString = tmp_date;
        }
        var tmp = $scope.freights[i].operateDate;
        if(tmp != undefined) {
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
                tmp_date += "0" + tmp.getMinutes();
            else
                tmp_date += tmp.getMinutes();
            $scope.freights[i].operateDateToString = tmp_date;
        }
        var statusList = $scope.freights[i].statusGroup;
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
                    statusString += "等待去发票; "
                }
                if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                    statusString += "等待普通分箱; "
                }
                if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM) {
                    statusString += "等待精确分箱; "
                }
                if (statusList[j] == YD.Freight.STATUS_CONFIRMED_EXTRA_PACKAGING) {
                    statusString += "完成加固; "
                }
                if (statusList[j] == YD.Freight.STATUS_CONFIRMED_REDUCE_WEIGHT) {
                    statusString += "完成去发票; "
                }
                if (statusList[j] == YD.Freight.STATUS_CONFIRMED_SPLIT_PACKAGE) {
                    statusString += "完成普通分箱; "
                }
                if (statusList[j] == YD.Freight.STATUS_CONFIRMED_SPLIT_PACKAGE_PREMIUM) {
                    statusString += "完成精确分箱; "
                }
            }
        }
        $scope.freights[i].statusToString = statusString
    }
    $scope.close = function () {
        $modalInstance.close()
    }
})
YundaApp.controller('MyTrackingCtrl', function ($scope, $modal) {
    $scope.resultList = [];
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightFullDetail',
            controller: 'FreightFullDetailCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                },
                isFromCustomer: function () {
                    return true;
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.reloadTracking = function (index) {
        $scope.isLoading = true;
        $scope.promote = "正在读取，请稍候...";
        var query = new AV.Query(YD.Freight);
        query.equalTo("user", $scope.currentUser);
        query.include("address");
        query.include("user");
        query.include("shipping");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.freights = list
                if ($scope.freights != undefined) {
                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freights[i].createdAtToString = tmp_date
                        if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERED)
                            $scope.freights[i].info = "已送达"
                        $scope.freights[i].oepration = statusString
                        if ($scope.freights[i].packageComments) {
                            if ($scope.freights[i].packageComments.length > 10) {
                                $scope.freights[i].brief = $scope.freights[i].packageComments.substr(0, 10) + "...";
                            } else {
                                $scope.freights[i].brief = $scope.freights[i].packageComments;
                            }
                        }
                        var statusList = $scope.freights[i].statusGroup;
                        var statusString = '';
                        if ($scope.freights[i].status == YD.Freight.STATUS_INITIALIZED || $scope.freights[i].status == YD.Freight.STATUS_SPEED_MANUAL) {
                            statusString = "待处理";
                        } else {
                            if ($scope.freights[i].status == YD.Freight.STATUS_PENDING_DELIVERY) {
                                statusString = "已发货";
                            } else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERING) {
                                statusString = "发往中国途中";
                            } else if ($scope.freights[i].status == YD.Freight.STATUS_PASSING_CUSTOM) {
                                statusString = "清关中";
                            } else if ($scope.freights[i].status == YD.Freight.STATUS_FINAL_DELIVERY) {
                                statusString = "已出关";
                            }
                        }
                        $scope.freights[i].statusToString = statusString;
                    }
                    $scope.isLoading = false;
                    $scope.promote = "";
                    $scope.$apply();
                }
            }
        });
    };
    $scope.searchingYD = function () {
        $scope.searchYD = true;
        $scope.reloadTracking(0);
        $scope.reloadTrackingCount();
    }
    $scope.reloadTrackingCount = function () {
        var query = new AV.Query(YD.Freight);
        query.equalTo("user", $scope.currentUser);
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.count({
            success: function (count) {
                $scope.freightCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadTracking($scope.currentPage - 1);
    }
    $scope.reloadTrackingCount();
    $scope.$on('userbd', function (event, data) {
        $scope.searchYD = false;
        $scope.queryNumber = ''
        $scope.currentPage = 1;

        $scope.reloadTracking(0);
        $scope.reloadTrackingCount();
    });
    $scope.openRecipientInfo = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_recipientDetails',
            controller: 'RecipientDetailsCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                freight: function () {
                    return f
                }
            },
            windowClass: 'center-modal'
        })
    }
})
YundaApp.controller('RecipientDetailsCtrl', function ($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.close = function () {
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
    var slides = $scope.slides = [{
        image: '/image/banner1.jpg'
    }, {
        image: 'image/banner2.jpg'
    }, {
        image: 'image/banner3.jpg'
    }]
})
YundaApp.controller('ManualCtrl', function ($scope) {
    $scope.freightIn = new YD.FreightIn();
    $scope.reloadManual = function (index) {
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("user", $scope.currentUser);
        query.equalTo("status", YD.FreightIn.STATUS_MANUAL);
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
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
                $scope.$apply();
            }
        });
    }
    $scope.reloadManual(0);
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadManual($scope.currentPage - 1);
    }
    $scope.reloadCount = function () {
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("user", $scope.currentUser);
        query.equalTo("status", YD.FreightIn.STATUS_MANUAL);
        query.count({
            success: function (count) {
                $scope.freightCount = count;
            }
        })
    };
    $scope.reloadCount();
    $scope.$on('userba', function (event, data) {
        $scope.currentPage = 1;
        $scope.reloadCount();

        $scope.reloadManual(0);
    });
    $scope.deleteFreight = function (f) {
        var r = confirm("是否确认删除?");
        if (!r) {
        } else {
            f.destroy({
                success: function (f) {
                    $scope.reloadCount();
                    $scope.reloadManual(0);
                    alert("删除成功！")
                },
                error: function (f, error) {
                    alert("出错！" + error.message)
                }
            });
        }
    }
    $scope.submitFreightIn = function () {
        $scope.freightIn.status = YD.FreightIn.STATUS_MANUAL
        $scope.freightIn.user = $scope.currentUser
        $scope.freightIn.weight = 0
        $scope.freightIn.generateRKNumberWithCallback(function (success, reply) {
            if (!success) {
                alert("错误!" + reply);
            } else {
                $scope.freightIn.RKNumber = reply;
                $scope.freightIn.save(null, {
                    success: function (f) {
                        $scope.freightIn = new YD.FreightIn();
                        $scope.reloadCount();
                        $scope.reloadManual(0);
                        alert("运单已上传成功!")
                    },
                    error: function (f, error) {
                    }
                });
            }
        });
    }
})
YundaApp.controller('SpeedManualCtrl', ["$scope", "$modal", function ($scope, $modal) {
    $scope.freightIn = new YD.FreightIn();
    $scope.freight = new YD.Freight();
    $scope.freight.packageComments = "";
    $scope.Math = Math;
    $scope.freight.descriptionList = [];
    $scope.descriptionList = [];
    $scope.description = {}
    $scope.insurance = {
        value: 0,
        amount: 0,
        total: 0
    };
    $scope.checkBox = {
        isAddPackage: false,
        isReduceWeight: false,
        confirmInsurance: false
    };
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.$on('userbe', function (event, args) {
        $scope.currentPage = 1;
        $scope.reloadCount();

        $scope.reloadSpeedManual(0);
    });
    $scope.rewriteFreight = function () {
        var r = confirm("是否重新填写?");
        if (!r) {
        } else {
            $scope.freightIn.trackingNumber = undefined;
            $scope.freightIn.weight = undefined;
            $scope.channelSelection = undefined;
            $scope.freightIn.address = undefined;
            $scope.description = {};
            $scope.descriptionList = [];
            $scope.freight.packageComments = "";
            $scope.checkboxModel = {
                isAddPackage: false,
                isReduceWeight: false
            }
            $scope.insurance = {
                value: 0,
                amount: 0,
                total: 0
            };
        }
    };
    $scope.reloadSpeedManual = function (index) {
        var query = new AV.Query(YD.Freight);
        query.equalTo("status", YD.Freight.STATUS_SPEED_MANUAL);
        query.equalTo("user", $scope.currentUser);
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        query.find({
            success: function (list) {
                $scope.freights = list;
                $scope.getRecipient();
                for (var i = 0; i < list.length; i++) {
                    var tmp = $scope.freights[i].createdAt;
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                    if (tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();
                    $scope.freights[i].createdAtToString = tmp_date
                }
                $scope.$apply();
            },
            error: function (error) {
                alert("闪运读取错误!" + error.message);
            }
        });
    };
    $scope.reloadCount = function () {
        var query = new AV.Query(YD.Freight);
        query.equalTo("status", YD.Freight.STATUS_SPEED_MANUAL);
        query.equalTo("user", $scope.currentUser);
        query.count({
            success: function (count) {
                $scope.freightCount = count;
            }
        });
    };
    $scope.reloadCount();
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadSpeedManual($scope.currentPage - 1);
    }
    $scope.editDetails = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_editFreightDetails',
            controller: 'FreightDetailsCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return freight;
                }
            },
            windowClass: 'center-modal'
        });
    };
    $scope.deleteFreight = function (freight) {
        var r = confirm("确认彻底删除?");
        if (!r) {
            return;
        } else {
            var RKNumber = freight.RKNumber;
            freight.destroy({
                success: function (f) {
                    var query = new AV.Query(YD.FreightIn);
                    query.equalTo("RKNumber", RKNumber);
                    query.find({
                        success: function (list) {
                            if (list.length == 1) {
                                var fIn = list[0];
                                fIn.destroy({
                                    success: function (f) {
                                        $scope.reloadSpeedManual();
                                        alert("删除运单成功，请重新生成运单");
                                    },
                                    error: function (f, error) {
                                        alert("错误!" + error.message);
                                    }
                                });
                            } else {
                                alert("错误! 查到多个运单");
                            }
                        }
                    });
                },
                error: function (f, error) {
                    $scope.reloadFreight();
                    alert("错误!" + error.message);
                }
            });
        }
    }
    $scope.reloadSpeedManual(0);
    $scope.getRecipient = function () {
        var query = new AV.Query("Address")
        query.equalTo("user", $scope.currentUser);
        query.descending("createdAt");
        query.find({
            success: function (results) {
                $scope.recipients = results
            },
            error: function (res, error) {
                alert("Getting Recipient: " + error.code + " " + error.message)
            }
        })
    }
    $scope.getRecipient();
    $scope.chooseRecipient = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseRecipientAddress',
            controller: 'ChooseAddressCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                addressList: function () {
                    return $scope.recipients
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenAddress) {
            $scope.freightIn.address = chosenAddress
            alert("已成功选取收件人: " + chosenAddress.recipient)
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
            $scope.getRecipient();
            alert("添加新收件人成功！")
        })
    }
    $scope.addNewDescription = function () {
        var d = $scope.description
        if (!d.kind) {
            alert("请先填写类别");
            return;
        }
        if (!d.name) {
            alert("请先填写品名");
            return;
        }
        if (!d.brand) {
            alert("请先填写品牌");
            return;
        }
        if (!d.amount) {
            alert("请先填写数量");
            return;
        }
        if (!d.price) {
            alert("请先填写单价");
            return;
        }
        $scope.description.total = parseFloat($scope.description.price) * parseFloat($scope.description.amount);
        $scope.insurance.total += parseFloat($scope.description.total);
        $scope.descriptionList.push($scope.description);
        $scope.freight.packageComments += d.brand + d.name + 'x' + d.amount + ';\n';
        $scope.description = {};
    }
    $scope.deleteDescrption = function (desc) {
        for (var i = 0; i < $scope.descriptionList.length; i++) {
            if (desc.name == $scope.descriptionList[i].name) {
                $scope.insurance.total -= parseFloat($scope.descriptionList[i].total);
                $scope.descriptionList.splice(i, 1);
            }
        }
    };
    $scope.$watch("insurance.value", function (newVal) {
        if (newVal.value != 0) {
            $scope.insurance.amount = parseFloat(($scope.insurance.value * 0.02).toFixed(2))
        } else {
        }
    });
    $scope.isClicked = false;
    $scope.generateFreight = function () {
        if (!$scope.freightIn.trackingNumber) {
            alert("请填写运单号");
            return;
        }
        if (!$scope.freightIn.weight) {
            alert("请填写重量");
            return;
        }
        if (!$scope.freightIn.address) {
            alert("请选择收件人");
            return;
        }
        if (!$scope.channelSelection) {
            alert("请选择寄运渠道");
            return;
        }
        if ($scope.descriptionList.length == 0) {
            alert("请先填写货物细节(需［点击确认］生成物品详情)");
            return;
        }
        if ($scope.freight.packageComments == "") {
            alert("请填写货物描述");
            return;
        }
        if ($scope.insurance.value > $scope.insurance.total) {
            alert("保价价值超过总申报价格");
            return;
        }
        if ($scope.insurance.value > 0) {
            if ($scope.insurance.value < 10 || $scope.insurance.value > 1000) {
                alert("保价价值小于$10或大于$1000");
                return;
            }
        }
        if ($scope.channelSelection.name == "小包裹A渠道" || $scope.channelSelection.name == "小包裹B渠道") {
            if ($scope.freightIn.weight > 6.6) {
                alert("小包裹A/B渠道每个包裹重量不得超过6.6磅，请使用其它渠道");
                return;
            }
        }
        if ($scope.channelSelection.name == "Q渠道A" || $scope.channelSelection.name == "Q渠道B") {
            if ($scope.freightIn.weight > 10) {
                alert("Q渠道A/B每个包裹重量不得超过10磅，请使用其它渠道");
                return;
            }
        }
        $scope.isClicked = true;
        $scope.freightIn.user = $scope.currentUser;
        $scope.freightIn.status = YD.FreightIn.STATUS_SPEED_MANUAL;
        $scope.freightIn.RKNumber = $scope.freightIn.generateRKNumber();
        $scope.freightIn.save(null, {
            success: function (fIn) {
                var add = $scope.freightIn.address;
                $scope.freight.address = {
                    city: add.city || "",
                    contactNumber: add.contactNumber || "",
                    country: add.country || "",
                    mobileNumber: add.mobileNumber || "",
                    postalCode: add.postalCode || "",
                    recipient: add.recipient || "",
                    state: add.state || "",
                    street1: add.street1 || "",
                    street2: add.street2 || "",
                    suburb: add.suburb || ""
                }
                var freightInPt = new YD.FreightIn();
                freightInPt.id = fIn.id;
                $scope.freight.freightIn = freightInPt;
                $scope.freight.status = YD.Freight.STATUS_SPEED_MANUAL;
                $scope.freight.isSpeedManual = true;
                $scope.freight.trackingNumber = $scope.freightIn.trackingNumber;
                var query = new AV.Query(YD.Freight);
                query.equalTo("trackingNumber", $scope.freight.trackingNumber);
                query.equalTo("user", $scope.currentUser);
                query.count({
                    success: function(count) {
                        if(count > 0) {
                            alert("您已经生成过运单，或此转运号已被使用，请重试");
                            return;
                        } else {
                            $scope.freight.RKNumber = $scope.freightIn.RKNumber;
                            $scope.freight.exceedWeight = $scope.freightIn.exceedWeight;
                            $scope.freight.user = $scope.currentUser;
                            $scope.freight.weight = $scope.freightIn.weight;
                            if ($scope.checkBox.isAddPackage == true) {
                                $scope.freight.isAddPackage = true;
                                $scope.freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING);
                            }
                            if ($scope.checkBox.isReduceWeight == true) {
                                $scope.freight.isReduceWeight = true;
                                $scope.freight.add("statusGroup", YD.Freight.STATUS_PENDING_REDUCE_WEIGHT);
                            }
                            if ($scope.checkBox.confirmInsurance == true) {
                                $scope.freight.add("statusGroup", YD.Freight.STATUS_PENDING_PAY_INSURANCE);
                            }
                            $scope.freight.descriptionList = [];
                            for (var i = 0; i < $scope.descriptionList.length; i++) {
                                var d = $scope.descriptionList[i];
                                var obj = {
                                    kind: d.kind.name, //cuz kind getting from select, kind it's an obj
                                    name: d.name,
                                    brand: d.brand,
                                    amount: d.amount,
                                    price: d.price,
                                    total: d.total
                                }
                                $scope.freight.add("descriptionList", obj);
                            }
                            $scope.freight.insurance = $scope.insurance.amount + "(所保价值: " + $scope.insurance.value + ")";
                            $scope.freight.channel = $scope.channelSelection;
                            $scope.freight.generateYDNumber(function (success, reply) {
                                if (!success) {
                                    alert("错误!" + reply);
                                    $scope.isClicked = false;
                                    return;
                                } else {
                                    $scope.freight.YDNumber = reply;
                                    $scope.freight.save(null, {
                                        success: function (f) {
                                            alert("原箱闪运运单提交成功!");
                                            $scope.isClicked = false;
                                            $scope.freightIn = new YD.FreightIn();
                                            $scope.freight = new YD.Freight();
                                            $scope.freight.packageComments = "";
                                            $scope.freight.descriptionList = [];
                                            $scope.descriptionList = [];
                                            $scope.checkBox.isAddPackage = false;
                                            $scope.checkBox.isReduceWeight = false;
                                            $scope.insurance.total = 0;
                                            $scope.insurance.value = 0;
                                            $scope.insurance.amount = 0;
                                            $scope.$apply();
                                            $scope.reloadCount();
                                            $scope.reloadSpeedManual(0);
                                        },
                                        error: function (f, error) {
                                            $scope.isClicked = false;
                                            if (error.code == 105) {
                                                alert("生成运单失败,请刷新页面重试");
                                            } else {
                                                alert("生成运单失败");
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                })
            }
        });
    }
}]);
YundaApp.controller('ReturnGoodsCtrl', function ($scope, $modal) {
    $scope.query = "";
    $scope.reloadFreightReturn = function (index) {
        var query = new AV.Query("FreightReturn");
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED]);
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.currentUser.id != undefined) {
            query.find({
                success: function (result) {
                    $scope.returnList = result
                    for (var i = 0; i < $scope.returnList.length; i++) {
                        if ($scope.returnList[i].status == YD.FreightReturn.STATUS_PENDING) {
                            $scope.returnList[i].statusToString = "等待处理";
                        } else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_FINISHED) {
                            $scope.returnList[i].statusToString = "已处理";
                        } else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_REFUSED) {
                            $scope.returnList[i].statusToString = "昀達拒绝退货";
                        }
                        var tmp = $scope.returnList[i].createdAt;
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.returnList[i].createdAtToString = tmp_date;
                        if ($scope.returnList[i].adminEvidence != undefined)
                            $scope.returnList[i].adminEvidence = $scope.returnList[i].adminEvidence.url();
                    }
                    $scope.$apply();
                },
                error: function (error) {
                }
            });
        }
    };
    $scope.showFreightInDetail = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightInDetail',
            controller: 'FreightInDetailCtrl',
            scope: $scope,
            size: 'md',
            windowClass: 'center-modal',
            resolve: {
                freight: function () {
                    return f;
                }
            }
        });
    }
    $scope.reloadFreightCount = function () {
        var query = new AV.Query("FreightReturn");
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_FREIGHTIN]);
        query.count({
            success: function (count) {
                $scope.freightCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadFreightReturn($scope.currentPage - 1);
    }
    $scope.reloadFreightCount();
    //$scope.reloadFreightReturn();
    $scope.$on('userdb', function () {
        $scope.currentPage = 1;
        $scope.reloadFreightCount();
        $scope.reloadFreightReturn(0);
    });
    //$scope.returnFreight = new YD.FreightReturn()
    $scope.searchForGoods = function () {
        var query = new AV.Query(YD.FreightReturn);
        //query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_REAPPLY, YD.FreightReturn.STATUS_FREIGHTIN]);
        query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_FREIGHTIN]);

        query.equalTo("user", $scope.currentUser);
        query.equalTo("RKNumber", $scope.query);
        query.find({
            success: function (t) {
                $scope.returnList = t;
                for (var i = 0; i < t.length; i++) {
                    if ($scope.returnList[i].status == YD.FreightReturn.STATUS_PENDING)
                        $scope.returnList[i].statusToString = "等待处理"
                    else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_FINISHED)
                        $scope.returnList[i].statusToString = "已处理"
                    else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_REFUSED)
                        $scope.returnList[i].statusToString = "昀達拒绝退货"
                    else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_REAPPLY)
                        $scope.returnList[i].statusToString = "重新申请中"
                    else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_FREIGHTIN)
                        $scope.returnList[i].statusToString = "已重新入库"
                    var tmp = $scope.returnList[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                    if (tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();
                    $scope.returnList[i].createdAtToString = tmp_date;
                    if ($scope.returnList[i].adminEvidence != undefined)
                        $scope.returnList[i].adminEvidence = $scope.returnList[i].adminEvidence.url();
                }
                $scope.$apply();
            }
        });
    };
    $scope.applyReturn = function (id) {
        if(id != undefined) {
            var freightReturnId = id;
        } else {
            var freightReturnId = undefined;
        }
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_returnGoods',
            controller: 'ReturnGoodsModalCtrl',
            scope: $scope,
            size: 'md',
            windowClass: 'center-modal',
            resolve: {
                id: function () {
                    return freightReturnId;
                }
            },
            backdrop: 'static',
            keyboard: false
        });
        modalInstance.result.then(function (returnFreight) {
            //$scope.freightIn.address = chosenAddress
            returnFreight.save(null, {
                success: function () {
                    if (id != undefined) { //this is to reapply
                        var query = new AV.Query(YD.FreightReturn);
                        query.get(id, {
                            success: function (f) {
                                f.status = YD.FreightReturn.STATUS_REAPPLY;
                                f.save(null, {
                                    success: function () {
                                        alert("已重新退货！请等待处理");
                                        $scope.reloadFreightReturn();
                                    }
                                });
                            }
                        });

                    } else { //normal application
                        alert("申请成功！请等待处理");
                        $scope.reloadFreightReturn();
                    }

                },
                error: function (t, error) {
                    alert("申请失败：" + error.message)
                }
            });
            //alert("已成功选取收件人: " + chosenAddress.recipient)
        });
    };
    $scope.returnAgain = function (f) {
        var RKNumber = f.RKNumber;
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("RKNumber", RKNumber);
        query.find({
            success: function (list) {
                console.log("return again found freightIn");
                var freightIn = list[0];
                freightIn.status = YD.FreightIn.STATUS_FINISHED;
                freightIn.save(null, {
                    success: function () {
                        console.log("apply return now");

                        $scope.applyReturn(f.id);
                    },
                    error: function (f, error) {
                        alert("错误!请重试");
                        console.log("ERROR: " + error.message);
                    }
                });
            }
        });

        //f.status = YD.FreightReturn.STATUS_REAPPLY;
        //f.save(null, {
        //    success: function () {
        //        $scope.reloadFreightReturn();
        //        $scope.applyReturn(f.id);
        //    }
        //});
    };
    $scope.recoverFreightIn = function (f) {
        var r = confirm("是否确认重新入库?");
        if(!r) {

        } else {
            var RKNumber = f.RKNumber;
            var query = new AV.Query(YD.FreightIn);
            query.equalTo("RKNumber", RKNumber);
            query.first({
                success: function (freightIn) {
                        freightIn.recoverFreightIn();
                    console.log("isPlit: ");
                    console.log(freightIn.isSplit);
                        if(freightIn.isSplit || freightIn.isSplitPremium) {
                            var RKNumber = freightIn.RKNumber.substr(0, 12);
                            var query = new AV.Query(YD.FreightReturn);
                            query.startsWith("RKNumber", RKNumber);
                            query.notEqualTo("status", YD.FreightReturn.STATUS_FREIGHTIN);
                            query.count({
                                success: function (count) {
                                    if (count > 1) {
                                        console.log("count > 1, " + count);

                                        //freightIn.isOperating = true;
                                        freightIn.save(null, {
                                            success: function () {
                                                f.status = YD.FreightReturn.STATUS_FREIGHTIN;
                                                f.save(null, {
                                                    success: function () {
                                                        $scope.reloadFreightReturn();
                                                        alert("请前往[包裹管理]重新处理包裹");
                                                    }
                                                });
                                            },
                                            error: function (error) {
                                            }
                                        });
                                    } else {
                                        console.log("count == 0");

                                        var query = new AV.Query(YD.FreightIn);
                                        query.startsWith("RKNumber", RKNumber);
                                        query.find({
                                            success: function (splitList) {
                                                console.log("change all back");
                                                for (var i = 0; i < splitList.length; i++) {
                                                    splitList[i].isOperating = false;
                                                }
                                                AV.Object.saveAll(splitList, {
                                                    success: function () {
                                                        freightIn.save(null, {
                                                            success: function () {
                                                                f.status = YD.FreightReturn.STATUS_FREIGHTIN;
                                                                f.save(null, {
                                                                    success: function () {
                                                                        $scope.reloadFreightReturn();
                                                                        alert("请前往[包裹管理]重新处理包裹");
                                                                    }
                                                                });
                                                            },
                                                            error: function (error) {
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            freightIn.save(null, {
                                success: function () {
                                    f.status = YD.FreightReturn.STATUS_FREIGHTIN;
                                    f.save(null, {
                                        success: function () {
                                            $scope.reloadFreightReturn();
                                            alert("请前往[包裹管理]重新处理包裹");
                                        }
                                    });
                                },
                                error: function (error) {
                                }
                            });
                        }
                }
            });
        }
    }
});
YundaApp.controller('ReturnGoodsModalCtrl', ["$scope", "$modalInstance", 'id', function ($scope, $modalInstance, id) {
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.TNExist = false;
    $scope.existPromote = "";
    //console.log("id: " + id);
    //if (!id) {
    //    $scope.return = new YD.FreightReturn();
    //} else {
    //    var query = new AV.Query(YD.FreightReturn);
    //    query.get(id, {
    //        success: function (f) {
    //            $scope.return = f;
    //            console.log("id: " + id + "| " + f.id);
    //        }
    //    });
    //}
    $scope.return = new YD.FreightReturn();
    if(id != undefined) {
        $scope.isLoading = true;
        $scope.promote = '正在读取,请稍候...';
        var query = new AV.Query(YD.FreightReturn);
        query.get(id, {
            success: function(freightReturn) {
                $scope.$apply(function () {
                    $scope.return.address = freightReturn.address;
                    $scope.return.RKNumber = freightReturn.RKNumber;
                    $scope.return.reason = freightReturn.reason;
                    $scope.return.user = freightReturn.user;
                    $scope.isReapply = true;
                    $scope.isLoading = false;
                    $scope.promote = '';
                });
            },
            error: function(f, error) {
                console.log(" ERROR: " + error.message);
            }
        })
    }
    $scope.checkExistence = function () {
        var query = new AV.Query(YD.Freight);
        query.equalTo("RKNumber", $scope.return.RKNumber);
        query.equalTo("user", $scope.currentUser);
        query.find({
            success: function (list) {
                if (list.length != 0) {
                    if (list[0].status != YD.Freight.STATUS_CANCELED && !list[0].isOperated) {
                        $scope.TNExist = true;
                        $scope.existPromote = "此包裹可以退货";
                    } else if (list[0].status == YD.Freight.STATUS_CANCELED) {
                        $scope.TNExist = false;
                        $scope.existPromote = "此包裹已申请退货处理";
                    } else if (list[0].isOperated == true) {
                        $scope.TNExist = false;
                        $scope.existPromote = "此包裹已被打包，无法退货";
                    }
                } else {
                    $scope.TNExist = false;
                }
            },
            error: function (error) {
                $scope.TNExist = false;
                $scope.existPromote = "找不到包裹";
            }
        });
    };
    $scope.isActing = false;
    $scope.applyReturn = function () {
        if (!$scope.return.RKNumber) {
            alert("请提供YD运单号");
            return;
        } else if (!$scope.return.address) {
            alert("请提供退货地址");
            return;
        } else if (!$scope.return.reason) {
            alert("请提供退货备注");
            return;
        }
        if($scope.isReapply) {
            $scope.isActing = true;
            var query = new AV.Query(YD.Freight);
            query.equalTo("RKNumber", $scope.return.RKNumber);
            query.equalTo("user", $scope.currentUser);
            query.find({
                success: function (list) {
                    if (list.length != 0) {
                        if (list[0].isOperated) {
                            alert("此包裹已被打包，无法退货");
                            return;
                        } else {
                            if (list[0].isSplit || list[0].isSplitPremium) {
                                var RKNumber = list[0].RKNumber.substr(0, 12);
                                var query = new AV.Query(YD.FreightIn);
                                query.startsWith("RKNumber", RKNumber);
                                query.find({
                                    success: function (splitList) {
                                        for (var i = 0; i < splitList.length; i++) {
                                            splitList[i].isOperating = true;
                                        }
                                        AV.Object.saveAll(splitList, {
                                            success: function () {
                                                freight.save(null, {
                                                    success: function () {
                                                        list[0].destroy({
                                                            success: function () {
                                                                var userPt = new YD.User();
                                                                userPt.id = $scope.currentUser.id;
                                                                $scope.return.user = userPt;
                                                                $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                                                $modalInstance.close($scope.return);
                                                            }
                                                        });
                                                    },
                                                    error: function (f, error) {
                                                        alert("错误: " + error.message);
                                                        $scope.$apply(function () {
                                                            $scope.isActing = false;
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                list[0].destroy({
                                    success: function () {
                                        var userPt = new YD.User();
                                        userPt.id = $scope.currentUser.id;
                                        $scope.return.user = userPt;
                                        $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                        $modalInstance.close($scope.return);
                                    }
                                });
                            }
                        }
                    } else {
                        var newQ = new AV.Query(YD.FreightIn);
                        newQ.equalTo("RKNumber", $scope.return.RKNumber);
                        newQ.equalTo("user", $scope.currentUser);
                        newQ.first({
                            success: function (f) {
                                if (f) {
                                    console.log("f status: " + f.status);
                                    var freightIn = f;
                                    if(freightIn.isMerged) {
                                        //alert("此包裹已经被合包，无法退货");
                                        alert("该包裹无法退货，可能原因：已退货或已申请、此包裹已进行了分包操作、合包包裹不可以退货。请检查核实后，重新申请，谢谢！");
                                        return;
                                    } else if (freightIn.status == YD.FreightIn.STATUS_CANCELED || freightIn.status == YD.FreightIn.STATUS_FINISHED) {
                                        //alert("此包裹已进行过分/合包操作，或已申请退货，无法退货");
                                        alert("该包裹无法退货，可能原因：已退货或已申请、此包裹已进行了分包操作、合包包裹不可以退货。请检查核实后，重新申请，谢谢！");

                                        return;
                                    }  else {
                                        if (freightIn.isSplit || freightIn.isSplitPremium) {
                                            console.log("freightIn is a split");
                                            var RKNumber = freightIn.RKNumber.substr(0, 12);
                                            console.log("RKNumber: ", RKNumber);
                                            var query = new AV.Query(YD.FreightIn);
                                            query.startsWith("RKNumber", RKNumber);
                                            query.find({
                                                success: function (splitList) {
                                                    console.log("found other siblings: ", splitList);
                                                    for (var i = 0; i < splitList.length; i++) {
                                                        splitList[i].isOperating = true;
                                                    }
                                                    AV.Object.saveAll(splitList, {
                                                        success: function () {
                                                            freightIn.isOperating = true;
                                                            freightIn.status = YD.FreightIn.STATUS_FINISHED;
                                                            freightIn.save(null, {
                                                                success: function () {
                                                                    var userPt = new YD.User();
                                                                    userPt.id = $scope.currentUser.id;
                                                                    $scope.return.user = userPt;
                                                                    $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                                                    $modalInstance.close($scope.return);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            freightIn.isOperating = true;
                                            freightIn.status = YD.FreightIn.STATUS_FINISHED;
                                            freightIn.save(null, {
                                                success: function () {
                                                    var userPt = new YD.User();
                                                    userPt.id = $scope.currentUser.id;
                                                    $scope.return.user = userPt;
                                                    $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                                    $modalInstance.close($scope.return);
                                                }
                                            });
                                            //var userPt = new YD.User();
                                            //userPt.id = $scope.currentUser.id;
                                            //$scope.return.user = userPt;
                                            //$scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                            //$modalInstance.close($scope.return);
                                        }
                                    }

                                } else {
                                    alert("找不到包裹！操作失败");
                                    $scope.$apply(function () {
                                        $scope.isActing = false;
                                    });
                                }
                            }
                        })
                    }
                },
                error: function (error) {
                    alert("找不到包裹！操作失败");
                }
            });
        } else {
            var query = new AV.Query(YD.FreightReturn);
            query.equalTo("RKNumber", $scope.return.RKNumber);
            query.count({
                success: function(count) {
                    if(count > 0) {
                        alert("此包裹已退货，无法重新退货");
                        return;
                    } else {
                        $scope.isActing = true;
                        var query = new AV.Query(YD.Freight);

                        query.equalTo("RKNumber", $scope.return.RKNumber);
                        query.equalTo("user", $scope.currentUser);
                        query.find({
                            success: function (list) {
                                if (list.length != 0) {
                                    if (list[0].isOperated) {
                                        alert("此包裹已被打包，无法退货");
                                        return;
                                    } else {
                                        if (list[0].isSplit || list[0].isSplitPremium) {
                                            var RKNumber = list[0].RKNumber.substr(0, 12);
                                            var query = new AV.Query(YD.FreightIn);
                                            query.startsWith("RKNumber", RKNumber);
                                            query.find({
                                                success: function (splitList) {
                                                    for (var i = 0; i < splitList.length; i++) {
                                                        splitList[i].isOperating = true;
                                                    }
                                                    AV.Object.saveAll(splitList, {
                                                        success: function () {
                                                            freight.save(null, {
                                                                success: function () {
                                                                    list[0].destroy({
                                                                        success: function () {
                                                                            var userPt = new YD.User();
                                                                            userPt.id = $scope.currentUser.id;
                                                                            $scope.return.user = userPt;
                                                                            $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                                                            $modalInstance.close($scope.return);
                                                                        }
                                                                    });
                                                                },
                                                                error: function (f, error) {
                                                                    alert("错误: " + error.message);
                                                                    $scope.$apply(function () {
                                                                        $scope.isActing = false;
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            list[0].destroy({
                                                success: function () {
                                                    var userPt = new YD.User();
                                                    userPt.id = $scope.currentUser.id;
                                                    $scope.return.user = userPt;
                                                    $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                                    $modalInstance.close($scope.return);
                                                }
                                            });
                                        }
                                    }
                                } else {
                                    var newQ = new AV.Query(YD.FreightIn);
                                    newQ.equalTo("RKNumber", $scope.return.RKNumber);
                                    newQ.equalTo("user", $scope.currentUser);
                                    newQ.first({
                                        success: function (f) {
                                            if (f) {
                                                var freightIn = f;

                                                if(freightIn.isMerged) {
                                                    //alert("此包裹已经被合包，无法退货");
                                                    alert("该包裹无法退货，可能原因：已退货或已申请、此包裹已进行了分包操作、合包包裹不可以退货。请检查核实后，重新申请，谢谢！");

                                                    return;
                                                } else if (freightIn.status == YD.FreightIn.STATUS_CANCELED || freightIn.status == YD.FreightIn.STATUS_FINISHED) {
                                                    console.log("f status: " + freightIn.status);
                                                    console.log("f status finish: ", freightIn.status == YD.FreightIn.STATUS_FINISHED);
                                                    console.log("f status cancel: ", freightIn.status == YD.FreightIn.STATUS_CANCELED);

                                                    //alert("此包裹已进行过分/合包操作，或已申请退货，无法退货");
                                                    alert("该包裹无法退货，可能原因：已退货或已申请、此包裹已进行了分包操作、合包包裹不可以退货。请检查核实后，重新申请，谢谢！");

                                                    return;
                                                }  else {
                                                    if (freightIn.isSplit || freightIn.isSplitPremium) {
                                                        console.log("freightIn is a split");
                                                        var RKNumber = freightIn.RKNumber.substr(0, 12);
                                                        console.log("RKNumber: ", RKNumber);
                                                        var query = new AV.Query(YD.FreightIn);
                                                        query.startsWith("RKNumber", RKNumber);
                                                        query.find({
                                                            success: function (splitList) {
                                                                console.log("found other siblings: ", splitList);
                                                                for (var i = 0; i < splitList.length; i++) {
                                                                    splitList[i].isOperating = true;
                                                                }
                                                                AV.Object.saveAll(splitList, {
                                                                    success: function () {
                                                                        freightIn.isOperating = true;
                                                                        freightIn.status = YD.FreightIn.STATUS_FINISHED;
                                                                        freightIn.save(null, {
                                                                            success: function () {
                                                                                var userPt = new YD.User();
                                                                                userPt.id = $scope.currentUser.id;
                                                                                $scope.return.user = userPt;
                                                                                $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                                                                $modalInstance.close($scope.return);
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        freightIn.isOperating = true;
                                                        freightIn.status = YD.FreightIn.STATUS_FINISHED;
                                                        freightIn.save(null, {
                                                            success: function () {
                                                                var userPt = new YD.User();
                                                                userPt.id = $scope.currentUser.id;
                                                                $scope.return.user = userPt;
                                                                $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                                                $modalInstance.close($scope.return);
                                                            }
                                                        });
                                                        //var userPt = new YD.User();
                                                        //userPt.id = $scope.currentUser.id;
                                                        //$scope.return.user = userPt;
                                                        //$scope.return.status = YD.FreightReturn.STATUS_PENDING;
                                                        //$modalInstance.close($scope.return);
                                                    }
                                                }

                                            } else {
                                                alert("找不到包裹！操作失败");
                                                $scope.$apply(function () {
                                                    $scope.isActing = false;
                                                });
                                            }
                                        }
                                    })
                                }
                            },
                            error: function (error) {
                                alert("找不到包裹！操作失败");
                            }
                        });
                    }
                }
            })
        }


    };
    $scope.close = function () {
        $modalInstance.dismiss();
    }
    $scope.filesChangedFirst = function (elm) {
        $scope.identityFirst = elm.files
        $scope.$apply()
    }
    $scope.filesChangedSecond = function (elm) {
        $scope.identitySecond = elm.files
        $scope.$apply()
    }
    $scope.filesChangedThird = function (elm) {
        $scope.identityThird = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        $scope.isLoading = true;
        $scope.promote = "正在上传，请稍候...";
        if ($scope.identityFirst != undefined) {
            if ($scope.identityFirst) {
                var frontName = $scope.currentUser.realName + '1.jpg';
                var avFileFront = new AV.File(frontName, $scope.identityFirst[0]);
                $scope.return.identityFirst = avFileFront
            }
            if ($scope.identitySecond) {
                var backName = $scope.currentUser.realName + '2.jpg';
                var avFileBack = new AV.File(backName, $scope.identitySecond[0]);
                $scope.return.identitySecond = avFileBack;
            }
            if ($scope.identityThird) {
                var thirdName = $scope.currentUser.realName + '3.jpg';
                var avFileThird = new AV.File(thirdName, $scope.identityThird[0]);
                $scope.return.identityThird = avFileThird
            }
            $scope.return.save(null, {
                success: function (img) {
                    $scope.isLoading = false;
                    $scope.promote = "";
                    alert("上传成功!请确认申请");
                    $scope.$apply();
                },
                error: function (img, error) {
                }
            })
        } else {
            alert("Please upload file first")
        }
    }
}]);
YundaApp.controller('ReturnBalanceCtrl', function ($scope, $modal) {
    $scope.query = "";
    $scope.reloadReturnBalance = function (index) {
        var query = new AV.Query("Transaction");
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.Transaction.STATUS_PENDING_RETURN_BALANCE, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_REFUSED_RETURN_BALANCE]);
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchTK) {
            query.equalTo("TKNumber", $scope.query)
        }
        query.find({
            success: function (list) {
                $scope.transactionList = list
                for (var i = 0; i < $scope.transactionList.length; i++) {
                    if ($scope.transactionList[i].status == YD.Transaction.STATUS_PENDING_RETURN_BALANCE)
                        $scope.transactionList[i].statusToString = "等待处理"
                    else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE)
                        $scope.transactionList[i].statusToString = "已退款"
                    else if ($scope.transactionList[i].status == YD.Transaction.STATUS_REFUSED_RETURN_BALANCE)
                        $scope.transactionList[i].statusToString = "昀達拒绝付款"
                    var tmp = $scope.transactionList[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                    if (tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();
                    $scope.transactionList[i].createdAtToString = tmp_date
                }
                $scope.$apply();
            },
            error: function (error) {
            }
        })
    }
    //$scope.reloadReturnBalance();
    $scope.reloadReturnCount = function () {
        var query = new AV.Query("Transaction");
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.Transaction.STATUS_PENDING_RETURN_BALANCE, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_REFUSED_RETURN_BALANCE]);
        if ($scope.searchTK) {
            query.equalTo("TKNumber", $scope.query);
        }
        query.count({
            success: function (count) {
                $scope.freightCount = count;
            }
        });
    };
    $scope.$on('userda', function () {
        $scope.searchTK = false;
        $scope.query = '';
        $scope.currentPage = 1;

        $scope.reloadReturnCount();
        $scope.reloadReturnBalance(0);
    });
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadReturnBalance($scope.currentPage - 1);
    }
    $scope.searchForTransaction = function () {
        $scope.searchTK = true;
        $scope.reloadReturnCount();
        $scope.reloadReturnBalance(0);
    }
    $scope.returnBalance = new YD.Transaction();
    $scope.applyReturn = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_returnBalance',
            controller: 'ReturnBalanceModalCtrl',
            scope: $scope,
            size: 'md',
            windowClass: 'center-modal',
            backdrop: 'static',
            keyboard: false
        });
        modalInstance.result.then(function (transaction) {
            transaction.status = YD.Transaction.STATUS_PENDING_RETURN_BALANCE;
            transaction.save(null, {
                success: function (t) {
                    var amount = t.amount;
                    $scope.currentUser.balanceInDollar -= amount;
                    $scope.currentUser.pendingBalance += amount * 100;
                    $scope.currentUser.save(null, {
                        success: function (u) {
                            alert("申请成功！请等待处理");
                            $scope.reloadReturnBalance();
                        }
                    });
                },
                error: function (t, error) {
                    alert("申请失败：" + error.message);
                }
            })
        })
    }
})
YundaApp.controller('ReturnBalanceModalCtrl', function ($scope, $modalInstance) {
    $scope.transaction = new YD.Transaction();
    $scope.zhifubao = {
        account: "",
        name: "",
        contact: ""
    };
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.applyReturn = function () {
        if (!$scope.returnAmount) {
            alert("请填写退款金额");
            return;
        }
        if (parseFloat($scope.returnAmount) > $scope.currentUser.totalBalanceInDollar) {
            alert("金额已超过账户余额");
            return;
        }
        if ($scope.zhifubao.account === "") {
            alert("请提供支付宝账号");
            return;
        }
        if ($scope.zhifubao.name === "") {
            alert("请提供支付宝姓名");
            return;
        }
        if ($scope.zhifubao.contact === "") {
            alert("请提供支付宝联系方式");
            return;
        }
        if (!$scope.transaction.reason) {
            alert("请填写退款理由");
            return;
        }
        $scope.transaction.amount = parseFloat($scope.returnAmount);
        $scope.transaction.zhifubao = {
            account: $scope.zhifubao.account,
            name: $scope.zhifubao.name,
            contact: $scope.zhifubao.contact
        }
        $scope.transaction.isCredit = false;
        $scope.transaction.notes = "退款";
        var userPt = new YD.User();
        userPt.id = $scope.currentUser.id;
        $scope.transaction.user = userPt;
        $modalInstance.close($scope.transaction);
    }
    $scope.close = function () {
        $modalInstance.dismiss();
    }
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        $scope.isLoading = true;
        $scope.promote = "正在上传，请稍候...";
        if ($scope.identityFront != undefined) {
            var frontName = 'front.jpg'
            var avFileFront = new AV.File(frontName, $scope.identityFront[0])
            $scope.transaction.identityFront = avFileFront
            $scope.transaction.save(null, {
                success: function (img) {
                    $scope.isLoading = false;
                    $scope.promote = "";
                    alert("上传成功！请申请退款");
                },
                error: function (img, error) {
                    $scope.isLoading = false;
                    $scope.promote = "";
                    alert("错误!" + error.message);
                }
            })
        } else {
            alert("请先上传身份证");
        }
    }
});
YundaApp.controller('DashboardCtrl', function ($scope, $rootScope, $modal, $window) {
    $scope.badgeACount = 0
    $scope.badgeBCount = 0
    $scope.badgeCCount = 0
    $scope.badgeDCount = 0
    $scope.badgeECount = 0
    $scope.badge = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    }
    $scope.oneAtATime = true;
    $scope.systemStreet = $rootScope.systemStreet
    $scope.systemCity = $rootScope.systemCity
    $scope.systemState = $rootScope.systemState
    $scope.systemZipcode = $rootScope.systemZipcode
    //customers search for packages;
    $scope.query = {
        isSearch: false
    };
    $scope.updateLogin = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_username',
            controller: 'UpdateUsernameCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            alert("请前往邮箱验证账号");
            YD.User.logOut();            // Do stuff after successful login.
            $rootScope.currentUser = new YD.User();
            $window.location.href = '/';
        })
    }
    /* getting user's address */
    $scope.searchPackage = function () {
        $scope.query.isSearch = !$scope.query.isSearch;
    }

    $scope.updatePassword = function () {
        var r = confirm('是否确认修改密码？');
        if (!r) {

        } else {
            YD.User.requestPasswordReset($scope.currentUser.username, {
                success: function () {
                    alert("请前往您的电子邮箱重置密码");
                    YD.User.logOut();
                    $rootScope.currentUser = new YD.User;
                    $window.location.href = '/';

                },
                error: function (error) {
                    $scope.$apply(function () {
                        $scope.isLoading = false;
                        alert("请先提供电子邮箱地址");
                    });
                }
            });
        }

    }
    /* getting recipient */
    $scope.reloadAddress = function (index) {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("Address");
            query.equalTo("user", $scope.currentUser);
            query.limit($scope.LIMIT_NUMBER);
            query.skip($scope.LIMIT_NUMBER * index);
            query.descending("createdAt");
            if ($scope.searchName) {
                query.equalTo("recipient", $scope.recipientLookup);
            }
            query.include("identity");
            if (YD.User.current() != undefined) {
                query.find({
                    success: function (results) {
                        for(var i = 0; i < results.length; i++) {
                            var a = results[i];
                            a.isSelected = false;
                        }
                        $scope.recipientAddresses = results;
                        $scope.$apply();
                    },
                    error: function (error) {
                        alert("Getting Recipient Addresses Error: " + error.code + " " + error.message);
                    }
                });
            }
        }
    };
    $scope.reloadAddressCount = function () {
        var query = new AV.Query("Address");
        query.equalTo("user", $scope.currentUser);
        if ($scope.searchName) {
            query.equalTo("recipient", $scope.recipientLookup);
        }
        query.count({
            success: function (count) {
                console.log("counted: " + count);
                $scope.recipientCount = count;
                $scope.$apply();
            },
            error: function (error) {
                alert("Getting Recipient Addresses Error: " + error.message);
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadAddress($scope.currentPage - 1);
    }
    $scope.$watch('currentUser', function () {
        if ($scope.currentUser.id) {
            $scope.reloadAddressCount();
        }
    });
    $scope.reloadAddress(0);
    /* search recipients */
    $scope.searchRecipient = function () {
        $scope.searchName = true;
        $scope.reloadAddressCount();
        $scope.reloadAddress(0);
    }
    $scope.deleteAllSelectedAddress = function() {
        var deleteList = [];
        for(var i = 0; i < $scope.recipientAddresses.length; i++) {
            var add = $scope.recipientAddresses[i];
            if(add.isSelected) {
                deleteList.push(add);
            }
        }
        if(deleteList.length > 0) {
            var r = confirm("是否确认批量删除地址?")
            if(!r) {

            } else {
                AV.Object.destroyAll(deleteList, {
                    success: function() {
                        alert("批量删除成功.");
                        $scope.$apply(function () {
                            $scope.searchName = false;
                            $scope.recipientLookup = '';
                            $scope.currentPage = 1;

                            $scope.reloadAddressCount();
                            $scope.reloadAddress(0);
                        });
                    }
                })
            }
        }

    }
    $scope.$on('userab', function () {
        $scope.searchName = false;
        $scope.recipientLookup = '';
        $scope.currentPage = 1;

        $scope.reloadAddressCount();
        $scope.reloadAddress(0);
    });
    /* add a new recipient */
    $scope.addNewAddress = function () {
        var address = new YD.Address()
        if ($scope.currentUser.id != undefined) {
            address.user = $scope.currentUser;
            $scope.editAddress(address);
        } else {
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
            $scope.reloadAddress();
        })
    }
    $scope.deleteAddress = function (address) {
        var r = confirm("是否确认删除?");
        if (!r) {
        } else {
            address.destroy().then(function (address) {
                $scope.reloadAddress();
                alert("删除成功");
            }, function (address, error) {
                alert(error.message)
            })
        }
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
    $scope.showRecipientDetails = function (address) {
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
YundaApp.controller('ShowRecipientDetails', function ($scope, $modalInstance, address) {
    $scope.address = address;
    $scope.close = function () {
        $modalInstance.dismiss();
    }
})
YundaApp.controller('DeleteAddressCtrl', function ($scope, $modalInstance, address) {
    $scope.confirmDelete = function () {
        address.destroy().then(function (address) {
            $modalInstance.close(address)
        }, function (address, error) {
            alert(error.message);
        })
    }
    $scope.cancelDelete = function () {
        $modalInstance.dismiss();
    }
})
YundaApp.controller('UpdateUserCtrl', function ($scope) {
    $scope.address = new YD.Address();
    if ($scope.currentUser.addressId != undefined) {
        $scope.address.id = $scope.currentUser.addressId
        $scope.address.fetch().then(function (address) {
            if (!address) {
                $scope.address = new YD.Address();
            } else {
                $scope.address = address
            }
        });
    } else {
        $scope.address = new YD.Address();
    }
    $scope.update_user = function () {
        $scope.address.user = null;
        $scope.address.save(null, {
            success: function (address) {
                $scope.currentUser.addressId = address.id
                $scope.currentUser.save(null, {
                    success: function () {
                        alert("更新成功！")
                    },
                    error: function (user, error) {
                    }
                })
            },
            error: function (a, error) {
            }
        })
    }
})
YundaApp.controller('freightInArrivedCtrl', function ($scope, $rootScope, $modal, $filter) {
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.reloadFreightInArrived = function (index) {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("FreightIn")
            query.equalTo("user", $scope.currentUser)
            query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE])
            query.limit($scope.LIMIT_NUMBER);
            query.skip($scope.LIMIT_NUMBER * index);
            query.descending("createdAt");
            if($scope.query.number != undefined) {
                query.equalTo("trackingNumber", $scope.query.number);
            }
            query.find({
                success: function (results) {
                    $scope.$apply(function () {
                        $scope.freightIns = $filter('packageSearchFilter')(results, $scope.query.number);
                        for (var i = 0; i < $scope.freightIns.length; i++) {
                            var tmp = $scope.freightIns[i].createdAt
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes()
                            else
                                tmp_date += tmp.getMinutes();
                            $scope.freightIns[i].createdAt = tmp_date
                            if ($scope.freightIns[i].status == YD.FreightIn.STATUS_ARRIVED)
                                $scope.freightIns[i].status = "等待入库"
                            else if ($scope.freightIns[i].status == YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE)
                                $scope.freightIns[i].status = "待开箱检查"
                            else if ($scope.freightIns[i].status == YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE)
                                $scope.freightIns[i].status = "已开箱检查"
                        }
                    })
                },
                error: function (error) {
                    alert("Getting Freight In Error: " + error.code + " " + error.message)
                }
            })
        }
    };
    $scope.$watch("query.isSearch", function (newVal) {
        $scope.reloadFreightCount();

        $scope.reloadFreightInArrived(0);
    });
    $scope.reloadFreightCount = function () {
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE])
        if($scope.query.number != undefined) {
            query.equalTo("trackingNumber", $scope.query.number);
        }
        query.count({
            success: function (count) {
                $scope.freightCount = count;
                $scope.badge.A = count;
            }
        });
    };
    $scope.reloadFreightCount();
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadFreightInArrived($scope.currentPage - 1);
    }
    $scope.$on('userbb', function (event, args) {
        $scope.query.number = undefined;
        $scope.currentPage = 1;

        $scope.reloadFreightCount();

        $scope.reloadFreightInArrived(0);
    });
    $scope.searchForFreightIn = function () {
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("trackingNumber", $scope.query);
        query.equalTo("user", $scope.currentUser);
        query.find({
            success: function (results) {
                $scope.$apply(function () {
                    $scope.freightIns = results
                    for (var i = 0; i < $scope.freightIns.length; i++) {
                        //format date
                        var tmp = $scope.freightIns[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes();
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freightIns[i].createdAt = tmp_date;
                        //format status
                        if ($scope.freightIns[i].status == YD.FreightIn.STATUS_ARRIVED)
                            $scope.freightIns[i].status = "等待入库";
                        else if ($scope.freightIns[i].status == YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE)
                            $scope.freightIns[i].status = "待开箱检查";
                        else if ($scope.freightIns[i].status == YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE)
                            $scope.freightIns[i].status = "已开箱检查";
                    }
                });
            },
            error: function (error) {
                alert("Getting Freight In Error: " + error.code + " " + error.message)
            }
        });
    }
    $scope.reloadFreightInArrived(0);
    $scope.openNotesWithImage = function (freightIn) {
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
    $scope.leaveComments = function (freightIn) {
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
        })
    }
    $scope.freightInConfirm = function (freightIn) {
        if ($scope.currentUser.id != undefined) {
            freightIn.status = YD.FreightIn.STATUS_CONFIRMED;
            var tmp = new Date();
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
                tmp_date += "0" + tmp.getMinutes();
            else
                tmp_date += tmp.getMinutes();
            freightIn.confirmDate = new Date();
            freightIn.save().then(function (freightIn) {
                $scope.reloadFreightInArrived()
                alert("已确认入库")
            }, function (freightIn, error) {
            })
        }
    }
    $scope.checkPackage = function (freightIn) {
        var r = confirm("是否验货? (手续费为$+" + $scope.systemSetting.checkPackageCharge + "/件)");
        if (!r) {
            return;
        } else {
            var modalInstance = $modal.open({
                templateUrl: 'partials/modal_checkPackage',
                controller: 'CheckPackageCtrl',
                scope: $scope,
                size: 'md',
                windowClass: 'center-modal',
                resolve: {
                    freightIn: function () {
                        return freightIn;
                    }
                }
            })
            modalInstance.result.then(function (checkInfo) {
                $scope.isLoading = true;
                $scope.promote = "正在提交，请稍候...";
                freightIn.isChecking = true;
                freightIn.status = YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE;
                freightIn.checkInfo = {
                    email: checkInfo.email,
                    isTakingPhoto: checkInfo.isTakingPhoto,
                    notes: checkInfo.notes
                };
                var tmp = new Date();
                var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                if (tmp.getMinutes() < 10)
                    tmp_date += "0" + tmp.getMinutes();
                else
                    tmp_date += tmp.getMinutes();
                freightIn.checkDate = new Date();
                freightIn.save(null, {
                    success: function (f) {
                        $scope.reloadFreightInArrived()
                        $scope.isLoading = false
                        $scope.promote = ""
                        alert("申请验货成功!请耐心等待管理员处理，并关注此运单的管理员反馈")
                    },
                    error: function (f, error) {
                        alert("出错！" + error.message)
                        $scope.isLoading = false
                        $scope.promote = ""
                    }
                })
            })
        }
    }
})
YundaApp.controller('CheckPackageCtrl', function ($scope, $modalInstance, freightIn) {
    $scope.checkInfo = {
        email: "",
        isTakingPhoto: false,
        notes: ""
    }
    $scope.freightIn = freightIn;
    $scope.confirm = function () {
        if ($scope.checkInfo.email == "") {
            alert("请填写email");
            return;
        }
        if ($scope.checkInfo.notes == "") {
            alert("请填写验货要求");
            return;
        }
        $modalInstance.close($scope.checkInfo);
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('freightInConfirmedCtrl', function ($scope, $rootScope, $modal, $filter) {
    $scope.insurance = {
        value: 0,
        amount: 0,
        total: 0
    };
    $scope.refreshInsurance = function () {
        $scope.insurance.value = 0;
        $scope.insurance.total = 0;
        $scope.insurance.amount = 0;
    };
    $scope.addNewAddress = function () {
        var address = new YD.Address()
        if ($scope.currentUser.id != undefined) {
            address.user = $scope.currentUser;
            $scope.editAddress(address);
        } else {
        }
    };
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
        })
    }
    $scope.checkboxClick = function (f, $event) {
        f.selection = !f.selection;
        $event.stopPropagation();
    };
    $scope.checkboxClick1 = function (f, $event) {
        $scope.confirmTC = !$scope.confirmTC;
        $event.stopPropagation();
    }
    $scope.mergePackage = function () {
        var freightInList = []
        var totalWeight = 0;
        var newNumber = "";
        var RKCombine = "";
        var TNCombine = "";
        var idList = [];
        var referenceList = [];
        var isSplit = false;
        for (var i = 0; i < $scope.freightIns.length; i++) {
            if ($scope.freightIns[i].selection == true) {
                if ($scope.freightIns[i].isSplit || $scope.freightIns[i].isSplitPremium) {
                    alert("您已进行了分包操作");
                    return;
                }
                freightInList.push($scope.freightIns[i]);
                totalWeight += $scope.freightIns[i].weight;
                newNumber += ($scope.freightIns[i].trackingNumber + ';\n');
                RKCombine += ($scope.freightIns[i].RKNumber + ';');
                TNCombine += ($scope.freightIns[i].trackingNumber + ';');
                idList.push($scope.freightIns[i].id);
                referenceList.push($scope.freightIns[i].RKNumber);
            }
        }
        if (freightInList.length <= 1) {
            alert("物品合包数量必须大于一件！")
            return
        }
        var r = confirm("是否确认合包?");
        if (!r) {
            return;
        } else {
            var freightIn = new YD.FreightIn();
            freightIn.user = $scope.currentUser;
            freightIn.weight = totalWeight;
            freightIn.trackingNumber = newNumber;
            freightIn.RKCombine = RKCombine;
            freightIn.TNCombine = TNCombine;
            freightIn.generateRKNumberWithCallback(function (success, reply) {
                if (!success) {
                    alert("错误！: " + reply);
                    return;
                } else {
                    freightIn.RKNumber = reply;
                    freightIn.isMerged = true;
                    freightIn.mergeReference = [];
                    for (var i = 0; i < freightInList.length; i++) {
                        var obj = {
                            id: idList[i],
                            RKNumber: referenceList[i]
                        };
                        freightIn.mergeReference.push(obj);
                        // change freightIn status to finised, so no need to write for loop twice
                        freightInList[i].status = YD.FreightIn.STATUS_FINISHED;
                    }
                    freightIn.status = YD.FreightIn.STATUS_CONFIRMED;
                    freightIn.save(null, {
                        success: function (f) {
                            AV.Object.saveAll(freightInList, {
                                success: function (list) {
                                    $scope.reloadFreightInConfirmed();
                                    alert("合包成功!");
                                },
                                error: function (error) {
                                    alert("错误! " + error.message);
                                }
                            });
                        },
                        error: function (f, error) {
                            alert("错误! " + error.message)
                        }
                    });
                }
            });
        }
    }
    $scope.cancelMergePackage = function (freightIn) {
        var r = confirm("是否取消合包?");
        if (!r) {
            return;
        } else {
            var idList = [];
            for (var i = 0; i < freightIn.mergeReference.length; i++) {
                var id = freightIn.mergeReference[i].id;
                idList.push(id);
            }
            var query = new AV.Query(YD.FreightIn);
            query.containedIn("objectId", idList);
            query.find({
                success: function (list) {
                    for (var i = 0; i < list.length; i++) {
                        var f = list[i];
                        f.status = YD.FreightIn.STATUS_CONFIRMED;
                    }
                    AV.Object.saveAll(list, {
                        success: function (list) {
                            freightIn.destroy({
                                success: function (obj) {
                                    $scope.reloadFreightInConfirmed();
                                    alert("取消成功");
                                },
                                error: function (obj, error) {
                                    alert("错误! " + error.message);
                                }
                            });
                        },
                        error: function (error) {
                            alert("错误! " + error.message);
                        }
                    });
                },
                error: function (error) {
                    alert("错误! " + error.message);
                }
            });
        }
    }
    $scope.addNewDescription = function (freightIn) {
        var d = freightIn.description;
        if (!d.kind) {
            alert("请先填写类别");
            return;
        }
        if (!d.name) {
            alert("请先填写品名");
            return;
        }
        if (!d.brand) {
            alert("请先填写品牌");
            return;
        }
        if (!d.amount) {
            alert("请先填写数量");
            return;
        }
        if (!d.price) {
            alert("请先填写单价");
            return;
        }
        freightIn.description.total = parseFloat(freightIn.description.price) * parseFloat(freightIn.description.amount);
        freightIn.insurance.total += parseFloat(freightIn.description.total);
        freightIn.descriptionList.push(freightIn.description);
        var d = freightIn.description;
        freightIn.packageComments += d.brand + d.name + 'x' + d.amount + ';\n';
        freightIn.description = {};
    }
    $scope.deleteDescrption = function (desc, freightIn) {
        for (var i = 0; i < freightIn.descriptionList.length; i++) {
            if (desc.name == freightIn.descriptionList[i].name) {
                freightIn.insurance.total -= parseFloat(freightIn.descriptionList[i].total);
                freightIn.descriptionList.splice(i, 1);
            }
        }
    }
    $scope.rewriteFreight = function (freightIn) {
        var r = confirm("是否重新填写?");
        if (!r) {
        } else {
            freightIn.channelSelection = undefined;
            freightIn.address = undefined;
            freightIn.description = {};
            freightIn.descriptionList = [];
            freightIn.packageComments = "";
            freightIn.checkboxModel = {
                delivery: false,
                addPackage: false,
                reduceWeight: false
            }
            freightIn.comments = "";
            $scope.confirmTC = false;
            $scope.insurance = {
                value: 0,
                amount: 0,
                total: 0
            };
        }
    }
    $scope.reloadFreightInConfirmed = function (index) {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("FreightIn")
            query.equalTo("user", $scope.currentUser);
            query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED);
            query.limit($scope.LIMIT_NUMBER);
            query.skip($scope.LIMIT_NUMBER * index);
            query.descending("createdAt");
            if ($scope.query.isSearch) {
                query.equalTo("trackingNumber", $scope.query.number);
            }
            query.find({
                success: function (results) {
                    //$scope.freightIns = $filter('packageSearchFilter')(results, $scope.query.number);
                    $scope.$apply(function () {

                        $scope.freightIns = results;
                    for (var i = 0; i < $scope.freightIns.length; i++) {
                        $scope.freightIns[i].checkboxModel = {
                            delivery: false,
                            addPackage: false,
                            reduceWeight: false
                        }
                        $scope.freightIns[i].channelSelection = {}
                        $scope.freightIns[i].selection = false
                        $scope.freightIns[i].descriptionList = [];
                        $scope.freightIns[i].description = {}
                        var tmp = $scope.freightIns[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freightIns[i].createdAtToString = tmp_date;
                        $scope.freightIns[i].packageComments = "";
                        $scope.freightIns[i].insurance = {
                            value: 0,
                            amount: 0,
                            total: 0
                        };
                    }
                    });
                    $scope.getRecipient();
                },
                error: function (error) {
                    alert("Getting Freight In Error: " + error.id + " " + error.message)
                }
            });
        }
    }
    $scope.reloadFreightInConfirmed(0);
    $scope.reloadFreightCount = function () {
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("user", $scope.currentUser);
        query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED);
        if ($scope.query.isSearch) {
            query.equalTo("trackingNumber", $scope.query.number);
        }
        query.count({
            success: function (count) {
                $scope.freightCount = count;
                $scope.badge.B = count;
                $scope.$apply();
            }
        });
    };
    $scope.reloadFreightCount();
    $scope.$watch("query.isSearch", function (newVal) {
        $scope.reloadFreightCount();
        $scope.reloadFreightInConfirmed(0);
    });
    $scope.$on('userbb', function (event, args) {
        $scope.query.number = undefined;
        $scope.currentPage = 1;

        $scope.reloadFreightCount();
        $scope.reloadFreightInConfirmed(0);
    });
    $scope.chooseSplitType = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseSplitType',
            controller: 'ChooseSplitTypeCtrl',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenType) {
            if (chosenType === "normal")
                $scope.splitPackage(freightIn)
            else if (chosenType === "charge")
                $scope.splitPackagePremium(freightIn)
        })
    }
    $scope.getRecipient = function () {
        var query = new AV.Query("Address")
        query.equalTo("user", $scope.currentUser);
        query.descending("createdAt");
        query.find({
            success: function (results) {
                $scope.recipients = results
            },
            error: function (res, error) {
                alert("Getting Recipient: " + error.code + " " + error.message)
            }
        })
    }
    $scope.getRecipient();
    $scope.chooseRecipient = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseRecipientAddress',
            controller: 'ChooseAddressCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                addressList: function () {
                    return $scope.recipients
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenAddress) {
            freightIn.address = chosenAddress
            alert("已成功选取收件人: " + freightIn.address.recipient)
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
            $scope.getRecipient()
            alert("添加新收件人成功！")
        })
    }
    $scope.splitPackage = function (freightIn) {
        if (freightIn.isSplit || freightIn.isSplitPremium) {
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
            freightIn.status = YD.FreightIn.STATUS_FINISHED;
            freightIn.save(null, {
                success: function (f) {
                    alert("分箱完成！")
                    $scope.reloadFreightInConfirmed()
                }
            })
        })
    }
    $scope.splitPackagePremium = function (freightIn) {
        if (freightIn.isSplit || freightIn.isSplitPremium) {
            alert("您已经进行过分包")
            return
        }
        alert("精确分包将收取费用！($" + $scope.systemSetting.splitPackageCharge + ")")
        if ($scope.currentUser.balanceInDollar < $scope.systemSetting.splitPackageCharge) {
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
                success: function (f) {
                    $scope.reloadFreightInConfirmed()
                    alert("分箱完成！");
                }
            })
        })
    }
    $scope.cancelSplit = function (freightIn) {
        var r = confirm("是否确认取消分包?");
        if (!r) {
        } else {
            var trackingNumber = freightIn.splitReference.trackingNumber;
            var query = new AV.Query(YD.FreightIn);
            query.equalTo("splitReference.trackingNumber", trackingNumber);
            query.find({
                success: function (list) {
                    AV.Object.destroyAll(list);
                    query = new AV.Query(YD.FreightIn);
                    query.get(freightIn.splitReference.parentId, {
                        success: function (f) {
                            f.status = YD.FreightIn.STATUS_CONFIRMED;
                            f.save(null, {
                                success: function (f) {
                                    $scope.reloadFreightInConfirmed();
                                    alert("操作成功!");
                                },
                                error: function (f, error) {
                                    alert("操作失败! " + error.message);
                                }
                            });
                        },
                        error: function (freightIn, error) {
                            alert("错误! " + error.message);
                        }
                    });
                },
                error: function (error) {
                    alert("错误! " + error.message);
                }
            });
        }
    }
    $scope.confirmTC = false;
    $scope.isClicked = false;
    $scope.generateFreight = function (freightIn) {
        if (!freightIn.address) {
            alert("请先选择地址");
            return;
        }
        if (freightIn.channelSelection == "") {
            alert("请先选择渠道");
            return;
        }
        if (freightIn.descriptionList.length == 0) {
            alert("请先填写货物细节(需［点击确认］生成物品详情)");
            return;
        }
        if (freightIn.packageComments == "" || !freightIn.packageComments) {
            alert("请先填写货物描述");
            return;
        }
        if (!$scope.confirmTC) {
            alert("请先同意条款: ");
            return;
        }
        if (freightIn.insurance.value > freightIn.insurance.total) {
            alert("保价价值超过总申报价格");
            return;
        }
        if (freightIn.channelSelection.name == "小包裹A渠道" || freightIn.channelSelection.name == "小包裹B渠道") {
            if (freightIn.weight > 6.6) {
                alert("小包裹A/B渠道每个包裹重量不得超过6.6磅，请使用其它渠道");
                return;
            }
        }
        if (freightIn.channelSelection.name == "Q渠道A" || freightIn.channelSelection.name == "Q渠道B") {
            if (freightIn.weight > 10) {
                alert("Q渠道A/B每个包裹重量不得超过10磅，请使用其它渠道");
                return;
            }
        }
        if (freightIn.insurance.value > 0) {
            if (freightIn.insurance.value < 10 || freightIn.insurance.value > 1000) {
                alert("保价价值小于$10或大于$1000");
                return;
            }
        }
        $scope.isClicked = true;
        var freight = new YD.Freight();
        var add = freightIn.address;
        freight.address = {
            city: add.city || "",
            contactNumber: add.contactNumber || "",
            country: add.country || "",
            mobileNumber: add.mobileNumber || "",
            postalCode: add.postalCode || "",
            recipient: add.recipient || "",
            state: add.state || "",
            street1: add.street1 || "",
            street2: add.street2 || "",
            suburb: add.suburb || ""
        }
        if (freightIn.checkboxModel != undefined) {
            if (freightIn.checkboxModel.addPackage == true) {
                freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING);
                freight.isAddPackage = true;
            }
            if (freightIn.checkboxModel.reduceWeight == true) {
                freight.add("statusGroup", YD.Freight.STATUS_PENDING_REDUCE_WEIGHT);
                freight.isReduceWeight = true;
            }
        }
        freight.user = $scope.currentUser;
        freight.weight = freightIn.weight;
        freight.trackingNumber = freightIn.trackingNumber;
        var query = new AV.Query(YD.Freight);
        query.equalTo("trackingNumber", freight.trackingNumber);
        query.equalTo("user", $scope.currentUser);
        query.count({
            success: function(count) {
                if(count > 0) {
                    alert("您已经生成过运单，或此转运号已被使用，请刷新网页重试");
                    return;
                } else {
                    freight.RKNumber = freightIn.RKNumber;
                    freight.exceedWeight = freightIn.exceedWeight;
                    freight.status = YD.Freight.STATUS_INITIALIZED;
                    freight.comments = freightIn.comments;
                    freight.packageComments = freightIn.packageComments;
                    freight.descriptionList = [];
                    for (var i = 0; i < freightIn.descriptionList.length; i++) {
                        var d = freightIn.descriptionList[i];
                        var obj = {
                            kind: d.kind.name, //cuz kind getting from select, and it's an obj
                            name: d.name,
                            brand: d.brand,
                            amount: d.amount,
                            price: d.price,
                            total: d.total
                        }
                        freight.add("descriptionList", obj);
                    }
                    freight.insurance = freightIn.insurance.value * 0.02 + "(所保价值: " + freightIn.insurance.value + ")";
                    freight.channel = freightIn.channelSelection;
                    if (freightIn.isSplit) {
                        freight.isSplit = true
                        freight.splitReference = freightIn.splitReference
                        freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
                    }
                    if (freightIn.isSplitPremium) {
                        freight.isSplitPremium = true
                        freight.splitReference = freightIn.splitReference
                        freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM)
                    }
                    if (freightIn.isMerged) {
                        freight.isMerge = true
                        freight.mergeReference = freightIn.mergeReference
                        freight.add("statusGroup", YD.Freight.STATUS_PENDING_MERGE_PACKAGE)
                        freight.TNCombine = freightIn.TNCombine;
                        freight.RKCombine = freightIn.RKCombine;
                    }
                    freight.generateYDNumber(function (success, reply) {
                        if (!success) {
                            alert("错误!" + reply);
                            $scope.isClicked = false;
                            return;
                        } else {
                            freight.YDNumber = reply;
                            freight.save(null, {
                                success: function () {
                                    freightIn.status = YD.FreightIn.STATUS_FINISHED;
                                    freightIn.save(null, {
                                        success: function () {
                                            if (freight.isSplit || freight.isSplitPremium) {
                                                var RKNumber = freight.RKNumber.substr(0, 12);
                                                var query = new AV.Query(YD.FreightIn);
                                                query.startsWith("RKNumber", RKNumber);
                                                query.find({
                                                    success: function (list) {
                                                        for (var i = 0; i < list.length; i++) {
                                                            list[i].isOperating = true;
                                                        }
                                                        AV.Object.saveAll(list, {
                                                            success: function (list) {
                                                                alert("生成运单成功!");
                                                                $scope.isClicked = false;
                                                                $scope.reloadFreightInConfirmed(0);
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                alert("生成运单成功!");
                                                $scope.isClicked = false;
                                                $scope.reloadFreightInConfirmed();
                                            }
                                        },
                                        error: function (freightIn, error) {
                                            $scope.isClicked = false;
                                        }
                                    })
                                },
                                error: function (freight, error) {
                                    $scope.isClicked = false;
                                    if (error.code == 105) {
                                        alert("生成运单失败,请刷新页面重试");
                                    } else {
                                        alert("生成运单失败");
                                    }
                                }
                            });
                        }
                    });
                }
            },
            error: function(error) {
                console.log("ERROR: " + error.essage);
                alert("请重试");
                $scope.isClicked = false;
                $scope.reloadFreightInConfirmed();
            }
        })
    }
    $scope.generateDeliveryFreight = function (freightIn) {
        if (freightIn.address == undefined) {
            alert("Choose address first")
        } else {
            var freight = new YD.Freight
            freight.address = freightIn.address
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION)
            freight.user = $scope.currentUser
            freight.weight = freightIn.weight
            freight.trackingNumber = freightIn.trackingNumber
            freight.status = YD.Freight.STATUS_INITIALIZED
            freight.comments = freightIn.comments
            if (freightIn.isSplit) {
                freight.isSplit = true
                freight.splitReference = freightin.splitReference
            }
            if (freightIn.isSplitPremium) {
                freight.isSplitPremium = true
                freight.splitReference = freightIn.splitReference
                freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM)
            }
            freight.save(null, {
                success: function (freight) {
                    freightIn.status = YD.FreightIn.STATUS_FINISHED;
                    freightIn.save(null, {
                        success: function (freightIn) {
                            alert("运单已生成")
                        },
                        error: function (freightIn, error) {
                        }
                    })
                },
                error: function (freight, error) {
                }
            })
        }
        $scope.reloadFreightInConfirmed()
    }
    $scope.generateAllFreight = function () {
        for (var i = 0; i < $scope.freightIns.length; i++) {
            if ($scope.freightIns[i].selection == true) {
                if ($scope.freightIns[i].address == undefined)
                    alert("请先选择每个运单的收件地址");
                else {
                    $scope.generateFreight($scope.freightIns[i]);
                    $scope.reloadFreightInConfirmed();
                }
            }
        }
    }
    $scope.openComments = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_leaveComments',
            controller: 'LeaveFreightCommentsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return f;
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("保存成功!")
        })
    }
    $scope.openNotes = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_openNotes',
            controller: 'OpenFreightNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return f;
                }
            },
            windowClass: 'center-modal'
        })
    }
})
YundaApp.controller('ChooseSplitTypeCtrl', function ($scope, $modalInstance) {
    $scope.confirm = function () {
        $modalInstance.close("normal")
    }
    $scope.confirmCharge = function () {
        $modalInstance.close("charge")
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
});
YundaApp.controller('FreightPendingCtrl', function ($scope, $modal, $rootScope, $filter) {
    $scope.getStatus = function () {
        for (var i = 0; i < $scope.freights.length; i++) {
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
                        statusString += "等待去发票; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "等待普通分箱; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM) {
                        statusString += "等待精确分箱; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_CONFIRMED_EXTRA_PACKAGING) {
                        statusString += "完成加固; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_CONFIRMED_REDUCE_WEIGHT) {
                        statusString += "完成去发票; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_CONFIRMED_SPLIT_PACKAGE) {
                        statusString += "完成普通分箱; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_CONFIRMED_SPLIT_PACKAGE_PREMIUM) {
                        statusString += "完成精确分箱; "
                    }
                }
            }
            $scope.freights[i].statusToString = statusString + '等待发货';
        }
    }
    $scope.reloadFreight = function (index) {
        var query = new AV.Query(YD.Freight)
        query.containedIn("status", [YD.Freight.STATUS_INITIALIZED, YD.Freight.STATUS_REJECTED]);
        query.equalTo("user", $scope.currentUser);
        query.include("shipping");
        query.include("address");
        query.include("user");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freights = $filter('packageSearchFilter')(list, $scope.query.number);
                    //$scope.freights = list
                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freights[i].createdAtToString = tmp_date
                        if ($scope.freights[i].packageComments) {
                            if ($scope.freights[i].packageComments.length > 10) {
                                $scope.freights[i].brief = $scope.freights[i].packageComments.substr(0, 10) + "...";
                            } else {
                                $scope.freights[i].brief = $scope.freights[i].packageComments;
                            }
                        }
                    }
                })
            }
        })
    };
    $scope.reloadFreightCount = function () {
        var query = new AV.Query(YD.Freight);
        query.containedIn("status", [YD.Freight.STATUS_INITIALIZED, YD.Freight.STATUS_REJECTED]);
        query.equalTo("user", $scope.currentUser);
        query.count({
            success: function (count) {
                $scope.freightCount = $scope.badge.C = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadFreight($scope.currentPage - 1);
    }
    $scope.reloadFreightCount();
    $scope.reloadFreight(0);
    $scope.$watch("query.isSearch", function (newVal) {
        $scope.reloadFreight(0);
    });
    $scope.$on('userbb', function (event, args) {
        $scope.query.number = undefined;
        $scope.currentPage = 1;

        $scope.reloadFreightCount();
        $scope.reloadFreight(0);
    });
    $scope.deleteFreight = function (freight) {
        var r = confirm("是否确认删除?");
        if (!r) {
            return;
        } else {
            var RKNumber = freight.RKNumber;
            freight.destroy({
                success: function (f) {
                    var query = new AV.Query(YD.FreightIn);
                    query.equalTo("RKNumber", RKNumber);
                    query.find({
                        success: function (list) {
                            if (list.length == 1) {
                                var fIn = list[0];
                                fIn.status = YD.FreightIn.STATUS_CONFIRMED;
                                fIn.save(null, {
                                    success: function (f) {
                                        $scope.reloadFreight(0);
                                        alert("删除运单成功，请重新生成运单");
                                    },
                                    error: function (f, error) {
                                        alert("错误!" + error.message);
                                    }
                                });
                            } else {
                                alert("错误! 查到多个运单");
                            }
                        }
                    })
                },
                error: function (f, error) {
                    $scope.reloadFreight();
                    alert("错误!" + error.message);
                }
            });
        }
    }
    $scope.editDetails = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_editFreightDetails',
            controller: 'FreightDetailsCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return freight;
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showOperationDetails',
            controller: 'ShowOperationDetailsCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                }
            },
            windowClass: 'center-modal'
        });
    }
})
YundaApp.controller('FreightDetailsCtrl', ["$scope", "$modalInstance", "$modal", "freight", function ($scope, $modalInstance, $modal, freight) {
    $scope.freight = freight;
    $scope.insurance = {
        value: 0,
        amount: 0,
        total: 0
    };
    $scope.originValue = 0;
    for (var i = 0; i < $scope.freight.descriptionList.length; i++) {
        var des = $scope.freight.descriptionList[i];
        $scope.insurance.total += des.total;
    }
    var ins = $scope.freight.insurance;
    var isValue = false;
    var insStr = '';
    for (var j = 0; j < ins.length; j++) {
        if (isValue) {
            insStr += ins[j];
        }
        if (ins[j] == ' ') {
            isValue = true;
        }
    }
    insStr = insStr.substr(0, insStr.length - 1);
    $scope.insurance.value = parseFloat(insStr);
    $scope.originValue = $scope.insurance.value;
    $scope.description = {};
    $scope.getRecipient = function () {
        var query = new AV.Query("Address");
        query.equalTo("user", $scope.currentUser);
        query.find({
            success: function (results) {
                $scope.recipients = results
            },
            error: function (res, error) {
                alert("Getting Recipient: " + error.code + " " + error.message);
            }
        })
    }
    $scope.getRecipient();
    $scope.chooseRecipient = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_chooseRecipientAddress',
            controller: 'ChooseAddressCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                addressList: function () {
                    return $scope.recipients
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (chosenAddress) {
            $scope.freight.address = chosenAddress
            alert("已成功选取收件人: " + chosenAddress.recipient)
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
            $scope.getRecipient()
            alert("添加新收件人成功！")
        })
    }
    $scope.close = function () {
        $modalInstance.dismiss();
    };
    $scope.addNewDescription = function () {
        var d = $scope.description
        if (!d.kind) {
            alert("请先填写类别");
            return;
        }
        if (!d.name) {
            alert("请先填写品名");
            return;
        }
        if (!d.brand) {
            alert("请先填写品牌");
            return;
        }
        if (!d.amount) {
            alert("请先填写数量");
            return;
        }
        if (!d.price) {
            alert("请先填写单价");
            return;
        }
        var obj = {
            kind: $scope.description.kind.name,
            name: $scope.description.name,
            brand: $scope.description.brand,
            amount: $scope.description.amount,
            price: $scope.description.price,
            total: $scope.description.amount * $scope.description.price
        }
        $scope.freight.addUnique("descriptionList", obj);
        $scope.freight.save(null, {
            success: function (f) {
                $scope.insurance.total += obj.total;
                $scope.freight.packageComments += obj.brand + obj.name + "x" + obj.amount + ';\n';
                $scope.description = {};
                $scope.$apply();
                alert("添加成功");
            },
            error: function (f, error) {
            }
        });
    };
    $scope.deleteDescription = function (desc) {
        for (var i = 0; i < $scope.freight.descriptionList.length; i++) {
            if (desc.name == $scope.freight.descriptionList[i].name) {
                $scope.freight.descriptionList.splice(i, 1);
            }
        }
        $scope.freight.save(null, {
            success: function (f) {
                $scope.insurance.total -= desc.total;
                $scope.$apply();
                alert("已删除");
            },
            error: function (f, error) {
                alert("错误" + error.message);
            }
        });
    };
    $scope.saveFreight = function () {
        if (!$scope.freight.address) {
            alert("请先选择地址")
            return;
        } else if (!$scope.freight.channel) {
            alert("请先选择渠道")
            return;
        } else if ($scope.freight.descriptionList.length == 0) {
            alert("请先填写货物细节(需［点击确认］生成物品详情)");
            return;
        } else if ($scope.freight.packageComments == "" || !$scope.freight.packageComments) {
            alert("请先填写货物描述");
            return;
        } else {
            if ($scope.insurance.value != $scope.originValue) {
                if ($scope.insurance.value > 0) {
                    if ($scope.insurance.value < 10 || $scope.insurance.value > 1000) {
                        alert("保价价值小于$10或大于$1000");
                        return;
                    }
                }
                if ($scope.insurance.value > $scope.insurance.total) {
                    alert("保价价值超过总申报价格");
                    return;
                }
                $scope.freight.insurance = ($scope.insurance.value * 0.02).toFixed(2) + "(所保价值: " + $scope.insurance.value + ")";
            }
            $scope.freight.weight = $scope.freight.weight;
            $scope.freight.channel = $scope.freight.channel;
            $scope.freight.address = $scope.freight.address;
            $scope.freight.packageComments = $scope.freight.packageComments;
            $scope.freight.isAddPackage = $scope.freight.isAddPackage;
            $scope.freight.isReduceWeight = $scope.freight.isReduceWeight;
            $scope.freight.save(null, {
                success: function (f) {
                    alert("修改成功!");
                    $modalInstance.close();
                },
                error: function (f, error) {
                    alert("错误!" + error.message);
                    $modalInstance.dismiss();
                }
            });
        }
    }
}]);
YundaApp.controller('ChooseAddressCtrl', function ($scope, $modalInstance, addressList) {
    $scope.addressList = addressList
    $scope.count = addressList.length;
    $scope.description = {};
    $scope.chooseRecipient = function (address) {
        $scope.address = address
    }
    $scope.cancel = function () {
        $modalInstance.dismiss()
    }
    $scope.confirmChoose = function () {
        $modalInstance.close($scope.address)
    }
    $scope.reloadAddress = function (index) {
        $scope.showAddress = [];
        for (var i = index * $scope.LIMIT_NUMBER; i < (index + 1) * $scope.LIMIT_NUMBER; i++) {
            if ($scope.addressList[i]) {
                var a = $scope.addressList[i];
                console.log("address: " + a.recipient);
                $scope.showAddress.push(a);
            }
        }
    };
    $scope.reloadAddress(0);
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadAddress($scope.currentPage - 1);
    }
})
YundaApp.controller('mergePackageCtrl', function ($scope, $modalInstance, freightInList, $modal) {
    $scope.checkboxModel = {}
    $scope.checkboxModel.addPackage = false
    $scope.freightInList = freightInList
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
            alert("已成功选取收件人: " + chosenAddress.recipient)
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
            $scope.getRecipient()
            alert("添加新收件人成功！")
        })
    }
    $scope.confirmMergePackage = function () {
        var freight = new YD.Freight()
        for (var i = 0; i < freightInList.length; i++) {
            freight.add("freightInGroup", freightInList[i].trackingNumber)
        }
        freight.address = $scope.chosenAddress
        freight.user = $scope.currentUser
        freight.weight = 0
        freight.status = 0
        freight.comments = $scope.addedComment
        freight.add("statusGroup", YD.Freight.STATUS_PENDING_MERGE_PACKAGE)
        if ($scope.checkboxModel.addPackage == true) {
            freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING)
        }
        freight.isMerge = true
        freight.save(null, {
            success: function (freight) {

                for (var i = 0; i < freightInList.length; i++) {
                    freightInList[i].status = YD.FreightIn.STATUS_FINISHED
                }
                AV.Object.saveAll(freightInList, {
                    success: function (list) {
                        $modalInstance.close()
                    },
                    error: function (error) {
                    }
                })
            },
            error: function (freight, error) {
            }
        })
    }
    $scope.cancelMergePackage = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('OpenNotesWithImageCtrl', function ($scope, $modalInstance, freightIn) {
    $scope.freightIn = freightIn
    $scope.close = function () {
        $modalInstance.close()
    }
})
YundaApp.controller('LeaveCommentsCtrl', function ($scope, $modalInstance, freightIn) {
    var query = new AV.Query(YD.FreightIn)
    query.get(freightIn.id, {
        success: function (f) {
            $scope.$apply(function () {
                $scope.freightIn = f
            })
        },
        error: function (f, error) {
        }
    })
    $scope.saveComments = function () {
        $scope.freightIn.save(null, {
            success: function (f) {
                $modalInstance.close()
            },
            error: function (f) {
            }
        })
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('fileUploadCtrl', function ($scope) {
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.filesChangedBack = function (elm) {
        $scope.identityBack = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        if ($scope.identityFront != undefined) {
            var frontName = $scope.currentUser.realName + 'front.jpg'
            var backName = $scope.currentUser.realName + 'back.jpg'
            var avFileFront = new AV.File(frontName, $scope.identityFront[0])
            var avFileBack = new AV.File(backName, $scope.identityBack[0])
            $scope.currentUser.identityFront = avFileFront
            $scope.currentUser.identityBack = avFileBack
            $scope.currentUser.save()
        } else {
            alert("Please upload file first")
        }
    }
})
YundaApp.controller('FreightConfirmedCtrl', function ($scope, $rootScope, $modal) {
    $scope.BAO_JIN = 0.02
    $scope.BAO_SHUI_JIN = 0.05
    $scope.options = [{
        name: "小包裹渠道",
        value: 0
    }, {
        name: "普通渠道",
        value: 1
    }]
    $scope.reward = {
        amount: 0
    }
    $scope.taxInsurance = {
        amount: 0
    }
    $scope.insurance = {
        value: 0,
        amount: 0
    }
    $scope.getStatus = function () {
        for (var i = 0; i < $scope.freights.length; i++) {
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
                        statusString += "已去发票;\n"
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
                        statusString += "已开箱检查;\n"
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "已普通分箱;\n"
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM) {
                        statusString += "已精确分箱; \n"
                    }
                }
            }
            $scope.freights[i].statusToString = statusString
        }
    }
    $scope.reloadFreightConfirmed = function () {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query(YD.Freight);
            query.equalTo("user", $scope.currentUser)
            query.equalTo("status", YD.Freight.STATUS_PENDING_FINISHED)
            query.include("user")
            query.find({
                success: function (results) {
                    $scope.freights = results
                    if (!$rootScope.systemSetting.isSmallPackageAllowed) {
                        $scope.options = [{
                            name: "普通渠道"
                        }]
                    }
                    for (var i = 0; i < $scope.freights.length; i++) {
                        $scope.freights[i].selection = false
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freights[i].createdAt = tmp_date
                        $scope.freights[i].estimatedPrice = $scope.freights[i].weight * $scope.PRICE
                    }
                    $scope.getStatus()
                    $scope.$apply(function () {
                        $rootScope.badgeTotalCount -= $scope.badgeCCount
                        $scope.badgeCCount = results.length
                        $rootScope.badgeTotalCount += $scope.badgeCCount
                    })
                },
                error: function (error) {
                    alert("Getting Freight Error: " + error.code + " " + error.message)
                }
            })
        }
    }
    $scope.reloadFreightConfirmed()
    $scope.provideOptions = function () {
        if ($scope.weight > 6.6 && $scope.options.length == 2) {
            $scope.options = [{
                name: "普通渠道"
            }] // only 普通包裹 available
        } else if ($scope.weight <= 6.6 && $scope.options.length == 1 && $rootScope.systemSetting.isSmallPackageAllowed) {
            $scope.options = [{
                name: "小包裹渠道"
            }, {
                name: "普通渠道"
            }]
        }
    }
    $scope.total = 0
    $scope.totalWeight = 0
    $scope.exceedWeight = {}
    $scope.exceedWeight.amount = 0
    $scope.$watch("insurance.value", function (newVal) {
        if (newVal.value != 0) {
            $scope.insurance.amount = ($scope.insurance.value * $scope.BAO_JIN).toFixed(2)
        }
    });
    $scope.selecting = function (freight) {
        if (freight.selection == true) {
            $scope.total += freight.estimatedPrice
            $scope.totalWeight += freight.weight
            $scope.provideOptions()
            if (freight.exceedWeight != undefined) {
                if (freight.exceedWeight > freight.weight)
                    $scope.exceedWeight.amount += freight.exceedWeight - freight.weight
            }
        }
        if (freight.selection == false) {
            $scope.total -= freight.estimatedPrice
            $scope.totalWeight -= freight.weight
            $scope.provideOptions()
            if (freight.exceedWeight != undefined) {
                if (freight.exceedWeight > freight.weight)
                    $scope.exceedWeight.amount -= freight.exceedWeight - freight.weight
            }
        }
    }

    $scope.openComments = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_leaveComments',
            controller: 'LeaveFreightCommentsCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return f;
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function () {
            alert("保存成功!")
        })
    }
    $scope.openNotes = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_openNotes',
            controller: 'OpenFreightNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return f;
                }
            },
            windowClass: 'center-modal'
        })
    }
})
YundaApp.controller('OpenFreightNotesCtrl', function ($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('LeaveFreightCommentsCtrl', function ($scope, $modalInstance, freight) {
    $scope.freightIn = freight
    $scope.saveComments = function () {
        $scope.freightIn.save(null, {
            success: function (f) {
                $modalInstance.close()
            },
            error: function (f, error) {
                alert("错误！")
                $modalInstance.dismiss()
            }
        })
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('FreightDeliveryCtrl', function ($scope, $rootScope, $filter, $modal) {
    $scope.reloadAllFreight = function (index) {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query(YD.Freight);
            query.equalTo("user", $scope.currentUser);
            query.include("shipping");
            query.include("user");
            query.containedIn("status", [YD.Freight.STATUS_PENDING_DELIVERY, YD.Freight.STATUS_DELIVERING, YD.Freight.STATUS_PASSING_CUSTOM, YD.Freight.STATUS_FINAL_DELIVERY, YD.Freight.STATUS_DELIVERED])
            console.log("$scope.query.isSearch: ", $scope.query.isSearch);
            console.log("$scope.query.number: " + $scope.query.number);
            if ($scope.query.isSearch) {
                query.equalTo("trackingNumber", $scope.query.number);

            }
            query.find({
                success: function (results) {
                    $scope.freights = $filter('packageSearchFilter')(results, $scope.query.number);
                    for (var i = 0; i < $scope.freights.length; i++) {
                        $scope.freights[i].delivery = new Date($scope.freights[i].shipping.delivery);
                    }
                    $scope.freights = $filter('orderBy')($scope.freights, '-delivery');
                    $scope.freightCount = $scope.badge.D = results.length;
                    var statusToString = "";
                    for (var i = 0; i < $scope.freights.length; i++) {
                        if ($scope.freights[i].status == YD.Freight.STATUS_PENDING_DELIVERY)
                            statusToString = "待处理";
                        else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERING)
                            statusToString = "已发货";
                        else if ($scope.freights[i].status == YD.Freight.STATUS_PASSING_CUSTOM)
                            statusToString = "清关中";
                        else if ($scope.freights[i].status == YD.Freight.STATUS_FINAL_DELIVERY)
                            statusToString = "已出关";
                        $scope.freights[i].statusToString = statusToString;
                        var tmp = $scope.freights[i].createdAt;
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes();
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freights[i].createdAtToString = tmp_date;
                    }
                    $scope.reloadFreight(index);

                },
                error: function (error) {
                    alert("ERROR: Getting Freight delivery: " + error.id + " " + error.message)
                }
            })
        }
    };
    //$scope.reloadAllFreight();
    $scope.reloadFreight = function (index) {
        console.log("indeX: " + index);
        var amount = index * $scope.LIMIT_NUMBER;
            $scope.freightList = [];
            for (var i = amount; i < $scope.LIMIT_NUMBER * (index + 1); i++) {
                if ($scope.freights[i] != undefined) {
                    $scope.freightList.push($scope.freights[i]);
                    //console.log("$scope:" + i + ": " + $scope.freights[i].id);
                }
            }
    };
    $scope.reloadFreightCount = function () {
        var query = new AV.Query(YD.Freight);
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.Freight.STATUS_PENDING_DELIVERY, YD.Freight.STATUS_DELIVERING, YD.Freight.STATUS_PASSING_CUSTOM, YD.Freight.STATUS_FINAL_DELIVERY, YD.Freight.STATUS_DELIVERED])
        if ($scope.query.isSearch) {
            query.equalTo("trackingNumber", $scope.query.number);
        }
        query.count({
            success: function (count) {
                $scope.freightCount = count;
                //$scope.badge.D = count;
            }
        })
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadFreight($scope.currentPage - 1);
    }
    //$scope.reloadFreightCount();
    //$scope.reloadFreight(0);
    $scope.$watch("query.isSearch", function (newVal) {
        if (newVal == true) {
            $scope.reloadAllFreight(0);
        }
    });
    $scope.$on('userbb', function (event, args) {
        $scope.query.number = undefined;
        $scope.currentPage = 1;

        $scope.reloadAllFreight(0);

        //$scope.reloadFreightCount();
    });
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightFullDetail',
            controller: 'FreightFullDetailCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                },
                isFromCustomer: function () {
                    return true;
                }
            },
            windowClass: 'center-modal'
        });
    }
});
YundaApp.controller('ChangeAddressCtrl', function ($scope, $modal) {
    $scope.origin = {}
    $scope.origin.address = ""
    $scope.ischosenAddress = false
    $scope.isLoading = false
    $scope.promote = ""
    $scope.isSearch = false
    $scope.changeAddressFreight = new YD.FreightChangeAddress()
    $scope.reloadChangeAddress = function () {
        var query = new AV.Query("FreightChangeAddress")
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status", [YD.FreightChangeAddress.STATUS_AWAITING, YD.FreightChangeAddress.STATUS_CONFIRMED, YD.FreightChangeAddress.STATUS_REFUSED])
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freights = list
                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freights[i].createdAt = tmp_date
                        if ($scope.freights[i].status == YD.FreightChangeAddress.STATUS_AWAITING)
                            $scope.freights[i].status = "等待处理"
                        else if ($scope.freights[i].status == YD.FreightChangeAddress.STATUS_CONFIRMED)
                            $scope.freights[i].status = "已处理"
                        else if ($scope.freights[i].status == YD.FreightChangeAddress.STATUS_REFUSED)
                            $scope.freights[i].status = "拒绝处理"
                        if ($scope.freights[i].adminEvidence != undefined) {
                            $scope.freights[i].adminEvidence = $scope.freights[i].adminEvidence.url()
                            $scope.freights[i].hasEvidence = true
                        } else {
                            $scope.freights[i].hasEvidence = false
                        }
                    }
                })
            },
            error: function (error) {
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
            query.get(ref, {
                success: function (f) {
                    $scope.freight = f
                    var addressToString = ""
                    if ($scope.freight.address != undefined) {
                        $scope.freight.recipient = $scope.freight.address.recipient
                        addressToString = $scope.freight.address.country + $scope.freight.address.state + $scope.freight.address.city + $scope.freight.address.suburb + $scope.freight.address.street1
                        if ($scope.freight.address.street2 != undefined) {
                            addressToString += $scope.freight.address.street2
                        }
                        $scope.origin.address = addressToString
                        $scope.isLoading = false
                        $scope.promote = ""
                        $scope.isSearch = false
                        $scope.$apply()
                    } else {
                        alert("此运单没有收货地址！")
                        $scope.freight.address = "无地址"
                        $scope.isLoading = false
                        $scope.promote = ""
                        $scope.isSearch = false
                        $scope.$apply()
                        return
                    }
                },
                error: function (f, error) {
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
    $scope.chooseRecipient = function () {
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
            $scope.reloadAddress();
        })
    }
    $scope.applyChangeAddress = function () {
        $scope.changeAddressFreight.user = $scope.currentUser
        $scope.changeAddressFreight.status = YD.FreightChangeAddress.STATUS_AWAITING
        $scope.changeAddressFreight.save(null, {
            success: function (f) {
                alert("申请成功，请等待处理");
                $scope.reloadChangeAddress();
            },
            error: function (f, error) {
                alert("申请失败！" + error.message)
            }
        })
    }
})
YundaApp.controller('DashboardSearchCtrl', function ($scope, $modal) {
    $scope.isSearching = false;
    $scope.trackingInfo = function () {
        $scope.isSearching = true;
        $scope.trackingList = $scope.trackingNumber.split("\n")

        var query1 = new AV.Query(YD.Freight);
        query1.containedIn("trackingNumber", $scope.trackingList);
        var query2 = new AV.Query(YD.Freight);
        query2.containedIn("YDNumber", $scope.trackingList);
        var query3 = new AV.Query(YD.Freight);
        query3.containedIn("RKNumber", $scope.trackingList);
        var query = AV.Query.or(query1, query2, query3);
        query.equalTo("user", $scope.currentUser);
        query.include("address");
        query.include("shipping");
        query.include("user");
        query.find({ //find normal package
            success: function (list) {
                console.log("lvl1 find: " + list.length);
                if (list.length >= $scope.trackingList.length) {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/modal_tracking',
                        controller: 'TrackingCtrl',
                        scope: $scope,
                        windowClass: 'center-modal',
                        size: 'lg',
                        resolve: {
                            resultList: function () {
                                return list;
                            }
                        }
                    });
                    $scope.isSearching = false;

                } else {
                    // find split package
                    var query1 = new AV.Query(YD.Freight);
                    query1.equalTo("id", "dummyIdForDummyQuery");
                    for (var i = 0; i < $scope.trackingList.length; i++) {
                        var number = $scope.trackingList[i];
                        var pattern = "(" + number + ")";
                        console.log("pattern: " + pattern);
                        var query2 = new AV.Query(YD.Freight);
                        query2.matches('trackingNumber', new RegExp(pattern, 'g'));
                        query1 = AV.Query.or(query1, query2);
                    }
                    var query3 = new AV.Query(YD.Freight);
                    query3.equalTo("id", "dummyIdForDummyQuery");

                    for (var i = 0; i < $scope.trackingList.length; i++) {
                        var number = $scope.trackingList[i];
                        var pattern = "(" + number + ")";
                        var query4 = new AV.Query(YD.Freight);
                        query4.matches('RKNumber', new RegExp(pattern, 'g'));
                        query3 = AV.Query.or(query3, query4);
                    }
                    var query = AV.Query.or(query1, query3);
                    query.equalTo("user", $scope.currentUser);

                    query.include("address");
                    query.include("shipping");
                    query.include("user");
                    query.find({
                        success: function (splitList) {

                            if (splitList.length != 0) {
                                var modalInstance = $modal.open({
                                    templateUrl: 'partials/modal_tracking',
                                    controller: 'TrackingCtrl',
                                    scope: $scope,
                                    windowClass: 'center-modal',
                                    size: 'lg',
                                    resolve: {
                                        resultList: function () {
                                            return splitList;
                                        }
                                    }
                                });
                                $scope.isSearching = false;

                            } else {
                                // find merge package
                                var query1 = new AV.Query(YD.Freight);
                                query1.equalTo("id", "dummyIdForDummyQuery");
                                for (var i = 0; i < $scope.trackingList.length; i++) {
                                    var number = $scope.trackingList[i];
                                    var pattern = "(" + number + ")";
                                    console.log("pattern: " + pattern);
                                    var query2 = new AV.Query(YD.Freight);
                                    query2.matches('RKCombine', new RegExp(pattern, 'g'));
                                    query1 = AV.Query.or(query1, query2);
                                }
                                var query3 = new AV.Query(YD.Freight);
                                query3.equalTo("id", "dummyIdForDummyQuery");

                                for (var i = 0; i < $scope.trackingList.length; i++) {
                                    var number = $scope.trackingList[i];
                                    var pattern = "(" + number + ")";
                                    var query4 = new AV.Query(YD.Freight);
                                    query4.matches('TNCombine', new RegExp(pattern, 'g'));
                                    query3 = AV.Query.or(query3, query4);
                                }
                                var query = AV.Query.or(query1, query3);
                                query.equalTo("user", $scope.currentUser);

                                query.include("address");
                                query.include("shipping");
                                query.include("user");
                                query.find({
                                    success: function (mergeList) {
                                        if (mergeList.length != 0) {
                                            var modalInstance = $modal.open({
                                                templateUrl: 'partials/modal_tracking',
                                                controller: 'TrackingCtrl',
                                                scope: $scope,
                                                windowClass: 'center-modal',
                                                size: 'lg',
                                                resolve: {
                                                    resultList: function () {
                                                        return splitList;
                                                    }
                                                }
                                            });
                                            $scope.isSearching = false;

                                        } else {
                                            alert("找不到结果!");
                                            $scope.$apply(function () {
                                                $scope.isSearching = false;

                                            });
                                            return;
                                        }
                                    },
                                    error: function (error) {
                                        $scope.$apply(function () {
                                            $scope.isSearching = false;

                                        });
                                        console.log("merge list finding ERROR: " + error.message);
                                    }
                                });
                            }
                        },
                        error: function (error) {
                            $scope.$apply(function () {
                                $scope.isSearching = false;

                            });
                            console.log("split list finding ERROR: " + error.message);
                        }
                    });
                }
            },
            error: function (error) {
                $scope.$apply(function () {
                    $scope.isSearching = false;

                });
                console.log("1st level tracking ERROR: " + error.message);
            }
        });
    }
})
YundaApp.controller('EditAddressCtrl', function ($scope, $modalInstance, address) {
    $scope.isLoading = false
    $scope.promote = ""
    $scope.isSaving = false;
    $scope.address = address;
    $scope.isChecked = false;
    if (!$scope.address.identity) {
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
        if ($scope.identityFront != undefined && $scope.identityBack != undefined) {
            $scope.isLoading = true
            $scope.promote = "正在上传身份证照片，请稍后..."
            $scope.isSaving = true;
            var frontName = 'front.jpg'
            var backName = 'back.jpg'
            var avFileFront = new AV.File(frontName, $scope.identityFront[0])
            var avFileBack = new AV.File(backName, $scope.identityBack[0])
            $scope.identity.identityFront = avFileFront
            $scope.identity.identityBack = avFileBack
            $scope.identity.save(null, {
                success: function (id) {
                    alert("身份证上传成功,请保存修改")
                    $scope.identity = id;
                    $scope.isLoading = false
                    $scope.promote = ""
                    $scope.isSaving = false
                    $scope.$apply()
                },
                error: function (id, error) {
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
            success: function (address) {
                alert("成功保存收件人信息！")
                $scope.isLoading = false
                $scope.promote = ""
                $modalInstance.close(address)
            },
            error: function (address, error) {
                alert("出错！" + error.message)
                $scope.isLoading = false
                $scope.promote = ""
                $modalInstance.dismiss()
            }
        });
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('SplitPackageCtrl', function ($scope, $modalInstance, freightIn) {
    $scope.notes
    $scope.package = {
        amount: 0
    }
    $scope.isPremium = false
    $scope.getRecipient()
    $scope.freightList = []
    $scope.generateFreightList = function () {
        $scope.freightList = []
        for (var i = 0; i < $scope.package.amount; i++) {
            var index = i + 1;
            $scope.freightList[i] = new YD.FreightIn();
            $scope.freightList[i].RKNumber = freightIn.RKNumber + "[分包:" + index + "/" + $scope.package.amount + "]";
            $scope.freightList[i].status = YD.FreightIn.STATUS_CONFIRMED;
            var statusList = []
            $scope.freightList[i].user = freightIn.user;
            $scope.freightList[i].splitReference = {
                index: index,
                parentId: freightIn.id,
                trackingNumber: freightIn.trackingNumber,
                RKNumber: freightIn.RKNumber
            };
            $scope.freightList[i].isSplit = true;
            $scope.freightList[i].trackingNumber = freightIn.trackingNumber + "[分包:" + index + "/" + $scope.package.amount + "]";
            $scope.freightList[i].weight = parseFloat((freightIn.weight / $scope.package.amount).toFixed(2));
            if (i == 0) {
                $scope.freightList[i].isChargeSplit = true;
            }
        }
    };
    $scope.close = function () {
        $modalInstance.dismiss();
    }
    $scope.confirmSplit = function () {
        AV.Object.saveAll($scope.freightList, {
            success: function (list) {
                $modalInstance.close();
            },
            error: function (error) {
            }
        })
    }
})
YundaApp.controller('SplitPackagePremiumCtrl', function ($scope, $modalInstance, freightIn) {
    $scope.notes
    $scope.package = {
        amount: 0
    }
    $scope.getRecipient()
    $scope.isPremium = true
    $scope.freightList = []
    $scope.generateFreightList = function () {
        $scope.freightList = [];
        for (var i = 0; i < $scope.package.amount; i++) {
            $scope.freightList[i] = new YD.FreightIn();
            var index = i + 1;
            $scope.freightList[i].RKNumber = freightIn.RKNumber + "[分包:" + index + "/" + $scope.package.amount + "]";
            $scope.freightList[i].status = YD.FreightIn.STATUS_CONFIRMED
            var statusList = []
            $scope.freightList[i].user = freightIn.user;
            $scope.freightList[i].splitReference = {
                index: index,
                parentId: freightIn.id,
                trackingNumber: freightIn.trackingNumber,
                RKNumber: freightIn.RKNumber
            };
            $scope.freightList[i].isSplitPremium = true
            $scope.freightList[i].trackingNumber = freightIn.trackingNumber + "[分包:" + index + "/" + $scope.package.amount + "]";
            $scope.freightList[i].weight = parseFloat((freightIn.weight / $scope.package.amount).toFixed(2));
            if (i == 0) {
                $scope.freightList[i].isChargeSplit = true;
            }
        }
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
    $scope.confirmSplit = function () {
        AV.Object.saveAll($scope.freightList, {
            success: function (list) {
                $modalInstance.close()
            },
            error: function (error) {
            }
        })
    }
})
YundaApp.controller('UpdatePasswordCtrl', function ($scope, $modalInstance) {
    $scope.savePassword = function () {
        $scope.currentUser.setPassword($scope.newPassword);
        $scope.currentUser.save().then(function (user) {
            alert("修改成功");
            $modalInstance.close(user);
        });
    }
})
YundaApp.controller('UpdateUsernameCtrl', ["$scope", "$modalInstance", function ($scope, $modalInstance) {
    $scope.saveUsername = function () {
        $scope.isLoading = true;
        $scope.promote = "请稍候...";
        var query = new AV.Query(YD.User);
        query.equalTo("username", $scope.newUsername);
        query.count({
            success: function (count) {
                console.log("$scope.newUsername: " + $scope.newUsername + " | " + count);
                if (count == 0) {
                    $scope.currentUser.username = $scope.currentUser.email = $scope.newUsername;
                    $scope.currentUser.save().then(function (user) {
                        alert("修改成功");
                        $modalInstance.close(user);
                    });
                } else {
                    alert("用户名重复！请重新输入");
                    $scope.isLoading = false;
                    $scope.promte = "";
                    $scope.$apply();
                    return;
                }
            }
        });
    };
    $scope.close = function () {
        $modalInstance.dismiss();
    }
}])
YundaApp.controller('RechargeCtrl', function ($scope, $rootScope, $modal) {
    $scope.FIXED_RATE = $rootScope.rate;
    $scope.$watch('CNY', function (newVal) {
        if (newVal != 0 || newVal != undefined) {
            $scope.USD = ((newVal / $scope.FIXED_RATE) * (1 + 0.29) + 0.3).toFixed(2)
            $scope.USD = parseFloat($scope.USD)
        }
    }, true);
    $scope.stripePayment = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_stripe',
            controller: 'StripeCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                USD: function () {
                    return $scope.USD;
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            alert("充值成功!");
        });
    };
})

YundaApp.controller('ZhifubaoCtrl', function ($scope, $rootScope, $http, $location) {
    $scope.rechargeAmount = 0
    $scope.rechargeAmountDollar = 0
    $scope.record = ''
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.isPaying = false;
    $scope.reloadZhifubao = function () {
        var query = new AV.Query("Transaction")
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_PENDING]);
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.transactionList = list
                    for (var i = 0; i < $scope.transactionList.length; i++) {
                        var tmp = $scope.transactionList[i].createdAt;
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
    $scope.reloadZhifubao();
    $scope.$watch('rechargeAmount', function (newVal) {
        if (newVal != 0 || newVal != undefined) {
            $scope.rechargeAmountDollar = (Math.floor(newVal / $scope.FIXED_RATE * 100)) / 100

        }
    }, true);
    $scope.$watch('systemSetting', function (newVal) {
        if (newVal != undefined) {
            $scope.FIXED_RATE = $scope.systemSetting.rate;
        }
    });
    $scope.submitAlipay = function () {
        if ($scope.rechargeAmountDollar != NaN || $scope.rechargeAmountDollar == "") {
            // call alipay web api
            $scope.isPaying = true;
            var transaction = new YD.Transaction();
            //not yet
            //transaction.status = YD.Transaction.STATUS_ZHIFUBAO;
            var userPt = new YD.User();
            userPt.id = $scope.currentUser.id;
            transaction.user = userPt;
            transaction.amount = (Math.floor($scope.rechargeAmount / $scope.FIXED_RATE * 100)) / 100;

            transaction.status = YD.Transaction.STATUS_ZHIFUBAO_PENDING;
            transaction.yuanInCent = $scope.rechargeAmount * 100;
            transaction.save(null, {
                success: function (t) {
                    $http.post('/pay', {
                        total_fee: $scope.rechargeAmount,
                        tranId: t.id,
                        userId: $scope.currentUser.id,
                        rate: $scope.FIXED_RATE
                    }).success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        //tabWindowId.location.href = headers('Location');
                        $rootScope.alipayData = data;
                        alert("充值完成后，务必请保持停留在该页面不要离开(不要手动关闭页面)，直至系统自动跳转回Yunda主页面。");
                        $location.path('/pay');
                    });
                },
                error: function (t, error) {
                    alert("错误!" + error.message);
                }
            });
        } else {
            alert("请重新填写金额");

        }
    };
});
YundaApp.controller('AlipayCtrl', ["$scope", "$rootScope", "$sce", function ($scope, $rootScope, $sce) {
    $scope.data = $sce.trustAsHtml($rootScope.alipayData);
    console.log("Data: " + $rootScope.alipayData);
}]);


YundaApp.controller('ConsumeRecordCtrl', function ($scope) {
    $scope.searchDate = false;
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
    $scope.reloadTransaction = function (index) {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("Transaction")
            query.equalTo("user", $scope.currentUser)
            query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE, YD.Transaction.STATUS_CONSUME_ADD_PACKAGE, YD.Transaction.STATUS_CONSUME_RETURN_GOODS, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_DEBIT_USER]);
            query.limit($scope.LIMIT_NUMBER);
            query.skip($scope.LIMIT_NUMBER * index);
            query.descending("createdAt");
            if ($scope.searchDate) {
                var date = new Date()
                var hour = date.getHours()
                var minute = date.getMinutes()
                var d1 = new Date($scope.dt1);
                var d2 = new Date($scope.dt2);
                d1.setHours(0);
                d1.setMinutes(1);
                d2.setHours(23);
                d2.setMinutes(59);
                query.greaterThanOrEqualTo("createdAt", d1);
                query.lessThanOrEqualTo("createdAt", d2);
            }
            query.find({
                success: function (tList) {
                    $scope.transactionList = tList;
                    for (var i = 0; i < tList.length; i++) {
                        if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME) {
                            $scope.transactionList[i].status = '运费';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE) {
                            $scope.transactionList[i].status = '精确分箱';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE) {
                            $scope.transactionList[i].status = '开箱检查';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_ADD_PACKAGE) {
                            $scope.transactionList[i].status = '加固';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_DEBIT_USER) {
                            $scope.transactionList[i].status = '系统扣款';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_RETURN_GOODS) {
                            $scope.transactionList[i].status = '退货';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE) {
                            $scope.transactionList[i].status = '退款';
                        }
                        var tmp = $scope.transactionList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.transactionList[i].createdAtToString = tmp_date
                    }
                    $scope.$apply()
                },
                error: function (tList, err) {
                }
            })
        }
    };
    $scope.reloadTransactionCount = function () {
        var query = new AV.Query("Transaction");
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE, YD.Transaction.STATUS_CONSUME_ADD_PACKAGE, YD.Transaction.STATUS_CONSUME_RETURN_GOODS, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_DEBIT_USER]);
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.count({
            success: function (count) {
                $scope.tCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadTransaction($scope.currentPage - 1);
    }
    $scope.reloadTransactionCount();
    $scope.$on('usercc', function (event, args) {
        $scope.currentPage = 1;

        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    });

    $scope.reloadSelectedTransaction = function () {
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            $scope.searchDate = true;
            $scope.reloadTransactionCount();
            $scope.reloadTransaction(0);
        } else {
            alert("请先选择日期");
        }
    }
})
YundaApp.controller('RechargeRecordCtrl', function ($scope) {
    $scope.Math = Math;
    $scope.searchDate = false;
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
    $scope.reloadTransaction = function (index) {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("Transaction")
            query.equalTo("user", $scope.currentUser)
            query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_PENDING, YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED, YD.Transaction.STATUS_STRIPE, YD.Transaction.STATUS_CREDIT_USER, YD.Transaction.STATUS_CLAIM_REWARD]);
            query.limit($scope.LIMIT_NUMBER);
            query.skip($scope.LIMIT_NUMBER * index);
            query.descending("createdAt");
            if ($scope.searchDate) {
                var date = new Date()
                var hour = date.getHours()
                var minute = date.getMinutes();
                var d1 = new Date($scope.dt1);
                var d2 = new Date($scope.dt2);
                d1.setHours(0);
                d1.setMinutes(1);
                d2.setHours(23);
                d2.setMinutes(59);
                query.greaterThanOrEqualTo("createdAt", d1);
                query.lessThanOrEqualTo("createdAt", d2);
                //$scope.dt1 = new Date($scope.dt1)
                //$scope.dt2 = new Date($scope.dt2)
                //$scope.dt1.setHours(0)
                //$scope.dt1.setMinutes(1)
                //$scope.dt2.setHours(23)
                //$scope.dt2.setMinutes(59)
                //query.greaterThanOrEqualTo("createdAt", $scope.dt1)
                //query.lessThanOrEqualTo("createdAt", $scope.dt2)
            }
            query.find({
                success: function (tList) {
                    $scope.transactionList = tList
                    for (var i = 0; i < tList.length; i++) {
                        if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO) {
                            $scope.transactionList[i].statusToString = '充值成功';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_STRIPE) {
                            $scope.transactionList[i].statusToString = '信用卡充值';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO_PENDING) {
                            $scope.transactionList[i].statusToString = '未充值'
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CREDIT_USER) {
                            $scope.transactionList[i].statusToString = '系统赠款'
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CLAIM_REWARD) {
                            $scope.transactionList[i].statusToString = 'YD币兑换'
                        }
                        var tmp = $scope.transactionList[i].createdAt;
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.transactionList[i].createdAtToString = tmp_date;
                    }
                    $scope.$apply();
                },
                error: function (tList, err) {
                }
            })
        }
    }
    $scope.reloadTransactionCount = function () {
        var query = new AV.Query("Transaction");
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_PENDING, YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED, YD.Transaction.STATUS_STRIPE, YD.Transaction.STATUS_CREDIT_USER, YD.Transaction.STATUS_CLAIM_REWARD]);
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.count({
            success: function (count) {
                $scope.tCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadTransaction($scope.currentPage - 1);
    }
    $scope.reloadTransactionCount();
    $scope.$on('usercb', function (event, args) {
        $scope.searchDate = false;
        $scope.currentPage = 1;

        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    });
    $scope.reloadSelectedTransaction = function () {
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            $scope.searchDate = true;
            $scope.reloadTransactionCount();
            $scope.reloadTransaction(0);
        } else {
            alert("请先选择日期");
        }
    }

})
YundaApp.controller('RewardCtrl', ["$scope", function ($scope) {
    $scope.amount = 0;
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.isTransfer = false;
    $scope.transferReward = function () {
        if ($scope.currentUser.accumulatedReward == 0) {
            alert("您的积分为0，无法兑换");
            return;
        } else if ($scope.currentUser.accumulatedReward < 500) {
            alert("您的积分未到500，暂时无法兑换");
            return;
        } else if ($scope.amount % 100 != 0) {
            alert("积分兑换必须是100的倍数");
            return;
        } else if ($scope.amount == 0 || typeof($scope.amount) != typeof(0) || $scope.amount < 0) {
            alert("请输入正确的兑换金额");
            return;
        } else {
            $scope.isLoading = true;
            $scope.promote = "正在处理，请稍候"
            $scope.isTransfer = true;
            $scope.currentUser.accumulatedReward -= $scope.amount;
            $scope.currentUser.rewardBalanceInDollar += $scope.amount / 100;
            $scope.currentUser.save(null, {
                success: function (user) {
                    var transaction = new YD.Transaction();
                    transaction.status = YD.Transaction.STATUS_CLAIM_REWARD;
                    transaction.amount = $scope.amount / 100;
                    transaction.notes = "YD币兑换";
                    var userPt = new YD.User();
                    userPt.id = $scope.currentUser.id;
                    transaction.user = userPt;
                    transaction.save(null, {
                        success: function (t) {
                            $scope.isLoading = false;
                            $scope.promote = "";
                            $scope.isTransfer = false;
                            $scope.reloadRewardRecord();
                            alert("兑换成功！");
                        },
                        error: function (t, error) {
                            alert("错误!" + error.message);
                        }
                    })
                }
            });
        }
    }
    $scope.reloadRewardRecord = function (index) {
        var query = new AV.Query(YD.Transaction);
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.Transaction.STATUS_CLAIM_REWARD, YD.Transaction.STATUS_CONSUME_YD_REWARD, YD.Transaction.STATUS_GET_YD_REWARD, YD.Transaction.STATUS_CREDIT_YD, YD.Transaction.STATUS_DEBIT_YD]);
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.find({
            success: function (list) {
                $scope.transactions = list;
                for (var i = 0; i < list.length; i++) {
                    var tmp = $scope.transactions[i].createdAt;
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                    if (tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes();
                    else
                        tmp_date += tmp.getMinutes();
                    $scope.transactions[i].createdAtToString = tmp_date;
                    if ($scope.transactions[i].status == YD.Transaction.STATUS_CLAIM_REWARD)
                        $scope.transactions[i].statusToString = "兑换";
                    else if ($scope.transactions[i].status == YD.Transaction.STATUS_CONSUME_YD_REWARD)
                        $scope.transactions[i].statusToString = $scope.transactions[i].notes;
                    else if ($scope.transactions[i].status == YD.Transaction.STATUS_GET_YD_REWARD)
                        $scope.transactions[i].statusToString = $scope.transactions[i].notes;
                    else if ($scope.transactions[i].status == YD.Transaction.STATUS_CREDIT_YD)
                        $scope.transactions[i].statusToString = $scope.transactions[i].notes;
                    else if ($scope.transactions[i].status == YD.Transaction.STATUS_DEBIT_YD)
                        $scope.transactions[i].statusToString = $scope.transactions[i].notes;
                }
                $scope.$apply();
            }
        });
    };
    $scope.reloadRewardCount = function () {
        var query = new AV.Query(YD.Transaction);
        query.equalTo("user", $scope.currentUser);
        query.containedIn("status", [YD.Transaction.STATUS_CLAIM_REWARD, YD.Transaction.STATUS_CONSUME_YD_REWARD, YD.Transaction.STATUS_GET_YD_REWARD, YD.Transaction.STATUS_CREDIT_YD, YD.Transaction.STATUS_DEBIT_YD]);
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.count({
            success: function (count) {
                $scope.tCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadRewardRecord($scope.currentPage - 1);
    }
    $scope.reloadRewardCount();
    $scope.$on('usercd', function () {
        $scope.searchDate = false;
        $scope.currentPage = 1;

        $scope.reloadRewardCount();
        $scope.reloadRewardRecord(0);
    });
    $scope.open1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1 = true;
    }
    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation()
        $scope.opened2 = true;
    }
    $scope.reloadSelectedTransaction = function () {
        if ($scope.currentUser.id != undefined) {
            if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
                $scope.searchName = false;
                $scope.searchDate = true;
                $scope.reloadRewardCount();
                $scope.reloadRewardRecord(0);
            } else {
                alert("请先选择日期")
            }
        }
    }

}]);
YundaApp.controller('AdminCtrl', function ($scope, $rootScope, $location) {

    $scope.oneAtATime = true
    $scope.openTab = {
        setE: false,
        setF: false,
        setG: false,
        setH: false
    }
    $scope.view_tab = "bb";
    $scope.openTab.setF = true;
    $scope.change_tab = function (tab) {
        if (tab == "aa" || tab == "ab" || tab == "ac") {
            $scope.openTab.setE = true
            $scope.openTab.setF = false
            $scope.openTab.setG = false
            $scope.openTab.setH = false
        } else if (tab == "ba" || tab == "bb" || tab == "bc" || tab == "bd") {
            $scope.openTab.setE = false
            $scope.openTab.setF = true
            $scope.openTab.setG = false
            $scope.openTab.setH = false
        } else if (tab == "ca" || tab == "cb" || tab == "cc") {
            $scope.openTab.setE = false
            $scope.openTab.setF = false
            $scope.openTab.setG = true
            $scope.openTab.setH = false
        } else if (tab == "da" || tab == "db" || tab == "dc") {
            $scope.openTab.setE = false
            $scope.openTab.setF = false
            $scope.openTab.setG = false
            $scope.openTab.setH = true
        }
        $scope.view_tab = tab;
        $rootScope.$broadcast('admin' + tab);
    }
    $scope.badgeAAdminCount = 0
    $scope.badgeBAdminCount = 0
    $scope.adminBadge = {}
    $scope.adminBadge.A = 0
    $scope.adminBadge.B = 0
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
    $scope.adminBadge.M = 0;
    $scope.adminBadge.W = 0;
    $scope.adminBadge.X = 0;
    $scope.adminBadge.Y = 0;
    $scope.isLoading = false
    $scope.promote = undefined
    $scope.showProgressBar = function (message) {
        $scope.isLoading = true
        $scope.promote = message
    }
    $scope.hideProgressBar = function () {
        $scope.isLoading = false
        $scope.promote = undefined
    }
})
YundaApp.controller('AdminFreightInArriveCtrl', function ($scope, $rootScope, $modal) {
    $scope.freightIn;
    var user;
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.reloadFreightIn = function (index) {
        var query = new AV.Query("FreightIn")
        query.exists("checkInfo");
        query.include("user");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("checkDate");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchRK) {
            query.equalTo("RKNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freightIn = list
                    for (var i = 0; i < $scope.freightIn.length; i++) {
                        $scope.freightIn[i].selection = false
                        var tmp = $scope.freightIn[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        if ($scope.freightIn[i].checkDate != undefined) {
                            var tmp = $scope.freightIn[i].checkDate;
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes()
                            else
                                tmp_date += tmp.getMinutes();
                            $scope.freightIn[i].checkDateToString = tmp_date;
                        }
                    }
                })
            }
        })
    };
    $scope.showFreightInDetail = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightInDetail',
            controller: 'FreightInDetailCtrl',
            scope: $scope,
            size: 'md',
            windowClass: 'center-modal',
            resolve: {
                freight: function () {
                    return f;
                }
            }
        });
    }
    $scope.$on('adminbz', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchRK = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;

        $scope.reloadCount();
        $scope.reloadFreightIn(0);
    });
    $scope.reloadCount = function () {
        var query = new AV.Query("FreightIn");
        query.exists("checkInfo");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchRK) {
            query.equalTo("RKNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.adminBadge.A = 0;
                $scope.freightCount = list.length;
                for (var i = 0; i < list.length; i++) {
                    var f = list[i];
                    if (f.status == 210) {
                        $scope.adminBadge.A++;
                    }
                }
                $scope.$apply();
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadFreightIn($scope.currentPage - 1);
    }
    $scope.reloadCount();
    $scope.searchingRK = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CHECK_PACKAGE) {
            alert("您没有权限");
            return;
        }
        $scope.searchName = false;
        $scope.searchRK = true;
        $scope.reloadCount();
        $scope.reloadFreightIn(0);
    }
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CHECK_PACKAGE) {
            alert("您没有权限");
            return;
        }
        $scope.searchRK = false;
        $scope.searchName = true;
        $scope.reloadCount();
        $scope.reloadFreightIn(0);
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CHECK_PACKAGE) {
        return;
    } else {
        $scope.reloadFreightIn(0);
    }
    $scope.addNotes = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        })
    }
    $scope.chargingCheck = function (freightIn) {
        $scope.isLoading = true;
        $scope.promote = "正在处理...";
        var amount = $scope.systemSetting.checkPackageCharge;
        AV.Cloud.run('chargingUserWithoutReward', {
            amount: amount,
            userId: freightIn.user.id,
            notes: "验货收费",
            RKNumber: freightIn.RKNumber,
            //YDNumber: 0,
            status: YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE
        }, {
            success: function () {
                freightIn.isCheckingCharged = true;
                freightIn.save(null, {
                    success: function (f) {
                        $scope.isLoading = false;
                        $scope.promote = "";
                        $scope.reloadFreightIn(0);
                        $scope.$apply();
                        alert("操作成功！");
                    },
                    error: function (t, error) {
                        alert("错误! " + error.message);
                    }
                });
            },
            error: function (error) {
                alert("失败!" + error.message);
                $scope.isLoading = false;
                $scope.promote = "";
                $scope.$apply();
            }
        });
    };
    $scope.freightInDelivered = function (freightIn) {
        freightIn.status = YD.FreightIn.STATUS_ARRIVED
        freightIn.save(null, {
            success: function (f) {
                alert("已更改状态！");
                $scope.reloadFreightIn(0);
            },
            error: function (f, error) {
                alert("出错！" + error.message)
            }
        })
    }
    $scope.freightInAddInfo = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addCheckingInfo',
            controller: 'CheckingInfoCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                freightIn: function () {
                    return freightIn
                }
            },
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (freightIn) {
            freightIn.status = YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE
            freightIn.isChecking = false;
            freightIn.save(null, {
                success: function (f) {
                    alert("确认成功");
                },
                error: function (f, error) {
                    alert("错误!" + error.message);
                }
            });
        });
    }
    $scope.showDetails = function (freight) {
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
});
YundaApp.controller("AddNotesCtrl", function ($scope, $modalInstance, freight_obj) {
    $scope.freight = freight_obj.freight
    var subClass
    if (freight_obj.type == "freightIn") {
        subClass = YD.FreightIn
    } else {
        subClass = YD.Freight
    }
    $scope.save = function () {
        $scope.freight.save(null, {
            success: function (f) {
                $modalInstance.close()
            },
            error: function (f, error) {
                $modalInstance.dismiss()
            }
        })
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller("CheckingInfoCtrl", function ($scope, $modalInstance, freightIn) {
    $scope.freightIn = freightIn
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.save = function () {
        $modalInstance.close($scope.freightIn);
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller("ShowDetailsCtrl", function ($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller("AdminSystemCtrl", function ($scope, $rootScope) {
    $scope.newChannel = {};
    $scope.newAddress = {};
    $scope.confirm = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_SETTING) {
            alert("您没有权限");
            return;
        }
        $scope.systemSetting.save(null, {
            success: function (s) {
                alert("修改已保存");
                $scope.reloadSystemSetting();
            },
            error: function (s, error) {
                alert("错误" + error.message);
            }
        });
    }
    $scope.addNewAddress = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_SETTING) {
            alert("您没有权限");
            return;
        }
        var obj = {
            name: $scope.newAddress.name,
            street: $scope.newAddress.street,
            city: $scope.newAddress.city,
            state: $scope.newAddress.state,
            zipCode: $scope.newAddress.zipCode
        }
        var setting = new YD.SystemSetting();
        setting.id = "557a8a2fe4b0fe935ead7847";
        setting.addUnique("addressList", $scope.newAddress);
        setting.save(null, {
            success: function (s) {
                alert("添加成功");
                $scope.newAddress = {};
                $scope.reloadSystemSetting();
            }
        });
    };
    $scope.addNewChannel = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_SETTING) {
            alert("您没有权限");
            return;
        }
        var setting = new YD.SystemSetting();
        setting.id = "557a8a2fe4b0fe935ead7847";
        setting.addUnique("pricing", $scope.newChannel);
        setting.save(null, {
            success: function (s) {
                alert("添加成功");
                $scope.newChannel = {};
                $scope.reloadSystemSetting();
                $scope.$apply();
            }
        });
    };
    $scope.saveAddress = function (address) {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_SETTING) {
            alert("您没有权限");
            return;
        }
        var setting = new YD.SystemSetting();
        setting.id = "557a8a2fe4b0fe935ead7847";
        setting.save(null, {
            success: function (s) {
                alert("地址删除成功");
                $scope.reloadSystemSetting();
            }
        });
    }
    $scope.deleteChannel = function (channel) {
        if (confirm("是否确定删除?") == true) {
            var setting = new YD.SystemSetting();
            setting.id = "557a8a2fe4b0fe935ead7847";
            setting.fetch({
                success: function (setting) {
                    for (var i = 0; i < setting.pricing.length; i++) {
                        if (setting.pricing[i].name == channel.name) {
                            setting.pricing.splice(i, 1);
                        }
                    }
                    setting.save(null, {
                        success: function (s) {
                            alert("渠道删除成功");
                            $scope.reloadSystemSetting();
                        }
                    });
                },
                error: function (setting, error) {
                }
            });
        }
    }
    $scope.deleteAddress = function (address) {
        if (confirm("是否确定删除?") == true) {
            var setting = new YD.SystemSetting();
            setting.id = "557a8a2fe4b0fe935ead7847";
            setting.fetch({
                success: function (setting) {
                    for (var i = 0; i < setting.addressList.length; i++) {
                        if (setting.addressList[i].name == address.name && setting.addressList[i].street == address.street) {
                            setting.addressList.splice(i, 1);
                        }
                    }
                    setting.save(null, {
                        success: function (s) {
                            alert("删除成功");
                            $scope.reloadSystemSetting();
                        }
                    });
                }
            });
        }
    }
})
YundaApp.controller("AdminNewsCtrl", ["$scope", "$rootScope", "$modal", function ($scope, $rootScope, $modal) {
    $scope.reloadNews = function () {
    }
    $scope.newNews = new YD.News()
    $scope.addNews = function () {
        if ($scope.newNews.title == undefined || $scope.newNews.link == undefined || $scope.newNews.title == '' || $scope.newNews.link == '') {
            alert("请先填写好新闻的标题和链接");
            return
        } else {
            $scope.newNews.save(null, {
                success: function (n) {
                    alert("添加成功！")
                    $rootScope.reloadNews()
                    $scope.newNews = new YD.News()
                },
                error: function (n, error) {
                    alert("出错！" + error.message)
                }
            })
        }
    }
    $scope.addEnter = function() {
        $scope.newNews.title += '\n';
        console.log("added: ", $scope.newNews.title);
    }
    $scope.editNews = function (news) {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_NEWS) {
            alert("您没有权限");
            return;
        }
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
        })
    }
    $scope.confirmDeleteNews = function (news) {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_NEWS) {
            alert("您没有权限");
            return;
        }
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
    $scope.deleteNews = function (news) {
        news.destroy({
            success: function (n) {
                $rootScope.reloadNews()
                alert("删除成功！")
            },
            error: function (n, error) {
                alert("出错！" + error.message)
            }
        })
    }
}])
YundaApp.controller('EditNewsCtrl', ["$scope", "$modalInstance", "news", function ($scope, $modalInstance, news) {
    $scope.news = news;
    $scope.save = function () {
        $scope.news.save(null, {
            success: function (n) {
                $modalInstance.close()
            },
            error: function (n, error) {
                alert("错误！" + error.message)
            }
        })
    }
    $scope.addEnter = function() {
        $scope.news.title += '\n';
    }
    $scope.cancel = function () {
        $modalInstance.dismiss()
    }
}])
YundaApp.controller('AdminFreightInConfirmCtrl', function ($scope, $rootScope, $modal) {
    $scope.freightIn;
    $scope.Math = Math;
    $scope.showDetails = function (freight) {
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
    $scope.reloadFreightIn = function (index) {
        var query = new AV.Query(YD.FreightIn);
        query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE]);
        query.equalTo("isHidden", false);
        query.notEqualTo("isSplit", true);
        query.notEqualTo("isSplitPremium", true);
        query.notEqualTo("isMerged", true);

        query.include("user");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        //query.descending("createdAt");
        //query.addAscending("status");
        //query.ascending("status");
        //query.addDescending("createdAt");
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTN) {
            query.equalTo("trackingNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.freightIn = list;
                $scope.$apply(function () {
                    for (var i = 0; i < $scope.freightIn.length; i++) {
                        $scope.freightIn[i].selection = false
                        var tmp = $scope.freightIn[i].createdAt;
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes();
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freightIn[i].createdAtToString = tmp_date;
                        if ($scope.freightIn[i].confirmDate) {
                            var tmp = $scope.freightIn[i].confirmDate;
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes();
                            else
                                tmp_date += tmp.getMinutes();
                            $scope.freightIn[i].confirmDateToString = tmp_date;
                        }
                    }
                });
            }
        });
    };
    $scope.freightCount = $scope.adminBadge.B = 0;
    $scope.reloadFreightCount = function () {
        var isSkipK = false;
        var query = new AV.Query(YD.FreightIn);
        query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE]);
        query.equalTo("isHidden", false);
        query.notEqualTo("isSplit", true);
        query.notEqualTo("isSplitPremium", true);
        query.notEqualTo("isMerged", true);
        //query.descending("createdAt");
        //query.addAscending("status");
        //query.ascending("status");
        //query.addDescending("createdAt");
        query.descending("createdAt");
        if (isSkipK) {
            query.skip(1000);
        }
        query.limit(1000);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTN) {
            query.equalTo("trackingNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                console.log("List length: " + list.length);
                $scope.freightCount = list.length;
                $scope.adminBadge.B = list.length;

                if (list.length >= 1000) {
                    isSkipK = true;
                    $scope.reloadFreightCount();
                } else {
                    isSkipK = false;
                }
                $scope.$apply();
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadFreightIn($scope.currentPage - 1);
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_FREIGHT) {
        return;
    } else {
        $scope.freightCount = 0;
        $scope.adminBadge.B = 0;
        $scope.reloadFreightCount();
        $scope.reloadFreightIn(0);

    }
    ;
    $scope.$on('adminba', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchTN = false;
        $scope.queryNumber = '';
        $scope.freightCount = 0;
        $scope.adminBadge.B = 0;
        $scope.currentPage = 1;

        $scope.reloadFreightCount();
        $scope.reloadFreightIn(0);
    });
    $scope.addNotes = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        })
    }
    $scope.searchingTN = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_FREIGHT) {
            alert("您没有权限" + $scope.currentUser.role == YD.User.ROLE_DEVELOPER);
            return;
        }
        $scope.searchTN = true;
        $scope.searchName = false;
        $scope.freightCount = 0;
        $scope.adminBadge.B = 0;
        $scope.reloadFreightCount();
        $scope.reloadFreightIn(0);
    };
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_FREIGHT) {
            alert("您没有权限" + $scope.currentUser.role == YD.User.ROLE_DEVELOPER);
            return;
        }
        $scope.searchTN = false;
        $scope.searchName = true;
        $scope.freightCount = 0;
        $scope.adminBadge.B = 0;
        $scope.reloadFreightCount();
        $scope.reloadFreightIn(0);
    };
    $scope.deleteFreightIn = function (f) {
        var r = confirm("是否确认删除运单? (物品入库已超过60天)");
        if (!r) {
        } else {
            f.status = YD.FreightIn.STATUS_CANCELED;
            f.deleteDate = new Date();
            f.save(null, {
                success: function () {
                    $scope.reloadFreightIn();
                    alert("删除成功");
                },
                error: function (f, error) {
                    alert(error.message);
                }
            });
        }
    }
});

YundaApp.controller('AdminFreightInConfirmRecordCtrl', function ($scope, $rootScope, $modal) {
    $scope.freightIn;
    $scope.Math = Math;
    $scope.showDetails = function (freight) {
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
    $scope.reloadFreightIn = function (index) {
        var query = new AV.Query(YD.FreightIn);
        query.containedIn("status", [YD.FreightIn.STATUS_CONFIRMED, YD.FreightIn.STATUS_FINISHED, YD.FreightIn.STATUS_SPEED_MANUAL]);
        query.equalTo("isHidden", false);
        query.notEqualTo("isSplit", true);
        query.notEqualTo("isSplitPremium", true);
        query.notEqualTo("isMerged", true);

        query.include("user");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        //query.descending("createdAt");
        //query.addAscending("status");
        //query.ascending("status");
        //query.addDescending("createdAt");
        query.descending("createdAt");

        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTN) {
            if($scope.queryNumber.startsWith('RK')) {
                query.equalTo("RKNumber", $scope.queryNumber);

            } else {
                query.equalTo("trackingNumber", $scope.queryNumber);
            }
        }
        query.find({
            success: function (list) {
                $scope.freightIn = list;
                $scope.$apply(function () {
                    for (var i = 0; i < $scope.freightIn.length; i++) {
                        $scope.freightIn[i].selection = false;
                        var tmp = $scope.freightIn[i].createdAt;
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes();
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freightIn[i].createdAtToString = tmp_date;
                        //if ($scope.freightIn[i].status == 110 || $scope.freightIn[i].status == 990) {
                        //    var tmp = $scope.freightIn[i].createdAt;
                        //    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        //    if (tmp.getMinutes() < 10)
                        //        tmp_date += "0" + tmp.getMinutes();
                        //    else
                        //        tmp_date += tmp.getMinutes();
                        //    $scope.freightIn[i].confirmDateToString = tmp_date;
                        //} else{
                            if ($scope.freightIn[i].confirmDate != undefined) {
                                var tmp = $scope.freightIn[i].confirmDate;
                                var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                                if (tmp.getMinutes() < 10)
                                    tmp_date += "0" + tmp.getMinutes();
                                else
                                    tmp_date += tmp.getMinutes();
                                $scope.freightIn[i].confirmDateToString = tmp_date;
                            } else {
                                $scope.freightIn[i].confirmDateToString = '未确认';
                            }


                    }
                });
            }
        });
    };
    //$scope.freightCount = $scope.adminBadge.B = 0;
    $scope.reloadFreightCount = function () {
        var isSkipK = false;
        var query = new AV.Query(YD.FreightIn);
        query.containedIn("status", [YD.FreightIn.STATUS_CONFIRMED, YD.FreightIn.STATUS_FINISHED, YD.FreightIn.STATUS_SPEED_MANUAL, YD.FreightIn.STATUS_CANCELED]);
        query.equalTo("isHidden", false);
        query.notEqualTo("isSplit", true);
        query.notEqualTo("isSplitPremium", true);
        query.notEqualTo("isMerged", true);
        //query.descending("createdAt");
        //query.addAscending("status");
        //query.ascending("status");
        //query.addDescending("createdAt");
        query.descending("createdAt");
        if (isSkipK) {
            query.skip(1000);
        }
        query.limit(1000);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTN) {
            query.equalTo("trackingNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                console.log("List length: " + list.length);
                $scope.freightCount = list.length;
                //$scope.adminBadge.B += list.length;

                if (list.length >= 1000) {
                    isSkipK = true;
                    $scope.reloadFreightCount();
                } else {
                    isSkipK = false;
                }
                $scope.$apply();
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadFreightIn($scope.currentPage - 1);
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_FREIGHT) {
        return;
    } else {
        $scope.freightCount = 0;
        $scope.adminBadge.B = 0;
        $scope.reloadFreightCount();
        $scope.reloadFreightIn(0);

    }
    ;
    $scope.$on('adminbw', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchTN = false;
        $scope.queryNumber = '';
        $scope.freightCount = 0;
        $scope.adminBadge.B = 0;
        $scope.currentPage = 1;

        $scope.reloadFreightCount();
        $scope.reloadFreightIn(0);
    });
    $scope.addNotes = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        })
    }
    $scope.searchingTN = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_FREIGHT) {
            alert("您没有权限" + $scope.currentUser.role == YD.User.ROLE_DEVELOPER);
            return;
        }
        $scope.searchTN = true;
        $scope.searchName = false;
        $scope.freightCount = 0;
        $scope.adminBadge.B = 0;
        $scope.reloadFreightCount();
        $scope.reloadFreightIn(0);
    };
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_FREIGHT) {
            alert("您没有权限" + $scope.currentUser.role == YD.User.ROLE_DEVELOPER);
            return;
        }
        $scope.searchTN = false;
        $scope.searchName = true;
        $scope.freightCount = 0;
        $scope.adminBadge.B = 0;
        $scope.reloadFreightCount();
        $scope.reloadFreightIn(0);
    };

});

YundaApp.controller("AdminFreightConfirmCtrl", function ($scope, $rootScope, $window, $modal, $filter) {
    $scope.currentPage = {
        Normal: 0,
        Merge: 0,
        Split: 0,
        SpeedManual: 0

    };
    $scope.showDetails = function (freight) {
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
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightFullDetail',
            controller: 'FreightFullDetailCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                },
                isFromCustomer: function () {
                    return false;
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.showDetailsWithMerge = function (freight) {
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
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
                        statusString += "等待加固; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
                        statusString += "等待去发票; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
                        statusString += "等待开箱检查; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
                        statusString += "等待普通分箱; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM) {
                        statusString += "等待精确分箱; "
                    }
                    if (statusList[j] == YD.Freight.STATUS_PENDING_MERGE_PACKAGE) {
                        statusString += "等待合包; "
                        $scope.freight[i].isMerge = true
                    }
                }
            }
            $scope.freight[i].statusToString = statusString
        }
    }
    $scope.reloadFreight = function () {
        var query = new AV.Query(YD.Freight)
        query.equalTo("status", YD.Freight.STATUS_INITIALIZED);
        query.include("user");
        query.include("address");
        query.include(["address.identity"]);
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freight = list;
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freight[i].createdAtToString = tmp_date
                        if (!$scope.freight[i].isOperated) {
                            $scope.freight[i].printDisabled = true;
                        } else {
                            $scope.freight[i].printDisabled = false;
                        }
                        $scope.freight[i].selection = false;
                    }
                    $scope.getStatus();
                    $scope.adminBadge.C = list.length;
                    $scope.normalFreights = $filter('normalPackageFilter')($scope.freight);
                    $scope.splitFreights = $filter('splitPackageFilter')($scope.freight);
                    $scope.mergeFreights = $filter('filter')($scope.freight, {
                        isMerge: true
                    }, true);
                    $scope.speedManualFreights = $filter('filter')($scope.freight, {
                        isSpeedManual: true
                    }, true);
                    console.log("speed manual freights: ", $scope.speedManualFreights);
                    $scope.reloadNormal(0);
                    $scope.reloadSplit(0);
                    $scope.reloadMerge(0);
                    $scope.reloadSpeedManual(0);

                });
            },
            error: function (error) {
            }
        });
    };
    $scope.setPageNormal = function () {
        $scope.currentPage.Normal = $scope.inputPage;
        $scope.reloadNormal($scope.currentPage.Normal - 1);
    };
    $scope.setPageSplit = function () {
        $scope.currentPage.Split = $scope.inputPage;
        $scope.reloadSplit($scope.currentPage.Split - 1);
    };
    $scope.setPageMerge = function () {
        $scope.currentPage.Merge = $scope.inputPage;
        $scope.reloadMerge($scope.currentPage.Merge - 1);
    };
    $scope.setPageSpeedManual = function () {
        $scope.currentPage.SpeedManual = $scope.inputPage;
        $scope.reloadSpeedManual($scope.currentPage.SpeedManual - 1);
    };
    $scope.reloadNormal = function (index) {
        $scope.showNormal = [];
        for (var i = index * $scope.LIMIT_NUMBER; i < $scope.LIMIT_NUMBER * (index + 1); i++) {
            if ($scope.normalFreights[i]) {
                var f = $scope.normalFreights[i];
                $scope.showNormal.push(f);
            }
        }
    };
    $scope.reloadSplit = function (index) {
        $scope.showSplit = [];
        for (var i = index * $scope.LIMIT_NUMBER; i < $scope.LIMIT_NUMBER * (index + 1); i++) {
            if ($scope.splitFreights[i]) {
                var f = $scope.splitFreights[i];
                $scope.showSplit.push(f);
            }
        }
    };
    $scope.reloadMerge = function (index) {
        $scope.showMerge = [];
        for (var i = index * $scope.LIMIT_NUMBER; i < $scope.LIMIT_NUMBER * (index + 1); i++) {
            if ($scope.mergeFreights[i]) {
                var f = $scope.mergeFreights[i];
                $scope.showMerge.push(f);
            }
        }
    };
    $scope.reloadSpeedManual = function (index) {
        $scope.showSpeedManual = [];
        for (var i = index * $scope.LIMIT_NUMBER; i < $scope.LIMIT_NUMBER * (index + 1); i++) {
            if ($scope.speedManualFreights[i]) {
                var f = $scope.speedManualFreights[i];
                $scope.showSpeedManual.push(f);
            }
        }
    };
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_PENDING) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadFreight();
    }
    $scope.$on('adminbb', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchYD = false;
        $scope.queryNumber = '';
        $scope.currentPage.Normal = 1;
        $scope.currentPage.Merge = 1;
        $scope.currentPage.Split = 1;

        $scope.reloadFreight();
    });
    $scope.searchingYD = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_PENDING) {
            alert("您没有权限");
            return;
        }
        $scope.searchYD = true;
        $scope.searchName = false;
        $scope.reloadFreight();
    }
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_PENDING) {
            alert("您没有权限");
            return;
        }
        $scope.searchYD = false;
        $scope.searchName = true;
        $scope.reloadFreight();
    }
    $scope.showDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showFreightNumbers',
            controller: 'ShowFreightNumbersCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                freight: function () {
                    return f;
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.printAll = function () {
        $rootScope.freightList = []
        for (var i = 0; i < $scope.freight.length; i++) {
            if ($scope.freight[i].selection == true) {
                $rootScope.freightList.push($scope.freight[i])
            }
        }
        $scope.reloadFreight()
    }
    $scope.printFreight = function (freight) {
        $rootScope.printFreight = {};
        $rootScope.printFreight = freight;
    }
    $scope.addNotes = function (freightIn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        })
    }
    $scope.showIdentityDetails = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_identityDetail',
            controller: 'IdentityDetailCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return freight
                }
            },
            windowClass: 'center-modal'
        })
    };
    $scope.confirmFreightOpt = function (freight) {
        freight.isOperated = true;
        freight.printDisabled = false;
        freight.confirmDate = new Date();
        // Now this functioning happens when freight is generated
        // But don't remove yet.
        /* if (freight.isSplit || freight.isSplitPremium) {
             var RKNumber = freight.RKNumber.substr(0, 12);
             var query = new AV.Query(YD.FreightIn);
             query.startsWith("RKNumber", RKNumber);
             query.find({
                 success: function (list) {
                     for (var i = 0; i < list.length; i++) {
                         list[i].isOperating = true;
                     }
                     AV.Object.saveAll(list, {
                         success: function (list) {
                             freight.save(null, {
                                 success: function (f) {
                                     alert("已确认操作");
                                 },
                                 error: function (f, error) {
                                     alert("错误: " + error.message);
                                 }
                             });
                         }
                     });
                 }
             });
         } else {
             freight.save(null, {
                 success: function (f) {
                     alert("已确认操作");
                 },
                 error: function (f, error) {
                     alert("错误: " + error.message);
                 }
             });
         }*/
        freight.save(null, {
            success: function (f) {
                alert("已确认操作");
            },
            error: function (f, error) {
                alert("错误: " + error.message);
            }
        });
    };
    $scope.confirmAllFreightOpt = function () {
        var list = [];
        for (var i = 0; i < $scope.freight.length; i++) {
            if ($scope.freight[i].selection) {
                $scope.freight[i].isOperated = true;
                $scope.freight[i].printDisabled = false;
                $scope.freight[i].confirmDate = new Date();
                list.push($scope.freight[i]);
            }
        }
        AV.Object.saveAll(list, {
            success: function (list) {
            }
        });
    };
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showOperationDetails',
            controller: 'ShowOperationDetailsCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                }
            },
            windowClass: 'center-modal'
        });
    }
})
YundaApp.controller('ShowOperationDetailsCtrl', ["$scope", "$modalInstance", "freight", function ($scope, $modalInstance, freight) {
    $scope.freight = freight;
    $scope.close = function () {
        $modalInstance.dismiss();
    }
}]);
YundaApp.controller('ShowFreightNumbersCtrl', ["$scope", "$modalInstance", "freight", function ($scope, $modalInstance, freight) {
    $scope.freight = freight;
    $scope.close = function () {
        $modalInstance.dismiss();
    }
}])
YundaApp.controller('AdminFreightFinishCtrl', function ($scope, $modal) {
    $scope.showDetails = function (freight) {
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
        var query = new AV.Query(YD.Freight)
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
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freight[i].updatedAt = tmp_date
                    }
                    $scope.adminBadge.D = list.length
                })
            },
            error: function (error) {
            }
        })
    }
    $scope.reloadFreight()
    $scope.addNotes = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        })
    }
})
YundaApp.controller('IdentityDetailCtrl', ["$scope", "$modalInstance", "freight", function ($scope, $modalInstance, freight) {
    $scope.freight = freight;
    $scope.close = function () {
        $modalInstance.dismiss();
    }
}]);
YundaApp.controller('ShowConsumeDetailsCtrl', ["$scope", "$modalInstance", "freight", function ($scope, $modalInstance, freight) {
    $scope.isLoading = true;
    $scope.promote = "正在读取...";
    var query1 = new AV.Query(YD.Transaction);
    query1.equalTo("YDNumber", freight.YDNumber);
    var newQ = new AV.Query(YD.Transaction);
    newQ.equalTo("RKNumber", freight.RKNumber);
    var query = AV.Query.or(query1, newQ);
    query.find({
        success: function (list) {
            $scope.transactions = list;
            for (var i = 0; i < list.length; i++) {
                var tmp = $scope.transactions[i].createdAt
                var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                if (tmp.getMinutes() < 10)
                    tmp_date += "0" + tmp.getMinutes()
                else
                    tmp_date += tmp.getMinutes();
                $scope.transactions[i].createdAtToString = tmp_date
            }
            $scope.isLoading = false;
            $scope.promote = "";
            alert("有" + list.length + "个结果");
            $scope.$apply();
        },
        error: function (error) {
            alert("错误" + error.message);
            $modalInstance.dismiss();
        }
    });
    $scope.close = function () {
        $modalInstance.dismiss();
    }
}]);
YundaApp.controller('AdminManualCtrl', ["$scope", "$modal", function ($scope, $modal) {
    $scope.showDetails = function (freight) {
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
        });
    };

    $scope.reloadManual = function (index) {
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("status", YD.FreightIn.STATUS_MANUAL);
        query.include("user");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTN) {
            query.equalTo("trackingNumber", $scope.queryNumber);
        }
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
                    $scope.freights[i].createdAtToString = tmp_date
                }
                $scope.$apply();
            }
        });
    };
    $scope.reloadManual(0);
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadManual($scope.currentPage - 1);
    }
    $scope.reloadCount = function () {
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("status", YD.FreightIn.STATUS_MANUAL);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTN) {
            query.equalTo("trackingNumber", $scope.queryNumber);
        }
        query.count({
            success: function (count) {
                $scope.freightCount = $scope.adminBadge.Y = count;
            }
        });
    };
    $scope.reloadCount();
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
            alert("您没有权限");
            return;
        }
        $scope.searchTN = false;
        $scope.searchName = true;
        $scope.reloadCount();
        $scope.reloadManual(0);
    };
    $scope.searchingTN = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
            alert("您没有权限");
            return;
        }
        $scope.searchTN = true;
        $scope.searchName = false;
        $scope.reloadCount();
        $scope.reloadManual(0);
    },
        $scope.$on('adminby', function (event, data) {
            $scope.currentPage = 1;

            $scope.reloadCount();
            $scope.reloadManual(0);
        });
    $scope.deleteFreight = function (f) {
        var r = confirm("是否确认删除?");
        if (!r) {
        } else {
            f.destroy({
                success: function (f) {
                    $scope.reloadCount();
                    $scope.reloadManual(0);
                    alert("删除成功！")
                },
                error: function (f, error) {
                    alert("出错！" + error.message)
                }
            });
        }
    }
}])
YundaApp.controller('AdminSpeedManualCtrl', ["$scope", "$modal", function ($scope, $modal) {
    angular.extend($scope, {
        showOperationDetails: function (f) {
            var queryNumber = f.RKNumber;
            var query = new AV.Query(YD.Freight);
            query.equalTo("RKNumber", queryNumber);
            query.find({
                success: function (list) {
                    if (list.length > 0) {
                        var f = list[0];
                        var modalInstance = $modal.open({
                            templateUrl: 'partials/modal_freightFullDetail',
                            controller: 'FreightFullDetailCtrl',
                            scope: $scope,
                            size: 'lg',
                            resolve: {
                                freight: function () {
                                    return f;
                                },
                                isFromCustomer: function () {
                                    return false;
                                }
                            },
                            windowClass: 'center-modal'
                        });
                    } else {
                        alert("找不到运单详情");
                        return;
                    }
                }
            });

        },
        reloadSpeedFreight: function (index) {
            var query = new AV.Query(YD.Freight);
            query.equalTo("status", YD.Freight.STATUS_SPEED_MANUAL);
            query.include("user");
            query.limit($scope.LIMIT_NUMBER);
            query.skip($scope.LIMIT_NUMBER * index);
            query.descending("createdAt");
            if ($scope.searchName) {
                var innerQuery = new AV.Query(YD.User);
                innerQuery.equalTo("stringId", $scope.queryString);
                query.matchesQuery("user", innerQuery);
            }
            if ($scope.searchTN) {
                query.equalTo("trackingNumber", $scope.queryNumber);
            }
            query.find({
                success: function (list) {
                    $scope.freights = list;
                    for (var i = 0; i < $scope.freights.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freights[i].createdAtToString = tmp_date
                    }
                    $scope.$apply();
                },
                error: function (error) {
                    alert("闪运读取错误!" + error.message);
                }
            });
        },
        reloadFreightCount: function () {
            var query = new AV.Query(YD.Freight);
            query.equalTo("status", YD.Freight.STATUS_SPEED_MANUAL);
            if ($scope.searchName) {
                var innerQuery = new AV.Query(YD.User);
                innerQuery.equalTo("stringId", $scope.queryString);
                query.matchesQuery("user", innerQuery);
            }
            if ($scope.searchTN) {
                query.equalTo("trackingNumber", $scope.queryNumber);
            }
            query.count({
                success: function (count) {
                    $scope.adminBadge.X = $scope.freightCount = count;
                }
            });
        },
        setPage: function () {
            $scope.currentPage = $scope.inputPage;
            $scope.reloadSpeedFreight($scope.currentPage - 1);
        },
        searching: function () {
            if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
                alert("您没有权限");
                return;
            }
            $scope.searchTN = false;
            $scope.searchName = true;
            $scope.reloadFreightCount();
            $scope.reloadSpeedFreight(0);
        },
        searchingTN: function () {
            if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
                alert("您没有权限");
                return;
            }
            $scope.searchTN = true;
            $scope.searchName = false;
            $scope.reloadFreightCount();
            $scope.reloadSpeedFreight(0);
        },
        showDetails: function (freight) {
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
            });
        },
        deleteFreight: function (f) {
            var r = confirm("确认彻底删除?");
            if (!r) {
                return;
            } else {
                var RKNumber = f.RKNumber;
                var query = new AV.Query(YD.FreightIn);
                query.equalTo("RKNumber", RKNumber);
                console.log("RKNUmber: " + RKNumber);
                query.first({
                    success: function (freight) {
                        console.log("found freightIn, " + freight.RKNumber);
                        freight.destroy({
                            success: function () {
                                f.destroy({
                                    success: function () {
                                        $scope.reloadFreightCount();
                                        $scope.reloadSpeedFreight(0);
                                        alert("删除运单成功");
                                    }
                                });
                            },
                            error: function (f, error) {
                                $scope.reloadFreightCount();
                                $scope.reloadSpeedFreight(0);
                                alert("错误!" + error.message);
                            }
                        });
                    },
                    error: function(error) {
                        console.log("ERROR: " + error.message);
                        alert("找不到包裹，请重试");

                    }
                });

            }
        }
    });
    $scope.$on('adminbx', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchTN = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;

        $scope.reloadFreightCount();
        $scope.reloadSpeedFreight(0);
    });
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadFreightCount();
        $scope.reloadSpeedFreight(0);
    }
}]);
YundaApp.controller('AdminFreightPaidCtrl', function ($scope, $rootScope, $modal) {
    $scope.showDetails = function (freight) {
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
        });
    };
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_print',
            controller: 'FreightFullDetailCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                },
                isFromCustomer: function () {
                    return false;
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.showConsumeDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_showConsumeDetails',
            controller: 'ShowConsumeDetailsCtrl',
            scope: $scope,
            size: 'md',
            resolve: {
                freight: function () {
                    return f
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.reloadPaidFreight = function (index) {
        var query = new AV.Query(YD.Freight)
        query.containedIn("status", [YD.Freight.STATUS_REJECTED, YD.Freight.STATUS_PENDING_DELIVERY]);
        query.include("user")
        query.include("address")
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("status");
        query.addDescending("updatedAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freight = list
                    for (var i = 0; i < $scope.freight.length; i++) {
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10) {
                            tmp_date += "0" + tmp.getMinutes();
                        }
                        else {
                            tmp_date += tmp.getMinutes();
                        }
                        $scope.freight[i].delivery = tmp_date;
                        if ($scope.freight[i].operateDate) {
                            var tmp = $scope.freight[i].operateDate;
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes();
                            else
                                tmp_date += tmp.getMinutes();
                            $scope.freight[i].operateDateToString = tmp_date;
                        }

                        $scope.freight[i].selection = false;
                    }
                })
            },
            error: function (error) {
            }
        })
    }
    $scope.reloadFreightCount = function () {
        var query = new AV.Query(YD.Freight)
        query.containedIn("status", [YD.Freight.STATUS_REJECTED, YD.Freight.STATUS_PENDING_DELIVERY]);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.count({
            success: function (count) {
                $scope.adminBadge.E = $scope.freightCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadPaidFreight($scope.currentPage - 1);
    }
    $scope.$on('adminbd', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchYD = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;

        $scope.reloadFreightCount();
        $scope.reloadPaidFreight(0);
    });
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_DELIVERY) {
            alert("您没有权限");
            return;
        }
        $scope.searchYD = false;
        $scope.searchName = true;
        $scope.reloadFreightCount();
        $scope.reloadPaidFreight(0);
    }
    $scope.searchingYD = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_DELIVERY) {
            alert("您没有权限");
            return;
        }
        $scope.searchYD = true;
        $scope.searchName = false;
        $scope.reloadFreightCount();
        $scope.reloadPaidFreight(0);
    }
    $scope.addNotes = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        })
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_DELIVERY) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadFreightCount();
        $scope.reloadPaidFreight(0);
    }
    $scope.isActing = false;
    $scope.confirmDelivery = function (f) {
        $scope.isActing = true;
        f.status = YD.Freight.STATUS_DELIVERING;
        f.shipping = new YD.Shipping();
        var tmp = new Date();
        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
        if (tmp.getMinutes() < 10)
            tmp_date += "0" + tmp.getMinutes()
        else
            tmp_date += tmp.getMinutes();
        f.shipping.delivery = f.delivery; // on the way to airport
        f.shipping.delivering = tmp_date; // to china
        //f.shipping = ship;
        f.shipping.YDNumber = f.YDNumber;
        f.shipping.save(null, {
            success: function () {
                f.save(null, {
                    success: function (f) {
                        alert("发货成功");
                        $scope.reloadFreightCount();
                        $scope.reloadPaidFreight($scope.currentPage - 1);
                        $scope.$apply(function () {
                            $scope.isActing = false;
                        });
                    },
                    error: function (f, error) {
                        alert("错误" + error.message);
                        $scope.$apply(function () {
                            $scope.isActing = false;
                        });
                    }
                });
            }
        });
    }
})
YundaApp.controller('AdminFreightClearCtrl', function ($scope, $modal) {
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightFullDetail',
            controller: 'FreightFullDetailCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                },
                isFromCustomer: function () {
                    return false;
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.showDetails = function (freight) {
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
        });
    }
    var clearList = []
    $scope.reloadDeliveryFreight = function (index) {
        var query = new AV.Query(YD.Freight)
        query.equalTo("status", YD.Freight.STATUS_DELIVERING)
        query.include("user")
        query.include("address");
        query.include("shipping");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");

        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freight = list
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freight[i].updatedAt = tmp_date
                        $scope.freight[i].selection = false
                    }
                });
            },
            error: function (error) {
            }
        })
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadDeliveryFreight($scope.currentPage - 1);
    }
    $scope.reloadCount = function () {
        var query = new AV.Query(YD.Freight);
        query.equalTo("status", YD.Freight.STATUS_DELIVERING);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.count({
            success: function (count) {
                $scope.adminBadge.F = $scope.freightCount = count;
            }
        });
    };
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CLEAR) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadCount();
        $scope.reloadDeliveryFreight();
    }
    ;
    $scope.$on('adminbe', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchYD = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;

        $scope.reloadCount();
        $scope.reloadDeliveryFreight(0);
    });
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CLEAR) {
            alert("您没有权限");
            return;
        }
        $scope.searchYD = false;
        $scope.searchName = true;
        $scope.reloadCount();
        $scope.reloadDeliveryFreight(0);
    }
    $scope.searchingYD = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CLEAR) {
            alert("您没有权限");
            return;
        }
        $scope.searchYD = true;
        $scope.searchName = false;
        $scope.reloadCount();
        $scope.reloadDeliveryFreight(0);
    }
    $scope.isActing = false;
    $scope.confirmClear = function (f) {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CLEAR) {
            alert("您没有权限");
            return;
        }
        $scope.isActing = true;
        f.status = YD.Freight.STATUS_PASSING_CUSTOM;
        var tmp = new Date();
        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
        if (tmp.getMinutes() < 10)
            tmp_date += "0" + tmp.getMinutes()
        else
            tmp_date += tmp.getMinutes();
        _
        f.shipping.clear = tmp_date;
        f.shipping.save(null, {
            success: function (s) {
                f.save(null, {
                    success: function (f) {
                        $scope.reloadCount();
                        $scope.reloadDeliveryFreight(0);
                        alert("确认成功");
                        $scope.$apply(function () {
                            $scope.isActing = false;
                        });
                    },
                    error: function (f, error) {
                        alert("错误" + error.message);
                        $scope.$apply(function () {
                            $scope.isActing = false;
                        });
                    }
                });
            }
        });
    }
    $scope.addNotes = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        })
    }
    $scope.deliver = function () {
        for (var i = 0; i < $scope.freight.length; i++) {
            if ($scope.freight[i].selection == true) {
                $scope.freight[i].status = YD.Freight.STATUS_PASSING_CUSTOM
                clearList.push($scope.freight[i])
            }
        }
        AV.Object.saveAll(clearList, {
            success: function (list) {
                $scope.$apply(function () {
                    $scope.reloadDeliveryFreight()
                })
            },
            error: function (error) {
            }
        })
    }
})
YundaApp.controller('AdminChineseFreightCtrl', function ($scope, $modal) {
    $scope.showOperationDetails = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightFullDetail',
            controller: 'FreightFullDetailCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return f;
                },
                isFromCustomer: function () {
                    return false;
                }
            },
            windowClass: 'center-modal'
        });
    }
    $scope.showDetails = function (freight) {
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
    $scope.reloadChineseFreight = function (index) {
        var query = new AV.Query(YD.Freight)
        query.equalTo("status", YD.Freight.STATUS_PASSING_CUSTOM);
        query.include("user")
        query.include("address");
        query.include("shipping");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freight = list
                    for (var i = 0; i < $scope.freight.length; i++) {
                        var tmp = $scope.freight[i].updatedAt;
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freight[i].updatedAtToString = tmp_date;
                        $scope.freight[i].selection = false;
                        $scope.freight[i].isAdded = false;
                    }
                })
            },
            error: function (error) {
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadChineseFreight($scope.currentPage - 1);
    };
    $scope.reloadCount = function () {
        var query = new AV.Query(YD.Freight)
        query.equalTo("status", YD.Freight.STATUS_PASSING_CUSTOM);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.count({
            success: function (count) {
                $scope.adminBadge.G = $scope.freightCount = count;
            }
        });
    };
    $scope.$on('adminbf', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchYD = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;
        $scope.reloadCount();
        $scope.reloadChineseFreight(0);
    });
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_RECEIVE) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadCount();
        $scope.reloadChineseFreight(0);
    }
    ;
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_RECEIVE) {
            alert("您没有权限");
            return;
        }
        $scope.searchYD = false;
        $scope.searchName = true;
        $scope.reloadCount();
        $scope.reloadChineseFreight(0);
    }
    $scope.searchingYD = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_RECEIVE) {
            alert("您没有权限");
            return;
        }
        $scope.searchYD = true;
        $scope.searchName = false;
        $scope.reloadCount();
        $scope.reloadChineseFreight(0);
    }
    $scope.addNotes = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        });
        modalInstance.result.then(function () {
            alert("添加成功");
            freight.isAdded = true;
        });
    };
    $scope.isActing = false;

    $scope.confirmOut = function (f) {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_RECEIVE) {
            alert("您没有权限");
            return;
        }
        $scope.isActing = true;
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addInfo',
            controller: 'AddInfoCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight: function () {
                    return f
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            var tmp = new Date();
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
                tmp_date += "0" + tmp.getMinutes()
            else
                tmp_date += tmp.getMinutes();
            _
            f.shipping.atChina = tmp_date;
            f.shipping.save(null, {
                success: function (shipping) {
                    f.status = YD.Freight.STATUS_FINAL_DELIVERY;
                    f.save(null, {
                        success: function (f) {
                            $scope.reloadCount();
                            $scope.reloadChineseFreight(0);
                            alert("确认成功");
                            $scope.$apply(function () {
                                $scope.isActing = false;
                            });
                        },
                        error: function (f, error) {
                            alert("错误" + error.message);
                            $scope.$apply(function () {
                                $scope.isActing = false;
                            });
                        }
                    });
                }
            });
        });
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
                $scope.reloadChineseFreight()
                $scope.$apply()
            },
            error: function (error) {
            }
        })
    }
})
YundaApp.controller('AdminRechargeRecordCtrl', ["$scope", function ($scope) {
    $scope.transactionType = [{
        index: 0,
        value: '支付宝充值（未充值）',
        status: YD.Transaction.STATUS_ZHIFUBAO_PENDING
    }, {
        index: 1,
        value: '支付宝充值',
        status: YD.Transaction.STATUS_ZHIFUBAO
    }, {
        index: 2,
        value: '管理员增加金额',
        status: YD.Transaction.STATUS_CREDIT_USER
    }, {
        index: 3,
        value: 'YD币兑换',
        status: YD.Transaction.STATUS_CLAIM_REWARD
    }]
    $scope.Math = Math;
    $scope.isLoadingTrue = false;
    $scope.promote = "";
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
    $scope.reloadTransaction = function (index) {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("Transaction");
            query.include("user");
            if ($scope.searchType) {
                query.equalTo("status", parseInt($scope.queryType));
            } else {
                query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_PENDING, YD.Transaction.STATUS_CREDIT_USER, YD.Transaction.STATUS_CLAIM_REWARD]);
            }
            query.limit($scope.LIMIT_NUMBER);
            query.skip($scope.LIMIT_NUMBER * index);
            query.descending("createdAt");
            if ($scope.searchName) {
                var innerQuery = new AV.Query(YD.User);
                innerQuery.equalTo("stringId", $scope.queryString);
                query.matchesQuery("user", innerQuery);
            }
            if ($scope.searchDate) {
                var date = new Date()
                var hour = date.getHours()
                var minute = date.getMinutes()
                var d1 = new Date($scope.dt1);
                var d2 = new Date($scope.dt2);
                d1.setHours(0);
                d1.setMinutes(1);
                d2.setHours(23);
                d2.setMinutes(59);
                query.greaterThanOrEqualTo("createdAt", d1);
                query.lessThanOrEqualTo("createdAt", d2);
            }
            query.find({
                success: function (tList) {
                    $scope.transactionList = tList
                    for (var i = 0; i < tList.length; i++) {
                        var tmp = $scope.transactionList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.transactionList[i].createdAtToString = tmp_date;
                    }
                    $scope.$apply();
                },
                error: function (tList, err) {
                }
            })
        }
    };
    $scope.reloadTransactionCount = function () {
        var query = new AV.Query("Transaction");
        query.include("user");
        if ($scope.searchType) {
            query.equalTo("status", parseInt($scope.queryType));
        } else {
            query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_PENDING, YD.Transaction.STATUS_CREDIT_USER, YD.Transaction.STATUS_CLAIM_REWARD]);
        }
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.count({
            success: function (count) {
                $scope.tCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadTransaction($scope.currentPage - 1);
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_RECHARGE) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0)
    }
    ;
    $scope.$on('admindb', function () {
        $scope.searchType = false;
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchDate = false;
        $scope.queryType = undefined;
        $scope.currentPage = 1;

        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    });
    $scope.searching = function () {
        $scope.searchName = true;
        $scope.searchDate = false;
        $scope.searchType = false;
        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    }
    $scope.reloadSelectedTransaction = function () {
        $scope.searchName = false;
        $scope.searchDate = true;
        $scope.searchType = false;
        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    };
    $scope.searchingType = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_CONSUME) {
            alert("您没有权限");
            return;
        }
        $scope.searchName = false;
        $scope.searchDate = false;
        $scope.searchType = true;
        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    }
}]);
YundaApp.controller('AdminCreditUserCtrl', ["$scope", "$modal", function ($scope, $modal) {
    $scope.query = ""
    $scope.searchedString = false
    $scope.searchedNumber = false
    $scope.isLoading = false
    $scope.promote = ""
    $scope.reloadUser = function (index) {
        var query = new AV.Query("_User");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("updatedAt");
        query.find({
            success: function (users) {
                $scope.$apply(function () {
                    $scope.users = users
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.users[i].updatedAtToString = tmp_date
                    }
                })
            },
            error: function (error) {
            }
        })
    };
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadUser(0);
    }
    ;
    $scope.$on('adminde', function () {
        $scope.reloadCount();

        $scope.reloadUser(0);
        $scope.currentPage = 1;

    });
    $scope.reloadCount = function () {
        var query = new AV.Query("_User");
        query.count({
            success: function (count) {
                $scope.userCount = count;
            }
        });
    };
    $scope.reloadCount();
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadUser($scope.currentPage - 1);
    }
    $scope.searchForUser = function (type) {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
            alert("您没有权限");
            return;
        }
        $scope.isLoading = true
        $scope.promote = "正在查询,请稍候..."
        if (type == 'string') {
            var query = new AV.Query("_User")
            query.equalTo("stringId", $scope.queryString)
            query.include("address");
            query.find({
                success: function (list) {
                    $scope.users = list
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.users[i].createdAt = tmp_date
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
        } else {
            var query = new AV.Query("_User")
            query.equalTo("numberId", $scope.queryNumber)
            query.include("address");
            query.find({
                success: function (list) {
                    $scope.users = list
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.users[i].createdAt = tmp_date
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

    $scope.showDetails = function (user) {
        $scope.newAddress = null;
        var query = new AV.Query(YD.Address);
        var id = user.addressId;
        query.get(id, {
            success: function (a) {
                $scope.$apply(function () {
                    $scope.newAddress = a;
                    $scope.newUser = user;
                });
            }
        });
    }
    $scope.increaseBalance = function (user) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_indecreaseBalance',
            controller: 'IncreaseUserBalance',
            scope: $scope,
            size: 'sm',
            resolve: {
                user: function () {
                    return user
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            $scope.reloadUser();
            alert("添加成功");
        });
    }
    $scope.decreaseBalance = function (user) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_indecreaseBalance',
            controller: 'DecreaseUserBalance',
            scope: $scope,
            size: 'sm',
            resolve: {
                user: function () {
                    return user
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            $scope.reloadUser();
            alert("添加成功");
        });
    }
}]);

YundaApp.controller('AdminCreditYDCtrl', ["$scope", "$modal", function ($scope, $modal) {
    $scope.query = ""
    $scope.searchedString = false
    $scope.searchedNumber = false
    $scope.isLoading = false
    $scope.promote = ""
    $scope.reloadUser = function (index) {
        var query = new AV.Query("_User");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("updatedAt");
        query.find({
            success: function (users) {
                $scope.$apply(function () {
                    $scope.users = users
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].moneyUpdatedAt;
                        if (tmp != undefined) {
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10)
                                tmp_date += "0" + tmp.getMinutes()
                            else
                                tmp_date += tmp.getMinutes();
                            $scope.users[i].moneyUpdatedAtToString = tmp_date
                        }
                    }
                });
            },
            error: function (error) {
            }
        })
    };
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadUser(0);
    }
    ;
    $scope.$on('adminde', function () {
        $scope.currentPage = 1;
        $scope.reloadCount();

        $scope.reloadUser(0);
    });
    $scope.reloadCount = function () {
        var query = new AV.Query("_User");
        query.count({
            success: function (count) {
                $scope.userCount = count;
            }
        });
    };
    $scope.reloadCount();
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadUser($scope.currentPage - 1);
    }
    $scope.searchForUser = function (type) {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
            alert("您没有权限");
            return;
        }
        $scope.isLoading = true
        $scope.promote = "正在查询,请稍候..."
        if (type == 'string') {
            var query = new AV.Query("_User")
            query.equalTo("stringId", $scope.queryString)
            query.include("address");
            query.find({
                success: function (list) {
                    $scope.users = list
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.users[i].createdAt = tmp_date
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
        } else {
            var query = new AV.Query("_User")
            query.equalTo("numberId", $scope.queryNumber)
            query.include("address");
            query.find({
                success: function (list) {
                    $scope.users = list
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.users[i].createdAt = tmp_date
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


    $scope.increaseBalance = function (user) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_indecreaseYD',
            controller: 'IncreaseUserYD',
            scope: $scope,
            size: 'sm',
            resolve: {
                user: function () {
                    return user
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            $scope.reloadUser();
            alert("添加成功");
        });
    }
    $scope.decreaseBalance = function (user) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_indecreaseYD',
            controller: 'DecreaseUserYD',
            scope: $scope,
            size: 'sm',
            resolve: {
                user: function () {
                    return user
                }
            },
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function () {
            $scope.reloadUser();
            alert("添加成功");
        });
    }
}]);


YundaApp.controller('IncreaseUserBalance', ["$scope", "$modalInstance", "user", function ($scope, $modalInstance, user) {
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.user = user;
    $scope.confirm = function () {
        if (!$scope.amount) {
            alert("请先填写金额");
            return;
        } else {
            $scope.isLoading = true;
            $scope.promote = "正在处理...";
            AV.Cloud.run('creditUser', {
                userId: user.id,
                amount: $scope.amount,
                role: $scope.currentUser.role
            }, {
                success: function () {
                    $scope.isLoading = false;
                    $scope.promote = "";
                    alert("操作成功！");
                    $modalInstance.close();
                },
                error: function (error) {
                    alert("操作失败：", error);
                    $scope.isLoading = false;
                    $scope.promote = "";
                    $modalInstance.dismiss();
                }
            });
        }
    }
}]);
YundaApp.controller('DecreaseUserBalance', ["$scope", "$modalInstance", "user", function ($scope, $modalInstance, user) {
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.user = user;
    $scope.confirm = function () {
        if (!$scope.amount) {
            alert("请先填写金额");
            return;
        } else {
            $scope.isLoading = true;
            $scope.promote = "正在处理...";
            AV.Cloud.run('debitUser', {
                userId: user.id,
                amount: $scope.amount,
                role: $scope.currentUser.role
            }, {
                success: function () {
                    $scope.isLoading = false;
                    $scope.promote = "";
                    alert("操作成功！");
                    $modalInstance.close();
                },
                error: function (error) {
                    alert("操作失败：", error);
                    $scope.isLoading = false;
                    $scope.promote = "";
                    $modalInstance.dismiss();
                }
            });
        }
    }
}]);

YundaApp.controller('IncreaseUserYD', ["$scope", "$modalInstance", "user", function ($scope, $modalInstance, user) {
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.user = user;
    $scope.confirm = function () {
        if (!$scope.amount) {
            alert("请先填写金额");
            return;
        } else {
            $scope.isLoading = true;
            $scope.promote = "正在处理...";
            AV.Cloud.run('creditYD', {
                userId: user.id,
                amount: $scope.amount
            }, {
                success: function () {
                    $scope.isLoading = false;
                    $scope.promote = "";
                    alert("操作成功！");
                    $modalInstance.close();
                },
                error: function (error) {
                    alert("操作失败：", error);
                    $scope.isLoading = false;
                    $scope.promote = "";
                    $modalInstance.dismiss();
                }
            });
        }
    }
}]);
YundaApp.controller('DecreaseUserYD', ["$scope", "$modalInstance", "user", function ($scope, $modalInstance, user) {
    $scope.isLoading = false;
    $scope.promote = "";
    $scope.user = user;
    $scope.confirm = function () {
        if (!$scope.amount) {
            alert("请先填写金额");
            return;
        } else {
            $scope.isLoading = true;
            $scope.promote = "正在处理...";
            AV.Cloud.run('debitYD', {
                userId: user.id,
                amount: $scope.amount
            }, {
                success: function () {
                    $scope.isLoading = false;
                    $scope.promote = "";
                    alert("操作成功！");
                    $modalInstance.close();
                },
                error: function (error) {
                    alert("操作失败：", error);
                    $scope.isLoading = false;
                    $scope.promote = "";
                    $modalInstance.dismiss();
                }
            });
        }
    }
}]);

YundaApp.controller('AdminConsumeRecordCtrl', ["$scope", "$modal", function ($scope, $modal) {
    $scope.transactionType = [{
        index: 0,
        value: '运费',
        status: YD.Transaction.STATUS_CONSUME
    }, {
        index: 1,
        value: '精确分箱',
        status: YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE
    }, {
        index: 2,
        value: '开箱检查',
        status: YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE
    }, {
        index: 3,
        value: '加固',
        status: YD.Transaction.STATUS_CONSUME_ADD_PACKAGE
    }, {
        index: 4,
        value: '系统扣款',
        status: YD.Transaction.STATUS_DEBIT_USER
    }, {
        index: 5,
        value: '退货',
        status: YD.Transaction.STATUS_CONSUME_RETURN_GOODS
    }, {
        index: 6,
        value: '退款',
        status: YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE
    },]
    $scope.open1 = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.opened1 = true;
    }
    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    }
    $scope.reloadTransaction = function (index) {
        if ($scope.currentUser.id != undefined) {
            var query = new AV.Query("Transaction");
            query.include("user");
            if ($scope.searchType) {
                query.equalTo("status", parseInt($scope.queryType));
            } else {
                query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE, YD.Transaction.STATUS_CONSUME_ADD_PACKAGE, YD.Transaction.STATUS_CONSUME_RETURN_GOODS, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_DEBIT_USER]);
            }
            query.limit($scope.LIMIT_NUMBER);
            query.skip($scope.LIMIT_NUMBER * index);
            query.descending("createdAt");
            if ($scope.searchName) {
                var innerQuery = new AV.Query(YD.User);
                innerQuery.equalTo("stringId", $scope.queryString);
                query.matchesQuery("user", innerQuery);
            }
            if ($scope.searchRK) {
                if ($scope.queryNumber.startsWith('RK')) {
                    query.equalTo("RKNumber", $scope.queryNumber);

                } else {
                    query.equalTo("YDNumber", $scope.queryNumber);
                }
            }
            if ($scope.searchDate) {
                var date = new Date()
                var hour = date.getHours()
                var minute = date.getMinutes()
                var d1 = new Date($scope.dt1);
                var d2 = new Date($scope.dt2);
                d1.setHours(0);
                d1.setMinutes(1);
                d2.setHours(23);
                d2.setMinutes(59);
                query.greaterThanOrEqualTo("createdAt", d1);
                query.lessThanOrEqualTo("createdAt", d2);
            }
            query.find({
                success: function (tList) {
                    $scope.transactionList = tList;
                    for (var i = 0; i < tList.length; i++) {
                        if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME) {
                            $scope.transactionList[i].status = '运费';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE) {
                            $scope.transactionList[i].status = '精确分箱';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE) {
                            $scope.transactionList[i].status = '开箱检查';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_ADD_PACKAGE) {
                            $scope.transactionList[i].status = '加固';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_DEBIT_USER) {
                            $scope.transactionList[i].status = '系统扣款';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONSUME_RETURN_GOODS) {
                            $scope.transactionList[i].status = '退货';
                        } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE) {
                            $scope.transactionList[i].status = '退款';
                        }
                        var tmp = $scope.transactionList[i].createdAt;
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes();
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.transactionList[i].createdAtToString = tmp_date;
                    }
                    $scope.$apply();
                },
                error: function (tList, err) {
                }
            });
        }
    };
    $scope.reloadTransactionCount = function () {
        var query = new AV.Query("Transaction");
        query.include("user");
        if ($scope.searchType) {
            query.equalTo("status", parseInt($scope.queryType));
        } else {
            query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE, YD.Transaction.STATUS_CONSUME_ADD_PACKAGE, YD.Transaction.STATUS_CONSUME_RETURN_GOODS, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_DEBIT_USER]);
        }
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchRK) {
            if ($scope.queryNumber.startsWith('RK')) {
                query.equalTo("RKNumber", $scope.queryNumber);

            } else {
                query.equalTo("YDNumber", $scope.queryNumber);
            }
        }
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.count({
            success: function (count) {
                $scope.$apply(function () {
                    $scope.tCount = count;
                });
            }
        });
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_CONSUME) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    }
    ;
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadTransaction($scope.currentPage - 1);
    }
    $scope.$on('admindc', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchRK = false;
        $scope.queryNumber = '';
        $scope.searchDate = false;
        $scope.searchType = false;
        $scope.queryType = undefined;
        $scope.currentPage = 1;

        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    });
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_CONSUME) {
            alert("您没有权限");
            return;
        }
        $scope.searchRK = false;
        $scope.searchName = true;
        $scope.searchDate = false;
        $scope.searchType = false;
        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    };
    $scope.searchingRK = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_CONSUME) {
            alert("您没有权限");
            return;
        }
        $scope.searchRK = true;
        $scope.searchName = false;
        $scope.searchDate = false;
        $scope.searchType = false;
        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    }
    $scope.reloadSelectedTransaction = function () {
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            $scope.searchRK = false;
            $scope.searchName = false;
            $scope.searchDate = true;
            $scope.searchType = false;
            $scope.reloadTransactionCount();
            $scope.reloadTransaction(0);
        } else {
            alert("请先选择日期");
        }
    }
    $scope.searchingType = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_CONSUME) {
            alert("您没有权限");
            return;
        }
        $scope.searchRK = false;
        $scope.searchName = false;
        $scope.searchDate = false;
        $scope.searchType = true;
        $scope.reloadTransactionCount();
        $scope.reloadTransaction(0);
    };
    $scope.showFreightInDetail = function (t) {
        var RKNumber = t.RKNumber;
        console.log("RKNUmber: " + RKNumber);
        var freightInQuery = new AV.Query(YD.FreightIn);
        freightInQuery.equalTo("RKNumber", RKNumber);
        freightInQuery.first({
            success: function (f) {
                $scope.$apply(function () {
                    console.log("fetched f: ", f);
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/modal_freightInDetail',
                        controller: 'FreightInDetailCtrl',
                        scope: $scope,
                        size: 'md',
                        windowClass: 'center-modal',
                        resolve: {
                            freight: function () {
                                return f;
                            }
                        }
                    });
                });
            },
            error: function (error) {
                console.log("ERROR: ", error);
            }
        });

    }
}]);
YundaApp.controller('AdminYDRewardRecordCtrl', ["$scope", function ($scope) {
    $scope.transactionType = [{
        index: 0,
        value: 'YD币兑换',
        status: YD.Transaction.STATUS_CLAIM_REWARD
    }, {
        index: 2,
        value: 'YD币赠送',
        status: YD.Transaction.STATUS_GET_YD_REWARD
    }, {
        index: 3,
        value: '管理员增加',
        status: YD.Transaction.STATUS_CREDIT_YD
    }, {
        index: 4,
        value: '管理员减少',
        status: YD.Transaction.STATUS_DEBIT_YD
    }];
    $scope.reloadRewardRecord = function (index) {
        var query = new AV.Query(YD.Transaction);
        query.include("user");
        if ($scope.searchType) {
            query.equalTo("status", parseInt($scope.queryType));
        } else {
            query.containedIn("status", [YD.Transaction.STATUS_CLAIM_REWARD, YD.Transaction.STATUS_CONSUME_YD_REWARD, YD.Transaction.STATUS_GET_YD_REWARD, YD.Transaction.STATUS_CREDIT_YD, YD.Transaction.STATUS_DEBIT_YD]);
        }
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        if ($scope.searchRK) {
            if ($scope.queryNumber.startsWith('RK')) {
                query.equalTo("RKNumber", $scope.queryNumber);

            } else {
                query.equalTo("YDNumber", $scope.queryNumber);
            }
        }
        query.find({
            success: function (list) {
                $scope.transactions = list;
                for (var i = 0; i < list.length; i++) {
                    var tmp = $scope.transactions[i].createdAt
                    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                    if (tmp.getMinutes() < 10)
                        tmp_date += "0" + tmp.getMinutes()
                    else
                        tmp_date += tmp.getMinutes();
                    $scope.transactions[i].createdAtToString = tmp_date
                    if ($scope.transactions[i].status == YD.Transaction.STATUS_CLAIM_REWARD)
                        $scope.transactions[i].statusToString = "兑换";
                    else if ($scope.transactions[i].status == YD.Transaction.STATUS_CONSUME_YD_REWARD)
                        $scope.transactions[i].statusToString = $scope.transactions[i].notes;
                    else if ($scope.transactions[i].status == YD.Transaction.STATUS_GET_YD_REWARD)
                        $scope.transactions[i].statusToString = $scope.transactions[i].notes;
                    else if ($scope.transactions[i].status == YD.Transaction.STATUS_CREDIT_YD)
                        $scope.transactions[i].statusToString = $scope.transactions[i].notes;
                    else if ($scope.transactions[i].status == YD.Transaction.STATUS_DEBIT_YD)
                        $scope.transactions[i].statusToString = $scope.transactions[i].notes;
                }
                $scope.$apply();
            }
        })
    };
    $scope.searchingRK = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
            //alert("您没有权限");
            return;
        }
        $scope.searchRK = true;
        $scope.searchName = false;
        $scope.searchDate = false;
        $scope.searchType = false;
        $scope.queryType = undefined;
        $scope.reloadRewardCount();
        $scope.reloadRewardRecord(0);
    }
    $scope.reloadRewardCount = function () {
        var query = new AV.Query(YD.Transaction);
        if ($scope.searchType) {
            query.equalTo("status", parseInt($scope.queryType));
        } else {
            query.containedIn("status", [YD.Transaction.STATUS_CLAIM_REWARD, YD.Transaction.STATUS_CONSUME_YD_REWARD, YD.Transaction.STATUS_GET_YD_REWARD, YD.Transaction.STATUS_CREDIT_YD, YD.Transaction.STATUS_DEBIT_YD]);
        }

        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        if ($scope.searchRK) {
            if ($scope.queryNumber.startsWith('RK')) {
                query.equalTo("RKNumber", $scope.queryNumber);

            } else {
                query.equalTo("YDNumber", $scope.queryNumber);
            }
        }
        query.count({
            success: function (count) {
                $scope.tCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadRewardRecord($scope.currentPage - 1);
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadRewardCount();
        $scope.reloadRewardRecord(0);
    }
    ;
    $scope.$on('admindd', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchRK = false;
        $scope.queryNumber = '';
        $scope.searchDate = false;
        $scope.searchType = false;
        $scope.queryType = undefined;
        $scope.currentPage = 1;

        $scope.reloadRewardCount();
        $scope.reloadRewardRecord(0);
    });
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
            alert("您没有权限");
            return;
        }
        $scope.searchRK = false;
        $scope.searchName = true;
        $scope.searchDate = false;
        $scope.searchType = false;
        $scope.reloadRewardCount();
        $scope.reloadRewardRecord(0);
    }
    $scope.reloadSelectedTransaction = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
            alert("您没有权限");
            return;
        }
        $scope.searchRK = false;
        $scope.searchName = false;
        $scope.searchDate = true;
        $scope.searchType = false;
        $scope.reloadRewardCount();
        $scope.reloadRewardRecord(0);
    }
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
    $scope.reloadSelectedTransaction = function () {
        if ($scope.currentUser.id != undefined) {
            if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
                $scope.searchName = false;
                $scope.searchDate = true;
                $scope.reloadRewardCount();
                $scope.reloadRewardRecord(0);
            } else {
                alert("请先选择日期")
            }
        }
    };
    $scope.searchingType = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_CONSUME) {
            alert("您没有权限");
            return;
        }
        $scope.searchRK = false;
        $scope.searchName = false;
        $scope.searchDate = false;
        $scope.searchType = true;
        $scope.reloadRewardCount();
        $scope.reloadRewardRecord(0);
    }
}])
YundaApp.controller('AdminFinalDeliveryCtrl', function ($scope, $modal) {
    $scope.showDetails = function (freight) {
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
        var query = new AV.Query(YD.Freight)
        query.equalTo("status", YD.Freight.STATUS_FINAL_DELIVERY)
        query.include("user")
        query.find({
            success: function (list) {
                $scope.freight = list
                $scope.$apply(function () {
                    $scope.adminBadge.H = list.length
                    for (var i = 0; i < $scope.freight.length; i++) {
                        $scope.freight[i].selection = false
                        var tmp = $scope.freight[i].updatedAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.freight[i].updatedAt = tmp_date
                    }
                })
            },
            error: function (error) {
            }
        })
    }
    $scope.reloadFinalDelivery();
    $scope.$on('adminbg', function () {
        $scope.reloadFinalDelivery();
    });
    $scope.addNotes = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addNotes',
            controller: 'AddNotesCtrl',
            scope: $scope,
            size: 'sm',
            resolve: {
                freight_obj: function () {
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
        })
    }
    $scope.doubleConfirm = function (f) {
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
    $scope.confirmFreightTerminated = function (f) {
        f.status = YD.Freight.STATUS_DELIVERED
        f.save(null, {
            success: function (f) {
                $scope.reloadFinalDelivery()
                alert("操作成功")
            },
            error: function (f, error) {
                alert("出错！" + error.message)
            }
        })
    }
});
YundaApp.controller('AdminManageFreightCtrl', ["$scope", "$modal", function ($scope, $modal) {
    $scope.isLoadingTrue = false;
    $scope.promote = "";
    $scope.reloadFreight = function (index) {
        var query = new AV.Query(YD.Freight);
        query.include("address");
        query.include("shipping");
        query.include("user");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {

                $scope.$apply(function () {
                    $scope.freights = list;
                    for (var i = 0; i < list.length; i++) {
                        var tmp = $scope.freights[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.freights[i].createdAtToString = tmp_date;
                    }
                });
            }
        });
    };
    $scope.reloadFreightCount = function () {
        var query = new AV.Query(YD.Freight);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchYD) {
            query.equalTo("YDNumber", $scope.queryNumber);
        }
        query.count({
            success: function (count) {
                $scope.freightCount = count;
            }
        });
    };
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadFreight($scope.currentPage - 1);
    }
    $scope.searchingYD = function () {
        $scope.searchYD = true;
        $scope.searchName = false;
        $scope.reloadFreightCount();
        $scope.reloadFreight(0);
    }
    $scope.searching = function () {
        $scope.searchYD = false;
        $scope.searchName = true;
        $scope.reloadFreightCount();
        $scope.reloadFreight(0);
    }
    $scope.$on('admincd', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchYD = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;

        $scope.reloadFreightCount();
        $scope.reloadFreight(0);
    });
    $scope.showFreightDetail = function (freight) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightFullDetail',
            controller: 'FreightFullDetailCtrl',
            scope: $scope,
            size: 'lg',
            resolve: {
                freight: function () {
                    return freight;
                },
                isFromCustomer: function () {
                    return false;
                }
            },
            windowClass: 'center-modal'
        });
    }
}]);
YundaApp.controller("FreightFullDetailCtrl", ["$scope", "$modalInstance", "freight", "isFromCustomer", function ($scope, $modalInstance, freight, isFromCustomer) {
    $scope.isFromCustomer = isFromCustomer;
    console.log(" sFromCustomer: " + $scope.isFromCustomer + " | " + isFromCustomer);
    $scope.freight = freight;
    $scope.isLoading = true;
    $scope.promote = "请等待...";
    var query1 = new AV.Query(YD.Transaction);
    query1.equalTo("YDNumber", freight.YDNumber);
    var newQ = new AV.Query(YD.Transaction);
    newQ.equalTo("RKNumber", freight.RKNumber);
    var query = AV.Query.or(query1, newQ);
    query.find({
        success: function (list) {
            $scope.transactions = list;
            $scope.isLoading = false;
            $scope.promote = "";
            $scope.$apply();
        }
    });
    $scope.saveFreight = function (f) {
        f.save(null, {
            success: function () {
                alert("保存成功");
            }
        });
    }
    $scope.close = function () {
        $modalInstance.dismiss();
    }
}]);
YundaApp.controller('DoubleConfirmCtrl', function ($scope, $modalInstance) {
    $scope.confirm = function () {
        $modalInstance.close()
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('AdminViewUserCtrl', function ($scope) {
    $scope.query = "";
    $scope.searchedString = false;
    $scope.searchedNumber = false;
    $scope.isLoading = false;
    $scope.isLoadingTrue = false;
    $scope.promote = "";
    $scope.reloadUser = function (index) {
        var query = new AV.Query("_User");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("updatedAt");
        query.find({
            success: function (users) {
                $scope.$apply(function () {
                    $scope.users = users
                    for (var i = 0; i < $scope.users.length; i++) {
                        console.log("$user: ", $scope.users[i].emailVerified);
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.users[i].createdAt = tmp_date
                    }
                })
            },
            error: function (error) {
            }
        })
    };
    $scope.reloadUserCount = function () {
        var query = new AV.Query("_User");
        query.count({
            success: function (count) {
                $scope.userCount = count;
            }
        });
    }
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadUser($scope.currentPage - 1);
    }
    $scope.reloadUserCount();
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadUser(0);
    }
    ;
    $scope.$on('adminca', function () {
        $scope.currentPage = 1;
        $scope.reloadUserCount();

        $scope.reloadUser(0);
    });
    $scope.verifyUserEmail = function (user) {
        AV.User.requestEmailVerify(user.username, {
            success: function () {
                alert("发送验证邮箱请求成功");
            },
            error: function (u, error) {
                alert("错误！" + error.message);
            }
        });
    }
    $scope.searchForUser = function (type) {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
            alert("您没有权限");
            return;
        }
        $scope.isLoading = true
        $scope.promote = "正在查询,请稍候..."
        if (type == 'string') {
            var query = new AV.Query("_User")
            query.equalTo("stringId", $scope.queryString)
            query.include("address");
            query.find({
                success: function (list) {
                    $scope.users = list
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        _
                        $scope.users[i].createdAt = tmp_date
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
        } else {
            var query = new AV.Query("_User")
            query.equalTo("numberId", $scope.queryNumber)
            query.include("address");
            query.find({
                success: function (list) {
                    $scope.users = list
                    for (var i = 0; i < $scope.users.length; i++) {
                        var tmp = $scope.users[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10) {
                            tmp_date += "0" + tmp.getMinutes()
                        } else {
                            tmp_date += tmp.getMinutes();
                        }
                        $scope.users[i].createdAt = tmp_date
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
    $scope.$watch("queryString", function (newVal) {
        if (!$scope.searchedString) {
            return
        } else {
            if (newVal === "" || newVal === undefined)
                $scope.reloadUser();
        }
    })
    $scope.$watch("queryNumber", function (newVal) {
        if (!$scope.searchedNumber) {
            return
        } else {
            if (newVal === "" || newVal === undefined)
                $scope.reloadUser();
        }
    });
    $scope.showDetails = function (user) {
        $scope.isLoadingTrue = true;
        $scope.promote = "正在读取";
        $scope.newUser = user;
        $scope.newAddress = null;
        var query = new AV.Query(YD.Address);
        var id = user.addressId;
        if (id != undefined) {
            query.get(id, {
                success: function (a) {
                    $scope.$apply(function () {
                        $scope.isLoadingTrue = false;
                        $scope.promote = "";
                        $scope.newAddress = a;
                    });
                },
                error: function (a, error) {
                    alert("找不到地址");
                    $scope.$apply(function () {
                        $scope.isLoadingTrue = false;
                        $scope.promote = "";
                    });
                }
            });
        } else {
            alert("找不到地址");
            $scope.$apply(function () {
                $scope.isLoadingTrue = false;
                $scope.promote = "";
            });

        }
    }
});
YundaApp.controller('AddInfoCtrl', function ($scope, $modalInstance, freight) {
    $scope.freight = freight
    $scope.chineseCourier;
    $scope.channelList = [{
        name: "韵达快递"
    }, {
        name: "中通快递"
    }, {
        name: "顺丰快递"
    }, {
        name: "EMS"
    }, {
        name: "天天快递"
    }, {
        name: "全峰快递"
    }, {
        name: "宅急送"
    }, {
        name: "申通快递"
    }, {
        name: "圆通快递"
    }]
    $scope.confirmAddInfo = function () {
        $scope.freight.chineseCourier = $scope.chineseCourier.name;
        $scope.freight.save(null, {
            success: function (result) {
                $modalInstance.close()
            },
            error: function (result, error) {
            }
        })
    }
    $scope.cancelAddInfo = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('AdminReturnBalanceCtrl', function ($scope, $modal) {
    $scope.reloadReturnBalance = function (index) {
        var query = new AV.Query("Transaction");
        query.include("user");
        query.containedIn("status", [YD.Transaction.STATUS_PENDING_RETURN_BALANCE, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_REFUSED_RETURN_BALANCE]);
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTK) {
            query.equalTo("TKNumber", $scope.queryNumber);
        }
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.transactionList = list
                    for (var i = 0; i < $scope.transactionList.length; i++) {
                        var tmp = $scope.transactionList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.transactionList[i].createdAtToString = tmp_date;
                    }
                });
            },
            error: function (list, error) {
            }
        });
    };
    $scope.reloadReturnCount = function () {
        var query = new AV.Query("Transaction");
        query.include("user");
        query.containedIn("status", [YD.Transaction.STATUS_PENDING_RETURN_BALANCE, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_REFUSED_RETURN_BALANCE]);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTK) {
            query.equalTo("TKNumber", $scope.queryNumber);
        }
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.find({
            success: function (list) {
                $scope.freightCount = $scope.adminBadge.J = list.length;
                for (var i = 0; i < list.length; i++) {
                    var t = list[i];
                    if (t.status == YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE || t.status == YD.Transaction.STATUS_REFUSED_RETURN_BALANCE) {
                        $scope.adminBadge.J--;
                    }
                }
            }
        });
    };
    $scope.reloadSelectedTransaction = function () {
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            $scope.searchRK = false;
            $scope.searchName = false;
            $scope.searchDate = true;
            $scope.reloadReturnCount();
            $scope.reloadReturnBalance(0);
        } else {
            alert("请先选择日期");
        }
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_RETURN_BALANCE) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadReturnCount();
        $scope.reloadReturnBalance(0);
    }
    ;
    $scope.open1 = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.opened1 = true;
    }
    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    }
    $scope.$on('admincb', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchTK = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;

        $scope.reloadReturnCount();
        $scope.reloadReturnBalance(0);
    });
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadReturnBalance($scope.currentPage - 1);
    }
    $scope.searchingTK = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_RETURN_BALANCE) {
            alert("您没有权限");
            return;
        }
        $scope.searchTK = true;
        $scope.searchName = false;
        $scope.searchDate = false;
        $scope.reloadReturnCount();
        $scope.reloadReturnBalance(0);
    }
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_RETURN_BALANCE) {
            alert("您没有权限");
            return;
        }
        $scope.searchTK = false;
        $scope.searchName = true;
        $scope.searchDate = false;
        $scope.reloadReturnCount();
        $scope.reloadReturnBalance(0);
    }
    $scope.zhifubaoDetails = function (t) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_zhifubaoDetails',
            controller: 'ZhifubaoDetailsCtrl',
            scope: $scope,
            size: 'md',
            windowClass: 'center-modal',
            resolve: {
                transaction: function () {
                    return t;
                }
            }
        })
    };
    $scope.refuseReturn = function (transaction) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addReason',
            controller: 'AdminAddRefuseReason',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        });
        modalInstance.result.then(function (notes) {
            AV.Cloud.run('refuseUserReturnBalance', {
                amount: transaction.amount,
                userId: transaction.user.id
            }, {
                success: function () {
                    transaction.notes = notes;
                    transaction.status = YD.Transaction.STATUS_REFUSED_RETURN_BALANCE;
                    transaction.save(null, {
                        success: function (t) {
                            alert("已成功处理！")
                            $scope.reloadReturnBalance();
                        },
                        error: function (f, error) {
                            alert("出错！" + error.message)
                        }
                    });
                },
                error: function (error) {
                }
            });
        });
    };
    $scope.confirmReturn = function (transaction) {
        if (transaction.amount > parseFloat((transaction.user.pendingBalance / 100).toFixed(2))) {
            alert("用户冻结余额为：" + parseFloat((transaction.user.pendingBalance / 100).toFixed(2)) + ", 请联系用户增加金额");
            return
        } else {
            var r = confirm("是否上传截图给用户?");
            if (!r) {
                AV.Cloud.run('chargingUserReturnBalance', {
                    amount: transaction.amount,
                    userId: transaction.user.id
                }, {
                    success: function () {
                        transaction.status = YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE;
                        transaction.notes = "退款";
                        transaction.isCredit = true;
                        transaction.save(null, {
                            success: function (t) {
                                $scope.reloadReturnBalance();
                                alert("操作成功！")
                            },
                            error: function (t, error) {
                                alert("错误! " + error.message);
                            }
                        });
                    },
                    error: function (error) {
                    }
                });
            } else {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/modal_adminEvidence',
                    controller: 'AdminAddEvidenceCtrl',
                    scope: $scope,
                    size: 'sm',
                    windowClass: 'center-modal',
                    resolve: {
                        transaction: function () {
                            return transaction
                        }
                    }
                })
                modalInstance.result.then(function () {
                    AV.Cloud.run('chargingUserReturnBalance', {
                        amount: transaction.amount,
                        userId: transaction.user.id
                    }, {
                        success: function () {
                            transaction.status = YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE;
                            transaction.notes = "退款";
                            transaction.isCredit = true;
                            transaction.save(null, {
                                success: function (t) {
                                    $scope.reloadReturnBalance();
                                    alert("操作成功！")
                                },
                                error: function (t, error) {
                                    alert("错误! " + error.message);
                                }
                            });
                        },
                        error: function (error) {
                        }
                    });
                });
            }
        }
    }
})
YundaApp.controller('ZhifubaoDetailsCtrl', ["$scope", "$modalInstance", "transaction", function ($scope, $modalInstance, transaction) {
    $scope.transaction = transaction;
    $scope.close = function () {
        $modalInstance.dismiss();
    }
}])
YundaApp.controller('AdminAddEvidenceCtrl', function ($scope, transaction, $modalInstance) {
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        if ($scope.identityFront != undefined) {
            $scope.isLoading = true
            $scope.promote = "正在上传..."
            transaction.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
            transaction.save(null, {
                success: function (t) {
                    alert("上传成功！")
                    $scope.$apply(function () {
                        $scope.isLoading = false
                        $scope.promote = ""
                    })
                    $modalInstance.close()
                },
                error: function (error) {
                    alert("照片上传不成功！" + error.message)
                    $modalInstance.dismiss()
                }
            })
        } else {
            alert("Please upload file first")
        }
    }
})
YundaApp.controller('AdminAddEvidenceChangeAddressCtrl', function ($scope, freight, $modalInstance) {
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        if ($scope.identityFront != undefined) {
            $scope.isLoading = true
            $scope.promote = "正在上传..."
            var frontName = freight.id + 'evidence.jpg'
            freight.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
            freight.status = YD.FreightChangeAddress.STATUS_CONFIRMED
            freight.save(null, {
                success: function (f) {
                    $scope.$apply(function () {
                        $scope.isLoading = false
                        $scope.promote = ""
                    })
                    $modalInstance.close()
                },
                error: function (error) {
                    alert("照片上传不成功！" + error.message)
                    $modalInstance.dismiss()
                }
            })
        } else {
            alert("Please upload file first")
        }
    }
})
YundaApp.controller('AdminReturnGoodsCtrl', function ($scope, $modal) {
    $scope.isLoading = false
    $scope.promote = ""
    $scope.reloadReturnGoods = function (index) {
        var query = new AV.Query(YD.FreightReturn)
        //query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_REAPPLY, YD.FreightReturn.STATUS_FREIGHTIN]);
        query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_FREIGHTIN]);

        query.include("user");
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchRK) {
            query.equalTo("RKNumber", $scope.queryNumber);
        }
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.goodsList = list
                    for (var i = 0; i < $scope.goodsList.length; i++) {
                        var tmp = $scope.goodsList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.goodsList[i].createdAtToString = tmp_date
                    }
                })
            },
            error: function (list, error) {
            }
        });
    };
    $scope.searchingRK = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_RETURN_GOODS) {
            //alert("您没有权限");
            return;
        }
        $scope.searchRK = true;
        $scope.searchName = false;
        $scope.searchDate = false;
        $scope.reloadReturnCount();
        $scope.reloadReturnGoods(0);
    }
    $scope.reloadReturnCount = function () {
        var query = new AV.Query(YD.FreightReturn);
        //query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_REAPPLY, YD.FreightReturn.STATUS_FREIGHTIN]);
        query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_FREIGHTIN]);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchRK) {
            query.equalTo("RKNumber", $scope.queryNumber);
        }
        if ($scope.searchDate) {
            var date = new Date()
            var hour = date.getHours()
            var minute = date.getMinutes()
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1.setHours(0);
            d1.setMinutes(1);
            d2.setHours(23);
            d2.setMinutes(59);
            query.greaterThanOrEqualTo("createdAt", d1);
            query.lessThanOrEqualTo("createdAt", d2);
        }
        query.find({
            success: function (list) {
                $scope.freightCount = $scope.adminBadge.K = list.length;
                for (var i = 0; i < list.length; i++) {
                    var f = list[i];
                    if (f.status == YD.FreightReturn.STATUS_REFUSED || f.status == YD.FreightReturn.STATUS_FINISHED || f.status == YD.FreightReturn.STATUS_FREIGHTIN) {
                        $scope.adminBadge.K--;
                    }
                }
            }
        });
    };
    $scope.open1 = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.opened1 = true;
    }
    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    }
    $scope.reloadSelectedTransaction = function () {
        if ($scope.dt1 != undefined && $scope.dt2 != undefined) {
            $scope.searchRK = false;
            $scope.searchName = false;
            $scope.searchDate = true;
            $scope.reloadReturnCount();
            $scope.reloadReturnGoods(0);
        } else {
            alert("请先选择日期");
        }
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_RETURN_BALANCE) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadReturnCount();
        $scope.reloadReturnGoods(0);
    }
    ;
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadReturnGoods($scope.currentPage - 1);
    }
    $scope.reloadReturnCount();
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_RETURN_GOODS) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadReturnGoods(0)
    }
    ;
    $scope.$on('admincc', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchRK = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;

        $scope.reloadReturnCount();
        $scope.reloadReturnGoods(0);
    });
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_RETURN_GOODS) {
            alert("您没有权限");
            return;
        }
        $scope.searchRK = false;
        $scope.searchName = true;
        $scope.searchDate = false;
        $scope.reloadReturnCount();
        $scope.reloadReturnGoods(0);
    };
    $scope.refuseReturn = function (freightReturn) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addReason',
            controller: 'AdminAddRefuseReason',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (notes) {
            freightReturn.notes = notes
            freightReturn.status = YD.FreightReturn.STATUS_REFUSED;
            freightReturn.save(null, {
                success: function (f) {
                    var RKNumber = f.RKNumber;
                    var query = new AV.Query(YD.FreightIn);
                    query.equalTo("RKNUmber", RKNumber);
                    query.find({
                        success: function (list) {
                        }
                    })
                    alert("已成功处理！")
                    $scope.reloadReturnGoods();
                },
                error: function (f, error) {
                    alert("出错！" + error.message)
                }
            });
        });
    };
    $scope.confirmReturn = function (freightReturn) {
        var amount = $scope.systemSetting.returnGoodsCharge;
        var r = confirm("是否上传截图证据给用户?");
        if (!r) {
            AV.Cloud.run('chargingUserWithoutReward', {
                amount: amount,
                userId: freightReturn.user.id,
                notes: "退货收费",
                RKNumber: freightReturn.RKNumber,
                //YDNumber: 0,
                status: YD.Transaction.STATUS_CONSUME_RETURN_GOODS
            }, {
                success: function () {
                    freightReturn.status = YD.FreightReturn.STATUS_FINISHED;
                    freightReturn.save(null, {
                        success: function (f) {
                            $scope.reloadReturnGoods();
                            alert("已成功处理！");
                        },
                        error: function (f, error) {
                            alert("错误: " + error.message);
                        }
                    });
                },
                error: function (error) {
                    alert("错误! " + error.message);
                }
            });
        } else {
            var modalInstance = $modal.open({
                templateUrl: 'partials/modal_adminEvidence',
                controller: 'AdminAddEvidenceReturnGoodsCtrl',
                scope: $scope,
                size: 'sm',
                windowClass: 'center-modal',
                resolve: {
                    freight: function () {
                        return freightReturn
                    }
                }
            });
            modalInstance.result.then(function () {
                AV.Cloud.run('chargingUserWithoutReward', {
                    amount: amount,
                    userId: freightReturn.user.id,
                    notes: "退货收费",
                    RKNumber: freightReturn.RKNumber,
                    status: YD.Transaction.STATUS_CONSUME_RETURN_GOODS
                }, {
                    success: function () {
                        freightReturn.status = YD.FreightReturn.STATUS_FINISHED;
                        freightReturn.save(null, {
                            success: function (f) {
                                $scope.reloadReturnGoods();
                                alert("已成功处理！");
                            },
                            error: function (f, error) {
                                alert("错误: " + error.message);
                            }
                        });
                    },
                    error: function (error) {
                        alert("错误! " + error.message);
                    }
                });
            });
        }
    }
    $scope.showFreightInDetail = function (f) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_freightInDetail',
            controller: 'FreightInDetailCtrl',
            scope: $scope,
            size: 'md',
            windowClass: 'center-modal',
            resolve: {
                freight: function () {
                    return f;
                }
            }
        });
    }
})
YundaApp.controller('FreightInDetailCtrl', ["$scope", "$modalInstance", "freight", function ($scope, $modalInstance, freight) {
    var RKNumber = freight.RKNumber;
    $scope.isLoading = true;
    $scope.promote = '请稍候...';
    var query = new AV.Query(YD.FreightIn);
    query.equalTo("RKNumber", RKNumber);
    query.find({
        success: function (list) {
            if (list.length == 1) {
                $scope.freightIn = list[0];
                var tmp = $scope.freightIn.createdAt;
                var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                if (tmp.getMinutes() < 10)
                    tmp_date += "0" + tmp.getMinutes()
                else
                    tmp_date += tmp.getMinutes();
                $scope.freightIn.createdAtToString = tmp_date
                $scope.isLoading = false;
                $scope.promote = '';
                $scope.$apply();
            } else {
                alert("找不到");
            }
        }
    });
    $scope.close = function () {
        $modalInstance.dismiss();
    }
}]);
YundaApp.controller('AdminAddRefuseReason', function ($scope, $modalInstance) {
    $scope.notes
    $scope.save = function () {
        $modalInstance.close($scope.notes)
    }
    $scope.close = function () {
        $modalInstance.dismiss()
    }
})
YundaApp.controller('AdminAddEvidenceReturnGoodsCtrl', function ($scope, $modalInstance, freight) {
    $scope.filesChangedFront = function (elm) {
        $scope.identityFront = elm.files
        $scope.$apply()
    }
    $scope.uploadIdentity = function () {
        if ($scope.identityFront != undefined) {
            $scope.isLoading = true
            $scope.promote = "正在上传..."
            var frontName = freight.id + 'evidence.jpg'
            freight.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
            freight.save(null, {
                success: function (f) {
                    $scope.$apply(function () {
                        $scope.isLoading = false
                        $scope.promote = ""
                    })
                    $modalInstance.close();
                },
                error: function (error) {
                    alert("照片上传不成功！" + error.message)
                    $modalInstance.dismiss()
                }
            })
        } else {
            alert("先上传照片")
            $scope.isLoading = false;
            $scope.promote = "";
            return;
        }
    }
})
YundaApp.controller('AdminChangeAddressCtrl', function ($scope, $modal) {
    $scope.reloadChangeAddress = function () {
        var query = new AV.Query(YD.FreightChangeAddress)
        query.equalTo("status", YD.FreightChangeAddress.STATUS_AWAITING)
        query.include("user")
        query.include("address")
        query.find({
            success: function (list) {
                $scope.$apply(function () {
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
                            addressToString = $scope.freights[i].address.recipient + " - " + $scope.freights[i].address.country + $scope.freights[i].address.state + $scope.freights[i].address.city + $scope.freights[i].address.suburb + $scope.freights[i].address.street1
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
    $scope.refuseReturn = function (freightCA) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_addReason',
            controller: 'AdminAddRefuseReason',
            scope: $scope,
            size: 'sm',
            windowClass: 'center-modal'
        })
        modalInstance.result.then(function (notes) {
            freightCA.notes = notes
            freightCA.status = YD.FreightChangeAddress.STATUS_REFUSED;
            freightCA.save(null, {
                success: function (f) {
                    alert("已成功处理！")
                    $scope.reloadChangeAddress()
                },
                error: function (f, error) {
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
YundaApp.controller('AdminZhifubaoCtrl', function ($scope) {
    $scope.reloadZhifubao = function () {
        var query = new AV.Query(YD.Transaction)
        query.equalTo("status", YD.Transaction.STATUS_ZHIFUBAO);
        query.include("user")
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.transactionList = list
                    $scope.adminBadge.I = list.length
                    for (var i = 0; i < $scope.transactionList.length; i++) {
                        var tmp = $scope.transactionList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.transactionList[i].createdAtToString = tmp_date
                    }
                })
            }
        })
    }
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_ZHIFUBAO) {
        //alert("您没有权限");
        return;
    } else {
        $scope.reloadZhifubao()
    }
    ;
    $scope.$on('adminda', function () {
        $scope.currentPage = 1;

        $scope.reloadZhifubao();

    });
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_ZHIFUBAO) {
            alert("您没有权限");
            return;
        }
        var isEmail = false;
        for (var i = 0; i < $scope.queryString.length; i++) {
            if ($scope.queryString[i] == '@') {
                isEmail = true;
            }
        }
        var innerQuery = new AV.Query(YD.User);
        var query = new AV.Query(YD.Transaction);
        query.equalTo("status", YD.Transaction.STATUS_ZHIFUBAO);
        query.include("user")
        if (isEmail) {
            innerQuery.equalTo("email", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        } else {
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.transactionList = list
                    $scope.adminBadge.I = list.length
                    for (var i = 0; i < $scope.transactionList.length; i++) {
                        var tmp = $scope.transactionList[i].createdAt
                        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                        if (tmp.getMinutes() < 10)
                            tmp_date += "0" + tmp.getMinutes()
                        else
                            tmp_date += tmp.getMinutes();
                        $scope.transactionList[i].createdAt = tmp_date
                    }
                })
            }
        })
    }
    $scope.confirmRecharge = function (transaction) {
        $scope.isLoading = true
        $scope.promote = "正在处理..."
        AV.Cloud.run('increaseUserBalance', {
            //source: response.id,
            id: transaction.id,
            role: $scope.currentUser.role
        }, {
            success: function () {
                $scope.isLoading = false
                $scope.promote = ""
                alert("操作成功！")
                $scope.reloadZhifubao()
            },
            error: function (error) {
            }
        })
    }
})
YundaApp.controller('PrintController', ["$scope", "$rootScope", function ($scope, $rootScope) {
    $scope.package = {
        identity: false
    };
    $scope.freight = $rootScope.printFreight;
    for (var i = 0; i < $scope.freight.descriptionList.length; i++) {
    }
    var r = confirm("是否打印身份证?");
    if (!r) {
    } else {
        $scope.package.identity = true;
    }
}]);
YundaApp.controller('AdminDeletePackageCtrl', ["$scope", function ($scope) {
    $scope.reloadDelete = function (index) {
        var query = new AV.Query(YD.FreightIn);
        query.include("user");
        query.equalTo("status", YD.FreightIn.STATUS_CANCELED);
        query.limit($scope.LIMIT_NUMBER);
        query.skip($scope.LIMIT_NUMBER * index);
        query.descending("createdAt");
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTN) {
            query.equalTo("trackingNumber", $scope.queryNumber);
        }
        query.find({
            success: function (list) {
                $scope.$apply(function () {
                    $scope.freights = list;
                    for (var i = 0; i < $scope.freights.length; i++) {
                        if ($scope.freights[i].deleteDate) {
                            console.log("has delete date: " + $scope.freights[i].RKNumber);
                            var tmp = $scope.freights[i].deleteDate;
                            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
                            if (tmp.getMinutes() < 10) {
                                tmp_date += "0" + tmp.getMinutes();
                            } else {
                                tmp_date += tmp.getMinutes();
                            }
                            $scope.freights[i].deleteDateToString = tmp_date;
                        }
                        var tmp1 = $scope.freights[i].createdAt;

                        var tmp_date1 = tmp1.getFullYear() + "/" + (parseInt(tmp1.getMonth()) + 1) + "/" + tmp1.getDate() + " " + tmp1.getHours() + ":";
                        if (tmp1.getMinutes() < 10) {
                            tmp_date1 += "0" + tmp1.getMinutes();
                        } else {
                            tmp_date1 += tmp1.getMinutes();
                        }
                        _
                        $scope.freights[i].createdAtToString = tmp_date1;
                    }
                });
            },
            error: function (error) {
                alert("错误!" + error.message);
            }
        });
    };
    $scope.reloadCount = function () {
        var query = new AV.Query(YD.FreightIn);
        query.equalTo("status", YD.FreightIn.STATUS_CANCELED);
        if ($scope.searchName) {
            var innerQuery = new AV.Query(YD.User);
            innerQuery.equalTo("stringId", $scope.queryString);
            query.matchesQuery("user", innerQuery);
        }
        if ($scope.searchTN) {
            query.equalTo("trackingNumber", $scope.queryNumber);
        }
        query.count({
            success: function (count) {
                $scope.freightCount = count;
            }
        });
    };
    $scope.reloadDelete(0);
    $scope.reloadCount();
    $scope.setPage = function () {
        $scope.currentPage = $scope.inputPage;
        $scope.reloadDelete($scope.currentPage - 1);
    }
    $scope.searching = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
            alert("您没有权限");
            return;
        }
        $scope.searchTN = false;
        $scope.searchName = true;
        $scope.reloadDelete(0);
        $scope.reloadCount();
    };
    $scope.searchingTN = function () {
        if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
            alert("您没有权限");
            return;
        }
        $scope.searchTN = true;
        $scope.searchName = false;

        $scope.reloadCount();
        $scope.reloadDelete(0);
    };
    $scope.$on('admindf', function () {
        $scope.searchName = false;
        $scope.queryString = '';
        $scope.searchTN = false;
        $scope.queryNumber = '';
        $scope.currentPage = 1;
        $scope.reloadCount();

        $scope.reloadDelete(0);
    });
}]);
YundaApp.controller("PayReturnCtrl", ["$scope", "$timeout", "$location", function ($scope, $timeout, $location) {
    $scope.counter = 3;
    var stopped;
    $scope.countdown = function () {
        $timeout(function () {
            $scope.counter--;
            if ($scope.counter == 0) {
                $location.path("/");
                return;
            } else {
                $scope.countdown();
            }
        }, 1000);
    };
    $scope.countdown();
}]);
YundaApp.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    })
});
YundaApp.controller('ContactController', function ($scope, uiGmapGoogleMapApi) {
    $scope.map = {
        center: {
            latitude: 45.508826,
            longitude: -122.856766
        },
        zoom: 17
    }
    $scope.marker = {
        id: 0,
        coords: {
            latitude: 45.508826,
            longitude: -122.856766
        }
    }
    uiGmapGoogleMapApi.then(function (maps) {
    });
    $scope.submitEnquiryForm = function () {
        $scope.enquiry.receiver = "nqw0129@126.com";
        AV.Cloud.run('sendEmail', $scope.enquiry, {
            success: function () {
                alert("感谢您的留言！我们将及时跟您回复！");
            },
            error: function (error) {
            }
        });
    }
});
/* directives.js */
YundaApp.directive("yundaNavbar", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'partials/navbar'
    }
});
YundaApp.directive("yundaFooter", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'partials/footer'
    }
});
YundaApp.directive("barcodeApi", function () {
    return {
        scope: {
            'id': '='
        },
        link: function (scope, element, attrs) {
            attrs.$observe('barcodeApi', function (value) {
                console.log("in directive -- scope.id " + scope.id)
                var url = "http://api-bwipjs.rhcloud.com/?bcid=code128&text=" + scope.id + "&includetext"
                var img = angular.element("<img alt='Barcoded value 1234567890' src=\"" + url + "\" style=\"width:320px;height:100px;\">")
                console.log("in directive, url: " + url)
                angular.element(element).append(img)
            });
        }
    }
})
/* filters.js */
YundaApp.filter('splitPackageFilter', function () {
    return function (freights) {
        var filtered = [];
        if (freights == undefined) {
            return filtered;
        } else {
            for (var i = 0; i < freights.length; i++) {
                var f = freights[i];
                if (f.isSplit || f.isSplitPremium) {
                    filtered.push(f);
                }
            }
            return filtered;
        }
    }
});
YundaApp.filter('normalPackageFilter', function () {
    return function (freights) {
        var filtered = [];
        if (freights == undefined) {
            return filtered;
        } else {
            for (var i = 0; i < freights.length; i++) {
                var f = freights[i];
                if (!f.isSplit && !f.isSplitPremium && !f.isMerge && !f.isSpeedManual) {
                    filtered.push(f);
                }
            }
            return filtered;
        }
    }
});
YundaApp.filter('packageSearchFilter', function () {
    return function (list, input) {
        var filtered = [];
        if (!input || input == '') {
            return list;
        } else {
            for (var i = 0; i < list.length; i++) {
                if (list[i].trackingNumber === input) {
                    filtered.push(list[i]);
                }
            }
            if (filtered.length == 0) {
                return [];
            } else {
                return filtered;
            }
        }
    }
});
/* services.js */