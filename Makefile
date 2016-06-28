.PHONY: all
all: init test

.PHONY: init
init:
	npm install

.PHONY: test
test:
	npm test
