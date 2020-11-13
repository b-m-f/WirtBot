SHELL := /bin/bash

## Development
dev: dev-server dev-client
dev-server:
	docker-compose -f Build-Automation/WirtBot/compose/dev.yml up -d --build --remove-orphans 
dev-client: 
	cd ./Interface && npm run dev
dev-website: 
	cd ./Website && npm run dev
dev-setup:
	cd ./Shared-Libs/crypto && npm ci && npm run build && cd - && \
	cd ./Shared-Libs/config-generators && npm ci && npm run build && cd - && \
	cd ./Website && npm ci && cd - && \
	cd ./Installer && npm ci && cd - && \
	cd ./Interface && npm ci && cd -

## Run complete WirtBot
run-test-wirtbot: 
	docker-compose -f Build-Automation/WirtBot/compose/example.yml up --abort-on-container-exit --build --remove-orphans
connect-test-wirtbot:
	cp testwirtbot.conf.example testwirtbot.conf && \
	sed -i  "s@Endpoint = development_wirtbot:10101@Endpoint = $(shell docker inspect development_wirtbot | grep -e "IPAddress\": \"[0-9].*\"" | cut -d '"' -f 4):10101@" testwirtbot.conf && \
	sudo mv testwirtbot.conf /etc/wireguard/testwirtbot.conf && \
	sudo wg-quick up testwirtbot

## Tests
test-system: 
	docker-compose -f Build-Automation/System-Tests/compose/test.yml up --abort-on-container-exit --build --remove-orphans
test-unit:
	cd ./Shared-Libs/crypto && npm run test && cd - && \
	cd ./Shared-Libs/config-generators && npm run test && cd - && \
	cd ./Website && npm run test && cd - && \
	cd ./Installer && npm run test && cd - && \
	cd ./Interface && npm run test && cd -

test-unit-ci:
	docker-compose -f Build-Automation/Unit-Tests/test.yml up --abort-on-container-exit --build --remove-orphans
test-installer:
	docker-compose -f Build-Automation/Installer-Tests/test.yml up --abort-on-container-exit --build --remove-orphans



## Maintenance
update-versions:
	./update_version.sh
tag-release:
	git tag $$(cat .version)
