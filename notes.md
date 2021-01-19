# Notes

Developer notes on Morphmaster Web - completed features, todo roadmap, etc.

## TODO

✅ Refactor evoke script for usage with the web.

* controllers
* filters
* routes
* views?
* services
* directives

## Main Features

The watcher doesn't actually need to change. It will just run the builder whenever something changes.

Evoke needs to have these functions:

* gen - generates a basic component
* add - adds a specific file to the given component
* cleanup (unchanged)

The main thing that needs to change is how exports and imports work. I need to test this junk out.

Idea: all the component codes can be bundled into a single index.js file

Individual files can also be loaded, regardless. Anything with a ".js" ending, tbh.

I know webpack does the same thing, but concatenating all the js files is so much simpler.

Any relative imports need to be commented out, but that never really mattered, anyways.

I could also include a cool header section within the compiled javascript code for releases.

💡 Inline conditional removal! This would replace the current setup of `// ! REMOVE ! //` so that there's no color coordination conflicts.

```javascript
// inline removal:
/*-*/console.log('removed!')/*-*/console.log('remain!')

// inline insertion:
console.log('remain!')/*+*//*console.log('This will be inserted!')/*+*/ console.log('remain!')

// multiline removal:
/*-*/
console.log('This will also be removed!')
/*-*/

// multiline insertion:
/*+*/
// console.log('this will be also inserted!')
/*+*/

```

Pseudocode

...the insertion and removal methods should be recursive somehow...

```javascript
// inline (regex):
// positive lookbehind that matches /*+*/
// capturing group with unlimited regular characters
// positive lookahead that matches /*.*/
var inline_insert = /(?<=\/\*\+\*\/)(.*?)(?=\/\*\.\*\/)/g
var inline_remove = /(?<=\/\*\-\*\/)(.*?)(?=\/\*\.\*\/)/g

// examples:

/*-*/console.log('removed!')/*-*/console.log('remain!')
console.log('remain!')/*+*//*console.log('This will be inserted!')/*.*/ console.log('remain!')

// for insertion: matching strings will have `/*` removed from the start
// for deletion: matching strings will have `/*` inserted at the start

// whole line:

var line_insert = `// /*++*/`
var line_remove = `/*--*/`

// examples:

// /*++*/console.log('inserted!')
/*--*/console.log('removed!')

// for insertion: matching strings will have `// ` removed from the start
// for deletion: matching strings will have `// ` inserted at the start

var multiline_insert = `/*+++*/`
var multiline_remove = `/*---*/`
var multiline_ending = `/*...*/`

// examples:

/*+++*/
// console.log('inserted!')
/*...*/

/*---*/
console.log('removed!')
/*...*/

// pseudo algo

var file = [/*...*/] // an array of strings
var found = false // flag for if the file was changed
var inserting = false // flag for multiline insertion
var removing = false // flag for multiline removal

for (let i = 0; i < file.length; i++) {
  const line = file[i]
  let result = ''
  let spaces = leading(line)
  let sentence = line.slice(spaces.length, line.length)

  if (sentence.startsWith(multiline_insert)) {/*...*/}
  if (sentence.startsWith(multiline_remove)) {/*...*/}
  if (sentence.startsWith(multiline_ending)) {/*...*/}
  if (sentence.startsWith(line_insert)) {/*...*/}
  if (sentence.startsWith(line_remove)) {/*...*/}

  // test regex //

  result = `${spaces}${result}`
}

function leading(line) {
  return line.split(/[^ \s]/)[0]
}

```

One dash or plus ended with a dot for inline
Two slashes and two pluses to insert the current line (removes `// /*++*/` in production)
Two dashes to remove the current line
Three dashes or pluses ended with three dots for multiline
