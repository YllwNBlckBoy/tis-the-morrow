import { getSignedUrl } from '@vercel/blob';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  const { product } = req.query; // product filename in Vercel Blob

  if (!product) {
    return res.status(400).json({ error: 'Product not specified' });
  }

  try {
    const { url } = await getSignedUrl({
      pathname: `products/${product}`, // path in Blob
      access: 'read',
      expiresIn: 60 * 5 // link valid for 5 minutes
    });

    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate link' });
  }
}