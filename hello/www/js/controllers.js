gretelApp.controller('contributionNewCtrl', ['$scope', '$routeParams', '$location', 'Story', 'Locator',
  function ($scope, $routeParams, $location, Story, Locator) {

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

    Locator.getLocation()
      .then(function(location){
        // console.log("Got position: ", location);
        $scope.lat = location.coords.latitude
        $scope.lng = location.coords.longitude

        return Story.isInRange(storyID, $scope.lat, $scope.lng)

      })
      .then(function(result){
            // console.log(result);
            $scope.story.in_range = result.data.in_range
      })
      .catch(function(error){
            console.log('Got error trying to get is in range: ', error)
      })

    $scope.createContribution = function(contribution)
    {
      Story.addContribution(storyID, contribution)
        .then(function(result){
          $location.url('/stories/nearby');
        }, function(error){
          console.log("Got error adding contribution: ", error);
        })
    }

  }])

gretelApp.controller('storiesNewCtrl', ['$scope', '$location', 'Story','Locator',
  function ($scope, $location, Story, Locator) {

    $scope.story = {};

    Locator.getLocation()
      .then(function(location){
        // console.log("Got position: ", location);
        $scope.lat = location.coords.latitude
        $scope.lng = location.coords.longitude
      })
      .catch(function(error){
        alert("You need to allow locations!")
      })


    $scope.createNewStory = function (story)
    {
      story = {story : story}
      story.story.lat = $scope.lat
      story.story.lng = $scope.lng

      Story.create(story)
        .then(function(result){
          $location.url('/stories/nearby');
        }, function(error){
          console.log("Got error creating story: ", error);
        })
    }

  }])

gretelApp.controller('storyCtrl', ['$scope', '$routeParams', '$location', 'Story', 'Locator',
  function ($scope, $routeParams, $location, Story, Locator) {

    $scope.story = {};
    $scope.inRange = false;
    $scope.completed = false;
    $scope.contributions = {};

    Story.getStory($routeParams.id)
      .then(function(result){
        $scope.story = result.data;
        $scope.completed = $scope.story.completed;
        $scope.contributions = $scope.story.all_contributions;
      },
      function(error){
        console.log('Got error trying to get story: ', error)
    })

  }]);

gretelApp.controller('nearbyCtrl', ['$scope', '$location', 'Story', 'Map', 'Locator',
  function ($scope, $location, Story, Map, Locator) {

    $scope.completedFilter = false;
    Map.initMap();


    $scope.contribute = function(story){

      Locator.getLocation(story)
      .then(function(location){
        // console.log("Got position: ", location);
        $scope.lat = location.coords.latitude
        $scope.lng = location.coords.longitude

        return Story.isInRange(story.id, $scope.lat, $scope.lng)
      })
      .then(function(result){
            // console.log(result);
            $scope.in_range = result.data.in_range
            if ($scope.in_range)
            {
              $location.url('/stories/' + story.id + '/contributions/new');
            }
            else
            {
              alert("You are not in range to contribute!");
            }
      })
      .catch(function(error){
            console.log('Got error trying to get is in range: ', error)
      })

    }

    $scope.viewComplete = function(story){
      $location.url('/stories/' + story.id);
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

    Locator.getLocation()
      .then(function(location){
        $scope.lat = location.coords.latitude
        $scope.lng = location.coords.longitude

        Map.map.panTo(new google.maps.LatLng($scope.lat, $scope.lng));
        return Story.getNearby($scope.lat, $scope.lng)
      })
      .then(function(result){
        // console.log('Result is:', result);
        $scope.stories = result.data.reverse();
        updateStoryMarkers();

      })
      .catch(function(error){
        console.log("Got error trying to get nearby stories", error);
      })


}]);


gretelApp.controller('searchCtrl', ['$scope', '$location', 'Story', 'Map', 'Locator',
  function ($scope, $location, Story, Map, Locator){

    $scope.stories = {};
    $scope.completedFilter = false;
    $scope.displayList = false;

    Story.getStories()
    .then(function(result){
      $scope.stories = result.data;
      Map.initMap();
      updateStoryMarkers();

    }, function(error){
        console.log("Got error trying to get stories", error);
    });

    var geocoder = new google.maps.Geocoder();

    $scope.contribute = function(story){

      Locator.getLocation(story)
      .then(function(location){
        // console.log("Got position: ", location);
        $scope.lat = location.coords.latitude
        $scope.lng = location.coords.longitude

        return Story.isInRange(story.id, $scope.lat, $scope.lng)
      })
      .then(function(result){
            // console.log(result);
            $scope.in_range = result.data.in_range
            if ($scope.in_range)
            {
              $location.url('/stories/' + story.id + '/contributions/new');
            }
            else
            {
              alert("You are not in range to contribute!");
            }
      })
      .catch(function(error){
            console.log('Got error trying to get is in range: ', error)
      })

    }

    $scope.viewComplete = function(story){
      $location.url('/stories/' + story.id);
    }

    $scope.completeStories = function(){
      $scope.completedFilter = true;
      updateStoryMarkers();
    }

    $scope.incompleteStories = function(){
      $scope.completedFilter = false;
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
      Map.addStoryMarkers($scope.stories.filter(function(story){
        return story.completed == $scope.completedFilter
      }));
    }

    $scope.getStoriesNearLocation = function (address){
      geocoder.geocode({'address': address}, function(results, status){

        $scope.lat = results[0].geometry.location.A;
        $scope.lng = results[0].geometry.location.F;
        // console.log("got coords for address: " + $scope.lat + ", " + $scope.lng)

        Map.map.panTo(new google.maps.LatLng($scope.lat, $scope.lng));

        Story.getNearby($scope.lat, $scope.lng)
          .then(function(result){
            // console.log(result);
            $scope.stories = result.data.reverse();
            updateStoryMarkers();
          }, function(error){
            console.log("Got error trying to get nearby stories", error);
          })
        });
    }
  }]);
