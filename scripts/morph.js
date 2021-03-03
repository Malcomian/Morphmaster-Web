// morph.js
// changes package name properties based on the project folder name

const fs = require('fs-extra')

var package = require('../package.json')

console.log(`Morphing package "${package.name}" @ "${__dirname}"...`)

let dirname = __dirname
dirname = dirname.split('\\')
dirname.pop()
let name = dirname[dirname.length - 1]

dirname = dirname.join('\\')

package.name = name
console.log(`New package name: "${package.name}"`)

save()

function save() {
  var result = JSON.stringify(package, null, 2)
  fs.writeFileSync(`${dirname}\\package.json`, result)
  console.log(`Successfully updated package`)
}