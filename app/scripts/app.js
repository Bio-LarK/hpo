'use strict';

/**
 * @ngdoc overview
 * @name hpoApp
 * @description
 * # hpoApp
 *
 * Main module of the application.
 */
angular
    .module('hpoApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'config',
        'dotjem.angular.tree'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        // 
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/phenotypes');
        //
        // Now set up the states
        $stateProvider
        // .state('genes', {
        //     url: '/genes?page',
        //     controller: 'GenesCtrl',
        //     templateUrl: 'views/genes.html'
        // })
        // .state('gene', {
        //     url: '/gene/:geneId/disorders',
        //     controller: 'GeneCtrl',
        //     templateUrl: 'views/gene.html'
        // })
        // .state('sign', {
        //     url: '/sign/:signId/disorders',
        //     controller: 'SignCtrl',
        //     templateUrl: 'views/sign.html'
        // })
        // .state('signs', {
        //     url: '/signs',
        //     controller: 'SignsCtrl',
        //     templateUrl: 'views/signs.html'
        // })
        .state('phenotype', {
            url: '/phenotypes/:phenotypeId',
            controller: 'PhenotypeCtrl',
            templateUrl: 'views/phenotype.html',
        })
            .state('phenotypes', {
                url: '/phenotypes',
                controller: 'PhenotypesCtrl',
                templateUrl: 'views/phenotypes.html'
            });
        // .state('concept', {
        //     url: '/concept/:conceptId',
        //     controller: function ($scope, Disorder) {
        //         var disorder = Disorder.get({
        //             nid: 136402
        //         }, function () {
        //             $scope.disorder = disorder;
        //         });
        //     },
        //     templateUrl: 'views/concept.html'
        // });
    });