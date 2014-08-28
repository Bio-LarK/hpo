'use strict';

describe('Controller: PhenotypeCtrl', function () {

  // load the controller's module
  beforeEach(module('hpoApp'));

  var PhenotypeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PhenotypeCtrl = $controller('PhenotypeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
