
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// IMPORTANT: Replace with your actual secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover', // Adjusted to match project's expected version
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body;

      if (!amount) {
        return res.status(400).json({ message: 'Amount is required' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
