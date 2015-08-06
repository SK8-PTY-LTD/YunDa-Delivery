
/*
 * GET home page.
 */
var AV = require('leanengine');
//require('node-monkey').start({host: "127.0.0.1", port:"50500"});


var AV_App_Id = "umouw51mkumgpt72hhir61xemo3b7q2n5js0zce3b96by895";
var AV_App_Key = "svsw3nybfcax9ssw7czti2fk86ak9gp6ekrb00essagscyrg";
var AV_MASTER_KEY = "oepybbiejpca2afdunnc0s8z35tkiwub5zvrrqomydfsej32";
AV.initialize(AV_App_Id, AV_App_Key, AV_MASTER_KEY);

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
  var totalInDollar = parseInt(req.query.total_fee * 100);
  console.log(isSuccess + " | " + userId + " | " + totalInDollar);
  if(isSuccess) {
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
        var user = AV.Object.extend("_User");
        //user.set("id", userId);
        user.get(userId, {
          success: function(fetchedUser) {
            var userBl = parseInt(fetchedUser.get("balance"));
            fetchedUser.set("balance", (userBl + totalInDollar));
            fetchedUser.save(null, {
              success: function(u) {
                res.render('partials/payReturn');
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
  var userId = req.query.body;
  var totalInDollar = parseInt(req.query.total_fee * 100);
  console.log(isSuccess + " | " + userId + " | " + totalInDollar);
  if(isSuccess) {
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
        var user = AV.Object.extend("_User");
        //user.set("id", userId);
        user.get(userId, {
          success: function(fetchedUser) {
            var userBl = parseInt(fetchedUser.get("balance"));
            fetchedUser.set("balance", (userBl + totalInDollar));
            fetchedUser.save(null, {
              success: function(u) {
                res.render('partials/payReturn');
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