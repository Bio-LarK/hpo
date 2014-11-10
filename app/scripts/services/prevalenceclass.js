'use strict';

/**
 * @ngdoc service
 * @name orphaApp.PrevalenceClass
 * @description
 * # PrevalenceClass
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('PrevalenceClass', function($resource, ENV) {
        var PrevalenceClass = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'prevalence_class',
            nid: '@nid'
        });
        return PrevalenceClass;
    });
