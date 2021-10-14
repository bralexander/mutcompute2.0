FROM node:16-alpine


ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

COPY . /app

RUN apk add --no-cache git && yarn install 

# RUN npm install -g --force yarn react-scripts && npm install

EXPOSE 3000 
