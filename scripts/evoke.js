const start = new Date().getMilliseconds()

const fs = require('fs-extra')
const path = require('path')

var project = require('../package.json')
console.log(`Building project, "${project.name}"...`)

const Command = require('commander').Command
const program = new Command()

var edited = 0
var copied = 0

class Node {
  /**
   * Node - an object for storing information about a file or folder
   * @param {string} name name of the file or folder
   * @param {string} path full path to the file or folder
   * @param {('file'|'folder')} type either file or folder
   * @returns {object} a node object containing the name, path, and type of node
   */
  constructor(name, path, type) {
    this.name = name
    this.path = path
    this.type = type
  }
  /**
   * Returns true if the node is a directory. Alias of isFolder()
   */
  isDirectory() {
    return (this.type == 'folder' ? true : false)
  }
  /**
   * Returns true if the node is a folder. Alias of isDirectory()
   */
  isFolder() {
    return (this.type == 'folder' ? true : false)
  }
  /**
   * Returns true if the node is a file
   */
  isFile() {
    return (this.type == 'file' ? true : false)
  }
}

class Scriptoid {
  /**
   * Scriptoid - inserts and removes comments based on specific patterns
   * @param {string} source full path to source file
   * @param {string} target full path to target file
   */
  constructor(source, target) {
    this.source = source
    this.target = target
    this.contents = ''
    this.was_edited = false
    // this.inline_insert_regex = /(?<=\/\*\+\*\/)(.*?)(?=\/\*\.\*\/)/g
    // this.inline_remove_regex = /(?<=\/\*\-\*\/)(.*?)(?=\/\*\.\*\/)/g
    // this.inline_insert_string = `/*+*/`
    // this.inline_remove_string = `/*-*/`
    // this.inline_ending_string = `/*.*/`
    // this.line_insert = `// /*++*/`
    // this.line_remove = `/*--*/`
    this.multiline_insert = `/*+++*/`
    this.multiline_remove = `/*---*/`
    this.multiline_ending = `/*...*/`
  }
  /**
   * Evokes the file and saves it
   */
  evoke() {
    this.contents = fs.readFileSync(this.source).toString()
    let data = this.process(this.contents)
    // console.log(`Finished evoking file "${this.get_filename(this.source)}"!`)
    return this.save(data)
  }
  save(data) {
    if (!fs.existsSync(this.target)) {
      fs.outputFileSync(this.target, data)
      edited++
      return true
    } else {
      if (this.was_edited) {
        if (fs.readFileSync(this.target).toString() == data) return true
        fs.outputFileSync(this.target, data)
        edited++
        return true
      } else {
        return false
      }
    }
  }
  process(contents) {
    let file = []
    file = contents.split('\n') // split at every newline
    var inserting = false
    var removing = false
    for (let i = 0; i < file.length; i++) {
      const line = file[i];
      let spaces = this.leading(line)
      let sentence = line.slice(spaces.length, line.length)
      // end multiline
      if (sentence.startsWith(this.multiline_ending)) {
        inserting = false
        removing = false
      }
      // handle multiline
      if (inserting) {
        this.was_edited = true
        sentence = sentence.replace('// ', '')
      }
      if (removing) {
        this.was_edited = true
        sentence = `// ${sentence}`
      }
      // establish multiline state
      if (sentence.startsWith(this.multiline_insert)) {
        inserting = true
      }
      if (sentence.startsWith(this.multiline_remove)) {
        removing = true
      }
      // // handle single lines
      // if (sentence.startsWith(this.line_insert)) {
      //   this.was_edited = true
      //   sentence = sentence.replace('// ', '')
      // }
      // if (sentence.startsWith(this.line_remove)) {
      //   this.was_edited = true
      //   sentence = `// ${sentence}`
      // }
      // // inline insertion
      // if (this.inline_insert_regex.test(sentence)) {
      //   var temp = sentence.split(this.inline_insert_regex)
      //   for (let x = 0; x < temp.length; x++) {
      //     const part = temp[x];
      //     if (part.endsWith(this.inline_insert_string)) {
      //       this.was_edited = true
      //       temp[x + 1] = temp[x + 1].replace(' /*', '')
      //       continue
      //     }
      //   }
      //   sentence = temp.join('')
      // }
      // // inline removal
      // if (this.inline_remove_regex.test(sentence)) {
      //   var temp = sentence.split(this.inline_remove_regex)
      //   for (let x = 0; x < temp.length; x++) {
      //     const part = temp[x];
      //     if (part.endsWith(this.inline_remove_string)) {
      //       this.was_edited = true
      //       temp[x + 1] = ` /*${temp[x + 1]}`
      //       continue
      //     }
      //   }
      //   sentence = temp.join('')
      // }
      // reconstruct the line and replace it in the file
      file[i] = `${spaces}${sentence}`
    }
    file = file.join('\n') // join file with newlines
    return file
  }
  /**
   * Leading - get the leading whitespace characters from a string
   * @param {String} line Any string or line of code
   */
  leading(line) {
    return line.split(/[^ \s]/)[0]
  }
  /**
   * Get Filename - get the filename from a given full file path
   * @param {String} source Full path to file
   */
  get_filename(source) {
    return source.split('\\').pop()
  }
}

