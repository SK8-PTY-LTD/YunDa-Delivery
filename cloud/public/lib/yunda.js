//================================================================================
// Yunda is a utility class for apps empowered for Yunda
// Author: Xujie Song
// Copyright: SK8 PTY LTD
//================================================================================

"use strict";

//Isolation function
(function () {
    //Default function
    var moduleName = "Yunda";
    var AV_App_Id = "umouw51mkumgpt72hhir61xemo3b7q2n5js0zce3b96by895";
    var AV_App_Key = "svsw3nybfcax9ssw7czti2fk86ak9gp6ekrb00essagscyrg";
    //Set root for browser
    var root = this;
    if (root != undefined) {
        var previous_mymodule = root.Yunda;
    }
    //Check module dependency
    var has_require = typeof require !== 'undefined';
    if (root != undefined) {
        var AV = root.AV;
    }
    if (typeof AV === 'undefined') {
        if (has_require) {
            AV = require('avoscloud-sdk').AV;
            AV.initialize(AV_App_Id, AV_App_Key);
        } else throw new Error(moduleName + ' requires AV, see http://leancloud.cn');
    } else {
        AV.initialize(AV_App_Id, AV_App_Key);
    }
    //Initialize module
    var YD = function () {
    }
    YD.noConflict = function () {
        if (root != undefined) {
            root.YD = previous_mymodule;
        }
        return YD;
    }
    YD.showError = function (error) {
        window.alert(error.message);
    }
    YD.log = function (message) {
        console.log(message);
    }
    YD.sendSMS = function (message, receiver) {
        AV.Cloud.run('sendSMS', {
            'receiver': receiver,
            'message': message
        });
    }
    YD.sendEmail = function (receiver, subject, message) {
        AV.Cloud.run('sendEmail', {
            'receiver': receiver,
            'subject': subject,
            'message': message
        });
    }
    YD.sendPush = function (userIds, message) {
        AV.Cloud.run('sendPush', {
            'ids': userIds,
            'message': message
        });
    }
    //Export module
    if (typeof exports !== 'undefined') {
        exports = module.exports = YD;
    } else {
        //Change the root.mymodule to root.YD
        root.YD = YD;
    }
    //Module code
    // YD.Error = require('cloud/shelf/objects/YDError.js')
    YD.Address = AV.Object.extend("Address", {
        getUserWithCallback: function (callback) {
            var user = this.getUser();
            if (user != undefined) {
                user.fetch().then(function (user) {
                    callback(user, undefined);
                }, function (error) {
                    callback(user, error);
                });
            }
        },
        getSuburb: function () {
            return this.get("suburb");
        },
        setSuburb: function (suburb) {
            this.set("suburb", suburb);
        },
        getContactNumber: function () {
            return this.get("contactNumber");
        },
        setContactNumber: function (contactNumber) {
            this.set("contactNumber", contactNumber);
        },
        getCountry: function () {
            return this.get("country");
        },
        setCountry: function (country) {
            this.set("country", country);
        },
        getPostalCode: function () {
            return this.get("postalCode");
        },
        setPostalCode: function (postalCode) {
            this.set("postalCode", postalCode);
        },
        getRecipient: function () {
            return this.get("recipient");
        },
        setRecipient: function (recipient) {
            this.set("recipient", recipient);
        },
        getState: function () {
            return this.get("state");
        },
        setState: function (state) {
            this.set("state", state);
        },
        getStreet1: function () {
            return this.get("street1");
        },
        setStreet1: function (street1) {
            this.set("street1", street1);
        },
        getStreet2: function () {
            return this.get("street1");
        },
        setStreet2: function (street2) {
            this.set("street2", street2);
        },
        getUser: function () {
            return this.get("user");
        },
        setUser: function (user) {
            this.set("user", user);
        }
    }, {});

    Object.defineProperty(YD.Address.prototype, "city", {
        get: function () {
            return this.get("city");
        },
        set: function (value) {
            this.set("city", value);
        }
    });
    Object.defineProperty(YD.Address.prototype, "suburb", {
        get: function () {
            return this.get("suburb");
        },
        set: function (value) {
            this.set("suburb", value);
        }
    });

    Object.defineProperty(YD.Address.prototype, "country", {
        get: function () {
            return this.get("country");
        },
        set: function (value) {
            this.set("country", value);
        }
    });
    Object.defineProperty(YD.Address.prototype, "postalCode", {
        get: function () {
            return this.get("postalCode");
        },
        set: function (value) {
            this.set("postalCode", value);
        }
    });
    Object.defineProperty(YD.Address.prototype, "recipient", {
        get: function () {
            return this.get("recipient");
        },
        set: function (value) {
            this.set("recipient", value);
        }
    });
    Object.defineProperty(YD.Address.prototype, "state", {
        get: function () {
            return this.get("state");
        },
        set: function (value) {
            this.set("state", value);
        }
    });

    Object.defineProperty(YD.Address.prototype, "contactNumber", {
        get: function () {
            return this.get("contactNumber");
        },
        set: function (value) {
            this.set("contactNumber", value);
        }
    });

    Object.defineProperty(YD.Address.prototype, "mobileNumber", {
        get: function () {
            return this.get("mobileNumber");
        },
        set: function (value) {
            this.set("mobileNumber", value);
        }
    });

    Object.defineProperty(YD.Address.prototype, "street1", {
        get: function () {
            return this.get("street1");
        },
        set: function (value) {
            this.set("street1", value);
        }
    });
    Object.defineProperty(YD.Address.prototype, "street2", {
        get: function () {
            return this.get("street2");
        },
        set: function (value) {
            this.set("street2", value);
        }
    });
    Object.defineProperty(YD.Address.prototype, "user", {
        get: function () {
            return this.get("user");
        },
        set: function (value) {
            this.set("user", value);
        }
    });

    Object.defineProperty(YD.Address.prototype, "identity", {
        get: function () {
            return this.get("identity");
        },
        set: function (value) {
            this.set("identity", value);
        }
    });
    YD.FreightReturn = AV.Object.extend("FreightReturn", {}, {});
    // user
    YD.FreightReturn.STATUS_PENDING = 100;
    // after admin confirmation
    YD.FreightReturn.STATUS_AWAITING = 200;
    YD.FreightReturn.STATUS_REFUSED = 900;
    YD.FreightReturn.STATUS_FINISHED = 990;


    Object.defineProperty(YD.FreightReturn.prototype, "address", {
        get: function () {
            return this.get("address");
        },
        set: function (value) {
            this.set("address", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "amount", {
        get: function () {
            return this.get("amount");
        },
        set: function (value) {
            this.set("amount", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "trackingNumber", {
        get: function () {
            return this.get("trackingNumber");
        },
        set: function (value) {
            this.set("trackingNumber", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "YDNumber", {
        get: function () {
            return this.get("YDNumber");
        },
        set: function (value) {
            this.set("YDNumber", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "reason", {
        get: function () {
            return this.get("reason");
        },
        set: function (value) {
            this.set("reason", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "user", {
        get: function () {
            return this.get("user");
        },
        set: function (value) {
            this.set("user", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "status", {
        get: function () {
            return this.get("status");
        },
        set: function (value) {
            this.set("status", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "notes", {
        get: function () {
            return this.get("notes");
        },
        set: function (value) {
            this.set("notes", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "identityFirst", {
        get: function () {
            return this.get("identityFirst");
        },
        set: function (value) {
            this.set("identityFirst", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "identitySecond", {
        get: function () {
            return this.get("identitySecond");
        },
        set: function (value) {
            this.set("identitySecond", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "identityThird", {
        get: function () {
            return this.get("identityThird");
        },
        set: function (value) {
            this.set("identityThird", value);
        }
    });

    Object.defineProperty(YD.FreightReturn.prototype, "adminEvidence", {
        get: function () {
            return this.get("adminEvidence");
        },
        set: function (value) {
            this.set("adminEvidence", value);
        }
    });


    YD.Freight = AV.Object.extend("Freight", {
        getAddressWithCallBack: function (callback) {
            var address = this.getAddress();
            if (address != undefined) {
                address.fetch().then(function (address) {
                    callback(address, undefined);
                }, function (error) {
                    callback(undefined, error);
                });
            } else {
                var error = new Error("Address is nil");
                callback(undefined, error);
            }
        },
        getAddress: function () {
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
        setAddress: function (address) {
            this.set("addressId", address.id);
        },
        getUserWithCallback: function (callback) {
            var user = this.getUser();
            if (user != undefined) {
                ;
                user.fetch().then(function (user) {
                    callback(user, undefined);
                }, function (error) {
                    callback(user, error);
                });
            }
        },
        getStatus: function () {
            return this.get("status");
        },
        setStatus: function (status) {
            this.set("status", status);
        },
        getUser: function () {
            return this.get("user");
        },
        setUser: function (user) {
            this.set("user", user);
        },
        generateYDNumber: function(callback) {
            var min = 1000000000;
            var max = 9999999999;
            var random;
            var YDNumber = "";
            if(this.YDNumber) {
                console.log("freightIn has RKNumber already");
                return;
            } else if (!this.YDNumber || this.YDNumber == 0) {
                random = Math.floor(Math.random() * (max - min + 1)) + min;
                YDNumber = 'YD' + random.toString() + 'DH';
                var query = new AV.Query(YD.Freight);
                query.equalTo("YDNumber", YDNumber);
                query.count({
                    success: function(count) {
                        console.log("In SDK -- count: " + count);
                        if(count == 0) {
                            //no repeat
                            //this.save(null, {
                            //    success: function(f) {
                            //        console.log("successfuly generate RKNumber: " + RKNumber);
                            //        callback(true, RKNumber);
                            //    },
                            //    error: function(f, error) {
                            //        console.log("cant generate RKNumber: " + error.message);
                            //        callback(false, error);
                            //    }
                            //});
                            callback(true, YDNumber);
                        } else {
                            //try it again
                            random = Math.floor(Math.random() * (max - min + 1)) + min;
                            YDNumber = 'YD' + random.toString() + 'DH';
                            query = new AV.Query(YD.Freight);
                            query.equalTo("YDNumber", YDNumber);
                            query.count({
                                success: function(count) {
                                    if(count == 0) {
                                        callback(true, YDNumber);
                                    } else {
                                        callback(false, "tried twice, give up");
                                    }
                                },
                                error: function(error) {
                                    console.log("second count error:L " + error.message);
                                }
                            });
                        }
                    },
                    error: function(error) {
                        console.log("count error: " + error.message);
                        callback(false, error);
                    }
                });
            }
        }
    }, {
        //STATUS_INITIALIZED: 0,
        ////Pending user action
        //STATUS_PENDING_USER_ACTION: 100,
        ////Pending admin action
        //STATUS_PENDING_SPLIT_PACKAGE: 200,
        //STATUS_PENDING_SPLIT_PACKAGE_CHARGED: 210,
        //STATUS_PENDING_REDUCE_WEIGHT: 220,
        //STATUS_PENDING_EXTRA_PACKAGING: 230,
        //STATUS_PENDING_CHECK_PACKAGE:240,
        ////Pending user action
        //STATUS_PENDING_FINAL_CONFIRMATION: 300,
        ////Pending admin action
        //STATUS_PENDING_FINISHED: 400,
        //STATUS_PENDING_DELIVERY: 500,
        //STATUS_DELIVERING: 510,
        ////Pending chinese admin action
        //STATUS_PASSING_CUSTOM: 600,
        //STATUS_FINAL_DELIVERY: 610,
        //STATUS_DELIVERED: 620,
        ////return goods, cancel
        //STATUS_CANCELED: 990

    });
    YD.Freight.STATUS_INITIALIZED = 0;
    //Pending user action
    YD.Freight.STATUS_PENDING_USER_ACTION = 100;
    YD.Freight.STATUS_SPEED_MANUAL = 110;
    //Pending admin action
    YD.Freight.STATUS_PENDING_SPLIT_PACKAGE = 200;
    YD.Freight.STATUS_PENDING_SPLIT_PACKAGE_CHARGED = 210;
    YD.Freight.STATUS_PENDING_REDUCE_WEIGHT = 220;
    YD.Freight.STATUS_PENDING_EXTRA_PACKAGING = 230;
    YD.Freight.STATUS_PENDING_CHECK_PACKAGE = 240;
    YD.Freight.STATUS_PENDING_MERGE_PACKAGE = 250;
    YD.Freight.STATUS_PENDING_PAY_INSURANCE = 260


    //Pending user action
    YD.Freight.STATUS_PENDING_FINAL_CONFIRMATION = 300;
    //Pending admin action
    YD.Freight.STATUS_PENDING_FINISHED = 400;
    YD.Freight.STATUS_PENDING_DELIVERY = 500;
    YD.Freight.STATUS_DELIVERING = 510;
    //Pending chinese admin action
    YD.Freight.STATUS_PASSING_CUSTOM = 600;
    YD.Freight.STATUS_FINAL_DELIVERY = 610;
    YD.Freight.STATUS_DELIVERED = 690;
    //return goods; cancel
    YD.Freight.STATUS_CANCELED = 990;

    Object.defineProperty(YD.Freight.prototype, "YDNumber", {
        get: function () {
            return this.get("YDNumber");
        },
        set: function (value) {
            this.set("YDNumber", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "address", {
        get: function () {
            return this.get("address");
        },
        set: function (value) {
            this.set("address", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "user", {
        get: function () {
            return this.get("user");
        },
        set: function (value) {
            this.set("user", value);
        }
    });
    Object.defineProperty(YD.Freight.prototype, "freightIn", {
        get: function () {
            return this.get("freightIn");
        },
        set: function (value) {
            this.set("freightIn", value);
        }
    });
    Object.defineProperty(YD.Freight.prototype, "estimatedPrice", {
        get: function () {
            return this.get("estimatedPrice");
        },
        set: function (value) {
            this.set("estimatedPrice", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "notes", {
        get: function () {
            return this.get("notes");
        },
        set: function (value) {
            this.set("notes", value);
        }
    });
    Object.defineProperty(YD.Freight.prototype, "chineseCourier", {
        get: function () {
            return this.get("chineseCourier");
        },
        set: function (value) {
            this.set("chineseCourier", value);
        }
    });
    Object.defineProperty(YD.Freight.prototype, "chineseTrackingNumber", {
        get: function () {
            return this.get("chineseTrackingNumber");
        },
        set: function (value) {
            this.set("chineseTrackingNumber", value);
        }
    });
    Object.defineProperty(YD.Freight.prototype, "exceedWeight", {
        get: function () {
            return this.get("exceedWeight");
        },
        set: function (value) {
            this.set("exceedWeight", value);
        }
    });
    Object.defineProperty(YD.Freight.prototype, "insurance", {
        get: function () {
            return this.get("insurance");
        },
        set: function (value) {
            this.set("insurance", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "taxInsurance", {
        get: function () {
            return this.get("taxInsurance");
        },
        set: function (value) {
            this.set("taxInsurance", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "status", {
        get: function () {
            return this.get("status");
        },
        set: function (value) {
            this.set("status", parseInt(value));
        }
    });

    Object.defineProperty(YD.Freight.prototype, "trackingNumber", {
        get: function () {
            return this.get("trackingNumber");
        },
        set: function (value) {
            this.set("trackingNumber", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "RKNumber", {
        get: function () {
            return this.get("RKNumber");
        },
        set: function (value) {
            this.set("RKNumber", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "comments", {
        get: function () {
            return this.get("comments");
        },
        set: function (value) {
            this.set("comments", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "weight", {
        get: function () {
            return this.get("weight");
        },
        set: function (value) {
            this.set("weight", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "statusGroup", {
        get: function () {
            return this.get("statusGroup");
        },
        set: function (value) {
            this.set("statusGroup", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "freightInGroup", {
        get: function () {
            return this.get("freightInGroup");
        },
        set: function (value) {
            this.set("freightInGroup", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "isAddPackage", {
        get: function () {
            return this.get("extraStrength");
        },
        set: function (value) {
            this.set("extraStrength", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "isReduceWeight", {
        get: function () {
            return this.get("isReduceWeight");
        },
        set: function (value) {
            this.set("isReduceWeight", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "isMerged", {
        get: function () {
            return this.get("isMerge");
        },
        set: function (value) {
            this.set("isMerge", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "mergeReference", {
        get: function () {
            return this.get("mergeReference");
        },
        set: function (value) {
            this.set("mergeReference", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "isSplit", {
        get: function () {
            return this.get("isSplit");
        },
        set: function (value) {
            this.set("isSplit", value);
        }
    });
    Object.defineProperty(YD.Freight.prototype, "isSplitPremium", {
        get: function () {
            return this.get("isSplitPremium");
        },
        set: function (value) {
            this.set("isSplitPremium", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "splitReference", {
        get: function () {
            return this.get("splitReference");
        },
        set: function (value) {
            this.set("splitReference", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "descriptionList", {
        get: function () {
            return this.get("descriptionList");
        },
        set: function (value) {
            this.set("descriptionList", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "channel", {
        get: function () {
            return this.get("channel");
        },
        set: function (value) {
            this.set("channel", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "isOperated", {
        get: function () {
            return this.get("isOperated");
        },
        set: function (value) {
            this.set("isOperated", value);
        }
    });

    Object.defineProperty(YD.Freight.prototype, "packageComments", {
        get: function () {
            return this.get("packageComments");
        },
        set: function (value) {
            this.set("packageComments", value);
        }
    });

    YD.FreightGroup = AV.Object.extend("FreightGroup", {
        getStatus: function () {
            return this.get("status");
        },
        setStatus: function (status) {
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
    YD.FreightGroup.STATUS_DELIVERING = 500;
//Pending chinese admin action
    YD.FreightGroup.STATUS_PASSING_CUSTOM = 600;
    YD.FreightGroup.STATUS_PASSED_CUSTOM = 610;

//================================================================================
// Property setters and getters
//================================================================================

    Object.defineProperty(YD.FreightGroup.prototype, "status", {
        get: function () {
            return this.get("status");
        },
        set: function (value) {
            this.set("status", value);
        }
    });

    YD.FreightIn = AV.Object.extend("FreightIn", {
        getAddressWithCallBack: function (callback) {
            var address = this.getAddress();
            if (address != undefined) {
                address.fetch().then(function (address) {
                    callback(address, undefined);
                }, function (error) {
                    callback(undefined, error);
                });
            } else {
                var error = new Error("Address is nil");
                callback(undefined, error);
            }
        },
        getAddress: function () {
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
        setAddress: function (address) {
            this.set("addressId", address.id);
        },
        getUserWithCallback: function (callback) {
            var user = this.getUser();
            if (user != undefined) {
                ;
                user.fetch().then(function (user) {
                    callback(user, undefined);
                }, function (error) {
                    callback(user, error);
                });
            }
        },
        getStatus: function () {
            return this.get("status");
        },
        setStatus: function (status) {
            this.set("status", status);
        },
        getUser: function () {
            return this.get("user");
        },
        setUser: function (user) {
            this.set("user", user);
        },
        generateRKNumber: function() {
            var min = 1000000000;
            var max = 9999999999;
            var random;
            var RKNumber = "";
            if(this.RKNumber) {
                console.log("freightIn has RKNumber already");
                return;
            } else if (!this.RKNumber || this.RKNumber == 0) {
                random = Math.floor(Math.random() * (max - min + 1)) + min;
                RKNumber = 'RK' + random.toString();
                return RKNumber;
            }
        },
        generateRKNumberWithCallback: function(callback) {
            var min = 1000000000;
            var max = 9999999999;
            var random;
            var RKNumber = "";
            if(this.RKNumber) {
                console.log("freightIn has RKNumber already");
                return;
            } else if (!this.RKNumber || this.RKNumber == 0) {
                random = Math.floor(Math.random() * (max - min + 1)) + min;
                RKNumber = 'RK' + random.toString();
                var query = new AV.Query(YD.FreightIn);
                query.equalTo("RKNumber", RKNumber);
                query.count({
                    success: function(count) {
                        console.log("In SDK -- count: " + count);
                        if(count == 0) {
                            //no repeat
                            //this.save(null, {
                            //    success: function(f) {
                            //        console.log("successfuly generate RKNumber: " + RKNumber);
                            //        callback(true, RKNumber);
                            //    },
                            //    error: function(f, error) {
                            //        console.log("cant generate RKNumber: " + error.message);
                            //        callback(false, error);
                            //    }
                            //});
                            callback(true, RKNumber);
                        } else {
                            //try it again
                            random = Math.floor(Math.random() * (max - min + 1)) + min;
                            RKNumber = 'RK' + random.toString();
                            query = new AV.Query(YD.FreightIn);
                            query.equalTo("RKNumber", RKNumber);
                            query.count({
                                success: function(count) {
                                    if(count == 0) {
                                        callback(true, RKNumber);
                                    } else {
                                        callback(false, "tried twice, give up");
                                    }
                                },
                                error: function(error) {
                                    console.log("second count error:L " + error.message);
                                }
                            });
                        }
                    },
                    error: function(error) {
                        console.log("count error: " + error.message);
                        callback(false, error);
                    }
                });
            }

        }
    }, {
        STATUS_INITIALIZED: 0,
        //Pending user action
        STATUS_ARRIVED: 200,
        STATUS_CONFIRMED: 300

    });

//================================================================================
// Shelf Methods
//================================================================================

    YD.FreightIn.STATUS_INITIALIZED = 0
//Pending user action
    YD.FreightIn.STATUS_MANUAL = 100
    YD.FreightIn.STATUS_SPEED_MANUAL = 110
    YD.FreightIn.STATUS_ARRIVED = 200
    YD.FreightIn.STATUS_PENDING_CHECK_PACKAGE = 210
    YD.FreightIn.STATUS_FINISHED_CHECK_PACKAGE = 290
    YD.FreightIn.STATUS_CONFIRMED = 300
    YD.FreightIn.STATUS_FINISHED = 900
    YD.FreightIn.STATUS_CANCELED = 990


    YD.FreightIn.prototype.getAddressWithCallBack = function (callback) {
        var address = this.getAddress();
        if (address != undefined) {
            address.fetch().then(function (address) {
                callback(address, undefined);
            }, function (error) {
                callback(undefined, error);
            });
        } else {
            var error = new Error("Address is nil");
            callback(undefined, error);
        }
    }

    YD.FreightIn.prototype.getUserWithCallBack = function (callback) {
        var user = this.getUser();
        if (user != undefined) {
            ;
            user.fetch().then(function (user) {
                callback(user, undefined);
            }, function (error) {
                callback(user, error);
            });
        }
    }

//================================================================================
// Property setters and getters
//================================================================================

    //Object.defineProperty(YD.FreightIn.prototype, "address", {
    //  get: function() {
    //    var addressId = this.get("addressId");
    //    if (addressId != undefined) {
    //      var address = new YD.Address({
    //        "id": id
    //      });
    //      return address;
    //    } else {
    //      return undefined;
    //    }
    //  },
    //  set: function(value) {
    //    this.set("addressId", value.id);
    //  }
    //});
    //Object.defineProperty(YD.FreightIn.prototype, "address", {
    //  get: function() {
    //    return this.get("address");
    //  },
    //  set: function(value) {
    //    this.set("address", value);
    //  }
    //});
    Object.defineProperty(YD.FreightIn.prototype, "addressId", {
        get: function () {
            return this.get("addressId");
        },
        set: function (value) {
            this.set("addressId", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "notes", {
        get: function () {
            return this.get("notes");
        },
        set: function (value) {
            this.set("notes", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "status", {
        get: function () {
            return this.get("status");
        },
        set: function (value) {
            this.set("status", value);
        }
    });
    Object.defineProperty(YD.FreightIn.prototype, "estimatedPrice", {
        get: function () {
            return this.get("estimatedPrice");
        },
        set: function (value) {
            this.set("estimatedPrice", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "splitReference", {
        get: function () {
            return this.get("splitReference");
        },
        set: function (value) {
            this.set("splitReference", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "isSplit", {
        get: function () {
            return this.get("isSplit");
        },
        set: function (value) {
            this.set("isSplit", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "isSplitPremium", {
        get: function () {
            return this.get("isSplitPremium");
        },
        set: function (value) {
            this.set("isSplitPremium", value);
        }
    });


    Object.defineProperty(YD.FreightIn.prototype, "isChecking", {
        get: function () {
            return this.get("isChecking");
        },
        set: function (value) {
            this.set("isChecking", value);
        }
    });
    Object.defineProperty(YD.FreightIn.prototype, "packageComments", {
        get: function () {
            return this.get("packageComments");
        },
        set: function (value) {
            this.set("packageComments", value);
        }
    });
    Object.defineProperty(YD.FreightIn.prototype, "checkInfo", {
        get: function () {
            return this.get("checkInfo");
        },
        set: function (value) {
            this.set("checkInfo", value);
        }
    });
    Object.defineProperty(YD.FreightIn.prototype, "isCheckingCharged", {
        get: function () {
            return this.get("isCheckingCharged");
        },
        set: function (value) {
            this.set("isCheckingCharged", value);
        }
    });
    Object.defineProperty(YD.FreightIn.prototype, "isMerged", {
        get: function () {
            return this.get("isMerged");
        },
        set: function (value) {
            this.set("isMerged", value);
        }
    });
    Object.defineProperty(YD.FreightIn.prototype, "mergeReference", {
        get: function () {
            return this.get("mergeReference");
        },
        set: function (value) {
            this.set("mergeReference", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "RKNumber", {
        get: function () {
            return this.get("RKNumber");
        },
        set: function (value) {
            this.set("RKNumber", value);
        }
    });

    //
    //Object.defineProperty(YD.FreightIn.prototype, "realName", {
    //  get: function() {
    //    return this.get("realName");
    //  },
    //  set: function(value) {
    //    this.set("realName", value);
    //  }
    //});
    //
    //
    //Object.defineProperty(YD.FreightIn.prototype, "mobilePhoneNumber", {
    //  get: function() {
    //    return this.get("mobilePhoneNumber");
    //  },
    //  set: function(value) {
    //    this.set("mobilePhoneNumber", value);
    //  }
    //});
    //
    //
    //Object.defineProperty(YD.FreightIn.prototype, "email", {
    //  get: function() {
    //    return this.get("email");
    //  },
    //  set: function(value) {
    //    this.set("email", value);
    //  }
    //});

    Object.defineProperty(YD.FreightIn.prototype, "trackingNumber", {
        get: function () {
            return this.get("trackingNumber");
        },
        set: function (value) {
            this.set("trackingNumber", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "user", {
        get: function () {
            return this.get("user");
        },
        set: function (value) {
            this.set("user", value);
        }
    });
    Object.defineProperty(YD.FreightIn.prototype, "adminEvidence", {
        get: function () {
            return this.get("adminEvidence");
        },
        set: function (value) {
            this.set("adminEvidence", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "comments", {
        get: function () {
            return this.get("comments");
        },
        set: function (value) {
            this.set("comments", value);
        }
    });
    Object.defineProperty(YD.FreightIn.prototype, "weight", {
        get: function () {
            return this.get("weight");
        },
        set: function (value) {
            this.set("weight", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "isAddPackage", {
        get: function () {
            return this.get("isAddPackage");
        },
        set: function (value) {
            this.set("isAddPackage", value);
        }
    });

    Object.defineProperty(YD.FreightIn.prototype, "isReduceWeight", {
        get: function () {
            return this.get("isReduceWeight");
        },
        set: function (value) {
            this.set("isReduceWeight", value);
        }
    });
    // YD.Transactoin = require('cloud/shelf/objects/YDTransactoin.js')
    YD.User = AV.Object.extend("_User", {
        isUser: function (user) {
            if (user != undefined) {
                return this.id == user.id;
            } else {
                return false;
            }
        },
        isNotUser: function (user) {
            return !this.isUser(user);
        },
        hasVerifiedEmail: function () {
            return this.get("emailVerified");
        },
        hasVerifiedMobileNumber: function () {
            if (this.getMobileNumber() != undefined) {
                return true;
            } else {
                return false;
            }
        },
        getAddressWithCallBack: function (callback) {
            var address = this.getAddress();
            if (address != undefined) {
                address.fetch().then(function (address) {
                    callback(address, undefined);
                }, function (error) {
                    callback(undefined, error);
                });
            } else {
                var error = new Error("Address is nil");
                callback(undefined, error);
            }
        },
        getAddress: function () {
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
        setAddress: function (address) {
            this.set("addressId", address.id);
        },
        getEmail: function () {
            return this.get("email");
        },
        setEmail: function (email) {
            this.set("email", email);
        },
        getMobileNumber: function () {
            return this.get("mobileNumber");
        },
        setMobileNumber: function (mobilePhoneNumber) {
            this.set("mobileNumber", mobilePhoneNumber);
            this.set("mobilePhoneVerified", true);
            this.save();
        },
        getProfileImage: function () {
            return this.get("profileImage");
        },
        setProfileImage: function (profileImage) {
            this.set("profileImage", profileImage);
            this.save();
        },
        getProfileName: function () {
            return this.get("profileName");
        },
        setProfileName: function (profileName) {
            this.set("profileName", profileName);
        },
        getRealName: function () {
            return this.get("realName");
        },
        setRealName: function (realName) {
            this.set("realName", realName);
        },
        getUserName: function () {
            return this.get("username");
        },
        setUserName: function (username) {
            this.set("username", username);
        },
        getReward: function () {
            return this.get("reward");
        },
        setReward: function (reward) {
            this.set("reward", reward);
        }
    }, {});

    Object.defineProperty(YD.User.prototype, "address", {
        get: function () {
            var addressId = this.get("addressId");
            if (addressId != undefined) {
                var address = new YD.Address({
                    "id": id
                });
                return address;
            } else {
                return undefined;
            }
        },
        set: function (value) {
            this.set("addressId", value.id);
        }
    });


    Object.defineProperty(YD.User.prototype, "role", {
        get: function () {
            return this.get("role");
        },
        set: function (value) {
            this.set("role", value);
        }
    });

    Object.defineProperty(YD.User.prototype, "email", {
        get: function () {
            return this.get("email");
        },
        set: function (value) {
            this.set("email", value);
        }
    });


    Object.defineProperty(YD.User.prototype, "pendingBalance", {
        get: function () {
            var result = this.get("pendingBalance")
            //console.log("In SDK -- pendingBalance: " + result + " type: " + typeof(result))
            return this.get("pendingBalance");
        },
        set: function (value) {
            this.set("pendingBalance", value);
        }
    });

    Object.defineProperty(YD.User.prototype, "pendingBalanceInDollar", {
        get: function () {
            var result = parseFloat((this.get("pendingBalance") / 100).toFixed(2))
            //console.log("In SDK -- pendingBalanceInDollar: " +  this.get("pendingBalance") + " | type: " + typeof((this.get("pendingBalance"))))
            return result;
        },
        set: function (value) {
            value = parseFloat(value)
            this.set("pendingBalance", (parseFloat(value.toFixed(2))) * 100);
        }
    });

    Object.defineProperty(YD.User.prototype, "addressId", {
        get: function () {
            return this.get("addressId");
        },
        set: function (value) {
            this.set("addressId", value);
        }
    });

    Object.defineProperty(YD.User.prototype, "emailVerified", {
        get: function () {
            return this.get("emailVerified");
        },
        set: function (value) {
            this.set("emailVerified", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "mobile", {
        get: function () {
            return this.get("mobile");
        },
        set: function (value) {
            this.set("mobile", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "password", {
        get: function () {
            return this.get("password");
        },
        set: function (value) {
            this.set("password", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "profileImage", {
        get: function () {
            return this.get("profileImage");
        },
        set: function (value) {
            this.set("profileImage", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "profileName", {
        get: function () {
            return this.get("profileName");
        },
        set: function (value) {
            this.set("profileName", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "realName", {
        get: function () {
            return this.get("realName");
        },
        set: function (value) {
            this.set("realName", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "balance", {
        get: function () {
            return this.get("balance");
        },
        set: function (value) {
            this.set("balance", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "balanceInDollar", {
        get: function () {
            return parseFloat((parseInt(this.get("balance")) / 100).toFixed(2));
        },
        set: function (value) {
            value = parseFloat(value)
            this.set("balance", (parseFloat(value.toFixed(2))) * 100);
        }
    });

    Object.defineProperty(YD.User.prototype, "totalBalanceInDollar", {
        get: function () {
            return parseFloat(((parseInt(this.get("balance")) / 100) + (parseInt(this.get("rewardBalance")) / 100)).toFixed(2));
        }
        //,
        //set: function (value) {
        //    value = parseFloat(value)
        //    this.set("balance", (parseFloat(value.toFixed(2))) * 100);
        //}
    });
    Object.defineProperty(YD.User.prototype, "balanceInYuan", {
        get: function () {
            var dollar = this.totalBalanceInDollar;
            var yuan = parseFloat((dollar * 6.4).toFixed(2));
            return yuan;
        }
    });
    Object.defineProperty(YD.User.prototype, "rewardBalance", {
        get: function () {
            return this.get("rewardBalance");
        },
        set: function (value) {
            this.set("rewardBalance", value);
        }
    });

    Object.defineProperty(YD.User.prototype, "rewardBalanceInDollar", {
        get: function () {
            var rewardDollar = this.get("rewardBalance") / 100;
            return rewardDollar;
        },
        set: function (value) {
            value = parseFloat(value);
            this.set("rewardBalance", (parseFloat(value.toFixed(2))) * 100);
        }
    });
    Object.defineProperty(YD.User.prototype, "accumulatedReward", {
        get: function () {
            return this.get("accumulatedReward");
        },
        set: function (value) {
            this.set("accumulatedReward", value);
        }
    });

    Object.defineProperty(YD.User.prototype, "username", {
        get: function () {
            return this.get("username");
        },
        set: function (value) {
            this.set("username", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "mobilePhoneNumber", {
        get: function () {
            return this.get("mobilePhoneNumber");
        },
        set: function (value) {
            this.set("mobilePhoneNumber", value);
        }
    });

    Object.defineProperty(YD.User.prototype, "contactNumber", {
        get: function () {
            return this.get("contactNumber");
        },
        set: function (value) {
            this.set("contactNumber", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "identityFront", {
        get: function () {
            return this.get("identityFront");
        },
        set: function (value) {
            this.set("identityFront", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "identityBack", {
        get: function () {
            return this.get("identityBack");
        },
        set: function (value) {
            this.set("identityBack", value);
        }
    });
    Object.defineProperty(YD.User.prototype, "numberId", {
        get: function () {
            return this.get("numberId");
        },
        set: function (value) {
            this.set("numberId", value);
        }
    });

    Object.defineProperty(YD.User.prototype, "stringId", {
        get: function () {
            return this.get("stringId");
        },
        set: function (value) {
            this.set("stringId", value);
        }
    });



    YD.User.ROLE_ADMIN = 100
    YD.User.ROLE_USER = 200
    YD.User.ROLE_DEVELOPER = 190
    //var StatusGroup = AV.Object.extend("StatusGroup");
    //Object.defineProperty(StatusGroup.prototype, "url", {
    //  get: function(){
    //    return this.get("url");
    //  },
    //  set: function(val){
    //    this.set("url", val);
    //  }
    //});

    YD.FreightChangeAddress = AV.Object.extend("FreightChangeAddress", {}, {});


    Object.defineProperty(YD.FreightChangeAddress.prototype, "reference", {
        get: function () {
            return this.get("reference");
        },
        set: function (value) {
            this.set("reference", value);
        }
    });

    Object.defineProperty(YD.FreightChangeAddress.prototype, "freightOut", {
        get: function () {
            return this.get("freightOut");
        },
        set: function (value) {
            this.set("freightOut", value);
        }
    });

    Object.defineProperty(YD.FreightChangeAddress.prototype, "recipient", {
        get: function () {
            return this.get("recipient");
        },
        set: function (value) {
            this.set("recipient", value);
        }
    });

    Object.defineProperty(YD.FreightChangeAddress.prototype, "address", {
        get: function () {
            return this.get("address");
        },
        set: function (value) {
            this.set("address", value);
        }
    });

    Object.defineProperty(YD.FreightChangeAddress.prototype, "user", {
        get: function () {
            return this.get("user");
        },
        set: function (value) {
            this.set("user", value);
        }
    });

    Object.defineProperty(YD.FreightChangeAddress.prototype, "status", {
        get: function () {
            return this.get("status");
        },
        set: function (value) {
            this.set("status", value);
        }
    });

    Object.defineProperty(YD.FreightChangeAddress.prototype, "notes", {
        get: function () {
            return this.get("notes");
        },
        set: function (value) {
            this.set("notes", value);
        }
    });


    Object.defineProperty(YD.FreightChangeAddress.prototype, "adminEvidence", {
        get: function () {
            return this.get("adminEvidence");
        },
        set: function (value) {
            this.set("adminEvidence", value);
        }
    });
    YD.FreightChangeAddress.STATUS_AWAITING = 100;
    YD.FreightChangeAddress.STATUS_CONFIRMED = 200;
    YD.FreightChangeAddress.STATUS_REFUSED = 900
    //YD.FreightChangeAddress.STATUS_AWAITING = 100;


    YD.SystemSetting = AV.Object.extend("SystemSetting", {}, {});

    Object.defineProperty(YD.SystemSetting.prototype, "rate", {
        get: function () {
            return this.get("rate");
        },
        set: function (value) {
            this.set("rate", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "contactNumber", {
        get: function () {
            return this.get("contactNumber");
        },
        set: function (value) {
            this.set("contactNumber", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "contactEmail", {
        get: function () {
            return this.get("contactEmail");
        },
        set: function (value) {
            this.set("contactEmail", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "addPackageCharge", {
        get: function () {
            return this.get("addPackageCharge");
        },
        set: function (value) {
            this.set("addPackageCharge", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "splitPackageCharge", {
        get: function () {
            return this.get("splitPackageCharge");
        },
        set: function (value) {
            this.set("splitPackageCharge", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "checkPackageCharge", {
        get: function () {
            return this.get("checkPackageCharge");
        },
        set: function (value) {
            this.set("checkPackageCharge", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "returnGoodsCharge", {
        get: function () {
            return this.get("returnGoodsCharge");
        },
        set: function (value) {
            this.set("returnGoodsCharge", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "isSmallPackageAllowed", {
        get: function () {
            return this.get("isSmallPackageAllowed");
        },
        set: function (value) {
            this.set("isSmallPackageAllowed", value);
        }
    });

    //Object.defineProperty(YD.SystemSetting.prototype, "smallPackageInitial", {
    //    get: function () {
    //        return this.get("smallPackageInitial");
    //    },
    //    set: function (value) {
    //        this.set("smallPackageInitial", value);
    //    }
    //});
    //
    //Object.defineProperty(YD.SystemSetting.prototype, "smallPackageContinue", {
    //    get: function () {
    //        return this.get("smallPackageContinue");
    //    },
    //    set: function (value) {
    //        this.set("smallPackageContinue", value);
    //    }
    //});
    //
    //Object.defineProperty(YD.SystemSetting.prototype, "normalPackageInitial", {
    //    get: function () {
    //        return this.get("normalPackageInitial");
    //    },
    //    set: function (value) {
    //        this.set("normalPackageInitial", value);
    //    }
    //});
    //
    //Object.defineProperty(YD.SystemSetting.prototype, "normalPackageContinue", {
    //    get: function () {
    //        return this.get("normalPackageContinue");
    //    },
    //    set: function (value) {
    //        this.set("normalPackageContinue", value);
    //    }
    //});
    Object.defineProperty(YD.SystemSetting.prototype, "channelList", {
        get: function () {
            return this.get("channelList");
        },
        set: function (value) {
            this.set("channelList", value);
        }
    });

    Object.defineProperty(YD.SystemSetting.prototype, "systemStreet", {
        get: function () {
            return this.get("systemStreet");
        },
        set: function (value) {
            this.set("systemStreet", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "systemCity", {
        get: function () {
            return this.get("systemCity");
        },
        set: function (value) {
            this.set("systemCity", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "systemState", {
        get: function () {
            return this.get("systemState");
        },
        set: function (value) {
            this.set("systemState", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "systemZipcode", {
        get: function () {
            return this.get("systemZipcode");
        },
        set: function (value) {
            this.set("systemZipcode", value);
        }
    });
    Object.defineProperty(YD.SystemSetting.prototype, "addressList", {
        get: function () {
            return this.get("addressList");
        },
        set: function (value) {
            this.set("addressList", value);
        }
    });

    YD.Transaction = AV.Object.extend("Transaction", {}, {});

    YD.Transaction.STATUS_ZHIFUBAO = 100;
    YD.Transaction.STATUS_STRIPE = 200;
    YD.Transaction.STATUS_CONSUME = 300;
    YD.Transaction.STATUS_CONSUME_SPLIT_PACKAGE = 310;
    YD.Transaction.STATUS_CONSUME_CHECK_PACKAGE = 320;

    YD.Transaction.STATUS_RECHARGE = 400;
    YD.Transaction.STATUS_PENDING_RETURN_BALANCE = 500;
    YD.Transaction.STATUS_CONFIRMED_RETURN_BALANCE = 590;
    YD.Transaction.STATUS_REFUSED_RETURN_BALANCE = 580;
    YD.Transaction.STATUS_CLAIM_REWARD = 600;

    YD.Transaction.STATUS_ZHIFUBAO_CONFIRMED = 190;


    Object.defineProperty(YD.Transaction.prototype, "record", {
        get: function () {
            return this.get("record");
        },
        set: function (value) {
            this.set("record", value);
        }
    });

    Object.defineProperty(YD.Transaction.prototype, "user", {
        get: function () {
            return this.get("user");
        },
        set: function (value) {
            this.set("user", value);
        }
    });

    Object.defineProperty(YD.Transaction.prototype, "status", {
        get: function () {
            return this.get("status");
        },
        set: function (value) {
            this.set("status", value);
        }
    });

    Object.defineProperty(YD.Transaction.prototype, "zhifubao", {
        get: function () {
            return this.get("zhifubao");
        },
        set: function (value) {
            this.set("zhifubao", value);
        }
    });

    Object.defineProperty(YD.Transaction.prototype, "isCredit", {
        get: function () {
            return this.get("isCredit");
        },
        set: function (value) {
            this.set("isCredit", value);
        }
    });

    Object.defineProperty(YD.Transaction.prototype, "reason", {
        get: function () {
            return this.get("reason");
        },
        set: function (value) {
            this.set("reason", value);
        }
    });

    Object.defineProperty(YD.Transaction.prototype, "amount", {
        get: function () {
            return this.get("amount");
        },
        set: function (value) {
            this.set("amount", value);
        }
    });

    Object.defineProperty(YD.Transaction.prototype, "notes", {
        get: function () {
            return this.get("notes");
        },
        set: function (value) {
            this.set("notes", value);
        }
    });

    Object.defineProperty(YD.Transaction.prototype, "adminEvidence", {
        get: function () {
            return this.get("adminEvidence");
        },
        set: function (value) {
            this.set("adminEvidence", value);
        }
    });


    YD.News = AV.Object.extend("News", {}, {});

    Object.defineProperty(YD.News.prototype, "title", {
        get: function () {
            return this.get("title");
        },
        set: function (value) {
            this.set("title", value);
        }
    });

    Object.defineProperty(YD.News.prototype, "link", {
        get: function () {
            return this.get("link");
        },
        set: function (value) {
            this.set("link", value);
        }
    });

    YD.Identity = AV.Object.extend("Identity", {}, {});

    Object.defineProperty(YD.Identity.prototype, "number", {
        get: function () {
            return this.get("number");
        },
        set: function (value) {
            this.set("number", value);
        }
    });
    Object.defineProperty(YD.Identity.prototype, "identityFront", {
        get: function () {
            return this.get("identityFront");
        },
        set: function (value) {
            this.set("identityFront", value);
        }
    });
    Object.defineProperty(YD.Identity.prototype, "identityBack", {
        get: function () {
            return this.get("identityBack");
        },
        set: function (value) {
            this.set("identityBack", value);
        }
    });

    YD.Channel = AV.Object.extend("Channel", {}, {});
    Object.defineProperty(YD.Channel.prototype, "name", {
        get: function () {
            return this.get("name");
        },
        set: function (value) {
            this.set("name", value);
        }
    });
    Object.defineProperty(YD.Channel.prototype, "initialPrice", {
        get: function () {
            return this.get("initialPrice");
        },
        set: function (value) {
            this.set("initialPrice", value);
        }
    });
    Object.defineProperty(YD.Channel.prototype, "continuePrice", {
        get: function () {
            return this.get("continuePrice");
        },
        set: function (value) {
            this.set("continuePrice", value);
        }
    });

    Object.defineProperty(YD.Channel.prototype, "startAt", {
        get: function () {
            return this.get("startAt");
        },
        set: function (value) {
            this.set("startAt", value);
        }
    });
}).call(this);