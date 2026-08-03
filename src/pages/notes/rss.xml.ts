import rss from '@astrojs/rss';
import { getPublishedNotes } from '@lib/utils';

export async function GET() {
  const notes = await getPublishedNotes();
  return rss({
    title: `Notes | www.joshfinnie.com`,
    site: import.meta.env.SITE,
    description: 'Short notes and gists worth remembering, and worth sharing.',
    customData: `<language>en-us</language>`,
    items: notes.map((note) => ({
      title: note.data.title,
      link: `/notes/${note.id}/`,
      pubDate: new Date(note.data.date),
      description: note.data.description ?? '',
      categories: note.data.tags,
    })),
  });
}
