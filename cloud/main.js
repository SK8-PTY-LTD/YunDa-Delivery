var app = require("cloud/app.js");
var YD = require('cloud/yunda');

var STRIPE_SEC_KEY = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2';
var stripe = require('stripe')(STRIPE_SEC_KEY);

var Mailgun = require('mailgun-js');
var MAINGUN_KEY = "key-1abb9ac6b44ecb7982ddf76079fd38fc";
var MAINGUN_DOMAIN = "sk8.asia";
//Your cloud code here
AV.Cloud.useMasterKey();

/**
 * Send Email to a particular address, Note, receiver has to be a valid email address
 * @param  {subject: "This is a test subject", message: "This is a test message", receiver: "test@sk8.asia"} request
 * @param  {[Error or null]} response
 * @return {[type]}
 */
//

AV.Cloud.define("sendEmail", function (request, response) {
    //Check if a user is logged in
    //Construct email
    var name = request.params.name;
    var subject = request.params.subject;
    var message = request.params.message;
    var email = request.params.email;
    if (email == undefined) {
        email = "feedback@sk8.asia";
    }
    var receiver = request.params.receiver;
    var sender = name + " <" + email + ">"

    if (name == undefined) {
        response.error("A sender name is required for sending an email.");
        return;
    }
    if (receiver == undefined) {
        response.error("An receiver is required for sending an email.");
        return;
    }
    if (subject == undefined) {
        response.error("A subject is required for sending an email.");
        return;
    }
    if (message == undefined) {
        response.error("A message is required for sending an email.");
        return;
    }

    var Mailgun = require('mailgun-js');
    var MAINGUN_KEY = "key-1abb9ac6b44ecb7982ddf76079fd38fc";
    var MAINGUN_DOMAIN = "sk8.asia";

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({
        apiKey: MAINGUN_KEY,
        domain: MAINGUN_DOMAIN
    });

    var data = {
        //Specify email data
        from: sender,
        //The email to contact
        to: receiver,
        //Subject and text data
        subject: subject,
        text: message
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            response.error(httpResponse);
        }
        //Else we can greet    and leave
        else {
            response.success(message);
        }
    });
});
/**
 * @desc send out email when admin finishes packing
 * @required mailgun.js
 */


/**
 * @desc Stripe payment: when users recharge their account by cr card
 * @require Stripe.js
 */
AV.Cloud.define("createCharge", function (request, response) {
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
    }, function (err, charge) {
        if (!err) {
            response.success(charge.id);
        } else {
            response.error(err);
        }
    });
});

AV.Cloud.define("creditUser", function (request, response) {
    var amount = parseFloat(request.params.amount);
    var userId = request.params.userId;
    console.log("amount: " + amount + " | id: " + userId);
    var query = new AV.Query("_User");
    query.get(userId, {
        success: function (user) {
            console.log("got user, balanceInDollar: " + user.balanceInDollar);
            user.balanceInDollar = parseFloat(user.balanceInDollar) + amount;
            console.log("user now balance: " + user.balanceInDollar);
            user.save(null, {
                success: function (u) {
                    var transaction = new YD.Transaction();
                    var userPointer = new YD.User();
                    userPointer.id = userId;
                    transaction.set("status", 700);
                    transaction.set("user", userPointer);
                    transaction.set("amount", amount);
                    transaction.set("notes", "管理员增加金额");

                    console.log("ready to save transaction");
                    transaction.save(null, {
                        success: function (t) {
                            console.log("t saved; finished now");
                            response.success();
                        },
                        error: function (t, error) {
                            response.error(error.message);
                        }
                    });
                },
                error: function (u, error) {
                    response.error(error.message);
                }
            });
        },
        error: function (u, error) {
            response.error(error.message);
        }
    });

});

