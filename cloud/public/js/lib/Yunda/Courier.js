//================================================================================
// Courier is a subclass of AV.Object
// Class name: Courier
// Author: Tianyi Li
// Copyright: SK8 PTY LTd
//================================================================================
var Courier = AV.Object.extend("Courier");



//================================================================================
// Property setters and getters for AngularJS
//================================================================================
Object.defineProperty(Courier.prototype, "courierName", {
	get: function(){
		return this.get("courierName");
	},
	set: function(val){
		this.set("courier", val);
	}
});

Object.defineProperty(Courier.prototype, "url", {
	get: function(){
		return this.get("url");
	},
	set: function(val){
		this.set("url", val);
	}
});


//================================================================================
// Methods
//================================================================================

Courier.prototype.getCourierName = function(){
	return this.get("courierName");
}

Courier.prototype.setCourierName = function(val){
	this.set("courierName", val);
}

Courier.prototype.getUrl = function(){
	return this.get("url");
}

Courier.prototype.setUrl = function(val){
	this.set("url", val);
}


//================================================================================
// Export class
//================================================================================

module.exports = Courier;