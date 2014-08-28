'use strict';

/**
 * @ngdoc function
 * @name hpoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hpoApp
 */
angular.module('hpoApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
