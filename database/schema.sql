-- Banco de Dados AnotFire CAC
-- MySQL Schema

CREATE DATABASE IF NOT EXISTS anotfire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE anotfire;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de sessões de usuário (refresh tokens)
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  refresh_token VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_refresh_token (refresh_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de provedores OAuth
CREATE TABLE IF NOT EXISTS oauth_providers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'google', 'facebook'
  provider_user_id VARCHAR(255) NOT NULL,
  access_token VARCHAR(500) NULL,
  refresh_token VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_provider_user (provider, provider_user_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de equipes
CREATE TABLE IF NOT EXISTS equipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NULL,
  admin_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de membros de equipe
CREATE TABLE IF NOT EXISTS equipe_membros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipe_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('admin', 'membro') DEFAULT 'membro',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_equipe_user (equipe_id, user_id),
  INDEX idx_equipe_id (equipe_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de armas
CREATE TABLE IF NOT EXISTS armas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  equipe_id INT NULL,
  numero_serie VARCHAR(255) NOT NULL,
  modelo VARCHAR(255) NOT NULL,
  calibre VARCHAR(50) NOT NULL,
  fabricante VARCHAR(255) NULL,
  tipo VARCHAR(100) NULL,
  observacoes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_equipe_id (equipe_id),
  INDEX idx_numero_serie (numero_serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de fotos de armas
CREATE TABLE IF NOT EXISTS arma_fotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  arma_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  ordem INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE CASCADE,
  INDEX idx_arma_id (arma_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de documentos de armas
CREATE TABLE IF NOT EXISTS arma_documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  arma_id INT NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  numero VARCHAR(255) NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE CASCADE,
  INDEX idx_arma_id (arma_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de manutenções de armas
CREATE TABLE IF NOT EXISTS arma_manutencoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  arma_id INT NOT NULL,
  data DATE NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT NULL,
  custo DECIMAL(10, 2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE CASCADE,
  INDEX idx_arma_id (arma_id),
  INDEX idx_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de documentos (CR, Porte, CAC, Licenças, Seguro)
CREATE TABLE IF NOT EXISTS documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo ENUM('CR', 'PORTE', 'CAC', 'LICENCA', 'SEGURO') NOT NULL,
  numero VARCHAR(255) NOT NULL,
  orgao_emissor VARCHAR(255) NULL,
  data_emissao DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  arquivo_url VARCHAR(500) NULL,
  observacoes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_tipo (tipo),
  INDEX idx_data_vencimento (data_vencimento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de alertas de documentos
CREATE TABLE IF NOT EXISTS documento_alertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  documento_id INT NOT NULL,
  dias_antes INT NOT NULL, -- 90, 30, 0 (vencido)
  enviado BOOLEAN DEFAULT FALSE,
  enviado_em TIMESTAMP NULL,
  FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE,
  INDEX idx_documento_id (documento_id),
  INDEX idx_enviado (enviado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de notificações de documentos
CREATE TABLE IF NOT EXISTS documento_notificacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  documento_id INT NOT NULL,
  user_id INT NOT NULL,
  tipo ENUM('EMAIL', 'PUSH') NOT NULL,
  enviado BOOLEAN DEFAULT FALSE,
  enviado_em TIMESTAMP NULL,
  FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_documento_id (documento_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de registros de caça
CREATE TABLE IF NOT EXISTS caca_registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  equipe_id INT NULL,
  publico BOOLEAN DEFAULT FALSE,
  foto_url VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  data DATETIME NOT NULL,
  peso DECIMAL(6, 2) NULL,
  tamanho DECIMAL(6, 2) NULL,
  observacoes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_equipe_id (equipe_id),
  INDEX idx_publico (publico),
  INDEX idx_data (data),
  INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de fotos adicionais de caça
CREATE TABLE IF NOT EXISTS caca_fotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  caca_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  ordem INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (caca_id) REFERENCES caca_registros(id) ON DELETE CASCADE,
  INDEX idx_caca_id (caca_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo ENUM('DOCUMENTO_VENCENDO', 'CONVITE_EQUIPE', 'NOVA_CACA', 'ALERTA_SISTEMA') NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_lida (lida),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de preferências de notificação
CREATE TABLE IF NOT EXISTS notificacao_preferencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo_notificacao ENUM('DOCUMENTO_VENCENDO', 'CONVITE_EQUIPE', 'NOVA_CACA', 'ALERTA_SISTEMA') NOT NULL,
  email BOOLEAN DEFAULT TRUE,
  push BOOLEAN DEFAULT TRUE,
  dias_antes INT NULL, -- Para documentos (90, 30, 0)
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_tipo (user_id, tipo_notificacao),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de tokens de push notification
CREATE TABLE IF NOT EXISTS push_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  plataforma ENUM('ios', 'android', 'web') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_platform (user_id, plataforma, token),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de compartilhamentos
CREATE TABLE IF NOT EXISTS compartilhamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  caca_id INT NULL,
  tipo ENUM('FACEBOOK', 'INSTAGRAM', 'WHATSAPP', 'TWITTER', 'LINK') NOT NULL,
  url_compartilhada VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (caca_id) REFERENCES caca_registros(id) ON DELETE CASCADE,
  INDEX idx_caca_id (caca_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
