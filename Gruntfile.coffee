#global module

module.exports = (grunt) ->
  "use strict"

  grunt.loadNpmTasks 'grunt-sass'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-coffeelint'

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    meta: {
      banner: "/****************************************************************************************\n" +
              " * Version <%= pkg.version %>\n" +
              " *\n" +
              " * Copyright <%= grunt.template.today(\"yyyy\") %> Josh Finnie\n" +
              " * Licensed under the Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)\n" +
              " * http://creativecommons.org/licenses/by-nc-sa/3.0/\n" +
              " ****************************************************************************************/\n"
    }

    sass:
      dist:
        files:
          'theme/static/css/main.css': 'theme/static/css/_scss/style.scss'

    cssmin:
      options:
        banner: "<%= meta.banner %>"
      minify:
        files:
          'theme/static/css/main.min.css': 'theme/static/css/main.css'

    jshint:
      options:
        jshintrc: true
      all: ['theme/static/js/main.js']

    coffeelint:
      options:
        configFile: 'coffeelint.json'
      files: ['Gruntfile.coffee']

    uglify:
      options:
        banner: "<%= meta.banner %>"
      javascript:
        files:
          'theme/static/js/main.min.js': 'theme/static/js/main.js'

    shell:
      generate:
        options:
          stdout: true
          stderr: true
        command: 'pelican content -s pelicanconf.py -t theme'
      pubgen:
        options:
          stdout: true
          stderr: true
        command: 'pelican content -s publishconf.py -t theme'
      serve:
        options:
          stdout: true
          stderr: true
        command: 'fab serve'
      deploy:
        options:
          stdout: true
          stderr: true
        command: "s3cmd sync --cf-invalidate --cf-invalidate-default-index --delete-removed output/ s3://www.joshfinnie.com"
    
  grunt.registerTask 'default', ['sass', 'cssmin', 'jshint', 'coffeelint', 'uglify']
  grunt.registerTask 'gen', ['default', 'shell:generate']
  grunt.registerTask 'css', ['sass', "cssmin"]
  grunt.registerTask 'serve', ['gen', 'shell:serve']
  grunt.registerTask 'deploy', ['default', 'shell:pubgen', 'shell:deploy']
