//================================================================================
// FreightOut is a subclass of AV.Object
// Class name: FreightOut 
// Author: Tianyi Li
// Copyright: SK8 PTY LTd
//================================================================================
var FreightOut = AV.Object.extend("FreightOut");



//================================================================================
// Property setters and getters for AngularJS
//================================================================================
Object.defineProperty(FreightOut.prototype, "courier", {
	get: function(){
		return this.get("courier");
	},
	set: function(val){
		this.set("FreightOut", val);
	}
});

Object.defineProperty(FreightOut.prototype, "user", {
	get: function(){
		return this.get("user");
	},
	set: function(val){
		this.set("user", val);
	}
});

Object.defineProperty(FreightOut.prototype, "status", {
	get: function(){
		return this.get("status");
	},
	set: function(val){
		this.set("status", val);
	}
});

Object.defineProperty(FreightOut.prototype, "address", {
	get: function(){
		return this.get("address");
	},
	set: function(val){
		this.set("address", val);
	}
});

Object.defineProperty(FreightOut.prototype, "trackingNumber", {
	get: function(){
		return this.get("trackingNumber");
	},
	set: function(val){
		this.set("trackingNumber", val);
	}
});


//================================================================================
// Methods
//================================================================================
FreightOut.prototype.getUser = function(){
	return this.get("user");
}

FreightOut.prototype.setUser = function(val){
	this.set("user", val);
}

FreightOut.prototype.getCourier = function(){
	return this.get("courier");
}

FreightOut.prototype.setCourier = function(val){
	this.set("courier", val);
}

FreightOut.prototype.getStatus = function(){
	return this.get("status");
}

FreightOut.prototype.setStatus = function(val){
	this.set("status", val);
}
FreightOut.prototype.getAddress = function(){
	return this.get("address");
}

FreightOut.prototype.setAddress = function(val){
	this.set("address", val);
}

FreightOut.prototype.getTrackingNumber = function(){
	return this.get("trackingNumber");
}

FreightOut.prototype.setTrackingNumber = function(val){
	this.set("trackingNumber", val);
}


//================================================================================
// Export class
//================================================================================

module.exports = FreightOut;