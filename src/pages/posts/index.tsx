import { GetStaticProps } from 'next'
import Head from 'next/head'
import { createClient } from '../../../prismicio'
import { asText, asHTML } from '@prismicio/helpers'
import Link from 'next/link'
import styles from './styles.module.scss'

type Posts = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Posts[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params, previewData }) => {
  const client = createClient({ previewData })

  const response = await client.getByType('post')

  //console.log(JSON.stringify(response.results[0].data, null, 2))

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: { posts }
  }
}
