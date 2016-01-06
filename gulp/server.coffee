module.exports = (gulp, connect) ->
    gulp.task 'serve', ->
        connect.server({
            root: ['output']
            port: 8080
            livereload: true
        })
