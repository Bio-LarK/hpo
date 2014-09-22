'use strict';

describe('Service: listtransactionunlimited', function () {

  // load the service's module
  beforeEach(module('hpoApp'));

  // instantiate service
  var listtransactionunlimited;
  beforeEach(inject(function (_listtransactionunlimited_) {
    listtransactionunlimited = _listtransactionunlimited_;
  }));

  it('should do something', function () {
    expect(!!listtransactionunlimited).toBe(true);
  });

});
