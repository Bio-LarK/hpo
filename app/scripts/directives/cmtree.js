'use strict';

/**
 * @ngdoc directive
 * @name orphaApp.directive:cmTree
 * @description
 * # cmTree
 */
angular.module('orphaApp')
    .directive('cmTree', function () {
        return {
            templateUrl: 'views/cmtree.html',
            restrict: 'E',
            scope: {
                disorder: '='
            },
            link: function postLink(scope, element, attrs) {
                // element.text('this is the cmTree directive');
            }
        };
    });