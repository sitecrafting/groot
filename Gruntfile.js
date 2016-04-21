/*global module:false*/
module.exports = function(grunt) {

  var AutoPrefix = require('less-plugin-autoprefix');

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
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
        src: 'js/project/*.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: 'js/project/*.js',
        tasks: ['jshint:theme', 'concat:js', 'uglify:js', 'assets_version']
      },
      less: {
        files: 'less/**/*.less',
        tasks: ['less', 'assets_version']
      },
    },
    phpdocumentor: {
      dist: {
        options: {
          target: 'doc'
        }
      }
    },
    bower: {
      install: {
        options: {
          install: true,
          copy: false
        }
      }
    },
    modernizr: {
      dist: {
        "dest": "js/modernizr/modernizr-custom-build.js",
        "devFile": false,
        "parseFiles": true,
        "customTests": [],
        "tests": [
          "geolocation",
          "input",
          "inputtypes",
          "svg",
          "css/animations",
          "css/boxsizing",
          "css/flexbox",
          "css/flexboxlegacy",
          "css/lastchild",
          "css/multiplebgs",
          "css/pointerevents",
          "css/positionsticky",
          "css/rgba",
          "css/transforms",
          "css/transforms3d",
          "css/transitions",
          "svg/clippaths",
          "svg/inline"
        ],
        "extensibility": [
          "domPrefixes",
          "prefixes",
          "testAllProps",
          "testProp",
          "testStyles",
          "html5shiv",
          "setClasses"
        ],
        "uglify": false
      }
    },
    concat: {
      js: {
        // All these files will be concatenated and served together.
        // This is where you should add additional front-end dependencies, such as jQuery UI.
        // NOTE: files are concatenated in the order they are declared, so upstream dependencies
        // should be declared here first, e.g. jQuery UI would be declared after jQuery core.
        src: [
          'js/modernizr/modernizr-custom-build.js',
          'bower_components/flexslider/jquery.flexslider.js',
          'bower_components/jquery-selectric/public/jquery.selectric.js',
          'bower_components/jquery-placeholder/jquery.placeholder.js',
          'js/project/responsive-nav.jquery.js',
          'js/project/common.js'
        ],
        dest: 'js/project-common.js',
        nonull: true
      }
    },
    less: {
      development: {
        options: {
          compress: true,
          plugins: [
            new AutoPrefix({browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'})
          ]
        },
        files: {
          'style.css': 'less/style.less'
        }
      }
    },
    uglify: {
      js: {
        files: {
          'js/project-common.min.js': ['js/project-common.js']
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-phpdocumentor');
  grunt.loadNpmTasks('grunt-bower-installer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-modernizr');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat:js', 'uglify:js', 'less', 'watch']);
  grunt.registerTask('front-end', ['bower:install', 'modernizr:dist', 'less', 'jshint', 'concat:js', 'uglify:js']);
  grunt.registerTask('doc', ['phpdocumentor']);
};
