# Shopper-Teste-Back

Programa para atualizar preços de tabelas de mercado feito para o teste da vaga de Desenvolvedor FullStack Junior da startup Shopper. 
Este é o Back-End do projeto.


## Tecnologias utilizadas:
  - TypeScript;
  - Node.js;
  - MySQL.

## Setup
 - Arquivo .env.example presente na raiz do projeto com todos os campos necessários para conectar ao banco de dados e escolher a porta da aplicação, caso desejar;
 - Utilize o comando "npm i" para instalar as dependências do projeto;
 - Utilize o comando "npm run dev" para iniciar o servidor.

## Rotas 
 - POST /validate:
   - Body: Arquivo .csv com linhas no formato |product_code,new_price|, sendo product_code um número inteiro positivo e new_price um número positivo.
        Ex:              
            ![image](https://github.com/kassioba/Shopper-Teste-Back/assets/114841639/9ed7e32d-6315-40a3-9daf-a033a3cc8849)

      Deve ser enviado em um objeto { file: (ARQUIVO .CSV) }.
   -  Response: {  
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"response": [ { "code": number, "name": string, "current_price": string, "new_price": string} ],  
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"error": boolean  
           }  
    - Status: 200 (OK)

- PUT /update:
   - Body: Arquivo .csv com linhas no formato |product_code,new_price|, sendo product_code um número inteiro positivo e new_price um número positivo.
        Ex:              
            ![image](https://github.com/kassioba/Shopper-Teste-Back/assets/114841639/9ed7e32d-6315-40a3-9daf-a033a3cc8849)

      Deve ser enviado em um objeto { file: (ARQUIVO .CSV) }.
  - Response: {}
  - Status: 204 (NO CONTENT)
