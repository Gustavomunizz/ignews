import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'
import styles from './home.module.scss'

interface ProductProps {
  product: {
    priceId: string
    amount: number
  }
}

export default function Home({ product }: ProductProps) {
  return (
    <>
      <Head>
        <title>Inicio | ig.news</title>
      </Head>

      <main className={styles.homeContainer}>
        <section className={styles.homeContent}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about <br /> the <span>React</span> world
          </h1>
          <p>
            Get acess to all the publications <br /> <span>for {product.amount} mounth</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/girlCode.svg" alt="Girl Coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LPqfpEjTAy9T7blwHiXqA1p')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      price.unit_amount / 100
    )
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
