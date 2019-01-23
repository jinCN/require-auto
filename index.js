const p = require('path')
const child_process = require('child_process')
const jsonFile = require('edit-json-file')
const hacker = require('require-hacker')

let hook = hookRequire()

/***
 * cwd: where installation take place
 * silent: don't log output
 * excludeNodeModules: don't hook require in node_modules
 */
let options = {
  cwd: p.dirname(module.parent.filename),
  silent: false,
  excludeNodeModules: false
}

module.exports = {
  option (opt) {
    Object.assign(options, opt)
  },
  unhook () {
    hook && hook.unmount()
    hook = undefined
  },
  hook () {
    hook = hook || hookRequire()
  }
}

function hookRequire () {
  return hacker.resolver((path, module) => {
    let insideNodeModules = module && module.filename &&
      (p.dirname(module.filename) + '/').includes('/node_modules/')
    let relativeNonDotPath = !p.isAbsolute(path) && !path.startsWith('./') &&
      !path.startsWith('../') && path !== '.' && path !== '..'
    let toHook = true
    if (options.excludeNodeModules) {
      if (insideNodeModules) {
        toHook = false
      }
    }
    if (!relativeNonDotPath) {
      toHook = false
    }
    if (toHook) {
      try {
        return hacker.resolve(path, module)
      } catch (e) {
        // install then resolve if first resolve failed
        let splits = path.split('/')
        let packageName
        if (splits[0].startsWith('@')) {
          if (splits[1] == null) {
            throw new Error(`fail to install, wrong format as npm package: ${path}`)
          }
          packageName = splits[0] + '/' + splits[1]
        } else {
          packageName = splits[0]
        }
        
        installPackage(packageName)
        
        return hacker.resolve(p.resolve(options.cwd, 'node_modules', path), module)
      }
    }
  })
}

function installPackage (packageName) {
  let cwd = options.cwd
  const packageJson = jsonFile(p.join(cwd, 'package.json'))
  let packageJsonObject = packageJson.get()
  if (!packageJsonObject.name || !packageJsonObject.version) {
    packageJsonObject.name = packageJsonObject.name || 'require-auto-project'
    packageJsonObject.version = packageJsonObject.version || '0.0.0'
    packageJsonObject.license = packageJsonObject.license || 'MIT'
    packageJsonObject.description = packageJsonObject.description || '-'
    packageJsonObject.repository = packageJsonObject.repository || '-'
    packageJson.save()
  }
  !options.silent && console.log(`$ npm i ${packageName}`)
  try {
    var stdout = child_process.execSync(`npm i ${packageName}`, {
      cwd,
      timeout: 20000
    })
  } catch (e) {
    stdout = e.stdout
    throw e
  } finally {
    !options.silent && console.log(stdout.toString())
  }
}
