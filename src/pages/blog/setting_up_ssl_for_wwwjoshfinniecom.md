---

title: "Setting up SSL for www.joshfinnie.com"
date: "2018-05-21"
tags:
  - "ssl"
  - "blog"
  - "s3"
  - "cloudfront"
  - "let's encrypt"
path: "/blog/setting-up-ssl-for-wwwjoshfinniecom"
heroImage: "/assets/blog/padlock.jpg"
expires: true
layout: '../../layouts/BlogPost.astro'
unsplash: 'Micah Williams'

---

As you might have heard, Google Chrome is taking some very bold steps forward in making sure that the internet is a safe and secure place. In their attempt to do this, they are making much more of an effort to point out when websites are not secured through SSL. In this blog post, I am just going to document my process to use [Let's Encrypt](https://letsencrypt.org/) to generate a free SSL certificate and how I load it on Cloudfront.

But first, let me describe this blog in a bit more detail. I currently use [Pelican](http://docs.getpelican.com/en/stable/) as a static site generator which then I push to S3 with Cloudfront as my CDN. The workflow that comes with Pelican is perfectly set up for this, but adding the SSL certificate process was a bit more work.

### The Process

To generate the SSL certificate, I use the Let's Encrypt command line tool [certbot](https://certbot.eff.org/). This tool is AMAZING and with just some simple steps can generate you a SSL certificate without being on the server of your website (which we need since our SSL termination is done on Cloudfront).

To start the process, download `certbot` and run the following command:

```bash
$ sudo certbot certonly --manual -d www.joshfinnie.com

```

This spits out some text, agree to be logged, and you are given a verification challenge. It looks like this:

```bash
-------------------------------------------------------------------------------
Create a file containing just this data:

<RANDOM STRING>

And make it available on your web server at this URL:

http://www.joshfinnie.com/.well-known/acme-challenge/<DIFFERENT RANDOM STRING>

-------------------------------------------------------------------------------
Press Enter to Continue
```

And this is where the difficultly with my current setup comes in. To have `certbot` verify that I own this domain and am allowed to generate a SSL certificate for this domain.

To pass the verification step, I run the following commands to generate a file with the `<RANDOM STRING>` and upload it to S3.

```
$ echo "<RANDOM STRING>" > /tmp/acme-challenge
$ aws --profile personal s3 cp /tmp/acme-challenge s3://www.joshfinnie.com/.well-known/acme-challenge/<DIFFERENT RANDOM STRING> --content-type text/plain
```

Once the challenge is uploaded, you can hit enter in `certbot` which will verify the challenge and give you your SSL certificate.

The next step is uploading this new SSL certificate to AWS. Luckily, the wonderful `awscli` tool helps here as well and we can do this in just 1 step. I run the below command to upload the SSL certificate to AWS so I can use it in Cloudfront:

```
$ sudo aws --profile personal iam upload-server-certificate \
    --server-certificate-name www.joshfinnie.com2 \
    --certificate-body file:///etc/letsencrypt/live/www.joshfinnie.com/cert.pem \
    --private-key file:///etc/letsencrypt/live/www.joshfinnie.com/privkey.pem \
    --certificate-chain file:///etc/letsencrypt/live/www.joshfinnie.com/chain.pem \
    --path /cloudfront/
```

The paths to the `certificate-body`, `private-key` and `certificate-chain` are all the default locations for `certbot`. These might change based on how `certbot` was installed or what operating system you are running. Once you run that command, the next step is to make sure your Cloudfront uses this new SSL certifate and you are done!

### Conclusion

So, overall, this process is not to bad. The only huge drawback with this current setup is that Let's Encrypt only issues SSL certificates that are valid for 90 days; this means you are repeating this process every 3 months. It's awesome since the SSL certificates are free, but it is a bit more work than just getting a SSL certificate from a company this issues year certificates. Luckily, with the steps outlined in this blog post the whole process takes 15 minutes. I hope this helps anyone that has a static site hosting on S3 through Cloundfront. And as always, feel free to contact me on [Twitter](https://twitter.com/joshfinnie) with any comments.
