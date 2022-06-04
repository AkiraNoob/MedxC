FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package*.json /usr/src/node-app/
RUN npm install

USER node

COPY --chown=node:node . /usr/src/node-app

# CMD ["npm", "start"]

EXPOSE 3001
