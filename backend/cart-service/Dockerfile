FROM node:18-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5005