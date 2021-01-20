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

  /**
   * md - returns rendered html from a relative path
   * @param {string} url relative path to markdown file
   */
  root.md = function (url) {
    return render(get(url))
  }

  /**
   * returns the contents of a markdown file
   * @param {String} url the relative path to a markdown file within the source code
   */
  function get(url) {
    var contents = ''
    $.ajax({
      async: false,
      url: url,
      success: (data) => {
        contents = data
      }
    })
    return contents
  }

  /**
   * converts the given markdown file contents and returns html
   * @param {String} contents text contents of a given markdown file
   */
  function render(contents) {
    let markdown = markdownit({
      html: true,
      langPrefix: 'language-',
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`
          } catch (__) {}
        }
        return `<pre class="hljs"><code>${markdown.utils.escapeHtml(str)}</code></pre>`
      }
    })
    markdown.use(markdownItAttrs, {
      allowedAttributes: []
    })
    return markdown.render(contents)
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