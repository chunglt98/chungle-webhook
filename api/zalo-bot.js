export default async function handler(req, res) {
  console.log('=== Zalo Bot Webhook Forwarder ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Timestamp:', new Date().toISOString());
  
  if (req.method === 'POST') {
    try {
      // URL ngrok của n8n local
      const N8N_WEBHOOK_URL = 'https://dc212048c43d.ngrok-free.app/webhook/zalo-bot';
      
      console.log('Forwarding to n8n:', N8N_WEBHOOK_URL);
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      // Forward request đến n8n local qua ngrok
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'webhook.chungle.io.vn-forwarder',
          'X-Forwarded-From': 'webhook.chungle.io.vn',
          'X-Original-Host': req.headers.host || 'webhook.chungle.io.vn'
        },
        body: JSON.stringify(req.body),
        timeout: 10000 // 10 seconds timeout
      });
      
      if (n8nResponse.ok) {
        const result = await n8nResponse.text();
        console.log('✅ N8N success response:', result);
        
        // Trả về response thành công cho Zalo
        res.status(200).json({ 
          success: true,
          message: 'Webhook forwarded to n8n successfully',
          n8n_status: n8nResponse.status,
          timestamp: new Date().toISOString()
        });
        
      } else {
        console.log('⚠️ N8N error status:', n8nResponse.status);
        const errorText = await n8nResponse.text();
        console.log('N8N error response:', errorText);
        
        // Vẫn trả về 200 cho Zalo để tránh retry
        res.status(200).json({ 
          success: false,
          message: 'N8N returned error but webhook acknowledged',
          n8n_status: n8nResponse.status,
          n8n_error: errorText,
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error('❌ Forward error:', error.message);
      console.error('Error stack:', error.stack);
      
      // Vẫn phải trả về 200 cho Zalo để tránh webhook retry spam
      res.status(200).json({ 
        success: false,
        message: 'Forward failed but acknowledged to prevent retry',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } 
  
  else if (req.method === 'GET') {
    // Health check endpoint
    res.status(200).json({ 
      status: 'Zalo Bot webhook forwarder is ready!',
      service: 'webhook.chungle.io.vn',
      forwards_to: 'https://dc212048c43d.ngrok-free.app',
      endpoints: {
        webhook: 'POST /api/zalo-bot',
        health_check: 'GET /api/zalo-bot'
      },
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } 
  
  else {
    res.status(405).json({ 
      error: 'Method not allowed',
      allowed_methods: ['GET', 'POST'],
      received_method: req.method
    });
  }
}
