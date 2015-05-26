'use strict';

angular.module('myAppRename.view2', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2', {
      templateUrl: 'app/view2/view2.html',
      controller: 'View2Ctrl'
    });
  }])
  .controller('View2Ctrl', ['$scope', '$http', function ($scope, $http) {
        $scope.departure = "";
        $scope.arrival = "";
        $scope.date = "";
        //$scope.flights = [];

        $scope.search = function () {
            $http({
                method: 'GET',
                url: '/getFlights/'+$scope.departure+'/'+$scope.arrival+'/'+$scope.date
            })
                .success(function (data, status, headers, config) {
                        $scope.flights = angular.fromJson(data);
                    JSON.parse($scope.flights);

                })
                .error(function (data, status, headers, config) {
                    $scope.error = 'Something went wrong';
                });

        };



        $http({
      method: 'GET',
      url: 'userApi/test'
    })
      .success(function (data, status, headers, config) {
        $scope.info = data;
        $scope.error = null;
      }).
      error(function (data, status, headers, config) {
        if (status == 401) {
          $scope.error = "You are not authenticated to request these data";
          return;
        }
        $scope.error = data;
      });
  }]);