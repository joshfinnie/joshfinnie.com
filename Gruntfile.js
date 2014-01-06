module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          '_source/_assets/css/main.css': '_source/_assets/css/_scss/style.scss'
        }
      }
    },
    cssmin: {
      options: {
        banner: '/****************************************************************************************\n' +
                ' * Version <%= pkg.version %>\n' + 
                ' *\n' +
                ' * Copyright <%= grunt.template.today("yyyy") %> Josh Finnie\n' +
                ' * Licensed under the Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)\n' +
                ' * http://creativecommons.org/licenses/by-nc-sa/3.0/\n' +
                ' ****************************************************************************************/'
      },
      minify: {
        expand: true,
        cwd: '_source/_assets/css',
        src: ['*.css', '!*.min.css'],
        dest: '_source/_assets/css',
        ext: '.min.css'
      }
    },
    jshint: {
      all: ['Gruntfile.js', '_source/_assets/js/main.js']
    },
    uglify: {
      options: {
        banner: '/****************************************************************************************\n' +
                ' * Version <%= pkg.version %>\n' + 
                ' *\n' +
                ' * Copyright <%= grunt.template.today("yyyy") %> Josh Finnie\n' +
                ' * Licensed under the Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)\n' +
                ' * http://creativecommons.org/licenses/by-nc-sa/3.0/\n' +
                ' ****************************************************************************************/'
      },
      my_target: {
        files: {
          '_source/_assets/js/main.min.js': ['_source/_assets/js/main.js']
        }
      }
    },
    shell: {
      generate: {
        command: 'mynt gen -c _source/ _site/',
        options: {
          stdout: true,
          etderr: true
        }
      },
      serve: {
        options: {
          stdout: true,
          etderr: true
        },
        command: 'mynt serve _site/'
      },
      deploy: {
        options: {
          stdout: true,
          etderr: true
        },
        command: "s3cmd sync --add-header='Cache-Control: max-age=31536000' _site/ s3://www.joshfinnie.com"
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['sass', 'cssmin', 'jshint', 'uglify']);
  grunt.registerTask('gen', ['default', 'shell:generate']);
  grunt.registerTask('serve', ['gen', 'shell:serve']);
  grunt.registerTask('deploy', ['shell:deploy']);

};