FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production --no-cache

FROM node:20-alpine

ENV NODE_ENV=production
ENV USER=node
ENV WORKDIR=/home/$USER/app

WORKDIR $WORKDIR

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

USER node
EXPOSE 4000

CMD ["node", "server.js"]