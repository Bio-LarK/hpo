'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:SuggestionsCtrl
 * @description
 * # SuggestionsCtrl
 * Controller of the orphaApp
 */
angular.module('hpoApp')
    .controller('SuggestionsCtrl', function($http, $scope, ENV, TransactionRequest, 
        $log, $q, transactionStatusService) {
        var vm = this;
        vm.suggestions = null;
        vm.openSuggestions = null;
        vm.closedSuggestions = null;
        vm.isShowingOpen = true;
        vm.statuses = null;
        vm.suggestionTypeChanged = suggestionTypeChanged;
        activate();

        // ///////

        function activate() {
            transactionStatusService.loadStatusCodes().then(function() {
                getSubmittedTransactions().then(function(suggestions) {
                    vm.openSuggestions = suggestions;
                    vm.suggestions = vm.openSuggestions;
                });
                getClosedTransactions().then(function(suggestions) {
                    vm.closedSuggestions = suggestions;
                });
            });
            // Load all transation requests
        }

        function getSubmittedTransactions() {
            return TransactionRequest.getSubmittedTransactions();
        }
        function getClosedTransactions() {
            return TransactionRequest.getClosedTransactions();
        }

        function suggestionTypeChanged(isShowingOpen) {
            vm.suggestions = null;
            if(isShowingOpen) {
                vm.suggestions = vm.openSuggestions;
            } else {
                vm.suggestions = vm.closedSuggestions;
            }
        }
    });
