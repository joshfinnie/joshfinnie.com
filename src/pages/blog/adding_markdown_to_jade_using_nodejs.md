---

title: "Adding Markdown to Jade Using Node.js"
date: "2014-09-22"
tags:
  - "how-to"
  - "jade"
  - "markdown"
  - "hack"
path: "/blog/adding-markdown-to-jade-using-node-js"
expires: true
layout: '../../layouts/BlogPost.astro'

---

### **Update**

A user on Reddit, [itsananderson](https://www.reddit.com/user/itsananderson), pointed out [here](https://www.reddit.com/r/node/comments/2hdb2l/adding_markdown_to_jade_using_nodejs/), that my steps above are not needed since Jade has it's own filters! This is GREAT! I will be switching over [TweetPNG](http://www.tweetpng.com) as soon as I can. To write markdown using the builtin filter's you only need to do the following:

```
:markdown
  Add `http://www.tweetpng.com/:username/tweet/last.png` to your `img` tag in your HTML, where `:username` is your Twitter handle.
```

---

For one of my Node.js applications, [TweetPNG](http://www.tweetpng.com) I use the HTML templating language called [Jade](http://jade-lang.com/). I adore Jade for allowing me to easily write HTML in a whitespace significant fashion, however it is not always the easiest language to use.

One of the major issues I have with Jade is formatting it correctly when using a lot of inline HTML. This is where I feel Jade breaks down and gets downright ugly! Let's take this example:

```
p
    | Add&nbsp;
    code http://www.tweetpng.com/:username/tweet/last.png
    | &nbsp;to your&nbsp;
    code img
    | &nbsp;tag in your HTML, where&nbsp;
    code :username
    | &nbsp;is your twitter username.
```

The above example is a paragraph where there are three inline code snippets. This really shows a limitiation of Jade and where it becomes almost unusable. Also notice the need for the HTML `&nbsp`? Overall, this just looks terrible. Sure, I could have just written the `code` HTML inline and have been done with it, but the idea of Jade is to not have to write HTML.

### My Solution

To get around this, I did a cheeky little injection of a Markdown intrepretre. This allowed me to change the Jade above to something that looks like this:

```
span!= marked("Add `http://www.tweetpng.com/:username/tweet/last.png` to your `img` tag in your HTML, where `:username` is your Twitter handle.")
```

What a difference!

### How To

Now I am sure this is a hack, and there might be a better way in pure Jade to write this, but this is how I did it. First, you want to install `marked` this can be done simply by running:

```
$ npm install --save marked
```

This gives you the ability to convert Markdown into HTML! Now, let's add it to jade:

```
var marked = require('marked');

module.exports = function(app) {
  return app.get("/", function(req, res) {
    return res.render("home", {
      marked: marked
    });
  });
};
```

That's it. We now have the ability to convert Markdown to HTML inside our Jade template! Let me know what you think! Am I doing this completely wrong? Did I miss a simple conversion in Jade itself? Find me on [Twitter](https://twitter.com/joshfinnie) and let me know!
