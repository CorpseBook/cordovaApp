

var corpseFaceApp = angular.module('corpseFaceApp', []);

corpseFaceApp.controller('requestCtrl', ['$scope', '$http', function ($scope, $http)
{
    // this configures the headers for all HTTP requests

    corpseFaceApp.config(function($httpProvider)
    {
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

    // this is a test method for GET requests to the server - it is successful (i.e. without CORS errors)

    $scope.testGet = function ()
    {
      var config =
      {
        method: 'GET',
        url: 'https://corpsebook-server.herokuapp.com/stories/',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }

      $http(config)
      .success(function (data){
        console.log(data);
      });
    }

    // this is a method for posting user signIn objects - it is currently not fleshed out

    $scope.user = {};

    $scope.signIn = function (user)
    {
        return "signIn";
    }

    // this is a method for posting story objects to the server - it is currently getting CORS errors

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

      //Contribution
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
}]);