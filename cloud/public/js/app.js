'use strict';

/* app.js */

var AV_APP_ID = "umouw51mkumgpt72hhir61xemo3b7q2n5js0zce3b96by895";
var AV_APP_KEY = "svsw3nybfcax9ssw7czti2fk86ak9gp6ekrb00essagscyrg";

var YundaApp = angular.module('YundaApp', ['ngRoute',
  'ui.bootstrap',
  'uiGmapgoogle-maps',
  //'stripe',
  'barcodeGenerator',
  'ngSanitize'
]);


YundaApp.config(function($routeProvider, $locationProvider, $httpProvider) {
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
  AV.initialize(AV_APP_ID, AV_APP_KEY);
  //For REST API, which is not in use atm
  $httpProvider.defaults.headers.common = {
      'Content-Type': 'application/json',
      'X-AVOSCloud-Application-Id': AV_APP_ID,
      'X-AVOSCloud-Application-Key': AV_APP_KEY
        //'Authorization': 'Bearer ' + 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
    }
    //Stripe
    //    var STRIPE_KEY = "pk_test_6pRNASCoBOKtIshFeQd4XMUh";
    //    Stripe.setPublishableKey(STRIPE_KEY);

});

/* controllers.js */

YundaApp.controller('AppCtrl', function($scope, $rootScope, $location, $http, $modal) {

  $http({
    method: 'GET',
    url: '/api/name'
  }).
  success(function(data, status, headers, config) {
    $scope.name = data.name
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!'
  })
  $scope.printPage = $location.path() == '/print'

  $scope.$on('$routeChangeSuccess', function() {
    $scope.printPage = $location.path() == '/print';
  });
  $rootScope.view_tab = "aa";

  $rootScope.change_tab = function(tab) {
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
  $rootScope.$watch("currentUser", function() {
    if ($rootScope.currentUser != undefined) {
      if ($rootScope.currentUser.role != YD.User.ROLE_ADMIN) {
        $rootScope.isAdmin = false;
      } else {
        $rootScope.isAdmin = true;
      }
    }

  })
  $rootScope.reloadSystemSetting = function() {
    var SYSTEM_SETTING_ID = "557a8a2fe4b0fe935ead7847"
    var query = new AV.Query(YD.SystemSetting)
      //query.include(channelList.channel)
    query.get(SYSTEM_SETTING_ID, {
      success: function(s) {
        $rootScope.systemSetting = s;
        $scope.$apply();
        ////console.log("setting: " + $rootScope.systemSetting.rate);
      },
      error: function(s, error) {

      }
    })
  }
  $rootScope.reloadSystemSetting()

  $rootScope.reloadNews = function() {
    var query = new AV.Query(YD.News);
    query.find({
      success: function(list) {
        $rootScope.newsList = list
        for (var i = 0; i < list.length; i++) {
          var tmp = $scope.newsList[i].createdAt;
          var tmp_date = "(" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + ")";
          $scope.newsList[i].dateToString = tmp_date;
        }
        $scope.$apply();
      },
      error: function(error) {
        alert("找新闻出错");
      }
    })
  }
  $rootScope.reloadNews()



  $scope.openWeChat = function() {
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
  $scope.getButtonArray = function(count) {
    var mod = count % 10;
    var div = count / 10 - mod / 10;
    //console.log("HAHA -- " + count + " | " + count % 10 + " | " + count / 10 + '\n' + "getButtonArray: " + div + " | " + mod);
    //console.log();
    if (mod > 0) {
      return new Array(Math.round(div) + 1);
    } else {
      return new Array(Math.round(div));
    }
  };
  $scope.LIMIT_NUMBER = 10;

});

/* Navbar Controller*/

YundaApp.controller('NavbarCtrl', function($scope, $rootScope, $modal, $window) {
  //$scope.loginDisabled = false;
  if (YD.User.current() != undefined) {
    $rootScope.currentUser = YD.User.current();
    $rootScope.currentUser.fetch();
  } else {
    $rootScope.currentUser = new YD.User();
  }
  $scope.open = function() {
    //$scope.loginDisabled = true;
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_login',
      controller: 'LoginCtrl',
      scope: $scope,
      size: 'sm',
      backdrop: 'static',
      windowClass: 'center-modal'

    });
    modalInstance.result.then(function(user) {
      ////console.log("modal is closed. ")
      if (user != undefined) {
        $rootScope.currentUser = user;
        if ($rootScope.currentUser.role != YD.User.ROLE_ADMIN) {
          $rootScope.isAdmin = false;
        } else {
          $rootScope.isAdmin = true;
        }
        //console.log("$rootScope.isAdmin: " + $rootScope.isAdmin)
        var address = new YD.Address()
        address.id = $rootScope.currentUser.addressId;
        address.fetch().then(function(address) {
          $rootScope.currentUser.address = address;
        })

      } else {
        ////console.log("modal user undefined")
      }
    })
  }
  $scope.logOut = function() {
    YD.User.logOut()
      // Do stuff after successful login.
    $rootScope.currentUser = new YD.User();

    $window.location.href = '/';
  }

  $scope.isActive = function() {
    return true
      //if($scope.currentUser != undefined){
      //    return true
      //} else return false
  }


})

YundaApp.controller('WechatCtrl', function($scope, $modalInstance) {
  $scope.close = function() {
    $modalInstance.dismiss()
  }
})


/* Login Controller*/
YundaApp.controller('LoginCtrl', function($scope, $rootScope, $modalInstance, $modal) {
  $scope.dismissViewController = function() {
    $scope.isLoading = false;
    $scope.promote = undefined;
    $modalInstance.close();
  }
  $scope.login = function() {
    $scope.isLoading = true;
    $scope.promote = "正在登陆...";
    YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
      success: function(user) {

        $modalInstance.close(user)
      },
      error: function(user, error) {
        $scope.$apply(function() {
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


  $scope.signup = function() {
    //$scope.isLoading = true;
    //$scope.promote = "Signing up";

    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_signup',
      controller: 'SignupCtrl',
      scope: $scope,
      size: 'sm',
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
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
        //console.log("currentuser email: " + $scope.currentUser.email);
      $scope.currentUser.role = YD.User.ROLE_USER
      $scope.currentUser.balance = 0
      $scope.currentUser.pendingBalance = 0
      $scope.currentUser.rewardBalance = 0
      $scope.currentUser.accumulatedReward = 500;

      $scope.currentUser.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
          $scope.$apply(function() {
            $scope.currentUser.stringId = user.stringId
            $scope.currentUser.numberId = user.numberId
          })


          $scope.dismissViewController();
          alert("已注册成功，请到邮箱内点击链接激活账号!")
          YD.User.logOut()
            // Do stuff after successful login.
          $rootScope.currentUser = new YD.User()

        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          $scope.$apply(function() {
            // Show the error message somewhere and let the user try again.
            $scope.isLoading = false;
            alert("注册失败： " + error.message);
          });
        }
      })
    })
  }


  $scope.resetPassword = function() {
    $scope.isLoading = true;
    $scope.promote = "Requesting password";
    YD.User.requestPasswordReset($scope.currentUser.username, {
      success: function() {
        alert("密码重设成功，请查收email")
        $scope.dismissViewController();
      },
      error: function(error) {
        $scope.$apply(function() {
          $scope.isLoading = false;
          alert("请先提供电子邮箱地址");
        });
      }
    });
  }
})

YundaApp.controller('SignupCtrl', function($scope, $modalInstance) {
  $scope.passwordRepeat
    //$scope.isPasswordIdentical = $scope.currentUser.password == $scope.passwordRepeat
  $scope.emailExist = false;
  $scope.nameExist = false;


  $scope.signup = function() {

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
      //console.log("first pass");
      $scope.isLoading = true;
      $scope.promote = "正在注册...";
      var query = new AV.Query(YD.User);
      query.equalTo("email", $scope.currentUser.email);
      query.count({
        success: function(count) {
          //console.log("count is: " + count);
          if (count === 1) {
            $scope.emailExist = true;
            alert("邮箱已被占用，请重新输入！");
            return;
          } else {
            //console.log("second pass")
            var newQuery = new AV.Query(YD.User);
            newQuery.equalTo("stringId", $scope.currentUser.stringId);
            newQuery.count({
              success: function(count) {
                if (count === 1) {
                  $scope.nameExist = true;
                  alert("用户名已被占用，请重新输入！");
                  return;
                } else {
                  $modalInstance.close();
                  //console.log("sign up success");
                }
              }
            });
          }

        },
        error: function(error) {
          alert("错误！" + error.message);
        }
      });
    }
    ////console.log("mobile: " + $scope.currentUser.mobile + " | number: " + $scope.currentUser.contactNumber);
    //$modalInstance.close()
  };

  $scope.dismissViewController = function() {
    $scope.isLoading = false;
    $scope.promote = undefined;
    $modalInstance.dismiss();
  }

  $scope.checkExistence = function(type) {
    $scope.emailExist = false;
    $scope.nameExist = false;
    var query = new AV.Query(YD.User);
    if (type == 'email') {
      query.equalTo("email", $scope.currentUser.email);
    } else if (type == 'stringId') {
      query.equalTo("stringId", $scope.currentUser.stringId);
    }
    query.count({
      success: function(count) {
        //console.log("count is: " + count);
        if (count == 1) {
          if (type == 'email') {
            $scope.emailExist = true;
          } else if (type == 'stringId') {
            $scope.nameExist = true;
          }

        }
        $scope.$apply();
        //console.log($scope.emailExist + " " + $scope.nameExist);

      },
      error: function(error) {
        alert("错误！" + error.message);
      }
    });

  };
});

YundaApp.controller('HomeCtrl', function($rootScope, $scope, $modal, $window) {
  $scope.trackingNumber;
  $scope.trackingList;
  $scope.resultList = [];
  ////console.log("In Home Ctrl -- balanceInDollar: " + $scope.currentUser.balanceInDollar)
  $scope.resetPassword = function() {
    if (!$scope.currentUser.username) {
      alert("请先填写您的")
    }
    $scope.isLoading = true;
    $scope.promote = "Requesting password";
    YD.User.requestPasswordReset($scope.currentUser.username, {
      success: function() {
        alert("密码重设成功，请查收email");
        //$scope.dismissViewController();
      },
      error: function(error) {
        $scope.$apply(function() {
          $scope.isLoading = false;
          alert("Reset failed " + error.message);
        });
      }
    });
  }
  $scope.logOut = function() {
    YD.User.logOut()
      // Do stuff after successful login.
    $rootScope.currentUser = new YD.User()
    if ($rootScope.currentUser.role != YD.User.ROLE_ADMIN) {
      $rootScope.isAdmin = false
    } else {
      $rootScope.isAdmin = true
    }

    $window.location.href = '/'
  }
  $scope.updatePassword = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_password',
      controller: 'UpdatePasswordCtrl',
      scope: $scope,
      size: 'sm',
      windowClass: 'center-modal'

    })
    modalInstance.result.then(function() {
      //console.log("updatePassword(): user's password has been updated")
    })
  }

  $scope.trackingInfo = function() {
    ////console.log("tracking info: " + $scope.trackingList)
    $scope.trackingList = $scope.trackingNumber.split("\n")
    for (var i = 0; i < $scope.trackingList.length; i++) {
      //console.log("NOW SPLIT: " + i + " - " + $scope.trackingList[i])
    }
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
    query.find({
        success: function(list) {
          //for (var i = 0; i < list.length; i++) {
          //    list[i].info = "待发货"
          //    $scope.resultList.push(list[i])
          //}

          if (list.length != 0) {
            //6917246211814
            //8498950010019
            var modalInstance = $modal.open({
              templateUrl: 'partials/modal_tracking',
              controller: 'TrackingCtrl',
              scope: $scope,
              windowClass: 'center-modal',
              size: 'lg',
              resolve: {
                resultList: function() {
                  return list;
                }
              }
            });
            //modalInstance.result.then(function (freightIn) {
            //    freightIn.status = YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE
            //    freightIn.isChecking = false;
            //    freightIn.save(null, {
            //        success: function (f) {
            //            alert("确认成功");
            //        },
            //        error: function (f, error) {
            //            alert("错误!" + error.message);
            //        }
            //    });
            //});


          } else {
            alert("没有结果！");
            return
          }
        },
        error: function(error) {
          //console.log("LF FIn ERROR: " + error.message)
        }
      })
      //@todo combine these two


  }

  $scope.login = function() {
    $scope.isLoading = true;
    $scope.promote = "Logging in";
    YD.User.logIn($scope.currentUser.username, $scope.currentUser.password, {
      success: function(user) {
        $rootScope.currentUser = user
        if ($rootScope.currentUser.role != YD.User.ROLE_ADMIN) {
          $rootScope.isAdmin = false
        } else {
          $rootScope.isAdmin = true
        }
        //console.log("$rootScope.isAdmin: " + $rootScope.isAdmin)

        var address = new YD.Address()

        address.id = $rootScope.currentUser.addressId
        address.fetch().then(function(address) {
          $rootScope.currentUser.address = address
        })

        //$scope.dismissViewController();
        $scope.$apply()
          //console.log("successfuly login via main page login")
      },
      error: function(user, error) {
        $scope.$apply(function() {
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

  $scope.signup = function() {
    //$scope.isLoading = true;
    //$scope.promote = "注册...";

    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_signup',
      controller: 'SignupCtrl',
      scope: $scope,
      size: 'sm',
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
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
        success: function(user) {
          // Hooray! Let them use the app now.
          //$scope.dismissViewController(user);
          $scope.$apply(function() {
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
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          $scope.$apply(function() {
            // Show the error message somewhere and let the user try again.
            $scope.isLoading = false;
            alert("注册失败： " + error.message);
          });
        }
      })
    })
  }
  $scope.resetPassword = function() {
    $scope.isLoading = true;
    $scope.promote = "Requesting password";
    YD.User.requestPasswordReset($scope.currentUser.username, {
      success: function() {
        alert("密码重设成功，请查收email");
        $scope.dismissViewController();
      },
      error: function(error) {
        $scope.$apply(function() {
          $scope.isLoading = false;
          alert("Reset failed " + error.message);
        });
      }
    });
  }

});

YundaApp.controller('TrackingCtrl', function($scope, $modal, $modalInstance, resultList) {
  //console.log("resultlist: " + resultList.length)
  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showOperationDetails',
      controller: 'ShowOperationDetailsCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }
  $scope.freights = resultList;
  for (var i = 0; i < resultList.length; i++) {
    var f = $scope.freights[i];
    var tmp = $scope.freights[i].updatedAt;
    var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
    if (tmp.getMinutes() < 10)
      tmp_date += "0" + tmp.getMinutes();
    else
      tmp_date += tmp.getMinutes();
    $scope.freights[i].updatedAtToString = tmp_date;
    //if (f.status = YD.Freight.STATUS_INITIALIZED) {
    //    f.statusToString = "等待处理"
    //}
    //else if (f.status = YD.Freight.STATUS_PENDING_FINISHED) {
    //    f.statusToString = "等待发货"
    //}
    //else if (f.status = YD.Freight.STATUS_PENDING_DELIVERY) {
    //    f.statusToString = "已发货"
    //}
    //else if (f.status = YD.Freight.STATUS_DELIVERING) {
    //    f.statusToString = "正在发货"
    //}
    //else if (f.status = YD.Freight.STATUS_PASSING_CUSTOM) {
    //    f.statusToString = "国内寄送"
    //}
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

    //statusString.substr(0, statusString.length - 22)   //remove trailing comma
    $scope.freights[i].statusToString = statusString

  }
  $scope.close = function() {
    $modalInstance.close()
  }
})

YundaApp.controller('MyTrackingCtrl', function($scope, $modal) {
  //$scope.trackingNumber
  //$scope.trackingList

  $scope.resultList = [];
  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_freightFullDetail',
      controller: 'FreightFullDetailCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }
  $scope.reloadTracking = function(index) {
    $scope.isLoading = true;
    $scope.promote = "正在读取，请稍候...";
    var query = new AV.Query(YD.Freight);

    //query.containedIn("status", [YD.Freight.STATUS_INITIALIZED, YD.Freight.STATUS_DELIVERED]);
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
      success: function(list) {
        $scope.freights = list
        if ($scope.freights != undefined) {
          for (var i = 0; i < $scope.freights.length; i++) {
            var tmp = $scope.freights[i].updatedAt
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
              tmp_date += "0" + tmp.getMinutes()
            else
              tmp_date += tmp.getMinutes();
            $scope.freights[i].updatedAtToString = tmp_date
            if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERED)
              $scope.freights[i].info = "已送达"
              //if($scope.freights[i].status == YD.Freight.STATUS_CANCELED)
              //    $scope.freights[i].status = "取消"
            $scope.freights[i].oepration = statusString
            if ($scope.freights[i].packageComments) {
              //console.log("$scope.freights[i: " + $scope.freights[i].packageComments);
              if ($scope.freights[i].packageComments.length > 10) {
                $scope.freights[i].brief = $scope.freights[i].packageComments.substr(0, 10) + "...";
              } else {
                $scope.freights[i].brief = $scope.freights[i].packageComments;
              }
            }
            var statusList = $scope.freights[i].statusGroup;
            var statusString = ' ';
            if ($scope.freights[i].status == YD.Freight.STATUS_INITIALIZED) {
              //if ($scope.freights[i].statusGroup != undefined) {
              //    for (var j = 0; j < statusList.length; j++) {
              //        if (statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
              //            statusString += "等待最后确认; ";
              //        }
              //        if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
              //            statusString += "等待加固; ";
              //        }
              //
              //        if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
              //            statusString += "等待去发票; ";
              //        }
              //
              //        if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
              //            statusString += "等待普通分箱; ";
              //        }
              //
              //        if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM) {
              //            statusString += "等待精确分箱; ";
              //        }
              //
              //    }
              //} else {
              statusString += "等待发货";
              //}
            } else {
              if ($scope.freights[i].status == YD.Freight.STATUS_PENDING_DELIVERY) {
                statusString = "已发货";
              } else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERING) {
                statusString = "发往中国途中";
              } else if ($scope.freights[i].status == YD.Freight.STATUS_PASSING_CUSTOM) {
                statusString = "已清关";
              } else if ($scope.freights[i].status == YD.Freight.STATUS_FINAL_DELIVERY) {
                statusString = "发往中国";
              } else if ($scope.freights[i].status == YD.Freight.STATUS_SPEED_MANUAL) {
                statusString = "原箱闪运";
              }
            }


            //statusString.substr(0, statusString.length - 22)   //remove trailing comma
            $scope.freights[i].statusToString = statusString;

          }
          $scope.isLoading = false;
          $scope.promote = "";
          $scope.$apply();
        }

      }
    });
  };
  $scope.searchingYD = function() {
    $scope.searchYD = true;
    $scope.reloadTracking(0);
    $scope.reloadTrackingCount();
  }
  $scope.reloadTrackingCount = function() {
    var query = new AV.Query(YD.Freight);
    query.equalTo("user", $scope.currentUser);
    if ($scope.searchYD) {
      query.equalTo("YDNumber", $scope.queryNumber);
    }
    query.count({
      success: function(count) {
        //console.log("mytacing count: " + count);
        $scope.freightCount = count;
        //console.log($scope.freightCount);
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadTracking($scope.currentPage - 1);
  }

  $scope.reloadTrackingCount();
  //$scope.reloadTracking();
  $scope.$on('userbd', function(event, data) {
    $scope.searchYD = false;
    $scope.queryNumber = ''
    $scope.reloadTracking(0);
    $scope.reloadTrackingCount();

  });

  $scope.openRecipientInfo = function(f) {
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
  $scope.close = function() {
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
YundaApp.controller('CarouseCtrl', function($scope) {
  $scope.myInterval = 5000
  var slides = $scope.slides = [{
      image: '/image/banner1.jpg'
    }, {
      image: 'image/banner2.jpg'
    }, {
      image: 'image/banner3.jpg'
    }]
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
YundaApp.controller('ManualCtrl', function($scope) {
  $scope.freightIn = new YD.FreightIn();


  $scope.reloadManual = function(index) {
    var query = new AV.Query(YD.FreightIn);
    query.equalTo("user", $scope.currentUser);
    query.equalTo("status", YD.FreightIn.STATUS_MANUAL);
    query.limit($scope.LIMIT_NUMBER);
    query.skip($scope.LIMIT_NUMBER * index);
    query.descending("createdAt");
    query.find({
      success: function(list) {
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
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadManual($scope.currentPage - 1);
  }
  $scope.reloadCount = function() {
    var query = new AV.Query(YD.FreightIn);
    query.equalTo("user", $scope.currentUser);
    query.equalTo("status", YD.FreightIn.STATUS_MANUAL);
    query.count({
      success: function(count) {
        $scope.freightCount = count;

      }
    })
  };
  $scope.reloadCount();
  $scope.$on('userba', function(event, data) {
    //console.log("userba called");
    $scope.reloadManual(0);
  });
  $scope.deleteFreight = function(f) {
    var r = confirm("是否确认删除?");
    if (!r) {

    } else {
      f.destroy({
        success: function(f) {
          $scope.reloadCount();
          $scope.reloadManual(0);
          alert("删除成功！")
        },
        error: function(f, error) {
          alert("出错！" + error.message)
        }
      });
    }
  }
  $scope.submitFreightIn = function() {
    $scope.freightIn.status = YD.FreightIn.STATUS_MANUAL
    $scope.freightIn.user = $scope.currentUser
    $scope.freightIn.weight = 0
    $scope.freightIn.generateRKNumberWithCallback(function(success, reply) {
      if (!success) {
        alert("错误!" + reply);
      } else {
        $scope.freightIn.RKNumber = reply;
        $scope.freightIn.save(null, {
          success: function(f) {
            $scope.freightIn = new YD.FreightIn();
            $scope.reloadCount();
            $scope.reloadManual(0);

            //console.log("MANUAL frieghtin saved ")
            alert("运单已上传成功!")
          },
          error: function(f, error) {
            //console.log("MANUAL frieghtin NOT saved " + error.message)

          }
        });
      }
    });

  }
})

YundaApp.controller('SpeedManualCtrl', ["$scope", "$modal", function($scope, $modal) {
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

  $scope.$on('userbe', function(event, args) {
    $scope.reloadSpeedManual(0);
  });
  $scope.rewriteFreight = function() {
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
      //$scope.insurance.value = 0;

    }
  };
  $scope.reloadSpeedManual = function(index) {
    var query = new AV.Query(YD.Freight);
    query.equalTo("status", YD.Freight.STATUS_SPEED_MANUAL);
    query.equalTo("user", $scope.currentUser);
    query.limit($scope.LIMIT_NUMBER);
    query.skip($scope.LIMIT_NUMBER * index);
    query.descending("createdAt");
    query.find({
      success: function(list) {
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
      error: function(error) {
        alert("闪运读取错误!" + error.message);
      }
    });
  };
  $scope.reloadCount = function() {
    var query = new AV.Query(YD.Freight);
    query.equalTo("status", YD.Freight.STATUS_SPEED_MANUAL);
    query.equalTo("user", $scope.currentUser);
    query.count({
      success: function(count) {
        $scope.freightCount = count;
      }
    });
  };
  $scope.reloadCount();
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadSpeedManual($scope.currentPage - 1);
  }
  $scope.editDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_editFreightDetails',
      controller: 'FreightDetailsCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return freight;
        }
      },
      windowClass: 'center-modal'
    });
  };

  $scope.deleteFreight = function(freight) {
    var r = confirm("确认彻底删除?");
    if (!r) {
      return;
    } else {
      var RKNumber = freight.RKNumber;
      freight.destroy({
        success: function(f) {
          var query = new AV.Query(YD.FreightIn);
          query.equalTo("RKNumber", RKNumber);
          query.find({
            success: function(list) {
              if (list.length == 1) {
                var fIn = list[0];
                fIn.destroy({
                  success: function(f) {
                    $scope.reloadSpeedManual();
                    alert("删除运单成功，请重新生成运单");
                  },
                  error: function(f, error) {
                    alert("错误!" + error.message);
                  }
                });
              } else {
                alert("错误! 查到多个运单");
              }
            }
          });

        },
        error: function(f, error) {
          $scope.reloadFreight();
          alert("错误!" + error.message);
        }
      });
    }
  }

  $scope.reloadSpeedManual(0);


  //$scope.showChannel = function() {
  //    alert("channelSelect: " + $scope.channelSelection.name + "  " + $scope.channelSelection.initialPrice);
  //}
  $scope.getRecipient = function() {

    var query = new AV.Query("Address")
    query.equalTo("user", $scope.currentUser);
    query.descending("createdAt");
    query.find({
      success: function(results) {
        $scope.recipients = results
      },
      error: function(res, error) {
        alert("Getting Recipient: " + error.code + " " + error.message)
      }
    })
  }
  $scope.getRecipient();


  $scope.chooseRecipient = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_chooseRecipientAddress',
      controller: 'ChooseAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        addressList: function() {
          return $scope.recipients
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function(chosenAddress) {
      $scope.freightIn.address = chosenAddress
      alert("已成功选取收件人: " + chosenAddress.recipient)
    })
  }
  $scope.addNewRecipient = function() {
    var address = new YD.Address()
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_address',
      controller: 'EditAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        address: function() {
          return address
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      //console.log("addNewAddress(): new address is added")
      $scope.getRecipient();
      alert("添加新收件人成功！")
    })
  }

  $scope.addNewDescription = function() {
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

  $scope.deleteDescrption = function(desc) {
    for (var i = 0; i < $scope.descriptionList.length; i++) {
      if (desc.name == $scope.descriptionList[i].name) {
        //console.log("delete name: " + i);
        $scope.insurance.total -= parseFloat($scope.descriptionList[i].total);

        $scope.descriptionList.splice(i, 1);
      }
    }
  };

  $scope.$watch("insurance.value", function(newVal) {
    if (newVal.value != 0) {
      //console.log("In watch: insuranceValue: " + $scope.insurance.value)
      $scope.insurance.amount = parseFloat(($scope.insurance.value * 0.02).toFixed(2))
        //console.log("In watch: insuranceAmount: " + $scope.insurance.amount)

    } else {
      //console.log("In watch: newVal == 0")

    }
  });

  $scope.isClicked = false;
  $scope.generateFreight = function() {
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
      success: function(fIn) {
        //console.log("freightIn saved: " + fIn.address.id + "  " + fIn.status);
        //var addressPt = new YD.Address();
        //addressPt.id = fIn.address.id;
        //$scope.freight.address = addressPt;
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
        $scope.freight.status = YD.Freight.STATUS_SPEED_MANUAL;
        $scope.freight.isSpeedManual = true;
        $scope.freight.trackingNumber = $scope.freightIn.trackingNumber;
        $scope.freight.RKNumber = $scope.freightIn.RKNumber;
        $scope.freight.exceedWeight = $scope.freightIn.exceedWeight;

        $scope.freight.user = $scope.currentUser;
        $scope.freight.weight = $scope.freightIn.weight;
        //if ($scope.checkBox != undefined) {
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
        //}
        $scope.freight.descriptionList = [];

        ////console.log("obj.name: " + obj.name);
        //$scope.freight.add("descriptionList", obj);
        //$scope.freight.descriptionList = $scope.descriptionList;


        //add description list
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
            //$scope.freight.descriptionList.push(obj);
          $scope.freight.add("descriptionList", obj);

        }
        $scope.freight.insurance = $scope.insurance.amount + "(所保价值: " + $scope.insurance.value + ")";
        $scope.freight.channel = $scope.channelSelection;

        $scope.freight.generateYDNumber(function(success, reply) {
          if (!success) {
            alert("错误!" + reply);
            $scope.isClicked = false;
            return;
          } else {
            //console.log("YDNumber Callback: " + reply);

            $scope.freight.YDNumber = reply;
            $scope.freight.save(null, {
              success: function(f) {
                alert("原箱闪运运单提交成功!");
                $scope.reloadSpeedManual();
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
              },
              error: function(f, error) {
                $scope.isClicked = false;
                if (error.code == 105) {
                  alert("生成运单失败,请刷新页面重试");
                } else {
                  alert("生成运单失败");
                }
                //console.log("ERROR: " + error.message);
              }
            });
          }
        });
      }
    });

  }

  //if (freightIn.address == undefined) {
  //    alert("Choose address first")
  //    //console.log("address is undefined")
  //} else {
  //    var freight = new YD.Freight()
  //    //freight.address = null
  //    //freight.freightIn = freightIn
  //    freight.address = freightIn.address
  //    freight.estimatedPrice = freightIn.weight * $scope.PRICE
  //
  //    //console.log("est price: " + freight.estimatedPrice)
  //    //freight.statusGroup = $scope.getStatusList(freightIn)
  //    if (freightIn.checkboxModel != undefined) {
  //        if (freightIn.checkboxModel.delivery == true)
  //            freight.add("statusGroup", YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION)
  //
  //        if (freightIn.checkboxModel.addPackage == true)
  //            freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING)
  //
  //        if (freightIn.checkboxModel.reduceWeight == true)
  //            freight.add("statusGroup", YD.Freight.STATUS_PENDING_REDUCE_WEIGHT)
  //
  //    }
  //    freight.user = $scope.currentUser
  //    freight.weight = freightIn.weight
  //    freight.trackingNumber = freightIn.trackingNumber
  //    //freight.estimatedPrice = freightIn.weight * $scope.PRICE
  //    freight.status = YD.Freight.STATUS_INITIALIZED
  //    freight.comments = freightIn.comments
  //    if(freightIn.isSplit) {
  //        freight.isSplit = true
  //        freight.splitReference = freightIn.splitReference
  //        freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
  //    }
  //
  //    if(freightIn.isSplitPremium) {
  //        freight.isSplitPremium = true
  //        freight.splitReference = freightIn.splitReference
  //        freight.add("statusGroup", YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM)
  //    }
  //    freight.save(null,  {
  //        success: function (freight) {
  //            //console.log("freight has been saved: " + freight.id)
  //            $scope.badgeCount += 1
  //            freightIn.status = YD.FreightIn.STATUS_FINISHED
  //            freightIn.save(null, {
  //                success: function (freightIn) {
  //                    //console.log("freightIn has been saved: " + freightIn.id)
  //                    alert("生成运单成功!")
  //                    $scope.reloadFreightInConfirmed()
  //                },
  //                error: function (freightIn, error) {
  //                    //console.log("ERROR: freightIn not save: " + error.code + " - " + error.message)
  //                }
  //            })
  //        },
  //        error: function (freight, error) {
  //            //console.log("ERROR: freight not save: " + error.code + " - " + error.message)
  //        }
  //    })
  //
  //}
}]);


