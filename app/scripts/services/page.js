'use strict';

/**
 * @ngdoc service
 * @name orphaApp.Page
 * @description
 * # Page
 * Service in the orphaApp.
 */
angular.module('orphaApp')
    .factory('Page', function Page() {
        var page = {
            title: null,
            setTitle: setTitle,
        };
        return page;

        ////////////

        function setTitle(newTitle) {
            page.title = newTitle + ' - Orphanet';
        }
    });