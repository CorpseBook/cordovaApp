var url = 'https://corpsebook-server.herokuapp.com/'
// var url = 'http://192.168.0.2:3000/'

corpseFaceApp.controller('contributionNewCtrl', ['$scope', '$http', '$routeParams', '$location', 'getStory',
  function ($scope, $http, $routeParams, $location, getStory) {

    $scope.contribution = {};
    $scope.story = {};

    getStory($routeParams.id)
      .then(function(result){
        $scope.story = result.data;
      }, 
      function(error){
        console.log('Got error trying to get story: ', error)
    })

    var getInrange = function ()
    {
      var data = {search: {lat: $scope.lat, lng: $scope.lng}};

      var config =
      {
        method: 'POST',
        url: url + 'stories/' + $routeParams.id + '/in_range',
        data: data,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      };
      $http(config)
        .success(function (data)
        {
          $scope.story.in_range = data.in_range;
        })
        .error(function (data, status)
        {
          console.log(status, data);
        });
    }

    navigator.geolocation.getCurrentPosition(function(data){
      console.log("Got position: ", data);
      $scope.lat = data.coords.latitude
      $scope.lng = data.coords.longitude

      getInrange();
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

corpseFaceApp.controller('storiesNewCtrl', ['$scope', '$http',
  function ($scope, $http) {

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
      })
      .error(function (data, status)
      {
        console.log('error');
      });
    }

  }])

corpseFaceApp.controller('storyCtrl', ['$scope', '$http', '$routeParams', 'getStory',
  function ($scope, $http, $routeParams, getStory) {

    getStory($routeParams.id)
      .then(function(result){
        $scope.story = result.data;
      }, 
      function(error){
        console.log('Got error trying to get story: ', error)
    })

  }]);

corpseFaceApp.controller('storiesCtrl', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {

    $scope.contribute = function(story){
      $location.url('/stories/' + story.id + '/contributions/new');
    }

    $scope.getStories = function ()
    {
      var config =
      {
        method: 'GET',
        url: url + 'stories',
      };
      $http(config)
      .success(function (data)
      {
        console.log(data)
        $scope.stories = data;
      })
      .error(function (data, status)
      {
        console.log(status);
      });
    }()

  }]);