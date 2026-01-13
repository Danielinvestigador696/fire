// Script para gerar hash de senha com bcrypt
// Uso: node scripts/generate-password-hash.js "sua-senha"

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'Admin@2024';

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('\nSenha:', password);
    console.log('Hash:', hash);
    console.log('\nCopie o hash acima para o arquivo database/seeds/001_create_admin.sql\n');
  })
  .catch(error => {
    console.error('Erro:', error);
  });
