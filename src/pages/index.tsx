import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { useEffect } from 'react';
import { getPrismicClient } from '../services/prismic';
import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
// import { useRef } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): ReactElement {
  // const scroll = useRef(null);
  const [nextPage, setNextPage] = useState<string | undefined>(
    postsPagination.next_page
  );
  const [posts, setPosts] = useState(postsPagination.results);
  const [triggerFech, setTriggerFetch] = useState(0);

  function handleFetchMorePosts(): void {
    setTriggerFetch(state => state + 0.01);
  }
  useEffect(() => {
    async function fetchData(): Promise<void> {
      fetch(nextPage)
        .then(response => response.json())
        .then(data => {
          const newPost = {
            uid: data.results[0].uid,
            first_publication_date: format(
              new Date(data.results[0].last_publication_date),
              'dd MMM yyyy',
              { locale: ptBR }
            ),
            data: {
              title: data.results[0].data.title,
              subtitle: data.results[0].data.subtitle,
              author: data.results[0].data.author,
            },
          };
          setNextPage(data.next_page);
          setPosts([...posts, newPost]);
          // scroll.current.scrollIntoView();
        });
    }

    fetchData();
  }, [triggerFech]);

  return (
    <>
      <Header />

      <main className={styles.content}>
        {posts.map(post => {
          return (
            <div className={styles.post} key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a>{post.data.title}</a>
              </Link>
              <span className={styles.postTitle}>{post.data.subtitle}</span>
              <footer className={commonStyles.info}>
                <FiCalendar />
                <span>{post.first_publication_date}</span>
                <FiUser />
                <span>{post.data.author}</span>
              </footer>
            </div>
          );
        })}
      </main>

      {nextPage && (
        <footer className={styles.foot}>
          <button type="button" onClick={() => handleFetchMorePosts()}>
            Carregar mais posts
          </button>
        </footer>
      )}
      {/* <div ref={scroll}></div> */}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
  };
};
