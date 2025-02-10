const fs = require('fs');
const path = require('path');
const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3000;

// Google Cloud Console üzerinden aldığınız istemci bilgilerini buraya girin:
const CLIENT_ID = '481024629208-dm36kh3tc4tp0cablfhp0tdd93laq3il.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3001/oauth2callback';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// İstediğimiz izinleri belirtiyoruz. Bu örnekte sadece e-posta gönderme izni alıyoruz.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Ana sayfa: Kullanıcıyı Google yetkilendirme sayfasına yönlendiriyoruz.
app.get('/', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // refresh token alabilmek için
    scope: SCOPES,
    prompt: 'consent' // refresh token alınması için gerekebilir
  });
  res.redirect(authUrl);
});

// Google'ın yetkilendirme sonrasında yönlendireceği callback URL'si
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  
  if (!code) {
    res.send('Yetkilendirme kodu alınamadı.');
    return;
  }

  try {
    // Authorization kodu ile tokenları alıyoruz.
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    
    // Token bilgilerini token.json dosyasına yazıyoruz.
    const tokenPath = path.join(__dirname, 'token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
    console.log('Token bilgileri token.json dosyasına kaydedildi:', tokens);
    
    res.send('Token bilgileri token.json dosyasına kaydedildi.');
  } catch (error) {
    console.error('Token alınırken hata oluştu:', error);
    res.send('Token alınırken hata oluştu.');
  }
});

// Express sunucusunu başlatıyoruz.
app.listen(port, () => {
  console.log(`Sunucu port ${port}'da çalışıyor. Tarayıcınızda http://localhost:${port} adresine gidin.`);
});
