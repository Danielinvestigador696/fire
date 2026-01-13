-- Migration: Adicionar sistema de assinaturas e roles
-- Execute este arquivo após o schema inicial
-- Esta versão verifica se a coluna role já existe antes de adicionar

-- Adicionar campo role na tabela users (apenas se não existir)
-- Se você já executou schema-hostinger.sql, a coluna role já existe
-- Nesse caso, pule esta parte e vá direto para criar a tabela assinaturas

-- Verificar e adicionar coluna role se não existir
SET @col_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'role'
);

SET @sql = IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN role ENUM(\'user\', \'admin\') DEFAULT \'user\' AFTER avatar',
  'SELECT "Coluna role já existe" AS mensagem'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS assinaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo ENUM('TRIAL', 'PAGO') NOT NULL,
  status ENUM('ATIVA', 'EXPIRADA', 'CANCELADA') NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NULL,
  dias_trial INT DEFAULT 15,
  liberado_por INT NULL,
  observacoes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (liberado_por) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_data_fim (data_fim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
