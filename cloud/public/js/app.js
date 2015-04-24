'use strict';

/* App Module */

var AV_APP_ID = "umouw51mkumgpt72hhir61xemo3b7q2n5js0zce3b96by895";
var AV_APP_KEY = "svsw3nybfcax9ssw7czti2fk86ak9gp6ekrb00essagscyrg";

var YundaApp = angular.module('YundaApp', ['ngRoute',
    'ui.bootstrap',
    'uiGmapgoogle-maps',
    'ngAutocomplete']);

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
      when('/modal', {
          templateUrl: 'partials/modal_login'
      }).
      when('/dashboard', {
          templateUrl: 'partials/dashboard'
      }).
      when('/test', {
          templateUrl: 'partials/test'
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