dev: dev-server dev-client

dev-server:
	cd ./WirtBot && make dev

dev-client: 
	cd ./Interface && npm run dev
test-ci: 
	docker build . -f Interface/docker/TestsDockerfile -t test-interface;\
	docker build WirtBot -f WirtBot/docker/Dockerfile -t test-wirtbot;\
	docker-compose -f Interface/docker/compose/test-ci.yml up --abort-on-container-exit --build
test-e2e: 
	docker-compose -f docker/compose/test-local.yml down ;\
	docker build . -f docker/TestsDockerfile -t test-interface;\
	docker build WirtBot -f WirtBot/docker/Dockerfile -t test-wirtbot;\
	docker-compose -f docker/compose/test-local.yml up -d --force-recreate --build ;\
	docker logs -f test-runner
