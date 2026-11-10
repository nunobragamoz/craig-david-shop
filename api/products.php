<?php
// GET api/products.php           - list (filtros: categoria, pesquisa, ordem, destaque)
// GET api/products.php?id=3      - um produto
require_once __DIR__ . '/includes/init.php';
requireMethod('GET');
$db = getDB();
$base = 'SELECT p.*, c.nome AS categoria FROM products p LEFT JOIN categories c ON c.id = p.categoria_id';

// Um produto específico, se o id for fornecido
if (isset($_GET['id'])) {
    $stmt = $db->prepare($base . ' WHERE p.id = ?');
    $stmt->execute([(int) $_GET['id']]);
    $product = $stmt->fetch();
    if (!$product) jsonError('Produto não encontrado', 404);
    jsonResponse($product);
}

// Lista de produtos, com filtros opcionais: categoria, pesquisa, ordem, destaque
$where = [];
$params = [];
if (!empty($_GET['categoria'])) {
    $where[] = 'p.categoria_id = ?';
    $params[] = (int) $_GET['categoria'];
}
if (!empty($_GET['destaque'])) {
    $where[] = 'p.destaque = 1';
}
if (!empty($_GET['pesquisa'])) {
    $where[] = '(p.nome LIKE ? OR p.descricao LIKE ?)';
    $term = '%' . trim($_GET['pesquisa']) . '%';
    array_push($params, $term, $term);
}

// Ordenação: preco_asc, preco_desc, nome, ou padrão (criado_em DESC, id DESC)
$orders = ['preco_asc' => 'p.preco ASC', 'preco_desc' => 'p.preco DESC', 'nome' => 'p.nome ASC'];
$orderBy = $orders[$_GET['ordem'] ?? ''] ?? 'p.criado_em DESC, p.id DESC';

$sql = $base . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY ' . $orderBy;
$stmt = $db->prepare($sql);
$stmt->execute($params);
jsonResponse($stmt->fetchAll());
