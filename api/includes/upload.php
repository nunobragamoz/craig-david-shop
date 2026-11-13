<?php
// Verfica uma imagem que foi carregada salva com um nome aleatorio e devolve esse nome
function saveUploadedImage(array $file): string
{
    if ($file['error'] !== UPLOAD_ERR_OK) throw new InvalidArgumentException('Erro no envio da imagem');
    if ($file['size'] > 2 * 1024 * 1024) throw new InvalidArgumentException('A imagem não pode ter mais de 2 MB');

    // Verificacao de real tipo de ficheiro e nao o que o usuario escreveu
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!isset($allowed[$mime])) throw new InvalidArgumentException('Formatos permitidos: JPG, PNG, WEBP');

    // Nome aleatorio: Nenhuns nomes fixos nem nomes perigosos
    $filename = bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($file['tmp_name'], UPLOAD_DIR . $filename)) {
        throw new RuntimeException('Não foi possível guardar a imagem');
    }
    return $filename;
}
