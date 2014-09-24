'use strict';

describe('Service: propertyLabelService', function () {

  // load the service's module
  beforeEach(module('hpoApp'));

  // instantiate service
  var propertyLabelService;
  beforeEach(inject(function (_propertyLabelService_) {
    propertyLabelService = _propertyLabelService_;
  }));

  it('should do something', function () {
    expect(!!propertyLabelService).toBe(true);
  });

});