AV.Cloud.define("debitUser", function (request, response) {
    var amount = parseFloat(request.params.amount);
    var userId = request.params.userId;
    console.log("amount: " + amount + " | id: " + userId);
    var query = new AV.Query("_User");
    query.get(userId, {
        success: function (user) {
            console.log("got user, balanceInDollar: " + user.balanceInDollar);
            user.balanceInDollar = parseFloat(user.balanceInDollar) - amount;
            console.log("user now balance: " + user.balanceInDollar);
            user.save(null, {
                success: function (u) {
                    var transaction = new YD.Transaction();
                    var userPointer = new YD.User();
                    userPointer.id = userId;
                    transaction.set("status", 710);
                    transaction.set("user", userPointer);
                    transaction.set("amount", amount);
                    transaction.set("notes", "管理员扣金额");

                    console.log("ready to save transaction");
                    transaction.save(null, {
                        success: function (t) {
                            console.log("t saved; finished now");
                            response.success();
                        },
                        error: function (t, error) {
                            response.error(error.message);
                        }
                    });
                },
                error: function (u, error) {
                    response.error(error.message);
                }
            });
        },
        error: function (u, error) {
            response.error(error.message);
        }
    });
});

AV.Cloud.define("increaseUserBalance", function (request, response) {
    var role = request.params.role

    //if(role !== 190 || role !== 100 ) {
    //    console.log("In Cloud Code -- not an admin: " + role + " | type: " + typeof(role))
    //    response.error("权限不够！" + role)
    //}
    var query = new AV.Query("Transaction");
    var id = request.params.id;
    query.include("user")
    console.log("increaseUserBalance -- getting transaction");
    query.get(id, {
        success: function (t) {
            var transaction = t;
            amountInDollar = transaction.get("amount");
            user = transaction.get("user");
            console.log("transaction status: " + t.get("status"));
            console.log("transaction amount: " + t.get("amount"));


            if (transaction.get("status") != 700) {
                //zhifubao cr
                user.balanceInDollar = parseFloat(user.balanceInDollar) + amountInDollar
                user.pendingBalanceInDollar = parseFloat(user.pendingBalanceInDollar) - amountInDollar;
                if (parseFloat(user.pendingBalanceInDollar) < 0.05) {
                    user.pendingBalanceInDollar = 0
                    user.balanceInDollar = parseFloat(user.balanceInDollar) + 0.05
                } else if (parseFloat(user.pendingBalanceInDollar) < 0) {
                    user.pendingBalanceInDollar = 0
                }
                transaction.set("status", 190);

            } else {
                //normal admin
                user.balanceInDollar = parseFloat(user.balanceInDollar) + amountInDollar;
            }
            transaction.save(null, {
                success: function (t) {
                    console.log("In Cloud code: transaction saved")
                    transaction.get("user").save(null, {
                        success: function (u) {
                            response.success()
                        },
                        error: function (u, error) {
                            response.error(error.message)
                        }
                    })
                },
                error: function (t, error) {
                    response.error(error.message)
                }
            })

        }
    })

});

