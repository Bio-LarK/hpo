'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:SuggestionCtrl
 * @description
 * # SuggestionCtrl
 * Controller of the orphaApp
 */
angular.module('hpoApp')
  .controller('SuggestionCtrl', function ($stateParams, transactionStatusService, 
    TransactionRequest, $state, $http, toaster, ENV, $log) {
    	var vm = this;
        vm.suggestion = null;
        vm.accept = accept;
        vm.reject = reject;
        vm.statues = null;
        vm.isOpen = false;
    	activate();

    	//////////
    	function activate() {
            transactionStatusService.loadStatusCodes().then(function() {
                return getTransactions();
            });
    	}

        function getTransactions() {
            return TransactionRequest.get({
                nid: $stateParams.suggestionId
            }).$promise.then(function(transactionRequest) {
                vm.suggestion = transactionRequest;
                return transactionRequest.loadTransactions();
            });

            // return TransactionRequest.get({
            //     nid: $stateParams.suggestionId
            // }).$promise.then(function(transactionRequest) {
            //     vm.suggestion = transactionRequest;

            //     vm.isOpen = transactionStatusService.isSubmitted(vm.suggestion['$tr_status'].nid);
                
            //     _.each(transactionRequest['$tr_trans'], function(listTransaction) {
            //         listTransaction.loadReferences().then(function(listTransaction) {
            //             // bit of moving stuff about
            //             // the transaction request needs to know the nodes
            //             // but it doesnt, so we just grab those from the first 
            //             // list transaction
            //             if(!transactionRequest.$relatedNodes) {
            //                 transactionRequest.$relatedNodes = listTransaction.relatedNodes;
            //             }
            //         });
            //     });
            // });   
        }

        function accept(suggestion) {
            suggestion['tr_status'] = transactionStatusService.acceptedNid;
            suggestion.$update().then(function() {
                toaster.pop('success', 'Suggestion Accepted');
                $state.go('suggestions');    
            });
        }

        function reject(suggestion) {
            suggestion['tr_status'] = transactionStatusService.rejectedNid;
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