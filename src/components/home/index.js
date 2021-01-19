document.addEventListener("DOMContentLoaded", function () {
  angular.module('main').config(function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: './components/home/home.html',
      controller: 'home_controller'
    })
    $routeProvider.when('/home', {
      templateUrl: './components/home/home.html',
      controller: 'home_controller'
    })
  });

  angular.module('main').controller('home_controller', function ($scope, $rootScope) {
    // ! INSERT ! //
    // var vm = $scope
    // var root = $rootScope
    // ! END-INSERT ! //
    // ! REMOVE ! //
    var vm = {}
    var root = require('../../index')
    // ! END-REMOVE ! //

    root.set_location('home');
  })
})