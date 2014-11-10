'use strict';

/**
 * @ngdoc service
 * @name orphaApp.gene
 * @description
 * # gene
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('Gene', function ($resource, ENV, $log, $q, $http, Disorder) {
        var Gene = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'gene',
            nid: '@nid'
        });
        Gene.prototype.loadDisorders = loadDisorders;
        return Gene;

        function loadDisorders(onlyLoadSome) {
            var someAmount = 20;
            // $log.debug('some amount?', onlyLoadSome);
            /* jshint validthis: true */
            var gene = this;

            // Find all disorders that pount to this 

            var ids = _.pluck(gene['gene_disgene'], 'nid');
            // $log.debug('ids', ids);
            if(ids.length === 0) {
                gene.classifications = [];
                return $q.when([]);
            }
            if(ids.length > someAmount && onlyLoadSome) {
                ids = ids.slice(0, someAmount);
            }
            gene['gene_disgene'] = [];
            return _loadDisorderGeneHelper(gene, ids, 0).then(function(disorderGenes) {
            	gene['gene_disgene'] = disorderGenes;

                var disorderIds = [];
                _.each(disorderGenes, function(disorderGene) {
                    disorderIds.push(disorderGene['disgene_disorder'].nid);
                });
                return _loadDisordersHelper(gene, disorderIds, 0).then(function(disorders) {
                    // sign.disorders = disorders;
                    var classifications = _.pluck(disorders, 'disorder_class');
                    gene.classifications = _.flatten(classifications);
                    return disorders;
                });
            });
        }

        function _loadDisorderGeneHelper(gene, ids, page) {
            // $log.debug('loading disorder gene helper', page);
            var params = {
                'parameters[type]': 'disorder_gene'
            };
            var paginatedIds = ids.slice(page * 20, page * 20 + 20);
            _.each(paginatedIds, function(id, i) {
                params['parameters[nid][' + i + ']'] = id;
            });
            if(paginatedIds.length === 0) {
                return $q.when([]);
            }
            return $http.get(ENV.apiEndpoint + '/entity_node', {
                params: params,
                cache: true
            }).then(function(response) {
                var disorderGenes = response.data;
                if (disorderGenes.length === 20) {
                    return _loadDisorderGeneHelper(gene, ids, page + 1).then(function(otherDisordersGenes) {
                        return disorderGenes.concat(otherDisordersGenes);
                    });
                }
                return disorderGenes;
            });
        }

        function _loadDisordersHelper(gene, ids, page) {
            if(ids.length === 0) {
                return $q.when([]);
            }
            var params = {
            	'fields': 'nid,title,disorder_class,body'
            };
            var paginatedIds = ids.slice(page * 20, page * 20 + 20);
            _.each(paginatedIds, function(id, i) {
                params['parameters[nid][' + i + ']'] = id;
            });
            if(paginatedIds.length === 0) {
                return $q.when([]);
            }
            return Disorder.query(params).$promise.then(function(disorders) {
                _.each(disorders, function(disorder) {
                	_.each(gene['gene_disgene'], function(disorderGene) {
                		if(disorderGene['disgene_disorder'].nid === disorder.nid) {
                			angular.copy(disorder, disorderGene['disgene_disorder']);
                		}
                	});
                });
                // sign.disorders = sign.disorders.concat(disorders);
                if (disorders.length === 20) {
                    return _loadDisordersHelper(gene, ids, page + 1).then(function(otherDisorders) {
                        return disorders.concat(otherDisorders);
                    });
                }
                return disorders;
            });
        }
    });
