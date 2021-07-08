FROM node:13.12.0-alpine

WORKDIR /app/

ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json /app/package.json

RUN npm config get proxy && npm config rm proxy && npm config rm https-proxy && npm install && npm install react-scripts@3.4.1 -g --silent

# RUN npm config set registry http://registry.npmjs.org/
# RUN npm install
# RUN npm install react-scripts@3.4.1 -g --silent

COPY ./src/ /app/src/
COPY ./public/ /app/public/

ENTRYPOINT ["npm","start"]