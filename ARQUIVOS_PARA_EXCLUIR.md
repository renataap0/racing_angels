# Arquivos que podem ser excluidos ou revisados

Esta lista e conservadora: eu nao apaguei nada. Ela separa o que parece descartavel, o que exige cuidado e o que nao deve ser removido.

## Pode excluir com seguranca depois de validar o novo README

Estes arquivos sao documentos antigos de implementacao, setup ou resumo. Eles repetem informacoes que agora estao no `README.md` e no `ROTEIRO_APRESENTACAO.md`, alem de terem muitos caracteres quebrados.

- `START_HERE.txt`
- `QUICK_REFERENCE.txt`
- `SETUP_CHECKLIST.md`
- `MUDANÇAS.md`
- `INTEGRAÇÃO_SUMMARY.md`
- `RELATÓRIO_IMPLEMENTAÇÃO.md`

## Pode excluir se nao for usar como material de exemplo

- `front-end/assets/js/EXAMPLES.js`

Motivo: e um arquivo com exemplos para testar chamadas da API no console. Ele nao e carregado pelas paginas HTML e nao faz parte da execucao normal do sistema.

- `back-end/src/utils/frontend-api-example.js`

Motivo: e um exemplo de integracao para copiar para o front-end. O projeto ja tem `front-end/assets/js/api.js`, entao esse arquivo pode virar duplicacao.

## Duplicado, escolha apenas um

- `assets/js/api.js`
- `front-end/assets/js/api.js`

Os dois arquivos tem o mesmo conteudo. O projeto deveria usar apenas um helper de API. Pela estrutura atual, o mais coerente e manter `front-end/assets/js/api.js` e remover `assets/js/api.js`, mas antes confira os caminhos dos HTML.

## Nao e inutil, mas nao deveria ficar versionado

- `back-end/.env`

Motivo: contem configuracao local e pode conter credenciais. Mantenha uma copia local para rodar o projeto, mas no repositorio o ideal e deixar apenas `back-end/.env.example`.

## Nao excluir

- `back-end/src/`
- `back-end/prisma/schema.prisma`
- `back-end/prisma/seed.ts`
- `back-end/prisma/migrations/`
- `back-end/package.json`
- `back-end/package-lock.json`
- `front-end/index.html`
- `front-end/pages/`
- `front-end/assets/css/style.css`
- `front-end/assets/js/script.js`
- `front-end/assets/js/api.js`
- `assets/shop/`
- `package.json`

Esses arquivos fazem parte da aplicacao, do banco, da loja, dos scripts ou da interface.

## Problemas encontrados que pedem correcao, nao exclusao

- Os HTML usam caminhos como `style.css`, `script.js` e `dashboard.html`, mas os arquivos reais estao em `front-end/assets/css/`, `front-end/assets/js/` e `front-end/pages/`.
- As imagens da loja estao em `assets/shop/`, enquanto `loja.html` referencia `assets/shop/...` a partir da pasta da pagina. Dependendo de como o servidor estatico for aberto, essas imagens podem nao carregar.
- A documentacao antiga cita uma estrutura onde `style.css`, `script.js` e varias paginas ficariam na raiz do front-end, mas a estrutura atual esta diferente.

Antes de apresentar visualmente, vale ajustar os caminhos ou reorganizar os arquivos do front-end.
