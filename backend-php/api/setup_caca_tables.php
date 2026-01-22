<?php
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/response.php';

// Proteção simples por chave na query string para evitar execução acidental
// Ex: /api/setup-caca?key=fix_db
if (!isset($_GET['key']) || $_GET['key'] !== 'fix_db') {
    errorResponse('Acesso negado. Chave inválida.', 403);
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $results = [];
    
    // Tabela caca_sessoes
    $sqlSessoes = "CREATE TABLE IF NOT EXISTS caca_sessoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intencao_id INT NULL,
      equipe_id INT NOT NULL,
      data_inicio DATETIME NOT NULL,
      data_fim DATETIME NULL,
      status ENUM('ATIVA', 'FINALIZADA', 'CANCELADA') DEFAULT 'ATIVA',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE CASCADE,
      INDEX idx_equipe_id (equipe_id),
      INDEX idx_status (status),
      INDEX idx_data_inicio (data_inicio)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sqlSessoes);
    $results[] = "Tabela caca_sessoes verificada/criada.";
    
    // Tabela caca_localizacoes
    $sqlLocalizacoes = "CREATE TABLE IF NOT EXISTS caca_localizacoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sessao_id INT NOT NULL,
      user_id INT NOT NULL,
      latitude DECIMAL(10, 8) NOT NULL,
      longitude DECIMAL(11, 8) NOT NULL,
      accuracy DECIMAL(8, 2) NULL,
      altitude DECIMAL(8, 2) NULL,
      heading DECIMAL(5, 2) NULL,
      speed DECIMAL(5, 2) NULL,
      timestamp DATETIME NOT NULL,
      sincronizado BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessao_id) REFERENCES caca_sessoes(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_sessao_id (sessao_id),
      INDEX idx_user_id (user_id),
      INDEX idx_timestamp (timestamp),
      INDEX idx_sincronizado (sincronizado),
      INDEX idx_sessao_user_timestamp (sessao_id, user_id, timestamp)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sqlLocalizacoes);
    $results[] = "Tabela caca_localizacoes verificada/criada.";
    
    // Tabela mapa_cache_areas
    $sqlCache = "CREATE TABLE IF NOT EXISTS mapa_cache_areas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      nome VARCHAR(255) NOT NULL,
      min_latitude DECIMAL(10, 8) NOT NULL,
      max_latitude DECIMAL(10, 8) NOT NULL,
      min_longitude DECIMAL(11, 8) NOT NULL,
      max_longitude DECIMAL(11, 8) NOT NULL,
      zoom_min INT NOT NULL DEFAULT 10,
      zoom_max INT NOT NULL DEFAULT 16,
      data_download DATETIME NOT NULL,
      tamanho_mb DECIMAL(10, 2) NULL,
      status ENUM('BAIXANDO', 'COMPLETO', 'ERRO') DEFAULT 'BAIXANDO',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sqlCache);
    $results[] = "Tabela mapa_cache_areas verificada/criada.";
    
    successResponse(['log' => $results, 'message' => 'Setup de tabelas concluído com sucesso']);
    
} catch (Exception $e) {
    errorResponse('Erro no setup: ' . $e->getMessage(), 500);
} catch (Throwable $e) {
    errorResponse('Erro fatal no setup: ' . $e->getMessage(), 500);
}
?>
