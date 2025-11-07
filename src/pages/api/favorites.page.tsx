
import { NextApiRequest, NextApiResponse } from 'next';

import { addFavorite, getFavorites, removeFavorite } from '@src/lib/favorites';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { userId, productId } = req.body;

  switch (method) {
    case 'GET':
      const favorites = getFavorites(userId);
      res.status(200).json({ favorites });
      break;
    case 'POST':
      addFavorite(userId, productId);
      res.status(200).json({ message: 'Favorite added' });
      break;
    case 'DELETE':
      removeFavorite(userId, productId);
      res.status(200).json({ message: 'Favorite removed' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
