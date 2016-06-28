var semver = require("semver");
var should = require("should");
var printf = require(process.env.PRINTF_COV ? '../lib-cov/printf' : '../lib/printf');

// The name field for each suite is passed as the first argument to `it`
// A row `t` in tests is equivalent to `printf.apply(null, t[0]).should.eql(t[1])`
// if t[2] is specified, the result is assumed to fail with the specified message
var SUITES = [
	{
		name:'Specifier: b',
		tests: [
			[['%b', 123],     '1111011']
		]
	},
	{
		name: 'Flag: (space)',
		tests: [
			[['% d', 42],     ' 42'],
			[['% d', -42],    '-42'],
			[['% 5d', 42],    '   42'],
			[['% 5d', -42],   '  -42'],
			[['% 15d', 42],   '             42'],
			[['% 15d', -42],  '            -42']
		]
	},
	{
		name: 'Flag: +',
		tests: [
			[['%+d', 42],     '+42'],
			[['%+d', -42],    '-42'],
			[['%+5d', 42],    '  +42'],
			[['%+5d', -42],   '  -42'],
			[['%+15d', 42],   '            +42'],
			[['%+15d', -42],  '            -42']
		]
	},
	{
		name: 'Flag: 0',
		tests: [
			[['%0d', 42],     '42'],
			[['%0d', -42],    '-42'],
			[['%05d', 42],    '00042'],
			[['%05d', -42],   '-00042'],
			[['%015d', 42],   '000000000000042'],
			[['%015d', -42],  '-000000000000042']
		]
	},
	{
		name: 'Flag: -',
		tests: [
			[['%-d', 42],     '42'],
			[['%-d', -42],    '-42'],
			[['%-5d', 42],    '42   '],
			[['%-5d', -42],   '-42  '],
			[['%-15d', 42],   '42             '],
			[['%-15d', -42],  '-42            '],
			[['%-0d', 42],    '42'],
			[['%-0d', -42],   '-42'],
			[['%-05d', 42],   '42   '],
			[['%-05d', -42],  '-42  '],
			[['%-015d', 42],  '42             '],
			[['%-015d', -42], '-42            '],
			[['%0-d', 42],    '42'],
			[['%0-d', -42],   '-42'],
			[['%0-5d', 42],   '42   '],
			[['%0-5d', -42],  '-42  '],
			[['%0-15d', 42],  '42             '],
			[['%0-15d', -42], '-42            ']
		]
	},
	{
		name: 'Precision',
		tests: [
			[['%d', 42.8952],        '42'],
			[['%.2d', 42.8952],      '42'],
			[['%.2i', 42.8952],      '42'],
			[['%.2f', 42.8952],      '42.90'],
			[['%.2F', 42.8952],      '42.90'],
			[['%.10f', 42.8952],     '42.8952000000'],
			[['%1.2f', 42.8952],     '42.90'],
			[['%6.2f', 42.8952],     ' 42.90'],
			[['%06.2f', 42.8952],    '042.90'],
			[['%+6.2f', 42.8952],    '+42.90'],
			[['%5.10f', 42.8952],    '42.8952000000'],
			[['%1.4g', 1.06800e-10], '1.068e-10']
		]
	},
	{
		name: 'Bases',
		tests: [
			[['%c', 0x7f], ''],
			[['%c', -100], null,     'invalid character code passed to %c in printf'],
			[['%c', 0x200000], null, 'invalid character code passed to %c in printf']
		]
	},
	{
		name: 'Mapping',
		tests: [
			[['%1$'], '%1$'],
			[['%0$s'], '%0$s'],
			[['%1$s %2$s', 'Hot', 'Pocket'], 'Hot Pocket'],
			[['%1$.1f %2$s %3$ss', 12, 'Hot', 'Pocket'], '12.0 Hot Pockets'],
			[['%1$*.f', '42', 3], ' 42'],
			[['%2$*s', 'Hot Pocket'], null, "got 1 printf arguments, insufficient for '%2$*s'"],
			[['%(foo', {}], '%(foo'],
			[['%(temperature)s %(crevace)s', {
				temperature: 'Hot',
				crevace: 'Pocket'
			}], 'Hot Pocket'],
			[['%(quantity).1f %(temperature)s %(crevace)ss', {
				quantity: 12,
				temperature: 'Hot',
				crevace: 'Pocket'
			}], '12.0 Hot Pockets'],
			[['%(foo)s', 42], null,                'format requires a mapping'],
			[['%(foo)s %(bar)s', 'foo', 42], null, 'format requires a mapping'],
			[['%(foo)*s', { foo: 'Hot Pocket' }], null, '* width not supported in mapped formats']
		]
	},
	{
		name: 'Positionals',
		tests: [
			[['%*s', 'foo', 4], ' foo'],
			[['%*.*f', 3.14159265, 10, 2], '      3.14'],
			[['%0*.*f', 3.14159265, 10, 2], '0000003.14'],
			[['%-*.*f', 3.14159265, 10, 2], '3.14      '],
			[['%*s', 'foo', 'bar'], null, 'the argument for * width at position 2 is not a number in %*s'],
			[['%10.*f', 'foo', 42], null, "format argument 'foo' not a float; parseFloat returned NaN"]
		]
	},
	{
		name: 'Miscellaneous',
		tests: [
			[['+%s+', 'hello'], '+hello+'],
			[['+%d+', 10], '+10+'],
			[['%c', 'a'], 'a'],
			[['%c', 34], '\"'],
			[['%c', 36], '$'],
			[['%d', 10], '10'],
			[['%s%s', 42], null, "got 1 printf arguments, insufficient for '%s%s'"],
			[['%c'], null, "got 0 printf arguments, insufficient for '%c'"],
			[['%10', 42], '%10']
		]
	},
	{
		name: 'Escape',
		tests: [
			[['%d %', 10],   '10 %']
		]
	}
];

function fail_with_error(f, msg) {
	var error = false;
	try { f(); }
	catch (e) {
		e.message.should.eql(msg);
		error = true;
	}
	error.should.be["true"];
}

describe('sprintf', function() {
	SUITES.forEach(function(suite) {
		it(suite.name, function() {
			suite.tests.forEach(function(t) {
				if(t.length === 2) printf.apply(null, t[0]).should.eql(t[1]);
				else fail_with_error(function(){printf.apply(null, t[0])}, t[2]);
			});
		});
	});
	it('Formatter', function() {
		var i = 0, str = new printf.Formatter('%d %s Pockets');
		while (i < 1000) {
			printf('%d %s Pockets', i, 'Hot').should.eql(str.format(i, 'Hot'));
			i++;
		}
	});
	it('Object inspection', function() {
		var test;
		test = {
			foo: {
				is: {
					bar: true,
					baz: false
				},
				isnot: {
					array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
				},
				maybe: void 0
			}
		};
		printf('%.0O', test).replace(/\s+/g, ' ').should.eql('{ foo: [Object] }');
		printf('%#O', test.foo.isnot.array).should.eql('[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]');
		if (semver.lt(process.version, 'v0.9.0')) {
			return;
		}
		printf('%O', test).replace(/\s+/g, ' ').should.eql('{ foo: { is: { bar: true, baz: false }, isnot: { array: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, [length]: 10 ] }, maybe: undefined } }');
		printf('%.2O', test).replace(/\s+/g, ' ').should.eql('{ foo: { is: { bar: true, baz: false }, isnot: { array: [Object] }, maybe: undefined } }');
	});
});
