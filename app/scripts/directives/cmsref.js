'use strict';

/**
 * @ngdoc directive
 * @name hpoApp.directive:cmSref
 * @description
 * # cmSref
 */
angular.module('hpoApp')
    .directive('cmSref', function($state, $log) {

        var directive = {
            restrict: 'A',
            link: postLink
        };
        return directive;

        function postLink(scope, element, attrs) {
            var ref = parseStateRef(attrs.cmSref, $state.current.name);
            // var params = null,
            //     url = null,
            //     base = stateContext(element) || $state.$current;
            // var isForm = element[0].nodeName === "FORM";
            // var attr = isForm ? "action" : "href",
            //     nav = true;

            // var options = {
            //     relative: base,
            //     inherit: true
            // };
            // var optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};

            // angular.forEach(allowedOptions, function(option) {
            //     if (option in optionsOverride) {
            //         options[option] = optionsOverride[option];
            //     }
            // });

            var update = function(isEditing) {
                if (isEditing) {
                    element[0]['href'] = '';
                } else {
                    element[0]['href'] = $state.href(ref.state, scope.$eval(ref.paramExpr));
                }
                // if (newVal) { 
                // 	params = newVal;
                // }

                // if (newHref === null) {
                //     nav = false;
                //     return false;
                // }
                // element[0]['href'] = newHref;
            };

            scope.$watch('isEditing', update);

            // if (ref.paramExpr) {
            //     scope.$watch(ref.paramExpr, function(newVal, oldVal) {
            //         if (newVal !== params) update(newVal);
            //     }, true);
            //     params = scope.$eval(ref.paramExpr);
            // }
            update();

            // element.bind("click", function(e) {
            //     var button = e.which || e.button;
            //     if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr('target'))) {
            //         // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
            //         var transition = $timeout(function() {
            //             $state.go(ref.state, params, options);
            //         });
            //         e.preventDefault();

            //         e.preventDefault = function() {
            //             $timeout.cancel(transition);
            //         };
            //     }
            // });
        }

        function parseStateRef(ref, current) {
            var preparsed = ref.match(/^\s*({[^}]*})\s*$/),
                parsed;
            if (preparsed) {
                ref = current + '(' + preparsed[1] + ')';
            }
            parsed = ref.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/);
            if (!parsed || parsed.length !== 4) {
                throw new Error('Invalid state ref \'' + ref + '\'');
            }
            return {
                state: parsed[1],
                paramExpr: parsed[3] || null
            };
        }
    });
