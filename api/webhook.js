export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook received:', req.body);
    res.status(200).json({ message: 'Success' });
  } else {
    res.status(200).json({ message: 'Hello from webhook!' });
  }
}
