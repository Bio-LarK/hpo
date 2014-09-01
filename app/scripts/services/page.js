'use strict';

/**
 * @ngdoc service
 * @name hpoApp.Page
 * @description
 * # Page
 * Factory in the hpoApp.
 */
angular.module('hpoApp')
    .factory('pageService', function () {
        var page = {
            title: null,
            setTitle: setTitle,
        };
        return page;

        ////////////

        function setTitle(newTitle) {
            page.title = newTitle + ' - HPO';
        }
    });