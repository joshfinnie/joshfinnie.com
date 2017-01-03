import gulp from "gulp"
import gutil from "gulp-util"
import sass from "gulp-sass"
import sourcemaps from "gulp-sourcemaps"
import autoprefixer from "gulp-autoprefixer"
import cleanCSS from "gulp-clean-css"
import run from "gulp-shell"
import connect from "gulp-connect"

gulp.task("connect", function() {
  return connect.server({
    root: ["output"],
    port: 8080,
    livereload: true
  })
})

gulp.task("scss", function() {
  return gulp.src("theme/styles/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("theme/static/css"))
})

gulp.task("builddev", ["scss"], function() {
  return gulp.src("")
    .pipe(run("pelican content -s pelicanconf.py"))
})

gulp.task("buildprod", ["scss"], function() {
  return gulp.src("")
    .pipe(run("pelican content -s publishconf.py"))
})

gulp.task("html", ["builddev"], function() {
  return gulp.src("")
    .pipe(connect.reload())
})

gulp.task("publish", ["buildprod"], function() {
  return gulp.src("")
    .pipe(run("s3cmd sync --cf-invalidate --cf-invalidate-default-index --delete-removed output/ s3://www.joshfinnie.com"))
})

gulp.task("watch", function() {
  gulp.watch("theme/styles/**/*.scss", ["scss"])
  gulp.watch("theme/static/css/**/*.css", ["html"])
  gulp.watch("theme/templates/**/*.html", ["html"])
  gulp.watch("content/**/*.md", ["html"])
  return
})

gulp.task("default", ["builddev", "watch", "connect"])
