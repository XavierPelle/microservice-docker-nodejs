
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


    
## Documentation

You can use the API-GATEWAY on http://localhost:5000 and endpoint 

#### /users 
for user-microservice

#### /product
for product microservice
