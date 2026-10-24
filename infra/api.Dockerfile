FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/api/package.json services/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN npm ci
COPY services/api services/api
COPY packages/contracts packages/contracts
RUN npm run build:api

FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/api/package.json services/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN npm ci --omit=dev --workspace @farta/api --include-workspace-root=false && npm cache clean --force

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production API_HOST=0.0.0.0 API_PORT=3001
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/api/dist ./dist
COPY --from=build --chown=node:node /app/services/api/package.json ./package.json
USER node
EXPOSE 3001
CMD ["node","dist/server.js"]
