//================================================================================
// Address is a subclass of AV.Object
// Class name: Address
// Author: Tianyi Li
// Copyright: SK8 PTY LTd
//================================================================================

var Address = AV.Object.extend("Address");

//================================================================================
// Property setters and getters for AngularJS
//================================================================================

Object.defineProperty(Address.prototype, "user", {
	get: function(){
		return this.get("user");
	},
	set: function(val){
		this.set("user", val);
	}
});

Object.defineProperty(Address.prototype, "receipient", {
	get: function(){
		return this.get("receipient");
	},
	set: function(val){
		this.set("receipient", val);
	}
});

Object.defineProperty(Address.prototype, "street1", {
	get: function(){
		return this.get("street1");
	},
	set: function(val){
		this.set("street1", val);
	}
});

Object.defineProperty(Address.prototype, "street2", {
	get: function(){
		return this.get("street2");
	},
	set: function(val){
		this.set("street2", val);
	}
});

Object.defineProperty(Address.prototype, "suburb", {
	get: function(){
		return this.get("suburb");
	},
	set: function(val){
		this.set("suburb", val);
	}
});

Object.defineProperty(Address.prototype, "state", {
	get: function(){
		return this.get("state");
	},
	set: function(val){
		this.set("state", val);
	}
});

Object.defineProperty(Address.prototype, "country", {
	get: function(){
		return this.get("country");
	},
	set: function(val){
		this.set("country", val);
	}
});

Object.defineProperty(Address.prototype, "postalCode", {
	get: function(){
		return this.get("postalCode");
	},
	set: function(val){
		this.set("postalCode", val);
	}
});


//================================================================================
// Methods
//================================================================================
	User.prototype.getUser = function(){
		return this.get("user");
	}

	User.prototype.setUser = function(val){
		this.set("user", val);
	}

	User.prototype.getReceipient = unction(){
		return this.get("receipient");
	}

	User.prototype.setReceipient = unction(val){
		this.set("receipient", val);
	}

	User.prototype.getStreet1 = function(){
		return this.get("street1");
	}

	User.prototype.setStreet1 = function(val){
		this.set("street1", val);
	}

	User.prototype.getStreet2 = function(){
		return this.get("street1");
	}

	User.prototype.setStreet2 = function(val){
		this.set("street2", val);
	}

	User.prototype.getSuburb = function(){
		return this.get("Suburb");
	}

	User.prototype.setSuburb = function(val){
		this.set("suburb", val);
	}

	User.prototype.getState = function(){
		return this.get("state");
	}

	User.prototype.setState = function(val){
		this.set("state", val);
	}

	User.prototype.getCountry = function(){
		return this.get("country");
	}

	User.prototype.setCountry = function(val){
		this.set("country", val);
	}

	User.prototype.getPostalCode = function(){
		return this.get("postalCode");
	}

	User.prototype.setPostalCode = function(val){
		this.set("postalCode", val);
	}

	
//================================================================================
// Export class
//================================================================================

module.exports = Address;