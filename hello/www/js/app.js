var corpseFaceApp = angular.module('corpseFaceApp', ['ngRoute'
]);

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
        controller: 'requestCtrl'
      }).
      otherwise({
        redirectTo: '/stories/stories',
        templateUrl: './views/stories/stories.html',
        controller: 'requestCtrl'
      });
  }]);

corpseFaceApp

