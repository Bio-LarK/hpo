'use strict';

/**
 * @ngdoc service
 * @name orphaApp.modalService
 * @description
 * # modalService
 * Factory in the orphaApp.
 */
angular.module('hpoApp')
    .factory('modalService', function($modal) {
        var service = {
            openPrevalenceClassModal: openPrevalenceClassModal,
            openAgeOfOnset: openAgeOfOnset,
            openAgeOfDeath: openAgeOfDeath,
            openEditTitle: openEditTitle,
            openEditDescription: openEditDescription,
            openEditClassification: openEditClassification,
            openEditChildren: openEditChildren,
            openEditSynonym: openEditSynonym
        };
        return service;

        ///////

        function openEditSynonym(phenotype, synonym) {
            var config = {
                synonym: synonym,
                phenotype: phenotype
            };

            return $modal.open({
                templateUrl: 'views/editsynonym.modal.html',
                controller: 'EditSynonymCtrl as vm',
                resolve: {
                    config: function() {
                        return config;
                    }

                }
            });
        }
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

        function openEditChildren(concept) {
            var config = {
                concept: concept,
                infoMessage: 'Add or remove children from ' + concept.title,
                propertyName: 'concept_child',
                transactionRequestTitle: concept.title + ' - Update Children'
            };

            return $modal.open({
                templateUrl: 'views/editclassification.modal.html',
                controller: 'EditChildrenCtrl as vm',
                resolve: {
                    config: function() {
                        return config;
                    }

                }
            });
        }

        function openEditClassification(concept) {   

            var config = {
                concept: concept,
                infoMessage: 'Add or remove parent from ' + concept.title,
                propertyName: 'concept_parent',
                transactionRequestTitle: concept.title + ' - Update Parent Hierarchy'
            };

            return $modal.open({
                templateUrl: 'views/editclassification.modal.html',
                controller: 'EditChildrenCtrl as vm',
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