
<pre>
            _       _    __ 
           (_)     | |  / _|
 _ __  _ __ _ _ __ | |_| |_ 
| '_ \| '__| | '_ \| __|  _|
| |_) | |  | | | | | |_| |  
| .__/|_|  |_|_| |_|\__|_|  
| |                         
|_| 
</pre>

A complete implementation of `sprintf` and `printf` for Node. The code is 
strongly inspired by the one availabe in the [Dojo Toolkit][dojo].

Usage
-----

sprintf

``` javascript
	var printf = require('printf');
	var string = printf(format, args...);
```

printf

``` javascript
	var printf = require('printf');
	printf(write_stream, format, args...);
```

Exemples
--------

``` javascript
	var printf = require('printf');
```
	
Flag: (space)

``` javascript
	assert.eql("  -42", printf("% 5d", -42));
```

Flag: +

``` javascript
	assert.eql("  +42", printf("%+5d", 42));
```

Flag: 0

``` javascript
	assert.eql("00042", printf("%05d", 42));
```

Flag: -

``` javascript
	assert.eql("42   ", printf("%-5d", 42));
```

Precision

``` javascript
	assert.eql("42.90", printf("%.2f", 42.8952));
	assert.eql("042.90", printf("%06.2f", 42.8952));
```

Bases

``` javascript
	assert.eql("\x7f", printf("%c", 0x7f));
```

Mapping

``` javascript
	assert.eql("Hot Pocket", printf("%1$s %2$s", "Hot", "Pocket"));
	assert.eql("Hot Pocket", printf("%(temperature)s %(crevace)s", {
		temperature: "Hot",
		crevace: "Pocket"
	}));
```

Positionals

``` javascript
	assert.eql(" foo", printf("%*s", "foo", 4));
	assert.eql("      3.14", printf("%*.*f", 3.14159265, 10, 2));
	assert.eql("0000003.14", printf("%0*.*f", 3.14159265, 10, 2));
	assert.eql("3.14      ", printf("%-*.*f", 3.14159265, 10, 2));
```

Miscellaneous

``` javascript
    assert.eql("+hello+", printf("+%s+", "hello"));
	assert.eql("+10+", printf("+%d+", 10));
	assert.eql("a", printf("%c", "a"));
	assert.eql('"', printf("%c", 34));
	assert.eql('$', printf("%c", 36));
	assert.eql("10", printf("%d", 10));
```

Human readable output with `util.inspect`

``` javascript
    assert.eql("Debug: { hello: 'Node' }", prinf('Debug: %O', {hello: 'Node'});
```

Installing
----------

Via [npm](http://github.com/isaacs/npm):

```
    $ npm install printf
```

Via git (or downloaded tarball):

```
    $ git clone http://github.com/wdavidw/node-printf.git
```

Test
----

```
	expresso
```


[dojo]: http://www.dojotoolkit.org  "The Dojo Toolkit"

