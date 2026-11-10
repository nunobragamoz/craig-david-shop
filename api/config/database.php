<?php
// Configurações da base de dados (XAMPP: username: root, sem password)
const DB_HOST = 'localhost';
const DB_NAME = 'craig_david_shop';
const DB_USER = 'root';
const DB_PASS = '';
const UPLOAD_DIR = __DIR__ . '/../../uploads/products/';

// Devolve um PDO partilhado para a base de dados
function getDB(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                // erros viram exceções
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                // rows devolvidas como arrays associativos
            ]
        );
    }
    return $pdo;
}
