FROM node:16-alpine

COPY . /app

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN apk add --no-cache git

RUN npm install -g yarn react-scripts && npm install

EXPOSE 3000 
