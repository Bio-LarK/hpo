'use strict';

/**
 * @ngdoc function
 * @name hpoApp.controller:EditclassificationCtrl
 * @description
 * # EditclassificationCtrl
 * Controller of the hpoApp
 */
angular.module('hpoApp')
    .controller('EditClassificationCtrl', function($scope, $http, config, Phenotype, searchService) {
        var vm = this;
        vm.config = config;
        vm.phenotype = config.concept;
		vm.refreshPhenotypes = refreshPhenotypes;
        vm.newPhenotype = {};
        


        // Load all phenotypes?
        Phenotype.query({
            fields: 'title,nid'
        }).$promise.then(function(phenotypes) {
            vm.phenotypes = phenotypes;
        });

        ///////

    });
