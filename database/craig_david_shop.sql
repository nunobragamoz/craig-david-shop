-- Base de Dados MySQL para a loja de Craig David
-- A primeira linha da base de dados apaga a base de dados e cria denovo.
DROP DATABASE IF EXISTS craig_david_shop;
CREATE DATABASE craig_david_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE craig_david_shop;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  PASSWORD VARCHAR(255) NOT NULL,
  tipo_utilizador ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  telefone VARCHAR(20) NULL,
  morada VARCHAR(255) NULL,
  cidade VARCHAR(100) NULL,
  codigo_postal VARCHAR(10) NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  imagem VARCHAR(255),
  stock INT NOT NULL DEFAULT 0,
  destaque TINYINT(1) NOT NULL DEFAULT 0,
  categoria_id INT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categories(id) ON DELETE
  SET NULL
);
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado ENUM(
    'pendente',
    'em processamento',
    'enviada',
    'entregue',
    'cancelada'
  ) NOT NULL DEFAULT 'pendente',
  total DECIMAL(10, 2) NOT NULL,
  portes DECIMAL(10, 2) NOT NULL DEFAULT 0,
  nome_envio VARCHAR(100) NOT NULL,
  morada_envio VARCHAR(255) NOT NULL,
  cidade_envio VARCHAR(100) NOT NULL,
  codigo_postal_envio VARCHAR(10) NOT NULL,
  telefone_envio VARCHAR(20) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  nome_produto VARCHAR(150) NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE
  SET NULL
);
-- Dados Iniciais
INSERT INTO categories (nome)
VALUES ('Álbuns'),
  ('Vinil'),
  ('Vestuário'),
  ('Acessórios');
INSERT INTO products (
    nome,
    descricao,
    preco,
    imagem,
    stock,
    destaque,
    categoria_id
  )
VALUES (
    'Born to Do It (CD)',
    'Álbum de estreia (2000).',
    12.99,
    'born-to-do-it.webp',
    25,
    1,
    1
  ),
  (
    'Slicker Than Your Average (CD)',
    'Segundo álbum (2002).',
    11.99,
    'slicker-than-your-average.png',
    18,
    0,
    1
  ),
  (
    'The Story Goes... (CD)',
    'Terceiro álbum (2005).',
    10.99,
    'the-story-goes.jpg',
    3,
    0,
    1
  ),
  (
    'Trust Me (CD)',
    'Quarto álbum (2007).',
    10.99,
    'trust-me.jpg',
    0,
    0,
    1
  ),
  (
    'Following My Intuition (Vinil)',
    'Edição em vinil do álbum de 2016.',
    27.99,
    'following-my-intuition.jpg',
    12,
    1,
    2
  ),
  (
    'Signed Sealed Delivered (Vinil)',
    'Edição em vinil do álbum de 2010.',
    24.99,
    'signed-sealed-delivered.jpg',
    7,
    0,
    2
  ),
  (
    'T-shirt Born to Do It',
    'T-shirt preta 100% algodão.',
    22.00,
    'tshirt.jpg',
    30,
    1,
    3
  ),
  (
    'Hoodie TS5',
    'Hoodie com capuz e logo bordado.',
    45.00,
    'hoodie.jpg',
    4,
    1,
    3
  ),
  (
    'Poster Tour 2026',
    'Poster A2 da tour.',
    14.50,
    'poster.jpg',
    40,
    0,
    4
  ),
  (
    'Tote bag Craig David',
    'Saco de pano reutilizável.',
    15.00,
    'tote-bag.jpg',
    20,
    0,
    4
  );
INSERT INTO users (
    nome,
    email,
    PASSWORD,
    tipo_utilizador,
    telefone,
    morada,
    cidade,
    codigo_postal
  )
VALUES (
    'Administrador',
    'admin@craigdavidshop.pt',
    '$2y$10$9IYiI3F3HuGXbCsKH34NTOtN8j1nohsIERBeWJ2C.RNsrs9shsSf2',
    'admin',
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    'Cliente Teste',
    'cliente@teste.pt',
    '$2y$10$iCjksoPYxHrM/tFnCW658OiAgyMjQYxWkl4m6UIGTWGJtund003qi',
    'cliente',
    '912345678',
    'Rua das Flores, 10',
    'Lisboa',
    '1000-100'
  );
