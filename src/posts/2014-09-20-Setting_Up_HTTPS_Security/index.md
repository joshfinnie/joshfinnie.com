---

title: "Setting Up HTTPS Security"
date: "2014-09-20"
tags:
  - "security"
  - "how-to"
path: "/blog/setting-up-https-security"
expires: true

---

**_ This post was originally posted on [TrackMaven's Engine Room](http://engineroom.trackmaven.com). You can find it [here](http://engineroom.trackmaven.com/blog/setting-up-https-security/). _**

Here at [TrackMaven](http://trackmaven.com), we have made it our goal to provide our customers with the most secure access to our application as possible. And in light of the recent news emerging in web security, most concerning [Heartbleed](http://heartbleed.com/), we rethought our best practices and now limit access to our application to only secured HTTPS and making sure that we have the full range of coverage based off of SSL Lab's standards for security. It is often thought that securing your site through TSL/SSL is hard, but hopefully this post will show you just how easy it can be.

## What is HTTPS?

Hypertext Transfer Protocol Secure (HTTPS) is a way in which computers can securely communicate over the internet. The secure communication is done either the through the newer  Transport Layer Security (TLS) encryption protocol or its predecessor the SSL Secure Sockets Layer (SLS) encryption protocol. Each uses asymmetric cryptography involving private and public certificates to make sure the communication is secure; the creation of these certificates is commonly believed to be the difficult part of implementing HTTPS on your own servers.

## Setting up HTTPS on your server

The first thing you will want to do is to secure your certificates. A certificate will consist of the owner's name, a identification number, expiration date, a public key for encryption and a private key for decryption. The certification creation process asks you for this information automatically, so don't worry about knowing how to input all the information.

You could, of course, create a certificate yourself (self-sign) without the help of any [Certificate Authorities (CA)](http://www.sslshopper.com/certificate-authority-reviews.html), but you will lose the ability to be validated by them. For better or worse the CAs exist to make sure the public key given to you is true and unadulterated. Going through a CA will make sure that modern web browsers recognize your certificate as valid and trusted.

There are a few different versions of certificates. It is best to read up on them and find which one best fits your needs. Here at TrackMaven, we went with a Wildcard SSL which allows us to use it on multiple subdomains (i.e. [app.trackmaven.com](https://app.trackmaven.com) and [blog.trackmaven.com](http://blog.trackmaven.com)). For example, [DigiCert](https://www.digicert.com/) offers 5 different types of certificates:

* [WildCard SSL](https://www.digicert.com/wildcard-ssl-certificates.htm)
* [Single Certificate](https://www.digicert.com/ssl-certificate.htm)
* [Unified Communications Certificate](https://www.digicert.com/unified-communications-ssl-tls.htm)
* [Extended Validation Certificate](https://www.digicert.com/ev-ssl-certification.htm)
* [DigiCert Extended Validation Multi-Domain Certificate](http://www.digicert.com/ev-multi-domain-ssl.htm)

To continue with the process of securing your web application, you will need to purchase a SSL certificate from a reputable vendor. Shop around; prices do vary. Once you have purchased an SSL certificate you will need to create a Certificate Signing Request (CSR). The below command will generate both a server key and CSR:

    openssl req -new -newkey rsa:2048 -keyout your_server_name.key -out your_server_name.csr

You then take the newly created CSR file to the certificate provider of your choice and purchase a SSL Certificate. This process can take anywhere from a few minutes to a few weeks depending on the level of certification you purchased. Once your provider has generated the certificates you should receive them via the email address which you used to sign the CSR.

I would recommend you follow the instructions of your certificate provider closely as all providers do things slightly differently. Once you have successfully received the email with your certificates all that is left to do is to put them on the server and tell your http server (either NGINX, Apache, etc.) to start hosting content through HTTPS.

Setting up your server is the easier of these processes; you only need to save the key you created above and the output of the directions your CA provided you to your server. I'd recommend putting it under `/etc/{apache2,nginx}/ssl/` for safe keeping.

### Setting up Apache

* You first want to enable the SSL module in Apache: `a2enmod ssl`
* Secondly, you'll need to turn on port 443 listening by editing the `/etc/apache2/ports.conf` file
* Update your `VirtualHost` file to listen on port 443 and have the following configurations:

    SSLEngine on
    SSLCertificateFile /etc/apache2/ssl/your_server_name.crt
    SSLCertificateKeyFile /etc/apache2/ssl/your_server_name.key
    SSLCertificateChainFile /etc/apache2/ssl/DigiCertCA.crt

This should give you a working secure connection through TSL using Apache.

### Setting up Nginx

* You first want to bundle your CRT with the CA's cert: `cat your_server_name.crt DigiCertCA.crt >> bundle.crt` and move that to your `/etc/nginx/ssl/` folder
* Second edit your `server` virtual host to include the following configurations:

    listen 443;
    ssl on;
    ssl_certificate /etc/nginx/ssl/bundle.crt
    ssl_certificate_key /etc/ngin/ssl/your_server_name.key

This should give you a working secure connection through TSL using Nginx. At this point, I would suggest finding the best way for you to forward all traffic hitting HTTP to HTTPS. There is no real reason that, with HTTPS now set up, you should be serving insecure content.

## Hardening your HTTPS connection

Now that we have set up a secure connection on your server of choice, it is important to make sure that you are using HTTPS to the best of its abilities. There are a few steps that one should take to make sure their server is hardened as best as possible when using HTTPS.

### Hardening Apache

Adding the below lines to your `VirtualHost` will give you all the benefits of the most up-to-date ciphers while disallowing some of the known-to-be-weaker ones:

    SSLProtocol ALL -SSLv2
    SSLHonorCipherOrder On
    SSLCipherSuite ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS
    SSLCompression Off

### Hardening Nginx

Adding the below lines to your `server` virtual host will give you all the benefits of the most up-to-date ciphers while disallowing some of the known-to-be-weaker ones:

    ssl_prefer_server_ciphers on;
    ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS:!AES256;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;

## Conclusion

With this article, I hope I cleared some of the air around setting up HTTPS on your server. Setting up HTTPS isn't too scary, for a small time investment you'll gain a huge security boost for your application and your users.

## Further Reading and Resources

[HTTPS](http://en.wikipedia.org/wiki/HTTP_Secure)
[TLS/SSL](http://en.wikipedia.org/wiki/Transport_Layer_Security)
