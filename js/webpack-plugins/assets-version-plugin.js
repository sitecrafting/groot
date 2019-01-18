const fs = require('fs')

// Simple plugin to write to assets.version file for cache-busting
class AssetsVersionPlugin {
  apply() {
    fs.writeFileSync('assets.version', Date.now().toString())
  }
}

module.exports = AssetsVersionPlugin
