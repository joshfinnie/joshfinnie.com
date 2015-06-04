gulp = require "gulp"
gutil = require "gulp-util"

connect = require "gulp-connect"

# Serve the generate html on localhost/localdocker:8080
gulp.task "serve", require('./server')(connect)

# Styles for the site. Turns .scss files into a single main.css
gulp.task "scss", require('./scss')(gulp, connect)

# Build the development html.
gulp.task "html", require('./html')(gulp, connect)

# Build the production html.
gulp.task "publish", require('./publish')

# Runs the build commands without booting up the server
gulp.task("build", ["scss", "html"])

gulp.task("default", ["build", "serve"], ->
    gulp.watch("theme/styles/**/*.scss", ["scss"])
    gulp.watch("theme/static/css/**/*.css", ["html"])
    gulp.watch("theme/templates/**/*.html", ["html"])
    gulp.watch("content/**/*.md", ["html"])
)
