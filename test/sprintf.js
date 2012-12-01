var assert = require('assert'),
  printf = require('../lib/printf');

module.exports = {
  'Specifier: b': function(){
    assert.eql( "1111011", printf("%b", 123)  );
  },
  'Flag: (space)': function(){
    assert.eql(" 42", printf("% d", 42));
    assert.eql("-42", printf("% d", -42));
    assert.eql("   42", printf("% 5d", 42));
    assert.eql("  -42", printf("% 5d", -42));
    assert.eql("       42", printf("% 15d", 42));
    assert.eql("      -42", printf("% 15d", -42));
  },
  'Flag: +': function(){
    assert.eql("+42", printf("%+d", 42));
    assert.eql("-42", printf("%+d", -42));
    assert.eql("  +42", printf("%+5d", 42));
    assert.eql("  -42", printf("%+5d", -42));
    assert.eql("      +42", printf("%+15d", 42));
    assert.eql("      -42", printf("%+15d", -42));
  },
  'Flag: 0': function(){
    assert.eql("42", printf("%0d", 42));
    assert.eql("-42", printf("%0d", -42));
    assert.eql("00042", printf("%05d", 42));
    assert.eql("-00042", printf("%05d", -42));
    assert.eql("000000000000042", printf("%015d", 42));
    assert.eql("-000000000000042", printf("%015d", -42));
  },
  'Flag: -': function(){
    assert.eql("42", printf("%-d", 42));
    assert.eql("-42", printf("%-d", -42));
    assert.eql("42   ", printf("%-5d", 42));
    assert.eql("-42  ", printf("%-5d", -42));
    assert.eql("42       ", printf("%-15d", 42));
    assert.eql("-42      ", printf("%-15d", -42));

    assert.eql("42", printf("%-0d", 42));
    assert.eql("-42", printf("%-0d", -42));
    assert.eql("42   ", printf("%-05d", 42));
    assert.eql("-42  ", printf("%-05d", -42));
    assert.eql("42       ", printf("%-015d", 42));
    assert.eql("-42      ", printf("%-015d", -42));

    assert.eql("42", printf("%0-d", 42));
    assert.eql("-42", printf("%0-d", -42));
    assert.eql("42   ", printf("%0-5d", 42));
    assert.eql("-42  ", printf("%0-5d", -42));
    assert.eql("42       ", printf("%0-15d", 42));
    assert.eql("-42      ", printf("%0-15d", -42));
  },
  'Precision': function(){
    assert.eql("42", printf("%d", 42.8952));
    assert.eql("42", printf("%.2d", 42.8952)); // Note: the %d format is an int
    assert.eql("42", printf("%.2i", 42.8952));
    assert.eql("42.90", printf("%.2f", 42.8952));
    assert.eql("42.90", printf("%.2F", 42.8952));
    assert.eql("42.8952000000", printf("%.10f", 42.8952));
    assert.eql("42.90", printf("%1.2f", 42.8952));
    assert.eql(" 42.90", printf("%6.2f", 42.8952));
    assert.eql("042.90", printf("%06.2f", 42.8952));
    assert.eql("+42.90", printf("%+6.2f", 42.8952));
    assert.eql("42.8952000000", printf("%5.10f", 42.8952));
  },
  'Bases': function(){
    assert.eql("\x7f", printf("%c", 0x7f));

    var error = false;
    try {
      printf("%c", -100);
    }catch(e){
      assert.eql("invalid character code passed to %c in printf", e.message);
      error = true;
    }
    assert.ok(error);

    error = false;
    try {
      printf("%c", 0x200000);
    }catch(e){
      assert.eql("invalid character code passed to %c in printf", e.message);
      error = true;
    }
    assert.ok(error);
  },
  'Mapping': function(){
    // %1$s format
    assert.eql("%1$", printf("%1$"));
    assert.eql("%0$s", printf("%0$s"));
    assert.eql("Hot Pocket", printf("%1$s %2$s", "Hot", "Pocket"));
    assert.eql("12.0 Hot Pockets", printf("%1$.1f %2$s %3$ss", 12, "Hot", "Pocket"));
    assert.eql(" 42", printf("%1$*.f", "42", 3));

    error = false;
    try {
      printf("%2$*s", "Hot Pocket");
    }catch(e){
      assert.eql("got 1 printf arguments, insufficient for '%2$*s'", e.message);
      error = true;
    }
    assert.ok(error);

    // %(map)s format
    assert.eql("%(foo", printf("%(foo", {}));
    assert.eql("Hot Pocket", printf("%(temperature)s %(crevace)s", {
      temperature: "Hot",
      crevace: "Pocket"
    }));
    assert.eql("12.0 Hot Pockets", printf("%(quantity).1f %(temperature)s %(crevace)ss", {
      quantity: 12,
      temperature: "Hot",
      crevace: "Pocket"
    }));

    var error = false;
    try {
      printf("%(foo)s", 42);
    }catch(e){
      assert.eql("format requires a mapping", e.message);
      error = true;
    }
    assert.ok(error);

    error = false;
    try {
      printf("%(foo)s %(bar)s", "foo", 42);
    }catch(e){
      assert.eql("format requires a mapping", e.message);
      error = true;
    }
    assert.ok(error);

    error = false;
    try {
      printf("%(foo)*s", {
        foo: "Hot Pocket"
      });
    }catch(e){
      assert.eql("* width not supported in mapped formats", e.message);
      error = true;
    }
    assert.ok(error);
  },
  'Positionals': function(){
    assert.eql(" foo", printf("%*s", "foo", 4));
    assert.eql("    3.14", printf("%*.*f", 3.14159265, 10, 2));
    assert.eql("0000003.14", printf("%0*.*f", 3.14159265, 10, 2));
    assert.eql("3.14    ", printf("%-*.*f", 3.14159265, 10, 2));

    var error = false;
    try {
      printf("%*s", "foo", "bar");
    }catch(e){
      assert.eql("the argument for * width at position 2 is not a number in %*s", e.message);
      error = true;
    }
    assert.ok(error);

    error = false;
    try {
      printf("%10.*f", "foo", 42);
    }catch(e){
      assert.eql("format argument 'foo' not a float; parseFloat returned NaN", e.message);
      error = true;
    }
    assert.ok(error);
  },
  'vs. Formatter': function(){
    for(var i = 0; i < 1000; i++){
      printf("%d %s Pockets", i, "Hot");
    }
  },
  'Formatter': function(){
    var str = new printf.Formatter("%d %s Pockets");
    for(var i = 0; i < 1000; i++){
      str.format(i, "Hot");
    }
  },
  'Miscellaneous': function(){
    assert.eql("+hello+", printf("+%s+", "hello"));
    assert.eql("+10+", printf("+%d+", 10));
    assert.eql("a", printf("%c", "a"));
    assert.eql('"', printf("%c", 34));
    assert.eql('$', printf("%c", 36));
    assert.eql("10", printf("%d", 10));

    var error = false;
    try {
      printf("%s%s", 42);
    }catch(e){
      assert.eql("got 1 printf arguments, insufficient for '%s%s'", e.message);
      error = true;
    }
    assert.ok(error);

    error = false;
    try {
      printf("%c");
    }catch(e){
      assert.eql("got 0 printf arguments, insufficient for '%c'", e.message);
      error = true;
    }
    assert.ok(error);

    assert.eql("%10", printf("%10", 42));
  },
  'Escape': function(){
    assert.eql("10 %", printf("%d %%", 10));
  },
  'Output': function(){
    assert.eql('Debug { hello: \'Node\' }', printf("Debug %O", {hello: 'Node'}));
  }
};
