---
title: "Setting Up AWS SES with a Custom Domain"
date: "2026-03-01"
tags:
  - "aws"
  - "email"
  - "tutorial"
  - "node.js"
  - "python"
slug: "setting-up-aws-ses-with-custom-domain"
heroImage: "blog/aws-ses"
unsplash: "Mehdi Sepehri"
unsplashURL: "mehdisepehri"
description: "AWS SES is one of the most cost-effective ways to send transactional email, but getting it configured properly takes a few non-obvious steps. Here's the complete walkthrough."
---

Transactional emails are something I end up setting up on almost every project—password resets, welcome emails, order confirmations.
They all need to reliably land in inboxes, and AWS Simple Email Service (SES) is my go-to for doing that cheaply and reliably.

The problem is that the setup isn't obvious the first time around.
There are DNS records to configure, IAM policies to get right, and a sandbox mode that will trip you up if you're not expecting it.
Let me walk through the whole thing so you don't have to piece it together yourself.

## Why SES?

Before we get into the setup, let me make the case for SES over alternatives like SendGrid, Mailgun, or Postmark.

**Cost** is the big one.
SES charges $0.10 per 1,000 emails with no monthly minimums.
If you're already on EC2, your first 62,000 emails per month are free.
That's hard to beat.

**AWS integration** is also a real benefit if you're already in the ecosystem.
SES plays nicely with IAM, CloudWatch, and SNS out of the box.

The tradeoff is setup complexity.
SES requires more upfront configuration than the plug-and-play alternatives.
But it's a one-time cost, and that's what this post is for.

## Step 1: Add Your Domain to SES

Navigate to the SES console in AWS.
In the left sidebar, click **Verified identities**, then **Create identity**.

Select **Domain** as the identity type and enter your domain (e.g., `yourdomain.com`).

You'll see a few optional settings:

- **Assign a default configuration set**: Skip this for now. Configuration sets let you track opens, clicks, and bounces. You can add one later when you need it.
- **Assign to a tenant**: Leave unchecked unless you're building a multi-tenant SaaS with isolated sending per customer.
- **Use a custom MAIL FROM domain**: Optional, but recommended for production. It routes bounces through something like `bounce.yourdomain.com` instead of `amazonses.com`, which helps with DMARC alignment. If you enable it, you'll need extra DNS records.

Click **Create identity** to proceed.

## Step 2: Configure DKIM

After creating the identity, SES shows you the DKIM settings.
DKIM (DomainKeys Identified Mail) cryptographically signs your emails to prove they actually came from your domain.

Keep **Easy DKIM** enabled and select **RSA_2048_BIT** for the signing key length.
It's more secure than the 1024-bit option and SES handles key rotation automatically.

SES will generate three CNAME records that look something like this:

```
Name: abc123._domainkey.yourdomain.com
Value: abc123.dkim.amazonses.com

Name: def456._domainkey.yourdomain.com
Value: def456.dkim.amazonses.com

Name: ghi789._domainkey.yourdomain.com
Value: ghi789.dkim.amazonses.com
```

Copy these—you'll need them in the next step.

## Step 3: Add DNS Records

Head to wherever your DNS lives (Route 53, Cloudflare, Namecheap, etc.) and add the three CNAME records from SES.

While you're in there, add an SPF record if you don't already have one.
SPF tells receiving mail servers which servers are authorized to send on behalf of your domain.

Add a TXT record:

```
Name: @ (or yourdomain.com)
Type: TXT
Value: v=spf1 include:amazonses.com ~all
```

**Note**: If you already have an SPF record, just add `include:amazonses.com` to the existing one.
You can only have one SPF record per domain.

### Optional: DMARC

DMARC builds on SPF and DKIM to give you control over what happens when emails fail authentication.
Add this TXT record:

```
Name: _dmarc.yourdomain.com
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com
```

Starting with `p=none` puts you in monitor mode—nothing gets blocked, you just get reports.
Once you're confident everything is working correctly, you can move to `p=quarantine` or `p=reject`.

## Step 4: Wait for Verification

Back in the SES console, check your domain's status.
DNS propagation can take anywhere from a few minutes to 72 hours, though it's usually much faster.

SES will show your domain as **Verified** once it detects your DKIM records, and the DKIM signing status will change to **Successful**.

## Step 5: Get Out of Sandbox Mode

New SES accounts start in **sandbox mode**, and it has real limitations:

- You can only send to verified email addresses
- You're limited to 200 emails per 24 hours
- You can only send 1 email per second

This is fine for development, but you'll need production access before going live.

Go to **Account dashboard** in the SES console and click **Request production access**.
Fill out the form and explain what type of emails you're sending, how you collect recipients, and how you handle bounces and complaints.

Be honest and detailed here.
AWS reviews these manually and vague answers get rejected.
Approval usually takes 24–48 hours.

## Step 6: Create IAM Credentials

