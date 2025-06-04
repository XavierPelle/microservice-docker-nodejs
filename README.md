
# NodeJS API in Docker microservices

The aim of this project is to learn how to create an API in a Docker microservice architecture using Nodejs.

---




## Installation

```bash
  git clone https://github.com/XavierPelle/microservice-docker-nodejs
  cd microservice-docker-nodejs
  cd environnement 
```
you need to create .env in each microservice for the database.

```bash
  docker network create microservice
  docker-compose up -d
```
You can check logs with 
```bash
  docker logs [container_name]
```
For execute command into container (this part "//bin//sh" could be different on windows os)
```bash
  docker exec -it [container_name] //bin//sh 
```

---
    
## Documentation

You can use the API-GATEWAY on http://localhost:5000/[endpoint]

#### /users 

- GET /users for get all users
- POST /users/create for create user
- PUT /users/update/:id for update user
- DELETE /users/delete/:id for delete user

#### /product

- GET /product for get all products
- POST /products/create for create product
- PUT /products/update/:id for update product
- DELETE /products/delete/:id for delete product

#### /transaction-history

The history works as follows: when a product is created, we add a row to the database with the "Achat” data, and when we delete it, we do the same thing, but with “Vente”. We still need to define the case for “Echange”.

- GET /transaction-history for get all history
- POST /products/create for create a new entry in history

## Front-end

You can access the front-end of the application at http://localhost:4200
The front-end is generated at the same time as the back-end by the docker-compose located in the environment folder.
