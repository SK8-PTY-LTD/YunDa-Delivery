'use strict';

/* App Module */

var AV_APP_ID = "";
var AV_APP_KEY = "";

var YundaApp = angular.module('YundaApp', ['ngRoute',
    'uiGmapgoogle-maps']);

YundaApp.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'partials/about'
      }).
      when('/help', {
        templateUrl: 'partials/help'
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
  }
});