'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:EdittitleCtrl
 * @description
 * # EdittitleCtrl
 * Controller of the orphaApp
 */
angular.module('hpoApp')
    .controller('EditTitleCtrl', function($scope, $http, $modalInstance,
        ENV, ListTransaction, config, TransactionRequest, $log,
        toaster) {

        var vm = this;
        vm.concept = config.concept;
        vm.propertyName = config.propertyName;
        vm.propertyLabel = config.propertyLabel;
        vm.propertyValue = vm.concept[vm.propertyName].substring(0, 400);
        vm.save = save;
        vm.statuses = null;
        vm.cancel = cancel;
        vm.reason = '';

        activate();

        ////

        function activate() {
            getStatusCodes();
        }

        function getStatusCodes() {
            return $http.get(ENV.apiEndpoint + '/entity_node?parameters[type]=tr_status').then(function(response) {
                vm.statuses = response.data;
                $log.debug('loading statuses', vm.statuses);
            });
        }


        function save() {
            var submittedStatus = _.find(vm.statuses, {
                'title': 'Submitted'
            });
            if (!submittedStatus) {
                $log.error('couldnt find submitted status');
                return;
            }
            // Create a transaction
            var listTransaction = new ListTransaction({
                title: vm.concept.title,
                type: 'list_transaction',
                'ltrans_position': 0,
                'ltrans_onnode': vm.concept.nid,
                'ltrans_onprop': vm.propertyName,
                'ltrans_svalplain': vm.propertyValue,
                'ltrans_cvalplain': vm.concept[vm.propertyName].substring(0, 500),
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
                    'tr_status': submittedStatus.nid,
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
