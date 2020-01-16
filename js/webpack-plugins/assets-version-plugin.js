const fs = require('fs')

// Simple plugin to write to assets.version file for cache-busting
class AssetsVersionPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.done.tap('asdf', stats => {
      const versionFile = this.options.versionFile || 'assets.version'
      const version     = Date.now().toString()
      fs.writeFileSync(versionFile, version)
      console.log(`⌚ Overwrote ${versionFile}  ⬅️  ${version}`)
    })
  }
}

module.exports = AssetsVersionPlugin
