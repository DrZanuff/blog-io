import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';


import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home(): ReactElement {
  return (
    <>
      <header className={styles.heading}>
        <img src="/images/Logo.svg" alt="logo" />
      </header>

      <main className={styles.content}>

        <div className={styles.post}>
          <h1>Como utilizar Hooks</h1>
          <span className={styles.postTitle}>
            Pensando em sincronização em vez de ciclos de vida.
          </span>
          <footer className={commonStyles.info}>
            <FiCalendar />
            <span>15 Mar 2021</span>
            <FiUser />
            <span>Joseph Oliveira</span>
          </footer>
        </div>

        <div className={styles.post}>
          <h1>Como utilizar Hooks</h1>
          <span className={styles.postTitle}>
            Pensando em sincronização em vez de ciclos de vida.
          </span>
          <footer className={commonStyles.info}>
            <FiCalendar />
            <span>15 Mar 2021</span>
            <FiUser />
            <span>Joseph Oliveira</span>
          </footer>
        </div>

        <div className={styles.post}>
          <h1>Como utilizar Hooks</h1>
          <span className={styles.postTitle}>
            Pensando em sincronização em vez de ciclos de vida.
          </span>
          <footer className={commonStyles.info}>
            <FiCalendar />
            <span>15 Mar 2021</span>
            <FiUser />
            <span>Joseph Oliveira</span>
          </footer>
        </div>

      </main>

      <footer className={styles.foot}>
        <button type="button">Carregar mais posts</button>
      </footer>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
