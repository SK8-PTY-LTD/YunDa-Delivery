//================================================================================
// YDUser is a subclass of AV.User
// Class name: _User
// Author: Xujie Song
//================================================================================

var YDUser = AV.Object.extend("_User", {
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

//================================================================================
// Shelf Methods
//================================================================================

YDUser.prototype.isUser = function(user) {
  if (user != undefined) {
    return this.id == user.id;
  } else {
    return false;
  }
}

YDUser.prototype.isNotUser = function(user) {
  return !this.isUser(user);
}

YDUser.prototype.hasVerifiedEmail = function() {
  return this.get("emailVerified");
}

YDUser.prototype.hasVerifiedMobileNumber = function() {
  if (this.getMobileNumber() != undefined) {
    return true;
  } else {
    return false;
  }
}

YDUser.prototype.getAddressWithCallBack = function(callback) {
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

//================================================================================
// Property setters and getters
//================================================================================


Object.defineProperty(YDUser.prototype, "address", {
  get: function () {
    var addressId = this.get("addressId");
    if (addressId != undefined) {
      var address = new YD.Address({
        "id": id
      });
      return address;
    } else {
      return undefined;
    }
  },
  set: function (value) {
    this.set("addressId", value.id);
  }
});
Object.defineProperty(YDUser.prototype, "role", {
  get: function () {
    return this.get("role");
  },
  set: function (value) {
    this.set("role", value);
  }
});
Object.defineProperty(YDUser.prototype, "email", {
  get: function () {
    return this.get("email");
  },
  set: function (value) {
    this.set("email", value);
  }
});


Object.defineProperty(YDUser.prototype, "pendingBalance", {
  get: function () {
    var result = this.get("pendingBalance")
    //console.log("In SDK -- pendingBalance: " + result + " type: " + typeof(result))
    return this.get("pendingBalance");
  },
  set: function (value) {
    this.set("pendingBalance", value);
  }
});

Object.defineProperty(YDUser.prototype, "pendingBalanceInDollar", {
  get: function () {
    var result = parseFloat((this.get("pendingBalance") / 100).toFixed(2))
    //console.log("In SDK -- pendingBalanceInDollar: " +  this.get("pendingBalance") + " | type: " + typeof((this.get("pendingBalance"))))
    return result;
  },
  set: function (value) {
    value = parseFloat(value)
    this.set("pendingBalance", (parseFloat(value.toFixed(2))) * 100);
  }
});

Object.defineProperty(YDUser.prototype, "addressId", {
  get: function () {
    return this.get("addressId");
  },
  set: function (value) {
    this.set("addressId", value);
  }
});

Object.defineProperty(YDUser.prototype, "emailVerified", {
  get: function () {
    return this.get("emailVerified");
  },
  set: function (value) {
    this.set("emailVerified", value);
  }
});
Object.defineProperty(YDUser.prototype, "mobile", {
  get: function () {
    return this.get("mobile");
  },
  set: function (value) {
    this.set("mobile", value);
  }
});
Object.defineProperty(YDUser.prototype, "password", {
  get: function () {
    return this.get("password");
  },
  set: function (value) {
    this.set("password", value);
  }
});
Object.defineProperty(YDUser.prototype, "profileImage", {
  get: function () {
    return this.get("profileImage");
  },
  set: function (value) {
    this.set("profileImage", value);
  }
});
Object.defineProperty(YDUser.prototype, "profileName", {
  get: function () {
    return this.get("profileName");
  },
  set: function (value) {
    this.set("profileName", value);
  }
});
Object.defineProperty(YDUser.prototype, "realName", {
  get: function () {
    return this.get("realName");
  },
  set: function (value) {
    this.set("realName", value);
  }
});
Object.defineProperty(YDUser.prototype, "balance", {
  get: function () {
    return this.get("balance");
  },
  set: function (value) {
    this.set("balance", value);
  }
});
Object.defineProperty(YDUser.prototype, "balanceInDollar", {
  get: function () {
    return parseFloat((parseInt(this.get("balance")) / 100).toFixed(2));
  },
  set: function (value) {
    value = parseFloat(value)
    this.set("balance", (parseFloat(value.toFixed(2))) * 100);
  }
});

Object.defineProperty(YDUser.prototype, "totalBalanceInDollar", {
  get: function () {
    return parseFloat(((parseInt(this.get("balance")) / 100) + (parseInt(this.get("rewardBalance")) / 100)).toFixed(2));
  }
  //,
  //set: function (value) {
  //    value = parseFloat(value)
  //    this.set("balance", (parseFloat(value.toFixed(2))) * 100);
  //}
});
Object.defineProperty(YDUser.prototype, "balanceInYuan", {
  get: function () {
    var dollar = this.totalBalanceInDollar;
    var yuan = parseFloat((dollar * 6.4).toFixed(2));
    return yuan;
  }
});
Object.defineProperty(YDUser.prototype, "rewardBalance", {
  get: function () {
    return this.get("rewardBalance");
  },
  set: function (value) {
    this.set("rewardBalance", value);
  }
});

Object.defineProperty(YDUser.prototype, "rewardBalanceInDollar", {
  get: function () {
    var rewardDollar = parseFloat(this.get("rewardBalance") / 100);
    return rewardDollar;
  },
  set: function (value) {
    value = parseFloat(value);
    this.set("rewardBalance", (parseFloat(value.toFixed(2))) * 100);
  }
});
Object.defineProperty(YDUser.prototype, "accumulatedReward", {
  get: function () {
    return this.get("accumulatedReward");
  },
  set: function (value) {
    this.set("accumulatedReward", value);
  }
});

Object.defineProperty(YDUser.prototype, "username", {
  get: function () {
    return this.get("username");
  },
  set: function (value) {
    this.set("username", value);
  }
});
Object.defineProperty(YDUser.prototype, "mobilePhoneNumber", {
  get: function () {
    return this.get("mobilePhoneNumber");
  },
  set: function (value) {
    this.set("mobilePhoneNumber", value);
  }
});

Object.defineProperty(YDUser.prototype, "contactNumber", {
  get: function () {
    return this.get("contactNumber");
  },
  set: function (value) {
    this.set("contactNumber", value);
  }
});
Object.defineProperty(YDUser.prototype, "identityFront", {
  get: function () {
    return this.get("identityFront");
  },
  set: function (value) {
    this.set("identityFront", value);
  }
});
Object.defineProperty(YDUser.prototype, "identityBack", {
  get: function () {
    return this.get("identityBack");
  },
  set: function (value) {
    this.set("identityBack", value);
  }
});
Object.defineProperty(YDUser.prototype, "numberId", {
  get: function () {
    return this.get("numberId");
  },
  set: function (value) {
    this.set("numberId", value);
  }
});

Object.defineProperty(YDUser.prototype, "stringId", {
  get: function () {
    return this.get("stringId");
  },
  set: function (value) {
    this.set("stringId", value);
  }
});

YDUser.ROLE_ADMIN = 100;
YDUser.ROLE_USER = 200;
YDUser.ROLE_DEVELOPER = 190;


YDUser.prototype.getAddress = function() {
  var addressId = this.get("addressId");
  if (addressId != undefined) {
    var address = new SH.Address({
      "id": id
    });
    return address;
  } else {
    return undefined;
  }
};

YDUser.prototype.setAddress = function(address) {
  this.set("addressId", address.id);
}

YDUser.prototype.getEmail = function() {
  return this.get("email");
}

YDUser.prototype.setEmail = function(email) {
  this.set("email", email);
}

YDUser.prototype.getMobilePhoneNumber = function() {
  return this.get("mobilePhoneNumber");
}

YDUser.prototype.setMobilePhoneNumber = function(mobilePhoneNumber) {
  this.set("mobilePhoneNumber", mobilePhoneNumber);
}

YDUser.prototype.getProfileImage = function() {
  return this.get("profileImage");
}

YDUser.prototype.setProfileImage = function(profileImage) {
  this.set("profileImage", profileImage);
  this.save();
}

YDUser.prototype.getProfileName = function() {
  return this.get("profileName");
}

YDUser.prototype.setProfileName = function(profileName) {
  this.set("profileName", profileName);
}

YDUser.prototype.getRealName = function() {
  return this.get("realName");
}

YDUser.prototype.setRealName = function(realName) {
  this.set("realName", realName);
}

YDUser.prototype.getReward = function() {
  return this.get("reward");
}

YDUser.prototype.setReward = function(reward) {
  this.set("reward", reward);
}

YDUser.prototype.getUserName = function() {
  return this.get("username");
}

YDUser.prototype.setUserName = function(username) {
  this.set("username", username);
}

//================================================================================
// Export class
//================================================================================

module.exports = YDUser;