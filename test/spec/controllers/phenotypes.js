'use strict';

describe('Controller: PhenotypesCtrl', function () {

  // load the controller's module
  beforeEach(module('hpoApp'));

  var PhenotypesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PhenotypesCtrl = $controller('PhenotypesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
