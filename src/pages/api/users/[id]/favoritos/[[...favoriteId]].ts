
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id, favoriteId } = req.query;
  const token = req.headers.authorization;

  // Ensure we have a token and a user ID
  if (!token || !id) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }

  const backendUrl = 'https://mileria-backend.vercel.app/api';
  const productoId = Array.isArray(favoriteId) ? favoriteId[0] : undefined;

  let url = `${backendUrl}/users/${id}/favoritos`;
  if (method === 'DELETE' && productoId) {
    url += `/${productoId}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      // Only include body for methods that should have one
      ...(method === 'POST' && { body: JSON.stringify(req.body) }),
    });

    // Check if the response from the backend is not successful
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error en el servidor de backend' }));
        return res.status(response.status).json({ success: false, ...errorData });
    }
    
    // For DELETE requests, a 204 No Content is a success
    if (response.status === 204) {
        return res.status(204).end();
    }

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error: any) {
    console.error('Error en el proxy de favoritos:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
  }
}
