# Roteiro de apresentacao - Racing Angels

Use este roteiro para apresentar o projeto explicando as partes do codigo em uma ordem logica. A ideia e mostrar primeiro o que o sistema faz, depois como o codigo esta organizado.

## 1. Abertura

"Este projeto se chama Racing Angels. Ele e um portal de motorsport para acompanhar equipe, pilotos, carros, pistas, corridas, loja, pedidos, dashboard e analises de performance. O sistema tem duas partes: um front-end em HTML, CSS e JavaScript, e um back-end em Node.js com TypeScript, Express, Prisma e MySQL."

## 2. Mostrar a estrutura de pastas

Abra a raiz do projeto e explique:

- `front-end/`: paginas visuais do sistema.
- `front-end/assets/css/style.css`: estilos da interface.
- `front-end/assets/js/script.js`: interacoes da tela, dados locais e comportamento das paginas.
- `front-end/assets/js/api.js`: helper para chamar a API com `fetch`.
- `assets/shop/`: imagens dos produtos da loja.
- `back-end/`: API e regras do sistema.
- `back-end/prisma/`: modelo do banco, migrations e seed.

Fala sugerida:

"A organizacao separa o que o usuario ve, que fica no front-end, do que processa dados e conversa com o banco, que fica no back-end."

## 3. Explicar o front-end

Mostre `front-end/index.html` e uma pagina, por exemplo `front-end/pages/dashboard.html`.

Explique:

- Os arquivos HTML montam as telas.
- O CSS define identidade visual, layout e responsividade.
- O `script.js` controla menu, login, dashboard, tabelas, carrinho e calculos exibidos na tela.
- O `api.js` centraliza chamadas HTTP para o back-end.

Fala sugerida:

"No front-end eu uso HTML para estruturar as paginas, CSS para o visual da marca Racing Angels e JavaScript para interacao. Para nao repetir codigo de requisicao, o arquivo `api.js` guarda funcoes globais que fazem chamadas para a API e enviam o token quando o usuario esta logado."

## 4. Explicar login e token

Mostre:

- `front-end/pages/login.html`
- `front-end/assets/js/api.js`
- `back-end/src/routes/authRoutes.ts`
- `back-end/src/services/authService.ts`
- `back-end/src/middlewares/authMiddleware.ts`

Fala sugerida:

"Quando o usuario faz login, o front-end envia usuario e senha para `POST /api/auth/login`. O back-end procura o usuario no banco, compara a senha com bcrypt e, se estiver correta, gera um token JWT. Esse token e salvo no `localStorage` e enviado nas proximas chamadas."

## 5. Explicar a entrada da API

Mostre `back-end/src/app.ts`.

Explique:

- O Express e configurado com CORS e JSON.
- A rota de auth fica publica.
- Depois de `/api`, o `authMiddleware` protege as rotas.
- Cada modulo tem seu arquivo de rotas.
- No fim, existe tratamento para rota nao encontrada e erros.

Fala sugerida:

"O `app.ts` e o mapa principal da API. Ele registra todas as rotas e coloca a autenticacao antes das rotas protegidas. Assim, quase tudo dentro de `/api` precisa de token."

## 6. Explicar controllers, services e schemas

Mostre um fluxo simples, por exemplo corrida:

- `back-end/src/routes/racesRoutes.ts`
- `back-end/src/controllers/racesController.ts`
- `back-end/src/services/racesService.ts`
- `back-end/src/schemas/domainSchemas.ts`

Fala sugerida:

"As rotas recebem o endpoint. Os controllers recebem a requisicao, validam os dados com Zod e chamam os services. Os services concentram as regras de negocio e fazem as consultas no banco com Prisma."

Exemplo de regra:

"Em `racesService.ts`, o sistema garante que piloto e carro pertencam a equipe da corrida. Tambem impede que uma equipe edite corrida de outra equipe."

## 7. Explicar permissoes

Mostre:

- `back-end/src/middlewares/requireRole.ts`
- algum arquivo de rotas, como `racesRoutes.ts` ou `productsRoutes.ts`

Fala sugerida:

"As permissoes sao feitas por perfil. O admin tem controle total. A equipe pode criar e editar algumas informacoes. O piloto tem acesso mais limitado. O middleware `requireRole` verifica se o perfil do usuario pode executar aquela acao."

## 8. Explicar banco de dados e Prisma

Mostre:

- `back-end/prisma/schema.prisma`
- `back-end/prisma/seed.ts`

Explique os principais modelos:

- `User`: login e perfil.
- `Team`: equipe.
- `Driver`: piloto.
- `Car`: carro.
- `Track`: pista.
- `Race`: corrida.
- `Season`, `SeasonRound`, `SeasonRoundLap`: temporada e voltas.
- `Product`, `Order`, `OrderItem`: loja e pedidos.

Fala sugerida:

"O Prisma faz a ponte entre TypeScript e MySQL. No `schema.prisma` eu defino tabelas, campos e relacionamentos. O `seed.ts` cria dados iniciais para demonstrar o sistema, como usuarios, equipes, pilotos, carros, pistas, corridas e produtos."

## 9. Explicar loja e pedidos

Mostre:

- `front-end/pages/loja.html`
- `back-end/src/services/ordersService.ts`
- `back-end/prisma/schema.prisma`, nos models `Product`, `Order` e `OrderItem`

Fala sugerida:

"A loja permite selecionar produtos e finalizar pedido. No back-end, o pedido nao confia no preco vindo do front-end. Ele busca o preco real do produto no banco, calcula subtotal, frete e total, e baixa o estoque dentro de uma transacao."

## 10. Explicar analytics e dashboard

Mostre:

- `back-end/src/services/analyticsService.ts`
- `back-end/src/services/dashboardService.ts`
- `front-end/pages/analytics.html`
- `front-end/pages/dashboard.html`

Fala sugerida:

"A parte de analytics transforma dados de corridas em indicadores. Ela calcula ranking de pilotos, eficiencia de pistas, pontuacao de carros, melhor volta, consistencia e resumo geral para o dashboard."

## 11. Citar arquivos que podem sair

Fala sugerida:

"Durante a revisao, eu tambem identifiquei arquivos antigos de documentacao e duplicacoes. Eles estao listados em `ARQUIVOS_PARA_EXCLUIR.md`. Eu nao apaguei automaticamente porque alguns podem servir como historico, mas para entrega final o projeto pode ficar mais limpo mantendo README, roteiro e codigo principal."

## 12. Fechamento

Fala sugerida:

"Resumindo, o Racing Angels e um sistema completo dividido em front-end, API e banco. O front-end apresenta a experiencia do usuario, a API concentra autenticacao e regras, e o Prisma organiza a persistencia no MySQL. A arquitetura facilita manutencao porque cada parte tem uma responsabilidade clara."

## Ordem rapida para demonstrar arquivos

1. `README.md`
2. `front-end/index.html`
3. `front-end/assets/js/api.js`
4. `back-end/src/app.ts`
5. `back-end/src/routes/racesRoutes.ts`
6. `back-end/src/controllers/racesController.ts`
7. `back-end/src/services/racesService.ts`
8. `back-end/src/middlewares/authMiddleware.ts`
9. `back-end/src/middlewares/requireRole.ts`
10. `back-end/prisma/schema.prisma`
11. `back-end/prisma/seed.ts`
12. `back-end/src/services/analyticsService.ts`
13. `ARQUIVOS_PARA_EXCLUIR.md`
