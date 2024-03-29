SHELL := /bin/bash

## Development
dev: dev-client dev-server
dev-tests: dev-client-test dev-tests-server
dev-server:
	rm -rf /tmp/WirtBotTests && mkdir /tmp/WirtBotTests && \
	touch /tmp/WirtBotTests/server.conf && \
	touch /tmp/WirtBotTests/Corefile && \
	cd ./Core && \
	ALLOWED_ORIGIN=http://localhost:8080 \
	RUST_LOG=debug MANAGED_DNS_ENABLED=1 \
	MANAGED_DNS_DEVICE_FILE=/tmp/WirtBotTests/Corefile \
	CONFIG_PATH=/tmp/WirtBotTests/server.conf cargo watch -x run || cd -
dev-tests-server:
	rm -rf /tmp/WirtBotTests && mkdir /tmp/WirtBotTests && \
	touch /tmp/WirtBotTests/server.conf && \
	touch /tmp/WirtBotTests/Corefile && \
	cd ./Core && \
	PUBLIC_KEY=1lLU3VhXsrSGMxESmqfY4m2oEVkpfEHyKlCQU6MMPsI= \
	ALLOWED_ORIGIN=http://localhost:8080 \
	RUST_LOG=debug MANAGED_DNS_ENABLED=1 \
	MANAGED_DNS_DEVICE_FILE=/tmp/WirtBotTests/Corefile \
	CONFIG_PATH=/tmp/WirtBotTests/server.conf cargo watch -x run || cd -
dev-client: 
	cd ./Interface && npm run dev
dev-client-test: 
	cd ./Interface && npm run dev-test
dev-website: 
	cd ./Website && npm run dev
dev-setup:
	cd ./Website && npm ci && cd - && \
	cd ./Interface && npm ci && cd -

## Run complete WirtBot
run-test-wirtbot: 
	sudo chown $$USER Build-Automation/WirtBot/compose/test-server.conf && \
	docker-compose -f Build-Automation/WirtBot/compose/example.yml up --abort-on-container-exit --build --remove-orphans && \
	sudo chown $$USER Build-Automation/WirtBot/compose/test-server.conf
connect-test-wirtbot:
	cp testwirtbot.conf.example testwirtbot.conf && \
	sed -i  "s@Endpoint = development_wirtbot:10101@Endpoint = $(shell docker inspect development_wirtbot | grep -e "IPAddress\": \"[0-9].*\"" | cut -d '"' -f 4):10101@" testwirtbot.conf && \
	sudo mv testwirtbot.conf /etc/wireguard/testwirtbot.conf && \
	sudo wg-quick up testwirtbot

## Tests
### This cleans up the server conf, because the container changes it with chmod
test-system: 
	sudo chown $$USER Build-Automation/System-Tests/compose/test-server.conf && \
	sudo chown $$USER Build-Automation/System-Tests/compose/test-Corefile && \
	docker-compose -f Build-Automation/System-Tests/compose/test.yml up --abort-on-container-exit --build --remove-orphans && \
	sudo chown $$USER Build-Automation/System-Tests/compose/test-Corefile && \
	sudo chown $$USER Build-Automation/System-Tests/compose/test-server.conf
test-unit:
	cd ./Website && npm run test && cd - && \
	cd ./Interface && npm run test && cd - && \
	cd ./Core && cargo test

test-unit-ci:
	docker-compose -f Build-Automation/Unit-Tests/test.yml up --abort-on-container-exit --build --remove-orphans


## Maintenance
update-versions:
	./convenience-scripts/update-version.sh
tag-release:
	git tag v$$(cat .version)
update-dependencies:
	./convenience-scripts/update-dependencies.sh

## Build and release
build-and-release:
	buildah bud --dns=none --network=host  --platform linux/arm64,linux/amd64 --manifest docker.io/bmff/wirtbot-$$(cat .version) -f Build-Automation/WirtBot/Dockerfile . && \
	buildah manifest push --all docker.io/bmff/wirtbot-$$(cat .version) docker://docker.io/bmff/wirtbot:latest && \
	buildah manifest push --all docker.io/bmff/wirtbot-$$(cat .version) docker://docker.io/bmff/wirtbot:$$(cat .version)

## DNS is included since rootless networking inside a toolbox on Fedora seemed to kill DNS resolution
buildah-and-release-test:
	## Require buildah and qemu-user-static
	buildah bud -m=12G --dns=none --network=host  --manifest wirtbot:$$(cat .version) --platform=linux/amd64  -f Build-Automation/WirtBot/Dockerfile . && \
	buildah manifest push  wirtbot:$$(cat .version)-test "docker://bmff/wirtbot:$$(cat .version)-test"
