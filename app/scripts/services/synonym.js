'use strict';

/**
 * @ngdoc service
 * @name hpoApp.synonym
 * @description
 * # synonym
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
    .factory('Synonym', function ($resource, ENV, $http, $log) {
        console.log('ENV', ENV);
        var Synonym = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'hpo_synonym',
            nid: '@nid'
        });
        Synonym.prototype.loadType = loadType;
        return Synonym;

        ////////////

        function loadType() {
             /* jshint validthis: true */
            var synonym = this;
            $log.debug('synonymn', synonym);
            return $http.get(ENV.apiEndpoint + '/entity_node/' + synonym['synonym_type'].id).then(function (response) {
                synonym['synonym_type'] = response.data;
                return synonym;
            });
        }
        // function getParents() {
        //     // Get all the parent ids
        //     var phenotype = this;
        //     var ids = _.pluck(phenotype['concept_parent'])
        //     var ids = _.map(this['disorder_parent'], function (parent) {
        //         return parent.id || parent.nid;
        //     });
        //     if (!ids.length) {
        //         return $q.when(null);
        //     }

        //     // var ids = _.pluck(this['disorder_parent'], 'id');
        //     var request = _.indexBy(ids, function (ids, index) {
        //         return 'parameters[nid][' + index + ']';
        //     });
        //     request.fields = ['nid', 'disorder_name', 'disorder_parent'].join(',');

        //     return $http.get('http://130.56.248.140/orphanet/api/entity_node', {
        //         params: request
        //     }).then(function (response) {
        //         that['disorder_parent'] = _.map(response.data, function (disorder) {
        //             return new Disorder(disorder);
        //         });
        //         return that['disorder_parent'];
        //     });

        // }

    });