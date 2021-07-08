FROM node:13.12.0-alpine

WORKDIR /app/

ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json /app/package.json

RUN npm config get proxy
RUN npm config rm proxy
RUN npm config rm https-proxy

RUN npm config set registry http://registry.npmjs.org/
RUN npm install
RUN npm install react-scripts@3.4.1 -g --silent

COPY ./src/ /app/src/
COPY ./public/ /app/public/

ENTRYPOINT ["npm","start"]