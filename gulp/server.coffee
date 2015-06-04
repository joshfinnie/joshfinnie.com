module.exports = (connect) ->
    return ->
        connect.server({
            root: ['output']
            port: 8080
            livereload: true
        })
