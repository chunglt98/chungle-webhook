export default function handler(req, res) {
  console.log('=== Zalo Bot Webhook ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      // Kiểm tra secret token (nếu cần)
      const secretToken = req.headers['x-secret-token'] || req.body.secret_token;
      console.log('Secret token received:', secretToken);
      
      // Xử lý các loại event từ Zalo
      if (data.event) {
        console.log('Zalo event:', data.event);
        
        // Xử lý tin nhắn
        if (data.event === 'message') {
          console.log('Message received:', data.message);
        }
        
        // Xử lý các event khác...
      }
      
      // Trả về response thành công cho Zalo
      res.status(200).json({ 
        success: true,
        message: 'Zalo webhook processed successfully',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Zalo webhook error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  } else if (req.method === 'GET') {
    // Health check
    res.status(200).json({ 
      status: 'Zalo Bot webhook endpoint is ready!',
      endpoint: 'https://webhook.chungle.io.vn/api/zalo-bot',
      methods: ['GET', 'POST']
    });
  } else {
    res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['GET', 'POST']
    });
  }
}
