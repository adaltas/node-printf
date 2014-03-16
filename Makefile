REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers coffee:coffee-script/register \
		--reporter $(REPORTER)

coverage:
	@jscoverage --no-highlight lib lib-cov
	@PRINTF_COV=1 $(MAKE) test REPORTER=html-cov > doc/coverage.html
	@rm -rf lib-cov

.PHONY: test
