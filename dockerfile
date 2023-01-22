FROM node:18-alpine
WORKDIR /opt/app

COPY src ./src
COPY test ./test
COPY package.json .
COPY config.json .
RUN npm i

CMD npm start
