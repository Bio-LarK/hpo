'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:SuggestionCtrl
 * @description
 * # SuggestionCtrl
 * Controller of the orphaApp
 */
angular.module('hpoApp')
  .controller('SuggestionCtrl', function ($stateParams, TransactionRequest, $state, $http, toaster, ENV, $log) {
    	var vm = this;
        vm.suggestion = null;
        vm.accept = accept;
        vm.reject = reject;
        vm.statues = null;
    	activate();

    	//////////
    	function activate() {
            getStatusCodes().then(function() {
                return getTransactions();
            });
    	}

        function getTransactions() {
            return TransactionRequest.get({
                nid: $stateParams.suggestionId
            }).$promise.then(function(transactionRequest) {
                vm.suggestion = transactionRequest;
                _.each(transactionRequest['$tr_trans'], function(listTransaction) {
                    listTransaction.loadReferences().then(function(listTransaction) {
                        // bit of moving stuff about
                        // the transaction request needs to know the nodes
                        // but it doesnt, so we just grab those from the first 
                        // list transaction
                        if(!transactionRequest.$relatedNodes) {
                            transactionRequest.$relatedNodes = listTransaction.relatedNodes;
                        }
                    });
                });
            });   
        }

        function getStatusCodes() {
            return $http.get(ENV.apiEndpoint + '/entity_node?parameters[type]=tr_status').then(function(response) {
                vm.statues = response.data;
            });
        }

        function accept(suggestion) {
            var acceptedStatus = _.find(vm.statues, { 'title': 'Accepted'});
            if(!acceptedStatus) {
                $log.error('Couldnt find accept status');
                return;
            }
            suggestion['tr_status'] = acceptedStatus.nid;
            suggestion.$update().then(function() {
                toaster.pop('success', 'Suggestion Accepted');
                $state.go('suggestions');    
            });
        }

        function reject(suggestion) {
            var rejectedStatus = _.find(vm.statues, { 'title': 'Rejected'});
            if(!rejectedStatus) {
                $log.error('Couldnt find accept status');
                return;
            }

            suggestion['tr_status'] = rejectedStatus.nid;
            suggestion.$update().then(function() {
                toaster.pop('success', 'Suggestion Rejected');
                $state.go('suggestions');    
            });
        }
  });



/**

'use strict';

angular.module('orphaApp')
  .controller('SuggestionCtrl', function ($stateParams, TransactionRequest, $state, $http, toaster, $q) {
        var vm = this;
        vm.suggestion = null;
        vm.accept = accept;
        vm.reject = reject;
        activate();

        //////////
        function activate() {
            TransactionRequest.get({
                nid: $stateParams.suggestionId
            }).$promise.then(function(transactionRequest) {
                vm.suggestion = transactionRequest;

                var transactions = [].
                _.forEach(transactionRequest['$tr_trans'], function(listTransaction) {
                    transactions.push(listTransaction.loadReferences());
                });

                transactionRequest.relatedNodes = [];
                $q.all(transactions).then(function(transactions) {
                    if(transactions.length) {
                        transactionRequest.relatedNodes = transactions[0].relatedNodes;    
                    }
                });
            });
        }

        function accept(suggestion) {
            suggestion['tr_status'] = 1;
            suggestion.$update().then(function() {
                toaster.pop('success', 'Suggestion Accepted');
                $state.go('suggestions');    
            });
        }

        function reject(suggestion) {
            suggestion['tr_status'] = 2;
            suggestion.$update().then(function() {
                toaster.pop('success', 'Suggestion Rejected');
                $state.go('suggestions');    
            });
        }
  });

**/