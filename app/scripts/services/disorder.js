'use strict';

/**
 * @ngdoc service
 * @name orphaApp.disorder
 * @description
 * # disorder
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('Disorder', function($resource, $http, $q, RelationshipService, ENV, $log,
        Classification, disorderBodyService) {
        var Disorder = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'disorder',
            nid: '@nid'
        }, {
            get: {
                method: 'GET',
                cache: true,
                transformResponse: $http.defaults.transformResponse.concat([
                    transformGetResponse
                ])
            },
            query: {
                method: 'GET',
                isArray: true,
                cache: true,
                transformResponse: $http.defaults.transformResponse.concat([
                    transformQueryResponse
                ])
            },
        });
        Disorder.prototype.getGenes = getGenes;
        Disorder.prototype.getSigns = getSigns;
        Disorder.prototype.getParents = getParents;
        Disorder.prototype.loadChildren = loadChildren;
        Disorder.prototype.loadParents = loadParents;
        Disorder.prototype.loadExternalIdentifiers = loadExternalIdentifiers;

        Disorder.getFromSign = getFromSign;
        Disorder.getFromGene = getFromGene;
        Disorder.getParentsFromDisorderInClassification = getParentsFromDisorderInClassification;
        Disorder.getRoots = getRoots;
        Disorder.getRootForClassification = getRootForClassification;
        return Disorder;

        ///////////////////

        function transformQueryResponse(transactionRequests, headersGetter) {
            if(transactionRequests.length && transactionRequests[0] === 'No entities found.') {
                return transactionRequests;
            }

            // $log.debug('request length', transactionRequests.length, headersGetter());
            _.each(transactionRequests, function(transactionRequest) {
                transformGetResponse(transactionRequest);
            });
            return transactionRequests;
        }

        function transformGetResponse(disorder, headersGetter) {
            // Convert parents to Disorder objects

            disorder['disorder_parent'] = _.sortBy(disorder['disorder_parent'], 'nid');
            disorder['disorder_parent'] = _.map(disorder.disorder_parent, function(parent) {
                return new Disorder(parent);
            });
            disorder['disorder_child'] = _.sortBy(disorder['disorder_child'], 'nid');
            disorder['disorder_child'] = _.map(disorder.disorder_child, function(child) {
                // // $log.debug('wrapping children');
                return new Disorder(child);
            });
            disorder['disorder_class'] = _.map(disorder.disorder_class, function(classification) {
                return new Classification(classification);
            });
            disorder.isOpenable = true;
            disorder.body = disorderBodyService.getBody(disorder);
            // Add in shorthand for inheritance
            _.each(disorder['disorder_inheritance'], function(disorderInheritance) {
                if (disorderInheritance['toi_name'] === 'Autosomal dominant') {
                    disorderInheritance.label = 'AD';
                } else if (disorderInheritance['toi_name'] === 'Autosomal recessive') {
                    disorderInheritance.label = 'AR';
                } else {
                    disorderInheritance.label = disorderInheritance['toi_name'];
                }
            });
            return disorder;
        }


        function getGenes() {
            /* jshint validthis: true */
            var disorder = this;
            // Get the gene ids
            var fields = ['disgene_as', 'disgene_at', 'disgene_gene'];
            return RelationshipService.getRelatedThroughIntermediary(disorder, 'disorder_disgene', fields);
        }

        function getSigns() {
            /* jshint validthis: true */
            var disorder = this;
            // Get the gene ids
            var fields = ['ds_sign', 'ds_frequency'];
            return RelationshipService.getRelatedThroughIntermediary(disorder, 'disorder_phenotype', fields);
        }

        function getParentsFromDisorderInClassification(disorder, classification) {
            // Get all the parent ids
            var ids = _.map(disorder['disorder_parent'], function(parent) {
                return parent.id || parent.nid;
            });

            // // $log.debug('GETTING PARENTS', ids);
            if (!ids.length) {
                return $q.when([]);
            }
            var request = _.indexBy(ids, function(ids, index) {
                return 'parameters[nid][' + index + ']';
            });
            if (classification) {
                request['parameters[disorder_class]'] = classification.nid;
            }
            request.fields = ['nid', 'disorder_name', 'title', 'disorder_parent', 'disorder_class'].join(',');
            return Disorder.query(request).$promise;
        }


        function getParents(classification) {

            /* jshint validthis: true */
            var disorder = this;

            return Disorder.getParentsFromDisorderInClassification(disorder, classification).then(function(parents) {
                // Load the children for the parents
                var promises = _.map(parents, function(parent) {
                    // // $log.debug('loading children for parents', parent.title);
                    return parent.loadChildren().then(function(children) {
                        // // $log.debug('loaded children for parent', parent.title, children);
                        var index = _.findIndex(parent['disorder_child'], function(child) {
                            // // $log.debug('finding match', child, child.nid, disorder.nid);
                            return child.nid === disorder.nid;
                        });
                        // // $log.debug('index of child in parent', index);
                        parent['disorder_child'].splice(index, 1);
                        parent['disorder_child'].unshift(disorder);
                        return parent;
                    }, function() {
                        return parent;
                    });
                    // parent.hasLoadedChildren = true;
                    // parent.disorder_child = [disorder];
                    // return parent;
                });
                // // $log.debug('returning promises');
                return $q.all(promises);
            }, function() {
                // // $log.debug('no parents found');
                return [];
            });
        }

        function loadParents() {
            /* jshint validthis: true */
            var disorder = this;
            return Disorder.getParentsFromDisorderInClassification(disorder).then(function(parents) {
                disorder['disorder_parent'] = parents;
                return parents;
            });
        }


        function loadChildren(classification) {
            // // $log.debug('loading children now...');
            /* jshint validthis: true */
            var disorder = this;
            if (disorder.hasLoadedChildren) {
                return $q.when(disorder['disorder_child']);
            }
            return _loadChildrenHelper(disorder, classification, 0).then(function(children) {
                disorder.hasLoadedChildren = true;
                disorder['disorder_child'] = _.sortBy(children, 'nid');
                _markIsDisorderGroup(disorder, disorder['disorder_child']);
                return children;
            });
        }

        function _loadChildrenHelper(disorder, classification, page) {
            var request = {
                fields: 'nid,title,disorder_name,disorder_child,disorder_class',
                'parameters[disorder_parent]': disorder.nid,
                page: page
            };
            if(classification) {
                request['parameters[disorder_class]'] = classification.nid;
            }
            return Disorder.query(request).$promise.then(function(children) {
                if (children.length !== 20) {
                    return children;
                }
                // we need to get more!
                return _loadChildrenHelper(disorder, classification, ++page).then(function(otherChildren) {
                    return children.concat(otherChildren);
                });
            }, function() {
                return [];
            });
        }

        function _markIsDisorderGroup(disorder, children) {
            var isOpenable = false;
            _.each(children, function(child) {
                isOpenable = isOpenable || child['disorder_child'].length;
                _.each(child['disorder_child'], function(grandChild) {
                    grandChild.isOpenable = true;
                });
            });
            disorder.isOpenable = isOpenable;
        }

        function loadExternalIdentifiers() {
            /* jshint validthis: true */
            var disorder = this;
            // // $log.debug('ers', disorder['disorder_er']);

            if (!disorder['disorder_er'].length) {
                return [];
            }
            var request = _.reduce(disorder['disorder_er'], function(request, er, key) {
                request['parameters[nid][' + key + ']'] = er.nid;
                return request;
            }, {});
            request.type = 'external_reference';
            request.hello = 'world';

            return $http.get(ENV.apiEndpoint + '/entity_node', {
                params: request
            }).then(function(response) {
                disorder['disorder_er'] = response.data;
                return response.data;
            });
        }

        function getFromSign(signId) {
            return $http.get(ENV.apiEndpoint + '/entity_node/' +
                signId + '/nodes_field_ds_sign?fields=ds_disorder').then(function(response) {
                var disorderSigns = response.data;
                var ids = [];
                _.each(disorderSigns, function(disorderSign) {
                    ids.push(disorderSign.ds_disorder.nid);
                });
                ids = _.uniq(ids);
                // // $log.debug('ids', ids);
                var disorders = _.map(response.data, function(dsSign) {
                    return new Disorder(dsSign['ds_disorder']);
                });
                return disorders;
            });
        }

        function getFromGene(geneId) {
            return $http.get(ENV.apiEndpoint + '/entity_node/' +
                geneId + '/nodes_field_disgene_gene?fields=disgene_disorder').then(function(response) {

                var request = _.reduce(response.data, function(request, disgeneGene, key) {
                    request['parameters[nid][' + key + ']'] = disgeneGene['disgene_disorder'].nid;
                    return request;
                }, {});

                return Disorder.query(request).$promise.then(function(disorders) {
                    return disorders;
                });

            });
        }

        function getRoots() {
            var fields = 'nid,title,disorder_name,disorder_class';
            var page1 = Disorder.query({
                'parameters[disorder_root]': 1,
                'fields': fields,
                'page': 0
            }).$promise;

            var page2 = Disorder.query({
                'parameters[disorder_root]': 1,
                'fields': fields,
                'page': 1
            }).$promise;

            return $q.all([page1, page2]).then(function(disorders) {
                return _.flatten(disorders);
            });
        }

        function getRootForClassification(classification) {
            return Disorder.query({
                'parameters[disorder_root]': 1,
                'parameters[disorder_class]': classification.nid,
            }).$promise.then(function(disorders) {
                if (!disorders.length) {
                    return null;
                }
                return disorders[0];
            });
        }
    });

/*
    http://130.56.248.140/orphanet/api/entity_node?parameters[nid][0]=115025&pa…&parameters[nid][8]=115274&parameters[nid][9]=115260&parameters[type]=sign
     */
