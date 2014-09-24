'use strict';

describe('Controller: EditchildrenCtrl', function () {

  // load the controller's module
  beforeEach(module('hpoApp'));

  var EditchildrenCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditchildrenCtrl = $controller('EditchildrenCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
