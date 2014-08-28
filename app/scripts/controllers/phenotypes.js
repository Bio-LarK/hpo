'use strict';

/**
 * @ngdoc function
 * @name hpoApp.controller:PhenotypesCtrl
 * @description
 * # PhenotypesCtrl
 * Controller of the hpoApp
 */
angular.module('hpoApp')
    .controller('PhenotypesCtrl', function ($scope, Phenotype) {
        $scope.loadMore = loadMore;
        // $scope.loadingTracker = promiseTracker();
        $scope.page = 0;
        activate();

        console.log('phenotypes ctrl');
        //////////////

        function activate() {
            getPhenotypes($scope.page++);
            // $scope.loadingTracker.addPromise($scope.disorders.$promise);
        }

        function loadMore() {
            getPhenotypes($scope.page++);
            // $scope.loadingTracker.addPromise(disorders.$promise);
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