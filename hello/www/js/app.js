var corpseFaceApp = angular.module('corpseFaceApp', ['ngRoute'
]);

corpseFaceApp.config(function($httpProvider)
  {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });

corpseFaceApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/stories/new', {
        templateUrl: './views/stories/new.html',
        controller: 'requestCtrl'
      }).
      when('/contributions/new', {
        templateUrl: './views/contributions/new.html',
        controller: 'requestCtrl'
      }).
      when('/stories/stories', {
        templateUrl: './views/stories/stories.html',
        controller: 'storiesCtrl'
      }).
      otherwise({
        redirectTo: '/stories/stories',
        templateUrl: './views/stories/stories.html',
        controller: 'storiesCtrl'
      });
  }]);

corpseFaceApp

