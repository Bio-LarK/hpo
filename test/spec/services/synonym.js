'use strict';

describe('Service: synonym', function () {

  // load the service's module
  beforeEach(module('hpoApp'));

  // instantiate service
  var synonym;
  beforeEach(inject(function (_synonym_) {
    synonym = _synonym_;
  }));

  it('should do something', function () {
    expect(!!synonym).toBe(true);
  });

});
