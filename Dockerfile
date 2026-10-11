# ---------- Build stage ----------
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
# allowScripts is honored by npm when copying the package.json,
# so native deps (better-sqlite3, prisma engines) build correctly
RUN npm ci

COPY . .

# Generate the Prisma client into src/common/infrastructure/database/generated/prisma
RUN npx prisma generate

RUN npm run build

# Prune dev dependencies for the runtime image.
# Keep prisma (devDependency) — the entrypoint runs `prisma db push` at startup.
RUN npm prune --omit=dev && npm install -O prisma@$(node -p "require('./package-lock.json').packages['node_modules/prisma'].version")

# ---------- Runtime stage ----------
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

# dumb-init gives proper signal handling / zombie reaping
RUN apk add --no-cache dumb-init

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=node:node /app/package.json ./package.json

# SQLite database lives on a volume, mounted at /app/data.
# Set DATABASE_URL=file:/app/data/app.db in the environment.
RUN mkdir -p /app/data /app/logs && chown node:node /app/data /app/logs
VOLUME /app/data

USER node

EXPOSE 3000

COPY --chown=node:node docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["/usr/bin/dumb-init", "--", "./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
