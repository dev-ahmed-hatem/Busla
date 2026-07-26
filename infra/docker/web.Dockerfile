# BUSLA web image — Next.js standalone build served on port 3000.
FROM node:22-slim AS base
WORKDIR /repo

# Workspace manifests for cached install.
COPY package.json package-lock.json* turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web
COPY contracts ./contracts

RUN npm ci || npm install
RUN npm run build --workspace @busla/tokens && npm run build --workspace @busla/web

EXPOSE 3000
WORKDIR /repo/apps/web
CMD ["npm", "start"]
