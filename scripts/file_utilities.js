const fs = require('fs')
const path = require('path')

class Branch {
  constructor(name, path, depth, isDirectory, isFile, branches) {
    this.name = name
    this.path = path
    this.depth = depth
    this.isDirectory = isDirectory
    this.isFile = isFile
    this.branches = branches
  }
}

class Tree {
  constructor(dir) {
    this.root = dir
    this.trunk = this.grow(dir)
  }
  log(branches) {
    var text = ''
    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      if (branch.isDirectory) {
        for (let x = 0; x < branch.depth; x++) {
          text += '  '
        }
        text += `${branch.name}/\n`
        text += this.log(branch.branches)
      } else if (branch.isFile) {
        for (let x = 0; x < branch.depth; x++) {
          text += '  '
        }
        text += `${branch.name}\n`
      }
    }
    return text
  }
  grow(dir, depth) {
    if (depth == undefined) depth = 0
    var tree = []
    let dirents = fs.readdirSync(dir, {
      withFileTypes: true
    })
    dirents.forEach((dirent) => {
      if (dirent.isDirectory()) {
        tree.push(new Branch(dirent.name, `${dir}\\${dirent.name}`, depth, true, false, this.grow(`${dir}\\${dirent.name}`, depth + 1)))
      } else if (dirent.isFile()) {
        tree.push(new Branch(dirent.name, `${dir}\\${dirent.name}`, depth, false, true, {}))
      }
    })
    return tree
  }
}

// var files = get_files(path.resolve('./src'))
// console.log(files)

var tree = new Tree(path.resolve('./src'))
console.log(tree.log(tree.trunk))

/**
 * Get Files - recursively gets all files in given directory and all subdirectories
 * @param {String} dir full path of directory to scan
 */
function get_files(dir) {
  // console.log(`Getting files in directory, "${dir}"...`)
  var files = []
  let dirents = fs.readdirSync(dir, {
    withFileTypes: true
  })
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      // console.log(`--recursion--`)
      files = files.concat(get_files(`${dir}\\${dirent.name}`))
    } else if (dirent.isFile()) {
      // console.log(`...Adding ${dirent.name}...`)
      files.push(`${dir}\\${dirent.name}`)
    }
  })
  return files
}

/**
 * Get Tree - recursively gets all files in given directory and all subdirectories
 * @param {string} dir full path of directory
 * @param {number} [depth] optional, defaults to zero
 */
function get_tree(dir, depth) {
  if (depth == undefined) depth = 0
  var tree = []
  let dirents = fs.readdirSync(dir, {
    withFileTypes: true
  })
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      tree.push(new Branch(dirent.name, `${dir}\\${dirent.name}`, depth, true, false, get_tree(`${dir}\\${dirent.name}`, depth + 1)))
    } else if (dirent.isFile()) {
      tree.push(new Branch(dirent.name, `${dir}\\${dirent.name}`, depth, false, true, {}))
    }
  })
  return tree
}

/**
 * Get Filename - gets filename from the end of a full directory path string
 * @param {String} source full path of directory
 */
function get_filename(dir) {
  return dir.split('\\').pop()
}