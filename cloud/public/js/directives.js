'use strict';
/* Directives */

YundaApp.directive("yundaNavbar", function() {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'partials/navbar'
    }
});

YundaApp.directive("yundaFooter", function() {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'partials/footer'
    }
});