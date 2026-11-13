<?php
// GET  admin/orders.php              → todas as encomendas (opcional ?estado=pendente)
// GET  admin/orders.php?id=12        → uma encomenda com o cliente e os artigos
// POST admin/orders.php { id, estado } → muda o estado
require_once __DIR__ . '/../includes/init.php';
requireAdmin();
$db = getDB();
$estados = ['pendente', 'em processamento', 'enviada', 'entregue', 'cancelada'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $db->prepare('SELECT o.*, u.nome AS cliente, u.email FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ?');
        $stmt->execute([(int) $_GET['id']]);
        $order = $stmt->fetch();
        if (!$order) jsonError('Encomenda não encontrada', 404);

        $stmt = $db->prepare('SELECT * FROM order_items WHERE order_id = ?');
        $stmt->execute([$order['id']]);
        $order['items'] = $stmt->fetchAll();
        jsonResponse($order);
    }

    $sql = 'SELECT o.id, o.data, o.estado, o.total, u.nome AS cliente, u.email FROM orders o JOIN users u ON u.id = o.user_id';
    $params = [];
    if (!empty($_GET['estado'])) { $sql .= ' WHERE o.estado = ?'; $params[] = $_GET['estado']; }
    $stmt = $db->prepare($sql . ' ORDER BY o.data DESC');
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
}

requireMethod('POST');
$data = getJsonBody();
$id = (int) ($data['id'] ?? 0);
$estado = $data['estado'] ?? '';
if (!in_array($estado, $estados, true)) jsonError('Estado inválido', 422);

$stmt = $db->prepare('SELECT estado FROM orders WHERE id = ?');
$stmt->execute([$id]);
$atual = $stmt->fetchColumn();
if ($atual === false) jsonError('Encomenda não encontrada', 404);
if ($atual === 'cancelada') jsonError('Uma encomenda cancelada não pode mudar de estado', 422);

try {
    $db->beginTransaction();
    $db->prepare('UPDATE orders SET estado = ? WHERE id = ?')->execute([$estado, $id]);
    // Cancelar repõe os produtos no stock
    if ($estado === 'cancelada') {
        $db->prepare('UPDATE products p JOIN order_items oi ON oi.product_id = p.id
                      SET p.stock = p.stock + oi.quantidade WHERE oi.order_id = ?')->execute([$id]);
    }
    $db->commit();
} catch (Throwable $e) {
    if ($db->inTransaction()) $db->rollBack();
    throw $e;
}
jsonResponse(['id' => $id, 'estado' => $estado]);
