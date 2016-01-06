run = require "gulp-shell"

module.exports = (gulp, connect) ->
    gulp.task 'html', ->
        gulp.src("output/index.html")
            .pipe(run("pelican content -s pelicanconf.py"))
            .pipe(connect.reload())
