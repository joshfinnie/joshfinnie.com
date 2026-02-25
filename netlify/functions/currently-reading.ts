const HARDCOVER_API = 'https://api.hardcover.app/v1/graphql';

const query = `
  query GetCurrentlyReading {
    me {
      user_books(where: {status_id: {_eq: 2}}) {
        user_book_reads {
          progress_pages
        }
        book {
          title
          pages
          image {
            url
          }
          slug
          rating
          ratings_count
        }
      }
    }
  }
`;

export default async () => {
  if (!process.env.HARDCOVERAPP_API) {
    console.error('[currently-reading] HARDCOVERAPP_API env var is not set');
    return new Response(JSON.stringify(null), { status: 500 });
  }

  let response: Response;
  try {
    response = await fetch(HARDCOVER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.HARDCOVERAPP_API,
      },
      body: JSON.stringify({ query }),
    });
  } catch (err) {
    console.error('[currently-reading] Failed to reach Hardcover API:', err);
    return new Response(JSON.stringify(null), { status: 502 });
  }

  if (!response.ok) {
    console.error(`[currently-reading] Hardcover API returned ${response.status}: ${await response.text()}`);
    return new Response(JSON.stringify(null), { status: 502 });
  }

  interface UserBook {
    book: {
      title: string;
      slug: string;
      image: { url: string } | null;
      rating: number;
      ratings_count: number;
      pages: number;
    };
    user_book_reads: { progress_pages: number }[];
  }

  let data: { data?: { me?: { user_books?: UserBook[] }[] } };
  try {
    data = await response.json();
  } catch (err) {
    console.error('[currently-reading] Failed to parse Hardcover API response:', err);
    return new Response(JSON.stringify(null), { status: 502 });
  }

  const userBook = data?.data?.me?.[0]?.user_books?.[0] ?? null;

  if (!userBook) {
    console.log('[currently-reading] No currently-reading book found');
    return new Response(JSON.stringify(null), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const book = {
    title: userBook.book.title,
    slug: userBook.book.slug,
    imageUrl: userBook.book.image?.url ?? null,
    rating: userBook.book.rating,
    ratingCount: userBook.book.ratings_count,
    pages: userBook.book.pages,
    progressPages: userBook.user_book_reads?.[0]?.progress_pages ?? 0,
  };

  return new Response(JSON.stringify(book), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
