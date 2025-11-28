---
title: "JoshFinnie.com Part 5?"
date: "2013-05-07"
tags:
  - "announcement"
  - "news"
slug: "joshfinniecom-part-5"
expires: true
---

I have recently updated my [personal website][1]. I do this every once and a while, but this time I am actually proud of it. I have been working at [Koansys, LLC][2] for a little over a year and have really grown in my ability to design websites. It has been a great experience working with a designer and picking up some tips and tricks here and there.

The idea of the website is similar to the last iteration, it is a static website created by a program and hosted online. There is nothing dynamic in the actual hosted code. However, instead of using [Jekyll][3] this time, I am using [Mynt][4]. I chose Mynt solely due to the fact that it is written in Python, a language I am very comfortable with. This takes away a little of the magic I felt when using Jekyll.

Another thing that changed this iteration is that the website is now hosted on [Amazon Web Service's][5] (AWS) [Simple Storage Service][6] (S3). I use the wonderful command line interface [s3cmd][7] which really makes updating the website a breeze. Hosting the website on S3 allows for amazing response times and is really cheap to host. It is a win-win scenario.

The only real catch that I came across when setting up this website was adding the cacheing headers. s3cmd allows you to do this, it is just not intuitive. Below is the command that I run to update this website:

    $ s3cmd sync --add-header='Cache-Control: max-age=31536000' _site/ s3://BUCKET-NAME-HERE

I highly recommend going with a static site generator, your site will never be faster.

[1]: http://www.joshfinnie.com/
[2]: http://koansys.com/
[3]: http://jekyllrb.com/
[4]: http://mynt.mirroredwhite.com/
[5]: https://aws.amazon.com/
[6]: http://aws.amazon.com/s3/
[7]: http://s3tools.org/
