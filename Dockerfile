FROM node:18-alpine3.17

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

USER node

RUN npm i

COPY --chown=node:node . .

EXPOSE 3000
RUN
CMD ["sh","-c", "export NODE_ENV=production && node ./dist/run.js"]
