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
        var filtered = [];
        if (!input || input == '') {
            return list;
        } else {
            for (var i = 0; i < list.length; i++) {
                if (list[i].trackingNumber === input) {
                    filtered.push(list[i]);
                }
            }
            if(filtered.length == 0) {
                return [];
            } else {
                return filtered;
            }
        }
    }
});