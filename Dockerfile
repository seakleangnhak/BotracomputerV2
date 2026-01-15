FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build.node

ENV NODE_ENV=production
ENV PORTS=4173,4174
EXPOSE 4173 4174

CMD ["npm", "run", "start:prod"]
