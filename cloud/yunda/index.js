//================================================================================
// Yunda is a utility class for apps empowered for Yunda
// Author: Xujie Song
// Copyright: SK8 PTY LTD
//================================================================================

"use strict";

//Isolation function
(function() {
  //Default function
  var moduleName = "Yunda";
  var AV_App_Id = "umouw51mkumgpt72hhir61xemo3b7q2n5js0zce3b96by895";
  var AV_App_Key = "svsw3nybfcax9ssw7czti2fk86ak9gp6ekrb00essagscyrg";
  //Set root for browser
  var root = this;
  if (root != undefined) {
    var previous_mymodule = root.Yunda;
  }
  //Check module dependency
  var has_require = typeof require !== 'undefined';
  if (root != undefined) {
    var AV = root.AV;
  }
  if (typeof AV === 'undefined') {
    if (has_require) {
      AV = require('avoscloud-sdk').AV;
      AV.initialize(AV_App_Id, AV_App_Key);
    } else throw new Error(moduleName + ' requires AV, see http://leancloud.cn');
  } else {
    AV.initialize(AV_App_Id, AV_App_Key);
  }
  //Initialize module
  var YD = function() {}
  YD.noConflict = function() {
    if (root != undefined) {
      root.YD = previous_mymodule;
    }
    return YD;
  }
  YD.showError = function(error) {
    window.alert(error.message);
  }
  YD.log = function(message) {
    console.log(message);
  }
  YD.sendSMS = function(message, receiver) {
    AV.Cloud.run('sendSMS', {
      'receiver': receiver,
      'message': message
    });
  }
  YD.sendEmail = function(receiver, subject, message) {
    AV.Cloud.run('sendEmail', {
      'receiver': receiver,
      'subject': subject,
      'message': message
    });
  }
  YD.sendPush = function(userIds, message) {
    AV.Cloud.run('sendPush', {
      'ids': userIds,
      'message': message
    });
  }
  //Export module
  if (typeof exports !== 'undefined') {
    exports = module.exports = YD;
  } else {
    //Change the root.mymodule to root.YD
    root.YD = YD;
  }
  //Module code
  // YD.Error = require('cloud/shelf/objects/YDError.js')
  YD.Address = require('cloud/shelf/objects/YDAddress.js')
  YD.Freight = require('cloud/shelf/objects/YDFreight.js')
  YD.FreightGroup = require('cloud/shelf/objects/YDFreightGroup.js')
  YD.FreightIn = require('cloud/shelf/objects/YDFreightIn.js')
  // YD.Transactoin = require('cloud/shelf/objects/YDTransactoin.js')
  YD.User = require('cloud/shelf/objects/YDUser.js')

}).call(this);