AV.Cloud.define("chargingUser", function (request, response) {
    console.log("in ChargeUser");
    var User = AV.Object.extend("_User");
    var Transaction = AV.Object.extend("Transaction");
    var query = new AV.Query(User);
    var id = request.params.userId;
    var amount = parseFloat(request.params.amount);
    var notes = request.params.notes;
    var RKNumber = request.params.RKNumber;
    var YDNumber = request.params.YDNumber;
    var status = request.params.status;
    //var tnsSaveStatus = 0;
    ///**
    // * 1: balance minus only
    // * 2: balance and rewardBalance minus
    // * 3: rewardBalance minus only
    // */
    //var balanceTransaction = 0;
    //var rewardTransaction = 0;

    var ydReward = 0;
    console.log("getting user now: " + id + " | " + amount);
    //query.equalTo("objectId", id);
    query.get(id, {
        success: function (user) {
            if(user.get("role") != 190) {
                response.error("您没有权限扣款");
            }
            var rewardBalance = parseInt(user.get("rewardBalance")) / 100;
            var balance = parseInt(user.get("balance")) / 100;
            var totalBalance = rewardBalance + balance;
            console.log("user's total balance: " + totalBalance);
            console.log("user's total balance: " + rewardBalance);
            console.log("user's total balance: " + balance);

            if (totalBalance < amount) {
                response.error("用户金额不足$" + amount);
            } else {
                /**
                 * Make sure user's rewardBalance is charged first.
                 */
                console.log("in else");
                if (rewardBalance == 0) {
                    balance -= amount;
                    ydReward = amount;
                    //tnsSaveStatus = 1;

                } else if (rewardBalance > 0 && rewardBalance < amount) {
                    //rewardTransaction = rewardBalance;
                    //balanceTransaction = amount - rewardBalance;
                    ydReward = (amount - rewardBalance);
                    balance -= (amount - rewardBalance);

                    rewardBalance = 0;
                    //tnsSaveStatus = 2;

                } else if (rewardBalance >= amount) {
                    rewardBalance -= amount;
                    ydReward = 0;
                    //tnsSaveStatus = 3;
                } else {
                    balance -= amount;
                    ydReward = amount;
                    //tnsSaveStatus = 1;
                }
                user.set("balance", balance * 100);
                user.set("rewardBalance", rewardBalance * 100);
                console.log("user's total balance: " + rewardBalance);
                console.log("user's total balance: " + balance);
                var yd = user.get("accumulatedReward");
                var finalReward = parseFloat((yd + ydReward).toFixed(2));
                user.set("accumulatedReward", finalReward);
                user.save(null, {
                    success: function (u) {
                        console.log("user saved");
                        var userPT = new User();
                        userPT.id = u.id;
                        var transaction = new Transaction();
                        transaction.set("amount", amount);
                        transaction.set("notes", notes);
                        transaction.set("RKNumber", RKNumber);
                        transaction.set("user", userPT);
                        if (!YDNumber) {

                        } else {
                            transaction.set("YDNumber", YDNumber);
                        }
                        transaction.set("status", status);
                        console.log("transaction set finished, ready to save");
                        transaction.save(null, {
                            success: function () {

                                if (ydReward > 0) {
                                    var tns = new Transaction();
                                    tns.set("amount", ydReward);
                                    tns.set("notes", "YD币赠送: " + notes);
                                    tns.set("RKNumber", RKNumber);
                                    tns.set("user", userPT);
                                    if (!YDNumber) {

                                    } else {
                                        tns.set("YDNumber", YDNumber);
                                    }
                                    tns.set("status", 360); //STATUS  GET YD REWARD = 360
                                    console.log(" ready to save reward transaction");

                                    tns.save(null, {
                                        success: function (newT) {
                                            console.log(" reward transaction saved");
                                            response.success();
                                        },
                                        error: function (t, error) {
                                            response.error(error.message);
                                        }
                                    });
                                }
                            },
                            error: function (t, error) {
                                response.error(error.message);

                            }
                        });

                    },
                    error: function (u, error) {
                        response.error(error.message);
                    }
                });
            }
        },
        error: function (user, error) {
            console.log("find user error: " + error.message);
            response.error(error.message);
        }
    });
});

