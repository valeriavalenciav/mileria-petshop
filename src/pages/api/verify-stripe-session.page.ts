
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * API handler to verify a Stripe Checkout session and retrieve its status.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Use the session_id to retrieve the Checkout Session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Respond with the relevant details of the session
    res.status(200).json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
    });

  } catch (err: any) {
    console.error(`Error retrieving Stripe session: ${err.message}`);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
};

export default handler;
