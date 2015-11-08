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

exports.index = function(req, res) {
  res.render('index');
};

exports.partials = function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.verify = function(req, res) {
  res.render('partials/verify');
};

//alipay
exports.alipayReturn = function(req, res) {

  var saveUpdatedUser = function(user) {
    console.log("7. Saving user: " + user.id);
    user.save(null, {
      success: function(savedUser) {
        console.log("7. Attempt 1: User Saved. New Balance: " + savedUser.get("balance"));
        console.log("--------支付宝充值回调 End--------");
        res.render('partials/payReturn');
      },
      error: function(u, error) {
        console.log("7. Attempt 1: User Saved Failed, Retry");
        user.save(null, {
          success: function(savedUser) {
            console.log("7. Attempt 2: User Saved. New Balance: " + savedUser.get("balance"));
            console.log("--------支付宝充值回调 End--------");
            res.render('partials/payReturn');
          },
          error: function(u, error) {
            console.log("7. Attempt 2: User Saved Failed, Retry");
            user.save(null, {
              success: function(savedUser) {
                console.log("7. Attempt 3: User Saved. New Balance: " + savedUser.get("balance"));
                console.log("--------支付宝充值回调 End--------");
                res.render('partials/payReturn');
              },
              error: function(u, error) {
                console.log("7. Attempt 3: User Saved Failed, Retry");
                user.save(null, {
                  success: function(savedUser) {
                    console.log("7. Attempt 4: User Saved. New Balance: " + savedUser.get("balance"));
                    console.log("--------支付宝充值回调 End--------");
                    res.render('partials/payReturn');
                  },
                  error: function(u, error) {
                    console.log("7. Attempt 4: User Saved Failed, Retry");
                    user.save(null, {
                      success: function(savedUser) {
                        console.log("7. Attempt 5: User Saved. New Balance: " + savedUser.get("balance"));
                        console.log("--------支付宝充值回调 End--------");
                        res.render('partials/payReturn');
                      },
                      error: function(u, error) {
                        console.log("7. Attempt 5: User Saved Failed, End");
                        console.log("--------支付宝充值回调 End--------");
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

  var updateUserBalance = function(transaction, user) {
    var totalInDollar = transaction.get("amount");
    var userBalance = parseFloat(user.get("balance"));
    console.log("6. Update User Balance, Old Balance: " + userBalance + ", increment: " + totalInDollar);
    user.increment("balance", totalInDollar);
    saveUpdatedUser(user);
  }

  var getUserBalance = function(transaction, userId) {
    console.log("5. Getting User, userId: " + userId);
    var query = new AV.Query("_User");
    query.get(userId, {
      success: function(fetchedUser) {
        console.log("5. Attempt 1: Get user successful");
        updateUserBalance(transaction, fetchedUser);
      },
      error: function(u, error) {
        console.log("5. Attempt 1: Get user failed, Retry");
        var query = new AV.Query("_User");
        query.get(userId, {
          success: function(fetchedUser) {
            console.log("5. Attempt 2: Get user successful");
            updateUserBalance(transaction, fetchedUser);
          },
          error: function(u, error) {
            console.log("5. Attempt 2: Get user failed, Retry");
            var query = new AV.Query("_User");
            query.get(userId, {
              success: function(fetchedUser) {
                console.log("5. Attempt 3: Get user successful");
                updateUserBalance(transaction, fetchedUser);
              },
              error: function(u, error) {
                console.log("5. Attempt 3: Get user failed, Retry");
                var query = new AV.Query("_User");
                query.get(userId, {
                  success: function(fetchedUser) {
                    console.log("5. Attempt 4: Get user successful");
                    updateUserBalance(transaction, fetchedUser);
                  },
                  error: function(u, error) {
                    console.log("5. Attempt 4: Get user failed, Retry");
                    var query = new AV.Query("_User");
                    query.get(userId, {
                      success: function(fetchedUser) {
                        console.log("5. Attempt 5: Get user successful");
                        updateUserBalance(transaction, fetchedUser);
                      },
                      error: function(u, error) {
                        console.log("5. Attempt 5: Get user failed, End");
                        console.log("--------支付宝充值回调 End--------");
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

  var updateTransaction = function(transaction, userId) {
    //Get Alipay Id
    var alipayId = req.query.trade_no;
    console.log("4. Updating transaction, alipayId: " + alipayId);
    //YD.Transaction.STATUS_ZHIFUBAO = 100, if change in the future, remember to change this line
    transaction.set('status', 100);
    transaction.set('record', alipayId);
    transaction.set('notes', "支付宝充值");
    console.log("4. Saving transaction: " + transaction.id);
    transaction.save(null, {
      success: function(savedTransaction) {
        console.log("4. Attempt 1: Transaction Saved");
        getUserBalance(savedTransaction, userId);
      },
      error: function(t, error) {
        console.log("4. Attempt 1: Transaction Saved Failed, Retry");
        transaction.save(null, {
          success: function(savedTransaction) {
            console.log("4. Attempt 2: Transaction Saved");
            getUserBalance(savedTransaction, userId);
          },
          error: function(t, error) {
            console.log("4. Attempt 2: Transaction Saved Failed, Retry");
            transaction.save(null, {
              success: function(savedTransaction) {
                console.log("4. Attempt 3: Transaction Saved");
                getUserBalance(savedTransaction, userId);
              },
              error: function(t, error) {
                transaction.save(null, {
                  success: function(savedTransaction) {
                    console.log("4. Attempt 4: Transaction Saved");
                    getUserBalance(savedTransaction, userId);
                  },
                  error: function(t, error) {
                    console.log("4. Attempt 4: Transaction Saved Failed, Retry");
                    transaction.save(null, {
                      success: function(savedTransaction) {
                        console.log("4. Attempt 5: Transaction Saved");
                        getUserBalance(savedTransaction, userId);
                      },
                      error: function(t, error) {
                        console.log("4. Attempt 5: Transaction Saved Failed, End");
                        console.log("--------支付宝充值回调 End--------");
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

  var validateTransaction = function(transaction, totalInDollar, userId) {
    //Validate purchase
    var status = transaction.get("status");
    if (status == 100) {
      var totalFromTransaction = transaction.get("amount");
      if (totalFromTransaction == totalInDollar) {
        console.log("3. Transaction validate");
        updateTransaction(transaction, userId);
      } else {
        console.log("3. Transaction is not validate, suspected hacking");
        console.log("--------支付宝充值回调 End--------");
        res.render('partials/payReturnFail');
      }
    } else {
      console.log("3. Transaction already saved");
      console.log("--------支付宝充值回调 End--------");
      res.render('partials/payReturn');
    }
  }

  /**
   * Cloud function starts here
   * 1. Get Params
   * 2. Get Transaction
   * 3. Validate Transaction Status
   * 4. Update Transaction
   * 5. Get User Balance
   * 6. Update User Balance
   * 7. Save User Balance
   * 8. Return view
   * @type {Boolean}
   */
  var isSuccess = req.query.is_success;
  var body = req.query.body;
  var userId = body.substring(0, 24);
  console.log("--------支付宝充值回调 Start--------")
  console.log("1. body: " + body + " | " + body.length);
  console.log("1. userId: " + userId);
  var rate = parseFloat(body.substring(25, body.length));
  var totalInDollar = Math.floor(parseFloat(req.query.total_fee) / rate * 100); //actually this is totalInCent because user.balance is amount in cent.
  console.log("1. " + isSuccess + " | " + userId + " | " + totalInDollar + " | " + rate + typeof rate);

  if (isSuccess == "T") {
    var transId = req.query.out_trade_no;
    console.log("2. transId: " + transId);
    var query = new AV.Query("Transaction");
    query.get(transId, {
      success: function(fetchedTransaction) {
        console.log("2. Attempt 1: Get transaction successful");
        validateTransaction(fetchedTransaction, totalInDollar, userId);
      },
      error: function(t, error) {
        console.log("2. Attempt 1: Failed, Retrying");
        var query = new AV.Query("Transaction");
        query.get(transId, {
          success: function(fetchedTransaction) {
            console.log("2. Attempt 2: Get transaction successful");
            validateTransaction(fetchedTransaction, totalInDollar, userId);
          },
          error: function(t, error) {
            console.log("2. Attempt 2: Failed, Retrying");
            //Get transaction failed, third attempt
            var query = new AV.Query("Transaction");
            query.get(transId, {
              success: function(fetchedTransaction) {
                console.log("2. Attempt 3: Get transaction successful");
                validateTransaction(fetchedTransaction, totalInDollar, userId);
              },
              error: function(t, error) {
                console.log("2. Attempt 3: Failed. Error: ", error);
                console.log("--------支付宝充值回调 End--------");
                res.render('partials/payReturnFail');
              }
            });
          }
        });
      }
    });
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