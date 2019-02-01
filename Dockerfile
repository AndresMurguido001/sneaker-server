FROM node:10.6
WORKDIR /app
COPY package*.json ./
RUN npm install
ENV NODE_ENV production
COPY dist ./
CMD node index.js
USER node