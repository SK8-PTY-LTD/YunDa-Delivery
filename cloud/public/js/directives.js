'use strict';
/* Directives */

YundaApp.directive("YundaNavbar", function() {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'partial/navbar'
    }
});

YundaApp.directive("YundaFooter", function() {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'partial/footer'
    }
});