test-ci: 
	docker build . -f docker/TestsDockerfile -t test-interface;\
	docker-compose -f docker/compose/test.yml up --abort-on-container-exit