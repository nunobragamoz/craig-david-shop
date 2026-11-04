# Base de dados — craig_david_shop

| Tabela      | Colunas                                                                                                                       | Relação                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| users       | id, nome, email (único), password (hash), tipo_utilizador (cliente/admin), telefone, morada, cidade, codigo_postal, criado_em | 1 utilizador → N encomendas |
| categories  | id, nome (único)                                                                                                              | 1 categoria → N produtos    |
| products    | id, nome, descricao, preco, imagem, stock, destaque, categoria_id, criado_em                                                  | N produtos → 1 categoria    |
| orders      | id, user_id, data, estado, total, portes, nome_envio, morada_envio, cidade_envio, codigo_postal_envio, telefone_envio         | 1 encomenda → N linhas      |
| order_items | id, order_id, product_id, nome_produto, quantidade, preco_unitario, subtotal                                                  | liga orders ↔ products      |

order_items guarda o nome e o preço no momento da compra, para as encomendas antigas continuarem certas.
