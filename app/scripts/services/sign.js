'use strict';

/**
 * @ngdoc service
 * @name orphaApp.sign
 * @description
 * # sign
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('Sign', function($resource, $http, ENV, Gene, RelationshipService, Disorder, $log, $q) {
        var Sign = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'clinical_sign',
            nid: '@nid'
        });
        Sign.prototype.loadDisorders = loadDisorders;
        Sign.prototype.loadChildren = loadChildren;
        return Sign;

        function loadChildren() {
            /* jshint validthis: true */
            var sign = this;
            var ids = _.pluck(sign['sign_child'], 'nid');
            // if(ids.length > 100) {
            //     ids = ids.slice(0, 100);
            // }
            var params = {};
            _.each(ids, function(id, i) {
                params['parameters[nid][' + i + ']'] = id;
            });
            if(ids.length === 0) {
                sign.sign_child = [];
                return $q.when([]);
            }
            if (ids.length) {
                return Sign.query(params).$promise.then(function(children) {
                    sign.sign_child = children;
                    return children;
                });
            }
            return $q.when([]);
        }

        function loadDisorders(onlyLoadSome) {
            var someAmount = 20;
            // $log.debug('some amount?', onlyLoadSome);
            /* jshint validthis: true */
            var sign = this;

            // Find all disorders that pount to this 

            var ids = _.pluck(sign['sign_dissign'], 'nid');
            if(ids.length === 0) {
                sign.disorders = [];
                sign.classifications = [];
                return $q.when([]);
            }
            if(ids.length > someAmount && onlyLoadSome) {
                ids = ids.slice(0, someAmount);
            }
            sign.disorders = [];
            return _loadDisorderSignHelper(sign, ids, 0).then(function(disorderSigns) {
                var disorderIds = [];
                _.each(disorderSigns, function(disorderSign) {
                    disorderIds.push(disorderSign['ds_disorder'].nid);
                });
                return _loadDisordersHelper(sign, disorderIds, 0).then(function(disorders) {
                    // sign.disorders = disorders;
                    var classifications = _.pluck(disorders, 'disorder_class');
                    sign.classifications = _.flatten(classifications);
                    // $log.debug('disorders loaded');
                    return disorders;
                });
            });
        }

        function _loadDisorderSignHelper(sign, ids, page) {
            // $log.debug('loading disorder sign helper', page);
            var params = {
                'parameters[type]': 'disorder_sign',
                fields: 'ds_disorder'
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
                var disorderSigns = response.data;
                sign.disorders = sign.disorders.concat(_.pluck(disorderSigns, 'ds_disorder'));
                if (disorderSigns.length === 20) {
                    return _loadDisorderSignHelper(sign, ids, page + 1).then(function(otherDisordersSigns) {
                        return disorderSigns.concat(otherDisordersSigns);
                    });
                }
                return disorderSigns;
            });
        }

        function _loadDisordersHelper(sign, ids, page) {
            if(ids.length === 0) {
                return $q.when([]);
            }
            var params = {};
            var paginatedIds = ids.slice(page * 20, page * 20 + 20);
            _.each(paginatedIds, function(id, i) {
                params['parameters[nid][' + i + ']'] = id;
            });
            if(paginatedIds.length === 0) {
                return $q.when([]);
            }
            return Disorder.query(params).$promise.then(function(disorders) {
                _.each(disorders, function(disorder) {
                    var stubDisorder = _.find(sign.disorders, {nid: disorder.nid});
                    angular.copy(disorder, stubDisorder);
                });
                // sign.disorders = sign.disorders.concat(disorders);
                if (disorders.length === 20) {
                    return _loadDisordersHelper(sign, ids, page + 1).then(function(otherDisorders) {
                        return disorders.concat(otherDisorders);
                    });
                }
                return disorders;
            });
        }
    });
