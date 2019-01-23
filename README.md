# [@superjs](https://www.npmjs.com/org/superjs)/require-auto
start node script without node_modules, install on require.

## Thought
No package.json, no node_modules, simply write the script, require dependencies, and run with `require-auto`

## Example

Install `@superjs/require-auto` globally:
```bash
npm i -g @superjs/require-auto
```
Then you can start a node script like this:
```bash
require-auto app.js
```
The dependencies will be installed in the dir of app.js.

You can also write `app.js` with first line as `#!/usr/bin/env require-auto`, just like below: 
```javascript
#!/usr/bin/env require-auto

const superagent = require('superagent')
const wait = require('@superjs/wait')
let { body } = wait(superagent.get('https://api.npms.io/v2/search?q=scope:superjs'))
console.log(`body:`, body)
```

Run it with
```bash
./app.js
```

## Programmatic Usage
```javascript
//after this, hook created for require, for every file
require('@superjs/require-auto') 

//if 'something' can't be resolved, I will `npm i something` then require it
require('something')
```

## API
### require('@superjs/require-auto') 
* `returns`: `requireAuto`, return singleton for the lib 

hook is created when the lib is required


### `requireAuto.option(opt)`
 * `opt`: option to specify
 
change the specific option of `requireAuto`.

available options are listed below:
 * `cwd`: where installation take place, default to the dir of `module.parent`(who first call`require
 ('@superjs/require-auto')`)
 * `silent`: don't log output, default to `false`
 * `excludeNodeModules`: don't hook require in node_modules, default to `false`.
