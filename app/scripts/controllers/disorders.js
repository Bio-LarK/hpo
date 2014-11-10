'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:DisordersCtrl
 * @description
 * # DisordersCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
    .controller('DisordersCtrl', function ($scope, $timeout, $stateParams, promiseTracker, Classification, Page) {

        var vm = this;
        vm.classifications = null;
        activate();

        ///////

        function activate() {
            getAllClassifications();
            Page.setTitle('All Classifications');
        }

        function getAllClassifications() {
            return Classification.getAll({}).then(function(classifications) {
                vm.classifications = classifications;
            });
        }

        // $scope.loadMore = loadMore;
        // $scope.loadingTracker = promiseTracker();
        // $scope.page = 0;
        // activate();

        // //////////////

        // function activate() {
        //     Page.setTitle('All Disorders');
        //     $scope.disorders = Disorder.query({
        //         fields: 'nid,disorder_name',
        //         page: $scope.page++
        //     });
        //     $scope.loadingTracker.addPromise($scope.disorders.$promise);
        // }


        // function loadMore() {
        //     var disorders = Disorder.query({
        //         fields: 'nid,disorder_name',
        //         page: $scope.page++
        //     }, function (disorders) {
        //         $scope.disorders = $scope.disorders.concat(disorders);
        //     });
        //     $scope.loadingTracker.addPromise(disorders.$promise);
        // }
    });