YundaApp.controller('ReturnGoodsCtrl', function($scope, $modal) {
  $scope.query = "";
  $scope.reloadFreightReturn = function(index) {
    var query = new AV.Query("FreightReturn");
    query.equalTo("user", $scope.currentUser);
    query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED]);
    query.limit($scope.LIMIT_NUMBER);
    query.skip($scope.LIMIT_NUMBER * index);
    query.descending("createdAt");
    if ($scope.currentUser.id != undefined) {
      query.find({
        success: function(result) {

          //console.log("RETURN find return list, length: " + result.length)
          $scope.returnList = result
          for (var i = 0; i < $scope.returnList.length; i++) {
            if ($scope.returnList[i].status == YD.FreightReturn.STATUS_PENDING) {
              $scope.returnList[i].statusToString = "等待处理";
            } else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_FINISHED) {
              $scope.returnList[i].statusToString = "已处理";
            } else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_REFUSED) {
              $scope.returnList[i].statusToString = "昀達拒绝退货";
            }
            var tmp = $scope.returnList[i].createdAtToString;
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
              tmp_date += "0" + tmp.getMinutes()
            else
              tmp_date += tmp.getMinutes();
            $scope.returnList[i].createdAtToString = tmp_date
            if ($scope.returnList[i].adminEvidence != undefined)
              $scope.returnList[i].adminEvidence = $scope.returnList[i].adminEvidence.url();
          }

          $scope.$apply();
        },
        error: function(error) {

        }
      });
    }
  };
  $scope.reloadFreightCount = function() {
    var query = new AV.Query("FreightReturn");
    query.equalTo("user", $scope.currentUser);
    query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED]);
    query.count({
      success: function(count) {
        $scope.freightCount = count;
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadFreightReturn($scope.currentPage - 1);
  }

  $scope.reloadFreightCount();
  //$scope.reloadFreightReturn();
  $scope.$on('userdb', function() {
    $scope.reloadFreightReturn(0);

  });
  //$scope.returnFreight = new YD.FreightReturn()

  $scope.searchForGoods = function() {
    var query = new AV.Query(YD.FreightReturn);
    query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_REAPPLY, YD.FreightReturn.STATUS_FREIGHTIN]);
    query.equalTo("user", $scope.currentUser);
    query.equalTo("RKNumber", $scope.query);
    query.find({
      success: function(t) {
        $scope.returnList = t;
        for (var i = 0; i < t.length; i++) {
          if ($scope.returnList[i].status == YD.FreightReturn.STATUS_PENDING)
            $scope.returnList[i].statusToString = "等待处理"
          else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_FINISHED)
            $scope.returnList[i].statusToString = "已处理"
          else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_REFUSED)
            $scope.returnList[i].statusToString = "昀達拒绝退货"
          else if ($scope.returnList[i].status == YD.FreightReturn.STATUS_REAPPLY)
            $scope.returnList[i].statusToString = "已重新申请退货"
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

  $scope.applyReturn = function(id) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_returnGoods',
      controller: 'ReturnGoodsModalCtrl',
      scope: $scope,
      size: 'md',
      windowClass: 'center-modal',
      resolve: {
        id: function() {
          return id;
        }
      }
    })
    modalInstance.result.then(function(returnFreight) {
      //$scope.freightIn.address = chosenAddress
      returnFreight.save(null, {
          success: function(t) {
            alert("申请成功！请等待处理");
            $scope.reloadFreightReturn();
          },
          error: function(t, error) {
            alert("申请失败：" + error.message)
          }
        })
        //alert("已成功选取收件人: " + chosenAddress.recipient)
    });
  };

  $scope.returnAgain = function(f) {
    f.status = YD.FreightReturn.STATUS_REAPPLY;
    f.save(null, {
      success: function() {
        $scope.reloadFreightReturn();
        $scope.applyReturn(f.id);
      }
    });
  };

  $scope.recoverFreightIn = function(f) {
    var RKNumber = f.RKNumber;
    var query = new AV.Query(YD.FreightIn);
    //console.log("RKNumber; " + RKNumber);
    query.equalTo("RKNumber", RKNumber);
    query.find({
      success: function(list) {
        //console.log("LENGHTH: " + list.length);
        for (var i = 0; i < list.length; i++) {
          var fIn = list[i];
          fIn.recoverFreightIn();
        }
        AV.Object.saveAll(list, {
          success: function(list) {
            f.status = YD.FreightReturn.STATUS_FREIGHTIN;
            f.save(null, {
              success: function() {
                $scope.reloadFreightReturn();
                alert("请前往[包裹管理]重新处理包裹");
              }
            });

          },
          error: function(error) {
            //console.log("ERROR: " + error.message);
          }
        });
      }
    });
  }
});

YundaApp.controller('ReturnGoodsModalCtrl', ["$scope", "$modalInstance", "id", function($scope, $modalInstance, id) {
  $scope.isLoading = false;
  $scope.promote = "";
  $scope.TNExist = false;
  $scope.existPromote = "";
  console.log("id: " + id);
  if (!id) {
    $scope.return = new YD.FreightReturn();

  } else {
    var query = new AV.Query(YD.FreightReturn);
    query.get(id, {
      success: function(f) {
        $scope.return = f;
        console.log("id: " + id + "| " + f.id);
      }
    });
  }
  $scope.checkExistence = function() {
    //$scope.existPromote = "";

    var query = new AV.Query(YD.Freight);
    query.equalTo("RKNumber", $scope.return.RKNumber);
    query.equalTo("user", $scope.currentUser);
    query.find({
      success: function(list) {
        if (list.length != 0) {
          //console.log("list length: " + list.length);

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
          //$scope.existPromote = "找不到包裹";
        }
      },
      error: function(error) {
        $scope.TNExist = false;
        $scope.existPromote = "找不到包裹";
      }
    });
  };
  $scope.applyReturn = function() {
    if (!$scope.return.RKNumber) {
      alert("请提供YD运单号");
      return;
    } else if (!$scope.return.address) {
      alert("请提供退货地址");
      return;
    } else if (!$scope.return.reason) {
      alert("请提供退货原因");
      return;
    }
    var query = new AV.Query(YD.Freight);
    query.equalTo("RKNumber", $scope.return.RKNumber);
    query.equalTo("user", $scope.currentUser);
    query.find({
      success: function(list) {
        //console.log("got it, now save");
        if (list.length != 0) {
          //console.log("list length: " + list.length);

          if (list[0].isOperated) {
            alert("此包裹已被打包，无法退货");
            return;
          }
          //list[0].status = YD.Freight.STATUS_CANCELED;
          list[0].destroy({
            success: function() {
              var userPt = new YD.User();
              userPt.id = $scope.currentUser.id;
              $scope.return.user = userPt;
              $scope.return.status = YD.FreightReturn.STATUS_PENDING;
              $modalInstance.close($scope.return);
            }
          });
        } else {
          var newQ = new AV.Query(YD.FreightIn);
          newQ.equalTo("RKNumber", $scope.return.RKNumber);
          newQ.equalTo("user", $scope.currentUser);
          newQ.find({
            success: function(list) {
              //console.log("at FreightIn");
              if (list) {
                //console.log("status: " + list.length);
                list[0].status = YD.FreightIn.STATUS_CANCELED;
                list[0].save(null, {
                  success: function() {
                    var userPt = new YD.User();
                    userPt.id = $scope.currentUser.id;
                    $scope.return.user = userPt;
                    $scope.return.status = YD.FreightReturn.STATUS_PENDING;
                    $modalInstance.close($scope.return);
                  }
                });
              } else {
                alert("找不到包裹！操作失败");
              }
            }
          })
        }
      },
      error: function(error) {
        alert("找不到包裹！操作失败");
      }
    });

  };

  $scope.close = function() {
    $modalInstance.dismiss();
  }
  $scope.filesChangedFirst = function(elm) {
    $scope.identityFirst = elm.files
    $scope.$apply()
  }

  $scope.filesChangedSecond = function(elm) {
    $scope.identitySecond = elm.files
    $scope.$apply()
  }
  $scope.filesChangedThird = function(elm) {
    $scope.identityThird = elm.files
    $scope.$apply()
  }
  $scope.uploadIdentity = function() {
    ////console.log("In fileUpload back: " + $scope.identityBack)
    ////console.log("In fileUpload front: " + $scope.identityFront)
    $scope.isLoading = true;
    $scope.promote = "正在上传，请稍候...";
    if ($scope.identityFirst != undefined) {
      if ($scope.identityFirst) {
        var frontName = $scope.currentUser.realName + '1.jpg';
        var avFileFront = new AV.File(frontName, $scope.identityFirst[0]);
        $scope.return.identityFirst = avFileFront
          //console.log("in first");


      }
      if ($scope.identitySecond) {
        var backName = $scope.currentUser.realName + '2.jpg';
        var avFileBack = new AV.File(backName, $scope.identitySecond[0]);
        $scope.return.identitySecond = avFileBack
          //console.log("in second");


      }
      if ($scope.identityThird) {
        var thirdName = $scope.currentUser.realName + '3.jpg';
        var avFileThird = new AV.File(thirdName, $scope.identityThird[0]);
        $scope.return.identityThird = avFileThird
          //console.log("in third");

      }
      ////console.log("In fileUpload back: " + $scope.identityFront[0].name)
      ////console.log("In fileUpload front: " + $scope.identityBack[0].name)
      //console.log("now saving");


      $scope.return.save(null, {
        success: function(img) {
          $scope.isLoading = false;
          $scope.promote = "";
          alert("上传成功!请确认申请");
          $scope.$apply();
          //console.log("In FileUploadCtrl: ID image has been saved")
        },
        error: function(img, error) {
          //console.log("ERROR: In FileUploadCtrl: ID image not been saved: " + error.id + error.message)

        }
      })
    } else {
      alert("Please upload file first")
    }
  }
}]);

YundaApp.controller('ReturnBalanceCtrl', function($scope, $modal) {
  $scope.query = "";
  $scope.reloadReturnBalance = function(index) {
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
        success: function(list) {
          $scope.transactionList = list
            //console.log("list length:" + list.length);
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
        error: function(error) {
          //console.log("return balance ERROR: " + error.message)
        }
      })
    }
    //$scope.reloadReturnBalance();

  $scope.reloadReturnCount = function() {
    var query = new AV.Query("Transaction");
    query.equalTo("user", $scope.currentUser);
    query.containedIn("status", [YD.Transaction.STATUS_PENDING_RETURN_BALANCE, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_REFUSED_RETURN_BALANCE]);
    if ($scope.searchTK) {
      query.equalTo("TKNumber", $scope.query);
    }
    query.count({
      success: function(count) {
        $scope.freightCount = count;
      }
    });
  };
  $scope.$on('userda', function() {
    $scope.searchTK = false;
    $scope.query = '';
    $scope.reloadReturnCount();
    $scope.reloadReturnBalance(0);
  });
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadReturnBalance($scope.currentPage - 1);
  }


  $scope.searchForTransaction = function() {
    $scope.searchTK = true;
    $scope.reloadReturnCount();
    $scope.reloadReturnBalance(0);


  }

  $scope.returnBalance = new YD.Transaction();

  $scope.applyReturn = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_returnBalance',
      controller: 'ReturnBalanceModalCtrl',
      scope: $scope,
      size: 'md',
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function(transaction) {
      //$scope.freightIn.address = chosenAddress
      transaction.status = YD.Transaction.STATUS_PENDING_RETURN_BALANCE;
      //console.log("transaction status: " + transaction.get("status"));
      //console.log("transaction status SDK: " + transaction.status);

      transaction.save(null, {
          success: function(t) {
            var amount = t.amount;
            //console.log("amoutn: " + amount + " | " + typeof amount);
            //console.log("balance: " + $scope.currentUser.balance);
            //console.log("pending balance: " + $scope.currentUser.pendingBalance);

            $scope.currentUser.balanceInDollar -= amount;
            $scope.currentUser.pendingBalance += amount * 100;
            $scope.currentUser.save(null, {
              success: function(u) {
                //console.log("balance: " + u.balance);
                //console.log("pending balance: " + u.pendingBalance);
                alert("申请成功！请等待处理");
                $scope.reloadReturnBalance();
              }
            });
          },
          error: function(t, error) {
            alert("申请失败：" + error.message);
          }
        })
        //alert("已成功选取收件人: " + chosenAddress.recipient)
    })
  }
})


YundaApp.controller('ReturnBalanceModalCtrl', function($scope, $modalInstance) {
  $scope.transaction = new YD.Transaction();
  $scope.zhifubao = {
    account: "",
    name: "",
    contact: ""
  };
  $scope.isLoading = false;
  $scope.promote = "";
  $scope.applyReturn = function() {
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
    //$scope.transaction.status = YD.Transaction.STATUS_PENDING_RETURN_BALANCE;
    $modalInstance.close($scope.transaction);
  }
  $scope.close = function() {
    $modalInstance.dismiss();
  }

  $scope.filesChangedFront = function(elm) {
    $scope.identityFront = elm.files
    $scope.$apply()
  }


  $scope.uploadIdentity = function() {
    $scope.isLoading = true;
    $scope.promote = "正在上传，请稍候...";
    //console.log("In fileUpload back: " + $scope.identityBack)
    ////console.log("In fileUpload front: " + $scope.identityFront)

    if ($scope.identityFront != undefined) {
      ////console.log("In fileUpload back: " + $scope.identityFront[0].name)
      ////console.log("In fileUpload front: " + $scope.identityBack[0].name)
      var frontName = 'front.jpg'
      var avFileFront = new AV.File(frontName, $scope.identityFront[0])

      $scope.transaction.identityFront = avFileFront
      $scope.transaction.save(null, {
        success: function(img) {
          //console.log("In FileUploadCtrl: ID image has been saved")
          $scope.isLoading = false;
          $scope.promote = "";
          alert("上传成功！请申请退款");
        },
        error: function(img, error) {
          $scope.isLoading = false;
          $scope.promote = "";
          //console.log("ERROR: In FileUploadCtrl: ID image not been saved: " + error.id + error.message)
          alert("错误!" + error.message);

        }
      })
    } else {
      alert("请先上传身份证");
    }
  }
});

/* Dashboard Controller*/
YundaApp.controller('DashboardCtrl', function($scope, $rootScope, $modal, $window) {
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
  $scope.updateLogin = function() {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal_username',
        controller: 'UpdateUsernameCtrl',
        scope: $scope,
        size: 'sm',
        windowClass: 'center-modal'

      });
      modalInstance.result.then(function() {
        alert("请前往邮箱验证账号");
        YD.User.logOut();
        // Do stuff after successful login.
        $rootScope.currentUser = new YD.User();
        $window.location.href = '/';
      })
    }
    /* getting user's address */

  $scope.searchPackage = function() {
    $scope.query.isSearch = !$scope.query.isSearch;
  }

  $scope.updatePassword = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_password',
      controller: 'UpdatePasswordCtrl',
      scope: $scope,
      size: 'sm',
      windowClass: 'center-modal'

    })

  }


  /* getting recipient */
  $scope.reloadAddress = function(index) {
    if ($scope.currentUser.id != undefined) {
      //console.log("reloadAddress: ADDRESS");
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
          success: function(results) {
            $scope.recipientAddresses = results;
            $scope.$apply();
            //console.log("address list has been reloaded");
          },
          error: function(error) {
            alert("Getting Recipient Addresses Error: " + error.code + " " + error.message);
          }
        });
      }
    }
  };
  $scope.reloadAddressCount = function() {
    //console.log("reloadAddress: ADDRESS");

    var query = new AV.Query("Address");
    query.equalTo("user", $scope.currentUser);
    if ($scope.searchName) {
      query.equalTo("recipient", $scope.recipientLookup);
    }
    query.count({
      success: function(count) {
        //$scope.recipientAddresses = results;
        console.log("counted: " + count);
        $scope.recipientCount = count;
        $scope.$apply();
      },
      error: function(error) {
        alert("Getting Recipient Addresses Error: " + error.message);
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadAddress($scope.currentPage - 1);
  }

  $scope.$watch('currentUser', function() {
    if ($scope.currentUser.id) {
      $scope.reloadAddressCount();
    }
  });

  $scope.reloadAddress(0);
  /* search recipients */
  $scope.searchRecipient = function() {
    $scope.searchName = true;
    $scope.reloadAddressCount();
    $scope.reloadAddress(0);
  }
  $scope.$on('userab', function() {
    $scope.searchName = false;
    $scope.recipientLookup = '';
    $scope.reloadAddressCount();
    $scope.reloadAddress(0);
  });
  /* add a new recipient */
  $scope.addNewAddress = function() {
    var address = new YD.Address()
    if ($scope.currentUser.id != undefined) {
      address.user = $scope.currentUser;
      $scope.editAddress(address);
    } else {
      //console.log("addNewAddress(): currentUser is not defined")
    }
  }

  $scope.editAddress = function(address) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_address',
      controller: 'EditAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        address: function() {
          return address
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      $scope.reloadAddress();
    })
  }

  $scope.deleteAddress = function(address) {
    //var modalInstance = $modal.open({
    //    templateUrl: 'partials/modal_deleteAddress',
    //    controller: 'DeleteAddressCtrl',
    //    scope: $scope,
    //    size: 'sm',
    //    resolve: {
    //        address: function () {
    //            return address
    //        }
    //    },
    //    windowClass: 'center-modal'
    //})
    //modalInstance.result.then(function () {
    //    $scope.reloadAddress()
    //    //console.log("Delete address: success")
    //})
    //console.log("in dielete");
    var r = confirm("是否确认删除?");
    if (!r) {

    } else {
      address.destroy().then(function(address) {
        $scope.reloadAddress();
        alert("删除成功");
      }, function(address, error) {
        alert(error.message)
      })
    }

  }

  $scope.getRecipient = function() {

    var query = new AV.Query("Address")
    query.equalTo("user", $scope.currentUser)
    query.find({
      success: function(results) {
        $scope.addressList = results
          ////console.log("GetRecipient ADDRESS got : " + results.length)
      },
      error: function(res, error) {
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
        address: function() {
          return address
        }
      },
      windowClass: 'center-modal'
    })
  }
})

YundaApp.controller('ShowRecipientDetails', function($scope, $modalInstance, address) {
  $scope.address = address;
  $scope.close = function() {
    $modalInstance.dismiss();
  }
})

YundaApp.controller('DeleteAddressCtrl', function($scope, $modalInstance, address) {
  $scope.confirmDelete = function() {
    address.destroy().then(function(address) {
      $modalInstance.close(address)
    }, function(address, error) {
      alert(error.message);
    })
  }
  $scope.cancelDelete = function() {
    $modalInstance.dismiss();
  }

})

YundaApp.controller('UpdateUserCtrl', function($scope) {
  $scope.address = new YD.Address();

  if ($scope.currentUser.addressId != undefined) {
    $scope.address.id = $scope.currentUser.addressId
    $scope.address.fetch().then(function(address) {

      if (!address) {
        $scope.address = new YD.Address();
      } else {
        $scope.address = address
      }
    });
  } else {
    $scope.address = new YD.Address();
  }


  $scope.update_user = function() {

    $scope.address.user = null;
    $scope.address.save(null, {
      success: function(address) {
        //console.log("update_user() save address success")
        $scope.currentUser.addressId = address.id
        $scope.currentUser.save(null, {
          success: function() {
            //console.log("update_user() success")
            ////console.log("update_user() success mobile: " + user.mobilePhoneNumber)
            alert("更新成功！")
          },
          error: function(user, error) {
            //console.log("update_user() fail: " + error.id + error.message)
          }
        })
      },
      error: function(a, error) {
        //console.log("update_user() save address fail : " + error.message)
      }
    })

    //$scope.currentUser.mobilePhoneNumber = '23232323'

  }
})

