<?php
// Arranque comum a todos os endpoints da API (cada ficheiro começa com require deste):
// liga a base de dados, os helpers e a autenticação, define a resposta como JSON,
// inicia a sessão e converte qualquer exceção não tratada num erro JSON.
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');

// Cookies de sessão são apenas HTTP, não acessíveis via JS, e SameSite=Lax para prevenir CSRF
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'path' => '/']);
session_start();


// Qualquer exceção não tratada é convertida em erro JSON e nao uma pagina de erro HTML
set_exception_handler(function (Throwable $e) {
    if ($e instanceof InvalidArgumentException) jsonError($e->getMessage(), 422);
    error_log($e->getMessage());
    jsonError('Erro interno do servidor', 500);
});
