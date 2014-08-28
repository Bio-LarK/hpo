'use strict';

describe('Filter: inslicesof', function () {

  // load the filter's module
  beforeEach(module('hpoApp'));

  // initialize a new instance of the filter before each test
  var inslicesof;
  beforeEach(inject(function ($filter) {
    inslicesof = $filter('inslicesof');
  }));

  it('should return the input prefixed with "inslicesof filter:"', function () {
    var text = 'angularjs';
    expect(inslicesof(text)).toBe('inslicesof filter: ' + text);
  });

});
