<?php
/**
 * Router Principal da API
 * Roteia requisições para os módulos apropriados
 */

// Tratamento de CORS manual simplificado
// Permitir todas as origens (em produção deve ser restrito)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache por 1 dia
}

// Access-Control headers são recebidos durante requisições OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Headers padrão para JSON
header('Content-Type: application/json; charset=utf-8');

// Debug mode
$debugMode = isset($_GET['debug']) && $_GET['debug'] === '1';

// Health check
if (strpos($_SERVER['REQUEST_URI'], '/health') !== false) {
    echo json_encode(['status' => 'ok', 'server' => 'PHP ' . phpversion()]);
    exit;
}

// Router simples
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];

// Remover query string
$requestUri = strtok($requestUri, '?');

// Remover base path
$basePath = dirname($scriptName);
if ($basePath !== '/' && strpos($requestUri, $basePath) === 0) {
    $requestUri = substr($requestUri, strlen($basePath));
}

$requestUri = '/' . trim($requestUri, '/');
$pathParts = array_values(array_filter(explode('/', $requestUri)));

// Remove 'backend-php' e 'api' se existirem no path
if (!empty($pathParts) && $pathParts[0] === 'backend-php') array_shift($pathParts);
if (!empty($pathParts) && $pathParts[0] === 'api') array_shift($pathParts);

// Mapeamento de rotas
$modules = [
    'equipes' => 'm_equipes.php',
    'armas' => 'm_armas.php',
    'documentos' => 'm_documentos.php',
    'caca' => 'm_caca.php',
    'caca-sessoes' => 'caca_sessoes.php',
    'setup-caca' => 'setup_caca_tables.php',
    'notificacoes' => 'm_notificacoes.php',
    'auth' => 'm_auth.php',
    'assinaturas' => 'm_assinaturas.php',
    'users' => 'm_users.php',
    'admin' => 'm_admin.php',
    'upload' => 'upload.php',
    'ajuda' => 'ajuda.php',
];

if (empty($pathParts) || !isset($modules[$pathParts[0]])) {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint não encontrado', 'modules' => array_keys($modules)]);
    exit;
}

$module = $pathParts[0];
$requestPathParts = array_slice($pathParts, 1);
$moduleFile = __DIR__ . '/' . $modules[$module];

if (file_exists($moduleFile)) {
    require_once $moduleFile;
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Módulo configurado mas arquivo não encontrado']);
}
