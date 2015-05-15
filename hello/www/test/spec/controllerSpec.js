var angular = require('angular-node');
var ngMock = require('angular-mocks-node');
angular.mock === ngMock;

describe('Unit: requestCtrl', function ()
{
  beforeEach(module('corpseFaceApp'));

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope)
  {
    scope = $rootScope.$new();
    ctrl = $controller('requestCtrl',
    {
      $scope: scope
    });
  }));

  it('should create $scope.greeting when calling sayHello', function ()
  {
    expect(scope.greeting).toBeUndefined();
    scope.sayHello();
    expect(scope.greeting).toEqual("Hello Ari");
  })

});