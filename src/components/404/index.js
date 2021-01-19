document.addEventListener("DOMContentLoaded", function () {
  angular.module('main').config(function ($routeProvider) {
    $routeProvider.otherwise({
      templateUrl: './components/404/404.html',
      controller: '404_controller'
    })
  })
  
  angular.module('main').controller('404_controller', function ($scope, $rootScope) {
    var vm = $scope
    var root = $rootScope

    root.set_location('404')
  
    vm.get_url = get_url
  
    function get_url() {
      return window.location.hash
    }
  })
})