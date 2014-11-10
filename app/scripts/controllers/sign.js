'use strict';

/**
 * @ngdoc function
 * @name orphaApp.controller:SignCtrl
 * @description
 * # SignCtrl
 * Controller of the orphaApp
 */
angular.module('orphaApp')
    .controller('SignCtrl', function ($scope, $stateParams, Disorder, Sign, promiseTracker, Page) {
        $scope.signTracker = promiseTracker();
        $scope.limit = 10;
        $scope.disordersTracker = promiseTracker();
        $scope.showMore = showMore;
        activate();

        ////////////

        function showMore() {
            $scope.limit += 20;
        }
        function activate() {
            Sign.get({
                nid: $stateParams.signId
            }).$promise.then(function(sign) {
                $scope.sign = sign;
                sign.sign_parent = _.reject(sign.sign_parent, function(signParent) {
                    return signParent.title === '_NO_NAME_';
                });
                Page.setTitle(sign.title);
                sign.loadDisorders();
                sign.loadChildren().then(function(children) {
                    _.each(children, function(child) {
                        child.loadDisorders(true);
                    });
                });
            });
            // $scope.signTracker.addPromise($scope.sign);

            // // load the disorders
            // var disorderPromise = Disorder.getFromSign($stateParams.signId).then(function (disorders) {
            //     $scope.disorders = disorders;
            // });
            // $scope.disordersTracker.addPromise($scope.sign);
            // $scope.disordersTracker.addPromise(disorderPromise);

            /*
            _.each(disorders, function(disorder) {
                        _.each(disorder['disorder_class'], function(classification) {
                            if(!angular.isDefined(classifications[classification.nid])) {
                                classifications[classification.nid] = classification;
                                classifications[classification.nid].count = 0;
                            } 
                            classifications[classification.nid].count++;
                        });
                    });
*/
        }
    });