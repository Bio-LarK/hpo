'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:EdittitleCtrl
 * @description
 * # EdittitleCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
    .controller('EditTitleCtrl', function($scope, $http, $modalInstance,
        ENV, ListTransaction, config, TransactionRequest, transactionStatusService,
        toaster) {

        var vm = this;
        vm.concept = config.concept;
        vm.propertyName = config.propertyName;
        vm.propertyLabel = config.propertyLabel;
        vm.propertyValue = vm.concept[vm.propertyName].substring(0, 400);
        vm.save = save;
        vm.cancel = cancel;
        vm.reason = '';

        activate();

        ////

        function activate() {
        }

        function save() {
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
                return transactionStatusService.loadStatusCodes().then(function() {
                    var transactionRequest = new TransactionRequest({
                        title: vm.concept.title + ' - ' + vm.propertyLabel,
                        type: 'transaction_request',
                        'tr_timestamp': new Date().getTime() / 1000,
                        'tr_trans': [
                            listTransaction.nid
                        ],
                        'tr_status': transactionStatusService.submittedNid,
                        'tr_user': 0,
                        body: {
                            value: vm.reason,
                            summary: vm.reason
                        }
                    });
                    toaster.pop('success', 'Suggestion submitted.');
                    return transactionRequest.$save();
                });
            });

            $modalInstance.close();
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

    });
