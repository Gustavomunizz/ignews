import { authOptions } from './auth/[...nextauth]'
import { stripe } from './../../services/stripe'
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'

type User = {
  ref: {
    id: string
  }

  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (req.method === 'POST') {
    //Fazer uma checkout session

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index('users_by_email'), q.Casefold(session.user.email)))
    )

    let customerId = user.data.stripe_customer_id

    if(!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      })
  
      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id
          }
        })
      )

      customerId = stripeCustomer.id
    }


    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      line_items: [{ price: 'price_1LPqfpEjTAy9T7blwHiXqA1p', quantity: 1 }],
      success_url: process.env.STRIPE_SUCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
