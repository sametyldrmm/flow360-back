import { OAuth2Client } from 'google-auth-library';

// Google Cloud Console'dan alınan bilgiler
const CLIENT_ID = '481024629208-dm36kh3tc4tp0cablfhp0tdd93laq3il.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3001/oauth2callback';

// .env'den alınan refresh token
const REFRESH_TOKEN = '1//093uHptZVt8dsCgYIARAAGAkSNwF-L9Ir_cnxhOb71lkBsrNe01sVdj2V6wht25yUtrJK-Dmzjv0H1tIG9Ydv3cZoYB3ZFhkYmY8';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Refresh token'ı ve scope'u ayarla
oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
  scope: 'https://www.googleapis.com/auth/gmail.send'
});

async function refreshAccessToken() {
  try {
    const response = await oauth2Client.getAccessToken();
    const accessToken = response.token || response.credentials.access_token;
    const expiryDate = response.res?.data?.expiry_date || response.credentials?.expiry_date;
    
    console.log('Yeni Access Token:', accessToken);
    console.log('Tüm Response:', response);
    
    // .env için gerekli bilgileri formatlı göster
    console.log('\n.env için güncel değerler:');
    console.log('GOOGLE_ACCESS_TOKEN=', accessToken);
    console.log('GOOGLE_REFRESH_TOKEN=', REFRESH_TOKEN);
    console.log('GOOGLE_TOKEN_TYPE=Bearer');
    console.log('GOOGLE_TOKEN_EXPIRY=', expiryDate);
    
    // Expiry date'i okunabilir formatta göster
    if (expiryDate) {
      const expiryDateFormatted = new Date(expiryDate).toLocaleString('tr-TR');
      console.log('\nToken Geçerlilik Süresi:', expiryDateFormatted);
    }
    
    return response;
  } catch (error) {
    console.error('Access token yenileme hatası:', error.message);
    if (error.response) {
      console.error('Hata detayları:', error.response.data);
    }
    throw error;
  }
}

// Fonksiyonu çalıştır
refreshAccessToken().catch(console.error);
