
/*
 * GET home page.
 */
var AV = require('leanengine');
//require('node-monkey').start({host: "127.0.0.1", port:"50500"});
var debug = require('debug')('index');

var AV_App_Id = "umouw51mkumgpt72hhir61xemo3b7q2n5js0zce3b96by895";
var AV_App_Key = "svsw3nybfcax9ssw7czti2fk86ak9gp6ekrb00essagscyrg";
var AV_MASTER_KEY = "oepybbiejpca2afdunnc0s8z35tkiwub5zvrrqomydfsej32";
AV.initialize(AV_App_Id, AV_App_Key, AV_MASTER_KEY);
AV.Cloud.useMasterKey();

exports.index = function(req, res){
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.verify = function(req, res) {
  res.render('partials/verify');
};

//alipay
exports.alipayReturn = function(req, res) {
  //var transId = req.params.out_trade_no;
  //var alipayId = req.params.trade_no;
  //var seller
  var isSuccess = req.query.is_success;
  var userId = req.query.body;
  var totalInDollar = (Math.floor(req.query.total_fee / 6.4 * 100))/100;
  console.log(isSuccess + " | " + userId + " | " + totalInDollar);
  debug('userId:', userId);

  if(isSuccess == "T") {
    var transId = req.query.out_trade_no;
    var alipayId = req.query.trade_no;
    var Transaction = AV.Object.extend("Transaction");
    transaction = new Transaction();
    transaction.set('id', transId);
    transaction.set('status', 100);
    transaction.set('record',alipayId);
    transaction.set('notes', "支付宝充值");
    transaction.save(null, {
      success: function(t) {
        console.log("transaction saved");
        var User = AV.Object.extend("_User");
        var query = new AV.Query(User);
        //user.set("id", userId);
        query.get(userId, {
          success: function(fetchedUser) {
            var userBl = parseInt(fetchedUser.get("balance"));
            debug('userBl:', userBl);
            console.log("user balance: " + userBl);

            fetchedUser.set("balance", (userBl + totalInDollar));
            fetchedUser.save(null, {
              success: function(u) {
                console.log("u saved: " + u.id + " | u.balance");
                res.render('partials/payReturn');
              }
            });
          },
          error: function(u, error) {

            console.log("error: " + error.message);
          }
        });
      },
      error: function(t, error) {
        t.save(null, {
          success: function (t1) {
            console.log("transaction saved");
            var User = AV.Object.extend("_User");
            var query = new AV.Query(User);
            //user.set("id", userId);
            query.get(userId, {
              success: function(fetchedUser) {
                var userBl = parseInt(fetchedUser.get("balance"));
                debug('userBl:', userBl);
                console.log("user balance: " + userBl);

                fetchedUser.set("balance", (userBl + totalInDollar));
                fetchedUser.save(null, {
                  success: function(u) {
                    console.log("u saved: " + u.id + " | u.balance");
                    res.render('partials/payReturn');
                  }
                });
              },
              error: function(u, error) {

                console.log("error: " + error.message);
              }
            });
          },
          error: function (t1, error) {
            t1.save(null, {
              success: function (t2) {
                console.log("transaction saved");
                var User = AV.Object.extend("_User");
                var query = new AV.Query(User);
                //user.set("id", userId);
                query.get(userId, {
                  success: function(fetchedUser) {
                    var userBl = parseInt(fetchedUser.get("balance"));
                    debug('userBl:', userBl);
                    console.log("user balance: " + userBl);

                    fetchedUser.set("balance", (userBl + totalInDollar));
                    fetchedUser.save(null, {
                      success: function(u) {
                        console.log("u saved: " + u.id + " | u.balance");
                        res.render('partials/payReturn');
                      }
                    });
                  }
                });
              },
              error: function (t2, error) {
                t2.save(null, {
                  success: function (t2) {
                    console.log("transaction saved");
                    var User = AV.Object.extend("_User");
                    var query = new AV.Query(User);
                    //user.set("id", userId);
                    query.get(userId, {
                      success: function (fetchedUser) {
                        var userBl = parseInt(fetchedUser.get("balance"));
                        debug('userBl:', userBl);
                        console.log("user balance: " + userBl);

                        fetchedUser.set("balance", (userBl + totalInDollar));
                        fetchedUser.save(null, {
                          success: function (u) {
                            console.log("u saved: " + u.id + " | u.balance");
                            res.render('partials/payReturn');
                          }
                        });
                      }
                    });
                  },
                  error: function (t3) {
                    t3.save(null, {
                      success: function (t4) {
                        var User = AV.Object.extend("_User");
                        var query = new AV.Query(User);
                        //user.set("id", userId);
                        query.get(userId, {
                          success: function (fetchedUser) {
                            var userBl = parseInt(fetchedUser.get("balance"));
                            debug('userBl:', userBl);
                            console.log("user balance: " + userBl);

                            fetchedUser.set("balance", (userBl + totalInDollar));
                            fetchedUser.save(null, {
                              success: function (u) {
                                console.log("u saved: " + u.id + " | u.balance");
                                res.render('partials/payReturn');
                              }
                            });
                          }
                        });
                      },
                      error: function (t5) {
                        t5.save(null, {
                          success: function (t6) {
                            var User = AV.Object.extend("_User");
                            var query = new AV.Query(User);
                            //user.set("id", userId);
                            query.get(userId, {
                              success: function (fetchedUser) {
                                var userBl = parseInt(fetchedUser.get("balance"));
                                debug('userBl:', userBl);
                                console.log("user balance: " + userBl);

                                fetchedUser.set("balance", (userBl + totalInDollar));
                                fetchedUser.save(null, {
                                  success: function (u) {
                                    console.log("u saved: " + u.id + " | u.balance");
                                    res.render('partials/payReturn');
                                  }
                                });
                              }
                            });
                          },
                          error: function(t6, error) {
                            t6.set("status", 101);
                            t6.save();
                            res.render('partials/payReturnFail');
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
     res.render('partials/payReturn');

  } else {
    res.render('partials/payReturnFail');
  }
};

exports.alipayNotify = function(req, res) {
  //var isSuccess = req.query.is_success;
  //var userId = req.query.body;
  //var totalInDollar = parseFloat((req.query.total_fee / 6.4).toFixed(2)) * 100;
  //console.log(userId + " | " + totalInDollar);
  ////debug('userId:', userId);
  //var transId = req.query.out_trade_no;
  //  var alipayId = req.query.trade_no;
  //  var Transaction = AV.Object.extend("Transaction");
  //  transaction = new Transaction();
  //  transaction.set('id', transId);
  //  transaction.set('status', 100);
  //  transaction.set('record',alipayId);
  //  transaction.set('notes', "支付宝充值");
  //  transaction.save(null, {
  //    success: function(t) {
  //      console.log("transaction saved");
  //      var User = AV.Object.extend("_User");
  //      var query = new AV.Query(User);
  //      //user.set("id", userId);
  //      query.get(userId, {
  //        success: function(fetchedUser) {
  //          var userBl = parseInt(fetchedUser.get("balance"));
  //          debug('userBl:', userBl);
  //          console.log("user balance: " + userBl);
  //
  //          fetchedUser.set("balance", (userBl + totalInDollar));
  //          fetchedUser.save(null, {
  //            success: function(u) {
  //              console.log("u saved: ");
  //            }
  //          });
  //        },
  //        error: function(u, error) {
  //          console.log("error: " + error.message);
  //        }
  //      });
  //    }
  //  });
};