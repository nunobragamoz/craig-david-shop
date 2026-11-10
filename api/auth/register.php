<?php
// Criar uma nova conta de utilizador (registo)
require_once __DIR__ . '/../includes/init.php';
requireMethod('POST');

$data = getJsonBody();
$nome = trim($data['nome'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

// Validacao no servidor nunca confiar no browser
$errors = [];
if (mb_strlen($nome) < 2) $errors['nome'] = 'Indique o seu nome';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email inválido';
if (strlen($password) < 8) $errors['password'] = 'Mínimo 8 caracteres';
if ($errors) jsonError('Verifique os campos assinalados', 422, $errors);

$db = getDB();
$stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) jsonError('Verifique os campos assinalados', 422, ['email' => 'Este email já está registado']);

// password_hash() usa bcrypt por defeito, que é seguro e lento o suficiente para prevenir ataques de força bruta
$stmt = $db->prepare('INSERT INTO users (nome, email, password) VALUES (?, ?, ?)');
$stmt->execute([$nome, $email, password_hash($password, PASSWORD_DEFAULT)]);

$user = ['id' => (int) $db->lastInsertId(), 'nome' => $nome, 'email' => $email, 'tipo_utilizador' => 'cliente'];
session_regenerate_id(true);   // nova sessão para prevenir session fixation
$_SESSION['user'] = $user;
jsonResponse($user, 201);