YundaApp.controller('freightInArrivedCtrl', function($scope, $rootScope, $modal, $filter) {
  $scope.isLoading = false;
  $scope.promote = "";
  $scope.reloadFreightInArrived = function(index) {
    if ($scope.currentUser.id != undefined) {
      var query = new AV.Query("FreightIn")
      query.equalTo("user", $scope.currentUser)
      query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE])
      query.limit($scope.LIMIT_NUMBER);
      query.skip($scope.LIMIT_NUMBER * index);
      query.descending("createdAt");
      query.find({
        success: function(results) {
          $scope.$apply(function() {
              ////console.log("FreightIn arrived is shown TRACKING: " + results[0].status)

              //$scope.freightIns = results
              $scope.freightIns = $filter('packageSearchFilter')(results, $scope.query.number);
              //console.log("freightIns got from filter");
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
                if ($scope.freightIns[i].status == YD.FreightIn.STATUS_ARRIVED)
                  $scope.freightIns[i].status = "等待入库"
                else if ($scope.freightIns[i].status == YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE)
                  $scope.freightIns[i].status = "待开箱检查"
                else if ($scope.freightIns[i].status == YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE)
                  $scope.freightIns[i].status = "已开箱检查"
              }
              //$rootScope.badgeTotalCount -= $scope.badgeACount

              //$rootScope.badgeTotalCount += $scope.badgeACount
              //console.log("Badge A now: " + $scope.badgeACount)
              //console.log("BadgeTotal now: " + $rootScope.badgeTotalCount)

            })
            ////console.log("FreightIn arrived is shown")
        },
        error: function(error) {
          alert("Getting Freight In Error: " + error.code + " " + error.message)
        }
      })
    }
  };
  $scope.$watch("query.isSearch", function(newVal) {
    $scope.reloadFreightInArrived(0);
    //$scope.$apply();
    //console.log("watch reloadFreightInArrived");
  });
  $scope.reloadFreightCount = function() {
    var query = new AV.Query(YD.FreightIn);
    query.equalTo("user", $scope.currentUser);
    query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE])
    query.count({
      success: function(count) {
        $scope.freightCount = $scope.badge.A = count;
        //$scope.freightCount = $scope.getButtonArray(count);
        //$scope.$apply();
      }
    });
  };
  $scope.reloadFreightCount();
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadFreightInArrived($scope.currentPage - 1);
  }

  $scope.$on('userbb', function(event, args) {
    $scope.query.number = undefined;
    $scope.reloadFreightInArrived(0);
  });


  $scope.searchForFreightIn = function() {
    var query = new AV.Query(YD.FreightIn);
    query.equalTo("trackingNumber", $scope.query);
    query.equalTo("user", $scope.currentUser);
    query.find({
      success: function(results) {
        $scope.$apply(function() {
          ////console.log("FreightIn arrived is shown TRACKING: " + results[0].status)
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
        ////console.log("FreightIn arrived is shown")
      },
      error: function(error) {
        alert("Getting Freight In Error: " + error.code + " " + error.message)
      }
    });
  }
  $scope.reloadFreightInArrived(0);
  $scope.openNotesWithImage = function(freightIn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_openNotesWithImage',
      controller: 'OpenNotesWithImageCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freightIn: function() {
          return freightIn
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {

    })
  }
  $scope.leaveComments = function(freightIn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_leaveComments',
      controller: 'LeaveCommentsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freightIn: function() {
          return freightIn
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
    })

  }
  $scope.freightInConfirm = function(freightIn) {
    if ($scope.currentUser.id != undefined) {
      freightIn.status = YD.FreightIn.STATUS_CONFIRMED
      freightIn.save().then(function(freightIn) {
        //console.log("freightInConfirm()-- freightIn.status updated: " + freightIn.status)
        $scope.reloadFreightInArrived()
        alert("已确认入库")

      }, function(freightIn, error) {
        //console.log(error.message)
      })
    }
  }

  $scope.checkPackage = function(freightIn) {
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
          freightIn: function() {
            return freightIn;
          }
        }
      })
      modalInstance.result.then(function(checkInfo) {
        $scope.isLoading = true;
        $scope.promote = "正在提交，请稍候...";
        freightIn.isChecking = true;
        freightIn.status = YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE;
        freightIn.checkInfo = {
          email: checkInfo.email,
          isTakingPhoto: checkInfo.isTakingPhoto,
          notes: checkInfo.notes
        }
        freightIn.save(null, {
          success: function(f) {
            $scope.reloadFreightInArrived()
              //console.log(f.status == YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE)
            $scope.isLoading = false
            $scope.promote = ""
            alert("申请验货成功!请耐心等待管理员处理，并关注此运单的管理员反馈")

          },
          error: function(f, error) {
            alert("出错！" + error.message)
            $scope.isLoading = false
            $scope.promote = ""
          }
        })

      })
    }
  }


})

YundaApp.controller('CheckPackageCtrl', function($scope, $modalInstance, freightIn) {
  $scope.checkInfo = {
    email: "",
    isTakingPhoto: false,
    notes: ""
  }

  $scope.freightIn = freightIn;
  $scope.confirm = function() {
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
  $scope.close = function() {
    $modalInstance.dismiss()
  }
})

YundaApp.controller('freightInConfirmedCtrl', function($scope, $rootScope, $modal, $filter) {
  //$scope.PRICE = 10
  $scope.insurance = {
    value: 0,
    amount: 0,
    total: 0
  };
  $scope.refreshInsurance = function() {
    $scope.insurance.value = 0;
    $scope.insurance.total = 0;
    $scope.insurance.amount = 0;
  };
  $scope.addNewAddress = function() {
    var address = new YD.Address()
    if ($scope.currentUser.id != undefined) {
      address.user = $scope.currentUser;
      $scope.editAddress(address);
    } else {
      //console.log("addNewAddress(): currentUser is not defined");
    }
  };

  $scope.editAddress = function(address) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_address',
      controller: 'EditAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        address: function() {
          return address
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      $scope.getRecipient()
        //console.log("addNewAddress(): new address is added")
    })
  }

  $scope.checkboxClick = function(f, $event) {
    f.selection = !f.selection;
    $event.stopPropagation();

  };
  $scope.checkboxClick1 = function(f, $event) {
    $scope.confirmTC = !$scope.confirmTC;
    $event.stopPropagation();
  }
  $scope.mergePackage = function() {

    var freightInList = []
    var totalWeight = 0;
    var newNumber = "";
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
        idList.push($scope.freightIns[i].id);
        referenceList.push($scope.freightIns[i].RKNumber);
      }

    }
    if (freightInList.length <= 1) {
      alert("物品合包数量必须大于一件！")
      return
    }
    //else if (totalWeight > 10) {
    //    alert("物品重量总共不得超过10磅! ");
    //    return;
    //}

    var r = confirm("是否确认合包?");
    if (!r) {
      return;
    } else {
      var freightIn = new YD.FreightIn();
      freightIn.user = $scope.currentUser;
      freightIn.weight = totalWeight;
      freightIn.trackingNumber = newNumber;
      freightIn.generateRKNumberWithCallback(function(success, reply) {
        if (!success) {
          alert("错误！: " + reply);
          return;
        } else {
          freightIn.RKNumber = reply;
          //console.log("RKNumber: " + freightIn.RKNumber);
          //console.log("right after geenerateRKNumber");
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
            success: function(f) {
              //console.log("f saved: " + f.RKNumber);
              AV.Object.saveAll(freightInList, {
                success: function(list) {
                  $scope.reloadFreightInConfirmed();
                  alert("合包成功!");
                },
                error: function(error) {
                  alert("错误! " + error.message);
                }
              });
            },
            error: function(f, error) {
              alert("错误! " + error.message)
            }
          });
        }
      });

    }
  }

  $scope.cancelMergePackage = function(freightIn) {
      var r = confirm("是否取消合包?");
      if (!r) {
        return;
      } else {
        var idList = [];
        for (var i = 0; i < freightIn.mergeReference.length; i++) {
          var id = freightIn.mergeReference[i].id;
          //console.log("id: " + id);
          idList.push(id);
        }
        var query = new AV.Query(YD.FreightIn);
        query.containedIn("objectId", idList);
        query.find({
          success: function(list) {
            for (var i = 0; i < list.length; i++) {
              var f = list[i];
              //console.log("weight: " + f.weight);
              f.status = YD.FreightIn.STATUS_CONFIRMED;
            }
            AV.Object.saveAll(list, {
              success: function(list) {
                //console.log("status has been updated back");
                freightIn.destroy({
                  success: function(obj) {
                    $scope.reloadFreightInConfirmed();
                    alert("取消成功");
                  },
                  error: function(obj, error) {
                    alert("错误! " + error.message);
                  }
                });
              },
              error: function(error) {
                alert("错误! " + error.message);
              }
            });
          },
          error: function(error) {
            alert("错误! " + error.message);
          }
        });
      }
    }
    //$scope.freight.descriptionList = [];

  $scope.addNewDescription = function(freightIn) {
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

  $scope.deleteDescrption = function(desc, freightIn) {
    for (var i = 0; i < freightIn.descriptionList.length; i++) {
      if (desc.name == freightIn.descriptionList[i].name) {
        //console.log("delete name: " + i);
        freightIn.insurance.total -= parseFloat(freightIn.descriptionList[i].total);

        freightIn.descriptionList.splice(i, 1);
      }
    }
  }

  //$scope.$watch("insurance.value", function (newVal) {
  //    if (newVal.value != 0) {
  //        //console.log("In watch: insuranceValue: " + $scope.insurance.value)
  //        $scope.insurance.amount = parseFloat(($scope.insurance.value * 0.02).toFixed(2))
  //        //console.log("In watch: insuranceAmount: " + $scope.insurance.amount)
  //
  //    } else
  //        //console.log("In watch: newVal == 0")
  //});

  $scope.rewriteFreight = function(freightIn) {
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
        //$scope.insurance.value = 0;
      freightIn.comments = "";
      $scope.confirmTC = false;
      $scope.insurance = {
        value: 0,
        amount: 0,
        total: 0
      };
    }
  }
  $scope.reloadFreightInConfirmed = function(index) {
    if ($scope.currentUser.id != undefined) {
      var query = new AV.Query("FreightIn")
      query.equalTo("user", $scope.currentUser);
      query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED);
      query.limit($scope.LIMIT_NUMBER);
      query.skip($scope.LIMIT_NUMBER * index);
      query.descending("createdAt");
      query.find({
        success: function(results) {
          $scope.freightIns = $filter('packageSearchFilter')(results, $scope.query.number);

          //$scope.freightIns = results
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
            _
            $scope.freightIns[i].createdAtToString = tmp_date;
            //$scope.freightIns[i].status = "已确认入库"
            $scope.freightIns[i].packageComments = "";

            $scope.freightIns[i].insurance = {
              value: 0,
              amount: 0,
              total: 0
            };

          }
          $scope.getRecipient();
          $scope.$apply(function() {
            //$rootScope.badgeTotalCount -= $scope.badgeBCount;
            //$rootScope.badgeTotalCount += $scope.badgeBCount;

          });
          $scope.getRecipient();
          //console.log("FreightIn confirmed is shown")
        },
        error: function(error) {
          alert("Getting Freight In Error: " + error.id + " " + error.message)
        }
      });
    }
  }
  $scope.reloadFreightInConfirmed(0);
  $scope.reloadFreightCount = function() {
    var query = new AV.Query(YD.FreightIn);
    query.equalTo("user", $scope.currentUser);
    query.equalTo("status", YD.FreightIn.STATUS_CONFIRMED);
    query.count({
      success: function(count) {
        $scope.freightCount = $scope.badge.B = count;
        //$scope.freightCount = $scope.getButtonArray(count);
        $scope.$apply();
      }
    });
  };
  $scope.reloadFreightCount();
  $scope.$watch("query.isSearch", function(newVal) {
    $scope.reloadFreightInConfirmed(0);
    //$scope.$apply();
    //console.log("watch reloadFreightInConfirmed");
  });
  $scope.$on('userbb', function(event, args) {
    $scope.query.number = undefined;
    $scope.reloadFreightInConfirmed(0);
  });

  $scope.chooseSplitType = function(freightIn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_chooseSplitType',
      controller: 'ChooseSplitTypeCtrl',
      scope: $scope,
      size: 'sm',

      windowClass: 'center-modal'
    })
    modalInstance.result.then(function(chosenType) {
      //freightIn.address = chosenAddress
      //alert("已成功选取收件人")
      if (chosenType === "normal")
        $scope.splitPackage(freightIn)
      else if (chosenType === "charge")
        $scope.splitPackagePremium(freightIn)
    })
  }
  $scope.getRecipient = function() {

    var query = new AV.Query("Address")
    query.equalTo("user", $scope.currentUser);
    query.descending("createdAt");
    query.find({
      success: function(results) {
        $scope.recipients = results
      },
      error: function(res, error) {
        alert("Getting Recipient: " + error.code + " " + error.message)
      }
    })
  }
  $scope.getRecipient();


  $scope.chooseRecipient = function(freightIn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_chooseRecipientAddress',
      controller: 'ChooseAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        addressList: function() {
          return $scope.recipients
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function(chosenAddress) {
      freightIn.address = chosenAddress
      alert("已成功选取收件人: " + freightIn.address.recipient)
    })
  }
  $scope.addNewRecipient = function() {
    var address = new YD.Address()
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_address',
      controller: 'EditAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        address: function() {
          return address
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      //console.log("addNewAddress(): new address is added")
      $scope.getRecipient()
      alert("添加新收件人成功！")
    })
  }

  $scope.splitPackage = function(freightIn) {
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
        freightIn: function() {
          return freightIn
        }
      },
      windowClass: 'center-modal'

    })
    modalInstance.result.then(function() {
      freightIn.status = YD.FreightIn.STATUS_FINISHED
      freightIn.save(null, {
          success: function(f) {
            alert("分箱完成！")
            $scope.reloadFreightInConfirmed()

          }
        })
        //console.log("addNewAddress(): new address is added")
    })
  }
  $scope.splitPackagePremium = function(freightIn) {
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
        freightIn: function() {
          return freightIn
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      freightIn.status = YD.FreightIn.STATUS_FINISHED
      freightIn.save(null, {
          success: function(f) {
            $scope.reloadFreightInConfirmed()
            alert("分箱完成！");
          }
        })
        //console.log("addNewAddress(): new address is added")
    })
  }


  $scope.cancelSplit = function(freightIn) {
    var r = confirm("是否确认取消分包?");
    if (!r) {

    } else {
      var trackingNumber = freightIn.splitReference.trackingNumber;
      var query = new AV.Query(YD.FreightIn);
      query.equalTo("splitReference.trackingNumber", trackingNumber);
      query.find({
        success: function(list) {
          //console.log("list length: " + list.length);
          AV.Object.destroyAll(list);
          query = new AV.Query(YD.FreightIn);
          query.get(freightIn.splitReference.parentId, {
            success: function(f) {
              f.status = YD.FreightIn.STATUS_CONFIRMED;
              f.save(null, {
                success: function(f) {
                  $scope.reloadFreightInConfirmed();
                  alert("操作成功!");
                },
                error: function(f, error) {
                  alert("操作失败! " + error.message);
                }
              });
            },
            error: function(freightIn, error) {
              alert("错误! " + error.message);
            }
          });
        },
        error: function(error) {
          alert("错误! " + error.message);
        }
      });
    }

  }
  $scope.confirmTC = false;
  $scope.isClicked = false;
  $scope.generateFreight = function(freightIn) {
    if (!freightIn.address) {
      alert("请先选择地址");
      //console.log("address is undefined")
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
    //var addressPt = new YD.Address();
    //addressPt.id = freightIn.address.id;
    //freight.address = addressPt;
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
    freight.RKNumber = freightIn.RKNumber;
    freight.exceedWeight = freightIn.exceedWeight;
    //freight.estimatedPrice = freightIn.weight * $scope.PRICE
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
    //console.log("finished set all");
    freight.insurance = freightIn.insurance.value * 0.02 + "(所保价值: " + freightIn.insurance.value + ")";
    //console.log("insurance: " + freight.insurance);
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
      freight.isMerged = true
      freight.mergeReference = freightIn.mergeReference
      freight.add("statusGroup", YD.Freight.STATUS_PENDING_MERGE_PACKAGE)
    }
    //console.log("finished set all, now generate YD Number");

    freight.generateYDNumber(function(success, reply) {
      if (!success) {
        alert("错误!" + reply);
        $scope.isClicked = false;
        return;
      } else {
        freight.YDNumber = reply;
        freight.save(null, {
          success: function(freight) {
            freightIn.status = YD.FreightIn.STATUS_FINISHED;
            freightIn.save(null, {
              success: function(freightIn) {
                alert("生成运单成功!");
                $scope.isClicked = false;
                $scope.reloadFreightInConfirmed();
              },
              error: function(freightIn, error) {
                $scope.isClicked = false;
                //console.log("ERROR: freightIn not save: " + error.code + " - " + error.message);
              }
            })
          },
          error: function(freight, error) {
            $scope.isClicked = false;
            if (error.code == 105) {
              alert("生成运单失败,请刷新页面重试");
            } else {
              alert("生成运单失败");
            }
            //console.log("ERROR: freight not save: " + error.code + " - " + error.message);
          }
        });
      }
    });

  }

  $scope.generateDeliveryFreight = function(freightIn) {
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
        success: function(freight) {
          //console.log("freight has been saved: " + freight.id)
          //$scope.badgeCount -= 1
          freightIn.status = YD.FreightIn.STATUS_FINISHED;
          freightIn.save(null, {
            success: function(freightIn) {
              //console.log("freightIn has been saved: " + freightIn.id)
              //$scope.badgeCount += 1
              alert("运单已生成")

            },
            error: function(freightIn, error) {
              //console.log("ERROR: freightIn not save: " + error.code + " - " + error.message)
            }
          })
        },
        error: function(freight, error) {
          //console.log("ERROR: freight not save: " + error.code + " - " + error.message)
          //console.log("ERROR: freight.status: " + typeof(freight.get("status")))
        }
      })

    }
    $scope.reloadFreightInConfirmed()
  }


  $scope.generateAllFreight = function() {
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

    modalInstance.result.then(function() {
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
});

YundaApp.controller('FreightPendingCtrl', function($scope, $modal, $rootScope, $filter) {

  $scope.getStatus = function() {

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

      //statusString.substr(0, statusString.length - 22)   //remove trailing comma
      $scope.freights[i].statusToString = statusString + '等待发货';
    }

  }
  $scope.reloadFreight = function(index) {
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
      success: function(list) {
        $scope.$apply(function() {
          $scope.freights = $filter('packageSearchFilter')(list, $scope.query.number);

          //$scope.freights = list
          for (var i = 0; i < $scope.freights.length; i++) {
            var tmp = $scope.freights[i].updatedAt
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
              tmp_date += "0" + tmp.getMinutes()
            else
              tmp_date += tmp.getMinutes();
            _
            $scope.freights[i].updatedAtToString = tmp_date
              //var descList =  $scope.freights[i].descriptionList[0];
              //
              ////console.log("$scope.freights[i: " + $scope.freights[i].packageComments);

            if ($scope.freights[i].packageComments) {
              ////console.log("$scope.freights[i: " + $scope.freights[i].packageComments);
              if ($scope.freights[i].packageComments.length > 10) {
                $scope.freights[i].brief = $scope.freights[i].packageComments.substr(0, 10) + "...";
              } else {
                $scope.freights[i].brief = $scope.freights[i].packageComments;
              }
            }
          }

          //$scope.getStatus();
        })
      }
    })
  };
  $scope.reloadFreightCount = function() {
    var query = new AV.Query(YD.Freight);
    query.containedIn("status", [YD.Freight.STATUS_INITIALIZED, YD.Freight.STATUS_REJECTED]);
    query.equalTo("user", $scope.currentUser);
    query.count({
      success: function(count) {
        //$rootScope.badgeTotalCount -= $scope.badgeECount;
        $scope.freightCount = $scope.badge.C = count;
        //$rootScope.badgeTotalCount += $scope.badgeECount;
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadFreight($scope.currentPage - 1);
  }
  $scope.reloadFreightCount();
  $scope.reloadFreight(0);
  $scope.$watch("query.isSearch", function(newVal) {
    $scope.reloadFreight(0);
    //$scope.$apply();
    //$scope.badgeECount = $scope.freights.length;

    //console.log("watch reloadFreight");
  });
  $scope.$on('userbb', function(event, args) {
    $scope.query.number = undefined;
    $scope.reloadFreightCount();
    $scope.reloadFreight(0);
  });
  $scope.deleteFreight = function(freight) {
    var r = confirm("是否确认删除?");
    if (!r) {
      return;
    } else {
      var RKNumber = freight.RKNumber;
      freight.destroy({
        success: function(f) {
          var query = new AV.Query(YD.FreightIn);
          query.equalTo("RKNumber", RKNumber);
          query.find({
            success: function(list) {
              if (list.length == 1) {
                var fIn = list[0];
                fIn.status = YD.FreightIn.STATUS_CONFIRMED;
                fIn.save(null, {
                  success: function(f) {
                    $scope.reloadFreight(0);
                    alert("删除运单成功，请重新生成运单");
                  },
                  error: function(f, error) {
                    alert("错误!" + error.message);
                  }
                });
              } else {
                alert("错误! 查到多个运单");

              }
            }
          })

        },
        error: function(f, error) {
          $scope.reloadFreight();
          alert("错误!" + error.message);
        }
      });
    }
  }
  $scope.editDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_editFreightDetails',
      controller: 'FreightDetailsCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return freight;
        }
      },
      windowClass: 'center-modal'
    });
  }


  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showOperationDetails',
      controller: 'ShowOperationDetailsCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }
})

YundaApp.controller('FreightDetailsCtrl', ["$scope", "$modalInstance", "$modal", "freight", function($scope, $modalInstance, $modal, freight) {
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
  //console.log("insurance: " + ins);
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

  //$scope.descriptionList = $scope.freight.descriptionList;
  //$scope.spareList = {};
  $scope.description = {};
  $scope.getRecipient = function() {
    var query = new AV.Query("Address");
    query.equalTo("user", $scope.currentUser);
    query.find({
      success: function(results) {
        $scope.recipients = results
      },
      error: function(res, error) {
        alert("Getting Recipient: " + error.code + " " + error.message);
      }
    })
  }
  $scope.getRecipient();


  $scope.chooseRecipient = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_chooseRecipientAddress',
      controller: 'ChooseAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        addressList: function() {
          return $scope.recipients
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function(chosenAddress) {
      $scope.freight.address = chosenAddress
      alert("已成功选取收件人: " + chosenAddress.recipient)
    })
  }
  $scope.addNewRecipient = function() {
      var address = new YD.Address()
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal_address',
        controller: 'EditAddressCtrl',
        scope: $scope,
        size: 'md',
        resolve: {
          address: function() {
            return address
          }
        },
        windowClass: 'center-modal'
      })
      modalInstance.result.then(function() {
        //console.log("addNewAddress(): new address is added")
        $scope.getRecipient()
        alert("添加新收件人成功！")
      })
    }
    /*    $scope.$watch("insurance.value", function (newVal) {
     if (newVal.value != 0) {
     //console.log("In watch: insuranceValue: " + $scope.insurance.value)
     $scope.insurance.amount = parseFloat(($scope.insurance.value * 0.02).toFixed(2))
     //console.log("In watch: insuranceAmount: " + $scope.insurance.amount)

     } else
     //console.log("In watch: newVal == 0")
     });*/
  $scope.close = function() {
    $modalInstance.dismiss();
  };

  $scope.addNewDescription = function() {
    //var newFreight = new YD.Freight();
    //newFreight.id = $scope.freight.id;
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
      success: function(f) {
        ////console.log("f info:L" + f.id + f.packageComments + f.address.recipient);
        //$scope.descriptionList.push(obj);
        $scope.insurance.total += obj.total;
        $scope.freight.packageComments += obj.brand + obj.name + "x" + obj.amount + ';\n';
        $scope.description = {};
        //$scope.freight = f;
        //$scope.descriptionList = $scope.freight.descriptionList;
        $scope.$apply();
        alert("添加成功");

      },
      error: function(f, error) {

      }
    });

  };

  $scope.deleteDescription = function(desc) {
    for (var i = 0; i < $scope.freight.descriptionList.length; i++) {
      if (desc.name == $scope.freight.descriptionList[i].name) {
        //console.log("delete name: " + i);
        $scope.freight.descriptionList.splice(i, 1);
      }
    }
    //var obj = {
    //    kind: desc.kind,
    //    name: desc.name,
    //    brand: desc.brand,
    //    amount: desc.amount,
    //    price: desc.price,
    //    total: desc.total
    //}
    //$scope.freight.remove("descriptionList", obj);
    $scope.freight.save(null, {
      success: function(f) {
        //$scope.freight = f;
        //$scope.descriptionList = f.descriptionList;
        $scope.insurance.total -= desc.total;
        $scope.$apply();
        alert("已删除");
      },
      error: function(f, error) {
        alert("错误" + error.message);
      }
    });
  };
  $scope.saveFreight = function() {
    if (!$scope.freight.address) {
      alert("请先选择地址")
        //console.log("address is undefined")
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
      ////console.log("$scope.insurance.amount: " + $scope.insurance.amount + typeof $scope.insurance.amount);
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
        ////console.log("in not 0");
      }
      //$scope.freight.descriptionList = [];
      //$scope.freight.descriptionList = $scope.descriptionList;
      $scope.freight.weight = $scope.freight.weight;
      $scope.freight.channel = $scope.freight.channel;
      $scope.freight.address = $scope.freight.address;
      $scope.freight.packageComments = $scope.freight.packageComments;
      $scope.freight.isAddPackage = $scope.freight.isAddPackage;
      $scope.freight.isReduceWeight = $scope.freight.isReduceWeight;

      $scope.freight.save(null, {
        success: function(f) {
          alert("修改成功!");
          $modalInstance.close();
        },
        error: function(f, error) {
          alert("错误!" + error.message);
          $modalInstance.dismiss();
        }
      });
    }
  }

}]);

YundaApp.controller('ChooseAddressCtrl', function($scope, $modalInstance, addressList) {
  $scope.addressList = addressList
  $scope.count = addressList.length;
  $scope.description = {};
  $scope.chooseRecipient = function(address) {
    $scope.address = address
      //console.log("chosen address: " + address.recipient)

  }
  $scope.cancel = function() {
    $modalInstance.dismiss()
  }
  $scope.confirmChoose = function() {
    $modalInstance.close($scope.address)
  }
  $scope.reloadAddress = function(index) {
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
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadAddress($scope.currentPage - 1);
  }
})


