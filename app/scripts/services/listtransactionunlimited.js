'use strict';

/**
 * @ngdoc service
 * @name hpoApp.listtransactionunlimited
 * @description
 * # listtransactionunlimited
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
  .factory('ListTransactionUnlimited', function ($resource, ENV, $q, $state) {
      var ListTransactionUnlimited = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'list_transaction_unlimited',
            nid: '@nid'
        });
        ListTransactionUnlimited.prototype.loadReferences = loadReferences;
        ListTransactionUnlimited.prototype.getOnNode = getOnNode;
        return ListTransactionUnlimited;

        function loadReferences() {
        	var url = $state.href('phenotypes');
        	/* jshint validthis: true */
        	this.test = '<b>This is a test</b><a href="' + url + '">hello world</a>';
        	return $q.when(this);
        }

        function getOnNode() {
        	/* jshint validthis: true */
        	return this['ltransu_onnode'];
        }
  });
