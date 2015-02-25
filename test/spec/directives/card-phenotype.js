'use strict';

describe('Directive: cardPhenotype', function() {

    // load the directive's module
    beforeEach(module('orphaApp'));

    var element,
        scope;

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function($compile) {
        element = angular.element('<card-phenotype></card-phenotype>');
        element = $compile(element)(scope);
        // expect(element.text()).toBe('this is the cardPhenotype directive');
    }));
});
