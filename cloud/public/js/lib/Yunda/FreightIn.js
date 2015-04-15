//================================================================================
// FreightIn is a subclass of AV.Object
// Class name: FreightIn 
// Author: Tianyi Li
// Copyright: SK8 PTY LTd
//================================================================================
var FreightIn = AV.Object.extend("FreightIn");



//================================================================================
// Property setters and getters for AngularJS
//================================================================================
Object.defineProperty(FreightIn.prototype, "courier", {
	get: function(){
		return this.get("courier");
	},
	set: function(val){
		this.set("FreightIn", val);
	}
});

Object.defineProperty(FreightIn.prototype, "user", {
	get: function(){
		return this.get("user");
	},
	set: function(val){
		this.set("user", val);
	}
});

Object.defineProperty(FreightIn.prototype, "status", {
	get: function(){
		return this.get("status");
	},
	set: function(val){
		this.set("status", val);
	}
});

Object.defineProperty(FreightIn.prototype, "address", {
	get: function(){
		return this.get("address");
	},
	set: function(val){
		this.set("address", val);
	}
});

Object.defineProperty(FreightIn.prototype, "trackingNumber", {
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
FreightIn.prototype.getUser = function(){
	return this.get("user");
}

FreightIn.prototype.setUser = function(val){
	this.set("user", val);
}

FreightIn.prototype.getCourier = function(){
	return this.get("courier");
}

FreightIn.prototype.setCourier = function(val){
	this.set("courier", val);
}

FreightIn.prototype.getStatus = function(){
	return this.get("status");
}

FreightIn.prototype.setStatus = function(val){
	this.set("status", val);
}
FreightIn.prototype.getAddress = function(){
	return this.get("address");
}

FreightIn.prototype.setAddress = function(val){
	this.set("address", val);
}

FreightIn.prototype.getTrackingNumber = function(){
	return this.get("trackingNumber");
}

FreightIn.prototype.setTrackingNumber = function(val){
	this.set("trackingNumber", val);
}


//================================================================================
// Export class
//================================================================================

module.exports = FreightIn;