dev: dev-server dev-client

dev-server:
	cd ./WirtBot && make dev

dev-client: 
	cd ./Interface && npm run dev
test-ci: 
	docker-compose -f Interface/docker/compose/test-ci.yml up --abort-on-container-exit --build --remove-orphans
test-e2e: 
	docker-compose -f docker/compose/test-local.yml down ;\
	docker-compose -f docker/compose/test-local.yml up -d --force-recreate --build ;\
	docker logs -f test-runner
