/**
 * Index generator for angular components with routing
 * @param {string} appname the root application name
 * @param {string} name Component name
 * @param {string} url url to component
 * @param {string} controller_postfix postfix for the registered controller
 */
module.exports = (appname, name, url, controller_postfix) => {
  return `document.addEventListener('DOMContentLoaded', function() {
  angular.module(\`${appname}\`).config(function ($routeProvider) {
    $routeProvider.when(\`${url}\`, {
      templateUrl: \`./components/${name}/${name}.html\`,
      controller: \`${name}${controller_postfix}\`
    })
  })
  angular.module(\`${appname}\`).controller(\`${name}${controller_postfix}\`, function($scope, $rootScope) {
    /*+++*/
    // var vm = $scope
    // var root = $rootScope
    /*...*/
    /*---*/
    var vm = {}
    var root = require('../../index.js')
    /*...*/
    root.set_location('${name}')
  })
})
`
}