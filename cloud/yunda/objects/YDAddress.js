//================================================================================
// YDAddress is a subclass of AV.Object
// Class name: Address
// Author: Xujie Song
// Copyright: SK8 PTY LTd
//================================================================================

var YDAddress = AV.Object.extend("Address", {
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
	getSuburb: function() {
		return this.get("suburb");
	},
	setSuburb: function(suburb) {
		this.set("suburb", suburb);
	},
	getContactNumber: function() {
		return this.get("contactNumber");
	},
	setContactNumber: function(contactNumber) {
		this.set("contactNumber", contactNumber);
	},
	getCountry: function() {
		return this.get("country");
	},
	setCountry: function(country) {
		this.set("country", country);
	},
	getPostalCode: function() {
		return this.get("postalCode");
	},
	setPostalCode: function(postalCode) {
		this.set("postalCode", postalCode);
	},
	getRecipient: function() {
		return this.get("recipient");
	},
	setRecipient: function(recipient) {
		this.set("recipient", recipient);
	},
	getState: function() {
		return this.get("state");
	},
	setState: function(state) {
		this.set("state", state);
	},
	getStreet1: function() {
		return this.get("street1");
	},
	setStreet1: function(street1) {
		this.set("street1", street1);
	},
	getStreet2: function() {
		return this.get("street1");
	},
	setStreet2: function(street2) {
		this.set("street2", street2);
	},
	getUser: function() {
		return this.get("user");
	},
	setUser: function(user) {
		this.set("user", user);
	}
}, {

});

//================================================================================
// Shelf Methods
//================================================================================

YDAddress.prototype.getUserWithCallBack = function(callback) {
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

Object.defineProperty(YDAddress.prototype, "suburb", {
	get: function() {
		return this.get("suburb");
	},
	set: function(value) {
		this.set("suburb", suburb);
	}
});
Object.defineProperty(YDAddress.prototype, "contactNumber", {
	get: function() {
		return this.get("contactNumber");
	},
	set: function(value) {
		this.set("contactNumber", value);
	}
});
Object.defineProperty(YDAddress.prototype, "country", {
	get: function() {
		return this.get("country");
	},
	set: function(value) {
		this.set("country", value);
	}
});
Object.defineProperty(YDAddress.prototype, "postalCode", {
	get: function() {
		return this.get("postalCode");
	},
	set: function(value) {
		this.set("postalCode", value);
	}
});
Object.defineProperty(YDAddress.prototype, "recipient", {
	get: function() {
		return this.get("recipient");
	},
	set: function(value) {
		this.set("recipient", value);
	}
});
Object.defineProperty(YDAddress.prototype, "state", {
	get: function() {
		return this.get("state");
	},
	set: function(value) {
		this.set("state", value);
	}
});
Object.defineProperty(YDAddress.prototype, "street1", {
	get: function() {
		return this.get("street1");
	},
	set: function(value) {
		this.set("street1", value);
	}
});
Object.defineProperty(YDAddress.prototype, "street2", {
	get: function() {
		return this.get("street2");
	},
	set: function(value) {
		this.set("street2", value);
	}
});
Object.defineProperty(YDAddress.prototype, "user", {
	get: function() {
		return this.get("user");
	},
	set: function(value) {
		this.set("user", value);
	}
});

YDAddress.prototype.getSuburb = function() {
	return this.get("suburb");
}

YDAddress.prototype.setSuburb = function(suburb) {
	this.set("suburb", suburb);
}

YDAddress.prototype.getContactNumber = function() {
	return this.get("contactNumber");
}

YDAddress.prototype.setContactNumber = function(contactNumber) {
	this.set("contactNumber", contactNumber);
}

YDAddress.prototype.getCountry = function() {
	return this.get("country");
};

YDAddress.prototype.setCountry = function(country) {
	this.set("country", country);
};

YDAddress.prototype.getPostalCode = function() {
	return this.get("postalCode");
}

YDAddress.prototype.setPostalCode = function(postalCode) {
	this.set("postalCode", postalCode);
}

YDAddress.prototype.getRecipient = function() {
	return this.get("recipient");
}

YDAddress.prototype.setRecipient = function(recipient) {
	this.set("recipient", recipient);
}

YDAddress.prototype.getState = function() {
	return this.get("state");
}

YDAddress.prototype.setState = function(state) {
	this.set("state", state);
}

YDAddress.prototype.getStreet1 = function() {
	return this.get("street1");
}

YDAddress.prototype.setStreet1 = function(street1) {
	this.set("street1", street1);
}

YDAddress.prototype.getStreet2 = function() {
	return this.get("street2");
}

YDAddress.prototype.setStreet2 = function(street2) {
	this.set("street2", street2);
}

YDAddress.prototype.getUser = function() {
	return this.get("user");
}

YDAddress.prototype.setUser = function(user) {
	this.set("user", user);
}

//================================================================================
// Export class
//================================================================================

module.exports = YDAddress;