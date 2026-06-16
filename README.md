# Racing Angels

Portal de motorsport para a equipe Racing Angels. O projeto tem um front-end em HTML, CSS e JavaScript e uma API REST em Node.js, Express, TypeScript, Prisma e MySQL.

O sistema cobre login por perfil, gestao de equipe, pilotos, carros, pistas, corridas, temporadas, loja, pedidos, dashboard e analises de performance.

## Tecnologias

- Front-end: HTML, CSS e JavaScript puro
- Back-end: Node.js, Express e TypeScript
- Banco de dados: MySQL
- ORM: Prisma
- Autenticacao: JWT e bcrypt
- Validacao: Zod
- Integracao: fetch no front-end e CORS no back-end

## Estrutura principal

```txt
racing_angels/
  front-end/
    index.html
    pages/
      analytics.html
      contato.html
      dashboard.html
      equipe.html
      grid.html
      login.html
      loja.html
      pistas.html
    assets/
      css/style.css
      js/api.js
      js/script.js

  assets/
    shop/
      image (2).png
      image (3).png
      image (4).png
      image (5).png

  back-end/
    prisma/
      schema.prisma
      seed.ts
      migrations/
    src/
      app.ts
      server.ts
      config/
      controllers/
      routes/
      services/
      middlewares/
      schemas/
      utils/
    package.json
    tsconfig.json
```

## Como rodar o back-end

Entre na pasta do back-end:

```bash
cd back-end
```

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` com base no exemplo:

```bash
copy .env.example .env
```

Configure a conexao com o MySQL:

```env
DATABASE_URL="mysql://root:root@localhost:3306/racing_angels"
JWT_SECRET="troque_essa_chave"
PORT=3333
```

Crie o banco no MySQL:

```sql
CREATE DATABASE racing_angels;
```

Gere o Prisma Client, rode as migrations e carregue os dados iniciais:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

Inicie a API:

```bash
npm run dev
```

A API fica disponivel em:

```txt
http://localhost:3333
```

## Como rodar o front-end

Na raiz do projeto, voce pode servir os arquivos estaticos:

```bash
npm install
npm run dev
```

Depois acesse:

```txt
http://localhost:8080/front-end/index.html
```

Ponto de atencao: no estado atual, alguns arquivos HTML ainda apontam para `style.css`, `script.js` e links de paginas como se tudo estivesse na mesma pasta. Os arquivos reais estao em `front-end/assets/css/style.css`, `front-end/assets/js/script.js` e `front-end/pages/`. Se a tela abrir sem estilo ou algum link quebrar, ajuste os caminhos dos HTML antes da apresentacao visual.

## Usuarios de teste

O seed cria tres usuarios:

| Usuario | Senha | Perfil |
| --- | --- | --- |
| admin | 123456 | admin |
| equipe | 123456 | team |
| corredor | 123456 | driver |

## Perfis e permissoes

- `admin`: pode criar, editar e excluir os principais cadastros.
- `team`: pode criar corridas e pistas, editar corridas da propria equipe e gerenciar alguns dados operacionais.
- `driver`: visualiza dados e pode fazer pedidos na loja.

Regras importantes:

- Todas as rotas `/api/*` exigem JWT, exceto `POST /api/auth/login`.
- O middleware `authMiddleware` valida o token.
- O middleware `requireRole` bloqueia acoes sem permissao.
- Equipe nao pode excluir corrida.
- Piloto nao pode criar, editar ou excluir corridas, pilotos, pistas ou carros.
- Ao criar corrida como equipe, o back-end usa o `teamId` do usuario logado.
- Pedido de loja calcula subtotal, frete e total no back-end.
- Frete gratis quando o subtotal e maior ou igual a `500`; senao o frete e `39.90`.

## Rotas principais

### Auth

- `POST /api/auth/login`

### Users

- `GET /api/users`
- `GET /api/users/me`

### Teams

- `GET /api/teams`
- `POST /api/teams`
- `PUT /api/teams/:id`
- `DELETE /api/teams/:id`

### Drivers

- `GET /api/drivers`
- `GET /api/drivers/:id`
- `POST /api/drivers`
- `PUT /api/drivers/:id`
- `DELETE /api/drivers/:id`

### Cars

- `GET /api/cars`
- `GET /api/cars/:id`
- `POST /api/cars`
- `PUT /api/cars/:id`
- `DELETE /api/cars/:id`

### Tracks

- `GET /api/tracks`
- `GET /api/tracks/:id`
- `POST /api/tracks`
- `PUT /api/tracks/:id`
- `DELETE /api/tracks/:id`

### Races

- `GET /api/races`
- `GET /api/races/:id`
- `POST /api/races`
- `PUT /api/races/:id`
- `DELETE /api/races/:id`

### Seasons

- `GET /api/seasons`
- `POST /api/seasons`
- `GET /api/seasons/:id`
- `POST /api/seasons/:id/rounds`
- `POST /api/season-rounds/:id/laps`
- `GET /api/season-rounds/:id/laps`

### Products e Orders

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`

### Analytics e Dashboard

- `GET /api/analytics`
- `GET /api/analytics/drivers`
- `GET /api/analytics/tracks`
- `GET /api/analytics/cars`
- `GET /api/analytics/rankings`
- `GET /api/dashboard/summary`

## Teste rapido de login

```bash
curl -X POST http://localhost:3333/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"123456\"}"
```

A resposta retorna um token JWT. Use esse token nas rotas protegidas:

```bash
curl http://localhost:3333/api/races ^
  -H "Authorization: Bearer SEU_TOKEN"
```

## Banco de dados

O modelo esta em `back-end/prisma/schema.prisma`.

Tabelas principais:

- `users`: usuarios e perfis de acesso.
- `teams`: equipes.
- `drivers`: pilotos.
- `cars`: carros.
- `tracks`: pistas.
- `races`: corridas.
- `seasons`, `season_rounds`, `season_round_laps`: temporada, etapas e voltas.
- `products`, `orders`, `order_items`: loja e pedidos.

O seed esta em `back-end/prisma/seed.ts` e cria dados iniciais para demonstracao: equipes, pilotos, carros, pistas, corridas, temporada, voltas, produtos e usuarios de teste.

## Fluxo do codigo

1. O usuario entra pelo front-end em `front-end/index.html` ou pela pagina de login.
2. O login chama `POST /api/auth/login`.
3. O back-end valida usuario e senha em `authService.ts`.
4. Se estiver correto, o back-end gera um JWT.
5. O front-end guarda o token no `localStorage`.
6. Nas proximas requisicoes, `front-end/assets/js/api.js` envia `Authorization: Bearer TOKEN`.
7. `authMiddleware.ts` valida o token.
8. As rotas chamam controllers, os controllers chamam services, e os services acessam o banco via Prisma.
9. O resultado volta como JSON para o front-end.

## Arquivos de apoio criados nesta organizacao

- `ARQUIVOS_PARA_EXCLUIR.md`: lista conservadora de arquivos que podem ser removidos ou revisados.
- `ROTEIRO_APRESENTACAO.md`: roteiro para apresentar o projeto e explicar as partes do codigo.

## Pontos de atencao

- O arquivo `back-end/.env` esta rastreado pelo Git. O ideal e manter apenas `back-end/.env.example` no repositorio e deixar `.env` somente local.
- Os documentos antigos de implementacao estao duplicados e com varios caracteres quebrados. Eles podem ser removidos depois que este README for validado.
- O front-end tem caminhos de assets e paginas que precisam ser conferidos antes de uma demonstracao visual.
