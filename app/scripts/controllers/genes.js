'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:GenesCtrl
 * @description
 * # GenesCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
    .controller('GenesCtrl', function ($scope, Gene, promiseTracker, Page) {
        $scope.loadMore = loadMore;
        $scope.loadingTracker = promiseTracker();
        $scope.page = 0;

        activate();

        /////////////

        function activate() {
            Page.setTitle('Genes');
            getGenes($scope.page++).then(function(genes) {
                $scope.genes = genes;
            });
        }

        function loadMore() {
            getGenes($scope.page++).then(function(genes) {
                $scope.genes = $scope.genes.concat(genes);
            });
        }

        function getGenes(page) {
            var genes = Gene.query({
                fields: 'nid,gene_name,gene_symbol,gene_disgene',
                page: page
            });
            var genesPromise = genes.$promise;
            genesPromise.then(function(genes) {
                _.each(genes, function(gene) {
                    gene.loadDisorders(true);
                });
            });
            $scope.loadingTracker.addPromise(genesPromise);
            return genesPromise;
        }

    });