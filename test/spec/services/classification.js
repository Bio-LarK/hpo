'use strict';

describe('Service: classification', function() {

    // load the service's module
    beforeEach(module('orphaApp'));

    // instantiate service
    var Classification, $httpBackend, ENV, $rootScope, classification;
    beforeEach(inject(function(_Classification_, _$httpBackend_, _ENV_, _$rootScope_) {
        Classification = _Classification_;
        $httpBackend = _$httpBackend_;
        ENV = _ENV_;
        $rootScope = _$rootScope_;
        $httpBackend.whenGET(/views.*/).respond(200, '');

        classification = new Classification({
            title: 'Rare eye disease'
        });
    }));

    it('should do something', function() {
        expect(!!Classification).toBe(true);
    });

    it('should provide a getAll function', function() {
        expect(typeof Classification.getAll).toBe('function');
    });

    it('should provide a getAll function', function() {
        expect(typeof Classification.getAll).toBe('function');
    });

    it('getAll should return expected value', function() {

        var page1 = [{
            title: 'Rare bone disease'
        }];
        var page2 = [{
            title: 'Rare eye disease'
        }, {
            title: 'Rare respiratory disease'
        }];
        $httpBackend.expectGET(ENV.apiEndpoint + '/entity_node?page=0&parameters%5Btype%5D=disorder_classification').respond(page1);
        $httpBackend.expectGET(ENV.apiEndpoint + '/entity_node?page=1&parameters%5Btype%5D=disorder_classification').respond(page2);

        var myClassifications;
        Classification.getAll().then(function(classifications) {
            myClassifications = classifications;
        });
        $httpBackend.flush();
        $rootScope.$apply();

        expect(myClassifications.length).toEqual(page1.length + page2.length);
        expect(myClassifications[0].title).toEqual(page1[0].title);
        expect(myClassifications[0].color).toBe('hsla(348.38709677419354, 80%, 70%, 1)');
    });

    describe('classification resource', function() {
        it('should provide a getColor function', function() {
            expect(typeof classification.getColor).toBe('function');
        });
        it('getColor should return expected value', function() {
            var color = classification.getColor();
            expect(color).toBe('hsla(336.77419354838713, 80%, 70%, 1)');
        });
    });

});
