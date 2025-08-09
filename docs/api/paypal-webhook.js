// api/paypal-webhook.js
import { put, getDownloadUrl } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, // PayPal sends raw body
  },
};

import getRawBody from 'raw-body';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody.toString());

    // STEP 1: Get PayPal OAuth token
    const tokenRes = await fetch(
      process.env.NODE_ENV === 'production'
        ? 'https://api-m.paypal.com/v1/oauth2/token'
        : 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET
            ).toString('base64'),
        },
        body: 'grant_type=client_credentials',
      }
    );
    const { access_token } = await tokenRes.json();

    // STEP 2: Verify webhook signature
    const verifyRes = await fetch(
      process.env.NODE_ENV === 'production'
        ? 'https://api-m.paypal.com/v1/notifications/verify-webhook-signature'
        : 'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          auth_algo: req.headers['paypal-auth-algo'],
          cert_url: req.headers['paypal-cert-url'],
          transmission_id: req.headers['paypal-transmission-id'],
          transmission_sig: req.headers['paypal-transmission-sig'],
          transmission_time: req.headers['paypal-transmission-time'],
          webhook_id: process.env.PAYPAL_WEBHOOK_ID,
          webhook_event: body,
        }),
      }
    );

    const verification = await verifyRes.json();
    if (verification.verification_status !== 'SUCCESS') {
      return res.status(400).json({ message: 'Webhook verification failed' });
    }

    // STEP 3: Check payment event type
    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const purchaseAmount =
        body.resource.purchase_units[0].amount.value;
      // Optional: verify amount matches your price

      // STEP 4: Generate signed download link from Vercel Blob
      const signedUrl = await getDownloadUrl('products/my-product.pdf', {
        expiresIn: 60 * 10, // expires in 10 minutes
      });

      // Here you can send email with signedUrl instead of returning it
      return res.status(200).json({
        message: 'Payment verified',
        download_url: signedUrl,
      });
    }

    res.status(200).json({ message: 'Event received but ignored' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
