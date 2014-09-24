'use strict';

/**
 * @ngdoc service
 * @name hpoApp.searchService
 * @description
 * # searchService
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
    .factory('searchService', function(ENV, $http, $state, Phenotype) {
        var service = {
            getResults: getResults,
            findPhenotypes: findPhenotypes,
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

        function findPhenotypes(text) {
            var url = ENV.apiEndpoint + '/entity_node'; 
            return $http.get(url, {
                params: {
                    'parameters[title]': text + '*',
                    'parameters[type]': 'hpo_concept',
                    'field': 'nid,title'
                }
            }).then(function(response) {
                return _.map(response.data, function(data) {
                    return new Phenotype(data);
                });
            }); 
        }

        function changed($item, $model, $label) {
            var params = {
                phenotypeId: $item.nid
            };
            $state.go('phenotype', params);
        }

    });
