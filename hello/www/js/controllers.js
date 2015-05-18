corpseFaceApp.controller('contributionNewCtrl', ['$scope', '$routeParams', '$location', 'Story',
  function ($scope, $routeParams, $location, Story) {

    var storyID = $routeParams.id;

    $scope.contribution = {};
    $scope.story = {};

    Story.getStory(storyID)
      .then(function(result){
        $scope.story = result.data;
      }, 
      function(error){
        console.log('Got error trying to get story: ', error)
    })

    navigator.geolocation.getCurrentPosition(function(data){
      console.log("Got position: ", data);
      $scope.lat = data.coords.latitude
      $scope.lng = data.coords.longitude

      Story.isInRange(storyID, $scope.lat, $scope.lng)
        .then(function(result){
          // console.log(result);
          $scope.story.in_range = result.data.in_range
        }, function(error){
          console.log('Got error trying to get is in range: ', error)
        })
    });


    $scope.createContribution = function(contribution)
    {
      Story.addContribution(storyID, contribution)
        .then(function(result){
          $location.url('/stories/' + storyID );
        }, function(error){
          console.log("Got error adding contribution: ", error);
        })
    }

  }])

corpseFaceApp.controller('storiesNewCtrl', ['$scope', '$location', 'Story',
  function ($scope, $location, Story) {

    $scope.story = {};    

    navigator.geolocation.getCurrentPosition(function(data){
      console.log("Got position: ", data);
      $scope.lat = data.coords.latitude
      $scope.lng = data.coords.longitude
    });

    $scope.createNewStory = function (story)
    {
      story = {story : story}
      story.story.lat = $scope.lat
      story.story.lng = $scope.lng

      Story.create(story)
        .then(function(result){
          $location.url('/stories');
        }, function(error){
          console.log("Got error creating story: ", error);
        })
    }

  }])

corpseFaceApp.controller('storyCtrl', ['$scope', '$routeParams', 'Story',
  function ($scope, $routeParams, Story) {

    Story.getStory($routeParams.id)
      .then(function(result){
        $scope.story = result.data;
      }, 
      function(error){
        console.log('Got error trying to get story: ', error)
    })

  }]);

corpseFaceApp.controller('storiesCtrl', ['$scope', '$location', 'Story',
  function ($scope, $location, Story) {

    $scope.contribute = function(story){
      $location.url('/stories/' + story.id + '/contributions/new');
    }
    $scope.create = function(){
      $location.url('/stories/new' );
    }

    Story.getStories()
      .then(function(result){
        console.log(result)
        $scope.stories = result.data;
      }, function(error){
        console.log("Got error trying to get stories", error);
      })

  }]);


corpseFaceApp.controller('nearbyCtrl', ['$scope', '$location', 'Story',
  function ($scope, $location, Story) {

    $scope.completedFilter = {completed: false};

    $scope.contribute = function(story){
      $location.url('/stories/' + story.id + '/contributions/new');
    }
    $scope.create = function(){
      $location.url('/stories/new' );
    }

    $scope.completeStories = function(){
      $scope.completedFilter = {completed: true}
      $scope.$broadcast('stories_update', $scope.stories)
    }

    $scope.incompleteStories = function(){
      $scope.completedFilter = {completed: false}
      $scope.$broadcast('stories_update', $scope.stories)
    }

    $scope.list = function(){
      $scope.displayList = true
    }

    $scope.map = function(){
      $scope.displayList = false
    }

    navigator.geolocation.getCurrentPosition(function(data){
      console.log("Got position: ", data);
      $scope.lat = data.coords.latitude
      $scope.lng = data.coords.longitude

      $scope.$broadcast('new_location', {lat: data.coords.latitude , lng: data.coords.longitude})

      // Story.getStories()
      Story.getNearby()
        .then(function(result){
          console.log(result);
          $scope.stories = result.data;
          $scope.$broadcast('stories_update', $scope.stories)

        }, function(error){
          console.log("Got error trying to get nearby stories", error);
        })
    });
}]);



corpseFaceApp.controller('mapCtrl', ['$scope', '$location',
  function ($scope, $location) {

    var markers = [];

    var addMarker = function(story){
      console.log(story);
      var myLatlng = new google.maps.LatLng(story.lat, story.lng)
      var title = story.title
      console.log(story.id)
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: $scope.map,
        title: title,
        url: '#/stories/' + story.id
      });
      google.maps.event.addListener(marker, 'click', function() {
        getStory(story.id)
      });

      markers.push(marker)
    }

    var addMarkers = function(stories){
      for (var i = 0; i < stories.length; i++) {
        addMarker(stories[i]);
      }
    }

    // Sets the map on all markers in the array.
    function setAllMap(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setAllMap(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
      setAllMap(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
      clearMarkers();
      markers = [];
    }

    function updateStoryMarkers(){
      deleteMarkers();
      addMarkers($scope.$parent.stories.filter(function(story){return story.completed == $scope.$parent.completedFilter.completed}));
    }

    $scope.$on('stories_update', function(e, stories){
      console.log('got new stories broadcast: ', e);
      updateStoryMarkers();
    })


    $scope.$on('new_location', function(e, data){
      console.log('got boardcast: ', e);
      $scope.map.panTo(new google.maps.LatLng(data.lat, data.lng));
    })

    var latlng = new google.maps.LatLng(0,0);

    var mapOptions = {
      center: latlng,
      zoom: 5
    };

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }
]);