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


corpseFaceApp.controller('nearbyCtrl', ['$scope', '$location', 'Story', 'Map',
  function ($scope, $location, Story, Map) {

    $scope.completedFilter = false;
    Map.initMap();

    $scope.contribute = function(story){
      $location.url('/stories/' + story.id + '/contributions/new');
    }

    $scope.completeStories = function(){
      $scope.completedFilter = true
      updateStoryMarkers();
    }

    $scope.incompleteStories = function(){
      $scope.completedFilter = false
      updateStoryMarkers();
    }

    $scope.list = function(){
      $scope.displayList = true
    }

    $scope.map = function(){
      $scope.displayList = false
    }

    function updateStoryMarkers(){
      Map.deleteMarkers();
      Map.addStoryMarkers($scope.stories.filter(function(story){return story.completed == $scope.completedFilter}));
    }

    navigator.geolocation.getCurrentPosition(function(data){

      $scope.lat = data.coords.latitude
      $scope.lng = data.coords.longitude

      Map.map.panTo(new google.maps.LatLng($scope.lat, $scope.lng));

      Story.getNearby($scope.lat, $scope.lng)
        .then(function(result){

          $scope.stories = result.data;
          updateStoryMarkers();

        }, function(error){
          console.log("Got error trying to get nearby stories", error);
        })
    });
}]);

