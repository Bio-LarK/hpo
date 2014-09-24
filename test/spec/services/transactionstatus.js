'use strict';

describe('Service: TransactionStatus', function () {

  // load the service's module
  beforeEach(module('hpoApp'));

  // instantiate service
  var TransactionStatus;
  beforeEach(inject(function (_TransactionStatus_) {
    TransactionStatus = _TransactionStatus_;
  }));

  it('should do something', function () {
    expect(!!TransactionStatus).toBe(true);
  });

});
