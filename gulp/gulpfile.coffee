gulp = require "gulp"
gutil = require "gulp-util"
connect = require "gulp-connect"

server = require("./server")(gulp, connect)
scss = require('./scss')(gulp, connect)
html = require('./html')(gulp, connect)
publish = require('./publish')(gulp)

# Runs the build commands without booting up the server
gulp.task("build", ["scss", "html"])

gulp.task("default", ["build", "serve"], ->
    gulp.watch("theme/styles/**/*.scss", ["scss"])
    gulp.watch("theme/static/css/**/*.css", ["html"])
    gulp.watch("theme/templates/**/*.html", ["html"])
    gulp.watch("content/**/*.md", ["html"])
)
