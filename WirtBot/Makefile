dev: export ALLOWED_ORIGIN=http://localhost:8080
dev:
	docker-compose -f compose/dev.yml up --build
test:
	cargo test
test-dev:
	cargo watch -x test
