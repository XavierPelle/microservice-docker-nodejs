
# NodeJS API in Docker microservices

The aim of this project is to learn how to create an API in a Docker microservice architecture using Nodejs.

---




## Installation

```bash
  git clone https://github.com/XavierPelle/microservice-docker-nodejs
  cd microservice-docker-nodejs
  cd backend 
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

GET /users for get all users
POST /users/create for create user
PUT /users/update/:id for update user
DELETE /users/delete/:id for delete user

#### /product

GET /product for get all products
POST /products/create for create product
PUT /products/update/:id for update product
DELETE /products/delete/:id for delete product
