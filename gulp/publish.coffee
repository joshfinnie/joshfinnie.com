run = require "gulp-shell"

module.exports = ->
    return ->
        gulp.src("output/index.html")
            .pipe(run("pelican content -s publishconf.py"))
            .pipe(run("s3cmd sync --cf-invalidate --cf-invalidate-default-index --delete-removed output/ s3://www.joshfinnie.com"))
