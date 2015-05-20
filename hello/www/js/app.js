var gretelApp = angular.module('gretelApp', ['ngRoute'
]);

gretelApp.factory('Story', [ '$http', '$q', function($http, $q){

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
      console.log(story)
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

gretelApp.factory('Locator', ['$q', function($q){
  var Locator = function(){

  }

  Locator.prototype = {
    getLocation: function(){
      return $q(function(resolve, reject){
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(function(position){
            resolve(position);
          })
        }else{
          reject("Unable to get geolocation")
        }
      })
    }
  }

  return new Locator();

}])

gretelApp.factory('Map', [ 'Story', 'Locator', function(Story, Locator){

  var Map = function(config){
    this.initMap();
  }

  Map.prototype = {

    initMap: function(){
      this.markers = [];
      
      var latlng = new google.maps.LatLng(0,0);

      var mapOptions = {
        center: latlng,
        zoom: 5
      };

      this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      google.maps.event.trigger(this.map, "resize");
    },

    addMarker: function(story){
      console.log(story);
      var myLatlng = new google.maps.LatLng(story.location.lat, story.location.lng)
      var title = story.title
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: this.map,
        title: title,
        story: story
      });

      var Map = this;

      google.maps.event.addListener(marker, 'click', function() {
        var story = marker.story;

        Story.isInRange(story.id, Map.userLocation.lat, Map.userLocation.lng)
        .then(function(result){
          var inRange = result.data.in_range;
          if(story.completed){
            url = '#/stories/' + story.id
          }else{
            if(inRange){
              url = '#/stories/' + story.id + '/contributions/new'
            }else{
              url = '#/nearby'
              alert("You are not in range to contribute");
            }
          }           
          window.location.href = url;
        })
      });

      this.markers.push(marker)
    },

    addStoryMarkers: function(stories){
      var Map = this;

      Locator.getLocation().then(function(location){
        Map.userLocation = {lat: location.coords.latitude, lng: location.coords.longitude};

        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < stories.length; i++) {
          Map.addMarker(stories[i]);
        }

        for (var i = 0; i < Map.markers.length; i++) {
          bounds.extend(Map.markers[i].getPosition());
        }

        Map.map.fitBounds(bounds);
      })
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

gretelApp.config(function($httpProvider)
  {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });

gretelApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/stories/new', {
        templateUrl: './views/stories/new_story.html',
        controller: 'storiesNewCtrl'
      }).
      when('/stories/search', {
        templateUrl: './views/stories/search.html',
        controller: 'searchCtrl'
      }).
      when('/stories/nearby',{
        templateUrl: './views/stories/nearby.html',
        controller: 'nearbyCtrl'
      }).
      when('/stories/:id', {
        templateUrl: './views/stories/story.html',
        controller: 'storyCtrl'
      }).
      when('/stories/:id/contributions/new', {
        templateUrl: './views/contributions/new.html',
        controller: 'contributionNewCtrl'
      }).
      otherwise({
        redirectTo: '/stories/nearby',
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



