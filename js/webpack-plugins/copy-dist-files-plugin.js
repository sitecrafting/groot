const fs = require('fs')

// Simple plugin for copying compiled stylesheets to theme directory
class CopyDistFilesPlugin {
  constructor(files) {
    this.files = files
  }

  apply() {
    for (const distFile in this.files) {
      const contents = fs.readFileSync(distFile)
      const dest     = this.files[distFile]

      fs.writeFileSync(dest, contents)
    }
  }
}

module.exports = CopyDistFilesPlugin
