test-ci: 
	docker build . -f docker/TestsDockerfile -t test-interface;\
	docker-compose -f docker/compose/test-ci.yml up --abort-on-container-exit
test-e2e: 
	docker-compose -f docker/compose/test-local.yml down ;\
	docker build . -f docker/TestsDockerfile -t test-interface;\
	docker-compose -f docker/compose/test-local.yml up -d --force-recreate --build ;\
	docker logs -f test-runner