const fs = require('fs')

// Simple plugin for copying compiled stylesheets to theme directory
class CopyDistFilesPlugin {
  constructor(files) {
    this.files = files
  }

  apply() {
    for (const distFile in this.files) {
      fs.readFile(distFile, (err, contents) => {
        if (err) {
          console.log(`Error reading ${distFile} `, err);
        } else {
          const dest = this.files[distFile];
          fs.writeFile(dest, contents, (err) => {
            if (err) {
              console.log('Error writing to ${dest}: ', err);
            }
          })
        }
      })
    }
  }
}

module.exports = CopyDistFilesPlugin