To send emails from code, you need AWS credentials with SES permissions.
You have two options.

### Option A: SMTP Credentials

SMTP credentials work with any email library that supports SMTP.
Go to **SMTP settings** in the SES console and click **Create SMTP credentials**.

This creates an IAM user and generates SMTP-specific credentials:

- SMTP username
- SMTP password
- SMTP endpoint (e.g., `email-smtp.us-east-1.amazonaws.com`)

Use port 587 with STARTTLS or port 465 with TLS.

Here's what that looks like in Node.js using the built-in `nodemailer` library:

```javascript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. email-smtp.us-east-1.amazonaws.com
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

await transporter.sendMail({
  from: "noreply@yourdomain.com",
  to: "user@example.com",
  subject: "Welcome to Our App",
  html: "<h1>Welcome!</h1><p>Thanks for signing up.</p>",
  text: "Welcome! Thanks for signing up.",
});
```

### Option B: IAM Access Keys (Recommended for AWS SDK)

If you're using the AWS SDK, create an IAM user with programmatic access:

1. Go to **IAM Console → Users → Create user**
2. Give it a descriptive name like `ses-sender` or `myapp-email`
3. Attach a policy with the necessary permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

4. Create an access key and save the Access Key ID and Secret Access Key somewhere safe

**Note**: Make sure you include both `ses:SendEmail` and `ses:SendRawEmail`.
`SendEmail` is for the simplified API, while `SendRawEmail` is for when you need full control over headers and MIME structure.
Most SDK methods use `SendEmail`, but some libraries reach for `SendRawEmail` under the hood.

## Step 7: Send Your First Email

Let's actually send something.

### Node.js (AWS SDK v3)

```javascript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function sendEmail({ to, subject, html, text }) {
  const command = new SendEmailCommand({
    Source: "noreply@yourdomain.com",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
        Text: { Data: text },
      },
    },
  });

  const response = await ses.send(command);
  return response.MessageId;
}

await sendEmail({
  to: "user@example.com",
  subject: "Welcome to Our App",
  html: "<h1>Welcome!</h1><p>Thanks for signing up.</p>",
  text: "Welcome! Thanks for signing up.",
});
```

### Python (boto3)

```python
import os
import boto3
from botocore.exceptions import ClientError

ses = boto3.client(
    'ses',
    region_name='us-east-1',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
)

def send_email(to, subject, html, text):
    try:
        response = ses.send_email(
            Source='noreply@yourdomain.com',
            Destination={'ToAddresses': [to]},
            Message={
                'Subject': {'Data': subject},
                'Body': {
                    'Html': {'Data': html},
                    'Text': {'Data': text}
                }
            }
        )
        return response['MessageId']
    except ClientError as e:
        print(f"Error sending email: {e.response['Error']['Message']}")
        raise

send_email(
    to='user@example.com',
    subject='Welcome to Our App',
    html='<h1>Welcome!</h1><p>Thanks for signing up.</p>',
    text='Welcome! Thanks for signing up.'
)
```

## Sending From Any Address on Your Domain

One thing that surprises people the first time: when you verify a domain, you can send from any address on that domain.
You don't need to verify individual addresses separately.

All of these work automatically once the domain is verified:

- `noreply@yourdomain.com`
- `support@yourdomain.com`
- `hello@yourdomain.com`
- `anything@yourdomain.com`

Just use whatever "From" address makes sense for the context.

## Handle Bounces and Complaints

This part is easy to skip and a mistake to do so.
For production, you need to handle bounces (undeliverable emails) and complaints (users marking you as spam).
Ignoring these will hurt your sender reputation and can get your SES account suspended.

Create an SNS topic and subscribe to it with a Lambda function, SQS queue, or HTTP endpoint.
Then configure your SES domain to send bounce and complaint notifications to that topic.

When you get a bounce, remove that address from your list.
When you get a complaint, remove it and treat it as a permanent opt-out.

## Common Pitfalls

**Wrong region**: Make sure your SES client is configured for the same region where you verified your domain.

**Missing permissions**: If you get `AccessDenied` errors, double-check your IAM policy includes `ses:SendEmail`, not just `ses:SendRawEmail`.

**Still in sandbox**: If you can only send to verified addresses, you're still in sandbox mode. Request production access.

**DNS propagation**: If verification is stuck, give it time. Some DNS providers are slower than others.

## Conclusion

That's the whole setup.
To recap what we did:

1. Add and verify your domain in SES
2. Configure DKIM and add DNS records (SPF and optionally DMARC)
3. Request production access to leave sandbox mode
4. Create IAM credentials
5. Send emails using the SDK or SMTP

SES takes more upfront work than some alternatives, but once it's running it's remarkably hands-off—and the cost savings are real.
Worth the one-time investment for most projects.

If you have questions or ran into something I didn't cover, find me on [Bluesky](https://bsky.app/profile/joshfinnie.dev) and let's talk it through!
