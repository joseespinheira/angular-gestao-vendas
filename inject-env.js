const fs = require('fs');
const path = require('path');

// Ajuste o nome do diretório do projeto gerado pelo Angular
const indexPath = path.join('/vercel/output', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error(`Erro: O arquivo ${indexPath} não foi encontrado.`);
  process.exit(1);
}

const env = {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || '',
};

let indexContent = fs.readFileSync(indexPath, 'utf8');

Object.keys(env).forEach(key => {
  const regex = new RegExp(`"${key}":\\s*""`, 'g');
  indexContent = indexContent.replace(regex, `"${key}": "${env[key]}"`);
});

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Variáveis de ambiente injetadas no index.html');