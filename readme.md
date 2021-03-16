# Morphmaster-Web

A simple starter boilerplate web application for building web applications with AngularJS and Bootstrap on Windows.

Morphmaster also exists as an electron application framework. Check out the [github page](https://github.com/Malcomian/Morphmaster) for more details.

## Getting Started

The main feature of this framework is the inclusion of a few command-line utilities that can add some special functionality to your build environment and speed up production.

Here's the typical setup process: first, create a new folder with the name of the project that you want. Then, unzip the contents of this project to that folder and run `npm install` to download all the node modules used in this project. Then, run `npm run morph` to change some of the basic project information in `package.json`. Then you can start generating components based on the application structure that you need or carry on as normal in your development process.

The current project structure makes liberal usage of a unique transpiling script, [abjure](https://www.npmjs.com/package/abjure). Abjure gives the developer a special sort of on-demand intellisense inside of javascript files that helps reveal the contents of other javascript files without affecting the final build. Run `npm run watch` to run [chokidar-cli](https://www.npmjs.com/package/chokidar-cli) on the `src` folder - whenever a file is created, updated, or destroyed in the `src` folder, the build script will be invoked and the project will rebuild. See the [project page](https://www.npmjs.com/package/abjure) for abjure for more details on how it works.

### Morph

The morph script is for changing the project name in `package.json` based upon the name of the folder that the project resides in. So, for example, when you start a new project, you can simply rename the root folder of the project and call it the name of your choice. Then, run the morph script to rename the package name in `package.json` to the name of the folder. There will be a prompt for renaming the product name, which is typically capitalized or different than the project name.

```bash
# run morph script
npm run morph
```

### Zip

The zip script is for archiving the current project using a simple zip cli utility, [zipadeedoodah](https://www.npmjs.com/package/zipadeedoodah). Everything except the `node_modules`, `dist`, `build` and `.git` folders within the root project folder will be put into a single zip file. The name of the resulting zip file will be the project name followed by a timestamp and an optional note, which the script will prompt the user for. The zip file is saved next to the root project folder. This is useful for making snapshots of the project without pushing anything to github.

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

The evoke script is a command line interface utility that handles the generation of angular components within the project. It has two main commands - `gen` and `reinclude`.

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

In evoke.js, the base appname (angular app name) and controller_postfix (extension string for controller files) variables can be edited to suit your own coding style. I like to use snake case (underscores) instead of camelcase.

#### Reinclude

The reinclude method scans the components folder and writes a link to each components' `index.js` file after the comment, `<!-- ! COMPONENTS ! -->` within the main index.html file inside the build folder. This method is run after every `gen` command.

### Watch

Watches the source folder using Chokidar and then automatically runs `npm run build` when a new file or folder is added or an existing file or folder is changed within the source folder.

```bash
npm run watch
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
* **[commander](https://www.npmjs.com/package/commander):** A module for creating command line applications. Required for `evoke.js` commands.

### Dev Dependencies

* **[abjure](https://www.npmjs.com/package/abjure):** A command line interface utility that enables a special sort of intellisense by transpiling javascript files that contain certain patterns that "comment in" or "comment out" sections of code.
* **[chokidar-cli](https://www.npmjs.com/package/chokidar-cli):** Watches the `./src` directory for changes to automatically run the build script.
* **[electron](https://www.electronjs.org/):** This is an electron app, after all.
* **[electron-builder](https://www.electron.build/):** The flavor of electron builder I chose. The build options are specified within `package.json`. Currently set to build a simple NSIS-based installer executable for windows.
* **[fs-extra](https://www.npmjs.com/package/fs-extra):** A drop-in replacement for the node's native fs module. Required for `evoke.js`.
* **[zipadeedoodah](https://www.npmjs.com/package/zipadeedoodah):** A simple CLI zip utility based on glob patterns with minimal setup.
