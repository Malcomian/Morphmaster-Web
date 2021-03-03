const start = new Date().getTime()

const fs = require('fs-extra')
const path = require('path')

var project = require('../package.json')
console.log(`Building project, "${project.name}"...`)

const Command = require('commander').Command
const program = new Command()

const appname = 'main'
const controller_postfix = '_controller'

program.name('evoke')
program.version('0.0.1')

program
  .command('gen <name> <url>')
  .description('create a new component')
  .action((name, url) => generate(name, url))

program
  .command('reinclude <source> <target>')
  .description('inserts component scripts in main index.html file')
  .action((source, target) => reinclude(source, target))

program.parse(process.argv)

function generate(name, url) {
  console.log(`Generating component "${name}" at "${url}"...`)

  // ! the relative path to the components folder is unfortunately hard coded here...
  let target = `${path.resolve('./src/components')}\\${name}`
  if (fs.existsSync(target)) {
    console.log(`Component "${name}" already exists!`)
    return
  }
  // create component structure
  fs.outputFileSync(`${target}\\index.js`, require('./lib/index')(appname, name, url, controller_postfix))
  fs.outputFileSync(`${target}\\${name}.html`, require('./lib/html')(name))
  end()
}

/**
 * End - measure and print final elapsed time
 */
function end() {
  const end = new Date().getTime()
  const elapsed = end - start
  console.log(`Finished in ${elapsed}ms!`)
}

/**
 * Redo the include statements inside the main index.html file in the build location
 * @param {string} source relative path to source folder
 * @param {string} target relative path to build folder
 */
function reinclude(source, target) {
  let components = get_components(source)
  // transform into html script tags
  let html = []
  for (let i = 0; i < components.length; i++) {
    const element = components[i];
    html.push(`<script src="${element}"></script>`)
  }
  // reinclude within the index file
  let index = fs.readFileSync(path.resolve(`${source}/index.html`)).toString()
  index = index.split('\n')
  let found = false
  for (let i = 0; i < index.length; i++) {
    const element = index[i];
    if (element.startsWith('<!-- ! COMPONENTS ! -->')) {
      // start reinclude
      found = true
      index.splice(i + 1, 0, ...html)
      break
    }
  }
  if (found == true) {
    index = index.join('\n')
    if (fs.readFileSync(path.resolve(`${target}/index.html`)).toString() == index) return
    console.log(`Adding ${components.length} component index scripts to index.html...`)
    fs.outputFileSync(path.resolve(`${target}/index.html`), index)
  }
  end()
}

/**
 * Get Components - returns a list of relative folder paths of all index files within the components folder
 * @param {string} source relative path to components folder
 */
function get_components(source) {
  let folders = get_folders(path.resolve(`${source}/components`))
  let components = []
  for (let i = 0; i < folders.length; i++) {
    const element = folders[i];
    let index = `${source}/components/${element}/index.js`
    if (fs.existsSync(path.resolve(index))) {
      components.push(index.replace(source, '.'))
    }
  }
  return components
}

/**
 * Get Folders - returns a list of directory folder names
 * @param {String} folder full directory path
 */
function get_folders(folder) {
  let folders = fs.readdirSync(folder, {
    withFileTypes: true
  })
  folders = folders.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
  return folders
}