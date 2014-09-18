'use strict';

/**
 * @ngdoc function
 * @name hpoApp.controller:EditsynonymCtrl
 * @description
 * # EditsynonymCtrl
 * Controller of the hpoApp
 */
angular.module('hpoApp')
  .controller('EditSynonymCtrl', function($scope, $http, $modalInstance,
        config, ENV, ListTransaction, $q, TransactionRequest, toaster, $log) {
        var vm = this;
        vm.synonym = config.synonym;
        vm.phenotype = config.phenotype;
        vm.reason = null;
        vm.types = null;
        vm.synonymName = vm.synonym.title;
        vm.cancel = cancel;
        vm.save = save;
        // vm.proposeChanges = proposeChanges;

        activate();

        ////////

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
            $log.debug('savuing!');
            var submittedStatus = _.find(vm.statuses, {
                'title': 'Submitted'
            });
            if (!submittedStatus) {
                $log.error('couldnt find submitted status');
                return;
            }
            // Create a transaction
            var listTransaction = new ListTransaction({
                title: vm.phenotype.title,
                type: 'list_transaction',
                'ltrans_position': 0,
                'ltrans_onnode': vm.synonym.nid,
                'ltrans_onprop': 'title',
                'ltrans_svalplain': vm.synonymName,
                'ltrans_cvalplain': vm.synonym['title'].substring(0, 500),
                body: {
                    value: vm.reason,
                    summary: vm.reason
                }
            });
            listTransaction.$save().then(function() {
                // Add it to a transaction request
                var transactionRequest = new TransactionRequest({
                    title: vm.phenotype.title + ' - Synonym',
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

        // function loadSynonymType() {
        // 	return vm.synonym.loadType();
        // }
        // function getSynonymTypes() {
        // 	return $http.get(ENV.apiEndpoint + '/entity_node', {
        // 		params: {
        // 			'parameters[type]': 'hpo_synonym_type'
        //             // fields: 'nid,title'
        // 		}
        // 	}).then(function(response) {
        // 		vm.types = response.data;
        // 		vm.type = _.find(vm.types, {nid: vm.synonym['field_syntype_uri']});
        // 	});
        // }

        // function cancel() {
        //     $modalInstance.dismiss('cancel');
        // }

        // function getSignFrequencies() {
        //     return $http.get(ENV.apiEndpoint + '/entity_node', {
        //         params: {
        //             'parameters[type]': 'sign_frequency',
        //             fields: 'nid,title'
        //         }
        //     }).then(function(response) {
        //         vm.disorderSignFrequencies = response.data;
        //         vm.disorderSignFrequency = _.find(vm.disorderSignFrequencies, {
        //             nid: vm.disorderSign['ds_frequency'].nid
        //         });
        //     });
        // }

        // function proposeChanges() {

        //     var propertyName = 'ds_frequency';
        //     var listTransaction = new ListTransaction({
        //         title: 'transaction',
        //         type: 'list_transaction',

        //         ltrans_position: 0,
        //         ltrans_onnode: vm.disorderSign.nid,
        //         ltrans_onprop: propertyName,
        //         ltrans_svalref: vm.disorderSignFrequency.nid,
        //         ltrans_cvalref: vm.disorderSign[propertyName].nid
        //     });
        //     listTransaction.$save().then(function(listTransaction) {
        //         // var transactionIds = _.pluck(cats, 'nid');
        //         // Add it to a transaction request
        //         var transactionRequest = new TransactionRequest({
        //             title: 'Relationship between ' + vm.disorder.title + ' and ' + vm.sign.title,
        //             type: 'transaction_request',
        //             'tr_timestamp': new Date().getTime() / 1000,
        //             'tr_trans': [
        //                 listTransaction.nid
        //             ],
        //             'tr_status': 3,
        //             'tr_user': 0,
        //             body: {
        //                 value: vm.reason,
        //                 summary: vm.reason
        //             }
        //         });
        //         toaster.pop('success', 'Suggestion submitted.');
        //         return transactionRequest.$save();
        //     });

        //     $modalInstance.dismiss('cancel');
        // }
    });
