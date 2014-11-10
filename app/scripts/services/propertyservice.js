'use strict';

/**
 * @ngdoc service
 * @name orphaApp.propertyService
 * @description
 * # propertyService
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
  .factory('propertyService', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
