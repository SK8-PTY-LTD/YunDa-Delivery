YDTransaction = AV.Object.extend("Transaction", {},{

});

YDTransaction.STATUS_ZHIFUBAO = 100;
YDTransaction.STATUS_STRIPE = 200;
YDTransaction.STATUS_CONSUME = 300;
YDTransaction.STATUS_RECHARGE = 400;
YDTransaction.STATUS_PENDING_RETURN_BALANCE = 500;
YDTransaction.STATUS_CONFIRMED_RETURN_BALANCE = 590;
YDTransaction.STATUS_ZHIFUBAO_CONFIRMED = 190;



Object.defineProperty(YDTransaction.prototype, "record", {
    get: function() {
        return this.get("record");
    },
    set: function(value) {
        this.set("record", value);
    }
});

Object.defineProperty(YDTransaction.prototype, "user", {
    get: function() {
        return this.get("user");
    },
    set: function(value) {
        this.set("user", value);
    }
});

Object.defineProperty(YDTransaction.prototype, "status", {
    get: function() {
        return this.get("status");
    },
    set: function(value) {
        this.set("status", value);
    }
});

Object.defineProperty(YDTransaction.prototype, "zhifubao", {
    get: function() {
        return this.get("zhifubao");
    },
    set: function(value) {
        this.set("zhifubao", value);
    }
});

Object.defineProperty(YDTransaction.prototype, "reason", {
    get: function() {
        return this.get("reason");
    },
    set: function(value) {
        this.set("reason", value);
    }
});

Object.defineProperty(YDTransaction.prototype, "amount", {
    get: function() {
        return this.get("amount");
    },
    set: function(value) {
        this.set("amount", value);
    }
});

Object.defineProperty(YDTransaction.prototype, "adminEvidence", {
    get: function() {
        return this.get("adminEvidence");
    },
    set: function(value) {
        this.set("adminEvidence", value);
    }
});


//================================================================================
// Export class
//================================================================================

module.exports = YDTransaction