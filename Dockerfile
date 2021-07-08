FROM node:latest

WORKDIR /app/

ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json /app/package.json

# RUN npm config get proxy && npm config rm proxy && npm config rm https-proxy && npm install && npm install react-scripts@3.4.1 -g --silent
RUN which npm
RUN npm config get registry
RUN npm config set strict-ssl false
# the set registry to https://registry.npmjs.com/ WAS SUPER CRITICAL
RUN npm config set registry https://registry.npmjs.com/ --global
RUN npm cache clear --force
RUN npm config set unsafe-perm true
RUN npm install --cache /tmp/empty-cache
RUN npm install react-scripts@3.4.1 -g --cache /tmp/empty-cache

# RUN npm install react-scripts@3.4.1 -g --silent

COPY ./src/ /app/src/
COPY ./public/ /app/public/

ENTRYPOINT ["npm","start"]