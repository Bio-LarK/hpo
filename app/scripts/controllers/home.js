'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
	.controller('HomeCtrl', function (Disorder, Classification, $log, Page, $q) {
		var vm = this;
		vm.classifications = null;
		activate();

		///////

		function activate() {
			getAllClassifications();
			Page.setTitle('');
		}

		function getAllClassifications() {
			return Classification.getAll({}).then(function(classifications) {
				vm.classifications = classifications;
				var disorders = [Disorder.query({
                    fields: 'title,disorder_nochildren,disorder_class',
                    'parameters[disorder_root]': 1,
                    page: 0
                }).$promise, Disorder.query({
                    fields: 'title,disorder_nochildren,disorder_class',
                    'parameters[disorder_root]': 1,
                    page: 1
                }).$promise];

                $q.all(disorders).then(function(results) {
                    var disorders = _.flatten(results);
                    _.forEach(disorders, function(disorder) {
                        var classification = _.find(vm.classifications, {nid: disorder['disorder_class'][0].nid});
                        classification.count = disorder['disorder_nochildren'];
                    });
                });
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
