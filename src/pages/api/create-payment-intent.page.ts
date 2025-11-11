
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Ensure the Stripe secret key is set
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This endpoint is misnamed. It doesn't create a PaymentIntent anymore.
// It creates a Checkout Session for one-time payments from the cart.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Instead of just amount, we should receive cart items to be more secure
      // and to show itemized details in the Stripe Checkout.
      const { items } = req.body; // Expecting an array of items

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Cart items are required' });
      }

      // Construct line_items for Stripe Checkout from the cart items
      const line_items = items.map(item => {
        // Each item should have at least name, amount (in cents), and quantity
        if (!item.name || !item.amount || !item.quantity) {
            throw new Error('Each item must have a name, amount, and quantity.');
        }
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    // (Optional) You can add more product details like images
                    // images: [item.image_url],
                },
                unit_amount: item.amount, // Amount in cents
            },
            quantity: item.quantity,
        };
      });

      const YOUR_DOMAIN = req.headers.origin || 'http://localhost:3000';

      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items, // Use the constructed line items
        mode: 'payment', // Specify 'payment' for one-time purchases
        success_url: `${YOUR_DOMAIN}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
      });

      // Respond with the session URL to redirect the user
      if (session.url) {
        res.status(200).json({ url: session.url });
      } else {
        res.status(500).json({ error: { message: 'Stripe session was created but is missing a URL.' } });
      }

    } catch (err) {
      const error = err as Error;
      console.error(`Error creating Stripe checkout session: ${error.message}`);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
