<?php
// GET  api/profile.php                                   → os meus dados
// POST api/profile.php { nome, email, telefone, … }      → atualiza os meus dados
// POST api/profile.php { password_atual, nova_password } → altera a minha password
require_once __DIR__ . '/includes/init.php';
$user = requireLogin();
$db = getDB();

// Nunca seleciona a coluna da password
function loadProfile(PDO $db, int $id): array {
    $stmt = $db->prepare('SELECT id, nome, email, telefone, morada, cidade, codigo_postal, tipo_utilizador, criado_em FROM users WHERE id = ?');
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    jsonResponse(loadProfile($db, $user['id']));
}

requireMethod('POST');
$data = getJsonBody();

// ---- Alteração de password ----
if (isset($data['nova_password'])) {
    $stmt = $db->prepare('SELECT password FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    $hash = $stmt->fetchColumn();

    $errors = [];
    if (!password_verify($data['password_atual'] ?? '', $hash)) $errors['password_atual'] = 'Password atual incorreta';
    if (strlen($data['nova_password']) < 8) $errors['nova_password'] = 'Mínimo 8 caracteres';
    if ($errors) jsonError('Não foi possível alterar a password', 422, $errors);

    $db->prepare('UPDATE users SET password = ? WHERE id = ?')
       ->execute([password_hash($data['nova_password'], PASSWORD_DEFAULT), $user['id']]);
    jsonResponse(['ok' => true]);
}

// ---- Dados pessoais ----
$nome = trim($data['nome'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$telefone = preg_replace('/\s+/', '', $data['telefone'] ?? '');
$morada = trim($data['morada'] ?? '');
$cidade = trim($data['cidade'] ?? '');
$codigoPostal = trim($data['codigo_postal'] ?? '');

$errors = [];
if (mb_strlen($nome) < 2) $errors['nome'] = 'Indique o nome';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email inválido';
if ($telefone !== '' && !preg_match('/^\d{9}$/', $telefone)) $errors['telefone'] = 'Telefone com 9 dígitos';
if ($codigoPostal !== '' && !preg_match('/^\d{4}-\d{3}$/', $codigoPostal)) $errors['codigo_postal'] = 'Formato 0000-000';

// O email não pode já pertencer a OUTRO utilizador
$stmt = $db->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
$stmt->execute([$email, $user['id']]);
if ($stmt->fetch()) $errors['email'] = 'Este email já está registado';
if ($errors) jsonError('Verifique os campos assinalados', 422, $errors);

$db->prepare('UPDATE users SET nome = ?, email = ?, telefone = ?, morada = ?, cidade = ?, codigo_postal = ? WHERE id = ?')
   ->execute([$nome, $email, $telefone ?: null, $morada ?: null, $cidade ?: null, $codigoPostal ?: null, $user['id']]);

// Manter a sessão sincronizada, porque a navbar mostra o nome
$_SESSION['user']['nome'] = $nome;
$_SESSION['user']['email'] = $email;
jsonResponse(loadProfile($db, $user['id']));
