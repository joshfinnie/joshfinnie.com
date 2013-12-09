---
layout: post.html
title: Font Awesome is Awesome
tags: [fonts, libraries, CSS, design]

---

## Help a Programmer Out

I do not call myself a designer by any stretch of the imagination. And this site is a testiment to that fact. However, I do try and make it somewhat pretty and with [Twitter Bootstrap](http://getbootstrap.com/) it is easier than ever. Today I made a little change to my site using another awesome library, [Font Awesome](http://fontawesome.io/). From my understanding, this is a iconic font designed for Bootstrap. Perfect.

## What I Had

The change is small, but using Font Awesome I was able to get rid of the 8 images that were used on my homepage.

![image](/assets/images/blog/homepage-screenshot.png)

The four awesome social network icons were provided by [Neil Orange Peel](http://www.neilorangepeel.com/free-social-icons/), but with images comes a lot of weight to your network connection. Each icon has two states, its normal state and a hover state. This means that there are 8 images for this simple visual representation.

## Enter Font Awesome

Font Awesome is a font that you add through CSS and I simplely added it through the provided CDN as follows:

<pre class="language-markup"><code>
&lt;link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.min.css"&gt;
</code></pre>

This gives me all the power granted with using Font Awesome. Reading through the [examples](http://fontawesome.io/examples/), I created a faximily of the icons I used on the homepage with the following code:

<pre class="language-markup"><code>
&lt;div class=&quot;social-buttons&quot;&gt;
  &lt;span class=&quot;twitter-button&quot;&gt;
    &lt;a href=&quot;https://twitter.com/joshfinnie&quot;&gt;
      &lt;span class=&quot;fa-stack fa-4x&quot;&gt;
        &lt;i class=&quot;fa fa-circle fa-stack-2x&quot;&gt;&lt;/i&gt;
        &lt;i class=&quot;fa fa-twitter fa-stack-1x fa-inverse&quot;&gt;&lt;/i&gt;
      &lt;/span&gt;
    &lt;/a&gt;
  &lt;/span&gt;
  &lt;span class=&quot;github-button&quot;&gt;
    &lt;a href=&quot;https://github.com/joshfinnie&quot;&gt;
      &lt;span class=&quot;fa-stack fa-4x&quot;&gt;
        &lt;i class=&quot;fa fa-circle fa-stack-2x&quot;&gt;&lt;/i&gt;
        &lt;i class=&quot;fa fa-github-alt fa-stack-1x fa-inverse&quot;&gt;&lt;/i&gt;
      &lt;/span&gt;
    &lt;/a&gt;
  &lt;/span&gt;
  &lt;span class=&quot;linkedin-button&quot;&gt;
    &lt;a href=&quot;https://linkedin.com/in/joshfinnie&quot;&gt;
      &lt;span class=&quot;fa-stack fa-4x&quot;&gt;
        &lt;i class=&quot;fa fa-circle fa-stack-2x&quot;&gt;&lt;/i&gt;
        &lt;i class=&quot;fa fa-linkedin fa-stack-1x fa-inverse&quot;&gt;&lt;/i&gt;
      &lt;/span&gt;
    &lt;/a&gt;
  &lt;/span&gt;
  &lt;span class=&quot;instagram-button&quot;&gt;
    &lt;a href=&quot;https://instagram.com/joshfinnie&quot;&gt;
      &lt;span class=&quot;fa-stack fa-4x&quot;&gt;
        &lt;i class=&quot;fa fa-circle fa-stack-2x&quot;&gt;&lt;/i&gt;
        &lt;i class=&quot;fa fa-instagram fa-stack-1x fa-inverse&quot;&gt;&lt;/i&gt;
      &lt;/span&gt;
    &lt;/a&gt;
  &lt;/span&gt;
  &lt;/div&gt;
</code></pre>

This code gives me a very nice copy of the icons I was using before:

![image](/assets/images/blog/new-social-icons.png)

They are very similar to what I had, except of course the different icons for [Github](http://github.com). This is unfortunate since I kind of really enjoyed Niel Orange Peel's version better than Font Awesome's version. Oh well.

The next thing I wanted to accomplish is to get the hover-over effects that I had with the images. After some Googling around, I added the following CSS to my website:

<pre class="language-css"><code>
a:link {
 color: #000;
 text-decoration: none;
}
a:visited {
  color: #000;
  text-decoration: none;
}
.twitter-button > a:hover {
  color: #47bff5;
  text-decoration: none;
}
.github-button > a:hover {
  color: #333;
  text-decoration: none;
}
.linkedin-button > a:hover {
  color: #3893c4;
  text-decoration: none;
}
.instagram-button > a:hover {
  color: #3e6c93;
  text-decoration: none;
}
.google-plus-button > a:hover {
  color: #df5138;
  text-decoration: none;
}
.stack-overflow-button > a:hover {
  color: #fe8224;
  text-decoration: none;
}
a:active {
  color: #000;
  text-decoration: none;
}
</code></pre>

The results look great, and I am very happy with how easy it was to remove 8 images from my network load with some simple CSS.

## Postmortem

I am not sure if this actually did anything, nor save any network load or load-time, but it was a fun project none-the-less. Let me know if you find this helpful or if I am missing something completely with this process. Thanks!