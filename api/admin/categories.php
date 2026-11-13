<?php
// GET    admin/categories.php              → categorias com a contagem de produtos
// POST   admin/categories.php { id?, nome } → criar, ou renomear quando é enviado um id
// DELETE admin/categories.php?id=2         → eliminar (apenas se não tiver produtos)
require_once __DIR__ . '/../includes/init.php';
requireAdmin();
$db = getDB();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        jsonResponse($db->query('SELECT c.id, c.nome, COUNT(p.id) AS produtos
                                 FROM categories c LEFT JOIN products p ON p.categoria_id = c.id
                                 GROUP BY c.id ORDER BY c.nome')->fetchAll());

    case 'POST':
        $data = getJsonBody();
        $id = (int) ($data['id'] ?? 0);
        $nome = trim($data['nome'] ?? '');
        if (mb_strlen($nome) < 2) jsonError('Indique o nome da categoria', 422, ['nome' => 'Indique o nome da categoria']);
        try {
            if ($id) {
                $db->prepare('UPDATE categories SET nome = ? WHERE id = ?')->execute([$nome, $id]);
                jsonResponse(['id' => $id]);
            }
            $db->prepare('INSERT INTO categories (nome) VALUES (?)')->execute([$nome]);
            jsonResponse(['id' => (int) $db->lastInsertId()], 201);
        } catch (PDOException $e) {
            // 23000 = a regra UNIQUE no nome: essa categoria já existe
            if ($e->getCode() === '23000') jsonError('Essa categoria já existe', 422, ['nome' => 'Essa categoria já existe']);
            throw $e;
        }

    case 'DELETE':
        $id = (int) ($_GET['id'] ?? 0);
        $stmt = $db->prepare('SELECT COUNT(*) FROM products WHERE categoria_id = ?');
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) jsonError('Mova ou apague primeiro os produtos desta categoria', 422);
        $db->prepare('DELETE FROM categories WHERE id = ?')->execute([$id]);
        jsonResponse(['ok' => true]);

    default:
        jsonError('Método não permitido', 405);
}
