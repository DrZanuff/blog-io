import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { ReactElement } from 'react';
import { RichText } from 'prismic-dom';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { BiCalendar, BiUser } from 'react-icons/bi';
import { FiClock } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        type: string;
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

function generateHtml(post: Post): Array<string> {
  // eslint-disable-next-line prefer-const
  let htmlArray = [];
  for (let i = 0; i < post.data.content.length; i += 1) {
    htmlArray.push(
      <div className={styles.content_body}>
        <h2>{post.data.content[i].heading}</h2>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: RichText.asHtml(post.data.content[i].body),
          }}
        />
      </div>
    );
  }

  return htmlArray;
}

export default function Post({ post }: PostProps): ReactElement {
  return (
    <>
      <Header />
      <div className={styles.image}>
        <img src={post.data.banner.url} alt={post.data.title} />
      </div>
      <main className={styles.main}>
        <h1 className={styles.title}>{post.data.title}</h1>
        <div className={styles.info}>
          <BiCalendar />
          <span>
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </span>
          <BiUser />
          <span>{post.data.author}</span>
          <FiClock />
          <span>4 min</span>
        </div>
        <div>{generateHtml(post).map(node => node)}</div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [],
      pageSize: 100,
    }
  );

  return {
    paths: posts.results.map(post => {
      return `/post/${post.uid}`;
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = (await prismic.getByUID('posts', String(slug), {})) as Post;

  const post = {
    first_publication_date: response.first_publication_date,
    data: response.data,
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 Minutos
  };
};
