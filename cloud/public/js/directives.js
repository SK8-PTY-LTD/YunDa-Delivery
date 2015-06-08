'use strict';
/* Directives */

YundaApp.directive("yundaNavbar", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'partials/navbar'
    }
});

YundaApp.directive("yundaFooter", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'partials/footer'
    }
});

YundaApp.directive("barcodeApi", function () {

    return {
        scope: {
            'trackingNumber': '='
        },

        link: function (scope, element, attrs) {
            attrs.$observe('barcodeApi', function (value) {
                var url = "http://api-bwipjs.rhcloud.com/?bcid=code128&text=" + scope.trackingNumber + "&includetext"
                var img = angular.element("<img alt='Barcoded value 1234567890' src=\"" + url + "\">")
                console.log("in directive, url: " + url)
                console.log("in directive, img: " + img)

                angular.element(element).append(img)
            });
        }
    }
})