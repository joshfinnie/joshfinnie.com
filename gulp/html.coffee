run = require "gulp-shell"

module.exports = (gulp, connect) ->
    return ->
        gulp.src("output/index.html")
            .pipe(run("pelican content -s pelicanconf.py"))
            .pipe(connect.reload())
