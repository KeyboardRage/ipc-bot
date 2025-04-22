# Build stage
FROM node:23-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/bin ./dist

CMD ["node", "dist/index.mjs"]