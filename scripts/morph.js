// morph.js
// changes package name properties based on the project folder name

const fs = require('fs-extra')

const path = require('path')

const _x_ = path.delimiter

var package = require('../package.json')

console.log(`Morphing package "${package.name}" @ "${__dirname}"...`)

let dirname = __dirname
dirname = dirname.split(_x_)
dirname.pop()
let name = dirname[dirname.length - 1]

dirname = dirname.join(_x_)

package.name = name
console.log(`New package name: "${package.name}"`)

save()

function save() {
  var result = JSON.stringify(package, null, 2)
  fs.writeFileSync(`${dirname}${_x_}package.json`, result)
  console.log(`Successfully updated package`)
}