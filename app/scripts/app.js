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
        'dotjem.angular.tree',
        'ui.bootstrap',
        'ajoslin.promise-tracker',
        'toaster',
        'monospaced.elastic',
        'textAngular',
        'ui.select'
    ])
    .run(function ($state, $stateParams, $rootScope, searchService, pageService) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.searchService = searchService;
        $rootScope.pageService = pageService;
    })
    .config(function ($stateProvider, $urlRouterProvider,uiSelectConfig) {

        uiSelectConfig.theme = 'bootstrap';

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/phenotypes');
        //
        // Now set up the states
        $stateProvider
        .state('suggestions', {
                url: '/suggestions',
                controller: 'SuggestionsCtrl as vm',
                templateUrl: 'views/suggestions.html',
            })
            .state('suggestion', {
                url: '/suggestions/:suggestionId',
                controller: 'SuggestionCtrl as vm',
                templateUrl: 'views/suggestion.html',
            })

        .state('phenotype', {
            url: '/phenotypes/:phenotypeId',
            controller: 'PhenotypeCtrl',
            templateUrl: 'views/phenotype.html',
        })
        .state('phenotype.edit', {
            url: '/edit',
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