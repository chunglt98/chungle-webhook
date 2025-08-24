export default function handler(req, res) {
  // Log để debug
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  if (req.method === 'POST') {
    // Xử lý webhook từ Zalo
    const data = req.body;
    
    // Trả về response cho Zalo
    res.status(200).json({ 
      message: 'Webhook received successfully',
      received_data: data 
    });
  } else {
    res.status(200).json({ message: 'Zalo webhook endpoint ready!' });
  }
}
