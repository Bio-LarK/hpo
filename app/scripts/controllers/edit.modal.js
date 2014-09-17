'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:EditModalCtrl
 * @description
 * # EditModalCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
    .controller('EditModalCtrl', function($scope, $http, $modalInstance,
        ENV, ListTransaction, config, TransactionRequest,
        toaster) {

        var vm = this;
        vm.concept = config.concept;
        vm.propertyName = config.propertyName;
        vm.propertyContentType = config.propertyContentType;
        vm.propertyLabel = config.propertyLabel;
        vm.save = save;
        vm.cancel = cancel;
        vm.stuff = null;
        vm.prevalenceClasses = null;
        vm.prevalenceClass = null;
        vm.reason = '';

        activate();

        ////

        function activate() {
            return getPropertyOptions();
        }

        function getPropertyOptions() {
            return $http.get(ENV.apiEndpoint + '/entity_node', {
                params: {
                    'parameters[type]': vm.propertyContentType,
                    fields: 'nid,title'
                }
            }).then(function(response) {
                vm.prevalenceClasses = response.data;
                vm.prevalenceClass = _.find(vm.prevalenceClasses, {nid: vm.concept[vm.propertyName].nid});
            });
        }

        function save() {
            // Create a transaction
            var listTransaction = new ListTransaction({
                title: vm.concept.title,
                type: 'list_transaction',
                'ltrans_position': 0,
                'ltrans_onnode': vm.concept.nid,
                'ltrans_onprop': vm.propertyName,
                'ltrans_svalref': vm.prevalenceClass.nid,
                'ltrans_cvalref': vm.concept[vm.propertyName].nid,
                body: {
                    value: vm.reason,
                    summary: vm.reason
                }
            });
            listTransaction.$save().then(function() {
                // Add it to a transaction request
                var transactionRequest = new TransactionRequest({
                    title: vm.concept.title + ' - ' + vm.propertyLabel,
                    type: 'transaction_request',
                    'tr_timestamp': new Date().getTime() / 1000,
                    'tr_trans': [
                        listTransaction.nid
                    ],
                    'tr_status': 3,
                    'tr_user': 0,
                    body: {
                        value: vm.reason,
                        summary: vm.reason
                    }
                });
                toaster.pop('success', 'Suggestion submitted.');
                return transactionRequest.$save();
            });

            $modalInstance.close();
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

    });
