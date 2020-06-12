test: 
	docker-compose -f Interface/compose/test.yml up --build --remove-orphans --abort-on-container-exit
