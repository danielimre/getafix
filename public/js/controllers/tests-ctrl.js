angular.module('getafix.tests').controller('TestsController', ['$scope', '$routeParams', '$location', 'Global', 'Tests', function ($scope, $routeParams, $location, Global, Tests) {
    $scope.global = Global;
    $scope.orderField = 'name';
    $scope.reverseOrder = false;
    $scope.showPassedFilter = false;

    $scope.findTestSets = function() {
        $scope.testsets = Tests.all('sets').getList();
    };

    $scope.findTestsForTestSet = function() {
        $scope.tests = Tests.one('sets', $routeParams.setId).getList();
    };
}]);