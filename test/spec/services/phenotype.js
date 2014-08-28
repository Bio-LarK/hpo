'use strict';

describe('Service: Phenotype', function () {

  // load the service's module
  beforeEach(module('hpoApp'));

  // instantiate service
  var Phenotype;
  beforeEach(inject(function (_Phenotype_) {
    Phenotype = _Phenotype_;
  }));

  it('should do something', function () {
    expect(!!Phenotype).toBe(true);
  });

});
