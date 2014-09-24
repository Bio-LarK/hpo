'use strict';

/**
 * @ngdoc service
 * @name hpoApp.TransactionStatus
 * @description
 * # TransactionStatus
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
    .factory('TransactionStatus', function($resource, $http, ENV, ListTransaction) {
        var TransactionStatus = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'tr_status',
            nid: '@nid'
        });

        return TransactionStatus;

        ///////////////////


    });
