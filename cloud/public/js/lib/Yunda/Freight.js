//================================================================================
// Freight is a subclass of AV.Object
// Class name: Freight 
// Author: Tianyi Li
// Copyright: SK8 PTY LTd
//================================================================================

var Freight = AV.Object.extend("Freight");


//================================================================================
// Property setters and getters for AngularJS
//================================================================================
Object.defineProperty(Freight.prototype, "courier", {
	get: function(){
		return this.get("courier");
	},
	set: function(val){
		this.set("Freight", val);
	}
});

Object.defineProperty(Freight.prototype, "user", {
	get: function(){
		return this.get("user");
	},
	set: function(val){
		this.set("user", val);
	}
});

Object.defineProperty(Freight.prototype, "status", {
	get: function(){
		return this.get("status");
	},
	set: function(val){
		this.set("status", val);
	}
});

Object.defineProperty(Freight.prototype, "address", {
	get: function(){
		return this.get("address");
	},
	set: function(val){
		this.set("address", val);
	}
});

Object.defineProperty(Freight.prototype, "trackingNumber", {
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
Freight.prototype.getUser = function(){
	return this.get("user");
}

Freight.prototype.setUser = function(val){
	this.set("user", val);
}

Freight.prototype.getCourier = function(){
	return this.get("courier");
}

Freight.prototype.setCourier = function(val){
	this.set("courier", val);
}

Freight.prototype.getStatus = function(){
	return this.get("status");
}

Freight.prototype.setStatus = function(val){
	this.set("status", val);
}
Freight.prototype.getAddress = function(){
	return this.get("address");
}

Freight.prototype.setAddress = function(val){
	this.set("address", val);
}

Freight.prototype.getTrackingNumber = function(){
	return this.get("trackingNumber");
}

Freight.prototype.setTrackingNumber = function(val){
	this.set("trackingNumber", val);
}


//================================================================================
// Export class
//================================================================================
module.exports = Freight;