var app = require("cloud/app.js");
var STRIPE_SEC_KEY = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2';
var stripe = require('stripe')(STRIPE_SEC_KEY);
var YD = require('cloud/yunda');

//Your cloud code here

AV.Cloud.define("createCharge", function(request, response) {
    //Construct message
    var totalPriceInCent = request.params.amount;
    var currency = request.params.currency;
    console.log("IN CLOUD CODE token is : " + request.params.source);

    var source = request.params.source;
    var detail = request.params.description;

    stripe.charges.create({
        amount: totalPriceInCent,
        currency: currency,
        source: source,
        description: detail
    }, function(err, charge) {
        if (!err) {
            response.success(charge.id);
        } else {
            response.error(err);
        }
    });
});

AV.Cloud.afterUpdate('_User', function(request) {
    var user = request.object;

    //Check if user has a Number id and String id
    if (user.numberId != undefined && user.stringId != undefined) {
        console.log("user.numberId != undefined && user.stringId != undefined")

    } else {
        //Generate 8 digits random id
        var numberId = user.get("numberId");
        if (numberId == undefined) {
            numberId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
        }
        //Ensure there is no repeat
        var query = new AV.Query(YD.User);
        query.equalTo("numberId", numberId);
        query.count({
            success: function(count) {
                // The count request succeeded. Show the count
                if (count == 0) {
                    //No repeat
                    //Convert hex value
                    var stringId = numberId.toString(16);
                    //Add it to user
                    user.set('numberId', numberId);
                    user.set('stringId', stringId);
                    console.log("1a = string id: " + user.stringId)
                    console.log("1b = string id: " + user.get('stringId'))
                    user.save(null, {
                        success: function(user) {
                            console.log("1user saved: " + user.stringId)
                        },
                        error: function(user, error) {
                            console.log("1user saved ERROR: " + error.message)
                        }
                    })
                    //Successful
                } else {
                    //Try another time. Maximum try twice

                    if (numberId == undefined) {
                        numberId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
                    }
                    //Ensure there is no repeat
                    var query = new AV.Query(YD.User);
                    query.equalTo("numberId", numberId);
                    query.count({
                        success: function(count) {
                            // The count request succeeded. Show the count
                            if (count == 0) {
                                //No repeat
                                //Convert hex value
                                var stringId = numberId.toString(16);
                                //Add it to user
                                user.set('numberId', numberId);
                                user.set('stringId', stringId);
                                console.log("2a = string id: " + user.stringId)
                                console.log("2b = string id: " + user.get('stringId'))


                                user.save(null, {
                                    success: function(user) {
                                        console.log("2user saved: " + user.stringId)
                                    },
                                    error: function(user, error) {
                                        console.log("2user saved ERROR: " + error.message)
                                    }
                                })
                                //Successful
                            } else {
                                //Successful
                            }
                        },
                        error: function(error) {
                            // The request failed
                        }
                    });
                }
            },
            error: function(error) {
                // The request failed
            }
        });
    }
});