YundaApp.controller('mergePackageCtrl', function($scope, $modalInstance, freightInList, $modal) {
  $scope.checkboxModel = {}
  $scope.checkboxModel.addPackage = false
  $scope.freightInList = freightInList

  //
  //$scope.mergeChooseRecipient = function (address) {
  //    $scope.chosenAddress = address
  //    //console.log("Chosen Address: " + $scope.chosenAddress.country)
  //
  //}
  $scope.getRecipient = function() {

    var query = new AV.Query("Address")
    query.equalTo("user", $scope.currentUser)
    query.find({
      success: function(results) {
        $scope.addressList = results
      },
      error: function(res, error) {
        alert("Getting Recipient: " + error.code + " " + error.message)
      }
    })
  }
  $scope.getRecipient()


  $scope.chooseRecipient = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_chooseRecipientAddress',
      controller: 'ChooseAddressCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        addressList: function() {
          return $scope.addressList
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function(chosenAddress) {
      $scope.chosenAddress = chosenAddress
      alert("已成功选取收件人: " + chosenAddress.recipient)
    })
  }
  $scope.addNewRecipient = function() {
    var address = new YD.Address()
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_address',
      controller: 'EditAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        address: function() {
          return address
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      //console.log("addNewAddress(): new address is added")
      $scope.getRecipient()
      alert("添加新收件人成功！")
    })
  }
  $scope.confirmMergePackage = function() {

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

    if ($scope.checkboxModel.addPackage == true) {
      freight.add("statusGroup", YD.Freight.STATUS_PENDING_EXTRA_PACKAGING)
    }
    freight.isMerge = true

    freight.save(null, {
      success: function(freight) {
        //console.log("freight has been saved: " + freight.id)
        for (var i = 0; i < freight.statusGroup.length; i++) {
          //console.log("In MergeCtrl -- status: " + freight.statusGroup[i])
        }

        for (var i = 0; i < freight.freightInGroup.length; i++) {
          //console.log("In MergeCtrl -- freightin: " + freight.freightInGroup[i])
        }

        for (var i = 0; i < freightInList.length; i++) {
          freightInList[i].status = YD.FreightIn.STATUS_FINISHED
        }
        AV.Object.saveAll(freightInList, {
          success: function(list) {
            //console.log("mergePackage: freightList has been saved")
            $modalInstance.close()
          },
          error: function(error) {
            //console.log("ERROR: mergePackage: freightList has not been saved" + error.id + " - " + error.message)
          }
        })
      },
      error: function(freight, error) {
        //console.log("ERROR: freight not save: " + error.code + " - " + error.message)
      }
    })


  }

  $scope.cancelMergePackage = function() {
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
          //console.log("LeaveNoteCtrl -- freight.id: " + $scope.freightIn.notes)
      })

    },
    error: function(f, error) {
      //console.log("LeaveNoteCtrl -- ERR: " + error.message)
    }
  })

  $scope.saveComments = function() {
    $scope.freightIn.save(null, {
      success: function(f) {
        //console.log("LeaveNoteCtrl -- ")
        $modalInstance.close()
      },
      error: function(f) {
        //console.log("LeaveNotesCtrl -- ERR: " + error.message)
      }
    })
  }
  $scope.close = function() {
    $modalInstance.dismiss()
  }
})

YundaApp.controller('fileUploadCtrl', function($scope) {
  //$scope.identityFrontList
  //$scope.identityBackList
  $scope.filesChangedFront = function(elm) {
    $scope.identityFront = elm.files
    $scope.$apply()
  }

  $scope.filesChangedBack = function(elm) {
    $scope.identityBack = elm.files
    $scope.$apply()
  }
  $scope.uploadIdentity = function() {
    ////console.log("In fileUpload back: " + $scope.identityBack)
    ////console.log("In fileUpload front: " + $scope.identityFront)

    if ($scope.identityFront != undefined) {
      ////console.log("In fileUpload back: " + $scope.identityFront[0].name)
      ////console.log("In fileUpload front: " + $scope.identityBack[0].name)
      var frontName = $scope.currentUser.realName + 'front.jpg'
      var backName = $scope.currentUser.realName + 'back.jpg'
      var avFileFront = new AV.File(frontName, $scope.identityFront[0])
      var avFileBack = new AV.File(backName, $scope.identityBack[0])

      $scope.currentUser.identityFront = avFileFront
      $scope.currentUser.identityBack = avFileBack
      $scope.currentUser.save(null, {
        success: function(img) {
          //console.log("In FileUploadCtrl: ID image has been saved")
        },
        error: function(img, error) {
          //console.log("ERROR: In FileUploadCtrl: ID image not been saved: " + error.id + error.message)

        }
      })
    } else {
      alert("Please upload file first")
    }
  }

})

YundaApp.controller('FreightConfirmedCtrl', function($scope, $rootScope, $modal) {
  //$scope.baojin = 0
  //$scope.baoshuijin = 0
  $scope.BAO_JIN = 0.02
  $scope.BAO_SHUI_JIN = 0.05
    //$scope.smallPackageInitial = $rootScope.systemSetting.smallPackageInitial
    //$scope.smallPackageContinue = $rootScope.systemSetting.smallPackageContinue
    //$scope.normalPackageInitial = $rootScope.systemSetting.normalPackageInitial
    //$scope.normalPackageContinue = $rootScope.systemSetting.normalPackageContinue
    //$scope.PRICE = 8
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
    //status to string
  $scope.getStatus = function() {

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

      //statusString.substr(0, statusString.length - 22)   //remove trailing comma
      $scope.freights[i].statusToString = statusString
    }

  }

  //$scope.output = function() {
  //    //console.log("$scope.selectedMethod: " + $scope.selectedMethod.name)
  //
  //    //console.log("$scope.selectedMethod: " + ($scope.selectedMethod.name === '小包裹渠道'))
  //}
  $scope.reloadFreightConfirmed = function() {
    if ($scope.currentUser.id != undefined) {
      //console.log("reloadFreightConfirmned: FREIGHT")
      var query = new AV.Query(YD.Freight);
      query.equalTo("user", $scope.currentUser)
      query.equalTo("status", YD.Freight.STATUS_PENDING_FINISHED)
      query.include("user")
      query.find({
        success: function(results) {
          $scope.freights = results
            //Provide delivery method options based on $rootScope.isSmallPackageAllowed
          if (!$rootScope.systemSetting.isSmallPackageAllowed) {
            $scope.options = [{
              name: "普通渠道"
            }]
          }
          //get ready for payment selection checkboxes.
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
          $scope.$apply(function() {
              $rootScope.badgeTotalCount -= $scope.badgeCCount
              $scope.badgeCCount = results.length
              $rootScope.badgeTotalCount += $scope.badgeCCount
                //console.log("Badge C now: " + $scope.badgeCCount)
                //console.log("BadgeTotal now: " + $rootScope.badgeTotalCount)
            })
            //console.log("Freight confirmed is shown, length: " + $scope.freights.length)


        },
        error: function(error) {
          alert("Getting Freight Error: " + error.code + " " + error.message)
        }
      })
    }
  }

  $scope.reloadFreightConfirmed()

  $scope.provideOptions = function() {
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

  //$scope.insurance = {value: 0, amount: 0}


  $scope.$watch("insurance.value", function(newVal) {
    if (newVal.value != 0) {
      //console.log("In watch: insuranceValue: " + $scope.insurance.value)
      $scope.insurance.amount = ($scope.insurance.value * $scope.BAO_JIN).toFixed(2)
        //console.log("In watch: insuranceAmount: " + $scope.insurance.amount)

    } else {
      //console.log("In watch: newVal == 0")
    }
  });

  $scope.selecting = function(freight) {
    if (freight.selection == true) {
      $scope.total += freight.estimatedPrice
      $scope.totalWeight += freight.weight
        //$scope.totalAmount += 1
      $scope.provideOptions()
      if (freight.exceedWeight != undefined) {
        if (freight.exceedWeight > freight.weight)
          $scope.exceedWeight.amount += freight.exceedWeight - freight.weight
      }
    }
    if (freight.selection == false) {
      $scope.total -= freight.estimatedPrice
      $scope.totalWeight -= freight.weight
        //$scope.totalAmount -= 1
      $scope.provideOptions()
      if (freight.exceedWeight != undefined) {
        if (freight.exceedWeight > freight.weight)
          $scope.exceedWeight.amount -= freight.exceedWeight - freight.weight
      }
    }
  }


  $scope.payment = function() {
    var paymentAmount = 0;
    var NUMBER = 'number';
    if ($scope.confirmTC == false) {
      alert("付款必须先同意条款")
      return
    } else if ($scope.reward.amount > $scope.currentUser.accumulatedReward) {
      //console.log("reward.amount: " + $scope.reward.amount + " | user.reward: " + $scope.currentUser.accumulatedReward)
      alert("输入使用YD币大于账户现有YD币，请重新输入")
      return
    } else if ($scope.selectedMethod.name == undefined) {
      alert("请先选择运输渠道!")
      return
    } else if ($scope.confirmInsurance && $scope.insurance.value <= 0) {
      alert("请输入正确的总申报价值!")
      return
    } else if ($scope.confirmTaxInsurance && $scope.taxInsurance.amount <= 0) {
      alert("请输入正确的总保税金比例!")
      return
    } else if ($scope.confirmReward && $scope.reward.amount <= 0) {
      alert("请输入正确的使用YD币点数!")
      return
    } else if (typeof($scope.reward.amount) != 'number' || typeof($scope.insurance.value) != 'number' || typeof($scope.taxInsurance.amount) != 'number') {
      alert("请输入数字金额！")
        //console.log("TYPE is: " + typeof($scope.insurance.value))
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
      if ($scope.totalWeight < 2) {
        $scope.totalWeight = 2
      }
      if ($scope.selectedMethod.name === '小包裹渠道') {
        var FIRST_CHARGE = $scope.smallPackageInitial
        var CONTINUE_CHARGE = $scope.smallPackageContinue
        paymentAmount = FIRST_CHARGE + ($scope.totalWeight - 1) * CONTINUE_CHARGE
      } else if ($scope.selectedMethod.name === '普通渠道') {
        var FIRST_CHARGE = $scope.normalPackageInitial
        var CONTINUE_CHARGE = $scope.normalPackageContinue
        paymentAmount = FIRST_CHARGE + ($scope.totalWeight - 1) * CONTINUE_CHARGE
      }

      if ($scope.confirmInsurance && $scope.confirmTaxInsurance && $scope.confirmReward) { //add insurance, tax insurance and use reward
        paymentAmount = paymentAmount + parseInt($scope.insurance.amount) + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 - parseFloat((parseInt($scope.reward.amount) / 100).toFixed(2)) + $scope.exceedWeight.amount

      } else if ($scope.confirmTaxInsurance && $scope.confirmReward) { // add tax insurance, and use reward
        paymentAmount = paymentAmount + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 - parseFloat((parseInt($scope.reward.amount) / 100).toFixed(2)) + $scope.exceedWeight.amount

      } else if ($scope.confirmInsurance && $scope.confirmReward) { // add insurance, and use reward
        paymentAmount = paymentAmount + parseInt($scope.insurance.amount) - parseFloat((parseInt($scope.reward.amount) / 100).toFixed(2)) + $scope.exceedWeight.amount

      } else if ($scope.confirmInsurance && $scope.confirmTaxInsurance) { // add insurance and tax insurance
        paymentAmount = paymentAmount + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 + parseInt($scope.insurance.amount) + $scope.exceedWeight.amount

      } else if ($scope.confirmTaxInsurance) { // add tax insurance
        paymentAmount = paymentAmount + paymentAmount * parseInt($scope.taxInsurance.amount) / 100 + $scope.exceedWeight.amount

      } else if ($scope.confirmInsurance) { // add insurance
        paymentAmount = paymentAmount + parseInt($scope.insurance.amount) + $scope.exceedWeight.amount

      } else if ($scope.confirmReward) { // use reward
        paymentAmount = paymentAmount - parseFloat((parseInt($scope.reward.amount) / 100).toFixed(2)) + $scope.exceedWeight.amount

      } else {}

      //console.log("In payment -- here is the paymentAmount: " + paymentAmount)
      //console.log("In payment -- here is the userbalance: " + $scope.currentUser.balance)
      //console.log("In payment -- here is the balanceInDollar: " + $scope.currentUser.balanceInDollar)


      if ($scope.currentUser.totalBalanceInDollar < paymentAmount) {
        alert("账户余额不足，请先充值!")
          //console.log("balance not enough")
        return
      } else {
        //$scope.currentUser.balanceInDollar -= paymentAmount
        ////console.log("balance - success")
        if ($scope.currentUser.rewardBalanceInDollar >= paymentAmount) {
          $scope.currentUser.rewardBalanceInDollar -= paymentAmount;
        } else {
          var rest = paymentAmount - $scope.currentUser.rewardBalanceInDollar;
          $scope.currentUser.rewardBalanceInDollar = 0;
          $scope.currentUser.balanceInDollar -= rest;
        }
        var transaction = new YD.Transaction()
          //transaction.record = data;
        transaction.status = YD.Transaction.STATUS_CONSUME;
        transaction.amount = paymentAmount * -1;
        transaction.user = $scope.currentUser
        $scope.currentUser.accumulatedReward += Math.round(paymentAmount)
        transaction.save(null, {
          success: function(t) {
            //console.log("transaction saved")
            AV.Object.saveAll(paymentList, {
              success: function(list) {
                //console.log("confirmSplit: freightList has been saved")
                $scope.currentUser.save(null, {
                  success: function(user) {
                    //console.log("currentUser balance saved")
                    alert("扣款成功,系统自动赠送相应YD币！剩余金额为: $" + user.balanceInDollar + ", 当前YD币为: " + user.accumulatedReward)
                    $scope.reloadFreightConfirmed()
                  },
                  error: function(user, err) {
                    //console.log("Substrat balance err: " + err.message)
                  }
                })
              },
              error: function(freights, error) {
                //console.log("ERROR: confirmSplit: freightList has not been saved" + error.id + " - " + error.message)
              }
            })
          },
          error: function(t, error) {
            //console.log("transaction not saved " + error.message)
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

    modalInstance.result.then(function() {
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
      error: function(f, error) {
        alert("错误！")
          //console.log("ERROR: " + error.message)
        $modalInstance.dismiss()
      }
    })
  }
  $scope.close = function() {
    $modalInstance.dismiss()
  }
})

YundaApp.controller('FreightDeliveryCtrl', function($scope, $rootScope, $filter, $modal) {
  $scope.reloadFreight = function(index) {
    if ($scope.currentUser.id != undefined) {
      //console.log("reoloadFreight: FREIGHT")

      var query = new AV.Query(YD.Freight);
      query.equalTo("user", $scope.currentUser);
      query.include("shipping");
      query.include("user");

      query.containedIn("status", [YD.Freight.STATUS_PENDING_DELIVERY, YD.Freight.STATUS_DELIVERING, YD.Freight.STATUS_PASSING_CUSTOM, YD.Freight.STATUS_FINAL_DELIVERY, YD.Freight.STATUS_DELIVERED])
      query.limit($scope.LIMIT_NUMBER);
      query.skip($scope.LIMIT_NUMBER * index);
      query.descending("createdAt");
      query.find({
        success: function(results) {
          $scope.freights = $filter('packageSearchFilter')(results, $scope.query.number);
          //console.log("In DELIV: " + $scope.query.number);

          //$scope.freights = results
          //console.log("Freight DELIVERY confirmed is shown, length: " + results.length)
          var statusToString = ""
          for (var i = 0; i < $scope.freights.length; i++) {
            ////console.log("In for loop, status is: " + statusToString)

            if ($scope.freights[i].status == YD.Freight.STATUS_PENDING_DELIVERY)
              statusToString = "待处理";
            else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERING)
              statusToString = "已发货";
            else if ($scope.freights[i].status == YD.Freight.STATUS_PASSING_CUSTOM)
              statusToString = "清关中";
            else if ($scope.freights[i].status == YD.Freight.STATUS_FINAL_DELIVERY)
              statusToString = "已出关";
            //else if ($scope.freights[i].status == YD.Freight.STATUS_DELIVERED)
            //    statusToString = "已到达";
            //
            $scope.freights[i].statusToString = statusToString;
            ////console.log("statusToSTring: " + $scope.freights[i].statusToString)
            var tmp = $scope.freights[i].createdAt
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
              tmp_date += "0" + tmp.getMinutes();
            else
              tmp_date += tmp.getMinutes();
            _
            $scope.freights[i].createdAtToString = tmp_date;
          }

          //console.log("Freight delivery confirmed is shown")

        },
        error: function(error) {
          alert("ERROR: Getting Freight delivery: " + error.id + " " + error.message)
        }
      })
    }
  };
  $scope.reloadFreightCount = function() {
    var query = new AV.Query(YD.Freight);
    query.equalTo("user", $scope.currentUser);
    query.containedIn("status", [YD.Freight.STATUS_PENDING_DELIVERY, YD.Freight.STATUS_DELIVERING, YD.Freight.STATUS_PASSING_CUSTOM, YD.Freight.STATUS_FINAL_DELIVERY, YD.Freight.STATUS_DELIVERED])
    query.count({
      success: function(count) {
        //$rootScope.badgeTotalCount -= $scope.badgeDCount;
        $scope.freightCount = $scope.badge.D = count;
        //$rootScope.badgeTotalCount += $scope.badgeDCount;
      }
    })
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadFreight($scope.currentPage - 1);
  }

  $scope.reloadFreightCount();
  $scope.reloadFreight(0);
  $scope.$watch("query.isSearch", function(newVal) {
    $scope.reloadFreight(0);
    //$scope.$apply();
    //$scope.badgeDCount = $scope.freights.length;

    //console.log("watch reloadFreight");
  });

  $scope.$on('userbb', function(event, args) {
    $scope.query.number = undefined;
    $scope.reloadFreightCount();
    $scope.reloadFreight(0);
  });

  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_freightFullDetail',
      controller: 'FreightFullDetailCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }

});

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
        $scope.$apply(function() {
          $scope.freights = list
            //console.log("In ChangeAddressCtrl -- find F: " + list.length)

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
      error: function(error) {
        //console.log("ERROR Reloading: " + error.message)
      }

    })
  }
  $scope.reloadChangeAddress()

  $scope.searchForFreight = function() {
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
        //console.log("ref: " + ref)
      query.get(ref, {
        success: function(f) {
          //console.log("Found freight:  " + f.status)
          $scope.freight = f
          var addressToString = ""
          if ($scope.freight.address != undefined) {
            $scope.freight.recipient = $scope.freight.address.recipient
            addressToString = $scope.freight.address.country + $scope.freight.address.state + $scope.freight.address.city + $scope.freight.address.suburb + $scope.freight.address.street1
            if ($scope.freight.address.street2 != undefined) {
              addressToString += $scope.freight.address.street2
            }
            $scope.origin.address = addressToString
              //console.log("freightaddress: " + $scope.freight.address)
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
        addressList: function() {
          return $scope.recipientAddresses
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function(chosenAddress) {
      $scope.changeAddressFreight.address = chosenAddress
      $scope.chosenAddress = chosenAddress.recipient + chosenAddress.country + chosenAddress.state + chosenAddress.city + chosenAddress.suburb + chosenAddress.street1
      if (chosenAddress.street2 != undefined) {
        $scope.chosenAddress += chosenAddress.street2
      }

      //alert("已成功选取收件人")
      $scope.ischosenAddress = true
    })
  }

  $scope.addNewRecipient = function() {
    var address = new YD.Address()
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_address',
      controller: 'EditAddressCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        address: function() {
          return address
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      //console.log("addNewAddress(): new address is added")
      $scope.reloadAddress();
    })


  }

  $scope.applyChangeAddress = function() {
    $scope.changeAddressFreight.user = $scope.currentUser
    $scope.changeAddressFreight.status = YD.FreightChangeAddress.STATUS_AWAITING
    $scope.changeAddressFreight.save(null, {
      success: function(f) {
        //console.log("In ChangeAddressCtrl -- f.id: " + f.id);
        alert("申请成功，请等待处理");
        $scope.reloadChangeAddress();
      },
      error: function(f, error) {
        alert("申请失败！" + error.message)
          //console.log("ERR: " + error.message)
      }
    })
  }

})

YundaApp.controller('DashboardSearchCtrl', function($scope, $modal) {
    $scope.trackingInfo = function() {
      ////console.log("tracking info: " + $scope.trackingList)
      $scope.trackingList = $scope.trackingNumber.split("\n")
      for (var i = 0; i < $scope.trackingList.length; i++) {
        //console.log("NOW SPLIT: " + i + " - " + $scope.trackingList[i])
      }
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
      query.find({
        success: function(list) {
          if (list.length != 0) {
            //6917246211814
            //8498950010019
            var modalInstance = $modal.open({
              templateUrl: 'partials/modal_tracking',
              controller: 'TrackingCtrl',
              scope: $scope,
              windowClass: 'center-modal',
              size: 'lg',
              resolve: {
                resultList: function() {
                  return list;
                }
              }
            });

          } else {
            alert("没有结果！")
            return
          }
        },
        error: function(error) {
          //console.log("LF FIn ERROR: " + error.message)
        }
      })

    }
  })
  /* Edit address controller */

YundaApp.controller('EditAddressCtrl', function($scope, $modalInstance, address) {
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
  $scope.filesChangedFront = function(elm) {
    $scope.identityFront = elm.files
    $scope.$apply()
  }

  $scope.filesChangedBack = function(elm) {
    $scope.identityBack = elm.files
    $scope.$apply()
  }
  $scope.uploadIdentity = function() {
    ////console.log("In fileUpload back: " + $scope.identityBack[0])
    ////console.log("In fileUpload front: " + $scope.identityFront[0])

    if ($scope.identityFront != undefined && $scope.identityBack != undefined) {
      ////console.log("In fileUpload back: " + $scope.identityFront[0].name)
      ////console.log("In fileUpload front: " + $scope.identityBack[0].name)
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

  $scope.saveAddressSubmit = function() {
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
YundaApp.controller('SplitPackageCtrl', function($scope, $modalInstance, freightIn) {
  $scope.notes
  $scope.package = {
    amount: 0
  }
  $scope.isPremium = false
  $scope.getRecipient()

  $scope.freightList = []
  $scope.generateFreightList = function() {
    ////console.log("changed to: " + $scope.amount)
    $scope.freightList = []
    for (var i = 0; i < $scope.package.amount; i++) {
      var index = i + 1;

      $scope.freightList[i] = new YD.FreightIn();
      //$scope.freightList[i].freightIn = freightIn
      //$scope.freightList[i].RKNumber = $scope.freightList[i].generateRKNumber();
      $scope.freightList[i].RKNumber = freightIn.RKNumber + "[分包:" + index + "/" + $scope.package.amount + "]";

      $scope.freightList[i].status = YD.FreightIn.STATUS_CONFIRMED;
      var statusList = []
        //statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
        //$scope.freightList[i].statusGroup = statusList


      $scope.freightList[i].user = freightIn.user;
      $scope.freightList[i].splitReference = {
        index: index,
        parentId: freightIn.id,
        trackingNumber: freightIn.trackingNumber,
        RKNumber: freightIn.RKNumber
      };

      //"普通分箱" + index + "/" + $scope.amount + ", 原单号为: " + freightIn.trackingNumber
      $scope.freightList[i].isSplit = true;
      $scope.freightList[i].trackingNumber = freightIn.trackingNumber + "[分包:" + index + "/" + $scope.package.amount + "]";
      $scope.freightList[i].weight = parseFloat((freightIn.weight / $scope.package.amount).toFixed(2));
      if (i == 0) {
        $scope.freightList[i].isChargeSplit = true;
      }
    }
  };
  //$scope.splitChooseRecipient = function (address, freight) {
  //    freight.address = address
  //}
  $scope.close = function() {
    $modalInstance.dismiss();
  }
  $scope.confirmSplit = function() {

    AV.Object.saveAll($scope.freightList, {
      success: function(list) {
        $modalInstance.close();
        //console.log("confirmSplit: freightList has been saved")
      },
      error: function(error) {
        //console.log("ERROR: confirmSplit: freightList has not been saved")
      }
    })
  }
})

YundaApp.controller('SplitPackagePremiumCtrl', function($scope, $modalInstance, freightIn) {
    $scope.notes
    $scope.package = {
      amount: 0
    }
    $scope.getRecipient()
    $scope.isPremium = true
    $scope.freightList = []

    $scope.generateFreightList = function() {
        ////console.log("changed to: " + $scope.amount)
        $scope.freightList = [];
        for (var i = 0; i < $scope.package.amount; i++) {
          $scope.freightList[i] = new YD.FreightIn();
          var index = i + 1;

          //$scope.freightList[i].freightIn = freightIn

          //$scope.freightList[i].RKNumber = $scope.freightList[i].generateRKNumber();
          $scope.freightList[i].RKNumber = freightIn.RKNumber + "[分包:" + index + "/" + $scope.package.amount + "]";

          //console.log("[" + i + "]: " + $scope.freightList[i].RKNumber);

          $scope.freightList[i].status = YD.FreightIn.STATUS_CONFIRMED
          var statusList = []
            //statusList.push(YD.Freight.STATUS_PENDING_SPLIT_PACKAGE)
            //$scope.freightList[i].statusGroup = statusList
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
      //$scope.splitChooseRecipient = function (address, freight) {
      //    freight.address = address
      //}
    $scope.close = function() {
      $modalInstance.dismiss()
    }
    $scope.confirmSplit = function() {
      AV.Object.saveAll($scope.freightList, {
        success: function(list) {
          $modalInstance.close()

          //console.log("confirmSplit: freightList has been saved")
        },
        error: function(error) {
          //console.log("ERROR: confirmSplit: freightList has not been saved")
        }
      })
    }

  })
  /* update password*/
YundaApp.controller('UpdatePasswordCtrl', function($scope, $modalInstance) {
  $scope.savePassword = function() {
    //$scope.currentUser.password = $scope.newPassword;
    $scope.currentUser.setPassword($scope.newPassword);
    $scope.currentUser.save().then(function(user) {
      alert("修改成功");

      $modalInstance.close(user);
    });
  }
})

YundaApp.controller('UpdateUsernameCtrl', ["$scope", "$modalInstance", function($scope, $modalInstance) {
  $scope.saveUsername = function() {
    //$scope.currentUser.password = $scope.newPassword;
    $scope.isLoading = true;
    $scope.promote = "请稍候...";
    var query = new AV.Query(YD.User);
    query.equalTo("username", $scope.newUsername);
    query.count({
      success: function(count) {
        console.log("$scope.newUsername: " + $scope.newUsername + " | " + count);
        if (count == 0) {
          $scope.currentUser.username = $scope.currentUser.email = $scope.newUsername;
          $scope.currentUser.save().then(function(user) {
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
  $scope.close = function() {
    $modalInstance.dismiss();
  }
}])
YundaApp.controller('RechargeCtrl', function($scope, $rootScope, $modal) {
  $scope.FIXED_RATE = $rootScope.rate;
  $scope.$watch('CNY', function(newVal) {
    if (newVal != 0 || newVal != undefined) {
      $scope.USD = ((newVal / $scope.FIXED_RATE) * (1 + 0.29) + 0.3).toFixed(2)
      $scope.USD = parseFloat($scope.USD)
    }
  }, true);


  $scope.stripePayment = function() {
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
    });

    modalInstance.result.then(function() {
      alert("充值成功!");
    });
  };


})


YundaApp.controller('StripeCtrl', function($scope, $rootScope, $modalInstance, USD) {
  $scope.USD = USD
  $scope.isPaid = false
  $scope.stripeCallback = function(status, response) {
    //$http.post('https://api.stripe.com/v1/charges', { token: response.id })
    //console.log("STRIPECTRL Token: " + response.id)
    $scope.isLoading = true
    $scope.promote = "正在支付，请稍候..."
    $scope.isPaid = true
    AV.Cloud.run('createCharge', {
      //source: response.id,
      source: response.id,
      amount: $scope.USD * 100,
      currency: 'usd',
      description: $scope.currentUser.realName
    }, {
      success: function(data) {
        var transaction = new YD.Transaction()
        transaction.record = data;
        transaction.status = YD.Transaction.STATUS_STRIPE;
        transaction.amount = $scope.USD;
        transaction.user = $scope.currentUser
        transaction.save(null, {
          success: function(t) {
            //console.log("transaction saved, now user balance: " + $scope.currentUser.balanceInDollar)
            $scope.currentUser.balanceInDollar = $scope.currentUser.balanceInDollar + t.amount
              //console.log("+= balanceInDollar: " + $scope.currentUser.balanceInDollar + " | t.amount: " + t.amount)
            $scope.currentUser.save(null, {
              success: function(u) {
                //console.log("user saved, now user balance: " + $scope.currentUser.balanceInDollar)

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
          error: function(t, error) {
            //console.log("transaction not saved " + error.id + ' - ' + error.message)
          }
        })
      },
      error: function(error) {

      }
    })
  }
});

YundaApp.controller('ZhifubaoCtrl', function($scope, $rootScope, $http, $location) {
  //$scope.FIXED_RATE = parseFloat($scope.systemSetting.get("rate"));
  $scope.FIXED_RATE = 6.4;
  $scope.rechargeAmount = 0
  $scope.rechargeAmountDollar = 0
  $scope.record = ''
  $scope.isLoading = false;
  $scope.promote = ""

  $scope.reloadZhifubao = function() {
    var query = new AV.Query("Transaction")
    query.equalTo("user", $scope.currentUser)
    query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_PENDING]);
    query.find({
      success: function(list) {
        //console.log("In ZhifubaoCtrl -- :" + list.length)
        $scope.$apply(function() {
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
  $scope.reloadZhifubao();
  //$scope.$on('userca', function(event, args) {
  //    $scope.reloadZhifubao();
  //});

  $scope.$watch('rechargeAmount', function(newVal) {
    if (newVal != 0 || newVal != undefined) {
      //console.log($scope.rechargeAmount + " | " + newVal + typeof newVal + " | " + $scope.FIXED_RATE + typeof $scope.FIXED_RATE + newVal / $scope.FIXED_RATE + " | " + (parseInt(newVal) / $scope.FIXED_RATE).toFixed(2) + " | "
      //+ parseFloat((parseInt(newVal) / $scope.FIXED_RATE).toFixed(2)));
      $scope.rechargeAmountDollar = newVal / $scope.FIXED_RATE;
      //$scope.rechargeAmountDollar = parseFloat($scope.rechargeAmountDollar)
      //console.log("changed; " + $scope.rechargeAmountDollar);
    }
  }, true);

  $scope.submitAlipay = function() {
    if ($scope.rechargeAmountDollar != NaN || $scope.rechargeAmountDollar == "") {
      // call alipay web api
      //console.log("call post now");
      var transaction = new YD.Transaction();
      //not yet
      //transaction.status = YD.Transaction.STATUS_ZHIFUBAO;
      var userPt = new YD.User();
      userPt.id = $scope.currentUser.id;
      transaction.user = userPt;
      transaction.amount = $scope.rechargeAmount / $scope.FIXED_RATE;
      transaction.status = YD.Transaction.STATUS_ZHIFUBAO_PENDING;
      transaction.yuanInCent = $scope.rechargeAmount * 100;
      transaction.save(null, {
        success: function(t) {
          //console.log("t saved id: " + t.id + " | " + $scope.currentUser.id);
          $http.post('/pay', {
            total_fee: $scope.rechargeAmount,
            tranId: t.id,
            userId: $scope.currentUser.id
          }).success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available

            //console.log(data + status + headers + config);
            //tabWindowId.location.href = headers('Location');

            $rootScope.alipayData = data;
            $location.path('/pay');
          });
        },
        error: function(t, error) {
          alert("错误!" + error.message);
        }
      });
      //var tabWindowId = window.open('about:blank', '_blank');

    } else {
      //console.log("no");
    }
  };
  //$scope.zhifubaoPayment = function () {
  //    $scope.isPaying = true;
  //    $scope.isLoading = true;
  //    $scope.promote = "正在提交，请稍候..."
  //    if ($scope.rechargeAmount <= 0 || typeof($scope.rechargeAmount) != typeof(1)) {
  //        alert("请输入正确充值金额！")
  //        $scope.isPaying = false;
  //        $scope.isLoading = false;
  //        $scope.promote = "";
  //        return
  //    }
  //    if ($scope.record == undefined || $scope.record == '') {
  //        alert("请先输入支付宝交易号！")
  //        $scope.isPaying = false;
  //        $scope.isLoading = false;
  //        $scope.promote = "";
  //        return
  //    }
  //    else {
  //        var transaction = new YD.Transaction()
  //        transaction.status = YD.Transaction.STATUS_ZHIFUBAO;
  //        transaction.amount = parseFloat($scope.rechargeAmountDollar)
  //        transaction.user = $scope.currentUser
  //        transaction.record = $scope.record
  //        //console.log("In Zhifubao Ctrl -- rechargeAmount: " + $scope.rechargeAmount + " | type: " + typeof($scope.rechargeAmount))
  //        //console.log("In Zhifubao Ctrl -- rechargeAmountDollar: " + $scope.rechargeAmountDollar + " | type: " + typeof($scope.rechargeAmountDollar))
  //        $scope.currentUser.pendingBalanceInDollar = parseFloat(($scope.currentUser.pendingBalanceInDollar + (parseInt($scope.rechargeAmount) / $scope.FIXED_RATE)).toFixed(2))
  //        //console.log("user pendingBalance: " + $scope.currentUser.pendingBalance)
  //        //console.log("user pendingBalanceInDollar: " + $scope.currentUser.pendingBalanceInDollar)
  //        if ($scope.currentUser == undefined) {
  //            alert('系统错误，请重新登陆！')
  //            return
  //        }
  //        transaction.save(null, {
  //            success: function (t) {
  //                //console.log("transaction saved")
  //                $scope.currentUser.save(null, {
  //                    success: function (u) {
  //                        //console.log("user pendingbalance: " + u.pendingBalance)
  //                        alert("提交成功！待处理账户金额为: $" + u.pendingBalanceInDollar + ",请等待管理员处理 ")
  //                        $scope.reloadZhifubao()
  //                        $scope.isPaying = false;
  //                        $scope.isLoading = false;
  //                        $scope.promote = "";
  //                    }
  //                })
  //            },
  //            error: function (t, error) {
  //                //console.log("transaction not saved " + error.id + ' - ' + error.message);
  //                $scope.reloadZhifubao()
  //                $scope.isPaying = false;
  //                $scope.isLoading = false;
  //                $scope.promote = "";
  //            }
  //        })
  //    }
  //}
});

YundaApp.controller('AlipayCtrl', ["$scope", "$rootScope", "$sce", function($scope, $rootScope, $sce) {
  $scope.data = $sce.trustAsHtml($rootScope.alipayData);
  console.log("Data: " + $rootScope.alipayData);
}]);

YundaApp.controller('ConsumeRecordCtrl', function($scope) {

  $scope.open1 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened1 = true;
  }

  $scope.open2 = function($event) {
      $event.preventDefault()
      $event.stopPropagation()
      $scope.opened2 = true;
    }
    //$scope.showCMD = function() {
    //    //console.log('Show dt1: ' + $scope.dt1)
    //}
  $scope.reloadTransaction = function(index) {
    if ($scope.currentUser.id != undefined) {

      //console.log("reloadTransaction: Transaction")

      var query = new AV.Query("Transaction")
      query.equalTo("user", $scope.currentUser)
        //query.greaterThanOrEqualTo("createdAt", $scope.dt1)
        //query.lessThanOrEqualTo("createdAt", $scope.dt2)
      query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE, YD.Transaction.STATUS_CONSUME_ADD_PACKAGE, YD.Transaction.STATUS_CONSUME_RETURN_GOODS, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_DEBIT_USER]);
      query.limit($scope.LIMIT_NUMBER);
      query.skip($scope.LIMIT_NUMBER * index);
      query.descending("createdAt");
      query.find({
        success: function(tList) {
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

          //console.log("DatePicker: get all transaction successful: " + tList.length)
        },
        error: function(tList, err) {
          //console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

        }
      })
    }
  };
  $scope.reloadTransactionCount = function() {
    var query = new AV.Query("Transaction");
    query.equalTo("user", $scope.currentUser);
    //query.greaterThanOrEqualTo("createdAt", $scope.dt1)
    //query.lessThanOrEqualTo("createdAt", $scope.dt2)
    query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE, YD.Transaction.STATUS_CONSUME_ADD_PACKAGE, YD.Transaction.STATUS_CONSUME_RETURN_GOODS, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_DEBIT_USER]);

    query.count({
      success: function(count) {
        $scope.tCount = count;
        //console.log("HERE----- " + count + "| " + $scope.tCount);
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadTransaction($scope.currentPage - 1);
  }

  $scope.reloadTransactionCount();
  //$scope.reloadTransaction();
  $scope.$on('usercc', function(event, args) {
    $scope.reloadTransaction(0);

  });

  $scope.reloadSelectedTransaction = function() {
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
          ////console.log("date 1: " + $scope.dt1)
          ////console.log("date 2: " + $scope.dt2)
          //console.log("reloadTransaction: Transaction")

        var query = new AV.Query("Transaction")
        query.equalTo("user", $scope.currentUser)
        query.greaterThanOrEqualTo("createdAt", $scope.dt1)
        query.lessThanOrEqualTo("createdAt", $scope.dt2)
        query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE, YD.Transaction.STATUS_CONSUME_ADD_PACKAGE, YD.Transaction.STATUS_CONSUME_RETURN_GOODS, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_DEBIT_USER]);

        query.find({
          success: function(tList) {
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

            //console.log("DatePicker: get all transaction successful: " + tList.length)
          },
          error: function(tList, err) {
            //console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

          }
        })
      } else {
        alert("请先选择日期")
      }
    }
  }
})


YundaApp.controller('RechargeRecordCtrl', function($scope) {
  $scope.Math = Math;
  $scope.open1 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened1 = true;
    //console.log("opened1: " + $scope.opened1)

  }

  $scope.open2 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened2 = true;
    //console.log("opened2: " + $scope.opened2)


  }
  $scope.reloadTransaction = function(index) {
    if ($scope.currentUser.id != undefined) {

      var query = new AV.Query("Transaction")
        //query.greaterThanOrEqualTo("createdAt", $scope.dt1)
        //query.lessThanOrEqualTo("createdAt", $scope.dt2)
      query.equalTo("user", $scope.currentUser)
      query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_PENDING, YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED, YD.Transaction.STATUS_STRIPE, YD.Transaction.STATUS_CREDIT_USER, YD.Transaction.STATUS_CLAIM_REWARD]);
      query.limit($scope.LIMIT_NUMBER);
      query.skip($scope.LIMIT_NUMBER * index);
      query.descending("createdAt");
      query.find({
        success: function(tList) {
          $scope.transactionList = tList
          for (var i = 0; i < tList.length; i++) {
            if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO) {
              $scope.transactionList[i].statusToString = '支付宝充值'
            } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_STRIPE) {
              $scope.transactionList[i].statusToString = '信用卡充值'

            } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO_PENDING) {
              $scope.transactionList[i].statusToString = '支付宝充值(未完成)'

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
          //console.log("DatePicker: get all transaction successful: " + tList.length)
        },
        error: function(tList, err) {
          //console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

        }
      })

    }

  }
  $scope.reloadTransactionCount = function() {
    var query = new AV.Query("Transaction");
    //query.greaterThanOrEqualTo("createdAt", $scope.dt1)
    //query.lessThanOrEqualTo("createdAt", $scope.dt2)
    query.equalTo("user", $scope.currentUser)
    query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_PENDING, YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED, YD.Transaction.STATUS_STRIPE, YD.Transaction.STATUS_CREDIT_USER, YD.Transaction.STATUS_CLAIM_REWARD]);
    query.count({
      success: function(count) {
        $scope.tCount = count;
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadTransaction($scope.currentPage - 1);
  }

  $scope.reloadTransactionCount();

  //$scope.reloadTransaction();
  $scope.$on('usercb', function(event, args) {
    $scope.reloadTransaction(0);

  });

  $scope.reloadSelectedTransaction = function() {
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
          ////console.log("date 1: " + $scope.dt1)
          ////console.log("date 2: " + $scope.dt2)
          //console.log("TRANSACTION 2: FREIGHT")

        var query = new AV.Query("Transaction")
        query.greaterThanOrEqualTo("createdAt", $scope.dt1)
        query.lessThanOrEqualTo("createdAt", $scope.dt2)
        query.equalTo("user", $scope.currentUser)
        query.containedIn("status", [YD.Transaction.STATUS_ZHIFUBAO, YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED, YD.Transaction.STATUS_STRIPE, YD.Transaction.STATUS_CREDIT_USER, YD.Transaction.STATUS_CLAIM_REWARD]);
        query.find({
          success: function(tList) {
            $scope.transactionList = tList
            for (var i = 0; i < tList.length; i++) {
              if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO) {
                $scope.transactionList[i].status = '支付宝充值'
              } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_STRIPE) {
                $scope.transactionList[i].status = '信用卡充值'

              } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED) {
                //$scope.transactionList[i].status = '支付宝充值'

              } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CREDIT_USER) {
                $scope.transactionList[i].status = '系统赠款'

              } else if ($scope.transactionList[i].status == YD.Transaction.STATUS_CLAIM_REWARD) {
                $scope.transactionList[i].status = 'YD币兑换'
              }
              var tmp = $scope.transactionList[i].createdAt;
              var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
              if (tmp.getMinutes() < 10)
                tmp_date += "0" + tmp.getMinutes()
              else
                tmp_date += tmp.getMinutes();
              _
              $scope.transactionList[i].createdAtToString = tmp_date
            }
            $scope.$apply()
              //console.log("DatePicker: get all transaction successful: " + tList.length)
          },
          error: function(tList, err) {
            //console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

          }
        })
      } else {
        alert("请先选择日期");
      }
    }
  }
})

YundaApp.controller('RewardCtrl', ["$scope", function($scope) {
  $scope.amount = 0;
  $scope.isLoading = false;
  $scope.promote = "";
  $scope.isTransfer = false;


  $scope.transferReward = function() {
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
        success: function(user) {
          //console.log("user balance is added");
          var transaction = new YD.Transaction();
          transaction.status = YD.Transaction.STATUS_CLAIM_REWARD;
          transaction.amount = $scope.amount / 100;
          transaction.notes = "YD币兑换";
          var userPt = new YD.User();
          userPt.id = $scope.currentUser.id;
          transaction.user = userPt;
          transaction.save(null, {
            success: function(t) {
              $scope.isLoading = false;
              $scope.promote = "";
              $scope.isTransfer = false;
              $scope.reloadRewardRecord();
              alert("兑换成功！");
            },
            error: function(t, error) {
              alert("错误!" + error.message);
            }
          })
        }
      });
    }
  }
  $scope.reloadRewardRecord = function(index) {
    var query = new AV.Query(YD.Transaction);
    query.equalTo("user", $scope.currentUser);
    query.containedIn("status", [YD.Transaction.STATUS_CLAIM_REWARD, YD.Transaction.STATUS_CONSUME_YD_REWARD, YD.Transaction.STATUS_GET_YD_REWARD]);
    query.limit($scope.LIMIT_NUMBER);
    query.skip($scope.LIMIT_NUMBER * index);
    query.descending("createdAt");
    query.find({
      success: function(list) {
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

        }
        $scope.$apply();
      }
    });
  };
  $scope.reloadRewardCount = function() {
    var query = new AV.Query(YD.Transaction);
    query.equalTo("user", $scope.currentUser);
    query.containedIn("status", [YD.Transaction.STATUS_CLAIM_REWARD, YD.Transaction.STATUS_CONSUME_YD_REWARD, YD.Transaction.STATUS_GET_YD_REWARD]);
    query.count({
      success: function(count) {
        $scope.tCount = count;
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadRewardRecord($scope.currentPage - 1);
  }
  $scope.reloadRewardCount();
  //$scope.reloadRewardRecord();
  $scope.$on('usercd', function() {
    $scope.reloadRewardRecord(0);

  });


  $scope.open1 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened1 = true;
    //console.log("opened1: " + $scope.opened1)

  }

  $scope.open2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation()
    $scope.opened2 = true;

    //console.log("opened2: " + $scope.opened2)


  }

  $scope.reloadSelectedTransaction = function() {
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
          ////console.log("date 1: " + $scope.dt1)
          ////console.log("date 2: " + $scope.dt2)
          ////console.log("TRANSACTION 2: FREIGHT")

        var query = new AV.Query(YD.Transaction)
        query.greaterThanOrEqualTo("createdAt", $scope.dt1)
        query.lessThanOrEqualTo("createdAt", $scope.dt2)
        query.equalTo("user", $scope.currentUser)
        query.equalTo("status", YD.Transaction.STATUS_CLAIM_REWARD);
        query.find({
          success: function(tList) {
            $scope.transactions = tList
            for (var i = 0; i < tList.length; i++) {
              var tmp = $scope.transactions[i].createdAt
              var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
              if (tmp.getMinutes() < 10)
                tmp_date += "0" + tmp.getMinutes()
              else
                tmp_date += tmp.getMinutes();
              _
              $scope.transactions[i].createdAtToString = tmp_date
            }
            $scope.$apply()
              //console.log("DatePicker: get all transaction successful: " + tList.length)
          },
          error: function(tList, err) {
            //console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

          }
        })
      } else {
        alert("请先选择日期")
      }
    }
  }

}]);


