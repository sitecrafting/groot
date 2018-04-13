/*global module:false*/
module.exports = function(grunt) {

  var AutoPrefix = require('less-plugin-autoprefix');

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        esversion: 6,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        reporterOutput: '',
        globals: {
          'jQuery': true,
          'window': true,
          'document': true,
          'alert': true,
          'console': true,
          'require': true,
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      theme: {
        src: 'js/src/*.js'
      }
    },
    browserify: {
      main: {
        src: 'js/src/common.js',
        dest: 'js/browserified/common.js'
      }
    },
    concat: {
      js: {
        // All these files will be concatenated and served together.
        //jQuery core is included with the default codebase of wordpress
        src: [
          'js/browserified/common.js'
        ],
        dest: 'js/dist/common.js',
        nonull: true
      }
    },
    uglify: {
      js: {
        files: {
          'js/dist/common.min.js': ['js/dist/common.js']
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: 'js/src/*.js',
        tasks: ['jshint:theme', 'browserify', 'concat:js', 'uglify:js', 'assets_version']
      },
      less: {
        files: 'less/**/*.less',
        tasks: ['less', 'assets_version']
      },
    },
    less: {
      development: {
        options: {
          sourceMap: true,
          compress: true,
          plugins: [
            new AutoPrefix({browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'})
          ]
        },
        files: {
          'style.css': 'less/style.less',
          'print.css': 'less/style-print.less'
        }
      }
    }
  });

  /*
   * Generate a new asset.version file for cache busting,
   * based off of Date.now()
   */
  grunt.registerTask(
    'assets_version',
    'Generate a new assets.version file for cache busting',
    function() {
      var date = Date.now();
      grunt.file.write( 'assets.version', date );
    }
  );

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-modernizr');

  // Default task.
  grunt.registerTask('default', ['jshint', 'browserify', 'concat:js', 'uglify:js', 'less', 'watch']);
  grunt.registerTask('front-end', ['less', 'jshint', 'concat:js', 'uglify:js']);
};
