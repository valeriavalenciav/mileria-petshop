
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// This is a guard to ensure the secret key is not undefined.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

// Initialize Stripe with the secret key.
// The apiVersion property is optional and has been removed to resolve a TypeScript error.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * API handler to create a Stripe Checkout session for subscriptions.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Only allow POST requests.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { priceId } = req.body;

    // Validate that a priceId was sent from the client.
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Determine the base URL for success and cancel URLs.
    const YOUR_DOMAIN = req.headers.origin || 'http://localhost:3000';

    // Create a new Checkout Session with Stripe.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // The line_items array should contain the Price ID of the subscription.
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Set the mode to 'subscription'.
      mode: 'subscription',
      // Define the URLs for successful and cancelled payments.
      // The user will be redirected to these URLs by Stripe.
      success_url: `${YOUR_DOMAIN}/?subscription_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/subscription`,
    });

    // If the session is created successfully, send back its URL.
    if (session.url) {
      res.status(200).json({ url: session.url });
    } else {
      // This case should ideally not happen if the session is created.
      res.status(500).json({ error: { message: 'Stripe session was created but is missing a URL.' } });
    }

  } catch (err: any) {
    console.error(`Error creating Stripe session: ${err.message}`);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
};

export default handler;
