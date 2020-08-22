dev:
	docker-compose -f docker/compose/dev.yml up -d --build
test:
	cargo test
test-dev:
	cargo watch -x test
test-ci:
	docker-compose -f docker/compose/test.yml run test_wirtbot