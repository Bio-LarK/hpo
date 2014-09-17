'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:SuggestionsCtrl
 * @description
 * # SuggestionsCtrl
 * Controller of the orphaApp
 */
angular.module('hpoApp')
    .controller('SuggestionsCtrl', function($http, $scope, ENV, TransactionRequest, $log, $q) {
        var vm = this;
        vm.suggestions = null;
        vm.openSuggestions = null;
        vm.closedSuggestions = null;
        vm.isShowingOpen = true;
        vm.suggestionTypeChanged = suggestionTypeChanged;
        activate();

        // ///////

        function activate() {
            // Load all transation requests
            getSubmittedTransactions().then(function(suggestions) {
                vm.openSuggestions = suggestions;
                vm.suggestions = vm.openSuggestions;
            });
            getClosedTransactions().then(function(suggestions) {
                vm.closedSuggestions = suggestions;
            });
        }

        function getSubmittedTransactions() {
            return getTransactions(3);
        }
        function getClosedTransactions() {
            return $q.all([
                getTransactions(1),
                getTransactions(2)
            ]).then(function(transactions) {
                return _.flatten(transactions);
            });
        }
        function getTransactions(status) {
            return TransactionRequest.query({
                'parameters[tr_status]': status,
                fields: 'nid,title,tr_status,tr_timestamp,tr_user,tr_trans,created,author,changed'
            }).$promise.then(function(suggestions) {
                return suggestions;
            }, function() {
                return [];
            });
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
