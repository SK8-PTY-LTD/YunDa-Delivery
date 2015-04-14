'use strict';

/* Controllers */

YundaApp.controller('AppCtrl', function ($scope, $http) {

    $http({
        method: 'GET',
        url: '/api/name'
    }).
        success(function (data, status, headers, config) {
            $scope.name = data.name;
        }).
        error(function (data, status, headers, config) {
            $scope.name = 'Error!';
        });

});
YundaApp.controller('MyCtrl1', function ($scope) {
    // write Ctrl here

});
YundaApp.controller('MyCtrl2', function ($scope) {
    // write Ctrl here

});
