---
title: "Current Thoughts on Mobile Website Support"
date: "2021-12-28"
tags:
  - "mobile"
  - "analysis"
  - "web design"
  - "lesson"
slug: "current-thoughts-on-mobile-website-support"
heroImage: "@assets/blog/chart.jpg"
unsplash: "Jess Bailey"
unsplashURL: "jessbaileydesigns"
description: "I recently had a viral blog post and I wanted to share a surprising discovery of the current state of mobile website support! Over the course of the month, nearly 50% of my visitors were using a mobile browswer of some sort. What does this mean for me going forward?"
---

On November 23rd, I released a blog post about using [Rust to speed up React components](/blog/setting_up_wsl_with_asdf/).
That blog post saw a lot of success; trending on [/r/javascript](https://www.reddit.com/r/javascript) for a little over 24 hours and shared on more than a few newsletters.
A month later, I thought I'd give a retrospective on the biggest thing I learned with over 10,000 visitors coming to my site.

## Mobile First?

One of the bigger learnings with the success of this post is that just about half of my visitors read the post on mobile devices.
That was surprising to me.
I recently updated my [blog to Astro](/blog/my-switch-from-gatsby-to-astro/) and part of the upgrade was to develop a true mobile experience.
This has not been a priority of mine with a lot of websites I have built, but I keep hearing it being important.
I wanted to have a mobile experience, but it always seemed half-hearted.
I find CSS difficult to wrap my head around, and the idea of doing two sets of CSS was too much.
That was until I found [TailwindCSS](https://tailwindcss.com/).

> A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.

With TailwindCSS I was able to build both a desktop and mobile experience all at once.
And I am glad I did.
Below is a chart of the devices that visited my blog post over the course of 30 days.

![Device count analytics for Using WebAssembly (created in Rust) for Fast React Components](/assets/blog/rust-react-device-analytics.png)

As you can see in the chart above, about _half_ of the visitors to this blog post were from mobile devices or tablets.
I don't know if this should come as a surprise to anyone, but to see it shocking.

After reflecting on it a bit I started to inspect my own usage of the internet.
Outside the eight hours of work where I am tied to my laptop, a lot of my internet usage (especially Reddit) comes by my mobile phone.
I cannot be surprised that many of the people that came from Reddit to read my post did so also on a mobile device.

## What Does This Mean?

I understand that this is one data point in a sea of blog posts.
But seeing mobile users and desktop users having equal representation in devices for my blog was shocking.
What does this mean?
It means that if you are building a blog today you should start treating mobile users as your primary readers.
The increase of mobile users has been growing for a while, and I do not see it stopping.
How long until we are in a world where the majority of your readers are using mobile devices.

Using tools like TailwindCSS helped me on my journey of creating the new version of this blog.
I can only hope that these libraries continue to support this movement.
Soon we'll have tools at our disposal to make world-class, mobile-first environments.
Then people sneaking away to read Reddit will have a wonderful experience reading your blog.

## Conclusion

Not sure how many times in one blog post I can say I was surprised, but here we are again.
I was surprised that almost 50% of my blog post's readership was from a mobile device.
This version of the blog was the first time that I tried to take mobile users into consideration and I am glad I did!

The use of mobile devices as the primary mode of content consumption is only going to increase.
I am already noticing that my life revolves around my mobile phone for sites like Reddit.
If you are heading into a redesign of your blog, please try a CSS framework like TailwindCSS.
It will give you the leverage to design a site both for mobile and desktop users at the same time.
If you found this post helpful, share it on Reddit! 😉
Or at least find me on [Twitter](https://twitter.com/joshfinnie) and chat with me about mobile-first development.

## An Aside

I also want to give a shout out to my good friend [Mike Bifulco](https://mikebifulco.com/).
He pushed me to put myself out there and share the Using WebAssembly (created in Rust) for Fast React Components blog post.
It can be hard to put yourself out there as a content creator.
But if you don't take that leap you'll never get the knowledge you want to share out into the world.
If you are wanting to create content, but are scared... just do it.
You will only be helping the world be a better place with the content you put your heart and soul into.
And the world needs more people who care and want to share.

## Also might enjoy:

- [Using WebAssembly (created in Rust) for Fast React Components](/blog/using-webassembly-created-in-rust-for-fast-react-components/)
- [Quick UX No-No](/blog/quick_ux_no-no/)
