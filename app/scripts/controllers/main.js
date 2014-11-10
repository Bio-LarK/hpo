'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
