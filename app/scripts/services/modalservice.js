'use strict';

/**
 * @ngdoc service
 * @name orphaApp.modalService
 * @description
 * # modalService
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('modalService', function($modal) {
        var service = {
            openPrevalenceClassModal: openPrevalenceClassModal,
            openAgeOfOnset: openAgeOfOnset,
            openAgeOfDeath: openAgeOfDeath,
            openEditTitle: openEditTitle,
            openEditDescription: openEditDescription
        };
        return service;

        ///////

        function openEditTitle(concept) {   
            var config = {
                concept: concept,
                propertyName: 'title',
                propertyLabel: 'Disorder Name'
            };

            return $modal.open({
                templateUrl: 'views/edittitle.modal.html',
                controller: 'EditTitleCtrl as vm',
                resolve: {
                    config: function() {
                        return config;
                    }

                }
            });
        }

        function openEditDescription(concept) {   
            var config = {
                concept: concept,
                propertyName: 'body',
                propertyLabel: 'Description'
            };

            return $modal.open({
                templateUrl: 'views/editbody.modal.html',
                controller: 'EditTitleCtrl as vm',
                resolve: {
                    config: function() {
                        return config;
                    }

                }
            });
        }


        function openPrevalenceClassModal(concept) {
            return openPropertyModal(
                concept,
                'Prevalence Class',
                'disorder_prevalence',
                'prevalence_class'
            );
        }

        function openAgeOfOnset(concept) {
            return openPropertyModal(
                concept,
                'Age of Onset',
                'disorder_onset',
                'age_of_onset'
            );
        }

        function openAgeOfDeath(concept) {
            return openPropertyModal(
                concept,
                'Age of Death',
                'disorder_death',
                'age_of_death'
            );
        }

        function openTOI(concept) {
            return openPropertyModal(
                concept,
                'Type of Inheritance',
                'disorder_inhertiance',
                'type_of_inheritance'
            );
        }


        function openPropertyModal(concept, propertyLabel, propertyName, propertyContentType) {
            var config = {
                concept: concept,
                propertyLabel: propertyLabel,
                propertyName: propertyName,
                propertyContentType: propertyContentType
            };
            return $modal.open({
                templateUrl: 'views/edit.modal.html',
                controller: 'EditModalCtrl as editVm',
                resolve: {
                    config: function() {
                        return config;
                    }

                }
            });
        }
    });
