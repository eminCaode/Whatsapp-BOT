const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const PHONE_NUMBER_ID = '404966529363560'; 
const ACCESS_TOKEN = 'EAAGwpnvTIbgBO88ZAZAIEnSjxlNQFU9BZC3iKLCDh72Vmcg80IbJi45ilpJ1lrrTai7WQQyG6XfkoRT2tZAbNZAKpPxWOc6sN90CIZAXlgBqudweSbDFZB6NzxRTmfoVFPfp7ZCFuIbSGVUAABVgMbNuwZB7S3ImOM1GZBJghlvLzLQbyiXb2qcoC9vaT8ZAYbYevpawwvsdr3hDdgXgTtUCwkZD'; 

const sendMessage = async (to, text) => {
  try {
    const response = await axios.post(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: 'whatsapp',
      to: to,
      text: {
        body: text,
      },
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
};

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/webhook', (req, res) => {
  const verifyToken = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (verifyToken === 'Emincan123') { // Bu token Meta'nın ayarlarına göre 
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => { 
  console.log('Received webhook:', req.body);

  // Gelen mesajları işleyin
  if (req.body.entry) {
    for (const entry of req.body.entry) {
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              console.log('Message:', message);
                
              const from = message.from; // Mesajı gönderen numara
              let text = 'Thank you for your message!'; // Yanıt mesajı

              if (message.text && message.text.body) {
                const receivedText = message.text.body.toLowerCase();
                if (receivedText.includes('merhaba')) {
                  text = 'Merhaba! Size nasıl yardımcı olabilirim?';
                } else if (receivedText.includes('hava durumu')) {
                  text = 'Bugünkü hava durumu: Güneşli';
                }else if(receivedText.includes('Hello')){
                text= 'Hello, How can I help you';

                }
                // Daha fazla anahtar kelime ekleyebilirsiniz
              }

              // Yanıt gönder
              await sendMessage(from, text);
            }
          }
        }
      }
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Listening for webhook messages...'); // Yeni satır eklendi
});
