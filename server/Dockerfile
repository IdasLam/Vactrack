FROM node:14

WORKDIR /server

COPY package*.json ./
COPY src ./
COPY serviceAccountKey.json .
COPY .env ./

RUN npm i

ENTRYPOINT npm run start