AV.Cloud.define("chargingUserWithoutReward", function (request, response) {
    console.log("CC -- in ChargeUserWitoughtReward");
    var User = AV.Object.extend("_User");
    var Transaction = AV.Object.extend("Transaction");
    var query = new AV.Query(User);
    var id = request.params.userId;
    var notes = request.params.notes;
    var RKNumber = request.params.RKNumber;
    var YDNumber = request.params.YDNumber;
    var status = request.params.status;
    console.log("CC -- userid: " + id);
    var amount = parseFloat(request.params.amount);
    console.log("getting user now: " + id + " | " + amount);
    //query.equalTo("objectId", id);
    query.get(id, {
        success: function (user) {
            if(user.get("role") != 190) {
                response.error("您没有权限扣款");
            }
            var balance = parseInt(user.get("balance")) / 100;
            console.log("user's total balance: " + balance);
            if (balance < amount) {
                response.error("用户金额不足$" + amount);
            } else {

                balance -= amount;
                user.set("balance", balance * 100);
                console.log("user's total balance: " + balance);
                var yd = user.get("accumulatedReward");
                var finalReward = parseFloat((yd + amount).toFixed(2));
                user.set("accumulatedReward", finalReward);
                user.save(null, {
                    success: function (u) {
                        console.log("user saved");
                        var userPT = new User();
                        userPT.id = u.id;
                        var transaction = new Transaction();
                        transaction.set("amount", amount);
                        transaction.set("notes", notes);
                        transaction.set("RKNumber", RKNumber);
                        transaction.set("user", userPT);
                        if (!YDNumber) {

                        } else {
                            transaction.set("YDNumber", YDNumber);
                        }
                        transaction.set("status", status);
                        console.log("transaction set finished, ready to save");
                        transaction.save(null, {
                            // save this transaction
                            success: function (t) {
                                var tns = new Transaction();
                                tns.set("amount", amount);
                                tns.set("notes", "YD币赠送: " + notes);
                                tns.set("RKNumber", RKNumber);
                                tns.set("user", userPT);
                                if (!YDNumber) {

                                } else {
                                    tns.set("YDNumber", YDNumber);
                                }
                                tns.set("status", 360); //STATUS  GET YD REWARD = 360

                                tns.save(null, {
                                    //save YD Reward transaction
                                    success: function (newT) {
                                        console.log("YD transaction saved");
                                        response.success();
                                    },
                                    error: function (t, error) {
                                        console.log("YD Transaction saved ERROR: " + error.message);
                                        response.error(error.message);
                                    }
                                });
                            },
                            error: function (t, error) {
                                console.log("transaction saved ERRORL: " + error.message);
                                response.error(error.message);
                            }
                        });
                    },
                    error: function (u, error) {
                        response.error(error.message);
                        response.error(error.message);
                    }
                });
            }
        },
        error: function (user, error) {
            console.log("find user error: " + error.message);
            response.error(error.message);
        }
    });
});

AV.Cloud.define("chargingUserReturn", function (request, response) {
    console.log("in ChargeUser");
    var User = AV.Object.extend("_User");
    var query = new AV.Query(User);
    var id = request.params.userId;
    var amount = parseFloat(request.params.amount);
    console.log("getting user now: " + id + " | " + amount);
    //query.equalTo("objectId", id);
    query.get(id, {
        success: function (user) {
            if(user.get("role") != 190) {
                response.error("您没有权限扣款");
            }
            var balance = parseInt(user.get("balance")) / 100;

            console.log("user's total balance: " + balance);
            if (balance < amount) {
                response.error("用户金额不足$" + amount);
            } else {

                balance -= amount;
                user.set("balance", balance * 100);
                console.log("user's total balance: " + balance);
                user.save(null, {
                    success: function (u) {
                        console.log("user saved");
                        response.success();
                    },
                    error: function (u, error) {
                        response.error(error.message);
                    }
                });
            }
        },
        error: function (user, error) {
            console.log("find user error: " + error.message);
            response.error(error.message);
        }
    });
});

AV.Cloud.define("chargingUserReturnBalance", function (request, response) {
    var User = AV.Object.extend("_User");
    var query = new AV.Query(User);
    var id = request.params.userId;
    var amount = parseFloat(request.params.amount);
    console.log("getting user now: " + id + " | " + amount);
    //query.equalTo("objectId", id);
    query.get(id, {
        success: function (user) {
            if(user.get("role") != 190) {
                response.error("您没有权限扣款");
            }
            var balance = parseInt(user.get("pendingBalance")) / 100;

            console.log("user's total balance: " + balance);
            if (balance < amount) {
                response.error("用户金额不足$" + amount);
            } else {

                balance -= amount;
                user.set("pendingBalance", balance * 100);
                console.log("user's now pending balance: " + balance);
                user.save(null, {
                    success: function (u) {
                        console.log("user saved");
                        response.success();
                    },
                    error: function (u, error) {
                        response.error(error.message);
                    }
                });
            }
        },
        error: function (user, error) {
            console.log("find user error: " + error.message);
            response.error(error.message);
        }
    });
});

