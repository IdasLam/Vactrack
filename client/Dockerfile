FROM node:14

WORKDIR /client

COPY package*.json ./
COPY src ./
COPY public ./
COPY tsconfig.json ./

RUN npm i

ENTRYPOINT npm run start
# ENTRYPOINT npm run build