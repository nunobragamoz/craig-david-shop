<?php
// Terminar sessão do utilizador
require_once __DIR__ . '/../includes/init.php';
requireMethod('POST');

$_SESSION = [];
session_destroy();
jsonResponse(['ok' => true]);
