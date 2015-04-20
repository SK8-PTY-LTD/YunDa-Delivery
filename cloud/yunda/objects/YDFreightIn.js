//================================================================================
// YDFreightIn is a subclass of AV.Object
// Class name: Address
// Author: Xujie Song
// Copyright: SK8 PTY LTd
//================================================================================

var YDFreightIn = AV.Object.extend("Freight", {
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
  STATUS_ARRIVED: 200
});

//================================================================================
// Shelf Methods
//================================================================================

YDFreightIn.STATUS_INITIALIZED = 0
//Pending user action
YDFreightIn.STATUS_ARRIVED = 200

YDFreightIn.prototype.getAddressWithCallBack = function(callback) {
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

YDFreightIn.prototype.getUserWithCallBack = function(callback) {
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

Object.defineProperty(YDFreightIn.prototype, "address", {
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

Object.defineProperty(YDFreightIn.prototype, "addressId", {
  get: function() {
    return this.get("addressId");
  },
  set: function(value) {
    this.set("addressId", value);
  }
});

Object.defineProperty(YDFreightIn.prototype, "status", {
  get: function() {
    return this.get("status");
  },
  set: function(value) {
    this.set("status", value);
  }
});

Object.defineProperty(YDFreightIn.prototype, "trackingId", {
  get: function() {
    return this.get("trackingId");
  },
  set: function(value) {
    this.set("trackingId", value);
  }
});

Object.defineProperty(YDFreightIn.prototype, "user", {
  get: function() {
    return this.get("user");
  },
  set: function(value) {
    this.set("user", value);
  }
});

YDFreightIn.prototype.getAddress = function() {
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

YDFreightIn.prototype.setAddress = function(address) {
  this.set("addressId", address.id);
}

YDFreightIn.prototype.getStatus = function() {
  return this.get("status");
}

YDFreightIn.prototype.setStatus = function(status) {
  this.set("status", status);
}

YDFreightIn.prototype.getTrackingId = function() {
  return this.get("trackingId");
}

YDFreightIn.prototype.setTrackingId = function(trackingId) {
  this.set("trackingId", trackingId);
}

YDFreightIn.prototype.getUser = function() {
  return this.get("user");
}

YDFreightIn.prototype.setUser = function(user) {
  this.set("user", user);
}

//================================================================================
// Export class
//================================================================================

module.exports = YDFreightIn;