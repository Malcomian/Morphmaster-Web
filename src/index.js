var app = angular.module('main', ['ngRoute', 'ngAnimate'])

app.controller('main_controller', function ($scope, $rootScope) {
  /*+++*/
  // var vm = $scope
  // var root = $rootScope
  /*...*/
  /*---*/
  var vm = {}
  var root = {}
  /*...*/

  root.location = 'main'
  root.set_location = function (location) {
    root.location = location
    window.scrollTo(0, 0)
  }
  /*---*/
  module.exports = root
  /*...*/
})

app.filter('active', function () {
  return function (data, location) {
    if (data == location) {
      return 'active';
    } else {
      return '';
    }
  }
})