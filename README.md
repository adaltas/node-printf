[![Build Status](https://secure.travis-ci.org/adaltas/node-printf.svg)](http://travis-ci.org/adaltas/node-printf)

A complete implementation of the **`printf` C functions family**
for [Node.JS](http://nodejs.org), written in pure JavaScript.

**Bonus!** You get extra features, like the `%O` converter (which `inspect`s
the argument). See [Extra Features](#extra-features) below.

## Installing

Via [NPM](https://github.com/isaacs/npm):

``` bash
npm install printf
```

## Usage

Use it like you would in C (`printf`/`sprintf`):

``` javascript
var printf = require('printf');
var result = printf(format, args...);
```

It can also output the result for you, as `fprintf`:

``` javascript
var printf = require('printf');
printf(write_stream, format, args...);
```

## Features

### Flag ` ` (space)

``` javascript
assert.eql('  -42', printf('% 5d', -42));
```

### Flag `+` (plus)

``` javascript
assert.eql('  +42', printf('%+5d', 42));
```

### Flag `0` (zero)

``` javascript
assert.eql('00042', printf('%05d', 42));
```

### Flag `-` (minus)

``` javascript
assert.eql('42   ', printf('%-5d', 42));
```

### Width / precision

``` javascript
assert.eql('42.90', printf('%.2f', 42.8952));
assert.eql('042.90', printf('%06.2f', 42.8952));
```

### Numerical bases

``` javascript
assert.eql('\x7f', printf('%c', 0x7f));
assert.eql('a', printf('%c', 'a'));
assert.eql('"', printf('%c', 34));
```

### Miscellaneous

``` javascript
assert.eql('10%', printf('%d%%', 10));
assert.eql('+hello+', printf('+%s+', 'hello'));
assert.eql("a", printf("%c", "a"));
assert.eql('"', printf("%c", 34));
assert.eql('$', printf('%c', 36));
assert.eql("10", printf("%d", 10));
```

## Extra features!

### Inspector

The `%O` converter will call [`util.inspect(...)`](http://nodejs.org/api/util.html#util_util_inspect_object_showhidden_depth_colors) at the argument:

``` javascript
assert.eql("Debug: { hello: 'Node', repeat: false }",
  printf('Debug: %O', {hello: 'Node', "repeat": false})
);
assert.eql("Test: { hello: 'Node' }",
  printf('%2$s: %1$O', {"hello": 'Node'}, 'Test')
);
```

**Important:** it's a capital "O", *not* a zero!

Specifying a precision lets you control the depth up to which the object is formatted:

``` javascript
assert.eql("Debug: { depth0: { depth1_: 0, depth1: [Object] } }",
  printf('Debug: %.1O', {depth0: {depth1: {depth2: {depth3: true}}, depth1_: 0}})
);
```

You can use the alternative form flag together with `%O` to disable representation of non-enumerable properties (useful for arrays):

``` javascript
assert.eql("With non-enumerable properties: [ 1, 2, 3, 4, 5, [length]: 5 ]",
  printf('With non-enumerable properties: %O', [1, 2, 3, 4, 5])
);
assert.eql("Without non-enumerable properties: [ 1, 2, 3, 4, 5 ]",
  printf('Without non-enumerable properties: %#O', [1, 2, 3, 4, 5])
);
```

You can use the sign flag together with `%O` to enable colors in `util.inspect`:

``` javascript
assert.eql("With colors: { bar: \u001b[33mtrue\u001b[39m, baz: \u001b[33mfalse\u001b[39m }",
  printf('With colors: %+O', {bar: true, baz: false})
);
```

### Argument mapping

In addition to the old-fashioned `n$`,
you can use **hashes** and **property names**!

``` javascript
assert.eql('Hot Pockets',
  printf('%(temperature)s %(crevace)ss', {
    temperature: 'Hot',
    crevace: 'Pocket'
  })
);
assert.eql('Hot Pockets',
  printf('%2$s %1$ss', 'Pocket', 'Hot')
);
```

### Positionals

Length and precision can now be variable:

``` javascript
assert.eql(' foo', printf('%*s', 'foo', 4));
assert.eql('      3.14', printf('%*.*f', 3.14159265, 10, 2));
assert.eql('000003.142', printf('%0*.*f', 3.14159265, 10, 3));
assert.eql('3.1416    ', printf('%-*.*f', 3.14159265, 10, 4));
```

## Development

Tests are written in [CoffeeScript][coffee] and are executed with [Mocha][mocha]. To use it, simple run `npm install`, it will install Mocha and its dependencies in your project's `node_modules` directory followed by `npm test`.

To run the tests:

```bash
npm install
npm test
```

The test suite is run online with [Travis][travis] against the versions 6, 7, 8 and 9 of Node.js.

## Contributors

*   David Worms <https://github.com/wdavidw>
*   Aluísio Augusto Silva Gonçalves <https://github.com/AluisioASG>
*   Xavier Mendez <https://github.com/jmendeth>
*   LLeo <https://github.com/lleo>
*   Derrell Lipman <https://github.com/derrell>

The project is sponsored by [Adaltas](https://www.adaltas.com) based in Paris, France. Adaltas offers support and consulting on distributed systems, big data and open source.

[travis]: https://travis-ci.org "Continuous Integration system"
[mocha]: http://mochajs.org/ "The Mocha test framework"
[coffee]: http://coffeescript.org/
