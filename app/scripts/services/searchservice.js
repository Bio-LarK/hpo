'use strict';

/**
 * @ngdoc service
 * @name orphaApp.SearchService
 * @description
 * # SearchService
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('searchService', function ($http, ENV, $state) {
        var service = {
        	search: search,
        };
        return service;

        function search(text) {
            var keys = encodeURIComponent(text);
            var url = ENV.apiEndpoint + '/search_node/retrieve.json?keys=' + keys + '&simple=1';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        }
    });