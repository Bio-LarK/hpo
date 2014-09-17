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
        vm.statuses = null;
        vm.suggestionTypeChanged = suggestionTypeChanged;
        activate();

        // ///////

        function activate() {
            getStatusCodes().then(function() {
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

        function getStatusCodes() {
            return $http.get(ENV.apiEndpoint + '/entity_node?parameters[type]=tr_status').then(function(response) {
                vm.statuses = response.data;
                $log.debug('loading statuses', vm.statuses);
            });
        }


        function getSubmittedTransactions() {
            var submittedStatus = _.find(vm.statuses, {'title': 'Submitted'});
            return getTransactions(submittedStatus.nid);
        }
        function getClosedTransactions() {
            $log.debug('statuses', vm.statuses);
            var rejectedStatus = _.find(vm.statuses, {'title': 'Rejected'});
            var acceptedStatus = _.find(vm.statuses, {'title': 'Accepted'});

            return $q.all([
                getTransactions(rejectedStatus.nid),
                getTransactions(acceptedStatus.nid)
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
