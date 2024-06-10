# superfrete-test

## Descrição

Este é um projeto de exemplo que inclui testes unitários e cobertura de código para funções do Firebase de interação com Cloud Firestore e Cloud Functions.

## Pré-requisitos

- Node.js
- npm
- Firebase CLI

[Saiba mais](https://firebase.google.com/docs/functions)

## Instalação

1. Clone este repositório:
    ```bash
    git clone https://github.com/Vitordex/superfrete-test.git
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd superfrete-test
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```

## Uso

Para iniciar o servidor local do Firebase, execute o seguinte comando:

```bash
firebase serve
```

## Testes

Este projeto inclui testes unitários e cobertura de código. Para executar os testes, use os seguintes comandos:
- Testes unitários:
```bash
npm run test_unit
```
- Cobertura de código:
```bash
npm run coverage
```

## Arquitetura

Para construir a arquitetura deste repositório utilizei conceitos de Clean Architecture e SOLID, para obter a maior eficiência na manutenção e criação de novas funções por parte de profissionais de qualquer tipo de experiência.

Os componentes principais da arquitetura são:
- index.js
- Componentes
- Modelos
- Serviços

### index.js

Para que tenhamos uma maior flexibilidade no uso da API do Firebase a ideia é separar as funções criadas no serviço das execuções dentro do código, para isso deixei um arquivo [index.js](./index.js) na raiz do projeto, que conterá todas as funções que serão utilizadas no cadastro das Cloud Functions.

### Componentes

Para separação das funções a ideia é ter uma pasta dentro de [src/](./src/) para cada categoria de execução das funções, então poderiam ser criadas pastas de funções que são relacionadas à collections do Firestore, ou que executem códigos relacionados à eventos de buckets na nuvem, etc.

Dentro dessas pastas deve haver um arquivo `index.js` que conterá o acesso à todas as funções da pasta, dessa forma centralizamos a declaração desses 'Componentes' de uma forma que só referenciamos um require por pasta no arquivo [index.js](./index.js).

> As funções dentro das pastas de componentes devem ser somente as implementações, com pouca ou nenhuma referência à dependências do firebase, dessa forma caso seja necessário trocar a implementação, utilizando novas ferramentas ou novos serviços temos menos pontos de mudança no código.

### Serviços e Modelos

Outra forma de desacoplar a implementação das funções do acesso aos serviços é utilizando classes de serviço próprias que derivam de classes abstratas de código. Desa forma conseguimos abstrair a utilização de serviços externos com a implementação do código das funções, deixando o código mais limpo e legível.

> É importante mencionar que estes serviços e modelos estão em pastas separadas para facilitação de acesso por parte das funções sem ter que referenciar outras funções.

## Melhorias

No futuro poderia ser feito algumas coisas:
- Adicionar testes de integração e testes end-to-end para as funções utilizando a própria CLI do Firebase
- Adicionar a crição do bucket pelo projeto utilizando o terraform, para centralização de código
- Adicionar uma pipeline de CI/CD completa incluindo o deploy de novas funções utilizando o fluxo do [Gitlab Flow](https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/)
- Adicionar autorização e autenticação para segregar quem tem acesso à funções específicas
- Incluir um sistema de sanitização de input utilizando uma ferramenta de Object Schema Validation como o [@hapi/joi](https://www.npmjs.com/package/@hapi/joi)
- Adicionar injeção de dependências com os serviços para que fiquem cada vez mais desacoplados das funções e possamos trocar as implementações sem problemas

## Licença

Este projeto está licenciado sob a licença MIT.