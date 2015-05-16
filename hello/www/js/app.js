var corpseFaceApp = angular.module('corpseFaceApp', ['ngRoute'
]);

corpseFaceApp.config(['$routeProvider',
  function($routeProvider) {
    // use the HTML5 History API
    $routeProvider.
      when('/signin', {
        templateUrl: './views/signin.html',
        controller: 'requestCtrl'
      }).
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
        redirectTo: '/signin',
        templateUrl: './views/signin.html',
        controller: 'requestCtrl'
      });
  }]);
