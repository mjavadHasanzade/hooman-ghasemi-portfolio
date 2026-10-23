# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL=/api/v1
ARG NEXT_PUBLIC_BACKEND_ORIGIN=
ARG NEXT_PUBLIC_ASSET_ORIGIN=http://homan-baackend:4000
ARG BACKEND_ORIGIN=http://homan-baackend:4000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_BACKEND_ORIGIN=${NEXT_PUBLIC_BACKEND_ORIGIN}
ENV NEXT_PUBLIC_ASSET_ORIGIN=${NEXT_PUBLIC_ASSET_ORIGIN}
ENV BACKEND_ORIGIN=${BACKEND_ORIGIN}

RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/package-lock.json ./package-lock.json
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/next.config.ts ./next.config.ts
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

USER node
EXPOSE 3000
CMD ["npm", "start"]
