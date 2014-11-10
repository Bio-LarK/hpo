'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
	.controller('HomeCtrl', function (Disorder, Classification, $log, Page) {
		var vm = this;
		vm.classifications = null;
		activate();

		///////

		function activate() {
			getAllClassifications();
			Page.setTitle('Orphanet - Rare diseases are rare but rare disease patients are numerous.');
		}

		function getAllClassifications() {
			return Classification.getAll({}).then(function(classifications) {
				vm.classifications = classifications;
			});
		}

		function selectDisorder(disorder) {
			$log.debug('selecting disorder', disorder);
			vm.disorder = disorder;
			disorder.loadChildren().then(function(children) {
				$log.debug('got children', children);
			});
		}

	});
