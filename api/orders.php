<?php
// GET  api/orders.php        - as minhas encomendas
// GET  api/orders.php?id=12  - uma das minhas encomendas, com os seus artigos
// POST api/orders.php        - { envio: {...}, items: [{ id, quantidade }] } cria uma encomenda
require_once __DIR__ . '/includes/init.php';
$user = requireLogin();
$db = getDB();

// GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // AND user_id = ? - um cliente nunca pode abrir a encomenda de outra pessoa
        $stmt = $db->prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?');
        $stmt->execute([(int) $_GET['id'], $user['id']]);
        $order = $stmt->fetch();
        if (!$order) jsonError('Encomenda não encontrada', 404);

        $stmt = $db->prepare('SELECT oi.*, p.imagem FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?');
        $stmt->execute([$order['id']]);
        $order['items'] = $stmt->fetchAll();
        jsonResponse($order);
    }

    $stmt = $db->prepare('SELECT o.id, o.data, o.estado, o.total, SUM(oi.quantidade) AS artigos
                          FROM orders o JOIN order_items oi ON oi.order_id = o.id
                          WHERE o.user_id = ? GROUP BY o.id ORDER BY o.data DESC');
    $stmt->execute([$user['id']]);
    jsonResponse($stmt->fetchAll());
}

// POST: Criacao do pedido
requireMethod('POST');
$data = getJsonBody();
$envio = $data['envio'] ?? [];
$items = $data['items'] ?? [];

$nome = trim($envio['nome'] ?? '');
$telefone = preg_replace('/\s+/', '', $envio['telefone'] ?? '');
$morada = trim($envio['morada'] ?? '');
$codigoPostal = trim($envio['codigo_postal'] ?? '');
$cidade = trim($envio['cidade'] ?? '');

// 1. Validar os dados de envio (as mesmas regras que no React)
$errors = [];
if (mb_strlen($nome) < 2) $errors['nome'] = 'Indique o nome';
if (!preg_match('/^\d{9}$/', $telefone)) $errors['telefone'] = 'Telefone com 9 dígitos';
if (mb_strlen($morada) < 5) $errors['morada'] = 'Indique a morada';
if (!preg_match('/^\d{4}-\d{3}$/', $codigoPostal)) $errors['codigo_postal'] = 'Formato 0000-000';
if (mb_strlen($cidade) < 2) $errors['cidade'] = 'Indique a cidade';
if (!is_array($items) || count($items) === 0) $errors['items'] = 'O carrinho está vazio';
if ($errors) jsonError('Verifique os dados de envio', 422, $errors);

try {
    // 2. Transação: ou é guardado TUDO, ou não é guardado nada
    $db->beginTransaction();

    // 3. Os preços e o stock vêm da BASE DE DADOS, nunca do navegador
    $find = $db->prepare('SELECT id, nome, preco, stock FROM products WHERE id = ? FOR UPDATE');
    $lines = [];
    $subtotal = 0;
    foreach ($items as $item) {
        $qtd = (int) ($item['quantidade'] ?? 0);
        $find->execute([(int) ($item['id'] ?? 0)]);
        $product = $find->fetch();
        if (!$product || $qtd < 1) throw new InvalidArgumentException('Produto inválido no carrinho');
        if ($qtd > $product['stock']) throw new InvalidArgumentException("Stock insuficiente: {$product['nome']}");
        $lineTotal = round($product['preco'] * $qtd, 2);
        $subtotal += $lineTotal;
        $lines[] = [$product, $qtd, $lineTotal];
    }
    $portes = $subtotal >= 50 ? 0 : 4.99;   // a mesma regra que no CartContext
    $total = round($subtotal + $portes, 2);

    // 4. Guardar a encomenda
    $db->prepare('INSERT INTO orders (user_id, total, portes, nome_envio, morada_envio, cidade_envio, codigo_postal_envio, telefone_envio)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([$user['id'], $total, $portes, $nome, $morada, $cidade, $codigoPostal, $telefone]);
    $orderId = (int) $db->lastInsertId();

    // 5. Guardar cada linha e retirá-la do stock
    $insertItem = $db->prepare('INSERT INTO order_items (order_id, product_id, nome_produto, quantidade, preco_unitario, subtotal)
                                VALUES (?, ?, ?, ?, ?, ?)');
    $updateStock = $db->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    foreach ($lines as [$product, $qtd, $lineTotal]) {
        $insertItem->execute([$orderId, $product['id'], $product['nome'], $qtd, $product['preco'], $lineTotal]);
        $updateStock->execute([$qtd, $product['id']]);
    }

    $db->commit();
    jsonResponse(['id' => $orderId, 'total' => $total], 201);
} catch (Throwable $e) {
    if ($db->inTransaction()) $db->rollBack();   // desfaz tudo
    throw $e;   // o init.php transforma-o num 422 (as nossas mensagens) ou num JSON 500
}
