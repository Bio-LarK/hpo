'use strict';

angular.module('orphaApp')
    .filter('inSlicesOf', ['$rootScope',
        function ($rootScope) {
            var makeSlices = function (items, count) {
                if (!count) {
                    count = 3;
                }

                if (!angular.isArray(items) && !angular.isString(items)) {
                    return items;
                }

                var array = [];
                for (var i = 0; i < items.length; i++) {
                    var chunkIndex = parseInt(i / count, 10);
                    var isFirst = (i % count === 0);
                    if (isFirst) {
                        array[chunkIndex] = [];
                    }
                    array[chunkIndex].push(items[i]);
                }

                $rootScope.arraysinSliceOf = $rootScope.arraysinSliceOf || [];

                var temp = null;
                angular.forEach($rootScope.arraysinSliceOf, function (arrayInSliceOf) {
                    if (angular.equals(arrayInSliceOf, array)) {
                        temp = arrayInSliceOf;
                    }
                });
                if (temp) {
                    return temp;
                }
                $rootScope.arraysinSliceOf.push(array);
                return array;
            };

            return makeSlices;
        }
    ]);