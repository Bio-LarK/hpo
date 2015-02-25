'use strict';

/**
 * @ngdoc directive
 * @name hpoApp.directive:cardPhenotype
 * @description
 * # cardPhenotype
 */
angular.module('orphaApp')
    .directive('cardPhenotype', function() {
        return {
            templateUrl: 'views/card-phenotype.html',
            restrict: 'E',
            scope: {
            	phenotype: '='
            },
            link: function postLink(scope, element, attrs) {
                // element.text('this is the cardPhenotype directive');
            }
        };
    });
