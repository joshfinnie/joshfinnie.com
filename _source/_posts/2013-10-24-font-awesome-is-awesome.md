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

    <link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.min.css">
    
This gives me all the power granted with using Font Awesome. Reading through the [examples](http://fontawesome.io/examples/), I created a faximily of the icons I used on the homepage with the following code:

    <div class="social-buttons">
    <span class="twitter-button">
      <a href="https://twitter.com/joshfinnie">
        <span class="fa-stack fa-4x">
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
        </span>
      </a>
    </span>
    <span class="github-button">
      <a href="https://github.com/joshfinnie">
        <span class="fa-stack fa-4x">
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-github-alt fa-stack-1x fa-inverse"></i>
        </span>
      </a>
    </span>
    <span class="linkedin-button">
      <a href="https://linkedin.com/in/joshfinnie">
        <span class="fa-stack fa-4x">
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-linkedin fa-stack-1x fa-inverse"></i>
        </span>
      </a>
    </span>
    <span class="instagram-button">
      <a href="https://instagram.com/joshfinnie">
        <span class="fa-stack fa-4x">
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-instagram fa-stack-1x fa-inverse"></i>
        </span>
      </a>
    </span>
    </div>

This code gives me a very nice copy of the icons I was using before:

![image](/assets/images/blog/new-social-icons.png)

They are very similar to what I had, except of course the different icons for [Github](http://github.com). This is unfortunate since I kind of really enjoyed Niel Orange Peel's version better than Font Awesome's version. Oh well.

The next thing I wanted to accomplish is to get the hover-over effects that I had with the images. After some Googling around, I added the following CSS to my website:

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
	
The results look great, and I am very happy with how easy it was to remove 8 images from my network load with some simple CSS.

## Postmortem

I am not sure if this actually did anything, nor save any network load or load-time, but it was a fun project none-the-less. Let me know if you find this helpful or if I am missing something completely with this process. Thanks!