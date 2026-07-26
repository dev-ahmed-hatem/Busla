# BUSLA — top-level orchestration.
# Thin wrapper over docker compose + per-island tooling.
# On Windows use Git Bash (or `wsl`) to run these targets.

COMPOSE := docker compose -f infra/compose/docker-compose.yml

.PHONY: help up down logs build ps migrate makemigrations superuser \
        codegen openapi gen-ts gen-dart diff-check \
        install test lint typecheck fmt \
        api-shell web-shell seed

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

## ----- Local stack (Docker) -----
up: ## Start the full local stack (postgis, redis, api, workers, web)
	$(COMPOSE) up --build -d
	@echo "API   → http://localhost:8000  |  Web → http://localhost:3000"

down: ## Stop the stack
	$(COMPOSE) down

logs: ## Tail all service logs
	$(COMPOSE) logs -f

ps: ## Show running services
	$(COMPOSE) ps

## ----- Backend -----
migrate: ## Apply Django migrations
	$(COMPOSE) exec api python manage.py migrate

makemigrations: ## Create Django migrations
	$(COMPOSE) exec api python manage.py makemigrations

superuser: ## Create a Django superuser
	$(COMPOSE) exec api python manage.py createsuperuser

seed: ## Seed reference-scale demo data
	$(COMPOSE) exec api python manage.py seed_demo

api-shell: ## Open a shell in the api container
	$(COMPOSE) exec api bash

## ----- Contract-first codegen spine -----
openapi: ## Regenerate contracts/openapi.yaml from DRF
	$(COMPOSE) exec api python manage.py spectacular --color --file /app/../../contracts/openapi.yaml
	@echo "openapi.yaml regenerated"

gen-ts: ## Generate the TS client from openapi.yaml
	bash contracts/scripts/gen-ts.sh

gen-dart: ## Generate the Dart client from openapi.yaml
	bash contracts/scripts/gen-dart.sh

codegen: openapi gen-ts gen-dart ## Regenerate openapi.yaml + TS + Dart clients

diff-check: ## Fail if the contract / generated clients drift (used in CI)
	bash contracts/scripts/diff-check.sh

## ----- Cross-island quality -----
install: ## Install all dependencies (TS + Python + Dart)
	npm install
	cd apps/api && poetry install
	melos bootstrap

test: ## Run all test suites
	npm test
	cd apps/api && poetry run pytest
	melos run test

lint: ## Lint all islands
	npm run lint
	cd apps/api && poetry run ruff check .
	melos run analyze

typecheck: ## Typecheck TS + Python
	npm run typecheck
	cd apps/api && poetry run mypy .

fmt: ## Format all code
	npx prettier --write .
	cd apps/api && poetry run ruff format .
	melos run format
