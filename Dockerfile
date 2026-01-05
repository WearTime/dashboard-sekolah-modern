# Build
FROM node:22-alphine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Prod
FROM node:22-alphine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 4100

CMD [ "npm", "start" ]