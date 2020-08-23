test-ci: 
	docker build . -f docker/TestsDockerfile -t test-interface;\
	docker-compose -f docker/compose/test.yml up --abort-on-container-exit
test-e2e: 
	docker build . -f docker/TestsDockerfile -t test-interface;\
	docker-compose -f docker/compose/test-local.yml up -d;\
	docker logs -f test-runner