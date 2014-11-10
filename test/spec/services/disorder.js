'use strict';

describe('Service: disorder', function() {

    // load the service's module
    beforeEach(module('orphaApp'));

    // instantiate service
    var Disorder, disorder, $rootScope, $httpBackend, ENV;
    beforeEach(inject(function(_Disorder_, _$rootScope_, _$httpBackend_, _ENV_) {
        Disorder = _Disorder_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        ENV = _ENV_;
        $httpBackend.whenGET(/views.*/).respond(200, '');
        disorder = new Disorder({
            'body': [],
            'disorder_orphaid': '12948',
            'disorder_orphanumber': '97929',
            'disorder_name': 'Rare cardiac disease',
            'disorder_synonym': [],
            'disorder_root': '1',
            'disorder_er': [],
            'disorder_disgene': [],
            'disorder_expert': [{
                'uri': 'http://orphanet.bio-lark.org/drupal/api/entity_node/113949',
                'id': '113949',
                'nid': '113949',
                'title': 'Expert::97929',
                'resource': 'node'
            }],
            'disorder_inheritance': [],
            'disorder_parent': [],
            'disorder_child': [{
                'uri': 'http://orphanet.bio-lark.org/drupal/api/entity_node/47592',
                'id': '47592',
                'nid': '47592',
                'title': 'Pericarditis',
                'resource': 'node'
            }, {
                'uri': 'http://orphanet.bio-lark.org/drupal/api/entity_node/54264',
                'id': '54264',
                'nid': '54264',
                'title': 'Coronary artery disease - hyperlipidemia - hypertension - diabetes - osteoporosis',
                'resource': 'node'
            }, {
                'uri': 'http://orphanet.bio-lark.org/drupal/api/entity_node/113953',
                'id': '113953',
                'nid': '113953',
                'title': 'Cardiomyopathy',
                'resource': 'node'
            }, {
                'uri': 'http://orphanet.bio-lark.org/drupal/api/entity_node/113995',
                'id': '113995',
                'nid': '113995',
                'title': 'Rare cardiac tumor',
                'resource': 'node'
            }, {
                'uri': 'http://orphanet.bio-lark.org/drupal/api/entity_node/113997',
                'id': '113997',
                'nid': '113997',
                'title': 'Rare cardiac rhythm disease',
                'resource': 'node'
            }, {
                'uri': 'http://orphanet.bio-lark.org/drupal/api/entity_node/42525',
                'id': '42525',
                'nid': '42525',
                'title': 'LMNA-related cardiocutaneous progeria syndrome',
                'resource': 'node'
            }],
            'disorder_phenotype': [],
            'disorder_tr': [],
            'disorder_class': [{
                'uri': 'http://orphanet.bio-lark.org/drupal/api/entity_node/113951',
                'id': '113951',
                'nid': '113951',
                'title': 'Rare cardiac disease',
                'resource': 'node'
            }],
            'nid': '113950',
            'vid': '113950',
            'is_new': false,
            'type': 'disorder',
            'title': 'Rare cardiac disease',
            'language': 'und',
            'url': 'http://orphanet.bio-lark.org/drupal/node/113950',
            'edit_url': 'http://orphanet.bio-lark.org/drupal/node/113950/edit',
            'status': '1',
            'promote': '0',
            'sticky': '0',
            'created': '1412734669',
            'changed': '1412734669',
            'comment': '0',
            'comments': [],
            'comment_count': 0,
            'comment_count_new': false
        });

        $httpBackend.whenGET('scripts/services/disorderbody.json').respond(200, '{}');
    }));

    it('should do exist', function() {
        expect(!!Disorder).toBe(true);
    });

    describe('class methods', function() {
        it('should provide a getFromSign function', function() {
            expect(typeof Disorder.getFromSign).toBe('function');
        });
        it('should provide a getFromGene function', function() {
            expect(typeof Disorder.getFromGene).toBe('function');
        });
        it('should provide a getParentsFromDisorderInClassification function', function() {
            expect(typeof Disorder.getParentsFromDisorderInClassification).toBe('function');
        });
        it('should provide a getRoots function', function() {
            expect(typeof Disorder.getRoots).toBe('function');
        });
        it('should provide a getRootForClassification function', function() {
            expect(typeof Disorder.getRootForClassification).toBe('function');
        });
    });

    describe('instance methods', function() {
        it('should provide a getGenes function', function() {
            expect(typeof disorder.getGenes).toBe('function');
        });
        it('should provide a getSigns function', function() {
            expect(typeof disorder.getSigns).toBe('function');
        });
        it('should provide a getParents function', function() {
            expect(typeof disorder.getParents).toBe('function');
        });
        it('should provide a loadChildren function', function() {
            expect(typeof disorder.loadChildren).toBe('function');
        });
        it('should provide a loadParents function', function() {
            expect(typeof disorder.loadParents).toBe('function');
        });
        it('should provide a loadExternalIdentifiers function', function() {
            expect(typeof disorder.loadExternalIdentifiers).toBe('function');
        });

        it('loadChildren should return expected value', function() {
            var children = [{title: 'hello world'}];
            $httpBackend.expectGET(ENV.apiEndpoint + 
                '/entity_node?fields=nid,title,disorder_name,disorder_child,disorder_class&page=0&parameters%5Bdisorder_parent%5D=113950&parameters%5Btype%5D=disorder').respond(children);

            disorder.loadChildren();
            $httpBackend.flush();
            $rootScope.$digest();
            expect(disorder.hasLoadedChildren).toBe(true);
            expect(disorder.disorder_child[0].title).toBe(children[0].title);
        });

    });
});
