'use strict';

/**
 * @ngdoc service
 * @name hpoApp.transactionStatusService
 * @description
 * # transactionStatusService
 * Factory in the hpoApp.
 */
angular.module('orphaApp')
    .factory('transactionStatusService', function($http, ENV, $log, $q) {
        var statuses = null;
        var loaded = false;
        var service = {
            loadStatusCodes: loadStatusCodes,
            isAccepted: isAccepted,
            isRejected: isRejected,
            isSubmitted: isSubmitted,
            isAcceptedTr: isAcceptedTransactionRequest,
            isRejectedTr: isRejectedTransactionRequest,
            isSubmittedTr: isSubmittedTransactionRequest,
            isClosed: isClosed,
            acceptedNid: null,
            rejectedNid: null,
            submittedNid: null
        };

        return service;


        function loadStatusCodes() {
            if(loaded) {
                return $q.when(service);
            }
            return $http.get(ENV.apiEndpoint + '/entity_node', {
                params: {
                    'parameters[type]': 'tr_status'
                }
            }).then(function(response) {
                loaded = true;
                statuses = response.data;

                service.submittedNid = _.find(statuses, {
                    'title': 'Submitted'
                }).nid;

                service.acceptedNid = _.find(statuses, {
                    'title': 'Accepted'
                }).nid;

                service.rejectedNid = _.find(statuses, {
                    'title': 'Rejected'
                }).nid;

                return service;
            });
        }

        function isAcceptedTransactionRequest(transactionRequest) {
            return isAccepted(transactionRequest['tr_status'].nid);
        }
        function isRejectedTransactionRequest(transactionRequest) {
            return isRejected(transactionRequest['tr_status'].nid);
        }
        function isSubmittedTransactionRequest(transactionRequest) {
            return isSubmitted(transactionRequest['tr_status'].nid);
        }
        function isAccepted(nid) {
            return nid === service.acceptedNid;
        }
        function isRejected(nid) {
            return nid === service.rejectedNid;
        }
        function isSubmitted(nid) {
            return nid === service.submittedNid;
        }
        function isClosed(nid) {
            return isAccepted(nid) || isRejected(nid);
        }

    });
