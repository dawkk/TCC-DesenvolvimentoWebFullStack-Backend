FROM node:18

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY src/ src/

COPY index.js index.js

EXPOSE 8000

CMD ["npm", "start"]