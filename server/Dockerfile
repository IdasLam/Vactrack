FROM node:14

WORKDIR /server

COPY package*.json ./
COPY src ./

RUN npm i

ENTRYPOINT npm run start