<?php
// GET admin/users.php usuarios registadso com a contagem da encomenda (nao a password)
require_once __DIR__ . '/../includes/init.php';
requireAdmin();
requireMethod('GET');

$rows = getDB()->query("SELECT u.id, u.nome, u.email, u.tipo_utilizador, u.criado_em,
                               COUNT(o.id) AS encomendas,
                               COALESCE(SUM(CASE WHEN o.estado <> 'cancelada' THEN o.total END), 0) AS total_gasto
                        FROM users u LEFT JOIN orders o ON o.user_id = u.id
                        GROUP BY u.id ORDER BY u.criado_em DESC")->fetchAll();
jsonResponse($rows);
