var corpseFaceApp = angular.module('corpseFaceApp', ['ngRoute'
]);

corpseFaceApp.factory('Story', [ '$http', '$q', function($http, $q){

  var url = 'https://corpsebook-server.herokuapp.com/'
  // var url = 'http://192.168.0.2:3000/' 

  var Story = function(config){

  }
  
  var promisify = function(config){
    var request = $http(config)
    var deferred = $q.deferred = $q.defer();
    deferred.resolve(request);
    return deferred.promise;
  }


  Story.prototype = {
    getStory : function(id){
      var config =
        {
          method: 'GET',
          url: url +'stories/' + id,
        };
      return promisify(config);
    },
    isInRange: function (id, lat, lng){
      var data = {search: {lat: lat, lng: lng}};

      var config =
      {
        method: 'POST',
        url: url + 'stories/' + id + '/in_range',
        data: data,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      };

      return promisify(config);
    } 
  }

  return new Story();
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



