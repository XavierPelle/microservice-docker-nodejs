FROM node:18-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

EXPOSE 5007