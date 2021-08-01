/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Document } from '@prismicio/client/types/documents';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';

function linkResolver(doc: Document): string {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

export default async (req, res) => {
  const client = getPrismicClient();
  const { token: ref, documentId } = req.query;
  const redirectUrl = await client
    .getPreviewResolver(ref, documentId)
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });

  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
      <script>window.location.href = '${redirectUrl}'</script>
      </head>`
  );
  res.end();
};

/* export const getStaticProps: GetStaticProps = async context => {
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
 */