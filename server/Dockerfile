FROM node:14

WORKDIR /server

COPY package*.json ./
COPY src ./
COPY serviceAccountKey.json .

RUN npm i

ENTRYPOINT npm run start