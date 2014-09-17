'use strict';

/**
 * @ngdoc service
 * @name orphaApp.transactionrequest
 * @description
 * # transactionrequest
 * Factory in the orphaApp.
 */
angular.module('hpoApp')
    .factory('TransactionRequest', function($resource, $http, ENV, ListTransaction) {
        var TransactionRequest = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'transaction_request',
            nid: '@nid'
        }, {
            get: {
                method: 'GET',
                transformResponse: $http.defaults.transformResponse.concat([
                    transformGetResponse
                ])
            },
            'update': {
                method: 'PUT'
            }
        });

        return TransactionRequest;

        ///////////////////

        function transformGetResponse(transactionRequest, headersGetter) {
            transactionRequest['$tr_trans'] = _.map(transactionRequest['tr_trans'], function(transaction) {
                return new ListTransaction(transaction);
            });
            delete transactionRequest['tr_trans'];

            transactionRequest['$tr_user'] = transactionRequest['tr_user'];
            delete transactionRequest['tr_user'];

            transactionRequest['$tr_status'] = transactionRequest['tr_status'];
            delete transactionRequest['tr_status'];

            transactionRequest['$author'] = transactionRequest['author'];
            delete transactionRequest['author'];

            transactionRequest['$source'] = transactionRequest['source'];
            delete transactionRequest['source'];

            return transactionRequest;
        }

    });
