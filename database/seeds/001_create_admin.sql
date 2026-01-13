-- Seed: Criar usuário admin inicial
-- Email: danielinvestigador@gmail.com
-- Senha padrão: Admin@2024 (ALTERAR APÓS PRIMEIRO LOGIN!)

-- IMPORTANTE: Antes de executar, gere o hash da senha usando:
-- cd backend && node scripts/generate-password-hash.js "Admin@2024"
-- Copie o hash gerado e substitua abaixo

-- Hash da senha "Admin@2024" gerado com bcrypt (10 rounds)
-- Substitua o hash abaixo pelo gerado pelo script
INSERT INTO users (name, email, password, role, created_at) 
VALUES (
  'Admin',
  'danielinvestigador@gmail.com',
  'SUBSTITUIR_PELO_HASH_GERADO',
  'admin',
  NOW()
)
ON DUPLICATE KEY UPDATE role = 'admin';

-- Nota: A senha "Admin@2024" deve ser alterada após o primeiro login por segurança!
