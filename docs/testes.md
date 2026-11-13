# Testes funcionais

| # | Teste | Resultado esperado | Resultado |
| --- | --- | --- | --- |
| 1 | Registo com dados válidos | Conta criada e sessão iniciada | OK — conta "Ana Teste" criada (users id 3), navbar mostra "Olá, Ana" |
| 2 | Registo com email repetido | Erro no campo email | OK — 422, erro no campo email: "Este email já está registado" |
| 3 | Login com password errada | "Email ou password incorretos" | OK — 401, "Email ou password incorretos" |
| 4 | Atualizar a página com sessão | Continua com sessão | OK — após recarregar, navbar mantém "Olá, Ana"; "Sair" termina sessão |
| 5 | Pesquisa "born" | 2 produtos | OK — "2 produtos" na loja (Born to Do It CD, T-shirt Born to Do It) |
| 6 | Adicionar, alterar e remover no carrinho | Totais certos | OK — subtotal/portes/total certos; <50€ portes 4,99€, ≥50€ portes grátis; remover funciona; carrinho persiste após recarregar |
| 7 | Checkout com dados inválidos | Erros por campo | OK — 422, erro em cada campo (nome, telefone, morada, código postal, cidade); nada gravado |
| 8 | Checkout válido | Encomenda nas tabelas orders e order_items | OK — encomenda 1 em orders (total 43,96€) e order_items (Born CD ×3); stock 25→22; carrinho esvazia |
| 9 | Stock insuficiente | Erro e nada gravado | OK — 422 "Stock insuficiente: Trust Me (CD)", 0 encomendas, stock intacto |
| 10 | Cliente abre /admin | Volta à página inicial | OK — cliente em /admin é reencaminhado para a página inicial |
| 11 | Cliente chama api/admin/stats.php | 403 | OK — cliente 403; sem sessão 401; admin 200 |
| 12 | Admin cria produto com imagem | Aparece na loja | OK — "Produto Teste QA" (9,99€, Acessórios) criado com imagem e aparece na loja |
| 13 | Admin muda estado da encomenda | Cliente vê o novo estado | OK — encomenda 1 posta a "Enviada"; cliente (Ana) vê "Enviada" em A minha conta |
| 14 | Segurança: SQL injection na pesquisa | Nada de estranho (prepared statements) | OK — pesquisa `' OR 1=1 --` devolve 0 produtos; sem erro nem dump |
| 15 | Segurança: XSS no nome do produto | Mostrado como texto (React escapa) | OK — produto `<script>alert(1)</script>` aparece como texto; nenhum alert dispara |

## Testes adicionais (lista 10.2)

| # | Teste | Resultado esperado | Resultado |
| --- | --- | --- | --- |
| 16 | Home: destaques, botões e links de categoria | Tudo navega bem | OK — "Ver Loja"→/loja, "Novidades"→destaques, 4 destaques, cartões de categoria filtram (Álbuns→4 produtos) |
| 17 | Loja: categorias, cada ordenação e pesquisa vazia | Filtros e ordem corretos; estado vazio | OK — categoria filtra; preço ↑/↓ e nome ordenam certo; pesquisa sem resultados mostra "Nenhum produto encontrado" |
| 18 | Detalhe: badge de stock, limite de quantidade, relacionados | Tudo correto | OK — badges "Em stock"/"Últimas unidades"/"Esgotado"; quantidade limitada ao stock; "Também vai gostar" (mesma categoria); esgotado sem botão |
| 19 | Detalhe: id inexistente | "Produto não encontrado" | OK — /produto/99999 mostra "Produto não encontrado" |
| 20 | Detalhe: adicionar ao carrinho a partir da página | Vai para o carrinho | OK — adicionar na página de detalhe põe o artigo no carrinho |
| 21 | Controlo de acesso: cliente abre encomenda de outro | "Encomenda não encontrada" (404) | OK — dono (Ana) 200; outro cliente 404 "Encomenda não encontrada" |
| 22 | Perfil: editar dados | Dados guardados | OK — "Dados atualizados."; telefone/morada/CP/cidade guardados |
| 23 | Perfil: mudar password (atual errada dá erro; nova funciona) | Erro com atual errada; login com nova | OK — atual errada → "Password atual incorreta"; depois "Password alterada."; nova faz login (200), antiga 401 |
| 24 | Admin: editar só o preço de um produto | Preço muda, resto igual | OK — preço 9,99€→7,50€; nome, stock, categoria, imagem inalterados |
| 25 | Admin: mudar a imagem de um produto | Imagem muda | OK — imagem substituída por novo ficheiro; o antigo é apagado |
| 26 | Admin: eliminar produto | Sai da loja | OK — produto apagado; 0 resultados na loja; voltam 10 produtos |
| 27 | Admin: criar, renomear e eliminar categoria | CRUD funciona | OK — criar (id 5), renomear, eliminar; tudo correto |
| 28 | Admin: eliminar categoria com produtos | Recusado | OK — 422 "Mova ou apague primeiro os produtos desta categoria" |
| 29 | Admin: cancelar encomenda devolve o stock | Stock reposto | OK — cancelar encomenda 1 repõe Born CD 22→25; estado "cancelada" |
| 30 | Admin: lista de utilizadores e painel batem com a BD | Números iguais | OK — 3 utilizadores; clientes 2; vendas 0 (encomenda cancelada); stock_baixo 3 — tudo igual à BD |
| 31 | Segurança: stats.php sem sessão | 401 | OK — sem sessão devolve 401 "Precisa de iniciar sessão" |
