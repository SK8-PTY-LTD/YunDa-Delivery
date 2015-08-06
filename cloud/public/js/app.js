'use strict';

/* App Module */

var AV_APP_ID = "umouw51mkumgpt72hhir61xemo3b7q2n5js0zce3b96by895";
var AV_APP_KEY = "svsw3nybfcax9ssw7czti2fk86ak9gp6ekrb00essagscyrg";

var YundaApp = angular.module('YundaApp', ['ngRoute',
    'ui.bootstrap',
    'uiGmapgoogle-maps',
    //'stripe',
    'barcodeGenerator',
    'ngSanitize']);


YundaApp.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'partials/home'
      }).
      when('/home', {
          templateUrl: 'partials/home'
      }).
      when('/help', {
        templateUrl: 'partials/help'
      }).
      when('/faq', {
          templateUrl: 'partials/faq'
      }).
      when('/responsibility', {
          templateUrl: 'partials/responsibility'
      }).
      when('/forbidden', {
          templateUrl: 'partials/forbidden'
      }).
      when('/reperation', {
          templateUrl: 'partials/reperation'
      }).
      when('/about', {
        templateUrl: 'partials/about'
      }).
      when('/contact', {
        templateUrl: 'partials/contact'
      }).
      when('/service', {
          templateUrl: 'partials/service'
      }).

      when('/dashboard', {
          templateUrl: 'partials/dashboard'
      }).
      when('/administrator', {
          templateUrl: 'partials/administrator',
          controller: 'AdminCtrl'
      }).
      when('/print', {
          templateUrl: 'partials/print'
      }).
      when('/normalGoods', {
          templateUrl: 'partials/normalGoods'
      }).
      when('/test', {
          templateUrl: 'partials/print_form'
      }).
      when('/pay', {
          templateUrl: 'partials/pay'
      }).
      when('/payReturn', {
          templateUrl: 'partials/payReturn'
      }).
      when('/payReturnFail', {
          templateUrl: 'partials/payReturnFail'
      }).
      when('/verifyEmail', {
          templateUrl: 'partials/verify'
      }).
      otherwise({
        redirectTo: '/'
      });

  $locationProvider.html5Mode(true);
  //For JS SDK
  AV.initialize(AV_APP_ID, AV_APP_KEY);
  //For REST API, which is not in use atm
  $httpProvider.defaults.headers.common = {
    'Content-Type': 'application/json',
    'X-AVOSCloud-Application-Id': AV_APP_ID,
    'X-AVOSCloud-Application-Key': AV_APP_KEY
    //'Authorization': 'Bearer ' + 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
}
//Stripe
//    var STRIPE_KEY = "pk_test_6pRNASCoBOKtIshFeQd4XMUh";
//    Stripe.setPublishableKey(STRIPE_KEY);

});

