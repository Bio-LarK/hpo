'use strict';

/**
 * @ngdoc service
 * @name hpoApp.listtransactionunlimited
 * @description
 * # listtransactionunlimited
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
  .factory('ListTransactionUnlimited', function ($resource, ENV) {
      var ListTransactionUnlimited = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'list_transaction_unlimited',
            nid: '@nid'
        });
        return ListTransactionUnlimited;
  });
