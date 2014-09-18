'use strict';

describe('Controller: EditsynonymCtrl', function () {

  // load the controller's module
  beforeEach(module('hpoApp'));

  var EditsynonymCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditsynonymCtrl = $controller('EditsynonymCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