YundaApp.controller('AdminCtrl', function($scope, $rootScope) {
  $scope.oneAtATime = true
  $scope.openTab = {
    setE: false,
    setF: false,
    setG: false,
    setH: false
  }
  $scope.view_tab = "bb";
  $scope.openTab.setF = true;
  $scope.change_tab = function(tab) {

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
  $scope.adminBadge.X = 0;
  $scope.adminBadge.Y = 0;


  $scope.isLoading = false
  $scope.promote = undefined
  $scope.showProgressBar = function(message) {
    $scope.isLoading = true
    $scope.promote = message
  }
  $scope.hideProgressBar = function() {
    $scope.isLoading = false
    $scope.promote = undefined
      //$scope.$apply()
      //console.log("probar hidden ")
  }

})

YundaApp.controller('AdminFreightInArriveCtrl', function($scope, $rootScope, $modal) {
  $scope.freightIn;
  var user;
  $scope.isLoading = false;
  $scope.promote = "";
  $scope.reloadFreightIn = function(index) {
    var query = new AV.Query("FreightIn")
      //query.containedIn("status", [YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE]);
    query.exists("checkInfo");
    query.include("user");
    query.limit($scope.LIMIT_NUMBER);
    query.skip($scope.LIMIT_NUMBER * index);
    query.descending("createdAt");
    //query.descending("updatedAt");
    if ($scope.searchName) {
      var innerQuery = new AV.Query(YD.User);
      innerQuery.equalTo("stringId", $scope.queryString);
      query.matchesQuery("user", innerQuery);
    }
    if ($scope.searchRK) {
      query.equalTo("RKNumber", $scope.queryNumber);
    }
    query.find({
      success: function(list) {
        $scope.$apply(function() {
          //$rootScope.badgeAdminTotalCount -= $scope.badgeAAdminCount
          //$rootScope.badgeAdminTotalCount += $scope.badgeAAdminCount
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
            $scope.freightIn[i].createdAtToString = tmp_date;
          }
        })
      }
    })
  };
  $scope.$on('adminbz', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchRK = false;
    $scope.queryNumber = '';
    $scope.reloadCount();
    $scope.reloadFreightIn(0);
  });
  $scope.reloadCount = function() {
    var query = new AV.Query("FreightIn")
      //query.containedIn("status", [YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE]);
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
      success: function(list) {
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
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadFreightIn($scope.currentPage - 1);
  }

  $scope.reloadCount();

  $scope.searchingRK = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CHECK_PACKAGE) {
      alert("您没有权限");
      return;
    }
    $scope.searchName = false;
    $scope.searchRK = true;
    $scope.reloadCount();
    $scope.reloadFreightIn(0);

  }

  $scope.searching = function() {
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
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadFreightIn(0);
  }
  $scope.addNotes = function(freightIn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addNotes',
      controller: 'AddNotesCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight_obj: function() {
          var tmp = {
            freight: freightIn,
            type: "freightIn"
          }
          return tmp
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
    })
  }
  $scope.chargingCheck = function(freightIn) {
    $scope.isLoading = true;
    $scope.promote = "正在处理...";
    //var twoTransactions = false;
    //var saveRewardTransaction = false;
    //var rest = 0;
    //var rewardBalance = freightIn.user.rewardBalanceInDollar;
    var amount = $scope.systemSetting.checkPackageCharge;
    //if (freightIn.user.rewardBalanceInDollar != 0) {
    //    if (freightIn.user.rewardBalanceInDollar > amount) {
    //        saveRewardTransaction = true;
    //    } else {
    //        rest = amount - freightIn.user.rewardBalanceInDollar;
    //        twoTransactions = true;
    //        saveRewardTransaction = true;
    //    }
    //}
    //// YD Reward can only be used for delivery
    //saveRewardTransaction = false;


    AV.Cloud.run('chargingUserWithoutReward', {
      amount: amount,
      userId: freightIn.user.id,
      notes: "验货收费",
      RKNumber: freightIn.RKNumber,
      //YDNumber: 0,
      status: YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE
    }, {
      success: function() {
        //var transaction = new YD.Transaction();
        //var userPt = new YD.User();
        //userPt.id = freightIn.user.id;
        //transaction.user = userPt;
        //transaction.amount = amount;
        //transaction.status = YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE;
        //transaction.notes = "验货";
        //transaction.RKNumber = freightIn.RKNumber;
        //transaction.isCredit = false;
        //transaction.save(null, {
        //    success: function (t) {
        freightIn.isCheckingCharged = true;
        freightIn.save(null, {
          success: function(f) {
            //                var newT = new YD.Transaction();
            //                var userPt = new YD.User();
            //                userPt.id = freightIn.user.id;
            //                newT.user = userPt;
            //                newT.amount = Math.round(amount);
            //                newT.status = YD.Transaction.STATUS_GET_YD_REWARD;
            //                newT.notes = "验货赠送";
            //                newT.RKNumber = freightIn.RKNumber;
            //                newT.save(null, {
            //                    success: function (t) {
            $scope.isLoading = false;
            $scope.promote = "";
            $scope.reloadFreightIn(0);
            $scope.$apply();
            alert("操作成功！");
          },
          error: function(t, error) {
            alert("错误! " + error.message);
          }
        });
        //
        //            }
        //        });
        //    },
        //    error: function (t, error) {
        //        $scope.isLoading = false
        //        $scope.promote = ""
        //        $scope.$apply();
        //        alert("错误! " + error.message);
        //    }
        //});

      },
      error: function(error) {
        alert("失败!" + error.message);
        //console.log(" ERROR: " + error.message);
        $scope.isLoading = false;
        $scope.promote = "";
        $scope.$apply();
      }
    });
  };

  $scope.freightInDelivered = function(freightIn) {
    freightIn.status = YD.FreightIn.STATUS_ARRIVED
    freightIn.save(null, {
      success: function(f) {
        alert("已更改状态！");
        $scope.reloadFreightIn(0);
      },
      error: function(f, error) {
        alert("出错！" + error.message)
      }
    })

  }

  $scope.freightInAddInfo = function(freightIn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addCheckingInfo',
      controller: 'CheckingInfoCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        freightIn: function() {
          return freightIn
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function(freightIn) {
      freightIn.status = YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE
      freightIn.isChecking = false;
      freightIn.save(null, {
        success: function(f) {
          alert("确认成功");
        },
        error: function(f, error) {
          alert("错误!" + error.message);
        }
      });
    });
  }

  $scope.showDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetails',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    })
  }

});

