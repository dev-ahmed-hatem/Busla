# BUSLA web image — Next.js standalone build served on port 3000.
FROM node:22-slim AS base
RUN npm install -g pnpm@11
WORKDIR /repo

# Workspace manifests for cached install.
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web
COPY contracts ./contracts

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @busla/tokens build && pnpm --filter @busla/web build

EXPOSE 3000
WORKDIR /repo/apps/web
CMD ["pnpm", "start"]
