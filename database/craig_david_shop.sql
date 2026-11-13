-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: craig_david_shop
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `craig_david_shop`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `craig_david_shop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `craig_david_shop`;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (4,'Acessórios'),(1,'Álbuns'),(3,'Vestuário'),(2,'Vinil');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `nome_produto` varchar(150) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'Born to Do It (CD)',1,12.99,12.99),(2,1,9,'Poster Tour 2026',1,14.50,14.50),(3,2,8,'Hoodie TS5',1,45.00,45.00),(4,3,5,'Following My Intuition (Vinil)',2,27.99,55.98),(5,4,2,'Slicker Than Your Average (CD)',1,11.99,11.99),(6,4,10,'Tote bag Craig David',1,15.00,15.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `data` datetime DEFAULT current_timestamp(),
  `estado` enum('pendente','em processamento','enviada','entregue','cancelada') NOT NULL DEFAULT 'pendente',
  `total` decimal(10,2) NOT NULL,
  `portes` decimal(10,2) NOT NULL DEFAULT 0.00,
  `nome_envio` varchar(100) NOT NULL,
  `morada_envio` varchar(255) NOT NULL,
  `cidade_envio` varchar(100) NOT NULL,
  `codigo_postal_envio` varchar(10) NOT NULL,
  `telefone_envio` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,'2026-11-13 19:25:16','pendente',32.48,4.99,'Cliente Teste','Rua das Flores, 10','Lisboa','1000-100','912345678'),(2,2,'2026-11-13 19:25:16','em processamento',49.99,4.99,'Cliente Teste','Rua das Flores, 10','Lisboa','1000-100','912345678'),(3,2,'2026-11-13 19:25:16','enviada',55.98,0.00,'Cliente Teste','Rua das Flores, 10','Lisboa','1000-100','912345678'),(4,2,'2026-11-13 19:25:17','entregue',31.98,4.99,'Cliente Teste','Rua das Flores, 10','Lisboa','1000-100','912345678');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `destaque` tinyint(1) NOT NULL DEFAULT 0,
  `categoria_id` int(11) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Born to Do It (CD)','Álbum de estreia (2000).',12.99,'born-to-do-it.webp',24,1,1,'2026-11-13 16:44:28'),(2,'Slicker Than Your Average (CD)','Segundo álbum (2002).',11.99,'slicker-than-your-average.png',17,0,1,'2026-11-13 16:44:28'),(3,'The Story Goes... (CD)','Terceiro álbum (2005).',10.99,'the-story-goes.jpg',3,0,1,'2026-11-13 16:44:28'),(4,'Trust Me (CD)','Quarto álbum (2007).',10.99,'trust-me.jpg',0,0,1,'2026-11-13 16:44:28'),(5,'Following My Intuition (Vinil)','Edição em vinil do álbum de 2016.',27.99,'following-my-intuition.jpg',10,1,2,'2026-11-13 16:44:28'),(6,'Signed Sealed Delivered (Vinil)','Edição em vinil do álbum de 2010.',24.99,'signed-sealed-delivered.jpg',7,0,2,'2026-11-13 16:44:28'),(7,'T-shirt Born to Do It','T-shirt preta 100% algodão.',22.00,'tshirt.jpg',30,1,3,'2026-11-13 16:44:28'),(8,'Hoodie TS5','Hoodie com capuz e logo bordado.',45.00,'hoodie.jpg',3,1,3,'2026-11-13 16:44:28'),(9,'Poster Tour 2026','Poster A2 da tour.',14.50,'poster.jpg',39,0,4,'2026-11-13 16:44:28'),(10,'Tote bag Craig David','Saco de pano reutilizável.',15.00,'tote-bag.jpg',19,0,4,'2026-11-13 16:44:28');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `tipo_utilizador` enum('cliente','admin') NOT NULL DEFAULT 'cliente',
  `telefone` varchar(20) DEFAULT NULL,
  `morada` varchar(255) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrador','admin@craigdavidshop.pt','$2y$10$9IYiI3F3HuGXbCsKH34NTOtN8j1nohsIERBeWJ2C.RNsrs9shsSf2','admin',NULL,NULL,NULL,NULL,'2026-11-13 16:44:28'),(2,'Cliente Teste','cliente@teste.pt','$2y$10$iCjksoPYxHrM/tFnCW658OiAgyMjQYxWkl4m6UIGTWGJtund003qi','cliente','912345678','Rua das Flores, 10','Lisboa','1000-100','2026-11-13 16:44:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-13 19:25:37
