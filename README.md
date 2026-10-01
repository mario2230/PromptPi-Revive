# PromptPi Revive

Aplicativo frontend para geração e gestão de prompts com interface em Ionic + Vue, com autenticação e integração com serviços de IA.

## Visão geral

Este projeto é a parte cliente do sistema PromptPi Revive. Ele oferece:

- autenticação de usuários
- navegação por páginas de prompts, favoritos, histórico e perfil
- geração de prompts com IA
- gerenciamento de prompts e preferências do usuário
- suporte para execução em web e Android com Capacitor

## Stack utilizada

- Vue 3
- Vite
- Ionic Vue
- TypeScript
- Capacitor
- Firebase
- API externa para geração de prompts

## Repositório do backend

A parte de backend do projeto está disponível em:

https://github.com/mario2230/PrompPIRevive-backend-main

Esse backend é responsável por serviços e endpoints que o frontend consome, como a geração de prompt com IA.

## Requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 18 ou superior
- npm
- Android Studio (opcional, apenas para build Android)

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd PromptPi-Revive
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto e defina a URL da API do backend, por exemplo:

```bash
VITE_PROMPTAI_API_URL=http://localhost:3000
```

> Ajuste a URL conforme o endereço do backend em execução.

## Executando o projeto localmente

Para rodar o frontend em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173` por padrão.

## Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

## Testes

### Testes unitários

```bash
npm run test:unit
```

### Testes end-to-end

```bash
npm run test:e2e
```

## Executando no Android

O projeto também está preparado para mobile com Capacitor.

1. Faça o build da aplicação:

```bash
npm run build
```

2. Sincronize com o Android:

```bash
npx cap sync android
```

3. Abra o projeto Android no Android Studio:

```bash
npx cap open android
```

## Estrutura principal

```text
src/
  components/
  composables/
  router/
  service/
  views/
  App.vue
  main.ts
```

## Observações

- A URL da API do backend deve estar configurada no arquivo `.env`.
- O frontend depende do backend para operações de geração de prompts e outros serviços.
- Para funcionar corretamente em ambiente local, o backend também precisa estar em execução.

## Dicas

- Verifique se a variável `VITE_PROMPTAI_API_URL` está correta.
- Caso a aplicação utilize Firebase, confirme também as configurações do projeto no arquivo de inicialização principal.
- Se o backend estiver em outra porta ou host, ajuste o valor do `.env` antes de iniciar a aplicação.
