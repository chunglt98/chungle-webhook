export default function handler(req, res) {
  console.log('=== Zalo Webhook Debug ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('========================');
  
  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      // Log dữ liệu nhận được từ Zalo
      console.log('Zalo webhook data:', JSON.stringify(data, null, 2));
      
      // Trả về response cho Zalo
      res.status(200).json({ 
        message: 'Webhook received successfully',
        timestamp: new Date().toISOString(),
        received_data: data 
      });
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ 
        message: 'Error processing webhook',
        error: error.message 
      });
    }
  } else if (req.method === 'GET') {
    // Test endpoint
    res.status(200).json({ 
      message: 'Zalo webhook endpoint ready!',
      endpoint: 'https://webhook.chungle.io.vn/api/webhook',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ 
      message: 'Method not allowed',
      allowed_methods: ['GET', 'POST']
    });
  }
}
