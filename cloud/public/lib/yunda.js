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
  YD.Address = AV.Object.extend("Address", {
    getUserWithCallback: function(callback) {
      var user = this.getUser();
      if (user != undefined) {
        user.fetch().then(function(user) {
          callback(user, undefined);
        }, function(error) {
          callback(user, error);
        });
      }
    },
    getSuburb: function() {
      return this.get("suburb");
    },
    setSuburb: function(suburb) {
      this.set("suburb", suburb);
    },
    getContactNumber: function() {
      return this.get("contactNumber");
    },
    setContactNumber: function(contactNumber) {
      this.set("contactNumber", contactNumber);
    },
    getCountry: function() {
      return this.get("country");
    },
    setCountry: function(country) {
      this.set("country", country);
    },
    getPostalCode: function() {
      return this.get("postalCode");
    },
    setPostalCode: function(postalCode) {
      this.set("postalCode", postalCode);
    },
    getRecipient: function() {
      return this.get("recipient");
    },
    setRecipient: function(recipient) {
      this.set("recipient", recipient);
    },
    getState: function() {
      return this.get("state");
    },
    setState: function(state) {
      this.set("state", state);
    },
    getStreet1: function() {
      return this.get("street1");
    },
    setStreet1: function(street1) {
      this.set("street1", street1);
    },
    getStreet2: function() {
      return this.get("street1");
    },
    setStreet2: function(street2) {
      this.set("street2", street2);
    },
    getUser: function() {
      return this.get("user");
    },
    setUser: function(user) {
      this.set("user", user);
    }
  }, {

  });
  Object.defineProperty(YD.Address.prototype, "objectId", {
    get: function() {
      return this.get("objectId");
    },
    set: function(value) {
      this.set("objectId", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "city", {
    get: function() {
      return this.get("city");
    },
    set: function(value) {
      this.set("city", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "suburb", {
    get: function() {
      return this.get("suburb");
    },
    set: function(value) {
      this.set("suburb", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "contactNumber", {
    get: function() {
      return this.get("contactNumber");
    },
    set: function(value) {
      this.set("contactNumber", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "country", {
    get: function() {
      return this.get("country");
    },
    set: function(value) {
      this.set("country", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "postalCode", {
    get: function() {
      return this.get("postalCode");
    },
    set: function(value) {
      this.set("postalCode", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "recipient", {
    get: function() {
      return this.get("recipient");
    },
    set: function(value) {
      this.set("recipient", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "state", {
    get: function() {
      return this.get("state");
    },
    set: function(value) {
      this.set("state", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "street1", {
    get: function() {
      return this.get("street1");
    },
    set: function(value) {
      this.set("street1", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "street2", {
    get: function() {
      return this.get("street2");
    },
    set: function(value) {
      this.set("street2", value);
    }
  });
  Object.defineProperty(YD.Address.prototype, "user", {
    get: function() {
      return this.get("user");
    },
    set: function(value) {
      this.set("user", value);
    }
  });

  YD.Freight = AV.Object.extend("Freight", {
    getAddressWithCallBack: function(callback) {
      var address = this.getAddress();
      if (address != undefined) {
        address.fetch().then(function(address) {
          callback(address, undefined);
        }, function(error) {
          callback(undefined, error);
        });
      } else {
        var error = new Error("Address is nil");
        callback(undefined, error);
      }
    },
    getAddress: function() {
      var addressId = this.get("addressId");
      if (addressId != undefined) {
        var address = new SH.Address({
          "id": id
        });
        return address;
      } else {
        return undefined;
      }
    },
    setAddress: function(address) {
      this.set("addressId", address.id);
    },
    getUserWithCallback: function(callback) {
      var user = this.getUser();
      if (user != undefined) {;
        user.fetch().then(function(user) {
          callback(user, undefined);
        }, function(error) {
          callback(user, error);
        });
      }
    },
    getStatus: function() {
      return this.get("status");
    },
    setStatus: function(status) {
      this.set("status", status);
    },
    getUser: function() {
      return this.get("user");
    },
    setUser: function(user) {
      this.set("user", user);
    }
  }, {
    STATUS_INITIALIZED: 0,
    //Pending user action
    STATUS_PENDING_USER_ACTION: 100,
    //Pending admin action
    STATUS_PENDING_SPLIT_PACKAGE: 200,
    STATUS_PENDING_SPLIT_PACKAGE_CHARGED: 210,
    STATUS_PENDING_REDUCE_WEIGHT: 220,
    STATUS_PENDING_EXTRA_PACKAGING: 230,
    STATUS_PENDING_CHECK_PACKAGE:240,
    //Pending user action
    STATUS_PENDING_FINAL_CONFIRMATION: 300,
    //Pending admin action
    STATUS_PENDING_DELIVERY: 500,
    STATUS_DELIVERING: 510,
    //Pending chinese admin action
    STATUS_PASSING_CUSTOM: 600,
    STATUS_FINAL_DELIVERY: 610,
    STATUS_DELIVERED: 620
  });

  Object.defineProperty(YD.Freight.prototype, "address", {
    get: function() {
      var addressId = this.get("addressId");
      if (addressId != undefined) {
        var address = new SH.Address({
          "id": id
        });
        return address;
      } else {
        return undefined;
      }
    },
    set: function(value) {
      this.set("addressId", value.id);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "addressId", {
    get: function() {
      return this.get("addressId");
    },
    set: function(value) {
      this.set("addressId", value);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "user", {
    get: function() {
      return this.get("user");
    },
    set: function(value) {
      this.set("user", value);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "notes", {
    get: function() {
      return this.get("notes");
    },
    set: function(value) {
      this.set("notes", value);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "insurance", {
    get: function() {
      return this.get("insurance");
    },
    set: function(value) {
      this.set("insurance", value);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "taxInsurance", {
    get: function() {
      return this.get("taxInsurance");
    },
    set: function(value) {
      this.set("taxInsurance", value);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "status", {
    get: function() {
      return this.get("status");
    },
    set: function(value) {
      this.set("status", value);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "statusGroup", {
    get: function() {
      return this.get("statusGroup");
    },
    set: function(value) {
      this.set("statusGroup", value);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "extraStrength", {
    get: function() {
      return this.get("extraStrength");
    },
    set: function(value) {
      this.set("extraStrength", value);
    }
  });

  Object.defineProperty(YD.Freight.prototype, "reductWeight", {
    get: function() {
      return this.get("reductWeight");
    },
    set: function(value) {
      this.set("reductWeight", value);
    }
  });


  YD.FreightGroup = AV.Object.extend("FreightGroup", {
    getStatus: function() {
      return this.get("status");
    },
    setStatus: function(status) {
      this.set("status", status);
    }
  }, {
    //Pending admin action
    STATUS_DELIVERING: 500,
    //Pending chinese admin action
    STATUS_PASSING_CUSTOM: 600,
    STATUS_PASSED_CUSTOM: 610
  });

//================================================================================
// Shelf Methods
//================================================================================

//Pending admin action
  YD.FreightGroup.STATUS_DELIVERING = 500;
//Pending chinese admin action
  YD.FreightGroup.STATUS_PASSING_CUSTOM = 600;
  YD.FreightGroup.STATUS_PASSED_CUSTOM = 610;

//================================================================================
// Property setters and getters
//================================================================================

  Object.defineProperty(YD.FreightGroup.prototype, "status", {
    get: function() {
      return this.get("status");
    },
    set: function(value) {
      this.set("status", value);
    }
  });

  YD.FreightIn = AV.Object.extend("Freight", {
    getAddressWithCallBack: function(callback) {
      var address = this.getAddress();
      if (address != undefined) {
        address.fetch().then(function(address) {
          callback(address, undefined);
        }, function(error) {
          callback(undefined, error);
        });
      } else {
        var error = new Error("Address is nil");
        callback(undefined, error);
      }
    },
    getAddress: function() {
      var addressId = this.get("addressId");
      if (addressId != undefined) {
        var address = new SH.Address({
          "id": id
        });
        return address;
      } else {
        return undefined;
      }
    },
    setAddress: function(address) {
      this.set("addressId", address.id);
    },
    getUserWithCallback: function(callback) {
      var user = this.getUser();
      if (user != undefined) {;
        user.fetch().then(function(user) {
          callback(user, undefined);
        }, function(error) {
          callback(user, error);
        });
      }
    },
    getStatus: function() {
      return this.get("status");
    },
    setStatus: function(status) {
      this.set("status", status);
    },
    getUser: function() {
      return this.get("user");
    },
    setUser: function(user) {
      this.set("user", user);
    }
  }, {
    STATUS_INITIALIZED: 0,
    //Pending user action
    STATUS_ARRIVED: 200,
    STATUS_CONFIRMED: 300

  });

//================================================================================
// Shelf Methods
//================================================================================

  YD.FreightIn.STATUS_INITIALIZED = 0
//Pending user action
  YD.FreightIn.STATUS_ARRIVED = 200
  YD.FreightIn.STATUS_CONFIRMED = 300

  YD.FreightIn.prototype.getAddressWithCallBack = function(callback) {
    var address = this.getAddress();
    if (address != undefined) {
      address.fetch().then(function(address) {
        callback(address, undefined);
      }, function(error) {
        callback(undefined, error);
      });
    } else {
      var error = new Error("Address is nil");
      callback(undefined, error);
    }
  }

  YD.FreightIn.prototype.getUserWithCallBack = function(callback) {
    var user = this.getUser();
    if (user != undefined) {;
      user.fetch().then(function(user) {
        callback(user, undefined);
      }, function(error) {
        callback(user, error);
      });
    }
  }

//================================================================================
// Property setters and getters
//================================================================================

  Object.defineProperty(YD.FreightIn.prototype, "address", {
    get: function() {
      var addressId = this.get("addressId");
      if (addressId != undefined) {
        var address = new SH.Address({
          "id": id
        });
        return address;
      } else {
        return undefined;
      }
    },
    set: function(value) {
      this.set("addressId", value.id);
    }
  });

  Object.defineProperty(YD.FreightIn.prototype, "addressId", {
    get: function() {
      return this.get("addressId");
    },
    set: function(value) {
      this.set("addressId", value);
    }
  });

  Object.defineProperty(YD.FreightIn.prototype, "status", {
    get: function() {
      return this.get("status");
    },
    set: function(value) {
      this.set("status", value);
    }
  });

  Object.defineProperty(YD.FreightIn.prototype, "trackingId", {
    get: function() {
      return this.get("trackingId");
    },
    set: function(value) {
      this.set("trackingId", value);
    }
  });

  Object.defineProperty(YD.FreightIn.prototype, "user", {
    get: function() {
      return this.get("user");
    },
    set: function(value) {
      this.set("user", value);
    }
  });
  // YD.Transactoin = require('cloud/shelf/objects/YDTransactoin.js')
  YD.User = AV.Object.extend("_User", {
    isUser: function(user) {
      if (user != undefined) {
        return this.id == user.id;
      } else {
        return false;
      }
    },
    isNotUser: function(user) {
      return !this.isUser(user);
    },
    hasVerifiedEmail: function() {
      return this.get("emailVerified");
    },
    hasVerifiedMobileNumber: function() {
      if (this.getMobileNumber() != undefined) {
        return true;
      } else {
        return false;
      }
    },
    getAddressWithCallBack: function(callback) {
      var address = this.getAddress();
      if (address != undefined) {
        address.fetch().then(function(address) {
          callback(address, undefined);
        }, function(error) {
          callback(undefined, error);
        });
      } else {
        var error = new Error("Address is nil");
        callback(undefined, error);
      }
    },
    getAddress: function() {
      var addressId = this.get("addressId");
      if (addressId != undefined) {
        var address = new SH.Address({
          "id": id
        });
        return address;
      } else {
        return undefined;
      }
    },
    setAddress: function(address) {
      this.set("addressId", address.id);
    },
    getEmail: function() {
      return this.get("email");
    },
    setEmail: function(email) {
      this.set("email", email);
    },
    getMobileNumber: function() {
      return this.get("mobileNumber");
    },
    setMobileNumber: function(mobilePhoneNumber) {
      this.set("mobileNumber", mobilePhoneNumber);
      this.set("mobilePhoneVerified", true);
      this.save();
    },
    getProfileImage: function() {
      return this.get("profileImage");
    },
    setProfileImage: function(profileImage) {
      this.set("profileImage", profileImage);
      this.save();
    },
    getProfileName: function() {
      return this.get("profileName");
    },
    setProfileName: function(profileName) {
      this.set("profileName", profileName);
    },
    getRealName: function() {
      return this.get("realName");
    },
    setRealName: function(realName) {
      this.set("realName", realName);
    },
    getUserName: function() {
      return this.get("username");
    },
    setUserName: function(username) {
      this.set("username", username);
    },
    getReward: function() {
      return this.get("reward");
    },
    setReward: function(reward) {
      this.set("reward", reward);
    }
  }, {

  });

  Object.defineProperty(YD.User.prototype, "address", {
    get: function() {
      var addressId = this.get("addressId");
      if (addressId != undefined) {
        var address = new SH.Address({
          "id": id
        });
        return address;
      } else {
        return undefined;
      }
    },
    set: function(value) {
      this.set("addressId", value.id);
    }
  });
  Object.defineProperty(YD.User.prototype, "addressId", {
    get: function() {
      return this.get("addressId");
    },
    set: function(value) {
      this.set("addressId", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "emailVerified", {
    get: function() {
      return this.get("emailVerified");
    },
    set: function(value) {
      this.set("emailVerified", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "mobileNumber", {
    get: function() {
      return this.get("mobileNumber");
    },
    set: function(value) {
      this.set("mobileNumber", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "password", {
    get: function() {
      return this.get("password");
    },
    set: function(value) {
      this.set("password", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "profileImage", {
    get: function() {
      return this.get("profileImage");
    },
    set: function(value) {
      this.set("profileImage", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "profileName", {
    get: function() {
      return this.get("profileName");
    },
    set: function(value) {
      this.set("profileName", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "realName", {
    get: function() {
      return this.get("realName");
    },
    set: function(value) {
      this.set("realName", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "balance", {
    get: function() {
      return this.get("balance");
    },
    set: function(value) {
      this.set("balance", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "reward", {
    get: function() {
      return this.get("reward");
    },
    set: function(value) {
      this.set("reward", value);
    }
  });
  Object.defineProperty(YD.User.prototype, "username", {
    get: function() {
      return this.get("username");
    },
    set: function(value) {
      this.set("username", value);
    }
  });
  //var StatusGroup = AV.Object.extend("StatusGroup");
  //Object.defineProperty(StatusGroup.prototype, "url", {
  //  get: function(){
  //    return this.get("url");
  //  },
  //  set: function(val){
  //    this.set("url", val);
  //  }
  //});
}).call(this);