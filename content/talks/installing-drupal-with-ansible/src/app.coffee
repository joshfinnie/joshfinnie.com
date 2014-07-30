#!/usr/local/bin/node

fs          = require("fs")
path        = require("path")
marked      = require("marked")
jade        = require("jade")
renderer    = new marked.Renderer()

firstSlide  = true

renderer.paragraph = (text) ->
  if text is "!slide" and firstSlide
    firstSlide = false
    "<section>\n"
  else if text is "!slide"
    "</section>\n<section>\n"
  else
    "<p>" + text + "</p>\n"

highlight = (code, lang, callback) ->
  require("pygmentize-bundled")
    lang: lang
    format: "html", code, (err, result) ->
      callback err, result.toString()

marked.setOptions
  highligh: highlight
  renderer: renderer

slides = path.join(__dirname + '/../templates/slides.md')
template = path.join(__dirname + '/../templates/index.jade')
presentation = path.join(__dirname + '/../presentation/index.html')

fs.readFile slides, (err, data) ->
  throw err if err
  marked data.toString(), (err, content) ->
    throw err if err
    jade.renderFile template,
      content: content
      pretty: true, (err, html) ->
        throw err if err
        fs.writeFile presentation, html, (err) ->
          if err
            console.log err
          else
            console.log "File was written."
