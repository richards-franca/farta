FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/api/package.json services/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL=https://farta.site
ARG NEXT_DEPLOYMENT_ID
ARG NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
ENV NEXT_TELEMETRY_DISABLED=1 FARTA_API_URL=http://api:3001
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node","server.js"]
