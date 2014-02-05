joshfinnie.com
==============

Personal Homepage of Josh Finnie (found at http://www.joshfinnie.com). Uses Mynt. Hosted on AWS S3.

Usage
-----

To get the Mynt Virtualenv:

    $ workon mynt

To generate the static files:

    $ mynt gen -c _source/ _site/

To serve the website locally:

    $ mynt serve _site/

Update S3 bucket:

    $ s3cmd sync --add-header='Cache-Control: max-age=31536000' _site/ s3://www.joshfinnie.com
