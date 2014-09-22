'use strict';

/**
 * @ngdoc function
 * @name hpoApp.controller:PhenotypeCtrl
 * @description
 * # PhenotypeCtrl
 * Controller of the hpoApp
 */
angular.module('hpoApp')
    .controller('PhenotypeCtrl', function ($scope, $stateParams, promiseTracker, 
        Phenotype, pageService, $state, modalService, $log) {
        
        var vm = $scope;
        vm.loadingTracker = promiseTracker();
        vm.phenotype = null;
        vm.toggleParents = toggleParents;
        vm.isEditing = true;
        vm.editBody = editBody;
        vm.editTitle = editTitle;
        vm.editClassification = editClassification;
        vm.changeEditing = changeEditing;
        vm.editSynonym = editSynonym;
        activate();
        ////////////

        function activate() {
            pageService.setTitle('Loading...');

            var promise = Phenotype.get({
                nid: $stateParams.phenotypeId
            }, function (phenotype) {
                vm.phenotype = phenotype;
                pageService.setTitle(phenotype['concept_label']);
                $log.debug(vm.phenotype);
            }).$promise;

            $scope.loadingTracker.addPromise(promise);
        }

        function changeEditing(isEditing) {
            vm.isEditing = isEditing;
            if(isEditing) {
                $state.go('phenotype.edit');
            } else {
                console.log('go to phentoype');
                $state.go('phenotype');
            }
        }

        function toggleParents(phenotype) {
            phenotype.isShowingParents = !phenotype.isShowingParents;
            if (phenotype.isShowingParents) {
                phenotype.getParents();
            }
        }

        function editClassification() {
            return modalService.openEditClassification(vm.phenotype);
        }
        function editTitle() {
            return modalService.openEditTitle(vm.phenotype);
        }
        function editBody() {
            return modalService.openEditDescription(vm.phenotype);
        }
        function editSynonym(synonym) {
            return modalService.openEditSynonym(vm.phenotype, synonym);   
        }

    });