# Loja Oficial Craig David — Website de E-commerce

Projeto final do curso de **Desenvolvedor Full Stack Web**. É uma loja online completa
para uma loja de merchandising do Craig David (álbuns, vinil, vestuário e acessórios),
com uma **área pública** para os clientes e uma **área de administração** para a gestão
da loja.

Autor: **Nuno Braga**

---

## 1. Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Front-end | React 19, React Router, **Bootstrap 5**, Font Awesome, Vite |
| Back-end | **PHP 8** (API REST, sem framework) |
| Base de dados | **MySQL / MariaDB** (via XAMPP) |
| Servidor | **Apache** (XAMPP) |

O front-end já está **compilado** na pasta `app/`, que o Apache serve diretamente.
**Não é preciso instalar o Node nem correr o `npm` para avaliar o projeto** — basta o XAMPP.

---

## 2. Credenciais de acesso

| Perfil | Email | Password |
| --- | --- | --- |
| **Administrador** | `admin@craigdavidshop.pt` | `Admin123!` |
| **Cliente de teste** | `cliente@teste.pt` | `Cliente123!` |

A área de administração está em `/admin` e só é acessível com a conta de administrador.

---

## 3. Instalação e execução (para avaliação)

1. **Copiar o projeto** para a pasta `htdocs` do XAMPP, de forma a ficar em:
   `xamppfiles/htdocs/craig-david-shop/` (macOS) ou `xampp\htdocs\craig-david-shop\` (Windows).

2. **Arrancar o XAMPP** e ligar os serviços **Apache** e **MySQL**.

3. **Importar a base de dados:**
   - Abrir **phpMyAdmin** (`http://localhost/phpmyadmin`).
   - Separador **Importar** → escolher o ficheiro `database/craig_david_shop.sql` → **Importar**.
   - O ficheiro cria a base de dados `craig_david_shop`, as tabelas e os dados de demonstração
     (produtos, utilizadores e algumas encomendas em estados diferentes).

4. **Abrir a loja** no browser:
   **`http://localhost/craig-david-shop/app/`**

A configuração da ligação à base de dados está em `api/config/database.php` e usa os valores
por omissão do XAMPP (utilizador `root`, **sem password**). Se o seu MySQL tiver outra
password, altere-a aí.

> **Nota (Windows/permissões):** para que o upload de imagens de produtos funcione na área
> de administração, a pasta `uploads/products/` tem de ter permissão de escrita (no XAMPP
> normalmente já tem).

---

## 4. Como usar

### Área pública (clientes)
- **Página inicial** com produtos em destaque e atalhos para as categorias.
- **Loja** (`/loja`): catálogo com filtro por categoria, pesquisa e ordenação.
- **Detalhe do produto**: stock, escolha de quantidade e produtos relacionados.
- **Registo / Início de sessão** com gestão de sessões.
- **Carrinho**: adicionar, alterar quantidades e remover; os portes são grátis acima de 50 €.
- **Checkout**: formulário de dados de envio com validação.
- **A minha conta**: editar dados, mudar a password e ver o histórico de encomendas.

### Área de administração (`/admin`)
- **Painel**: números principais da loja (vendas, encomendas, clientes, stock baixo).
- **Produtos**: criar, editar e apagar (com imagem).
- **Categorias**: criar, renomear e apagar.
- **Encomendas**: consultar e mudar o estado (o cliente passa a ver o novo estado).
- **Utilizadores**: lista dos utilizadores registados.

---

## 5. Estrutura do projeto

```
craig-david-shop/
├─ app/         → front-end já compilado (é o que o Apache serve)
├─ api/         → back-end em PHP (endpoints REST)
│  ├─ config/   → ligação à base de dados
│  └─ includes/ → arranque, autenticação e funções auxiliares
├─ database/    → craig_david_shop.sql (export da base de dados)
├─ uploads/     → imagens dos produtos
├─ frontend/    → código-fonte React (apenas para desenvolvimento)
└─ docs/        → esquema da base de dados, diagramas e testes
```

---

## 6. Segurança (notas)

- As passwords são guardadas com `password_hash()` (bcrypt), nunca em texto simples.
- Todas as consultas usam **prepared statements** (proteção contra SQL injection).
- O React escapa o conteúdo, o que evita XSS.
- A área de administração é protegida no servidor (PHP), não apenas no browser.

---

## 7. Desenvolvimento (opcional)

Só necessário se quiser alterar o código React. Requer **Node.js**.

```bash
cd frontend
npm install
npm run dev     # servidor de desenvolvimento em http://localhost:5173/craig-david-shop/app/
```

Para gerar a versão de produção na pasta `app/` (que o Apache serve):

```bash
npm run build
```

> Sempre que o código React for alterado, é preciso correr `npm run build` outra vez
> para a pasta `app/` ficar atualizada.

---

## 8. Créditos

- Imagem do *hero* (página inicial): fotografia de Craig David por **Raph_PH**,
  licença **CC BY 2.0** (via Wikimedia Commons / Flickr).
