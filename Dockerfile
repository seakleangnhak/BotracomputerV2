FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build.node

ENV NODE_ENV=production
ENV PORT=4173
EXPOSE 4173

CMD ["npm", "run", "start:prod"]
