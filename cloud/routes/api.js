
/*
 * Serve JSON to our AngularJS client
 */

var crypto = require('crypto');
var debug = require('debug')('api');

var config = {
  "sign_type": "MD5",
  "alipay_gateway": "https://mapi.alipay.com/gateway.do?",
  "https_verify_url": "https://mapi.alipay.com/gateway.do?service=notify_verify&",
  "partner": "2088021259932744",
  "key": "kngmwv7crl2c6zyhrooihpzjkrkd62ym",
  "notify_url": "http://www.yundawl.com/notify",
  "return_url": "http://www.yundawl.com/return"
};

var PID = config.partner;
var KEY = config.key;

var defaultParams = {
  service: 'create_direct_pay_by_user',
  partner: PID,
  '_input_charset': 'utf-8',
  //支付类型，必填，不能修改
  payment_type: '1',
  notify_url: config.notify_url,
  return_url: config.return_url
};

exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

exports.requestAlipay = function (req, res) {
  debug('now in requestAlipay');
  var transId = req.body.tranId;
  var userId = req.body.userId;
  var total = req.body.total_fee;
  var body = userId;
  var finalParams = JSON.parse(JSON.stringify(defaultParams));
  finalParams['out_trade_no'] = transId;
  finalParams['subject'] = 'YD Recharge ';
  finalParams['seller_id'] = PID;
  finalParams['total_fee'] = total;
  finalParams['body'] = body;
  debug('params: %j', finalParams);
  console.log(finalParams);

  var result = '<form id="alipaysubmit" name="alipaysubmit"' +
      ' action="' + config.alipay_gateway + '"' +
      ' method="' + 'get' + '">';
  var reqParams = buildRequestPara(finalParams);
  for (k in reqParams) {
    result += '<input type="hidden" name="' + k + '" value="' + reqParams[k] + '"/><br />';
  }
  result += '<script>document.forms["alipaysubmit"].submit();</script>';
  debug('generate request html:', result);
  console.log("result: " + result);
  res.send(result);
};

var buildRequestPara = function(params) {
  var reqParams = paraFilter(params);
  var paramsStr = createLinkString(reqParams);
  if (config.sign_type === 'MD5') {
    reqParams.sign = crypto.createHash('md5').update(paramsStr + config.key).digest('hex');
    debug('build request params: paramsString=' + paramsStr + ', sign=' + reqParams.sign);
    reqParams.sign_type = config.sign_type;
  } else {
    reqParams.sign = '';
  }
  return reqParams;
}

// 除去数组中的空值和签名参数
var paraFilter = function(params) {
  var result = {};
  if (!params) {
    return result;
  }
  for (var k in params) {
    if (!params[k] || params[k] === '' || k === 'sign' || k === 'sign_type') {
      continue;
    }
    result[k] = params[k];
  }
  return result;
}

// 将所有参数按照“参数=参数值”的模式用“&”字符拼接成字符串
var createLinkString = function(params) {
  var result = '';
  var sortKeys = Object.keys(params).sort();
  for (var i in sortKeys) {
    result += sortKeys[i] + '=' + params[sortKeys[i]] + '&';
  }
  if (result.length > 0) {
    return result.slice(0, -1);
  } else {
    return result;
  }
};
