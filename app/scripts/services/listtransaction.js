'use strict';

/**
 * @ngdoc service
 * @name orphaApp.ListTransaction
 * @description
 * # ListTransaction
 * Factory in the orphaApp.
 */
angular.module('hpoApp')
    .factory('ListTransaction', function($resource, ENV, $http, $q, $state, $log) {
        var ListTransaction = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'list_transaction',
            nid: '@nid'
        });
        ListTransaction.prototype.loadReferences = loadReferences;
        ListTransaction.prototype.getOnNode = getOnNode;
        return ListTransaction;

        ////

        function loadReferences() {
        	/* jshint validthis: true */
            var listTransaction = this;
            listTransaction.title = 'Loading...';
            if(listTransaction['ltrans_svalref']) {
                listTransaction.isRefChange = true;
            } else {
                listTransaction.isRefChange = false;
            }

            return $q.all([
            	loadNode(listTransaction),
            	loadSuggestedRef(listTransaction),
            	loadCurrentRef(listTransaction)
        	]).then(function() {

                // setup up the description of the change
                if(listTransaction['ltrans_ctype'] === 'add') {
                    var url = $state.href('phenotype', {phenotypeId: listTransaction['ltrans_svalref'].nid});
                    listTransaction.description = 'Add <strong>' + listTransaction['ltrans_onprop'] + 
                    '</strong>: <a href="' + url + '">' + listTransaction['ltrans_svalref'].title + '</a>';
                } else if(listTransaction['ltrans_ctype'] === 'remove') {
                    var url2 = $state.href('phenotype', {phenotypeId: listTransaction['ltrans_svalref'].nid});
                    listTransaction.description = 'Remove <strong>' + listTransaction['ltrans_onprop'] + 
                    '</strong>: <a href="' + url2 + '">' + listTransaction['ltrans_svalref'].title + '</a>';
                } else {
                    if(listTransaction['ltrans_svalref']) {
                        $log.debug('on prop', listTransaction['ltrans_svalref']);
                        listTransaction.description = 'Change <strong>' + listTransaction['ltrans_onprop'] + 
                        '</strong>: ' + listTransaction['ltrans_cvalref'].title + ' to ' + 
                        listTransaction['ltrans_svalref'].title;
                    } else if(listTransaction['ltrans_svalplain']) {
                        $log.debug('on prop', listTransaction['ltrans_svalplain']);
                    listTransaction.description = 'Change <strong>' + listTransaction['ltrans_onprop'] + 
                    '</strong>:<br/>' + listTransaction['ltrans_cvalplain'] + 
                    '<br/><i class="fa fa-arrow-down"></i><br/>' + 
                    listTransaction['ltrans_svalplain'];
                    } else {
                        $log.error('List transactions not working');
                    }
                    
                }

          //       listTransaction.title = listTransaction['ltrans_onnode'].title;

          //       listTransaction.relatedNodes = [
          //           listTransaction['ltrans_onnode']
          //       ];

        		// // Create the title
        		// if(listTransaction['ltrans_onnode'].type === 'disorder_gene') {
        		// 	listTransaction.title = 'Relationship between ' + 
        		// 	listTransaction['ltrans_onnode']['disgene_disorder'].title + ' and ' + 
        		// 	listTransaction['ltrans_onnode']['disgene_gene'].title;

          //           listTransaction.relatedNodes = [
          //               listTransaction['ltrans_onnode']['disgene_disorder'],
          //               listTransaction['ltrans_onnode']['disgene_gene']
          //           ];
        		// } else if(listTransaction['ltrans_onnode'].type === 'disorder_sign') {
          //           listTransaction.title = 'Relationship between ' + 
          //           listTransaction['ltrans_onnode']['ds_disorder'].title + ' and ' + 
          //           listTransaction['ltrans_onnode']['ds_sign'].title;

          //           listTransaction.relatedNodes = [
          //               listTransaction['ltrans_onnode']['ds_disorder'],
          //               listTransaction['ltrans_onnode']['ds_sign']
          //           ];
          //       }
                return listTransaction;
        	});
            
        }

        function loadNode(listTransaction) {
        	var nodeId = listTransaction['ltrans_onnode'];
            var nodeRequest = {
                fields: 'nid,title,type,disgene_disorder,disgene_gene,ds_sign,ds_disorder'
            };
            return $http.get(ENV.apiEndpoint + '/entity_node/' + nodeId, {
                params: nodeRequest
            }).then(function(response) {
            	listTransaction['ltrans_onnode'] = response.data;
            });
        }

        function loadSuggestedRef(listTransaction) {
        	var nodeId = listTransaction['ltrans_svalref'];
            if(!nodeId) {
                return $q.when(false);
            }
            var nodeRequest = {
                fields: 'nid,title'
            };
            return $http.get(ENV.apiEndpoint + '/entity_node/' + nodeId, {
                params: nodeRequest
            }).then(function(response) {
            	listTransaction['ltrans_svalref'] = response.data;
            });
        }

        function loadCurrentRef(listTransaction) {
        	var nodeId = listTransaction['ltrans_cvalref'];
            if(!nodeId) {
                return $q.when(false);
            }
            var nodeRequest = {
                fields: 'nid,title'
            };
            return $http.get(ENV.apiEndpoint + '/entity_node/' + nodeId, {
                params: nodeRequest
            }).then(function(response) {
            	listTransaction['ltrans_cvalref'] = response.data;
            });
        }

        function getOnNode() {
            /* jshint validthis: true */
            return this['ltrans_onnode'];
        }

    });
