'use strict';

/**
 * @ngdoc service
 * @name orphaApp.disorderBodyService
 * @description
 * # disorderBodyService
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('disorderBodyService', function($http) {
        var defaultBody = '<p>The incorporation of Orphanet summaries for diseases is ' +
        'currently under development. The summary below is for illustrative purposes.</p> ' +
        '<p>This disorder is a rare neurodegenerative disorder of the astrocytes comprised ' +
        'of two clinical forms: AxD Type I and Type II (see these terms) manifesting with' +
        'various degrees of macrocephaly, spasticity, ataxia and seizures and leading to ' +
        'psychomotor regression and death.</p><p>The prevalence is unknown. One population ' +
        'based study in Japan estimated an annual incidence of 1/ 2.7 million.</p><p>The ' +
        'clinical presentation depends on the subtype. Previously, AxD was classified ' +
        'either as infantile, juvenile or adult, based simply on age of onset. The currently ' +
        'used classification system is based on a constellation of clinical and radiologic ' +
        'features and includes AxD type I and AxD type II (see these terms). AxD type I is ' +
        'more likely to be of early onset (mean 1.74 years) and shorter survival (median 14 ' +
        'years) whereas type II exhibits onset throughout the lifespan (mean 21.64 years, ' +
        'but can occur in early childhood) and has longer survival (median 25 years).</p>';
        var service = {
            getBody: getBody
        };
        var bodies = {};
        $http.get('scripts/services/disorderbody.json').then(function(response) {
            angular.copy(response.data, bodies);    
        });
        return service;

        function getBody(disorder) {
            return bodies[disorder.title] || defaultBody;
        }
    });
