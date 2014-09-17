'use strict';

/**
 * @ngdoc function
 * @name hpoApp.controller:PhenotypeCtrl
 * @description
 * # PhenotypeCtrl
 * Controller of the hpoApp
 */
angular.module('hpoApp')
    .controller('PhenotypeCtrl', function ($scope, $stateParams, promiseTracker, Phenotype, pageService, modalService) {
        
        var vm = $scope;
        vm.loadingTracker = promiseTracker();
        vm.phenotype = null;
        vm.toggleParents = toggleParents;
        vm.isEditing = true;
        vm.editBody = editBody;
        vm.editTitle = editTitle;
        activate();
        ////////////

        function activate() {
            pageService.setTitle('Loading...');

            var promise = Phenotype.get({
                nid: $stateParams.phenotypeId
            }, function (phenotype) {
                $scope.phenotype = phenotype;
                pageService.setTitle(phenotype['concept_label']);
            }).$promise;

            $scope.loadingTracker.addPromise(promise);
            // Disorder.get({
            //     nid: $stateParams.disorderId //136402
            // }, function (disorder) {
            //     $scope.disorder = disorder;
            //     // var genesPromise = disorder.getGenes();
            //     // $scope.genesTracker.addPromise(genesPromise);
            //     // var signsPromise = disorder.getSigns();
            //     // $scope.signsTracker.addPromise(signsPromise);
            //     Page.setTitle(disorder['disorder_name']);
            // });
            // $scope.disorderTracker.addPromise(disorder.$promise);
            // $scope.signsTracker.addPromise(disorder.$promise);
            // $scope.genesTracker.addPromise(disorder.$promise);
        }


        function toggleParents(phenotype) {
            phenotype.isShowingParents = !phenotype.isShowingParents;
            if (phenotype.isShowingParents) {
                phenotype.getParents();
            }
        }

        function editTitle() {
            return modalService.openEditTitle(vm.phenotype);
        }
        function editBody() {
            return modalService.openEditDescription(vm.phenotype);
        }

    });