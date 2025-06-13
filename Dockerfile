# 빌드 스테이지
ARG NODE_VERSION=20.13.1
FROM node:${NODE_VERSION} AS build-stage
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# 실행 스테이지
FROM node:${NODE_VERSION}
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY --from=build-stage /build/dist ./dist
COPY --from=build-stage /build/node_modules ./node_modules
COPY --from=build-stage /build/package*.json ./
COPY --from=build-stage /build/prisma ./prisma

ENV SERVER_PORT=3000
ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy && npm run start"]