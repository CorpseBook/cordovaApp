corpseFaceApp.controller('requestCtrl', ['$scope', '$http',
  function ($scope, $http) {

    $scope.user = {};

    $scope.signIn = function (user)
    {
      return "signIn";
    }

  }]);

corpseFaceApp.controller('newContributionCtrl', ['$scope', '$http',
  function ($scope, $http) {

    $scope.contribution = {};

    $scope.createContribution = function(contribution)
    {
      contribution = {contribution : contribution}

      var config =
      {
        method: 'POST',
        url: 'https://corpsebook-server.herokuapp.com/stories/1/contributions',
        data: contribution
      };

      $http(config)
      .success(function(data)
      {
        console.log(data);
      })
      .error(function(data, status)
      {
        console.log("error");
      });
    }

  }])

corpseFaceApp.controller('newStoryCtrl', ['$scope', '$http',
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