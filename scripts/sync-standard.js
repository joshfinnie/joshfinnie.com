import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AtpAgent } from '@atproto/api';
import { config } from 'dotenv';
import { glob } from 'glob';
import matter from 'gray-matter';
import kebabCase from 'lodash.kebabcase';
import { isLive } from '../src/lib/published.ts';

config({ quiet: true });

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAPPING_FILE = path.join(ROOT, 'standard-mapping.json');
const WELL_KNOWN_FILE = path.join(ROOT, 'public/.well-known/site.standard.publication');
const SITE_URL = 'https://www.joshfinnie.com';
const INDEX_TITLE = 'Josh Finnie | Senior Software Engineer & Data Nerd';
const DOCUMENT = 'site.standard.document';
const PUBLICATION = 'site.standard.publication';
const DRY_RUN = process.argv.includes('--dry-run');

const PUBLICATION_RECORD = {
  $type: PUBLICATION,
  name: "Josh Finnie's Blog",
  description: 'Senior Software Engineer at People Data Labs. Writing about Rust, Go, data, and developer lifestyle.',
  url: SITE_URL,
};

// Each group mirrors the route that serves it, so a record exists exactly when
// production serves its page. `dated` groups follow the site's publish gate.
const CONTENT_GROUPS = [
  { pattern: 'src/collections/blog/**/*.{md,mdx}', basePath: '/blog', dated: true },
  { pattern: 'src/collections/projects/[^_]*.{md,mdx}', basePath: '/projects', dated: false },
  { pattern: 'src/pages/*.{md,mdx}', basePath: '', dated: false },
];

function readMapping() {
  if (!fs.existsSync(MAPPING_FILE)) return { publicationUri: '', documents: {} };
  return JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
}

function writeMapping(mapping) {
  const documents = Object.fromEntries(Object.entries(mapping.documents).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MAPPING_FILE, `${JSON.stringify({ ...mapping, documents }, null, 2)}\n`);
}

function toDateString(value) {
  return value instanceof Date ? value.toISOString() : value;
}

async function collectDocuments() {
  const documents = new Map();
  documents.set('/', { title: INDEX_TITLE });

  for (const group of CONTENT_GROUPS) {
    for (const file of await glob(group.pattern, { cwd: ROOT })) {
      const { data } = matter(fs.readFileSync(path.join(ROOT, file), 'utf-8'));
      if (!data.title) continue;

      const date = toDateString(data.date);
      if (group.dated && !isLive({ date, draft: data.draft })) continue;

      const slug = data.slug || kebabCase(path.basename(file, path.extname(file)));
      const basePath = data.leftistOnly === true ? '/leftist' : group.basePath;
      documents.set(`${basePath}/${slug}/`, {
        title: data.title,
        description: data.description || undefined,
        publishedAt: date ? new Date(date).toISOString() : undefined,
      });
    }
  }

  return documents;
}

async function listRecords(agent, did, collection) {
  const records = new Map();
  let cursor;
  do {
    const res = await agent.com.atproto.repo.listRecords({ repo: did, collection, limit: 100, cursor });
    for (const record of res.data.records) records.set(record.uri, record.value);
    cursor = res.data.cursor;
  } while (cursor);
  return records;
}

function rkeyOf(uri) {
  return uri.split('/').pop();
}

// Fields this script owns. Anything else on a record (written by another tool)
// is carried over untouched on update.
function buildRecord(existing, site, webPath, doc) {
  const record = {
    ...existing,
    $type: DOCUMENT,
    site,
    path: webPath,
    title: doc.title,
    publishedAt: doc.publishedAt ?? existing?.publishedAt ?? new Date().toISOString(),
  };
  if (doc.description) record.description = doc.description;
  else delete record.description;
  return record;
}

function changedFields(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].filter((key) => JSON.stringify(a[key]) !== JSON.stringify(b[key]));
}