AV.Cloud.define("refuseUserReturnBalance", function (request, response) {
    var User = AV.Object.extend("_User");
    var query = new AV.Query(User);
    var id = request.params.userId;
    var amount = parseFloat(request.params.amount);
    console.log("getting user now: " + id + " | " + amount);
    //query.equalTo("objectId", id);
    query.get(id, {
        success: function (user) {
            if(user.get("role") != 190) {
                response.error("您没有权限操作");
            }
            var balance = parseInt(user.get("pendingBalance")) / 100;
            console.log("user's total balance: " + balance);
            if (balance < amount) {
                response.error("用户冻结金额不足$" + amount);
            } else {
                balance -= amount;
                user.set("pendingBalance", balance * 100);
                console.log("user's now pending balance: " + balance);
                var bl = parseInt(user.get("balance"))/100;
                bl += amount;
                user.set("balance", bl * 100);
                user.save(null, {
                    success: function (u) {
                        console.log("user saved");
                        response.success();
                    },
                    error: function (u, error) {
                        response.error(error.message);
                    }
                });
            }
        },
        error: function (user, error) {
            console.log("find user error: " + error.message);
            response.error(error.message);
        }
    });
});




AV.Cloud.beforeSave("Transaction", function (request, response) {
    //Prototype linking
    var transaction = request.object;

    //check if transaction is return balance;
    console.log("transaction status: " + transaction.get("status"));
    //console.log("transaction status: " + transaction.status);

    if (transaction.get("status") != 500) {
        console.log("transaction status not 500");
        response.success();
    }
    else {
        console.log("In transaction before save");
        if (transaction.get("TKNumber") != undefined) {
            console.log("TKNumber is existed: " + transaction.get("TKNumber"));
            response.success();
        } else {
            console.log("No TKnumber, set one now");
            var TKNumber = 0;
            TKNumber = Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) + 100000000000;
            TKNumber = 'TK' + TKNumber.toString();
            console.log("TKNumber generated: " + TKNumber);
            transaction.set("TKNumber", TKNumber);

            response.success();
        }
    }
});

/**
 * @desc generate user's numberId and StringId
 * using AV Cloud code after update
 */
AV.Cloud.afterUpdate('_User', function (request) {
    var user = request.object;
    console.log("In AfterUpdate -- username: " + user.id)

    var charMatrix = {
        0: "J",
        1: "A",
        2: "C",
        3: "K",
        4: "M",
        5: "I",
        6: "Q",
        7: "E",
        8: "N",
        9: "Y"
    }
    var toStringId = function (number) {
        var stringId = "YD";
        var numberToString = number.toString();
        for (var i = 0; i < numberToString.length; i++) {
            stringId += charMatrix[numberToString.charAt(i)];
        }
        return stringId;
    }
    //Check if user has a Number id and String id
    if (user.get("numberId") != undefined) {
        console.log("user.numberId != undefined && user.stringId != undefined");

    } else {
        //Generate 8 digits random id

        numberId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
        numberId = numberId.toString() // before query, make sure numberId is string (to match the field)

        //Ensure there is no repeat

        var query = new AV.Query("_User");
        query.equalTo("numberId", numberId);
        console.log("AfterUpdate -- before query, numberId: " + numberId + " | type: " + typeof(numberId))

        query.count({
            success: function (count) {
                console.log("AfterUpdate -- in count success | count: " + count);
                // The count request succeeded. Show the count
                if (count == 0) {
                    //No repeat
                    //Convert hex value
                    //var stringId = toStringId((parseInt(numberId)));
                    ////Add it to user
                    user.set('numberId', numberId);
                    //user.set('stringId', stringId);
                    console.log("1a = string id: " + user.stringId)
                    console.log("AfterUpdate First round --  string id: " + user.get('stringId'))
                    user.save(null, {
                        success: function (user) {
                            console.log("1user saved: " + user.numberId)
                            console.log("AfterUpdate First round --  saved: " + user.get('numberId'))

                        },
                        error: function (user, error) {
                            console.log("1user saved ERROR: " + error.message)
                        }
                    })
                    //Successful
                } else {
                    //Try another time. Maximum try twice
                    console.log("AfterUpdate -- 2nd round success")

                    numberId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
                    numberId = numberId.toString() // before query, make sure numberId is string (to match the field)

                    //Ensure there is no repeat
                    var query = new AV.Query(YD.User);
                    query.equalTo("numberId", numberId);
                    query.count({
                        success: function (count) {
                            // The count request succeeded. Show the count
                            if (count == 0) {
                                //No repeat
                                //Convert hex value
                                //var stringId = toStringId((parseInt(numberId)));
                                //Add it to user
                                user.set('numberId', numberId);
                                //user.set('stringId', stringId);
                                //console.log("2a = string id: " + user.stringId)
                                console.log("2b = string id: " + user.get('stringId'))


                                user.save(null, {
                                    success: function (user) {
                                        console.log("2user saved: " + user.stringId)
                                    },
                                    error: function (user, error) {
                                        console.log("2user saved ERROR: " + error.message)
                                    }
                                })
                                //Successful
                            } else {
                                //Successful
                            }
                        },
                        error: function (error) {
                            // The request failed
                        }
                    });
                }
            },
            error: function (error) {
                // The request failed
                console.log("After Update count ERROR: " + error.message)
            }
        });
    }
});
//
//
/**
 * @desc generate user's numberId and StringId
 * using AV Cloud code beforeSave
 */
