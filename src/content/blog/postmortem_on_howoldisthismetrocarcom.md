---
title: "Postmortem on How Old Is This Metro Car"
date: "2013-08-23"
tags:
  - "AWS"
  - "angular.js"
  - "follow-up"
slug: "postmortem-on-howoldisthismetrocarcom"
expires: true
---

## Background

A few weeks ago, there was some noise about a website called [MetroHotCars][1] that received a lot of attention pointing out some flaws of the [Washington Metropolitan Area Transit Authority][2] through a pun. I have always felt that open data is very important I thought I would throw my hat into the ring as well with [How Old Is This Metro Car][3]. The idea was to allow people to see how old the Metro car they were riding was... Easy enough right? Below is a little bit of a brain dump of what my thought process was when I created this web application.

## Why I chose Angular?

I like [Angular.js][4]. I also did not want the website to need a backend, since that would have been overly complex for the situation at hand. Angular.js and it's MVC framework was a perfect fit for this scenario. There is a lot of pressure with developing web applications to go whole-hog; sure this application could have been written in [Django][5] or [Node.js][6] so I could take to a backend database. It is just that this website didn't need to, sometimes web applications do not need a backend. And when that happens, Angular.js is not a bad route to take.

## Why I chose S3

Another idea that I had was to make this website cheap to run. It is not every day that I run basically a joke website and I did not want to pay out the nose for something that would be used by so few people. [Digital Ocean][7] is awesome and it is cheap, but I was thinking that I could find hosting even cheaper than $5 a month. That is why I chose [Amazon Web Services (AWS)][8] [Simple Storage Service (S3)][9]. And even after a very successful week of viral viewing, the bill for hosting was CHEAP!

## What I learned

I have to say that I was pretty amazed on how well the pairing of Angular.js and AWS S3 matched up and can even see this being viable for much larger websites. The benefits of a Javascript framework which has the basic ideas of an MVC but can interact exclusively with APIs is just awesome. An Angular.js website, no matter how large or small, fits nicely in an S3 bucket which can be used to host your website.

There are a few catches one has to be on the look out for, but if you are familiar with the steps required to host a website on S3, then you shouldn't have any problems. I am going to write a quick tutorial on how exactly to do this, so stay tuned.

## End Numbers

After having the website tweeted and retweeted throughout the WMATA dissidents I ended up getting over 12,000 views over about a 3 day peak. I know 4000 visits per day is nothing to write home to mother about, but it was amazing how well the website kept up. Not once did it go down nor even slow. Serving static images from AWS S3 is amazingly powerful, and with Angular.js you can have a very powerful website being statically served.

And what did these 12,000 impressions cost me at the end of the day? My total AWS S3 bill for the month of July was $0.03. Yes, three cents. And How Old is this Metro Car was not the only website I statically served that month. I also have this website and another personal site as well. Amazing.

## Conclusion

In the end of the day, I would highly suggest that you take a look at both Angular.js and serving your site through Amazon S3. There is very few providers out there that will give you the power that Amazon does and for the fraction of a dollar I paid for the month of hosting, I cannot suggest this enough.

Sure there are some drawbacks to doing this; the major one being that you cannot access a backend. But if you are building a quick website that has limited data interactions or interactions directly through APIs this setup would be ideal.

Stay tuned for a quick tutorial on how I did this and the best practices that I found to host your simple Angular.js website on S3.

Thank you.

[1]: http://metrohotcars.com/
[2]: http://www.wmata.com/
[3]: http://www.howoldisthismetrocar.com/
[4]: http://angularjs.org/
[5]: https://www.djangoproject.com/
[6]: http://nodejs.org/
[7]: https://www.digitalocean.com/
[8]: https://aws.amazon.com/
[9]: https://aws.amazon.com/s3/
