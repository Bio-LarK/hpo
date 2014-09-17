'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:EditdisordergeneCtrl
 * @description
 * # EditdisordergeneCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
    .controller('EditDisorderGeneCtrl', function($scope, $http, $modalInstance, config, 
        ENV, ListTransaction, $q, TransactionRequest, toaster) {
        var vm = this;
        vm.disorderGene = config.relationshipNode;
        vm.gene = config.rightNode;
        vm.proposalType = 'edit';
        vm.disorder = config.leftNode;
        vm.disorderGeneStatuses = null;
        vm.disorderGeneStatus = null;
        vm.disorderGeneTypes = null;
        vm.disorderGeneType = null;
        vm.reason = null;
        vm.cancel = cancel;
        vm.proposeChanges = proposeChanges;

        activate();

        ////////

        function activate() {
            getDisorderGeneStatuses();
            getDisorderGeneTypes();
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function proposeChanges() {
            var transactions = [];
            if (vm.disorderGene['disgene_as'].nid !== vm.disorderGeneStatus.nid) {
                var propertyName = 'disgene_as';
                var listTransaction = new ListTransaction({
                    title: 'transaction',
                    type: 'list_transaction',

                    ltrans_position: transactions.length,
                    ltrans_onnode: vm.disorderGene.nid,
                    ltrans_onprop: propertyName,
                    ltrans_svalref: vm.disorderGeneStatus.nid,
                    ltrans_cvalref: vm.disorderGene[propertyName].nid
                });
                transactions.push(listTransaction.$save());
            }

            if (vm.disorderGene['disgene_at'].nid !== vm.disorderGeneType.nid) {
                var propertyName2 = 'disgene_at';
                var listTransaction2 = new ListTransaction({
                    title: 'transaction',
                    type: 'list_transaction',

                    ltrans_position: transactions.length,
                    ltrans_onnode: vm.disorderGene.nid,
                    ltrans_onprop: propertyName2,
                    ltrans_svalref: vm.disorderGeneType.nid,
                    ltrans_cvalref: vm.disorderGene[propertyName2].nid
                });
                transactions.push(listTransaction2.$save());
            }

            $q.all(transactions).then(function(cats) {
                var transactionIds = _.pluck(cats, 'nid');
                // Add it to a transaction request
                var transactionRequest = new TransactionRequest({
                    title: 'Relationship between ' + vm.disorder.title + ' and ' + vm.gene.title,
                    type: 'transaction_request',
                    'tr_timestamp': new Date().getTime() / 1000,
                    'tr_trans': transactionIds,
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

            $modalInstance.dismiss('cancel');
        }

        function getDisorderGeneStatuses() {
            return $http.get(ENV.apiEndpoint + '/entity_node', {
                params: {
                    'parameters[type]': 'disorder_gene_as',
                    fields: 'nid,title'
                }
            }).then(function(response) {
                vm.disorderGeneStatuses = response.data;
                vm.disorderGeneStatus = _.find(vm.disorderGeneStatuses, {
                    nid: vm.disorderGene['disgene_as'].nid
                });
            });
        }

        function getDisorderGeneTypes() {
            return $http.get(ENV.apiEndpoint + '/entity_node', {
                params: {
                    'parameters[type]': 'disorder_gene_at',
                    fields: 'nid,title'
                }
            }).then(function(response) {
                vm.disorderGeneTypes = response.data;
                vm.disorderGeneType = _.find(vm.disorderGeneTypes, {
                    nid: vm.disorderGene['disgene_at'].nid
                });
            });
        }
    });
