FROM node:latest

WORKDIR /app

COPY ./package*.json ./

COPY ./prisma prisma

RUN npm install

COPY ./ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]