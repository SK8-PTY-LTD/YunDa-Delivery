'use strict';
/* Filters */

YundaApp.filter('splitPackageFilter', function () {
    return function (freights) {
        var filtered = [];
        if (freights == undefined) {
            return filtered;
        } else {
            for (var i = 0; i < freights.length; i++) {
                var f = freights[i];
                if (f.isSplit || f.isSplitPremium) {
                    filtered.push(f);
                }
            }
            return filtered;
        }
    }
});

YundaApp.filter('normalPackageFilter', function () {
    return function (freights) {
        var filtered = [];
        if (freights == undefined) {
            return filtered;
        } else {
            for (var i = 0; i < freights.length; i++) {
                var f = freights[i];
                if (!f.isSplit && !f.isSplitPremium && !f.isMerged) {
                    filtered.push(f);
                }
            }
            return filtered;
        }
    }
});

YundaApp.filter('packageSearchFilter', function () {
    return function (list, input) {
        console.log("in packageFilter");
        var filtered = [];
        if (!input || input == '') {
            console.log("input is not defined");

            return list;
        } else {
            for (var i = 0; i < list.length; i++) {
                if (list[i].trackingNumber === input) {
                    filtered.push(list[i]);
                }
            }
            console.log("filtered, list.length: " + filtered.length);
            if(filtered.length == 0) {
                return [];
            } else {
                return filtered;
            }
        }
    }
});