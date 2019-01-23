#!/usr/bin/env node
const p = require('path')
if(!process.argv[2]){
  throw new Error(`argv[2] not exist, can't exec command: ${process.argv}`)
}

let mainJs = p.resolve(process.argv[2])
require('.').option({cwd: p.dirname(mainJs)})

// Rename the process
process.title = 'node ' + mainJs;

// Require the real application
require('module')._load(mainJs, null, true);

// Change some values to make node think that the user's application
// was started directly such as `node app.js`
process.mainModule = process.mainModule || {};
process.mainModule.loaded = false;
require.main = process.mainModule;
