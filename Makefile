
.PHONY: help console

export PROJECT_DIRECTORY = $(shell pwd)
include ${PROJECT_DIRECTORY}/docker/.env
export USER = $(shell id -n -u)
export UID = $(shell id -u)
export GID = $(shell id -g)

build: ## Build docker image for development
	docker build -t ${PROJECT_NAME}-console \
		--build-arg USER=${USER} \
		--build-arg UID=${UID} \
		--build-arg CONTAINER_SHELL=${CONTAINER_SHELL} \
		docker/

console: ## Launch zsh in docker container
	docker run \
		--name=${PROJECT_NAME}-console \
		--volume=$(shell pwd):/srv \
		--volume=$${DEV}/.home-developer:/home/developer \
		--env=NODE_ENV=development \
		--env=MAIN_DOMAIN=${DOMAIN} \
		--env=ENDPOINT='https://${DOMAIN}' \
		--label traefik.enable=true \
        --label 'traefik.http.routers.${PROJECT_NAME}.rule=Host(`${DOMAIN}`)' \
        --label 'traefik.http.routers.${PROJECT_NAME}.tls=true' \
        --label 'traefik.http.routers.${PROJECT_NAME}.entrypoints=websecure' \
        --label 'traefik.http.services.${PROJECT_NAME}.loadbalancer.server.port=3006' \
        --network ${TRAEFIK_NETWORK} \
		--workdir /srv/app \
		--interactive \
		--tty \
		--rm \
		${PROJECT_NAME}-console \
		${CONTAINER_SHELL}

test:
	yarn test --passWithNoTests

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

