const fs = require('fs')
const glob = require('glob')

class DeleteAfterBuildPlugin {
  constructor(options) {
    this.options = options || {}
  }

  apply(compiler) {
    compiler.plugin('done', (compilation) => {
      const paths = this.options.paths || []
      paths.forEach((path) => {

        // delete all matching files for this glob
        glob(path, {}, (err, files) => {
          if (err) throw err

          files.forEach((file) => {
            fs.unlink(file, (err) => {
              if (err) throw err

              if (this.options.verbose) {
                console.log(`deleted ${file}`)
              }
            })
          })

        })
      })
    })
  }
}

module.exports = DeleteAfterBuildPlugin
