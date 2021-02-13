SHELL := /bin/bash

## Development
dev: dev-client dev-server
dev-server:
	rm -rf /tmp/WirtBotTests && mkdir /tmp/WirtBotTests && \
	cd ./Core && \
	PUBLIC_KEY=1lLU3VhXsrSGMxESmqfY4m2oEVkpfEHyKlCQU6MMPsI= \
	ALLOWED_ORIGIN=http://localhost:8080 \
	RUST_LOG=debug MANAGED_DNS_ENABLED=1 \
	MANAGED_DNS_DEVICE_FILE=/tmp/WirtBotTests/Corefile \
	CONFIG_PATH=/tmp/WirtBotTests/server.conf cargo watch -x run || cd -
dev-client: 
	cd ./Interface && npm run dev
dev-website: 
	cd ./Website && npm run dev
dev-setup:
	cd ./Shared-Libs/crypto && npm ci && npm run build && cd - && \
	cd ./Shared-Libs/config-generators && npm ci && npm run build && cd - && \
	cd ./Website && npm ci && cd - && \
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
### This cleans up the server conf, because the container changes it with chmod
test-system: 
	sudo chown $$USER Build-Automation/System-Tests/compose/test-server-conf && \
	docker-compose -f Build-Automation/System-Tests/compose/test.yml up --abort-on-container-exit --build --remove-orphans && \
	sudo chown $$USER Build-Automation/System-Tests/compose/test-server-conf
test-unit:
	cd ./Shared-Libs/crypto && npm run test && cd - && \
	cd ./Shared-Libs/config-generators && npm run test && cd - && \
	cd ./Website && npm run test && cd - && \
	cd ./Interface && npm run test && cd -

test-unit-ci:
	docker-compose -f Build-Automation/Unit-Tests/test.yml up --abort-on-container-exit --build --remove-orphans



## Maintenance
update-versions:
	./update_version.sh
tag-release:
	git tag $$(cat .version)
