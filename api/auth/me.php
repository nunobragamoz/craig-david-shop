<?php
// GET api/auth/me.php - devolve o utilizador logado, ou null se não houver nenhum
require_once __DIR__ . '/../includes/init.php';
requireMethod('GET');

jsonResponse(['user' => currentUser()]);
