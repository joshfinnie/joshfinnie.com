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
  try {
    const response = await fetch(HARDCOVER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.HARDCOVERAPP_API ?? '',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify(null), { status: 502 });
    }

    const data = await response.json();
    const userBook = data?.data?.me?.[0]?.user_books?.[0] ?? null;

    if (!userBook) {
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
  } catch {
    return new Response(JSON.stringify(null), { status: 500 });
  }
};
