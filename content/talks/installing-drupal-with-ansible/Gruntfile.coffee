module.exports = (grunt) ->
  "use strict"

  require("load-grunt-tasks")(grunt)
  require("time-grunt")(grunt)

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    watch:
      livereload:
        options:
          livereload: true
        files: [
          'templates/index.jade'
          'templates/slides.md'
        ]
      coffeelint:
        files: [
          'Gruntfile.coffee'
          'src/app.coffee'
        ]
        tasks: [
          'coffeelint'
        ]
      createApp:
        files: [
          'templates/index.jade'
          'templates/slides.md'
          'src/app.coffee'
        ]
        tasks: [
          'coffee'
          'shell:runApp'
        ]
    coffeelint:
      all: [
        'Gruntfile.coffee'
        'src/app.coffee'
      ]
    coffee:
      compile:
        options:
          bare: true
        files:
          "src/app.js": "src/app.coffee"
    uglify:
      option:
        banner: "#!/usr/local/bin/node"
      target:
        files:
          "bin/app.js": ["src/app.js"]
    shell:
      runApp:
        options:
          stout: true
        command: "node bin/app.js"
    connect:
      livereload:
        options:
          port: 9000
          hostname: 'localhost'
          base: 'presentation'
          open: true
          livereload: true

  grunt.registerTask "default", [
    "coffeelint"
    "coffee:compile"
    "uglify"
    "shell:runApp"
  ]
  grunt.registerTask "serve", [
    "default"
    "connect:livereload"
    "watch"
  ]
