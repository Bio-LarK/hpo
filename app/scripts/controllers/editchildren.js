'use strict';

/**
 * @ngdoc function
 * @name hpoApp.controller:EditclassificationCtrl
 * @description
 * # EditclassificationCtrl
 * Controller of the hpoApp
 */
angular.module('hpoApp')
    .controller('EditChildrenCtrl', function(transactionStatusService, $log, config, 
    	Phenotype, searchService, TransactionRequest, ListTransaction, toaster, $modalInstance, $q) {

        var vm = this;
        vm.config = config;
        vm.phenotype = config.concept;

        vm.infoMessage = config.infoMessage;
        vm.propertyName = config.propertyName;
        vm.transactionRequestTitle = config.transactionRequestTitle;
        vm.parents = _.clone(vm.phenotype[vm.propertyName]);
        vm.phenotypes = null;
        vm.reason = '';
		vm.refreshPhenotypes = refreshPhenotypes;
		vm.addParent = addParent;
		vm.removeParent = removeParent;
        vm.newParent = null;
        vm.save = save;
        vm.cancel = cancel;
       
       	activate();

        ///////

        function activate() {
        	return getStatusCodes();
        }


        function getStatusCodes() {
        	return transactionStatusService.loadStatusCodes();
        }


        function refreshPhenotypes(phenotype) {
        	searchService.findPhenotypes(phenotype).then(function(phenotypes) {
        		updateAutocompletePhenotypes(phenotypes);
        	});
        }

        function addParent(parent) {
        	vm.parents.push(parent);
        	vm.newParent = null;

        	updateAutocompletePhenotypes(vm.phenotypes);
        }

        function removeParent(parent, parents) {
        	var index = parents.indexOf(parent);
        	parents.splice(index, 1);
        	refreshPhenotypes('');
        }

        function updateAutocompletePhenotypes(phenotypes) {
        	vm.phenotypes = _.reject(phenotypes, function(phenotype) {
    			return _.find(vm.parents, {nid: phenotype.nid}) || vm.phenotype.nid === phenotype.nid;
    		});
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function save() {
            // Create add list

            vm.addedParents = _.reject(vm.parents, function(newParent) {
                return _.find(vm.phenotype[vm.propertyName], {nid: newParent.nid});
            });
            vm.removedParents = _.reject(vm.phenotype[vm.propertyName], function(newParent) {
                return _.find(vm.parents, {nid: newParent.nid});
            });

            vm.addedParentsRequests = _.map(vm.addedParents, function(parent) {
                var listTransaction = new ListTransaction({
                    'title': 'transaction',
                    'type': 'list_transaction',

                    'ltrans_onnode': vm.phenotype.nid,
                    'ltrans_onprop': vm.propertyName,
                    'ltrans_ctype': 'add',
                    'ltrans_svalref': parent.nid,
                });
                return listTransaction.$save();
            });
            vm.removeParentRequests = _.map(vm.removedParents, function(parent) {
                var listTransaction = new ListTransaction({
                    'title': 'transaction',
                    'type': 'list_transaction',

                    'ltrans_onnode': vm.phenotype.nid,
                    'ltrans_onprop': vm.propertyName,
                    'ltrans_ctype': 'remove',
                    'ltrans_svalref': parent.nid,
                });
                return listTransaction.$save();
            });

            var listTransactionRequests = vm.addedParentsRequests.concat(vm.removeParentRequests);

            $q.all(listTransactionRequests).then(function(listTransactions) {
                var transactionRequest = new TransactionRequest({
                    title: vm.transactionRequestTitle,
                    type: 'transaction_request',
                    'tr_timestamp': new Date().getTime() / 1000,
                    'tr_trans': _.pluck(listTransactions, 'nid'),
                    'tr_status': transactionStatusService.submittedNid,
                    'tr_user': 0,
                    body: {
                        value: vm.reason + '',
                        summary: vm.reason + ''
                    }
                });
                toaster.pop('success', 'Suggestion submitted.');
                return transactionRequest.$save();
            });

            $modalInstance.dismiss('cancel');
        }
    });