program.name('evoke')
program.version('0.0.1')

program
  .command('build <source> <target>')
  .description('build special comments from source directory to target directory')
  .action((source, target) => build(source, target))

program.parse(process.argv)

/**
 * Build - evokes the source folder js files and copies any new files to target build folder
 * @param {string} source relative source folder path
 * @param {string} target relative target folder path
 */
function build(source, target) {
  console.log(`Called build: ${source} => ${target}`)

  const source_directory = path.resolve(source)
  const target_directory = path.resolve(target)

  fs.ensureDirSync(target_directory) // ensure root build folder path

  const nodes = get_nodes(source_directory)

  nodes.forEach((node) => {
    let destination = node.path.replace(source_directory, target_directory)
    if (node.isFile()) {
      if (node.name.endsWith('.js')) {
        let js = new Scriptoid(node.path, destination)
        // evoke will handle saving the file if it was edited and is different than the target
        if (!js.evoke()) {
          copy_if_newer_or_nonexistant(node.path, destination)
        }
      } else {
        copy_if_newer_or_nonexistant(node.path, destination)
      }
    } else if (node.isFolder()) {
      fs.ensureDirSync(destination)
    }
  })
  console.log(`Edited ${edited} javascript files`)
  console.log(`Copied ${copied} other files`)
  cleanup(source_directory, target_directory)
  reinclude(source, target)
  end()
}

/**
 * Cleanup - removes any files or folders in the target folder structure that don't match the source
 * @param {String} source full source folder path
 * @param {String} target full target folder path
 */
function cleanup(source, target) {
  var deleted = 0
  const nodes = get_nodes(target)
  let project_source = path.resolve('.')
  nodes.forEach((node) => {
    let unlink = node.path
    let test = unlink.replace(target, source)
    if (!fs.existsSync(test)) {
      if (node.isFile()) {
        console.log(`...deleting file ${unlink.replace(project_source, '')}`)
        fs.unlinkSync(unlink)
        deleted++
      }
      if (node.isDirectory()) {
        console.log(`...deleting folder ${unlink.replace(project_source, '')}`)
        fs.removeSync(unlink)
        deleted++
      }
    }
  })
  console.log(`Deleted ${deleted} items`)
}

/**
 * copies source file to target if it's newer or nonexistant
 * @param {string} source full path to source file
 * @param {string} target full path to target file
 */
function copy_if_newer_or_nonexistant(source, target) {
  if (fs.existsSync(target)) {
    let current = fs.statSync(source).mtimeMs
    let replace = fs.statSync(target).mtimeMs
    if (current != replace) {
      fs.copyFileSync(source, target)
      copied++
    }
  } else {
    fs.copyFileSync(source, target)
    copied++
  }
}

/**
 * Get Nodes - recursively gets all files and folders in given directory and all subdirectories
 * @param {string} dir full path of directory to scan
 * @returns {[Node]} Array of node objects
 */
function get_nodes(dir) {
  var nodes = []
  let dirents = fs.readdirSync(dir, {
    withFileTypes: true
  })
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      // handle folder
      nodes.push(new Node(dirent.name, `${dir}\\${dirent.name}`, 'folder'))
      nodes = nodes.concat(get_nodes(`${dir}\\${dirent.name}`))
    } else if (dirent.isFile()) {
      // handle file
      nodes.push(new Node(dirent.name, `${dir}\\${dirent.name}`, 'file'))
    }
  })
  return nodes
}

/**
 * Get Filename - gets filename from the end of a full directory path string
 * @param {string} source full path of directory
 * @returns {string} the actual filename
 */
function get_filename(dir) {
  return dir.split('\\').pop()
}

/**
 * End - measure and print final elapsed time
 */
function end() {
  const end = new Date().getMilliseconds()
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