YundaApp.controller("AddNotesCtrl", function($scope, $modalInstance, freight_obj) {
  $scope.freight = freight_obj.freight
  var subClass
  if (freight_obj.type == "freightIn") {
    subClass = YD.FreightIn
  } else {
    subClass = YD.Freight
  }

  $scope.save = function() {
    $scope.freight.save(null, {
      success: function(f) {
        //console.log("saved: " + f.notes)
        $modalInstance.close()
      },
      error: function(f, error) {
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

  $scope.filesChangedFront = function(elm) {
      $scope.identityFront = elm.files
      $scope.$apply()
    }
    //$scope.save = function () {
    //    ////console.log("In fileUpload back: " + $scope.identityBack)
    //    ////console.log("In fileUpload front: " + $scope.identityFront)
    //
    //    if ($scope.identityFront != undefined) {
    //        $scope.isLoading = true
    //        $scope.promote = "正在保存留言和照片..."
    //        ////console.log("In fileUpload back: " + $scope.identityFront[0].name)
    //        ////console.log("In fileUpload front: " + $scope.identityBack[0].name)
    //        var frontName = freightIn.id + 'evidence.jpg'
    //        $scope.freightIn.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
    //        $scope.freightIn.status = YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE
    //        $scope.freightIn.save(null, {
    //            success: function (f) {
    //                //console.log("In CheckingInfoCtrl -- upload sucessful")
    //                $scope.$apply(function () {
    //                    $scope.isLoading = false
    //                    $scope.promote = ""
    //
    //                })
    //                $modalInstance.close()
    //            },
    //            error: function (error) {
    //                alert("照片上传不成功！" + error.message)
    //                $modalInstance.dismiss()
    //            }
    //        })
    //
    //    } else {
    //        alert("请先上传验货照片")
    //        return
    //    }
    //}
  $scope.save = function() {
    $modalInstance.close($scope.freightIn);
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

YundaApp.controller("AdminSystemCtrl", function($scope, $rootScope) {

  $scope.newChannel = {};
  $scope.newAddress = {};
  //var query = new AV.Query(YD.SystemSetting);
  //var id = "557a8a2fe4b0fe935ead7847";
  //query.get(id, {
  //    success: function(s) {
  //       $scope.setting = s;
  //        $scope.setting.addressList = [];
  //        $scope.setting.channelList = [];
  //    }
  //});
  //$scope.channelList = [];
  //$scope.addressList = [];

  $scope.confirm = function() {
    //$scope.setting.save(null, {
    //    success: function (s) {
    //        alert("修改已保存！")
    //        $rootScope.reloadSystemSetting()
    //
    //    },
    //    error: function (s, error) {
    //        alert("系统错误！" + error.message)
    //    }
    //})
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_SETTING) {
      alert("您没有权限");
      return;
    }
    $scope.systemSetting.save(null, {
      success: function(s) {
        alert("修改已保存");
        $scope.reloadSystemSetting();
      },
      error: function(s, error) {
        alert("错误" + error.message);
      }
    });

  }

  $scope.addNewAddress = function() {
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
      //$rootScope.systemSetting.addUnique("addressList", obj);
    var setting = new YD.SystemSetting();
    setting.id = "557a8a2fe4b0fe935ead7847";
    setting.addUnique("addressList", $scope.newAddress);
    setting.save(null, {
      success: function(s) {
        alert("添加成功");
        $scope.newAddress = {};
        $scope.reloadSystemSetting();

      }
    });
    //$scope.setting.addUnique("addressList", obj);
    //$scope.newAddress = {};
  };
  $scope.addNewChannel = function() {
    //$rootScope.systemSetting.addUnique("channelList", $scope.newChannel);
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_SETTING) {
      alert("您没有权限");
      return;
    }
    var setting = new YD.SystemSetting();
    setting.id = "557a8a2fe4b0fe935ead7847";
    setting.addUnique("pricing", $scope.newChannel);
    setting.save(null, {
      success: function(s) {
        alert("添加成功");
        $scope.newChannel = {};
        $scope.reloadSystemSetting();
        $scope.$apply();
      }
    });

  };
  $scope.saveAddress = function(address) {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM && $scope.currentUser.role != YD.User.ROLE_ADMIN_SYSTEM_SETTING) {
      alert("您没有权限");
      return;
    }
    var setting = new YD.SystemSetting();
    setting.id = "557a8a2fe4b0fe935ead7847";
    //setting.remove("channelList", address);
    setting.save(null, {
      success: function(s) {
        alert("地址删除成功");
        $scope.reloadSystemSetting();

      }
    });
  }
  $scope.deleteChannel = function(channel) {
    if (confirm("是否确定删除?") == true) {
      var setting = new YD.SystemSetting();
      setting.id = "557a8a2fe4b0fe935ead7847";
      setting.fetch({
        success: function(setting) {
          //setting.remove("channelList", channel);
          for (var i = 0; i < setting.pricing.length; i++) {
            if (setting.pricing[i].name == channel.name) {
              setting.pricing.splice(i, 1);

            }
          }
          setting.save(null, {
            success: function(s) {
              alert("渠道删除成功");
              $scope.reloadSystemSetting();
            }
          });
        },
        error: function(setting, error) {
          //console.log("Error fetching " + error.message);
        }
      });
    }
  }

  $scope.deleteAddress = function(address) {
    if (confirm("是否确定删除?") == true) {
      var setting = new YD.SystemSetting();
      setting.id = "557a8a2fe4b0fe935ead7847";

      //var query = new AV.Query(YD.SystemSetting);
      //var id = "557a8a2fe4b0fe935ead7847";
      setting.fetch({
        success: function(setting) {
          //setting.remove("addressList", address);
          for (var i = 0; i < setting.addressList.length; i++) {
            if (setting.addressList[i].name == address.name && setting.addressList[i].street == address.street) {
              setting.addressList.splice(i, 1);

            }
          }
          setting.save(null, {
            success: function(s) {
              alert("删除成功");
              $scope.reloadSystemSetting();
            }
          });
        }
      });
    }
  }

})

YundaApp.controller("AdminNewsCtrl", ["$scope", "$rootScope", "$modal", function($scope, $rootScope, $modal) {
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
    if ($scope.newNews.title == undefined || $scope.newNews.link == undefined) {
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

  $scope.editNews = function(news) {
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
        news: function() {
          return news
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      $rootScope.reloadNews()
      alert("编辑新闻成功!")
        //console.log("Notes(): user's notes added")
    })
  }

  $scope.confirmDeleteNews = function(news) {
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
    modalInstance.result.then(function() {
      $scope.deleteNews(news)
    })
  }

  $scope.deleteNews = function(news) {
    news.destroy({
      success: function(n) {
        $rootScope.reloadNews()
        alert("删除成功！")
      },
      error: function(n, error) {
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

YundaApp.controller('AdminFreightInConfirmCtrl', function($scope, $rootScope, $modal) {
  $scope.freightIn;
  $scope.Math = Math;
  $scope.showDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetails',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    })
  }


  $scope.reloadFreightIn = function(index) {
    var query = new AV.Query(YD.FreightIn);
    query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_CONFIRMED, YD.FreightIn.STATUS_FINISHED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE]);
    query.equalTo("isHidden", false);
    query.ascending("status");
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
      success: function(list) {
        $scope.freightIn = list;
        $scope.$apply(function() {
          for (var i = 0; i < $scope.freightIn.length; i++) {
            $scope.freightIn[i].selection = false
            var tmp = $scope.freightIn[i].createdAt
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
              tmp_date += "0" + tmp.getMinutes();
            else
              tmp_date += tmp.getMinutes();
            _
            $scope.freightIn[i].createdAtToString = tmp_date;
          }
        })
      }
    });
  };
  $scope.freightCount = $scope.adminBadge.B = 0;
  $scope.reloadFreightCount = function() {
    var isSkipK = false;
    var query = new AV.Query(YD.FreightIn);
    query.containedIn("status", [YD.FreightIn.STATUS_ARRIVED, YD.FreightIn.STATUS_CONFIRMED, YD.FreightIn.STATUS_FINISHED, YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE, YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE]);
    query.equalTo("isHidden", false);
    query.ascending("status");
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
      success: function(list) {
        $scope.freightCount += list.length;
        $scope.adminBadge.B += list.length
        for (var i = 0; i < list.length; i++) {
          if (list[i].status < 200 || list[i].status >= 300) {
            $scope.adminBadge.B--;
          }
        }
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
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadFreightIn($scope.currentPage - 1);
  }

  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_FREIGHT) {
    //alert("您没有权限");
    //console.log("In if: " + $scope.currentUser.role + " | " + $scope.currentUser.role == YD.User.ROLE_DEVELOPER);
    return;
  } else {
    $scope.freightCount = 0;
    $scope.adminBadge.B = 0;
    $scope.reloadFreightIn(0);
    $scope.reloadFreightCount();

  };

  $scope.$on('adminba', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchTN = false;
    $scope.queryNumber = '';
    $scope.freightCount = 0;
    $scope.adminBadge.B = 0;
    $scope.reloadFreightCount();
    $scope.reloadFreightIn(0);
  });
  $scope.addNotes = function(freightIn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addNotes',
      controller: 'AddNotesCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight_obj: function() {
          var tmp = {
            freight: freightIn,
            type: "freightIn"
          }
          return tmp
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
    })
  }

  $scope.searchingTN = function() {
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
  $scope.searching = function() {
    //console.log("role: " + $scope.currentUser.role);
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
  $scope.deleteFreightIn = function(f) {
    var r = confirm("是否确认删除运单? (物品入库已超过60天)");
    if (!r) {} else {

      f.status = YD.FreightIn.STATUS_CANCELED;
      f.save(null, {
        success: function() {
          $scope.reloadFreightIn();
          alert("删除成功");
        },
        error: function(f, error) {
          alert(error.message);
        }
      });
    }
  }
});

YundaApp.controller("AdminFreightConfirmCtrl", function($scope, $rootScope, $window, $modal, $filter) {
  $scope.showDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetails',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    })
  }
  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_freightFullDetail',
      controller: 'FreightFullDetailCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }
  $scope.showDetailsWithMerge = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetailsWithMerge',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    })
  }
  $scope.getStatus = function() {
    for (var i = 0; i < $scope.freight.length; i++) {
      //$scope.freight[i].statusToString = " "
      $scope.freight[i].isMerge = false
      var statusList = $scope.freight[i].statusGroup
      var statusString = ''

      if ($scope.freight[i].statusGroup != undefined) {
        for (var j = 0; j < statusList.length; j++) {
          if (statusList[j] == YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION) {
            statusString += "等待用户最后确认; "
              ////console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
          }

          if (statusList[j] == YD.Freight.STATUS_PENDING_EXTRA_PACKAGING) {
            statusString += "等待加固; "
              ////console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
          }

          if (statusList[j] == YD.Freight.STATUS_PENDING_REDUCE_WEIGHT) {
            statusString += "等待去发票; "
              ////console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
          }

          if (statusList[j] == YD.Freight.STATUS_PENDING_CHECK_PACKAGE) {
            statusString += "等待开箱检查; "
              ////console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
          }

          if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE) {
            statusString += "等待普通分箱; "
              ////console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
          }

          if (statusList[j] == YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_PREMIUM) {
            statusString += "等待精确分箱; "
              ////console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
          }

          if (statusList[j] == YD.Freight.STATUS_PENDING_MERGE_PACKAGE) {
            statusString += "等待合包; "
            $scope.freight[i].isMerge = true
              ////console.log("FREIGHT_STATUS_TO_STRING: " + statusString)
          }
        }
      }
      $scope.freight[i].statusToString = statusString
    }

  }
  $scope.reloadFreight = function() {
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
      success: function(list) {
        $scope.$apply(function() {
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
            isMerged: true
          }, true);
          $scope.reloadNormal(0);
          $scope.reloadSplit(0);
          $scope.reloadMerge(0);
        });
      },
      error: function(error) {
        //console.log("AdminFregihtConfirmCtr ERR: " + error.message)
      }
    });
  };
  $scope.setPageNormal = function() {
    $scope.currentPageNormal = $scope.inputPage;
    $scope.reloadNormal($scope.currentPageNormal - 1);
  };
  $scope.setPageSplit = function() {
    $scope.currentPageSplit = $scope.inputPage;
    $scope.reloadSplit($scope.currentPageSplit - 1);
  };
  $scope.setPageMerge = function() {
    $scope.currentPageMerge = $scope.inputPage;
    $scope.reloadMerge($scope.currentPageMerge - 1);
  };
  $scope.reloadNormal = function(index) {
    $scope.showNormal = [];
    for (var i = index * $scope.LIMIT_NUMBER; i < $scope.LIMIT_NUMBER * (index + 1); i++) {
      if ($scope.normalFreights[i]) {
        var f = $scope.normalFreights[i];
        $scope.showNormal.push(f);
      }
    }
  };
  $scope.reloadSplit = function(index) {
    $scope.showSplit = [];
    for (var i = index * $scope.LIMIT_NUMBER; i < $scope.LIMIT_NUMBER * (index + 1); i++) {
      if ($scope.splitFreights[i]) {
        var f = $scope.splitFreights[i];
        $scope.showSplit.push(f);
      }
    }
  };
  $scope.reloadMerge = function(index) {
    $scope.showMerge = [];
    for (var i = index * $scope.LIMIT_NUMBER; i < $scope.LIMIT_NUMBER * (index + 1); i++) {
      if ($scope.mergeFreights[i]) {
        var f = $scope.mergeFreights[i];
        $scope.showMerge.push(f);
      }
    }
  };

  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_PENDING) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadFreight();
  }
  $scope.$on('adminbb', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchYD = false;
    $scope.queryNumber = '';
    $scope.reloadFreight();
  });
  $scope.searchingYD = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_PENDING) {
      alert("您没有权限");
      return;
    }
    $scope.searchYD = true;
    $scope.searchName = false;
    $scope.reloadFreight();
  }

  $scope.searching = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_PENDING) {
      alert("您没有权限");
      return;
    }
    $scope.searchYD = false;
    $scope.searchName = true;
    $scope.reloadFreight();
  }
  $scope.showDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showFreightNumbers',
      controller: 'ShowFreightNumbersCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }

  $scope.printAll = function() {
    $rootScope.freightList = []
    for (var i = 0; i < $scope.freight.length; i++) {
      if ($scope.freight[i].selection == true) {
        //console.log("This one " + i + "has been added")
        //$scope.generateFreight($scope.freightIn[i])
        //$scope.reloadFreightInConfirmed()
        $rootScope.freightList.push($scope.freight[i])
      }
    }
    $scope.reloadFreight()

    //$window.location.href = '/partials/print'
  }

  $scope.printFreight = function(freight) {
    $rootScope.printFreight = {};
    $rootScope.printFreight = freight;
    ////console.log("YD: " + $rootScope.printFreight.YDNumber);
  }
  $scope.addNotes = function(freightIn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addNotes',
      controller: 'AddNotesCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight_obj: function() {
          var tmp = {
            freight: freightIn,
            type: "freightIn"
          }
          return tmp
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
    })
  }

  $scope.showIdentityDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_identityDetail',
      controller: 'IdentityDetailCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    })
  };

  $scope.confirmFreightOpt = function(freight) {
    freight.isOperated = true;
    freight.printDisabled = false;
    if (freight.isSplit || freight.isSplitPremium) {
      var RKNumber = freight.RKNumber.substr(0, 12);
      var query = new AV.Query(YD.FreightIn);
      //console.log("Confirm Opt: RKNumber: " + RKNumber);
      query.startsWith("RKNumber", RKNumber);
      query.find({
        success: function(list) {
          //console.log("Confirm OPT: " + list.length);
          for (var i = 0; i < list.length; i++) {
            list[i].isOperating = true;
          }
          AV.Object.saveAll(list, {
            success: function(list) {
              freight.save(null, {
                success: function(f) {
                  alert("已确认操作");
                },
                error: function(f, error) {
                  alert("错误: " + error.message);
                }
              });
            }
          });
        }
      });
    } else {
      freight.save(null, {
        success: function(f) {
          alert("已确认操作");
        },
        error: function(f, error) {
          alert("错误: " + error.message);
        }
      });
    }
  };

  $scope.confirmAllFreightOpt = function() {
    var list = [];
    for (var i = 0; i < $scope.freight.length; i++) {
      if ($scope.freight[i].selection) {
        $scope.freight[i].isOperated = true;
        $scope.freight[i].printDisabled = false;
        list.push($scope.freight[i]);
      }
    }
    AV.Object.saveAll(list, {
      success: function(list) {

      }
    });

  };
  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showOperationDetails',
      controller: 'ShowOperationDetailsCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }
})


YundaApp.controller('ShowOperationDetailsCtrl', ["$scope", "$modalInstance", "freight", function($scope, $modalInstance, freight) {
  $scope.freight = freight;
  //console.log("userid: " + freight.user.stringId);
  $scope.close = function() {
    $modalInstance.dismiss();
  }
}]);

YundaApp.controller('ShowFreightNumbersCtrl', ["$scope", "$modalInstance", "freight", function($scope, $modalInstance, freight) {
  $scope.freight = freight;
  $scope.close = function() {
    $modalInstance.dismiss();
  }
}])
YundaApp.controller('AdminFreightFinishCtrl', function($scope, $modal) {
  $scope.showDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetails',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    })
  }
  $scope.reloadFreight = function() {
    //console.log("finished print")
    var query = new AV.Query(YD.Freight)
    query.equalTo("status", YD.Freight.STATUS_PENDING_FINISHED)
    query.include("user")
    query.find({
      success: function(list) {
        $scope.$apply(function() {
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
      error: function(error) {
        //console.log("AdminAdminFreightFinishCtrl ERROR: " + error.message)
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
        freight_obj: function() {
          var tmp = {
            freight: freight,
            type: "freight"
          }
          return tmp
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
    })
  }

})


YundaApp.controller('IdentityDetailCtrl', ["$scope", "$modalInstance", "freight", function($scope, $modalInstance, freight) {
  $scope.freight = freight;
  $scope.close = function() {
    $modalInstance.dismiss();
  }
}]);

YundaApp.controller('ShowConsumeDetailsCtrl', ["$scope", "$modalInstance", "freight", function($scope, $modalInstance, freight) {
  $scope.isLoading = true;
  $scope.promote = "正在读取...";
  var query1 = new AV.Query(YD.Transaction);
  query1.equalTo("YDNumber", freight.YDNumber);
  //query.equalTo("user", freight.user);
  var newQ = new AV.Query(YD.Transaction);
  newQ.equalTo("RKNumber", freight.RKNumber);
  var query = AV.Query.or(query1, newQ);
  query.find({
    success: function(list) {
      $scope.transactions = list;
      //console.log("list length" + list.length);
      for (var i = 0; i < list.length; i++) {
        var tmp = $scope.transactions[i].createdAt

        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
        if (tmp.getMinutes() < 10)
          tmp_date += "0" + tmp.getMinutes()
        else
          tmp_date += tmp.getMinutes();
        $scope.transactions[i].createdAtToString = tmp_date
      }
      //query.equalTo("RKNumber", freight.RKNumber);
      //query.find({
      //    success: function (rest) {
      //        if (rest) {
      //            for (var i = 0; i < rest.length; i++) {
      //                $scope.transactions.push(rest[i]);
      //            }
      //            ;
      $scope.isLoading = false;
      $scope.promote = "";
      alert("有" + list.length + "个结果");
      $scope.$apply();
      //        }
      //    },
      //    error: function (error) {
      //        alert("错误" + error.message);
      //        $modalInstance.dismiss();
      //    }
      //});
    },
    error: function(error) {
      alert("错误" + error.message);
      $modalInstance.dismiss();
    }
  });
  $scope.close = function() {
    $modalInstance.dismiss();
  }
}]);

YundaApp.controller('AdminManualCtrl', ["$scope", "$modal", function($scope, $modal) {
  $scope.reloadManual = function(index) {
    var query = new AV.Query(YD.FreightIn);
    query.equalTo("user", $scope.currentUser);
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
      success: function(list) {
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
  }

  $scope.reloadManual(0);
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadManual($scope.currentPage - 1);
  }
  $scope.reloadCount = function() {
    var query = new AV.Query(YD.FreightIn);
    query.equalTo("user", $scope.currentUser);
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
      success: function(count) {
        $scope.freightCount = $scope.adminBadge.Y = count;

      }
    });
  };
  $scope.reloadCount();
  $scope.searching = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
      alert("您没有权限");
      return;
    }

    $scope.searchTN = false;
    $scope.searchName = true;
    $scope.reloadCount();
    $scope.reloadManual(0);

  };
  $scope.searchingTN = function() {
      if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
        alert("您没有权限");
        return;
      }
      $scope.searchTN = true;
      $scope.searchName = false;
      $scope.reloadCount();
      $scope.reloadManual(0);

    },
    $scope.$on('adminby', function(event, data) {
      $scope.reloadCount();
      $scope.reloadManual(0);
    });
  $scope.deleteFreight = function(f) {
    var r = confirm("是否确认删除?");
    if (!r) {

    } else {
      f.destroy({
        success: function(f) {
          $scope.reloadCount();
          $scope.reloadManual(0);
          alert("删除成功！")
        },
        error: function(f, error) {
          alert("出错！" + error.message)
        }
      });
    }
  }
}])

YundaApp.controller('AdminSpeedManualCtrl', ["$scope", "$modal", function($scope, $modal) {
  angular.extend($scope, {
    reloadSpeedFreight: function(index) {
      var query = new AV.Query(YD.FreightIn);
      query.equalTo("status", YD.FreightIn.STATUS_SPEED_MANUAL);

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
        success: function(list) {
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
        error: function(error) {
          alert("闪运读取错误!" + error.message);
        }
      });
    },
    reloadFreightCount: function() {
      var query = new AV.Query(YD.FreightIn);
      query.equalTo("status", YD.FreightIn.STATUS_SPEED_MANUAL);
      if ($scope.searchName) {
        var innerQuery = new AV.Query(YD.User);
        innerQuery.equalTo("stringId", $scope.queryString);
        query.matchesQuery("user", innerQuery);
      }
      if ($scope.searchTN) {
        query.equalTo("trackingNumber", $scope.queryNumber);
      }
      query.count({
        success: function(count) {
          $scope.adminBadge.X = $scope.freightCount = count;
        }
      });
    },
    setPage: function() {
      $scope.currentPage = $scope.inputPage;
      $scope.reloadSpeedFreight($scope.currentPage - 1);
    },
    searching: function() {
      if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
        alert("您没有权限");
        return;
      }
      $scope.searchTN = false;
      $scope.searchName = true;
      $scope.reloadFreightCount();
      $scope.reloadSpeedFreight(0);

    },
    searchingTN: function() {
      if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE) {
        alert("您没有权限");
        return;
      }
      $scope.searchTN = true;
      $scope.searchName = false;
      $scope.reloadFreightCount();
      $scope.reloadSpeedFreight(0);

    },
    showDetails: function(freight) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal_showDetails',
        controller: 'ShowDetailsCtrl',
        scope: $scope,
        size: 'sm',
        resolve: {
          freight: function() {
            return freight
          }
        },
        windowClass: 'center-modal'
      });
    },
    deleteFreight: function(freight) {
      var r = confirm("确认彻底删除?");
      if (!r) {
        return;
      } else {
        var RKNumber = freight.RKNumber;
        freight.destroy({
          success: function(f) {
            $scope.reloadSpeedFreight();
            alert("删除运单成功");
          },
          error: function(f, error) {
            $scope.reloadFreightCount();
            $scope.reloadSpeedFreight(0);
            alert("错误!" + error.message);
          }
        });
      }
    }

  });
  $scope.$on('adminbx', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchTN = false;
    $scope.queryNumber = '';
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

YundaApp.controller('AdminFreightPaidCtrl', function($scope, $rootScope, $modal) {

  $scope.showDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetails',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    });
  };
  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_print',
      controller: 'FreightFullDetailCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }
  $scope.showConsumeDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showConsumeDetails',
      controller: 'ShowConsumeDetailsCtrl',
      scope: $scope,
      size: 'md',
      resolve: {
        freight: function() {
          return f
        }
      },
      windowClass: 'center-modal'
    });
  }
  $scope.reloadPaidFreight = function(index) {
    //console.log("realod paid")
    var query = new AV.Query(YD.Freight)
    query.containedIn("status", [YD.Freight.STATUS_REJECTED, YD.Freight.STATUS_PENDING_DELIVERY]);
    query.include("user")
    query.include("address")
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
      success: function(list) {
        $scope.$apply(function() {
          $scope.freight = list
          for (var i = 0; i < $scope.freight.length; i++) {

            $scope.freight[i].selection = false
            var tmp = $scope.freight[i].updatedAt

            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
              tmp_date += "0" + tmp.getMinutes()
            else
              tmp_date += tmp.getMinutes();
            $scope.freight[i].updatedAtToString = tmp_date
            $scope.freight[i].delivery = tmp_date;
            $scope.freight[i].selection = false
          }
        })

      },
      error: function(error) {
        //console.log("AdminFreightPaid ERROR: " + error.message)
      }
    })
  }
  $scope.reloadFreightCount = function() {
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
      success: function(count) {
        $scope.adminBadge.E = $scope.freightCount = count;
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadPaidFreight($scope.currentPage - 1);
  }
  $scope.$on('adminbd', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchYD = false;
    $scope.queryNumber = '';
    $scope.reloadFreightCount();
    $scope.reloadPaidFreight(0);
  });

  $scope.searching = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_DELIVERY) {
      alert("您没有权限");
      return;
    }
    $scope.searchYD = false;
    $scope.searchName = true;
    $scope.reloadFreightCount();
    $scope.reloadPaidFreight(0);
  }
  $scope.searchingYD = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_DELIVERY) {
      alert("您没有权限");
      return;
    }
    $scope.searchYD = true;
    $scope.searchName = false;
    $scope.reloadFreightCount();
    $scope.reloadPaidFreight(0);
  }

  $scope.addNotes = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addNotes',
      controller: 'AddNotesCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight_obj: function() {
          var tmp = {
            freight: freight,
            type: "freight"
          }
          return tmp
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
    })
  }

  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_DELIVERY) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadFreightCount();
    $scope.reloadPaidFreight(0);
  }

  $scope.confirmDelivery = function(f) {
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
      success: function() {
        f.save(null, {
          success: function(f) {
            alert("发货成功");
            $scope.reloadFreightCount();
            $scope.reloadPaidFreight(0);
          },
          error: function(f, error) {
            alert("错误" + error.message);
          }
        });
      }
    });
  }

})

