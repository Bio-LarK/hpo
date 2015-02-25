'use strict';

/**
 * @ngdoc directive
 * @name hpoApp.directive:card
 * @description
 * # card
 */
angular.module('orphaApp')
    .directive('card', function() {
        return {
            templateUrl: 'views/card.html',
            restrict: 'E',
            transclude: true,
            scope: {
            	highlight: '='
            },
            link: function postLink(scope, element, attrs) {
            }
        };
    });
