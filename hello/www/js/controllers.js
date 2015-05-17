corpseFaceApp.controller('contributionNewCtrl', ['$scope', '$http', '$routeParams', '$location',
  function ($scope, $http, $routeParams, $location) {

    $scope.contribution = {};

    $scope.createContribution = function(contribution)
    {
      contribution = {contribution : contribution}

      var config =
      {
        method: 'POST',
        url: 'https://corpsebook-server.herokuapp.com/stories/'+ $routeParams.id +'/contributions',
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

    $scope.createNewStory = function (story)
    {
      story = {story : story}
      console.log(story);

      var config =
      {
        method: 'POST',
        url: 'https://corpsebook-server.herokuapp.com/stories',
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

corpseFaceApp.controller('storyCtrl', ['$scope', '$http', '$routeParams',
  function ($scope, $http, $routeParams) {

    $scope.getStories = function ()
    {
      var config =
      {
        method: 'GET',
        url: 'https://corpsebook-server.herokuapp.com/stories/' + $routeParams.id,
      };
      $http(config)
      .success(function (data)
      {
        console.log(data);
        $scope.story = data;
      })
      .error(function (data, status)
      {
        console.log(status);
      });
    }()

  }]);

corpseFaceApp.controller('storiesCtrl', ['$scope', '$http',
  function ($scope, $http) {

    $scope.getStories = function ()
    {
      var config =
      {
        method: 'GET',
        url: 'https://corpsebook-server.herokuapp.com/stories',
      };
      $http(config)
      .success(function (data)
      {
        $scope.stories = data;
      })
      .error(function (data, status)
      {
        console.log(status);
      });
    }()

  }]);