YundaApp.controller('AdminFreightClearCtrl', function($scope, $modal) {
  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_freightFullDetail',
      controller: 'FreightFullDetailCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }
  $scope.showDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetails',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    });
  }
  var clearList = []
  $scope.reloadDeliveryFreight = function(index) {
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
      success: function(list) {
        $scope.$apply(function() {
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
      error: function(error) {
        //console.log("AdminFreightPaid ERROR: " + error.message)
      }
    })
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadDeliveryFreight($scope.currentPage - 1);
  }
  $scope.reloadCount = function() {
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
      success: function(count) {
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
  };
  $scope.$on('adminbe', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchYD = false;
    $scope.queryNumber = '';
    $scope.reloadCount();
    $scope.reloadDeliveryFreight(0);
  });
  $scope.searching = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CLEAR) {
      alert("您没有权限");
      return;
    }
    $scope.searchYD = false;
    $scope.searchName = true;
    $scope.reloadCount();
    $scope.reloadDeliveryFreight(0);
  }
  $scope.searchingYD = function() {
      if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CLEAR) {
        alert("您没有权限");
        return;
      }
      $scope.searchYD = true;
      $scope.searchName = false;
      $scope.reloadCount();
      $scope.reloadDeliveryFreight(0);
    }
    //$scope.saveComment = function () {
    //    $scope.showProgressBar("正在保存留言...")
    //    for (var i = 0; i < $scope.freight.length; i++) {
    //        ////console.log("f comments is: " + $scope.freight[i].comments)
    //    }
    //    AV.Object.saveAll($scope.freight, {
    //        success: function (list) {
    //            //console.log("list of comment saved")
    //            $scope.hideProgressBar()
    //            alert("留言保存成功！")
    //        },
    //        error: function (error) {
    //
    //        }
    //    })
    //}
  $scope.confirmClear = function(f) {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_CLEAR) {
      alert("您没有权限");
      return;
    }
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
      success: function(s) {
        f.save(null, {
          success: function(f) {
            $scope.reloadCount();
            $scope.reloadDeliveryFreight(0);
            alert("确认成功");
          },
          error: function(f, error) {
            alert("错误" + error.message);

          }
        });
      }
    });

  }

  $scope.addNotes = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addNotes',
      controller: 'AddNotesCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight_obj: function() {
          var tmp = {
            freight: freight,
            type: "freight"
          }
          return tmp
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
    })
  }


  $scope.deliver = function() {
    for (var i = 0; i < $scope.freight.length; i++) {
      if ($scope.freight[i].selection == true) {
        //console.log("This one " + i + "has been added")
        $scope.freight[i].status = YD.Freight.STATUS_PASSING_CUSTOM
        clearList.push($scope.freight[i])
      }
    }
    AV.Object.saveAll(clearList, {
      success: function(list) {
        $scope.$apply(function() {
          //console.log("AdminFreightClearCtrl: freightList has been saved")
          $scope.reloadDeliveryFreight()
        })
      },
      error: function(error) {
        //console.log("ERROR: AdminFreightClearCtrl: freightList has not been saved" + error.message)
      }
    })
  }
})

YundaApp.controller('AdminChineseFreightCtrl', function($scope, $modal) {
  $scope.showOperationDetails = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_freightFullDetail',
      controller: 'FreightFullDetailCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return f;
        }
      },
      windowClass: 'center-modal'
    });
  }
  $scope.showDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetails',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    })
  }
  $scope.reloadChineseFreight = function(index) {
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
      success: function(list) {
        $scope.$apply(function() {
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
            //console.log("status: " + $scope.freight[i].status);
          }
        })


      },
      error: function(error) {
        //console.log("AdminFreightPaid ERROR: " + error.message)
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadChineseFreight($scope.currentPage - 1);
  };
  $scope.reloadCount = function() {
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
      success: function(count) {
        $scope.adminBadge.G = $scope.freightCount = count;

      }
    });
  };

  $scope.$on('adminbf', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchYD = false;
    $scope.queryNumber = '';
    $scope.reloadCount();
    $scope.reloadChineseFreight(0);
  });

  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_RECEIVE) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadCount();

    $scope.reloadChineseFreight(0);
  };
  $scope.searching = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_RECEIVE) {
      alert("您没有权限");
      return;
    }
    $scope.searchYD = false;
    $scope.searchName = true;
    $scope.reloadCount();
    $scope.reloadChineseFreight(0);

  }
  $scope.searchingYD = function() {
      if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_RECEIVE) {
        alert("您没有权限");
        return;
      }
      $scope.searchYD = true;
      $scope.searchName = false;
      $scope.reloadCount();
      $scope.reloadChineseFreight(0);

    }
    //$scope.saveComment = function () {
    //    $scope.showProgressBar("正在保存留言...")
    //    for (var i = 0; i < $scope.freight.length; i++) {
    //        ////console.log("f comments is: " + $scope.freight[i].comments)
    //    }
    //    AV.Object.saveAll($scope.freight, {
    //        success: function (list) {
    //            //console.log("list of comment saved")
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
        freight_obj: function() {
          var tmp = {
            freight: freight,
            type: "freightIn"
          }
          return tmp
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
    })
  }

  $scope.addInfo = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addInfo',
      controller: 'AddInfoCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    });
    modalInstance.result.then(function() {
      alert("添加成功");
      freight.isAdded = true;
      //$scope.reloadChineseFreight();
      //$scope.$apply()
    });
  };

  $scope.confirmOut = function(f) {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE && $scope.currentUser.role != YD.User.ROLE_ADMIN_PACKAGE_RECEIVE) {
      alert("您没有权限");
      return;
    }
    //if (!f.isAdded) {
    //    alert("请先添加国内物流信息.");
    //    return;
    //}
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addInfo',
      controller: 'AddInfoCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return f
        }
      },
      windowClass: 'center-modal'
    });
    modalInstance.result.then(function() {
      var tmp = new Date();
      var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
      if (tmp.getMinutes() < 10)
        tmp_date += "0" + tmp.getMinutes()
      else
        tmp_date += tmp.getMinutes();
      _
      f.shipping.atChina = tmp_date;
      f.shipping.save(null, {
        success: function(shipping) {
          f.status = YD.Freight.STATUS_FINAL_DELIVERY;
          f.save(null, {
            success: function(f) {
              //console.log("freightstatus: " + f.status);
              $scope.reloadCount();
              $scope.reloadChineseFreight(0);
              alert("确认成功");
            },
            error: function(f, error) {
              alert("错误" + error.message);

            }
          });
        }
      });
      //alert("添加成功");
      //freight.isAdded = true;
      //$scope.reloadChineseFreight();
      //$scope.$apply()
    });

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
      success: function(list) {
        //console.log("AdminChineseFreightCtrl: freightList has been saved")
        $scope.reloadChineseFreight()
        $scope.$apply()
      },
      error: function(error) {
        //console.log("ERROR: AdminChineseFreightCtrl: freightList has not been saved" + error.message)
      }
    })
  }
})

YundaApp.controller('AdminRechargeRecordCtrl', ["$scope", function($scope) {
  $scope.transactionType = [{
    index: 0,
    value: '支付宝充值（未完成）',
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
  $scope.open1 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened1 = true;
    //console.log("opened1: " + $scope.opened1)

  }

  $scope.open2 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened2 = true;
    //console.log("opened2: " + $scope.opened2)


  }
  $scope.reloadTransaction = function(index) {
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
        $scope.dt1 = new Date($scope.dt1)
        $scope.dt2 = new Date($scope.dt2)
        $scope.dt1.setHours(hour)
        $scope.dt1.setMinutes(minute)
        $scope.dt2.setHours(hour)
        $scope.dt2.setMinutes(minute)
        query.greaterThanOrEqualTo("createdAt", $scope.dt1)
        query.lessThanOrEqualTo("createdAt", $scope.dt2)
      }
      query.find({
        success: function(tList) {
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
          //console.log("DatePicker: get all transaction successful: " + tList.length)
        },
        error: function(tList, err) {
          //console.log("DatePicker: get all transaction not successful: " + err.id + err.message)
        }
      })
    }
  };
  $scope.reloadTransactionCount = function() {
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
      $scope.dt1 = new Date($scope.dt1)
      $scope.dt2 = new Date($scope.dt2)
      $scope.dt1.setHours(hour)
      $scope.dt1.setMinutes(minute)
      $scope.dt2.setHours(hour)
      $scope.dt2.setMinutes(minute)
      query.greaterThanOrEqualTo("createdAt", $scope.dt1)
      query.lessThanOrEqualTo("createdAt", $scope.dt2)
    }
    query.count({
      success: function(count) {
        $scope.tCount = count;

      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadTransaction($scope.currentPage - 1);
  }

  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_RECHARGE) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadTransactionCount();
    $scope.reloadTransaction(0)
  };
  $scope.$on('admindb', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchDate = false;
    $scope.reloadTransactionCount();
    $scope.reloadTransaction(0);
  });

  $scope.searching = function() {
    $scope.searchName = true;
    $scope.searchDate = false;
    $scope.searchType = false;

    $scope.reloadTransactionCount();
    $scope.reloadTransaction(0);
  }
  $scope.reloadSelectedTransaction = function() {
    $scope.searchName = false;
    $scope.searchDate = true;
    $scope.searchType = false;

    $scope.reloadTransactionCount();
    $scope.reloadTransaction(0);
  };
  $scope.searchingType = function() {
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

YundaApp.controller('AdminCreditUserCtrl', ["$scope", "$modal", function($scope, $modal) {
  $scope.query = ""
  $scope.searchedString = false
  $scope.searchedNumber = false
  $scope.isLoading = false
  $scope.promote = ""
  $scope.reloadUser = function(index) {
    var query = new AV.Query("_User");
    query.limit($scope.LIMIT_NUMBER);
    query.skip($scope.LIMIT_NUMBER * index);
    query.descending("updatedAt");
    query.find({
      success: function(users) {
        //console.log("AdminViewUser, length: " + users.length)
        $scope.$apply(function() {
          $scope.users = users
          for (var i = 0; i < $scope.users.length; i++) {
            var tmp = $scope.users[i].createdAt
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
              tmp_date += "0" + tmp.getMinutes()
            else
              tmp_date += tmp.getMinutes();
            _
            $scope.users[i].createdAt = tmp_date
              //$scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
          }
        })

      },
      error: function(error) {
        //console.log("AdminViewUser ERR: " + error.message)
      }
    })
  };
  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadUser(0);
  };
  $scope.$on('adminde', function() {
    ////console.log("on received reload now");
    $scope.reloadUser(0);
  });
  $scope.reloadCount = function() {
    var query = new AV.Query("_User");
    query.count({
      success: function(count) {
        $scope.userCount = count;
      }
    });
  };
  $scope.reloadCount();
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadUser($scope.currentPage - 1);
  }
  $scope.searchForUser = function(type) {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
      alert("您没有权限");
      return;
    }
    $scope.isLoading = true
    $scope.promote = "正在查询,请稍候..."
    if (type == 'string') {
      //console.log("in string search")
      var query = new AV.Query("_User")
      query.equalTo("stringId", $scope.queryString)
      query.include("address");
      //query.equalTo("userName", $scope.query)
      query.find({
        success: function(list) {
          //console.log("list.lenght: " + list.length)
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
              //$scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
          }
          $scope.searchedString = true
          $scope.searchedNumber = false
          $scope.isLoading = false
          $scope.promote = ""
          $scope.$apply()

        },
        error: function(error) {
          $scope.isLoading = false
          $scope.promote = ""
          alert("错误！" + error.message)

        }
      })
    } else {
      //console.log("in numberId search")

      var query = new AV.Query("_User")
      query.equalTo("numberId", $scope.queryNumber)
        //query.equalTo("userName", $scope.query)
      query.include("address");
      query.find({
        success: function(list) {
          //console.log("list.lenght: " + list.length)

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
            $scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
          }
          $scope.searchedString = false
          $scope.searchedNumber = true
          $scope.isLoading = false
          $scope.promote = ""
          $scope.$apply()

        },
        error: function(error) {
          $scope.isLoading = false
          $scope.promote = ""
          alert("错误！" + error.message)

        }
      })
    }
  }

  $scope.$watch("queryString", function(newVal) {
    if (!$scope.searchedString) {
      return
    } else {
      if (newVal === "" || newVal === undefined)
        $scope.reloadUser()
    }

  })
  $scope.$watch("queryNumber", function(newVal) {
    if (!$scope.searchedNumber) {
      return
    } else {
      if (newVal === "" || newVal === undefined)
        $scope.reloadUser()
    }

  })
  $scope.showDetails = function(user) {
    $scope.newAddress = null;
    var query = new AV.Query(YD.Address);
    var id = user.addressId;
    query.get(id, {
      success: function(a) {

        $scope.$apply(function() {
          $scope.newAddress = a;
          $scope.newUser = user;
        });
      }
    });
    //$scope.$watch('newUser', function (newVal) {
    //}, true)
  }
  $scope.increaseBalance = function(user) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_indecreaseBalance',
      controller: 'IncreaseUserBalance',
      scope: $scope,
      size: 'sm',
      resolve: {
        user: function() {
          return user
        }
      },
      windowClass: 'center-modal'
    });
    modalInstance.result.then(function() {
      $scope.reloadUser();
      alert("添加成功");
    });
  }

  $scope.decreaseBalance = function(user) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_indecreaseBalance',
      controller: 'DecreaseUserBalance',
      scope: $scope,
      size: 'sm',
      resolve: {
        user: function() {
          return user
        }
      },
      windowClass: 'center-modal'
    });
    modalInstance.result.then(function() {
      $scope.reloadUser();
      alert("添加成功");
    });
  }
}]);

YundaApp.controller('IncreaseUserBalance', ["$scope", "$modalInstance", "user", function($scope, $modalInstance, user) {
  $scope.isLoading = false;
  $scope.promote = "";
  $scope.user = user;
  $scope.confirm = function() {
    if (!$scope.amount) {
      alert("请先填写金额");
      return;
    } else {
      $scope.isLoading = true;
      $scope.promote = "正在处理...";

      AV.Cloud.run('creditUser', {
        userId: user.id,
        amount: $scope.amount
      }, {
        success: function() {
          $scope.isLoading = false;
          $scope.promote = "";
          alert("操作成功！");
          $modalInstance.close();
        },
        error: function(error) {
          $scope.isLoading = false;
          $scope.promote = "";
          //console.log("-- ERROR: " + error.message);
          $modalInstance.dismiss();
        }
      });
    }
  }
}]);

YundaApp.controller('DecreaseUserBalance', ["$scope", "$modalInstance", "user", function($scope, $modalInstance, user) {
  $scope.isLoading = false;
  $scope.promote = "";
  $scope.user = user;
  $scope.confirm = function() {
    if (!$scope.amount) {
      alert("请先填写金额");
      return;
    } else {
      $scope.isLoading = true;
      $scope.promote = "正在处理...";

      AV.Cloud.run('debitUser', {
        userId: user.id,
        amount: $scope.amount
      }, {
        success: function() {
          $scope.isLoading = false;
          $scope.promote = "";
          alert("操作成功！");
          $modalInstance.close();
        },
        error: function(error) {
          $scope.isLoading = false;
          $scope.promote = "";
          //console.log("-- ERROR: " + error.message);
          $modalInstance.dismiss();
        }
      });
    }
  }
}]);

YundaApp.controller('AdminConsumeRecordCtrl', ["$scope", function($scope) {
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
  }, ]


  $scope.open1 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened1 = true;
  }

  $scope.open2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened2 = true;
  }

  //$scope.showCMD = function() {
  //    //console.log('Show dt1: ' + $scope.dt1)
  //}
  $scope.reloadTransaction = function(index) {
    if ($scope.currentUser.id != undefined) {

      //console.log("reloadTransaction: Transaction");

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
        query.equalTo("RKNumber", $scope.queryNumber);
      }
      if ($scope.searchDate) {
        var date = new Date()
        var hour = date.getHours()
        var minute = date.getMinutes()
        $scope.dt1 = new Date($scope.dt1)
        $scope.dt2 = new Date($scope.dt2)
        $scope.dt1.setHours(hour)
        $scope.dt1.setMinutes(minute)
        $scope.dt2.setHours(hour)
        $scope.dt2.setMinutes(minute)
        query.greaterThanOrEqualTo("createdAt", $scope.dt1)
        query.lessThanOrEqualTo("createdAt", $scope.dt2)
      }
      query.find({
        success: function(tList) {
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
            ////console.log("1: " + $scope.transactionList[i].RKNumber + " 2: " + $scope.transactionList[i].YDNumber)
          }
          $scope.$apply();

        },
        error: function(tList, err) {
          //console.log("DatePicker: get all transaction not successful: " + err.id + err.message)

        }
      });
    }
  };
  $scope.reloadTransactionCount = function() {
    var query = new AV.Query("Transaction");
    query.include("user");
    if ($scope.searchType) {
      query.equalTo("status", $scope.queryType);
    } else {
      query.containedIn("status", [YD.Transaction.STATUS_CONSUME, YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE, YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE, YD.Transaction.STATUS_CONSUME_ADD_PACKAGE, YD.Transaction.STATUS_CONSUME_RETURN_GOODS, YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE, YD.Transaction.STATUS_DEBIT_USER]);
    }
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
      $scope.dt1 = new Date($scope.dt1)
      $scope.dt2 = new Date($scope.dt2)
      $scope.dt1.setHours(hour)
      $scope.dt1.setMinutes(minute)
      $scope.dt2.setHours(hour)
      $scope.dt2.setMinutes(minute)
      query.greaterThanOrEqualTo("createdAt", $scope.dt1)
      query.lessThanOrEqualTo("createdAt", $scope.dt2)
    }
    query.count({
      success: function(count) {
        $scope.tCount = count;
      }
    });
  }

  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_CONSUME) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadTransactionCount();
    $scope.reloadTransaction(0);
  };

  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadTransaction($scope.currentPage - 1);
  }
  $scope.$on('admindc', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchRK = false;
    $scope.queryNumber = '';
    $scope.searchDate = false;
    $scope.searchType = false;
    $scope.queryType = undefined;
    $scope.reloadTransactionCount();
    $scope.reloadTransaction(0);
  });
  $scope.searching = function() {
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

  $scope.searchingRK = function() {
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
  $scope.reloadSelectedTransaction = function() {
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
  $scope.searchingType = function() {
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
  }

}]);

YundaApp.controller('AdminYDRewardRecordCtrl', ["$scope", function($scope) {
  $scope.reloadRewardRecord = function(index) {
    var query = new AV.Query(YD.Transaction);
    query.include("user");
    query.containedIn("status", [YD.Transaction.STATUS_CLAIM_REWARD, YD.Transaction.STATUS_CONSUME_YD_REWARD, YD.Transaction.STATUS_GET_YD_REWARD]);
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
      $scope.dt1 = new Date($scope.dt1)
      $scope.dt2 = new Date($scope.dt2)
      $scope.dt1.setHours(hour)
      $scope.dt1.setMinutes(minute)
      $scope.dt2.setHours(hour)
      $scope.dt2.setMinutes(minute)
      query.greaterThanOrEqualTo("createdAt", $scope.dt1)
      query.lessThanOrEqualTo("createdAt", $scope.dt2)
    }
    query.find({
      success: function(list) {
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
        }
        $scope.$apply();
      }
    })
  };
  $scope.reloadRewardCount = function() {
    var query = new AV.Query(YD.Transaction);
    query.include("user");
    query.containedIn("status", [YD.Transaction.STATUS_CLAIM_REWARD, YD.Transaction.STATUS_CONSUME_YD_REWARD, YD.Transaction.STATUS_GET_YD_REWARD]);
    if ($scope.searchName) {
      var innerQuery = new AV.Query(YD.User);
      innerQuery.equalTo("stringId", $scope.queryString);
      query.matchesQuery("user", innerQuery);
    }
    if ($scope.searchDate) {
      var date = new Date()
      var hour = date.getHours()
      var minute = date.getMinutes()
      $scope.dt1 = new Date($scope.dt1)
      $scope.dt2 = new Date($scope.dt2)
      $scope.dt1.setHours(hour)
      $scope.dt1.setMinutes(minute)
      $scope.dt2.setHours(hour)
      $scope.dt2.setMinutes(minute)
      query.greaterThanOrEqualTo("createdAt", $scope.dt1)
      query.lessThanOrEqualTo("createdAt", $scope.dt2)
    }
    query.count({
      success: function(count) {
        $scope.tCount = count;
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadRewardRecord($scope.currentPage - 1);
  }
  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadRewardCount();
    $scope.reloadRewardRecord(0);
  };
  $scope.$on('admindd', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchDate = false;
    $scope.reloadRewardCount();
    $scope.reloadRewardRecord(0);
  });
  $scope.searching = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
      alert("您没有权限");
      return;
    }
    $scope.searchName = true;
    $scope.searchDate = false;
    $scope.reloadRewardCount();
    $scope.reloadRewardRecord(0);
  }
  $scope.reloadSelectedTransaction = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
      alert("您没有权限");
      return;
    }
    $scope.searchName = false;
    $scope.searchDate = true;
    $scope.reloadRewardCount();
    $scope.reloadRewardRecord(0);
  }

  $scope.open1 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened1 = true;
    //console.log("opened1: " + $scope.opened1)

  }

  $scope.open2 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened2 = true;
    //console.log("opened2: " + $scope.opened2)


  }

  $scope.reloadSelectedTransaction = function() {
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
}])

YundaApp.controller('AdminFinalDeliveryCtrl', function($scope, $modal) {
  $scope.showDetails = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_showDetails',
      controller: 'ShowDetailsCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight: function() {
          return freight
        }
      },
      windowClass: 'center-modal'
    })
  }
  $scope.reloadFinalDelivery = function() {
    var query = new AV.Query(YD.Freight)
    query.equalTo("status", YD.Freight.STATUS_FINAL_DELIVERY)
    query.include("user")
    query.find({
      success: function(list) {
        $scope.freight = list
        $scope.$apply(function() {
          $scope.adminBadge.H = list.length
            //console.log("in FInal H badge: " + $scope.adminBadge.H)
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

        //console.log("reloadFinalDelivery: " + list.length)
      },
      error: function(error) {
        //console.log("AdminFreightPaid ERROR: " + error.message)
      }
    })
  }
  $scope.reloadFinalDelivery();
  $scope.$on('adminbg', function() {
    $scope.reloadFinalDelivery();
  });

  $scope.addNotes = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addNotes',
      controller: 'AddNotesCtrl',
      scope: $scope,
      size: 'sm',
      resolve: {
        freight_obj: function() {
          var tmp = {
            freight: freight,
            type: "freightIn"
          }
          return tmp
        }
      },
      windowClass: 'center-modal'
    })
    modalInstance.result.then(function() {
      alert("添加留言成功!")
        //console.log("Notes(): user's notes added")
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
    modalInstance.result.then(function() {
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
      error: function(f, error) {
        alert("出错！" + error.message)
      }
    })
  }
});

YundaApp.controller('AdminManageFreightCtrl', ["$scope", "$modal", function($scope, $modal) {
  $scope.isLoadingTrue = false;
  $scope.promote = "";

  $scope.reloadFreight = function(index) {
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
      success: function(list) {
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
        $scope.$apply();
      }
    });
  };
  $scope.reloadFreightCount = function() {
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
      success: function(count) {
        $scope.freightCount = count;
        //$scope.freightCount = $scope.getButtonArray(count);
        //$scope.$apply();
      }
    });
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadFreight($scope.currentPage - 1);
  }

  $scope.searchingYD = function() {
    $scope.searchYD = true;
    $scope.searchName = false;
    $scope.reloadFreightCount();
    $scope.reloadFreight(0);
  }
  $scope.searching = function() {
    $scope.searchYD = false;
    $scope.searchName = true;
    $scope.reloadFreightCount();
    $scope.reloadFreight(0);
  }
  $scope.$on('admincd', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchYD = false;
    $scope.queryNumber = '';
    $scope.reloadFreightCount();
    $scope.reloadFreight(0);
  });
  $scope.showFreightDetail = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_freightFullDetail',
      controller: 'FreightFullDetailCtrl',
      scope: $scope,
      size: 'lg',
      resolve: {
        freight: function() {
          return freight;
        }
      },
      windowClass: 'center-modal'
    });
  }
}]);

YundaApp.controller("FreightFullDetailCtrl", ["$scope", "$modalInstance", "freight", function($scope, $modalInstance, freight) {
  $scope.freight = freight;

  $scope.isLoading = true;

  $scope.promote = "请等待...";
  var query1 = new AV.Query(YD.Transaction);
  query1.equalTo("YDNumber", freight.YDNumber);
  var newQ = new AV.Query(YD.Transaction);
  newQ.equalTo("RKNumber", freight.RKNumber);
  var query = AV.Query.or(query1, newQ);
  query.find({
    success: function(list) {
      $scope.transactions = list;
      //console.log("YDNumber list: " + list.length);
      //var newQ = new AV.Query(YD.Transaction);
      //newQ.equalTo("RKNumber", freight.RKNumber);
      //newQ.find({
      //    success: function (list2) {
      //        if (list2.length != 0) {
      //            for (var i = 0; i < list2.length; i++) {
      //                $scope.transactions.push(list2[i]);
      //            }
      //
      //        }
      //        //console.log("RKNumber list: " + list2.length);
      $scope.isLoading = false;
      $scope.promote = "";
      $scope.$apply();
      //
      //    }
      //});
    }
  });
  $scope.close = function() {
    $modalInstance.dismiss();
  }

}]);

YundaApp.controller('DoubleConfirmCtrl', function($scope, $modalInstance) {
  $scope.confirm = function() {
    $modalInstance.close()
  }
  $scope.close = function() {
    $modalInstance.dismiss()
  }
})

