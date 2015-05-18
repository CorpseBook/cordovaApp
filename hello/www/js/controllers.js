var url = 'https://corpsebook-server.herokuapp.com/'
// var url = 'http://192.168.0.2:3000/'

corpseFaceApp.controller('contributionNewCtrl', ['$scope', '$http', '$routeParams', '$location', 'Story',
  function ($scope, $http, $routeParams, $location, Story) {

    var storyID = $routeParams.id;

    $scope.contribution = {};
    $scope.story = {};

    Story.getStory($routeParams.id)
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
          console.log(result);
          $scope.story.in_range = result.data.in_range
        }, function(error){
          console.log('Got error trying to get is in range: ', error)
        })
    });


    $scope.createContribution = function(contribution)
    {
      contribution = {contribution : contribution}

      var config =
      {
        method: 'POST',
        url: url + 'stories/'+ $routeParams.id +'/contributions',
        data: contribution
      };

      $http(config)
      .success(function(data)
      {
        console.log(data);
        $location.url('/stories/' + $routeParams.id );
      })
      .error(function(data, status)
      {
        console.log("error");
      });
    }

  }])

corpseFaceApp.controller('storiesNewCtrl', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {

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
      console.log(story);

      var config =
      {
        method: 'POST',
        url: url + 'stories',
        data: story
      };

      $http(config)
      .success(function (data)
      {
        console.log(data);
        $location.url('/stories');
      })
      .error(function (data, status)
      {
        console.log('error');
      });
    }

  }])

corpseFaceApp.controller('storyCtrl', ['$scope', '$http', '$routeParams', 'Story',
  function ($scope, $http, $routeParams, Story) {

    Story.getStory($routeParams.id)
      .then(function(result){
        $scope.story = result.data;
      }, 
      function(error){
        console.log('Got error trying to get story: ', error)
    })

  }]);

corpseFaceApp.controller('storiesCtrl', ['$scope', '$http', '$location', 'Story'
  function ($scope, $http, $location, Story) {

    $scope.contribute = function(story){
      $location.url('/stories/' + story.id + '/contributions/new');
    }
    $scope.create = function(){
      $location.url('/stories/new' );
    }

    Story.getStories()
      .then(function(result){
        console.log(result)
        $scope.stories = result;
      }, function(error){
        console.log("Got error trying to get stories", error);
      })

  }]);