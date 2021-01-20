document.addEventListener("DOMContentLoaded", function () {
  angular.module('main').config(function ($routeProvider) {
    $routeProvider.when('/about', {
      templateUrl: './components/about/about.html',
      controller: 'about_controller'
    })
  });

  angular.module('main').controller('about_controller', function ($scope, $rootScope) {
    /*+++*/
    // var vm = $scope
    // var root = $rootScope
    /*...*/
    /*---*/
    var vm = {}
    var root = require('../../index')
    /*...*/

    root.set_location('about');

    $('#about').html(root.md('./components/about/about.md'))
  })
})
