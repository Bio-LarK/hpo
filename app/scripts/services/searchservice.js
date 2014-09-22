'use strict';

/**
 * @ngdoc service
 * @name hpoApp.searchService
 * @description
 * # searchService
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
    .factory('searchService', function(ENV, $http, $state) {
        var service = {
            getResults: getResults,
            changed: changed
        };
        return service;

        function getResults(text) {
            var keys = encodeURIComponent(text);
            var url = ENV.apiEndpoint + '/search_node/retrieve.json?keys=' + keys + '&simple=1';
            return $http.get(url).then(function(response) {
                return response.data;
            });
        }

        function changed($item, $model, $label) {
            var params = {
                phenotypeId: $item.node
            };
            $state.go('phenotype', params);
        }


    });
