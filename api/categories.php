<?php
// GET api/categories.php → all categories (public)
require_once __DIR__ . '/includes/init.php';
requireMethod('GET');

$rows = getDB()->query('SELECT id, nome FROM categories ORDER BY nome')->fetchAll();
jsonResponse($rows);
