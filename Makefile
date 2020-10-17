dev: dev-server dev-client

dev-server:
	cd ./WirtBot && make dev

dev-client: 
	cd ./Interface && npm run dev
test-ci:
	cd ./Interface && npm ci && npm run test && cd - &&  make test-system
test-system: 
	docker-compose -f System-Tests/compose/test.yml up --abort-on-container-exit --build --remove-orphans
