const fs = require('fs')

// Simple plugin to write to assets.version file for cache-busting
class AssetsVersionPlugin {
  apply() {
    fs.writeFile('assets.version', Date.now().toString(), (err) => {
      if (err) {
        console.log("Error writing assets.version: ", err)
      }
    })
  }
}

module.exports = AssetsVersionPlugin
