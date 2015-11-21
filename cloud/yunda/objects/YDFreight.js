//================================================================================
// YDFreight is a subclass of AV.Object
// Class name: Address
// Author: Xujie Song
// Copyright: SK8 PTY LTd
//================================================================================

var YDFreight = AV.Object.extend("Freight", {
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

//================================================================================
// Shelf Methods
//================================================================================

YDFreight.STATUS_INITIALIZED = 0;
//Pending user action
YDFreight.STATUS_PENDING_USER_ACTION = 100;
//Pending admin action
YDFreight.STATUS_PENDING_SPLIT_PACKAGE = 200;
YDFreight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED = 210;
YDFreight.STATUS_PENDING_REDUCE_WEIGHT = 220;
YDFreight.STATUS_PENDING_EXTRA_PACKAGING = 230;
//Pending user action
YDFreight.STATUS_PENDING_FINAL_CONFIRMATION = 300;
//Pending admin action
YDFreight.STATUS_PENDING_DELIVERY = 500;
YDFreight.STATUS_DELIVERING = 510;
//Pending chinese admin action
YDFreight.STATUS_PASSING_CUSTOM = 600;
YDFreight.STATUS_FINAL_DELIVERY = 610;
YDFreight.STATUS_DELIVERED = 620;

YDFreight.prototype.hadPaidInsurance = function() {
	return this.get("insurance");
}

YDFreight.prototype.hasPaidTaxInsurance = function() {
	return this.get("taxInsurance");
}

YDFreight.prototype.getAddressWithCallBack = function(callback) {
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

YDFreight.prototype.getUserWithCallBack = function(callback) {
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

Object.defineProperty(YDFreight.prototype, "address", {
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

Object.defineProperty(YDFreight.prototype, "addressId", {
  get: function() {
    return this.get("addressId");
  },
  set: function(value) {
    this.set("addressId", value);
  }
});

Object.defineProperty(YDFreight.prototype, "isSpeedManual", {
  get: function() {
    return this.get("isSpeedManual");
  },
  set: function(value) {
    this.set("isSpeedManual", value);
  }
});

Object.defineProperty(YDFreight.prototype, "user", {
	get: function() {
		return this.get("user");
	},
	set: function(value) {
		this.set("user", value);
	}
});

Object.defineProperty(YDFreight.prototype, "insurance", {
	get: function() {
		return this.get("insurance");
	},
	set: function(value) {
		this.set("insurance", value);
	}
});

Object.defineProperty(YDFreight.prototype, "taxInsurance", {
  get: function() {
    return this.get("taxInsurance");
  },
  set: function(value) {
    this.set("taxInsurance", value);
  }
});

Object.defineProperty(YDFreight.prototype, "status", {
  get: function() {
    return this.get("status");
  },
  set: function(value) {
    this.set("status", value);
  }
});

Object.defineProperty(YDFreight.prototype, "weight", {
  get: function() {
    return this.get("weight");
  },
  set: function(value) {
    this.set("weight", value);
  }
});

YDFreight.prototype.getAddress = function() {
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

YDFreight.prototype.setAddress = function(address) {
  this.set("addressId", address.id);
}

YDFreight.prototype.getStatus = function() {
  return this.get("status");
}

YDFreight.prototype.setStatus = function(status) {
  this.set("status", status);
}

YDFreight.prototype.getUser = function() {
	return this.get("user");
}

YDFreight.prototype.setUser = function(user) {
	this.set("user", user);
}

//================================================================================
// Export class
//================================================================================

module.exports = YDFreight;