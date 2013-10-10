angular.module('getafix.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Latest tests",
        "link": "testsets"
    }];
}]);