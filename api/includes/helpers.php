<?php
// manda dados JSON com http status code e pára o script
function jsonResponse($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Formato de Erros
function jsonError(string $message, int $status = 400, array $errors = []): void
{
    jsonResponse(['error' => $message, 'errors' => (object) $errors], $status);
}

// JSON é enviado pelo React no request body, então $_POST não funciona, então lemos o input
function getJsonBody(): array
{
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

// Pára o script e mostra o 405 se o método HTTP não for o esperado ou permitido
function requireMethod(string ...$methods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods, true)) {
        jsonError('Método não permitido', 405);
    }
}
