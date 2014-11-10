'use strict';

/**
 * @ngdoc service
 * @name orphaApp.disorderRepo
 * @description
 * # disorderRepo
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
  .factory('disorderRepo', function () {
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
