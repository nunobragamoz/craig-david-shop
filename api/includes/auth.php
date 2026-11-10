<?php
// Usuario logado, ou null se não houver
function currentUser(): ?array
{
    return $_SESSION['user'] ?? null;
}

// 401 nao logado
function requireLogin(): array
{
    $user = currentUser();
    if (!$user) jsonError('Precisa de iniciar sessão', 401);
    return $user;
}

// 403 logado mas nao autorizado ou nao e o admin
function requireAdmin(): array
{
    $user = requireLogin();
    if ($user['tipo_utilizador'] !== 'admin') jsonError('Acesso reservado a administradores', 403);
    return $user;
}
