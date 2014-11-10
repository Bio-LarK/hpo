'use strict';

/**
 * @ngdoc service
 * @name orphaApp.paramService
 * @description
 * # paramService
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
  .factory('paramService', function () {
    var service = {
      toQuery: toQuery
    };
    return service;

    function toQuery() {

    }
  });
