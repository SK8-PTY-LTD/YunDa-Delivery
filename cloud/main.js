var app = require("cloud/app.js");
var YD = require('cloud/yunda');

var STRIPE_SEC_KEY = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2';
var stripe = require('stripe')(STRIPE_SEC_KEY);

//var Mailgun = require('mailgun-js');
var MAINGUN_KEY = "key-1abb9ac6b44ecb7982ddf76079fd38fc";
var MAINGUN_DOMAIN = "sk8.asia";

//Your cloud code here


/**
 * @desc send out email when admin finishes packing
 * @required mailgun.js
 */
//AV.Cloud.define("sendEmail", function(request, response) {
//    //Check if a user is logged in
//    var user = request.user;
//    if (user == undefined) {
//        response.error("A logged in user is required before sending an email.");
//        return;
//    }
//    //Construct email
//    var receiver = request.params.receiver;
//    var subject = request.params.subject;
//    var message = request.params.message;
//
//    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
//    var mailgun = new Mailgun({
//        apiKey: MAINGUN_KEY,
//        domain: MAINGUN_DOMAIN
//    });
//
//    var data = {
//        //Specify email data
//        from: "feedback@sk8.asia",
//        //The email to contact
//        to: receiver,
//        //Subject and text data
//        subject: subject,
//        text: message
//    }
//
//    //Invokes the method to send emails given the above data with the helper library
//    mailgun.messages().send(data, function(err, body) {
//        //If there is an error, render the error page
//        if (err) {
//            response.error(httpResponse);
//        }
//        //Else we can greet    and leave
//        else {
//            response.success(message);
//        }
//    });
//});


/**
 * @desc Stripe payment: when users recharge their account by cr card
 * @require Stripe.js
 */
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

AV.Cloud.define("increaseUserBalance", function(request, response) {
    var role = request.params.role

    //if(role !== 190 || role !== 100 ) {
    //    console.log("In Cloud Code -- not an admin: " + role + " | type: " + typeof(role))
    //    response.error("权限不够！" + role)
    //}
    var query = new AV.Query("Transaction");
    var id = request.params.id;
    query.include("user")
    query.get(id, {
        success: function(t) {
            var transaction = t;
            amountInDollar = transaction.amount;
            user = transaction.user
            user.balanceInDollar = parseFloat(user.balanceInDollar) +  amountInDollar
            user.pendingBalanceInDollar = parseFloat(user.pendingBalanceInDollar) -  amountInDollar

            if (parseFloat(user.pendingBalanceInDollar) < 0.05) {
                user.pendingBalanceInDollar = 0
                user.balanceInDollar = parseFloat(user.balanceInDollar) + 0.05
            } else if (parseFloat(user.pendingBalanceInDollar) < 0) {
                user.pendingBalanceInDollar = 0
            }
            transaction.status = 190
            transaction.save(null, {
                success: function (t) {
                    console.log("In Cloud code: transaction saved")
                    transaction.user.save(null, {
                        success: function(u) {
                            response.success()
                        },
                        error: function(u, error) {
                            response.error(error.message)
                        }
                    })
                },
                error: function(t, error) {
                    response.error(error.message)
                }
            })

        }
    })

});


/**
 * @desc generate user's numberId and StringId
 * using AV Cloud code after update
 */
AV.Cloud.afterUpdate('_User', function(request) {
    var user = request.object;
    console.log("In AfterUpdate -- username: " + user.id)

    var charMatrix = {
        0 : "J",
        1 : "A",
        2 : "C",
        3 : "K",
        4 : "M",
        5 : "I",
        6 : "Q",
        7 : "E",
        8 : "N",
        9 : "Y"
    }
    var toStringId = function(number) {
        var stringId = "YD";
        var numberToString = number.toString();
        for(var i = 0; i < numberToString.length; i++) {
           stringId += charMatrix[numberToString.charAt(i)];
        }
        return stringId;
    }
    //Check if user has a Number id and String id
    if (user.numberId != undefined && user.stringId != undefined) {
        console.log("user.numberId != undefined && user.stringId != undefined")

    } else {
        //Generate 8 digits random id
        var numberId = user.get("numberId");
        if (numberId == undefined) {
            numberId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
            numberId = numberId.toString() // before query, make sure numberId is string (to match the field)
        } else {
            //now fetched numberId is string
            console.log("AfterUpdate -- numId isn't undefined, numberId: " + numberId )

        }
        //Ensure there is no repeat

        var query = new AV.Query("_User");
        query.equalTo("numberId", numberId);
        console.log("AfterUpdate -- before query, numberId: " + numberId + " | type: " + typeof(numberId))

        query.count({
            success: function(count) {
                console.log("AfterUpdate -- in count success | count: " + count);
                // The count request succeeded. Show the count
                if (count == 0) {
                    //No repeat
                    //Convert hex value
                    var stringId = toStringId((parseInt(numberId)));
                    //Add it to user
                    user.set('numberId', numberId);
                    user.set('stringId', stringId);
                    console.log("1a = string id: " + user.stringId)
                    console.log("AfterUpdate First round --  string id: " + user.get('stringId'))
                    user.save(null, {
                        success: function(user) {
                            console.log("1user saved: " + user.stringId)
                            console.log("AfterUpdate First round --  saved: "  + user.get('stringId'))

                        },
                        error: function(user, error) {
                            console.log("1user saved ERROR: " + error.message)
                        }
                    })
                    //Successful
                } else {
                    //Try another time. Maximum try twice
                    console.log("AfterUpdate -- 2nd round success")
                    if (numberId == undefined) {
                        numberId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
                        numberId = numberId.toString() // before query, make sure numberId is string (to match the field)

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
                                var stringId = toStringId((parseInt(numberId)));
                                //Add it to user
                                user.set('numberId', numberId);
                                user.set('stringId', stringId);
                                //console.log("2a = string id: " + user.stringId)
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
                console.log("After Update count ERROR: " + error.message)
            }
        });
    }
});