AV.Cloud.beforeSave('_User', function (request, response) {
    var user = request.object;
    console.log("In AfterUpdate -- username: " + user.id)

    var charMatrix = {
        0: "J",
        1: "A",
        2: "C",
        3: "K",
        4: "M",
        5: "I",
        6: "Q",
        7: "E",
        8: "N",
        9: "Y"
    }
    var toStringId = function (number) {
        var stringId = "YD";
        var numberToString = number.toString();
        for (var i = 0; i < numberToString.length; i++) {
            stringId += charMatrix[numberToString.charAt(i)];
        }
        return stringId;
    }
    //Check if user has a Number id and String id
    if (user.get("numberId") != undefined) {
        console.log("user.numberId != undefined && user.stringId != undefined")

    } else {
        //Generate 8 digits random id

        numberId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
        numberId = numberId.toString() // before query, make sure numberId is string (to match the field)

        //Ensure there is no repeat

        var query = new AV.Query("_User");
        query.equalTo("numberId", numberId);
        console.log("AfterUpdate -- before query, numberId: " + numberId + " | type: " + typeof(numberId))

        query.count({
            success: function (count) {
                console.log("AfterUpdate -- in count success | count: " + count);
                // The count request succeeded. Show the count
                if (count == 0) {
                    //No repeat
                    //Convert hex value
                    //var stringId = toStringId((parseInt(numberId)));
                    //Add it to user
                    user.set('numberId', numberId);
                    //user.set('stringId', stringId);
                    console.log("1a = string id: " + user.numberId)
                    console.log("AfterUpdate First round --  string id: " + user.get('numberId'))
                    //user.save(null, {
                    //    success: function(user) {
                    //        console.log("1user saved: " + user.stringId)
                    //        console.log("AfterUpdate First round --  saved: "  + user.get('stringId'))
                    //
                    //    },
                    //    error: function(user, error) {
                    //        console.log("1user saved ERROR: " + error.message)
                    //    }
                    //})
                    response.success()
                    //Successful
                } else {
                    //Try another time. Maximum try twice
                    console.log("AfterUpdate -- 2nd round success")
                    numberId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
                    numberId = numberId.toString() // before query, make sure numberId is string (to match the field)

                    //Ensure there is no repeat
                    var query = new AV.Query(YD.User);
                    query.equalTo("numberId", numberId);
                    query.count({
                        success: function (count) {
                            // The count request succeeded. Show the count
                            if (count == 0) {
                                //No repeat
                                //Convert hex value
                                //var stringId = toStringId((parseInt(numberId)));
                                //Add it to user
                                user.set('numberId', numberId);
                                //user.set('stringId', stringId);
                                //console.log("2a = string id: " + user.stringId)
                                console.log("2b = string id: " + user.get('numberId'))

                                //
                                //user.save(null, {
                                //    success: function(user) {
                                //        console.log("2user saved: " + user.stringId)
                                //    },
                                //    error: function(user, error) {
                                //        console.log("2user saved ERROR: " + error.message)
                                //    }
                                //})
                                response.success()
                                //Successful
                            } else {
                                //Successful
                            }
                        },
                        error: function (error) {
                            // The request failed
                        }
                    });
                }
            },
            error: function (error) {
                // The request failed
                console.log("After Update count ERROR: " + error.message)
            }
        });
    }
});