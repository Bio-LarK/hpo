'use strict';

/**
 * @ngdoc service
 * @name hpoApp.propertyLabelService
 * @description
 * # propertyLabelService
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
    .factory('propertyLabelService', function() {
        var service = {
            'concept_parent': 'Parent'
        };
        return service;
    });
