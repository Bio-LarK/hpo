'use strict';

/**
 * @ngdoc service
 * @name orphaApp.disorderBodyService
 * @description
 * # disorderBodyService
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('disorderBodyService', function($http) {
        var defaultBody = '<p>The incorporation of HPO summaries for concepts is ' +
        'currently under development.';
        var service = {
            getBody: getBody
        };
        var bodies = {};
        $http.get('scripts/services/disorderbody.json').then(function(response) {
            angular.copy(response.data, bodies);    
        });
        return service;

        function getBody(disorder) {
            return bodies[disorder.title] || defaultBody;
        }
    });
