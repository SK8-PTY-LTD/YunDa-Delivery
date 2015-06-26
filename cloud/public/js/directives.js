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
            'id': '='
        },

        link: function (scope, element, attrs) {
            attrs.$observe('barcodeApi', function (value) {
                //console.log("in directive -- value: " + value)
                console.log("in directive -- scope.id " + scope.id)
                var url = "http://api-bwipjs.rhcloud.com/?bcid=code128&text=" + scope.id + "&includetext"
                var img = angular.element("<img alt='Barcoded value 1234567890' src=\"" + url + "\" style=\"width:320px;height:100px;\">")
                console.log("in directive, url: " + url)
                //console.log("in directive, img: " + img)

                angular.element(element).append(img)
            });
        }
    }
})