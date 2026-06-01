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

    let title = data.title;
    let date = data.date || new Date().toISOString();
    let description = data.description || '';
    const isIndex = path.basename(filePath) === 'index.astro';

    if (isIndex) {
      title = 'Josh Finnie | Senior Software Engineer & Data Nerd';
      description = 'Senior software engineer and data nerd at People Data Labs.';
    }

    if (!title) {
      console.error('Error: File must have a title in frontmatter (or be index.astro).');
      process.exit(1);
    }

    // Determine the path based on file location
    const absoluteFilePath = path.resolve(filePath);
    const slug = path.basename(filePath, path.extname(filePath));
    let postPath = '';

    if (absoluteFilePath.includes('/src/pages/')) {
      postPath = slug === 'index' ? '/' : `/${slug}/`;
    } else if (absoluteFilePath.includes('/src/collections/blog/')) {
      postPath = `/blog/${slug}/`;
    } else if (absoluteFilePath.includes('/src/collections/projects/')) {
      postPath = `/projects/${slug}/`;
    } else {
      // Fallback
      postPath = `/${slug}/`;
    }

    const agent = new AtpAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: BSKY_HANDLE, password: BSKY_PASSWORD });

    console.log(`Logged in as ${BSKY_HANDLE}`);

    const record = {
      $type: 'site.standard.document',
      site: PUBLICATION_URI,
      title: title,
      publishedAt: new Date(date).toISOString(),
      path: postPath,
      description: description,
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
