'use strict';

/**
 * @ngdoc service
 * @name orphaApp.siteSearchService
 * @description
 * # siteSearchService
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('siteSearchService', function(searchService, $state, $log, $rootScope) {
        var service = {
            query: '',
            getResults: getResults,
            changed: changed
        };        
        $rootScope.$on('$stateChangeSuccess', 
            function(event, toState, toParams, fromState, fromParams) { 
                service.query = '';
            }
        );
        return service;

        function getResults(query) {
            var acceptedTypes = ['Disorder', 'Clinical Sign', 'Gene'];
            return searchService.search(query).then(function(results) {
                return _.filter(results, function(result) {
                    return acceptedTypes.indexOf(result.type) >= 0;
                });
            });
        }

        function changed($item, $model, $label) {
            var params = {};
            var type = $item.type.toLowerCase();
            if (type === 'clinical sign') {
                type = 'sign';
            }
            params[type + 'Id'] = $item.node;
            $state.go(type, params);
        }

    });
