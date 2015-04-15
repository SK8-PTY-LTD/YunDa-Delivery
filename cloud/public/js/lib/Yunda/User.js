//================================================================================
// User is a subclass of AV.Object
// Class name: User
// Author: Tianyi Li
// Copyright: SK8 PTY LTd
//================================================================================
var User = AV.Object.extend("_User", {

	getAddress: function(){
		return this.get("address");
	},
	setAddress: function(val){
		this.set("address", val);
	},
	getBalance: function(){
		return this.get("balance");
	},
	setBalance: function(val){
		this.set("balance", val);
	}

}, {

});

//================================================================================
// Property setters and getters for AngularJS
//================================================================================
Object.defineProperty(User.prototype, "address", {
	get: function() {
		return this.get("address");
	},
	set: function(val){
		this.set("address", val);
	}
});

Object.defineProperty(User.prototype, "balance", {
	get: function() {
		return this.get("balance");
	},
	set: function(val){
		this.set("balance", val);
	}
});

//================================================================================
// Methods
//================================================================================

User.prototype.getAddress = function(){
	return this.get("address");
}

User.prototype.setAddress = function(val){
	this.set("address", val);
}

User.prototype.getBalance = function(){
	return this.get("balance");
}

User.prototype.setBalance = function(val){
	this.set("balance", val);
}

//================================================================================
// Export class
//================================================================================

module.exports = User;
