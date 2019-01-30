FROM node:10.6
WORKDIR /app
COPY package*.json
RUN npm install

