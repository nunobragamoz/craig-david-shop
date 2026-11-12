<?php
// GET api/admin/stats.php - numeros para o admin
require_once __DIR__ . '/../includes/init.php';
requireAdmin();   // 401 se nao logado, 403 se nao for o admin
requireMethod('GET');
$db = getDB();

jsonResponse([
    'total_vendas'  => (float) $db->query("SELECT COALESCE(SUM(total), 0) FROM orders WHERE estado <> 'cancelada'")->fetchColumn(),
    'encomendas'    => (int) $db->query('SELECT COUNT(*) FROM orders')->fetchColumn(),
    'clientes'      => (int) $db->query("SELECT COUNT(*) FROM users WHERE tipo_utilizador = 'cliente'")->fetchColumn(),
    'stock_baixo'   => (int) $db->query('SELECT COUNT(*) FROM products WHERE stock < 5')->fetchColumn(),
    'por_estado'    => $db->query('SELECT estado, COUNT(*) AS total FROM orders GROUP BY estado')->fetchAll(),
    'ultimas'       => $db->query('SELECT o.id, u.nome, o.data, o.total, o.estado FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.data DESC LIMIT 5')->fetchAll(),
    'mais_vendidos' => $db->query('SELECT nome_produto, SUM(quantidade) AS vendidos FROM order_items GROUP BY nome_produto ORDER BY vendidos DESC LIMIT 5')->fetchAll(),
]);
