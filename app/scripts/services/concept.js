'use strict';

/**
 * @ngdoc service
 * @name orphaApp.concept
 * @description
 * # concept
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('Concept', function (Restangular) {

        var Concept = Restangular.service('entity_node');
        // Service logic
        // ...
        // var Concept = function (attrs) {
        //     var self = this;
        //     var initialSettings = attrs || {};
        //     //initial settings if passed in
        //     for (var setting in initialSettings) {
        //         if (initialSettings.hasOwnProperty(setting)) {
        //             self[setting] = initialSettings[setting];
        //         }
        //     }

        //     //with some logic...
        //     self.fullName = function () {
        //         return self.first + ' ' + self.last;
        //     };
        //     //return the scope-safe instance
        //     return self;
        // };

        // Concept.one = function () {
        //     return new Concept({
        //         'vid': '22458',
        //         'uid': '1',
        //         'title': 'Multiple epiphyseal dysplasia, Al-Gazali type',
        //         'log': '',
        //         'status': '1',
        //         'comment': '0',
        //         'promote': '0',
        //         'sticky': '0',
        //         'nid': '22458',
        //         'type': 'disorder',
        //         'language': 'und',
        //         'created': '1407108736',
        //         'changed': '1407108736',
        //         'tnid': '0',
        //         'translate': '0',
        //         'revision_timestamp': '1407108736',
        //         'revision_uid': '1',
        //         'body': [],
        //         'field_disorder_orphaid': {
        //             'und': [{
        //                 'value': '17601',
        //                 'format': null,
        //                 'safe_value': '17601'
        //             }]
        //         },
        //         'field_disorder_orphanumber': {
        //             'und': [{
        //                 'value': '166024',
        //                 'format': null,
        //                 'safe_value': '166024'
        //             }]
        //         },
        //         'field_disorder_name': {
        //             'und': [{
        //                 'value': 'Multiple epiphyseal dysplasia, Al-Gazali type',
        //                 'format': null,
        //                 'safe_value': 'Multiple epiphyseal dysplasia, Al-Gazali type'
        //             }]
        //         },
        //         'field_disorder_synonym': {
        //             'und': [{
        //                 'value': 'Multiple epiphyseal dysplasia - macrocephaly - distinctive facies',
        //                 'format': null,
        //                 'safe_value': 'Multiple epiphyseal dysplasia - macrocephaly - distinctive facies'
        //             }]
        //         },
        //         'field_disorder_er': {
        //             'und': [{
        //                 'target_id': '22455'
        //             }, {
        //                 'target_id': '22456'
        //             }]
        //         },
        //         'field_disorder_disgene': {
        //             'und': [{
        //                 'target_id': '57420'
        //             }]
        //         },
        //         'field_disorder_expert': {
        //             'und': [{
        //                 'target_id': '22457'
        //             }]
        //         },
        //         'field_disorder_onset': {
        //             'und': [{
        //                 'target_id': '57388'
        //             }]
        //         },
        //         'field_disorder_death': [],
        //         'field_disorder_prevalence': {
        //             'und': [{
        //                 'target_id': '57387'
        //             }]
        //         },
        //         'field_disorder_inheritance': {
        //             'und': [{
        //                 'target_id': '57389'
        //             }]
        //         },
        //         'field_disorder_parent': [],
        //         'field_disorder_child': [],
        //         'field_disorder_phenotype': {
        //             'und': [{
        //                 'target_id': '63303'
        //             }, {
        //                 'target_id': '63304'
        //             }, {
        //                 'target_id': '63305'
        //             }, {
        //                 'target_id': '63306'
        //             }, {
        //                 'target_id': '63307'
        //             }, {
        //                 'target_id': '63308'
        //             }, {
        //                 'target_id': '63309'
        //             }, {
        //                 'target_id': '63310'
        //             }, {
        //                 'target_id': '63311'
        //             }, {
        //                 'target_id': '63312'
        //             }, {
        //                 'target_id': '63313'
        //             }, {
        //                 'target_id': '63314'
        //             }, {
        //                 'target_id': '63315'
        //             }, {
        //                 'target_id': '63316'
        //             }, {
        //                 'target_id': '63317'
        //             }, {
        //                 'target_id': '63319'
        //             }, {
        //                 'target_id': '63320'
        //             }, {
        //                 'target_id': '63321'
        //             }]
        //         },
        //         'rdf_mapping': {
        //             'rdftype': ['sioc:Item', 'foaf:Document'],
        //             'title': {
        //                 'predicates': ['dc:title']
        //             },
        //             'created': {
        //                 'predicates': ['dc:date', 'dc:created'],
        //                 'datatype': 'xsd:dateTime',
        //                 'callback': 'date_iso8601'
        //             },
        //             'changed': {
        //                 'predicates': ['dc:modified'],
        //                 'datatype': 'xsd:dateTime',
        //                 'callback': 'date_iso8601'
        //             },
        //             'body': {
        //                 'predicates': ['content:encoded']
        //             },
        //             'uid': {
        //                 'predicates': ['sioc:has_creator'],
        //                 'type': 'rel'
        //             },
        //             'name': {
        //                 'predicates': ['foaf:name']
        //             },
        //             'comment_count': {
        //                 'predicates': ['sioc:num_replies'],
        //                 'datatype': 'xsd:integer'
        //             },
        //             'last_activity': {
        //                 'predicates': ['sioc:last_activity_date'],
        //                 'datatype': 'xsd:dateTime',
        //                 'callback': 'date_iso8601'
        //             }
        //         },
        //         'cid': 0,
        //         'last_comment_timestamp': '1407108736',
        //         'last_comment_name': '',
        //         'last_comment_uid': '1',
        //         'comment_count': 0,
        //         'name': 'orphanet',
        //         'picture': '0',
        //         'data': 'b:0;',
        //         'path': 'http://130.56.248.140/orphanet/node/22458'
        //     });
        // };

        // var Concept = Restangular.service('concepts');
        return Concept;
    });