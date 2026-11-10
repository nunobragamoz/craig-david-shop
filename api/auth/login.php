<?php
// POST api/auth/login.php depois login
require_once __DIR__ . '/../includes/init.php';
requireMethod('POST');

$data = getJsonBody();
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';
if ($email === '' || $password === '') jsonError('Indique o email e a password', 422);

$stmt = getDB()->prepare('SELECT id, nome, email, password, tipo_utilizador FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

// Mensagem genérica para não revelar se o email existe ou não
if (!$user || !password_verify($password, $user['password'])) {
    jsonError('Email ou password incorretos', 401);
}

unset($user['password']);   // nunca mandar a password para o browser
session_regenerate_id(true);
$_SESSION['user'] = $user;
jsonResponse($user);
