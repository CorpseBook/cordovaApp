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
    },

    getStories: function(){
      var config =
      {
        method: 'GET',
        url: url + 'stories',
      };
      return promisify(config);
    },

    addContribution: function(id, contribution){
      contribution = {contribution : contribution}

      var config =
      {
        method: 'POST',
        url: url + 'stories/'+ id +'/contributions',
        data: contribution
      };
      
      return promisify(config);
    },

    create: function(story){
      var config =
      {
        method: 'POST',
        url: url + 'stories',
        data: story
      };

      return promisify(config);
    },

    getNearby: function(lat, lng){
      console.log('In get nearby with lat, lng:', lat, lng);

      var data = {search: {lat: lat, lng: lng}};

      var config =
      {
        method: 'POST',
        url: url + 'stories/nearby',
        data: data
      };

      return promisify(config);
    }
  }

  return new Story();
}])


corpseFaceApp.factory('Map', [ function(){

  var Map = function(config){
    this.markers = [];

    var latlng = new google.maps.LatLng(0,0);

    var mapOptions = {
      center: latlng,
      zoom: 5
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  Map.prototype = {

    addMarker: function(story){
      console.log(story);
      var myLatlng = new google.maps.LatLng(story.lat, story.lng)
      var title = story.title
      console.log(story.id)
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: this.map,
        title: title,
        url: '#/stories/' + story.id
      });
      google.maps.event.addListener(marker, 'click', function() {
        //getStory(story.id)
      });

      this.markers.push(marker)
    },

    addStoryMarkers: function(stories){
      for (var i = 0; i < stories.length; i++) {
        this.addMarker(stories[i]);
      }
    },

    // Sets the map on all markers in the array.
    setAllMap: function(map) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map);
      }
    },

    // Removes the markers from the map, but keeps them in the array.
    clearMarkers: function() {
      this.setAllMap(null);
    },

    // Shows any markers currently in the array.
    showMarkers: function() {
      this.setAllMap(this.map);
    },

    // Deletes all markers in the array by removing references to them.
    deleteMarkers: function() {
      this.clearMarkers();
      this.markers = [];
    }

  }

  return new Map();
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
        redirectTo: '/nearby',
        templateUrl: './views/stories/nearby.html',
        controller: 'nearbyCtrl'
      });
  }]);

var map;
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

        document.addEventListener("DOMContentLoaded", function(event) { 
          // console.log('doc ready');

          // var latlng = new google.maps.LatLng(-34.397, 150.644);

          // var mapOptions = {
          //   center: latlng,
          //   zoom: 12
          // };
          // console.log("making map control")
          // map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        });

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