YundaApp.controller('AdminViewUserCtrl', function($scope) {
  $scope.query = "";
  $scope.searchedString = false;
  $scope.searchedNumber = false;
  $scope.isLoading = false;
  $scope.isLoadingTrue = false;

  $scope.promote = "";

  $scope.reloadUser = function(index) {
    var query = new AV.Query("_User");
    query.limit($scope.LIMIT_NUMBER);
    query.skip($scope.LIMIT_NUMBER * index);
    query.descending("updatedAt");
    query.find({
      success: function(users) {
        //console.log("AdminViewUser, length: " + users.length)
        $scope.$apply(function() {
          $scope.users = users
          for (var i = 0; i < $scope.users.length; i++) {
            var tmp = $scope.users[i].createdAt
            var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
            if (tmp.getMinutes() < 10)
              tmp_date += "0" + tmp.getMinutes()
            else
              tmp_date += tmp.getMinutes();
            _
            $scope.users[i].createdAt = tmp_date
              //$scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
          }
        })

      },
      error: function(error) {
        //console.log("AdminViewUser ERR: " + error.message)
      }
    })
  };
  $scope.reloadUserCount = function() {
    var query = new AV.Query("_User");
    query.count({
      success: function(count) {
        //console.log("HAHA " + count);
        $scope.userCount = count;
      }
    });
  }
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadUser($scope.currentPage - 1);
  }
  $scope.reloadUserCount();
  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadUser(0);
  };
  $scope.$on('adminca', function() {
    $scope.reloadUser(0);
  });

  $scope.searchForUser = function(type) {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_INFO) {
      alert("您没有权限");
      return;
    }
    $scope.isLoading = true
    $scope.promote = "正在查询,请稍候..."
    if (type == 'string') {
      //console.log("in string search")
      var query = new AV.Query("_User")
      query.equalTo("stringId", $scope.queryString)
      query.include("address");
      //query.equalTo("userName", $scope.query)
      query.find({
        success: function(list) {
          //console.log("list.lenght: " + list.length)
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
            $scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
          }
          $scope.searchedString = true
          $scope.searchedNumber = false
          $scope.isLoading = false
          $scope.promote = ""
          $scope.$apply()

        },
        error: function(error) {
          $scope.isLoading = false
          $scope.promote = ""
          alert("错误！" + error.message)

        }
      })
    } else {
      //console.log("in numberId search")

      var query = new AV.Query("_User")
      query.equalTo("numberId", $scope.queryNumber)
        //query.equalTo("userName", $scope.query)
      query.include("address");
      query.find({
        success: function(list) {
          //console.log("list.lenght: " + list.length)

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
            $scope.users[i].balance = ($scope.users[i].balance / 100).toFixed(2)
          }
          $scope.searchedString = false
          $scope.searchedNumber = true
          $scope.isLoading = false
          $scope.promote = ""
          $scope.$apply()

        },
        error: function(error) {
          $scope.isLoading = false
          $scope.promote = ""
          alert("错误！" + error.message)

        }
      })
    }
  }

  $scope.$watch("queryString", function(newVal) {
    if (!$scope.searchedString) {
      return
    } else {
      if (newVal === "" || newVal === undefined)
        $scope.reloadUser()
    }

  })
  $scope.$watch("queryNumber", function(newVal) {
    if (!$scope.searchedNumber) {
      return
    } else {
      if (newVal === "" || newVal === undefined)
        $scope.reloadUser()
    }

  })
  $scope.showDetails = function(user) {
    $scope.isLoadingTrue = true;
    $scope.promote = "正在读取";
    $scope.newUser = user;
    $scope.newAddress = null;
    var query = new AV.Query(YD.Address);
    var id = user.addressId;
    query.get(id, {
      success: function(a) {

        $scope.$apply(function() {
          $scope.isLoadingTrue = false;
          $scope.promote = "";
          $scope.newAddress = a;
        });
      }
    });
    //$scope.$watch('newUser', function (newVal) {
    //}, true)
  }

})

YundaApp.controller('AddInfoCtrl', function($scope, $modalInstance, freight) {
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
  $scope.confirmAddInfo = function() {
    //$scope.freight.status = YD.Freight.STATUS_FINAL_DELIVERY
    $scope.freight.chineseCourier = $scope.chineseCourier.name;
    $scope.freight.save(null, {
      success: function(result) {
        $modalInstance.close()
      },
      error: function(result, error) {
        //console.log("AddInfoCtrl ERROR: " + error.message)
      }
    })
  }
  $scope.cancelAddInfo = function() {
    $modalInstance.dismiss()
  }
})

YundaApp.controller('AdminReturnBalanceCtrl', function($scope, $modal) {
  $scope.reloadReturnBalance = function(index) {
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
      $scope.dt1 = new Date($scope.dt1)
      $scope.dt2 = new Date($scope.dt2)
      $scope.dt1.setHours(hour)
      $scope.dt1.setMinutes(minute)
      $scope.dt2.setHours(hour)
      $scope.dt2.setMinutes(minute)
      query.greaterThanOrEqualTo("createdAt", $scope.dt1)
      query.lessThanOrEqualTo("createdAt", $scope.dt2)
    }
    query.find({
      success: function(list) {
        $scope.$apply(function() {
          $scope.transactionList = list
            //console.log("admin return balance: " + list.length);
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
      error: function(list, error) {
        //console.log("admin return balance ERR: " + error.message)
      }
    });
  };
  $scope.reloadReturnCount = function() {
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
      $scope.dt1 = new Date($scope.dt1)
      $scope.dt2 = new Date($scope.dt2)
      $scope.dt1.setHours(hour)
      $scope.dt1.setMinutes(minute)
      $scope.dt2.setHours(hour)
      $scope.dt2.setMinutes(minute)
      query.greaterThanOrEqualTo("createdAt", $scope.dt1)
      query.lessThanOrEqualTo("createdAt", $scope.dt2)
    }
    query.find({
      success: function(list) {
        //$scope.getButtonArray(count);
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
  $scope.reloadSelectedTransaction = function() {
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
  };
  $scope.open1 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened1 = true;
  }

  $scope.open2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened2 = true;
  }
  $scope.$on('admincb', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchTK = false;
    $scope.queryNumber = '';
    $scope.reloadReturnCount();
    $scope.reloadReturnBalance(0);
  });
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadReturnBalance($scope.currentPage - 1);
  }

  $scope.searchingTK = function() {
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


  $scope.searching = function() {
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
  $scope.zhifubaoDetails = function(t) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_zhifubaoDetails',
      controller: 'ZhifubaoDetailsCtrl',
      scope: $scope,
      size: 'md',
      windowClass: 'center-modal',
      resolve: {
        transaction: function() {
          return t;
        }
      }

    })
  };



  $scope.refuseReturn = function(transaction) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addReason',
      controller: 'AdminAddRefuseReason',
      scope: $scope,
      size: 'sm',
      windowClass: 'center-modal'

    });
    modalInstance.result.then(function(notes) {
      AV.Cloud.run('refuseUserReturnBalance', {
        amount: transaction.amount,
        userId: transaction.user.id
      }, {
        success: function() {
          transaction.notes = notes;
          transaction.status = YD.Transaction.STATUS_REFUSED_RETURN_BALANCE;
          transaction.save(null, {
            success: function(t) {
              alert("已成功处理！")
              $scope.reloadReturnBalance();
            },
            error: function(f, error) {
              alert("出错！" + error.message)
            }
          });
        },
        error: function(error) {
          //console.log(" ERROR: " + error.message)
        }
      });

    });

  };
  $scope.confirmReturn = function(transaction) {
    //console.log("InReturnBalance Ctr -- user balance: " + (transaction.user.balance / 100).toFixed(2) + " | amount: " + transaction.amount)
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
          success: function() {

            //transaction.user = freightIn.user;
            //transaction.amount = amount;
            transaction.status = YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE;
            transaction.notes = "退款";
            //transaction.RKNumber = freightIn.RKNumber;
            transaction.isCredit = true;
            transaction.save(null, {
              success: function(t) {
                $scope.reloadReturnBalance();
                alert("操作成功！")
              },
              error: function(t, error) {

                alert("错误! " + error.message);
              }
            });

          },
          error: function(error) {
            //console.log(" ERROR: " + error.message)

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
            transaction: function() {
              return transaction
            }
          }
        })
        modalInstance.result.then(function() {
          //transaction.user.balance -= transaction.amount
          //transaction.user.save(null, {
          //    success: function (user) {
          //        alert("退款已处理！")
          //        $scope.reloadReturnBalance()
          //    }
          //})
          AV.Cloud.run('chargingUserReturnBalance', {
            amount: transaction.amount,
            userId: transaction.user.id
          }, {
            success: function() {

              //transaction.user = freightIn.user;
              //transaction.amount = amount;
              transaction.status = YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE;
              transaction.notes = "退款";
              //transaction.RKNumber = freightIn.RKNumber;
              transaction.isCredit = true;
              transaction.save(null, {
                success: function(t) {
                  $scope.reloadReturnBalance();
                  alert("操作成功！")
                },
                error: function(t, error) {

                  alert("错误! " + error.message);
                }
              });

            },
            error: function(error) {
              //console.log(" ERROR: " + error.message)

            }
          });

        });
      }
    }
  }
})

YundaApp.controller('ZhifubaoDetailsCtrl', ["$scope", "$modalInstance", "transaction", function($scope, $modalInstance, transaction) {
  $scope.transaction = transaction;
  $scope.close = function() {
    $modalInstance.dismiss();
  }
}])

YundaApp.controller('AdminAddEvidenceCtrl', function($scope, transaction, $modalInstance) {
  $scope.filesChangedFront = function(elm) {
    $scope.identityFront = elm.files
    $scope.$apply()
  }
  $scope.uploadIdentity = function() {
    ////console.log("In fileUpload back: " + $scope.identityBack)
    ////console.log("In fileUpload front: " + $scope.identityFront)

    if ($scope.identityFront != undefined) {
      $scope.isLoading = true
      $scope.promote = "正在上传..."
        //console.log("In fileUpload back: " + $scope.identityFront[0].name)
        ////console.log("In fileUpload front: " + $scope.identityBack[0].name)
      var frontName = transaction.id + 'evidence.jpg'
      transaction.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
      transaction.save(null, {
        success: function(t) {
          //console.log("In AdminAddEvidenceCtrl -- upload sucessful")
          alert("上传成功！")
          $scope.$apply(function() {
            $scope.isLoading = false
            $scope.promote = ""
          })
          $modalInstance.close()
        },
        error: function(error) {
          alert("照片上传不成功！" + error.message)
          $modalInstance.dismiss()
        }
      })

    } else {
      alert("Please upload file first")
    }
  }
})

YundaApp.controller('AdminAddEvidenceChangeAddressCtrl', function($scope, freight, $modalInstance) {
  $scope.filesChangedFront = function(elm) {
    $scope.identityFront = elm.files
    $scope.$apply()
  }
  $scope.uploadIdentity = function() {
    ////console.log("In fileUpload back: " + $scope.identityBack)
    ////console.log("In fileUpload front: " + $scope.identityFront)

    if ($scope.identityFront != undefined) {
      $scope.isLoading = true
      $scope.promote = "正在上传..."
        //console.log("In fileUpload back: " + $scope.identityFront[0].name)
        ////console.log("In fileUpload front: " + $scope.identityBack[0].name)
      var frontName = freight.id + 'evidence.jpg'
      freight.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
      freight.status = YD.FreightChangeAddress.STATUS_CONFIRMED
      freight.save(null, {
        success: function(f) {
          //console.log("In AdminAddEvidenceCtrl -- upload sucessful")
          $scope.$apply(function() {
            $scope.isLoading = false
            $scope.promote = ""
          })
          $modalInstance.close()
        },
        error: function(error) {
          alert("照片上传不成功！" + error.message)
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


  $scope.reloadReturnGoods = function(index) {
    var query = new AV.Query(YD.FreightReturn)
    query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED, YD.FreightReturn.STATUS_REAPPLY, YD.FreightReturn.STATUS_FREIGHTIN]);
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
      $scope.dt1 = new Date($scope.dt1)
      $scope.dt2 = new Date($scope.dt2)
      $scope.dt1.setHours(hour)
      $scope.dt1.setMinutes(minute)
      $scope.dt2.setHours(hour)
      $scope.dt2.setMinutes(minute)
      query.greaterThanOrEqualTo("createdAt", $scope.dt1)
      query.lessThanOrEqualTo("createdAt", $scope.dt2)
    }
    query.find({
      success: function(list) {
        $scope.$apply(function() {
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
      error: function(list, error) {
        //console.log("In AdminReturnGoodsCtrl -- ERROR: " + error.message)
      }
    });
  };
  $scope.searchingRK = function() {
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

  $scope.reloadReturnCount = function() {
    var query = new AV.Query(YD.FreightReturn);
    query.containedIn("status", [YD.FreightReturn.STATUS_PENDING, YD.FreightReturn.STATUS_REFUSED, YD.FreightReturn.STATUS_FINISHED]);
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
      $scope.dt1 = new Date($scope.dt1)
      $scope.dt2 = new Date($scope.dt2)
      $scope.dt1.setHours(hour)
      $scope.dt1.setMinutes(minute)
      $scope.dt2.setHours(hour)
      $scope.dt2.setMinutes(minute)
      query.greaterThanOrEqualTo("createdAt", $scope.dt1)
      query.lessThanOrEqualTo("createdAt", $scope.dt2)
    }
    query.find({
      success: function(list) {
        $scope.freightCount = $scope.adminBadge.K = list.length;

        //$scope.getButtonArray(count);
        for (var i = 0; i < list.length; i++) {
          var f = list[i];
          if (f.status == YD.FreightReturn.STATUS_REFUSED || f.status == YD.FreightReturn.STATUS_FINISHED) {
            $scope.adminBadge.K--;
          }
        }
      }
    });
  };
  $scope.open1 = function($event) {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened1 = true;
  }

  $scope.open2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened2 = true;
  }
  $scope.reloadSelectedTransaction = function() {
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
  };
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadReturnGoods($scope.currentPage - 1);
  }
  $scope.reloadReturnCount();

  if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER && $scope.currentUser.role != YD.User.ROLE_ADMIN_CUSTOMER_RETURN_GOODS) {
    //alert("您没有权限");
    return;
  } else {
    $scope.reloadReturnGoods(0)
  };
  $scope.$on('admincc', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchRK = false;
    $scope.queryNumber = '';
    $scope.reloadReturnCount();
    $scope.reloadReturnGoods(0);
  });

  $scope.searching = function() {
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
  $scope.refuseReturn = function(freightReturn) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addReason',
      controller: 'AdminAddRefuseReason',
      scope: $scope,
      size: 'sm',
      windowClass: 'center-modal'

    })
    modalInstance.result.then(function(notes) {
      freightReturn.notes = notes
      freightReturn.status = YD.FreightReturn.STATUS_REFUSED;
      freightReturn.save(null, {
        success: function(f) {
          var RKNumber = f.RKNumber;
          var query = new AV.Query(YD.FreightIn);
          query.equalTo("RKNUmber", RKNumber);
          query.find({
            success: function(list) {

            }
          })


          alert("已成功处理！")
          $scope.reloadReturnGoods();
        },
        error: function(f, error) {
          alert("出错！" + error.message)
        }
      });
    });
  };

  $scope.confirmReturn = function(freightReturn) {

    //$scope.isLoading = true
    //$scope.promote = "正在保存"
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
        success: function() {
          freightReturn.status = YD.FreightReturn.STATUS_FINISHED;
          freightReturn.save(null, {
            success: function(f) {
              $scope.reloadReturnGoods();
              alert("已成功处理！");
            },
            error: function(f, error) {
              alert("错误: " + error.message);

            }
          });
        },
        error: function(error) {
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
          freight: function() {
            return freightReturn
          }
        }
      });
      modalInstance.result.then(function() {
        AV.Cloud.run('chargingUserWithoutReward', {
          amount: amount,
          userId: freightReturn.user.id,
          notes: "退货收费",
          RKNumber: freightReturn.RKNumber,
          //YDNumber: 0,
          status: YD.Transaction.STATUS_CONSUME_RETURN_GOODS
        }, {
          success: function() {
            freightReturn.status = YD.FreightReturn.STATUS_FINISHED;
            freightReturn.save(null, {
              success: function(f) {
                $scope.reloadReturnGoods();
                alert("已成功处理！");
              },
              error: function(f, error) {
                alert("错误: " + error.message);
              }
            });
          },
          error: function(error) {
            alert("错误! " + error.message);
          }
        });

      });
    }
  }
  $scope.showFreightInDetail = function(f) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_freightInDetail',
      controller: 'FreightInDetailCtrl',
      scope: $scope,
      size: 'md',
      windowClass: 'center-modal',
      resolve: {
        freight: function() {
          return f;
        }
      }
    });
  }
})

YundaApp.controller('FreightInDetailCtrl', ["$scope", "$modalInstance", "freight", function($scope, $modalInstance, freight) {
  var RKNumber = freight.RKNumber;
  $scope.isLoading = true;
  $scope.promote = '请稍候...';
  var query = new AV.Query(YD.FreightIn);
  query.equalTo("RKNumber", RKNumber);
  query.find({
    success: function(list) {
      //console.log("list length: " + list.length);
      if (list.length == 1) {
        $scope.freightIn = list[0];
        var tmp = $scope.freightIn.updatedAt
        var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
        if (tmp.getMinutes() < 10)
          tmp_date += "0" + tmp.getMinutes()
        else
          tmp_date += tmp.getMinutes();
        $scope.freightIn.updatedAtToString = tmp_date
        $scope.isLoading = false;
        $scope.promote = '';
        $scope.$apply();
      } else {
        alert("找不到");
      }
    }
  });

  $scope.close = function() {
    $modalInstance.dismiss();
  }
}]);

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
  $scope.filesChangedFront = function(elm) {
    $scope.identityFront = elm.files
    $scope.$apply()
  }
  $scope.uploadIdentity = function() {
    ////console.log("In fileUpload back: " + $scope.identityBack)
    ////console.log("In fileUpload front: " + $scope.identityFront)

    if ($scope.identityFront != undefined) {
      $scope.isLoading = true
      $scope.promote = "正在上传..."
        //console.log("In fileUpload back: " + $scope.identityFront[0].name)
        ////console.log("In fileUpload front: " + $scope.identityBack[0].name)
      var frontName = freight.id + 'evidence.jpg'
      freight.adminEvidence = new AV.File(frontName, $scope.identityFront[0])
      freight.save(null, {
        success: function(f) {
          $scope.$apply(function() {
            $scope.isLoading = false
            $scope.promote = ""
          })
          $modalInstance.close();
        },
        error: function(error) {
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

  $scope.refuseReturn = function(freightCA) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_addReason',
      controller: 'AdminAddRefuseReason',
      scope: $scope,
      size: 'sm',
      windowClass: 'center-modal'

    })
    modalInstance.result.then(function(notes) {
      freightCA.notes = notes
      freightCA.status = YD.FreightChangeAddress.STATUS_REFUSED;
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

  $scope.confirmChange = function(freight) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal_adminEvidence',
      controller: 'AdminAddEvidenceChangeAddressCtrl',
      scope: $scope,
      size: 'sm',
      windowClass: 'center-modal',
      resolve: {
        freight: function() {
          return freight
        }
      }
    })
    modalInstance.result.then(function() {

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
          //console.log("AdminZhifubao -- length: " + list.length)
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
              ////console.log("In AdminZhifubaoCtr -- user[i].getDate(): " + tmp.getDate() + " | " + tmp)
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
  };
  $scope.$on('adminda', function() {
    $scope.reloadZhifubao();
  });
  $scope.searching = function() {
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
      //query.equalTo("user.email",  $scope.queryString);
    } else {
      //query.equalTo("user.stringId", $scope.queryString);
      innerQuery.equalTo("stringId", $scope.queryString);
      query.matchesQuery("user", innerQuery);
    }
    query.find({
      success: function(list) {
        $scope.$apply(function() {
          //console.log("AdminZhifubao -- length: " + list.length)
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
              ////console.log("In AdminZhifubaoCtr -- user[i].getDate(): " + tmp.getDate() + " | " + tmp)
          }
        })
      }
    })
  }
  $scope.confirmRecharge = function(transaction) {

    $scope.isLoading = true
    $scope.promote = "正在处理..."
    AV.Cloud.run('increaseUserBalance', {
      //source: response.id,
      id: transaction.id,
      role: $scope.currentUser.role
    }, {
      success: function() {
        $scope.isLoading = false
        $scope.promote = ""
        alert("操作成功！")
        $scope.reloadZhifubao()
      },
      error: function(error) {
        //console.log("In AdminZhifubaoCtrl -- ERROR: " + error.message)
      }
    })

  }
})
YundaApp.controller('PrintController', ["$scope", "$rootScope", function($scope, $rootScope) {
  $scope.package = {
    identity: false
  };
  $scope.freight = $rootScope.printFreight;
  //console.log("descriptionList");
  //console.log($scope.freight.descriptionList);
  for (var i = 0; i < $scope.freight.descriptionList.length; i++) {
    //console.log(i + ": " + $scope.freight.descriptionList[i].name);
  }
  var r = confirm("是否打印身份证?");
  if (!r) {

  } else {
    $scope.package.identity = true;

  }
  //console.log("freight: " + $scope.freight.YDNumber);

}]);

YundaApp.controller('AdminDeletePackageCtrl', ["$scope", function($scope) {
  $scope.reloadDelete = function(index) {
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
      success: function(list) {
        $scope.freights = list;
        for (var i = 0; i < $scope.freights.length; i++) {
          var tmp = $scope.freights[i].updatedAt;
          var tmp1 = $scope.freights[i].createdAt;
          var tmp_date = tmp.getFullYear() + "/" + (parseInt(tmp.getMonth()) + 1) + "/" + tmp.getDate() + " " + tmp.getHours() + ":";
          if (tmp.getMinutes() < 10) {
            tmp_date += "0" + tmp.getMinutes();
          } else {
            tmp_date += tmp1.getMinutes();
          }
          var tmp_date1 = tmp1.getFullYear() + "/" + (parseInt(tmp1.getMonth()) + 1) + "/" + tmp1.getDate() + " " + tmp1.getHours() + ":";
          if (tmp1.getMinutes() < 10) {
            tmp_date1 += "0" + tmp1.getMinutes();
          } else {
            tmp_date1 += tmp1.getMinutes();
          }
          _
          $scope.freights[i].updatedAtToString = tmp_date;
          $scope.freights[i].createdAtToString = tmp_date1;
          //console.log("createdAtirng: " + $scope.freights[i].createdAtToString);
        }
      },
      error: function(error) {
        alert("错误!" + error.message);
      }
    });
  };


  $scope.reloadCount = function() {
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
      success: function(count) {
        $scope.freightCount = count;
      }
    });
  };
  $scope.reloadDelete(0);
  $scope.reloadCount();
  $scope.setPage = function() {
    $scope.currentPage = $scope.inputPage;
    $scope.reloadDelete($scope.currentPage - 1);
  }
  $scope.searching = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
      alert("您没有权限");
      return;
    }
    $scope.searchTN = false;
    $scope.searchName = true;
    $scope.reloadDelete(0);
    $scope.reloadCount();
  };
  $scope.searchingTN = function() {
    if ($scope.currentUser.role != YD.User.ROLE_ADMIN && $scope.currentUser.role != YD.User.ROLE_DEVELOPER && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE && $scope.currentUser.role != YD.User.ROLE_ADMIN_FINANCE_YD) {
      alert("您没有权限");
      return;
    }
    $scope.searchTN = true;
    $scope.searchName = false;
    $scope.reloadDelete(0);
    $scope.reloadCount();
  };
  $scope.$on('admindf', function() {
    $scope.searchName = false;
    $scope.queryString = '';
    $scope.searchTN = false;
    $scope.queryNumber = '';
    $scope.reloadDelete(0);
    $scope.reloadCount();
  });
}]);

// AngularJS Google Maps loader

YundaApp.controller("PayReturnCtrl", ["$scope", "$timeout", "$location", function($scope, $timeout, $location) {
  $scope.counter = 3;
  var stopped;
  //console.log("in PayReturnCtrl --");
  $scope.countdown = function() {
    $timeout(function() {
      //console.log($scope.counter);
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

YundaApp.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  })
});


YundaApp.controller('ContactController', function($scope, uiGmapGoogleMapApi) {
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
  uiGmapGoogleMapApi.then(function(maps) {

  });

  $scope.submitEnquiryForm = function() {
    $scope.enquiry.receiver = "nqw0129@126.com";
    AV.Cloud.run('sendEmail', $scope.enquiry, {
      success: function() {
        alert("感谢您的留言！我们将及时跟您回复！");
      },
      error: function(error) {
        //console.log("ERROR: " + error.message)
      }
    });
  }
});

/* directives.js */

YundaApp.directive("yundaNavbar", function() {
  return {
    restrict: "E",
    replace: true,
    transclude: true,
    templateUrl: 'partials/navbar'
  }
});

YundaApp.directive("yundaFooter", function() {
  return {
    restrict: "E",
    replace: true,
    transclude: true,
    templateUrl: 'partials/footer'
  }
});

YundaApp.directive("barcodeApi", function() {

  return {
    scope: {
      'id': '='
    },

    link: function(scope, element, attrs) {
      attrs.$observe('barcodeApi', function(value) {
        //console.log("in directive -- value: " + value)
        console.log("in directive -- scope.id " + scope.id)
        var url = "http://api-bwipjs.rhcloud.com/?bcid=code128&text=" + scope.id + "&includetext"
        var img = angular.element("<img alt='Barcoded value 1234567890' src=\"" + url + "\" style=\"width:320px;height:100px;\">")
        console.log("in directive, url: " + url)
          //console.log("in directive, img: " + img)

        angular.element(element).append(img)
      });
    }
  }
})

/* filters.js */

YundaApp.filter('splitPackageFilter', function() {
  return function(freights) {
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

YundaApp.filter('normalPackageFilter', function() {
  return function(freights) {
    var filtered = [];
    if (freights == undefined) {
      return filtered;
    } else {
      for (var i = 0; i < freights.length; i++) {
        var f = freights[i];
        if (!f.isSplit && !f.isSplitPremium && !f.isMerged) {
          filtered.push(f);
        }
      }
      return filtered;
    }
  }
});

YundaApp.filter('packageSearchFilter', function() {
  return function(list, input) {
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