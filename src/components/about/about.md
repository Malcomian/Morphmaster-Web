# Morphmaster Web

A special framework for building single page web applications with AngularJS and Bootstrap on Windows.

## Getting Started

The main feature of this framework is the inclusion of a few command-line utilities that can add some special functionality to your build environment and speed up production.

Here's the typical setup process: first, create a new folder with the name of the project that you want. Then, unzip the contents of this project to that folder and run `npm install` to download all the node modules used in this project. Then, run `npm run morph` to change some of the basic project information in `package.json`. Then you can start generating components based on the application structure that you need or carry on as normal in your development process.

The current project structure is set up in "build mode". You can either run `watch.js` with `npm run watch` or you can manually build the project after creating or editing files and directories inside of the `src` folder with `npm run build`. You can then start the app in another termainl with `npm start`, which runs `electron .`. See below for more details on the different scripts and setups available.

### Morph

The morph script is for changing the project name in `package.json` based upon the name of the folder that the project resides in. So, for example, when you start a new project, you can simply rename the root folder of the project and call it the name of your choice. Then, run the morph script to rename the package name in `package.json` to the name of the folder. There will be a prompt for renaming the product name, which is typically capitalized or different than the project name.

```bash
# run morph script
npm run morph
```

### Zip

The zip script is for archiving the current project. Everything within the root project folder will be put into a single zip file. The name of the file will be the project name followed by a timestamp and an optional note. The zip file is saved next to the root project folder. Requires 7zip.

```bash
npm run zip
```

### Update Version

The update-version script is for updating the package's version. Simple as can be. Updating to a minor version will reset the patch to zero, and updating to a major version will reset both the minor and patch versions to zero. You can also set the version manually.

```bash
# version 0.0.1
npm run update-version patch
# version 0.0.2
npm run update-version minor
# version 0.1.0
npm run update-version major
# version 1.0.0
npm run update-version set 0.0.1
# version 0.0.1
```

### Evoke

The evoke script is a command line interface utility that can transpile a source directory into a build directory but with some special features in regards to javascript files. It will look for special comment lines and either "comment in" or "comment out" those sections based on some simple patterns. The main idea is that this feature allows for special imports between javascript files that wouldn't normally be able to import or export their code. This allows the developer a type of on-demand special intellisense.

For inserting and removing multiple lines, start with `/*+++*/` for inserting code and `/*---*/` for removing code. End these sections with `/*...*/`. Everything between these lines will either be inserted (whereby double slash comments will be removed from the start of the line) or removed (whereby double slash comments will be added to the start of the line). Note that these lines only need to start with these patterns (ignoring any leading space or tab characters), which can be helpful for extra comments.

**Example:** look at the following example source code:

```javascript
/*+++*/
// console.log('this will be inserted at build!')
/*...*/

/*---*/
console.log('this will be removed at build!')
/*...*/
```

When the project builds, the code will turn into the following:

```javascript
/*+++*/
console.log('this will be inserted at build!')
/*...*/

/*---*/
// console.log('this will be removed at build!')
/*...*/
```

As a side note, I thought it'd be worthwhile to mention that - for convenience - these patterns are meant to be typed using only one hand on a number pad.

#### Build

To build and run the project, run the `build` project script, which is currently set to `node ./scripts/evoke.js "./src" "./build"`.

```bash
npm run build
# or
npm run evoke build "./src" "./build"
```

The build command will scan the given source directory for javascript files that contain any special comment sections. It will then comment out those sections and output the exact same folder and file structure to the target directory (but will also only copy files that are newer in the source folder than the target build folder).

The build script will also run a "reinclude" function that inserts all the script import statements for each index.js file in each component folder into the main index.html file after the `<!-- ! COMPONENTS ! -->` comment.

Note that after the build script is run, a cleanup function will remove any files or folders within the build directory that do not match the source.

#### Gen

The gen command creates AngularJS components based on some simple templates included in `./scripts/lib`. The given name will be used as the component's folder name and will also be used as the name for the base html template. The given URL will be used as the route to the component within the application. All JS code relating to a particular component should be included within the index.js file within the component's folder.

```bash
# Note that in bash, a single slash must be escaped as a double slash or else it returns a specific path string
# gen <name> <url>
npm run gen "home" //home
npm run gen "users" //users
npm run gen "user" /users/:user
```

Note that some routes ought to be manually changed, as in the case of the `.otherwise` route condition. The current project includes a "404" route as an example.

In evoke.js, the base appname (angular app name) and controller_postfix (extension string for controller files) variables can be edited to suit your own coding style. I like to use underscores instead of camelcase.

### Watch

Watches the source folder using Chokidar and then automatically runs `npm run build` when a new file or folder is added or an existing file or folder is changed within the source folder. Dotfiles are ignored from the watch list, so when the project is rebuilt using the build command, the file `.app.json` will not trigger an infinite loop of rebuilding and remapping the project.

```bash
npm run watch
# equivalent to
node ./scripts/watch.js "./src"
```

---

## sortable.js

This file contains a very handy function that, when given a css selector for a search input and a table, will add search filtering and row sorting functionality to the given table. This is a simple client-based algo - it only works on a table that is completely displayed and doesn't integrate with AngularJS at all, but it's perfect for any project. Requires jQuery.

---

## Project Structure

```text
project_name/           root project folder
  .vscode/              vscode settings folder
    settings.json       removes build folder from search and explorer
  build/                the build folder mirrors the source folder
  node_modules/         node modules folder
  scripts/              npm scripts folder
  src/                  main source folder
    components/         components folder
    css/                css folder contains source and compiled scss
    img/                images
    js/                 javascript models and app info
    templates/          various html templates
    index.html          main index html file
    index.js            main js file for defining the base angular app
  notes.md              development notes
  package-lock.json     idk what package-lock does and I'm afraid to ask
  package.json          npm package file
  readme.md             readme markdown file
```

---

## Packages

The following is a list of packages used in this project.

### Dependencies

Because this is meant to be a single page web application framework, the only real dependencies for the project are associated with the node build environment. The main index.html file should primarily rely on online repos for importing AngularJS, BootstrapJS, and other scripts. The only exception is that the main style.scss file imports Bootstrap's scss file for convenience.

* **[bootstrap](https://getbootstrap.com/):** The base CSS framework, imported into the main `style.scss` file.
* **[chokidar](https://www.npmjs.com/package/chokidar):** Watches the `./src` directory for changes to automatically run the build script.
* **[commander](https://www.npmjs.com/package/commander):** A module for creating command line applications. Required for `evoke.js` commands.
* **[fs-extra](https://www.npmjs.com/package/fs-extra):** A drop-in replacement for the node's native fs module. Required for `evoke.js`.
* **[js-beautify](https://beautifier.io/):** A library to beautify javascripts. Required for `morph.js`.
