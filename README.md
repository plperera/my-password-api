# we-pass-back

Back-end para WePass, uma solução de gerenciamento de Senhas e outras Credenciais.

:D

## Sobre

WePass é uma aplicação de navegador web com a qual você pode gerenciar suas Senhas, Informações do Cartão e Notas Pessoais. Tudo Criptografado!!!

## Rodando em Desenvolvimento

1. Clone este repositório
2. Instale todas as dependências

```bash
npm i
```

3. Crie um banco de dados PostgreSQL com o nome que desejar
4. Configure o arquivo .env.development usando o arquivo .env.example (para rodar com o Docker veja a seção "Executando com o Docker" para mais detalhes)
5. Execute todas as migrations do PrismaORM

```bash
npm run migration:run
```

6. Execute o back-end em ambiente de desenvolvimento:

```bash
npm run dev
```

## Building e Starting para produção

```bash
npm run build
npm start
```

## Executando com o Docker

1. Configure o arquivo .env usando o arquivo .env.example

2. A Aplicação foi feita para rodar com Docker Compose, para isso, siga para: https://github.com/plperera/we-pass