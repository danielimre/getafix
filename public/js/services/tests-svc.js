angular.module('getafix.tests').factory("Tests", ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer){
      RestangularConfigurer.setBaseUrl('/tests');
    });
}]);