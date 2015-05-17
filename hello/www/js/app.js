var corpseFaceApp = angular.module('corpseFaceApp', ['ngRoute'
]);

corpseFaceApp.factory('getStory', [ '$http', '$q', function($http, $q){
  // var func = function(){console.log("Making getStories service, scope is: ", $scope)};
  var func = function(id){
    var config =
      {
        method: 'GET',
        url: 'https://corpsebook-server.herokuapp.com/stories/' + id,
      };
    var story = $http(config)
    var deferred = $q.deferred = $q.defer();
    deferred.resolve(story);
    return deferred.promise;
  }
  return func;
}])

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
        controller: 'storiesNewCtrl'
      }).
      when('/stories/:id/contributions/new', {
        templateUrl: './views/contributions/new.html',
        controller: 'contributionNewCtrl'
      }).
      when('/stories', {
        templateUrl: './views/stories/stories.html',
        controller: 'storiesCtrl'
      }).
      when('/stories/:id', {
        templateUrl: './views/stories/story.html',
        controller: 'storyCtrl'
      }).
      otherwise({
        redirectTo: '/stories',
        templateUrl: './views/stories/stories.html',
        controller: 'storiesCtrl'
      });
  }]);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      console.log(id);

    }
};

app.initialize();