async function sync() {
  const { BSKY_HANDLE, BSKY_PASSWORD } = process.env;
  if (!BSKY_HANDLE || !BSKY_PASSWORD) {
    console.error('Error: BSKY_HANDLE and BSKY_PASSWORD environment variables are required.');
    process.exit(1);
  }

  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BSKY_HANDLE, password: BSKY_PASSWORD });
  const did = agent.session.did;
  console.log(`Logged in as ${BSKY_HANDLE} (${did})${DRY_RUN ? ' [dry run]' : ''}`);

  const oldMapping = readMapping();
  const mapping = { publicationUri: oldMapping.publicationUri, documents: {} };
  const write = async (label, fn) => {
    console.log(label);
    if (!DRY_RUN) await fn();
  };

  const publications = await listRecords(agent, did, PUBLICATION);
  const currentPublication = publications.get(mapping.publicationUri);
  if (!currentPublication) {
    await write('Creating publication record', async () => {
      const res = await agent.com.atproto.repo.createRecord({
        repo: did,
        collection: PUBLICATION,
        record: PUBLICATION_RECORD,
      });
      mapping.publicationUri = res.data.uri;
      publications.set(res.data.uri, PUBLICATION_RECORD);
    });
  } else if (changedFields(currentPublication, PUBLICATION_RECORD).length) {
    await write('Updating publication record', () =>
      agent.com.atproto.repo.putRecord({
        repo: did,
        collection: PUBLICATION,
        rkey: rkeyOf(mapping.publicationUri),
        record: PUBLICATION_RECORD,
      })
    );
  }
  const site = mapping.publicationUri;

  const documents = await collectDocuments();
  const oldCount = Object.keys(oldMapping.documents).length;
  if (documents.size < oldCount / 2) {
    throw new Error(`Found ${documents.size} live documents but the mapping has ${oldCount}; refusing to prune.`);
  }

  const remote = await listRecords(agent, did, DOCUMENT);
  let failures = 0;

  for (const [webPath, doc] of documents) {
    const uri = oldMapping.documents[webPath];
    const existing = uri ? remote.get(uri) : undefined;
    const record = buildRecord(existing, site, webPath, doc);

    try {
      if (!existing) {
        await write(`Creating ${webPath}`, async () => {
          const res = await agent.com.atproto.repo.createRecord({ repo: did, collection: DOCUMENT, record });
          mapping.documents[webPath] = res.data.uri;
        });
      } else {
        mapping.documents[webPath] = uri;
        const changed = changedFields(existing, record);
        if (changed.length) {
          await write(`Updating ${webPath}: ${changed.join(', ')}`, () =>
            agent.com.atproto.repo.putRecord({ repo: did, collection: DOCUMENT, rkey: rkeyOf(uri), record })
          );
        }
      }
    } catch (error) {
      failures++;
      if (uri) mapping.documents[webPath] = uri;
      console.error(`  Error syncing ${webPath}: ${error.message}`);
    }
  }

  // A record goes once nothing maps to it: its post was unpublished, renamed, or
  // deleted, or it is a duplicate from an earlier run. Records belonging to
  // another live publication in this repo are left alone.
  const kept = new Set(Object.values(mapping.documents));
  for (const [uri, value] of remote) {
    if (kept.has(uri)) continue;
    if (value.site !== site && publications.has(value.site)) continue;
    try {
      await write(`Deleting ${value.path} (${rkeyOf(uri)})`, () =>
        agent.com.atproto.repo.deleteRecord({ repo: did, collection: DOCUMENT, rkey: rkeyOf(uri) })
      );
    } catch (error) {
      failures++;
      console.error(`  Error deleting ${uri}: ${error.message}`);
    }
  }

  if (!DRY_RUN) {
    writeMapping(mapping);
    fs.mkdirSync(path.dirname(WELL_KNOWN_FILE), { recursive: true });
    fs.writeFileSync(WELL_KNOWN_FILE, mapping.publicationUri);
  }

  console.log(`\nSync complete: ${documents.size} live documents.${failures ? ` ${failures} failed.` : ''}`);
  if (failures) process.exitCode = 1;
}

sync().catch((error) => {
  console.error(error);
  process.exit(1);
});
