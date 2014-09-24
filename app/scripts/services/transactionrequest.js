'use strict';

/**
 * @ngdoc service
 * @name orphaApp.transactionrequest
 * @description
 * # transactionrequest
 * Factory in the orphaApp.
 */
angular.module('hpoApp')
    .factory('TransactionRequest', function($resource, $http, $log, ENV, ListTransaction, 
        transactionStatusService, $q, ListTransactionUnlimited, $state) {
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
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: $http.defaults.transformResponse.concat([
                    transformQueryResponse
                ])
            },
            'update': {
                method: 'PUT'
            }
        });

        TransactionRequest.prototype.loadTransactions = loadTransactions;
        TransactionRequest.getSubmittedTransactions = getSubmittedTransactions;
        TransactionRequest.getClosedTransactions = getClosedTransactions;
        return TransactionRequest;

        ///////////////////


        function getSubmittedTransactions() {
            return transactionStatusService.loadStatusCodes().then(function() {
                return getTransactions(transactionStatusService.submittedNid);
            });
        }
        function getClosedTransactions() {
            return transactionStatusService.loadStatusCodes().then(function() {
                return $q.all([
                    getTransactions(transactionStatusService.rejectedNid),
                    getTransactions(transactionStatusService.acceptedNid)
                ]).then(function(transactions) {
                    return _.flatten(transactions);
                });
            });
        }


        function loadTransactions() {
            /* jshint validthis: true */
            var transactionRequest = this;

            transactionRequest.$isOpen = transactionStatusService.isSubmitted(transactionRequest['$tr_status'].nid);

            if(!transactionRequest['$tr_trans'].length) {
                return;
            }

            var listTransactionPromises = _.map(transactionRequest['$tr_trans'], function(listTransaction) {
                return listTransaction.loadReferences();
            });

            return $q.all(listTransactionPromises).then(function() {
                var firstTransaction = transactionRequest['$tr_trans'][0];
                $log.debug('on node', firstTransaction.getOnNode());

                // on node descrption
                var url = $state.href('phenotype', {phenotypeId: firstTransaction.getOnNode().nid});
                transactionRequest.$onNodeDescription = '<a href="' + url + '">' + 
                firstTransaction.getOnNode().title + '</a>';
            });
        }

        function getTransactions(status) {
            return TransactionRequest.query({
                'parameters[tr_status]': status,
                fields: 'nid,title,tr_status,tr_timestamp,tr_user,tr_trans,created,author,changed'
            }).$promise.then(function(transactionRequests) {
                return transactionRequests;
            }, function() {
                return [];
            });
        }


        function transformGetResponse(transactionRequest, headersGetter) {
            transactionRequest['tr_trans'] = _.map(transactionRequest['tr_trans'], function(transaction) {
                if (transaction.type === 'list_transaction') {
                    return new ListTransaction(transaction);
                } else if(transaction.type === 'list_transaction_unlimited') {
                    return new ListTransactionUnlimited(transaction);
                }
            });

            dollarProperty(transactionRequest, 'tr_trans');
            dollarProperty(transactionRequest, 'tr_user');
            dollarProperty(transactionRequest, 'author');
            dollarProperty(transactionRequest, 'source');
            dollarProperty(transactionRequest, 'tr_status');

            return transactionRequest;
        }

        function transformQueryResponse(transactionRequests, headersGetter) {
            _.each(transactionRequests, function(transactionRequest) {
                transformGetResponse(transactionRequest);
            });
            return transactionRequests;
        }

        function dollarProperty(transactionRequest, propertyName) {
            transactionRequest['$' + propertyName] = transactionRequest[propertyName];
            delete transactionRequest[propertyName];
        }

    });
