# talk-manager

# Contexto
- Desenvolver aplicação de cadastro de talkers (palestrantes) em que será possível cadastrar, visualizar, pesquisar, editar e excluir informações.

# A aplicação deverá permitir a pessoa usuária:
- Desenvolver uma API de um CRUD (Create, Read, Update e Delete) de palestrantes (talkers).
- Desenvolver alguns endpoints que irão ler e escrever em um arquivo utilizando o módulo fs.

# Utilizar Docker
## Iniciar containers
```
docker-compose up -d
```
## em um terminal, inicie os containers
```
docker-compose up -d
```
## acesse o terminal do container inicie a aplicação
docker exec -it talker_manager bash
npm start
## ou iniciar com live-reload
```
npm run dev
```

## em outro terminal, rode os testes
```
docker exec -it talker_manager bash
npm run lint # roda a verificação do linter
npm test # roda todos os testes
npm test 01 # rodando apenas o teste do requisito 01
```

## Arquivos desenvolvidos pela Trybe
* src:
  - package.json
  - package-lock.json
