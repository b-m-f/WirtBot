dev: dev-server dev-client

dev-server:
	cd ./WirtBot && make dev

dev-client: 
	cd ./Interface && npm run dev
test-interface-ci: 
	docker build . -f Interface/docker/TestsDockerfile -t test-interface;\
	docker build WirtBot -f WirtBot/docker/DevDockerfile -t test-wirtbot;\
	docker-compose -f Interface/docker/compose/test-ci.yml up --abort-on-container-exit