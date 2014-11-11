'use strict';

/**
 * @ngdoc service
 * @name orphaApp.Classification
 * @description
 * # Classification
 * Factory in the orphaApp.
 */
angular.module('orphaApp')
    .factory('Classification', function($resource, $q, ENV, $log) {
        var colors = {};

        var classificationMetadata = [{
            'title': 'Abnormality of the genitourinary system'
        }, {
            'title': 'Abnormality of head and neck'
        }, {
            'title': 'Abnormality of the eye'
        }, {
            'title': 'Abnormality of the ear'
        }, {
            'title': 'Abnormality of the nervous system'
        }, {
            'title': 'Abnormality of the breast'
        }, {
            'title': 'Abnormality of the endocrine system'
        }, {
            'title': 'Abnormality of the skeletal system'
        }, {
            'title': 'Abnormality of prenatal development or birth'
        }, {
            'title': 'Abnormality of the abdomen'
        }, {
            'title': 'Growth abnormality'
        }, {
            'title': 'Abnormality of the integument'
        }, {
            'title': 'Abnormality of the voice'
        }, {
            'title': 'Abnormality of the cardiovascular system'
        }, {
            'title': 'Abnormality of blood and blood-forming tissues'
        }, {
            'title': 'Abnormality of metabolism/homeostasis'
        }, {
            'title': 'Abnormality of the respiratory system'
        }, {
            'title': 'Neoplasm'
        }, {
            'title': 'Abnormality of the immune system'
        }, {
            'title': 'Abnormality of the musculature'
        }, {
            'title': 'Abnormality of connective tissue'
        }];

        _.each(classificationMetadata, function(classification, i) {
            var hue = (320 / classificationMetadata.length) * i;
            var sat = 70;
            var lightness = 70;
            classification.color = 'hsla(' + hue + ', ' + sat + '%, ' + lightness + '%, 1)';
        });

        var Classification = $resource(ENV.apiEndpoint + '/entity_node/:nid', {
            'parameters[type]': 'disorder_classification',
            nid: '@nid'
        });
        Classification.getAll = getAll;
        Classification.getColorForClassificationName = getColorForClassificationName;
        Classification.getPositionForClassificationName = getPositionForClassificationName;
        Classification.getMetadata = getMetadata;
        Classification.prototype.getColor = getColor;
        return Classification;

        function getAll() {
            return $q.all([Classification.query({
                page: 0
            }).$promise, Classification.query({
                page: 1
            }).$promise]).then(function(results) {
                var classifications = _.flatten(results);
                _.each(classifications, function(classification) {
                    var metadata = _findClassificationMetadata(classification.title);
                    if (metadata) {
                        // classification.disorderCount = metadata.count;
                        classification.color = metadata.color;
                    }
                });
                return classifications;
            });
        }

        function getMetadata() {
            return classificationMetadata;            
        }
        function getColorForClassificationName(name) {
            var classification = _findClassificationMetadata(name);
            if(!classification) {
                return '#eeeeee';
            }
            return classification.color;
        }

        function getPositionForClassificationName(name) {
            var classification = _findClassificationMetadata(name);
            if (!classification) {
                return 0;
            }
            return classificationMetadata.indexOf(classification);
        }
        function _findClassificationMetadata(name) {
            var classification = _.find(classificationMetadata, {
                title: name
            });
            if (!classification) {
                $log.error('No classification found for:', name);
            }
            return classification;
        }

        function getColor() {
            // jshint validthis: true 
            var classification = this;
            var metadata = _findClassificationMetadata(classification.title);
            return metadata.color;
        }

        // function hslToRgb(h, s, l) {
        //     var r, g, b;

        //     if (s == 0) {
        //         r = g = b = l; // achromatic
        //     } else {
        //         function hue2rgb(p, q, t) {
        //             if (t < 0) t += 1;
        //             if (t > 1) t -= 1;
        //             if (t < 1 / 6) return p + (q - p) * 6 * t;
        //             if (t < 1 / 2) return q;
        //             if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        //             return p;
        //         }

        //         var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        //         var p = 2 * l - q;
        //         r = hue2rgb(p, q, h + 1 / 3);
        //         g = hue2rgb(p, q, h);
        //         b = hue2rgb(p, q, h - 1 / 3);
        //     }

        //     return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        // }

    });
