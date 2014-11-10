'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:GeneCtrl
 * @description
 * # GeneCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
    .controller('GeneCtrl', function ($scope, $stateParams, Gene, Disorder, promiseTracker, Page) {
        $scope.disordersTracker = promiseTracker();
        $scope.geneTracker = promiseTracker();
        activate();

        ///////////
        function activate() {
            Gene.get({
                nid: $stateParams.geneId //136402
            }).$promise.then(function(gene) {
                $scope.gene = gene;
                Page.setTitle(gene.title);
                gene.loadDisorders();
            });
            // $scope.geneTracker.addPromise($scope.gene.$promise);
            // $scope.disordersTracker.addPromise($scope.gene.$promise);
            // $scope.gene.$promise.then(function(gene) {
            //     Page.setTitle(gene.title);
            // });


            // load the disorders
            // var disordersPromise = Disorder.getFromGene($stateParams.geneId).then(function (disorders) {
            //     $scope.disorders = disorders;
            //     $scope.gene.classifications = _.flatten(_.pluck($scope.disorders, 'disorder_class'));
            // });
            // $scope.disordersTracker.addPromise(disordersPromise);

        }
    });