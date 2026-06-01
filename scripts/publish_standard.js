import fs from 'node:fs';
import path from 'node:path';
import { AtpAgent } from '@atproto/api';
import { config } from 'dotenv';
import matter from 'gray-matter';

config();

const BSKY_HANDLE = process.env.BSKY_HANDLE;
const BSKY_PASSWORD = process.env.BSKY_PASSWORD;
const PUBLICATION_URI = 'at://did:plc:4po2afnpxgpdwpsr5fwgw3we/site.standard.publication/self';

async function publish() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: node scripts/publish_standard.js <path-to-markdown-file>');
    process.exit(1);
  }

  if (!BSKY_HANDLE || !BSKY_PASSWORD) {
    console.error('Error: BSKY_HANDLE and BSKY_PASSWORD environment variables are required.');
    process.exit(1);
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (!data.title || !data.date) {
      console.error('Error: Markdown file must have title and date in frontmatter.');
      process.exit(1);
    }

    // Determine the slug and path
    const slug = path.basename(filePath, path.extname(filePath));
    const postPath = `/blog/${slug}/`;

    const agent = new AtpAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: BSKY_HANDLE, password: BSKY_PASSWORD });

    console.log(`Logged in as ${BSKY_HANDLE}`);

    const record = {
      $type: 'site.standard.document',
      site: PUBLICATION_URI,
      title: data.title,
      publishedAt: new Date(data.date).toISOString(),
      path: postPath,
      description: data.description || '',
    };

    console.log('Publishing record to PDS...');

    // Create the record in the site.standard.document collection
    const response = await agent.com.atproto.repo.createRecord({
      repo: agent.session.did,
      collection: 'site.standard.document',
      record: record,
    });

    const atUri = response.data.uri;
    console.log(`\nSuccess! Record created: ${atUri}`);
    console.log('\nAdd this to your post frontmatter:');
    console.log(`atUri: "${atUri}"`);
  } catch (error) {
    console.error('Error publishing to Standard.site:', error.message);
    process.exit(1);
  }
}

publish();
