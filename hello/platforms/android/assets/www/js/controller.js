var corpseFaceApp = angular.module('corpseFaceApp', []);

corpseFaceApp.controller('corpseCtrl', ['$scope', '$http', function ($scope, $http)
{
    $scope.user = {};

    $scope.signIn = function (user)
    {
      var config =
      {
          user: user
      };

      $http.post("http://corpsebook-server.herokuapp.com/stories/", config)
        .success(function (data, status, headers, config)
        {
          console.log(data);
        })
        .error(function (data, status, headers, config)
        {
          console.log('error');
        });
    }

    $scope.story = {};

     $scope.createNewStory = function (story)
      {
        var config =
        {
            story: story
        };

        $http.post("http://corpsebook-server.herokuapp.com/stories/", config)
          .success(function (data, status, headers, config)
          {
            console.log(data);
          })
          .error(function (data, status, headers, config)
          {
            console.log('error');
          });
      }
}]);