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
    }

    $scope.incompleteStories = function(){
      $scope.completedFilter = {completed: false}
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

      Story.getNearby()
        .then(function(result){
          console.log(result);
          $scope.stories = result.data;
        }, function(error){
          console.log("Got error trying to get nearby stories", error);
        })
    });



  }]);

corpseFaceApp.controller('searchCtrl', ['$scope', '$location', 'Story',
  function ($scope, $location, Story){

      $scope.stories = {};
      var geocoder = new google.maps.Geocoder();

      $scope.list = function(){
      $scope.displayList = true
    }

      $scope.map = function(){
      $scope.displayList = false
    }

      Story.getStories()
      .then(function(result){
        console.log(result)
        $scope.stories = result.data;
    }, function(error){
        console.log("Got error trying to get stories", error);
    })

      $scope.getStoriesNearLocation = function (address){
        geocoder.geocode({'address': address}, function(results, status){
          var lat = results[0].geometry.location.A
          var lng = results[0].geometry.location.F

          Story.getNearby(lat, lng)
            .then(function(result){
              console.log(result);
              $scope.stories = result.data;
            }, function(error){
              console.log("Got error trying to get nearby stories", error);
            })
            });
      }
  }]);