import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

async function getRefreshToken() {
  // Client secret dosyasını okuyun
  const credentials = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'client_secret.json'),
      'utf-8'
    )
  );

  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oauth2Client = new OAuth2Client(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Yetkilendirme URL\'sini ziyaret edin:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise((resolve) => {
    rl.question('Yetkilendirme kodunu buraya yapıştırın: ', (code) => {
      rl.close();
      resolve(code);
    });
  });

  const { tokens } = await oauth2Client.getToken(code as string);
  console.log('Refresh Token:', tokens.refresh_token);
}

getRefreshToken(); 