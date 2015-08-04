
/*
 * GET home page.
 */
//var YD = require('cloud/yunda');

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
  if(isSuccess) {
    var transId = req.query.out_trade_no;
    var alipayId = req.query.trade_no;
    var Transaction = AV.Object.extend("Transaction");
    transaction = new Transaction();
    transaction.set('id', transId);
    transaction.set('status', 100);
    transaction.set('notes', "支付宝充值,流水号为:" + alipayId);
    transaction.save(null, {
      success: function(t) {
        res.render('partials/payReturn');
      }
    });
  } else {
    res.render('partials/payReturnFail');
  }
};

exports.alipayNotify = function(req, res) {
  var transId = req.query.out_trade_no;
  var Transaction = AV.Object.extend("Transaction");
  transaction = new Transaction();
  transaction.set('id', transId);
  transaction.set('status', 100);
  transaction.save(null, {});
};