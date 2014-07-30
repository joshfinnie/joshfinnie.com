var firstSlide, fs, highlight, jade, marked, path, presentation, renderer, slides, template;

fs = require("fs");

path = require("path");

marked = require("marked");

jade = require("jade");

renderer = new marked.Renderer();

firstSlide = true;

renderer.paragraph = function(text) {
  if (text === "!slide" && firstSlide) {
    firstSlide = false;
    return "<section>\n";
  } else if (text === "!slide") {
    return "</section>\n<section>\n";
  } else {
    return "<p>" + text + "</p>\n";
  }
};

highlight = function(code, lang, callback) {
  return require("pygmentize-bundled")({
    lang: lang,
    format: "html"
  }, code, function(err, result) {
    return callback(err, result.toString());
  });
};

marked.setOptions({
  highligh: highlight,
  renderer: renderer
});

slides = path.join(__dirname + '/../templates/slides.md');

template = path.join(__dirname + '/../templates/index.jade');

presentation = path.join(__dirname + '/../presentation/index.html');

fs.readFile(slides, function(err, data) {
  if (err) {
    throw err;
  }
  return marked(data.toString(), function(err, content) {
    if (err) {
      throw err;
    }
    return jade.renderFile(template, {
      content: content,
      pretty: true
    }, function(err, html) {
      if (err) {
        throw err;
      }
      return fs.writeFile(presentation, html, function(err) {
        if (err) {
          return console.log(err);
        } else {
          return console.log("File was written.");
        }
      });
    });
  });
});
