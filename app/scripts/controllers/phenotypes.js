'use strict';

/**
 * @ngdoc function
 * @name hpoApp.controller:PhenotypesCtrl
 * @description
 * # PhenotypesCtrl
 * Controller of the hpoApp
 */
angular.module('hpoApp')
    .controller('PhenotypesCtrl', function ($scope, Phenotype, promiseTracker) {
        $scope.loadMore = loadMore;
        $scope.loadingTracker = promiseTracker();
        $scope.page = 0;
        activate();

        console.log('phenotypes ctrl');
        //////////////

        function activate() {
            var promise = getPhenotypes($scope.page++);
            $scope.loadingTracker.addPromise(promise);
        }

        function loadMore() {
            var promise = getPhenotypes($scope.page++);
            $scope.loadingTracker.addPromise(promise);
        }

        function getPhenotypes(page) {
            return Phenotype.query({
                fields: 'nid,concept_label',
                page: page
            }, function (phenotypes) {
                $scope.phenotypes = $scope.phenotypes || [];
                $scope.phenotypes = $scope.phenotypes.concat(phenotypes);
            });
        }
    });