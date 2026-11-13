<?php
// GET    admin/products.php          → todos os produtos  |  ?id=3 → um produto
// POST   admin/products.php          → criar (multipart/form-data); com um id → atualizar
// DELETE admin/products.php?id=3     → eliminar
require_once __DIR__ . '/../includes/init.php';
require_once __DIR__ . '/../includes/upload.php';
requireAdmin();
$db = getDB();

// Cada caso termina com jsonResponse(), que para o script, por isso não é preciso "break"
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $base = 'SELECT p.*, c.nome AS categoria FROM products p LEFT JOIN categories c ON c.id = p.categoria_id';
        if (isset($_GET['id'])) {
            $stmt = $db->prepare($base . ' WHERE p.id = ?');
            $stmt->execute([(int) $_GET['id']]);
            $product = $stmt->fetch();
            if (!$product) jsonError('Produto não encontrado', 404);
            jsonResponse($product);
        }
        jsonResponse($db->query($base . ' ORDER BY p.nome')->fetchAll());

    case 'POST':
        // O formulário é enviado como multipart/form-data (por causa da imagem), por isso os campos estão em $_POST
        $id = (int) ($_POST['id'] ?? 0);
        $nome = trim($_POST['nome'] ?? '');
        $descricao = trim($_POST['descricao'] ?? '');
        $preco = (float) ($_POST['preco'] ?? 0);
        $stock = filter_var($_POST['stock'] ?? '', FILTER_VALIDATE_INT);
        $categoriaId = (int) ($_POST['categoria_id'] ?? 0);
        $destaque = ($_POST['destaque'] ?? '0') === '1' ? 1 : 0;
        $hasImage = !empty($_FILES['imagem']['name']);

        $errors = [];
        if (mb_strlen($nome) < 2) $errors['nome'] = 'Indique o nome';
        if ($preco <= 0) $errors['preco'] = 'O preço tem de ser maior que 0';
        if ($stock === false || $stock < 0) $errors['stock'] = 'Número inteiro, 0 ou mais';
        $check = $db->prepare('SELECT id FROM categories WHERE id = ?');
        $check->execute([$categoriaId]);
        if (!$check->fetch()) $errors['categoria_id'] = 'Categoria inválida';
        if (!$id && !$hasImage) $errors['imagem'] = 'Escolha uma imagem';
        if ($errors) jsonError('Verifique os campos assinalados', 422, $errors);

        $imagem = $hasImage ? saveUploadedImage($_FILES['imagem']) : null;

        if ($id) {
            // Atualizar: manter a imagem antiga a menos que tenha sido enviada uma nova
            $old = $db->prepare('SELECT imagem FROM products WHERE id = ?');
            $old->execute([$id]);
            $oldImage = $old->fetchColumn();
            if ($oldImage === false) jsonError('Produto não encontrado', 404);

            $db->prepare('UPDATE products SET nome = ?, descricao = ?, preco = ?, stock = ?, categoria_id = ?, destaque = ?, imagem = ? WHERE id = ?')
                ->execute([$nome, $descricao, $preco, $stock, $categoriaId, $destaque, $imagem ?? $oldImage, $id]);
            if ($imagem && $oldImage && is_file(UPLOAD_DIR . $oldImage)) unlink(UPLOAD_DIR . $oldImage);
            jsonResponse(['id' => $id]);
        }

        $db->prepare('INSERT INTO products (nome, descricao, preco, stock, categoria_id, destaque, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)')
            ->execute([$nome, $descricao, $preco, $stock, $categoriaId, $destaque, $imagem]);
        jsonResponse(['id' => (int) $db->lastInsertId()], 201);

    case 'DELETE':
        $id = (int) ($_GET['id'] ?? 0);
        $stmt = $db->prepare('SELECT imagem FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $imagem = $stmt->fetchColumn();
        if ($imagem === false) jsonError('Produto não encontrado', 404);

        // As encomendas antigas mantêm o nome e o preço: order_items.product_id passa simplesmente a NULL
        $db->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
        if ($imagem && is_file(UPLOAD_DIR . $imagem)) unlink(UPLOAD_DIR . $imagem);
        jsonResponse(['ok' => true]);

    default:
        jsonError('Método não permitido', 405);
}
