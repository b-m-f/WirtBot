test: 
	docker-compose -f Interface/compose/test.yml up --build --remove-orphans --abort-on-container-exit

dev: dev-server dev-client

dev-server:
	cd ./WirtBot && make dev

dev-client: 
	cd ./Interface && npm run dev