import { OAuth2Client } from 'google-auth-library';
import * as readline from 'readline';

// Google Cloud Console'dan aldığın bilgileri buraya gir.
const CLIENT_ID = '481024629208-dm36kh3tc4tp0cablfhp0tdd93laq3il.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3001/oauth2callback'; // Örneğin: 'http://localhost:3000/oauth2callback'

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Gerekli scope'u ve offline erişimi sağlamak için access_type=offline, prompt=consent ekliyoruz.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('Bu URL\'e git ve uygulamaya izin ver:', authUrl);

// Kullanıcıdan kodu alacak bir readline arayüzü oluşturalım.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Yetkilendirme kodunu buraya yapıştır: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Aldığın tokenlar:', tokens);
    // tokens.refresh_token değerini alıp, .env dosyana ekleyebilirsin.
    // Örneğin: GOOGLE_REFRESH_TOKEN=eyJ0eXAiOiJKV1QiLCJh...
  } catch (error) {
    console.error('Token alınırken hata oluştu:', error);
  }
  rl.close();
});
