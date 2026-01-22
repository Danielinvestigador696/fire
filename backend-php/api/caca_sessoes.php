<?php
/**
 * API de Sessões de Caça e Rastreamento de Localização
 * Endpoints:
 * - POST /api/caca-sessoes - Criar sessão
 * - GET /api/caca-sessoes/:id - Obter sessão
 * - POST /api/caca-sessoes/:id/localizacoes - Enviar localização
 * - GET /api/caca-sessoes/:id/localizacoes - Obter localizações dos membros
 * - PUT /api/caca-sessoes/:id/finalizar - Finalizar sessão
 */

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/response.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $userId = getUserId();
    if (!$userId) {
        errorResponse('Não autenticado', 401);
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_SERVER['REQUEST_URI'];
    $pathParts = explode('/', trim(parse_url($path, PHP_URL_PATH), '/'));
    
    // Remover 'api' e 'caca-sessoes' do path
    $pathParts = array_slice($pathParts, array_search('caca-sessoes', $pathParts) + 1);

    $db = getDatabase();

    switch ($method) {
        case 'POST':
            if (empty($pathParts)) {
                // POST /api/caca-sessoes - Criar sessão
                try {
                    $data = json_decode(file_get_contents('php://input'), true);
                    
                    $equipeId = $data['equipeId'] ?? null;
                    $intencaoId = $data['intencaoId'] ?? null;
                    $dataInicio = $data['dataInicio'] ?? date('Y-m-d H:i:s');
                    
                    if (!$equipeId) {
                        errorResponse('equipeId é obrigatório', 400);
                    }

                    // Verificar se usuário é membro da equipe
                    $member = $db->fetchOne(
                        "SELECT * FROM equipe_membros WHERE equipe_id = ? AND user_id = ?",
                        [$equipeId, $userId]
                    );
                    
                    if (!$member) {
                        errorResponse('Você não é membro desta equipe', 403);
                    }

                    // Criar sessão
                    $sessaoId = $db->insert('caca_sessoes', [
                        'intencao_id' => $intencaoId ?: null,
                        'equipe_id' => $equipeId,
                        'data_inicio' => $dataInicio,
                        'status' => 'ATIVA'
                    ]);

                    $sessao = $db->fetchOne(
                        "SELECT * FROM caca_sessoes WHERE id = ?",
                        [$sessaoId]
                    );

                    successResponse(['sessao' => toCamelCase($sessao)]);
                } catch (Throwable $e) {
                    error_log("Erro ao criar sessão: " . $e->getMessage());
                    errorResponse('Erro ao criar sessão: ' . $e->getMessage(), 500);
                }
            }
            } elseif (isset($pathParts[0]) && is_numeric($pathParts[0]) && isset($pathParts[1]) && $pathParts[1] === 'localizacoes') {
                // POST /api/caca-sessoes/:id/localizacoes - Enviar localização(ões)
                $sessaoId = (int)$pathParts[0];
                
                // Verificar se sessão existe e usuário tem acesso
                $sessao = $db->fetchOne(
                    "SELECT * FROM caca_sessoes WHERE id = ?",
                    [$sessaoId]
                );
                
                if (!$sessao) {
                    errorResponse('Sessão não encontrada', 404);
                }

                // Verificar se usuário é membro da equipe
                $member = $db->fetchOne(
                    "SELECT * FROM equipe_membros WHERE equipe_id = ? AND user_id = ?",
                    [$sessao['equipe_id'], $userId]
                );
                
                if (!$member) {
                    errorResponse('Você não tem acesso a esta sessão', 403);
                }

                $data = json_decode(file_get_contents('php://input'), true);
                $localizacoes = $data['localizacoes'] ?? [];
                
                if (empty($localizacoes)) {
                    errorResponse('Nenhuma localização fornecida', 400);
                }

                $inseridas = 0;
                foreach ($localizacoes as $loc) {
                    // Validar coordenadas
                    $lat = $loc['latitude'] ?? null;
                    $lon = $loc['longitude'] ?? null;
                    
                    if ($lat === null || $lon === null || 
                        $lat < -90 || $lat > 90 || 
                        $lon < -180 || $lon > 180) {
                        continue; // Pular localização inválida
                    }

                    try {
                        $db->insert('caca_localizacoes', [
                            'sessao_id' => $sessaoId,
                            'user_id' => $userId,
                            'latitude' => $lat,
                            'longitude' => $lon,
                            'accuracy' => $loc['accuracy'] ?? null,
                            'altitude' => $loc['altitude'] ?? null,
                            'heading' => $loc['heading'] ?? null,
                            'speed' => $loc['speed'] ?? null,
                            'timestamp' => $loc['timestamp'] ?? date('Y-m-d H:i:s'),
                            'sincronizado' => 1
                        ]);
                        $inseridas++;
                    } catch (Exception $e) {
                        error_log("Erro ao inserir localização: " . $e->getMessage());
                        // Continuar com próxima localização
                    }
                }

                successResponse([
                    'inseridas' => $inseridas,
                    'total' => count($localizacoes)
                ]);
            } else {
                errorResponse('Endpoint não encontrado', 404);
            }
            break;

        case 'GET':
            if (isset($pathParts[0]) && is_numeric($pathParts[0])) {
                $sessaoId = (int)$pathParts[0];
                
                if (isset($pathParts[1]) && $pathParts[1] === 'localizacoes') {
                    // GET /api/caca-sessoes/:id/localizacoes - Obter localizações
                    $sessao = $db->fetchOne(
                        "SELECT * FROM caca_sessoes WHERE id = ?",
                        [$sessaoId]
                    );
                    
                    if (!$sessao) {
                        errorResponse('Sessão não encontrada', 404);
                    }

                    // Verificar se usuário é membro da equipe
                    $member = $db->fetchOne(
                        "SELECT * FROM equipe_membros WHERE equipe_id = ? AND user_id = ?",
                        [$sessao['equipe_id'], $userId]
                    );
                    
                    if (!$member) {
                        errorResponse('Você não tem acesso a esta sessão', 403);
                    }

                    // Buscar localizações de todos os membros da equipe
                    $localizacoes = $db->fetchAll(
                        "SELECT cl.*, u.name, u.nickname, u.avatar
                         FROM caca_localizacoes cl
                         INNER JOIN users u ON cl.user_id = u.id
                         WHERE cl.sessao_id = ?
                         ORDER BY cl.timestamp DESC",
                        [$sessaoId]
                    );

                    // Agrupar por usuário e pegar última localização de cada um
                    $ultimasLocalizacoes = [];
                    $todasLocalizacoes = [];

                    foreach ($localizacoes as $loc) {
                        $userIdLoc = $loc['user_id'];
                        if (!isset($ultimasLocalizacoes[$userIdLoc])) {
                            $ultimasLocalizacoes[$userIdLoc] = toCamelCase($loc);
                        }
                        $todasLocalizacoes[] = toCamelCase($loc);
                    }

                    successResponse([
                        'ultimasLocalizacoes' => array_values($ultimasLocalizacoes),
                        'todasLocalizacoes' => $todasLocalizacoes
                    ]);
                } else {
                    // GET /api/caca-sessoes/:id - Obter sessão
                    $sessao = $db->fetchOne(
                        "SELECT * FROM caca_sessoes WHERE id = ?",
                        [$sessaoId]
                    );
                    
                    if (!$sessao) {
                        errorResponse('Sessão não encontrada', 404);
                    }

                    // Verificar se usuário é membro da equipe
                    $member = $db->fetchOne(
                        "SELECT * FROM equipe_membros WHERE equipe_id = ? AND user_id = ?",
                        [$sessao['equipe_id'], $userId]
                    );
                    
                    if (!$member) {
                        errorResponse('Você não tem acesso a esta sessão', 403);
                    }

                    successResponse(['sessao' => toCamelCase($sessao)]);
                }
            } else {
                errorResponse('Endpoint não encontrado', 404);
            }
            break;

        case 'PUT':
            if (isset($pathParts[0]) && is_numeric($pathParts[0]) && isset($pathParts[1]) && $pathParts[1] === 'finalizar') {
                // PUT /api/caca-sessoes/:id/finalizar - Finalizar sessão
                $sessaoId = (int)$pathParts[0];
                
                $sessao = $db->fetchOne(
                    "SELECT * FROM caca_sessoes WHERE id = ?",
                    [$sessaoId]
                );
                
                if (!$sessao) {
                    errorResponse('Sessão não encontrada', 404);
                }

                // Verificar se usuário é membro da equipe
                $member = $db->fetchOne(
                    "SELECT * FROM equipe_membros WHERE equipe_id = ? AND user_id = ?",
                    [$sessao['equipe_id'], $userId]
                );
                
                if (!$member) {
                    errorResponse('Você não tem acesso a esta sessão', 403);
                }

                // Finalizar sessão
                $db->update('caca_sessoes', $sessaoId, [
                    'status' => 'FINALIZADA',
                    'data_fim' => date('Y-m-d H:i:s')
                ]);

                $sessaoAtualizada = $db->fetchOne(
                    "SELECT * FROM caca_sessoes WHERE id = ?",
                    [$sessaoId]
                );

                successResponse(['sessao' => toCamelCase($sessaoAtualizada)]);
            } else {
                errorResponse('Endpoint não encontrado', 404);
            }
            break;

        default:
            errorResponse('Método não permitido', 405);
    }
} catch (Throwable $e) {
    error_log("Erro na API de sessões de caça: " . $e->getMessage());
    errorResponse('Erro interno do servidor: ' . $e->getMessage(), 500);
}
