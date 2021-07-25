import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { ReactElement } from 'react';
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

export default function Post({ post }: PostProps): ReactElement {
  console.log(post.data.content);

  return (
    <>
      <Header />
      <div>
        <img src={post.data.banner.url} alt={post.data.title} />
      </div>
      <h1>{post.data.title}</h1>
      <div>
        <span>{post.first_publication_date}</span>
        <span>{post.data.author}</span>
      </div>
      <div>
        {post.data.content.map(p => {
          console.log(p);
          return (
            <div key={Math.random() * 100}>
              <h2>{p.heading}</h2>
              {p.body.map(b => {
                if (b.type === 'list-item') {
                  return (
                    <p>
                      <span>&nbsp;•&nbsp;&nbsp;</span>
                      {b.text}
                    </p>
                  );
                }
                return <p>{b.text}</p>;
              })}
            </div>
          );
        })}
      </div>
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
  };
};
