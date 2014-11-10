'use strict';

describe('Controller: ClassificationCtrl', function() {

    // load the controller's module
    beforeEach(module('orphaApp'));

    var ClassificationCtrl,
        scope, $httpBackend;

    var $stateParams = {
        classificationId: 1   
    };
    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, _$rootScope_, _$httpBackend_) {
        scope = $rootScope.$new();
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET('scripts/services/disorderbody.json').respond(200, '{}');

        ClassificationCtrl = $controller('ClassificationCtrl', {
            $scope: scope,
            $stateParams: $stateParams
        });
    }));

    it('should exist', function() {
        expect(!!ClassificationCtrl).toBe(true);
    });

    describe('when created', function() {
        // Add specs

        it('should load the classification', function() {

        });
        it('should load the root disorder', function() {

        });
        it('should select the root disorder', function() {

        });
    });

    describe('when selecting a disorder', function() {
        it('should select the diorder', function() {
            // $httpBackend.expectGET(ENV.apiEndpoint + '/entity_node?page=0&parameters%5Btype%5D=hpo_classification').respond(page1);
            // scope.$digest();
            // expect(ClassificationCtrl.classification.nid).toEqual(1);
        });
        it('should clear all filters', function() {

        });
        it('should open the disorder tree', function() {

        });
        it('should load the disorders children', function() {

        });
    });

    describe('when destroyed', function() {
        // Add specs
    });
});
