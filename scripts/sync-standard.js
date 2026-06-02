import fs from 'node:fs';
import path from 'node:path';
import { AtpAgent } from '@atproto/api';
import { config } from 'dotenv';
import { glob } from 'glob';
import matter from 'gray-matter';
import kebabCase from 'lodash.kebabcase';

config();

const BSKY_HANDLE = process.env.BSKY_HANDLE;
const BSKY_PASSWORD = process.env.BSKY_PASSWORD;
const SITE_URL = 'https://www.joshfinnie.com';
const MAPPING_FILE = path.join(process.cwd(), 'standard-mapping.json');
const WELL_KNOWN_FILE = path.join(process.cwd(), 'public/.well-known/site.standard.publication');

// Load existing mapping
let mapping = {
  publicationUri: '',
  documents: {},
};

if (fs.existsSync(MAPPING_FILE)) {
  mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
}

async function sync() {
  if (!BSKY_HANDLE || !BSKY_PASSWORD) {
    console.error('Error: BSKY_HANDLE and BSKY_PASSWORD environment variables are required.');
    process.exit(1);
  }

  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BSKY_HANDLE, password: BSKY_PASSWORD });
  const did = agent.session.did;
  console.log(`Logged in as ${BSKY_HANDLE} (${did})`);

  // 1. Sync Publication Record
  const pubRecord = {
    $type: 'site.standard.publication',
    name: "Josh Finnie's Blog",
    description: 'Senior Software Engineer at People Data Labs. Writing about Rust, Go, data, and developer lifestyle.',
    url: SITE_URL,
  };

  if (!mapping.publicationUri) {
    console.log('Creating publication record...');
    const res = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'site.standard.publication',
      record: pubRecord,
    });
    mapping.publicationUri = res.data.uri;
    console.log(`Created Publication: ${mapping.publicationUri}`);
  } else {
    console.log('Updating existing publication record...');
    const rkey = mapping.publicationUri.split('/').pop();
    await agent.com.atproto.repo.putRecord({
      repo: did,
      collection: 'site.standard.publication',
      rkey: rkey,
      record: pubRecord,
    });
    console.log(`Updated Publication: ${mapping.publicationUri}`);
  }

  // Update .well-known file
  fs.mkdirSync(path.dirname(WELL_KNOWN_FILE), { recursive: true });
  fs.writeFileSync(WELL_KNOWN_FILE, mapping.publicationUri);

  // 2. Sync Document Records
  const oldDocuments = mapping.documents;
  mapping.documents = {};

  const contentFiles = [
    { pattern: 'src/collections/blog/**/*.{md,mdx}', basePath: '/blog' },
    { pattern: 'src/collections/projects/**/*.{md,mdx}', basePath: '/projects' },
    { pattern: 'src/pages/*.{md,mdx}', basePath: '' },
  ];

  for (const group of contentFiles) {
    const files = await glob(group.pattern);
    for (const filePath of files) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      const rawSlug = path.basename(filePath, path.extname(filePath));
      const slug = data.slug || kebabCase(rawSlug);
      const isIndex = rawSlug === 'index';
      const webPath = isIndex ? '/' : `${group.basePath}/${slug}/`;

      // Check if already mapped (reuse old URI if slug changed but path matches)
      // We check for the new webPath (dashes) or the old raw path (underscores)
      const existingUri = oldDocuments[webPath] || oldDocuments[`${group.basePath}/${rawSlug}/`];

      if (existingUri) {
        mapping.documents[webPath] = existingUri;
        continue;
      }

      if (mapping.documents[webPath]) continue;

      // Handle pages without frontmatter titles (like index)
      let title = data.title;
      if (isIndex && !title) title = 'Josh Finnie | Senior Software Engineer & Data Nerd';
      if (!title) continue;

      console.log(`Syncing document: ${webPath}`);

      const docRecord = {
        $type: 'site.standard.document',
        site: mapping.publicationUri,
        title: title,
        publishedAt: new Date(data.date || fs.statSync(filePath).mtime).toISOString(),
        path: webPath,
        description: data.description || '',
      };

      try {
        const res = await agent.com.atproto.repo.createRecord({
          repo: did,
          collection: 'site.standard.document',
          record: docRecord,
        });
        mapping.documents[webPath] = res.data.uri;
        console.log(`  Created: ${res.data.uri}`);

        // Save mapping incrementally to be safe
        fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));

        // Throttling
        await new Promise((r) => setTimeout(r, 200));
      } catch (e) {
        console.error(`  Error syncing ${webPath}: ${e.message}`);
      }
    }
  }

  // Handle special case: index.astro (manually since it's not MDX)
  if (!mapping.documents['/']) {
    console.log('Syncing document: /');
    const existingUri = oldDocuments['/'];
    if (existingUri) {
      mapping.documents['/'] = existingUri;
    } else {
      const docRecord = {
        $type: 'site.standard.document',
        site: mapping.publicationUri,
        title: 'Josh Finnie | Senior Software Engineer & Data Nerd',
        publishedAt: new Date().toISOString(),
        path: '/',
      };
      const res = await agent.com.atproto.repo.createRecord({
        repo: did,
        collection: 'site.standard.document',
        record: docRecord,
      });
      mapping.documents['/'] = res.data.uri;
    }
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  }

  console.log('\nSync complete! mapping saved to standard-mapping.json');
}

sync();
