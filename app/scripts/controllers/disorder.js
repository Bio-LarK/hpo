'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:DisorderCtrl
 * @description
 * # DisorderCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
    .controller('DisorderCtrl', function ($scope, $stateParams, Disorder, $log,
        Page, promiseTracker, $modal, modalService, Sign, Gene) {
        var vm = $scope;
        vm.disorderTracker = promiseTracker();
        vm.disorder = null;
        vm.signsTracker = promiseTracker();
        vm.genesTracker = promiseTracker();
        vm.toggleParents = toggleParents;
        vm.editAgeOfOnset = editAgeOfOnset;
        vm.editPrevalenceClass = editPrevalenceClass;
        vm.editAgeOfDeath = editAgeOfDeath;
        vm.editDisorderGene = editDisorderGene;
        vm.editDisorderPhenotype = editDisorderPhenotype;
        vm.startEditing = startEditing;
        vm.stopEditing = stopEditing;
        vm.editTitle = editTitle;
        vm.isEditing = false;
        vm.editDescription = editDescription;
        activate();

        ////////////

        function activate() {   

            var disorderPromise;
            
            if($stateParams.hpoId) {
                disorderPromise = Disorder.findByHpoId($stateParams.hpoId);    
            } else {
                disorderPromise = Disorder.get({
                   nid: $stateParams.disorderId //136402
                }).$promise;
            }

            disorderPromise.then(function (disorder) {
                vm.disorder = disorder;
                vm.disorder.monarchUrl = 'http://monarchinitiative.org/phenotype/HP:';
                var uriParts = vm.disorder.disorder_uri.split('HP_');

                vm.disorder.monarchUrl += uriParts[1];

                vm.disorder.loadChildren();
                vm.disorder.loadParents().then(function(parents) {
                    $log.debug('parents', parents);
                });
                vm.disorder.loadExternalIdentifiers();

                Disorder.getParentsFromDisorderInClassification(disorder).then(function(parents) {
                    _.each(parents, function(parent) {
                        _.each(parent['disorder_class'], function(parentClassification) {
                            var classification = _.find(vm.disorder['disorder_class'], {nid: parentClassification.nid});
                            if(classification) {
                                classification.parents = classification.parents || [];    
                                classification.parents.push(parent);
                            }
                        });
                    });
                });

                Page.setTitle(disorder['title']);

                // FIXME: This is terrible, and should all be serverside
                var genesPromise = disorder.getGenes();
                var signsPromise = disorder.getSigns();
                signsPromise.then(function() {
                    _.each(disorder['disorder_phenotype'], function(disorderSign) {
                        Sign.get({
                            nid: disorderSign['ds_sign'].nid
                        }).$promise.then(function(sign) {
                            disorderSign['ds_sign'] = sign;
                            sign.loadDisorders(true);
                            // _.extend(disorderSign['ds_sign'], sign);
                            // // $log.debug('new sign!', disorderSign['ds_sign'], sign);
                        });
                    });
                });
                genesPromise.then(function() {
                    _.each(disorder['disorder_disgene'], function(disorderGene) {
                        Gene.get({
                            nid: disorderGene['disgene_gene'].nid
                        }).$promise.then(function(gene) {
                            disorderGene['disgene_gene'] = gene;
                            gene.loadDisorders(true);
                            // _.extend(disorderSign['ds_sign'], sign);
                            // // $log.debug('new sign!', disorderSign['ds_sign'], sign);
                        });
                    });
                });

                // vm.signsTracker.addPromise(signsPromise);
                vm.genesTracker.addPromise(genesPromise);
            });
            vm.disorderTracker.addPromise(disorderPromise);
            vm.signsTracker.addPromise(disorderPromise);
            vm.genesTracker.addPromise(disorderPromise);
        }

        function startEditing() {
            vm.isEditing = true;
        }
        function stopEditing() {
            vm.isEditing = false;
        }

        function editDescription() {
            return modalService.openEditDescription(vm.disorder);
        }

        function toggleParents(disorder) {
            disorder.isShowingParents = !disorder.isShowingParents;
            disorder.getParents().then(function (disorders) {
                console.log('parents', disorders);
            });
        }

        function editTitle() {
            return modalService.openEditTitle(vm.disorder);
        }

        function editAgeOfOnset() {
            return modalService.openAgeOfOnset(vm.disorder);
        }

        function editPrevalenceClass() {
            return modalService.openPrevalenceClassModal(vm.disorder);
        }
        function editAgeOfDeath() {
            return modalService.openAgeOfDeath(vm.disorder);
        }

        function editDisorderGene(disorderGene) {
            var config = {
                relationshipNode: disorderGene,
                leftNode: vm.disorder, 
                rightNode: disorderGene.disgene_gene
            };

            var modalInstance = $modal.open({
                templateUrl: 'views/editdisordergene.modal.html',
                controller: 'EditDisorderGeneCtrl as editVm',
                // size: size,
                resolve: {
                    config: function() {
                        return config;
                    }
                }
            });
        }

        function editDisorderPhenotype(disorderSign) {
            var config = {
                relationshipNode: disorderSign,
                leftNode: vm.disorder, 
                rightNode: disorderSign.ds_sign
            };
            var modalInstance = $modal.open({
                templateUrl: 'views/editdisorderphenotype.modal.html',
                controller: 'EditDisorderPhenotypeCtrl as vm',
                // size: size,
                resolve: {
                    config: function() {
                        return config;
                    }
                }
            });
        }


    });