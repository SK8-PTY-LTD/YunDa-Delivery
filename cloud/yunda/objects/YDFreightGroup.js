//================================================================================
// YDFreightGroup is a subclass of AV.Object
// Class name: Address
// Author: Xujie Song
// Copyright: SK8 PTY LTd
//================================================================================

var YDFreightGroup = AV.Object.extend("FreightGroup", {
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
YDFreightGroup.STATUS_DELIVERING = 500;
//Pending chinese admin action
YDFreightGroup.STATUS_PASSING_CUSTOM = 600;
YDFreightGroup.STATUS_PASSED_CUSTOM = 610;

//================================================================================
// Property setters and getters
//================================================================================

Object.defineProperty(YDFreight.prototype, "status", {
  get: function() {
    return this.get("status");
  },
  set: function(value) {
    this.set("status", value);
  }
});

YDFreightGroup.prototype.getStatus = function() {
  return this.get("status");
}

YDFreightGroup.prototype.setStatus = function(status) {
  this.set("status", status);
}

//================================================================================
// Export class
//================================================================================

module.exports = YDFreightGroup;