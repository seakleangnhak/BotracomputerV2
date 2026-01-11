IMAGE ?= botra-qwik
TAG ?= latest

.PHONY: docker-build docker-build-amd64
docker-build:
	docker build -t $(IMAGE):$(TAG) .

docker-build-amd64:
	docker buildx build --platform linux/amd64 --load -t $(IMAGE):$(TAG) .
