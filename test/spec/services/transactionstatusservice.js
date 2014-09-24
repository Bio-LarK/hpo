'use strict';

describe('Service: transactionStatusService', function () {

  // load the service's module
  beforeEach(module('hpoApp'));

  // instantiate service
  var transactionStatusService;
  beforeEach(inject(function (_transactionStatusService_) {
    transactionStatusService = _transactionStatusService_;
  }));

  it('should do something', function () {
    expect(!!transactionStatusService).toBe(true);
  });

});
