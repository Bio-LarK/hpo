'use strict';

/**
 * @ngdoc service
 * @name hpoApp.Phenotype
 * @description
 * # Phenotype
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
    .factory('Phenotype', function ($resource, $q, $http, ENV, Synonym) {
        console.log('ENV', ENV);
        var Phenotype = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'hpo_concept',
            nid: '@nid'
        }, {
            get: {
                method: 'GET',
                transformResponse: $http.defaults.transformResponse.concat([
                    transformerGetResponse
                ])
            }
        });
        Phenotype.prototype.getParents = getParents;
        return Phenotype;

        ////////////

        function transformerGetResponse(phenotype, headersGetter) {
            phenotype.body = 'An HPO summary for this concept is currently under development.';
            // Convert parents to Disorder objects
            phenotype['concept_parent'] = _.map(phenotype['concept_parent'], function (parent) {
                return new Phenotype(parent);
            });
            phenotype['concept_synonym'] = _.map(phenotype['concept_synonym'], function (synonym) {
                return new Synonym(synonym);
            });
            return phenotype;
        }

        function getParents() {
            /* jshint validthis: true */
            var phenotype = this;
            var ids = _.map(this['concept_parent'], function (parent) {
                return parent.id || parent.nid;
            });
            if (!ids || !ids.length) {
                return $q.when([]);
            }

            var request = _.indexBy(ids, function (ids, index) {
                return 'parameters[nid][' + index + ']';
            });
            request.fields = ['nid', 'concept_label', 'concept_parent'].join(',');

            return Phenotype.query(request).$promise.then(function (phenotypes) {
                phenotype['concept_parent'] = phenotypes;
                // console.log('got phenotypes', phenotypes);
            });
        }
    });