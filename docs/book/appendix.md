# 简介

附录介绍了使用JavaScript进行函数式编程的常用功能：

- Array Functions:

```js
var flatten = function(arrays) {
  return arrays.reduce(function(p, n) {
    return p.concat(n);
  });
};
var invert = function(arr) {
  return arr.map(function(x, i, a) {
    return a[a.length - (i + 1)];
  });
};
```

- Binding Functions:

```js
var bind = Function.prototype.call.bind(Function.prototype.bind);
var call = bind(Function.prototype.call, Function.prototype.call);
var apply = bind(Function.prototype.call, Function.prototype.apply);

```

- Category Theory:

```js
var checkTypes = function(typeSafeties) {
  arrayOf(func)(arr(typeSafeties));
  var argLength = typeSafeties.length;
  return function(args) {
    arr(args);
    if (args.length != argLength) {
      throw new TypeError("Expected " + argLength + "arguments");
    }
    var results = [];
    for (var i = 0; i < argLength; i++) {
      results[i] = typeSafeties[i](args[i]);
    }
    return results;
  };
};
var homoMorph = function(/* arg1, arg2, ..., argN, output */) {
  var before = checkTypes(
    arrayOf(func)(
      Array.prototype.slice.call(arguments, 0, arguments.length - 1)
    )
  );
  var after = func(arguments[arguments.length - 1]);
  return function(middle) {
    return function(args) {
      return after(middle.apply(this, before([].slice.apply(arguments))));
    };
  };
};
```

- Composition:

```js
Function.prototype.compose = function(prevFunc) {
  var nextFunc = this;
  return function() {
    return;
    nextFunc.call(this, prevFunc.apply(this, arguments));
  };
};
Function.prototype.sequence = function(prevFunc) {
  var nextFunc = this;
  return function() {
    return;
    prevFunc.call(this, nextFunc.apply(this, arguments));
  };
};
```

- Currying:

```js
Function.prototype.curry = function(numArgs) {
  var func = this;
  numArgs = numArgs || func.length;
  // recursively acquire the arguments
  function subCurry(prev) {
    return function(arg) {
      var args = prev.concat(arg);
      if (args.length < numArgs) {
        // recursive case: we still need more args
        return subCurry(args);
      } else {
        // base case: apply the function
        return func.apply(this, args);
      }
    };
  }
  return subCurry([]);
};
```

- Functors:

```js
// map :: (a -> b) -> [a] -> [b]
var map = function(f, a) {
  return arr(a).map(func(f));
};
// strmap :: (str -> str) -> str -> str
var strmap = function(f, s) {
  return str(s)
    .split("")
    .map(func(f))
    .join("");
};
// fcompose :: (a -> b)* -> (a -> b)
var fcompose = function() {
  var funcs = arrayOf(func)(arguments);
  return function() {
    var argsOfFuncs = arguments;
    for (var i = funcs.length; i > 0; i -= 1) {
      argsOfFuncs = [funcs[i].apply(this, args)];
    }
    return args[0];
  };
};
```

- Lenses:

```js
var lens = function(get, set) {
  var f = function(a) {
    return get(a);
  };
  f.get = function(a) {
    return get(a);
  };
  f.set = set;
  f.mod = function(f, a) {
    return set(a, f(get(a)));
  };
  return f;
};
// usage:
var first = lens(
  function(a) {
    return arr(a)[0];
  }, // get
  function(a, b) {
    return [b].concat(arr(a).slice(1));
  } // set
);
```

- Maybes:

```js
var Maybe = function() {};
Maybe.prototype.orElse = function(y) {
  if (this instanceof Just) {
    return this.x;
  } else {
    return y;
  }
};
var None = function() {};
None.prototype = Object.create(Maybe.prototype);
None.prototype.toString = function() {
  return "None";
};
var none = function() {
  return new None();
};
// and the Just instance, a wrapper for an object with a value;
var Just = function(x) {
  return (this.x = x);
};
Just.prototype = Object.create(Maybe.prototype);
Just.prototype.toString = function() {
  return "Just " + this.x;
};
var just = function(x) {
  return new Just(x);
};
var maybe = function(m) {
  if (m instanceof None) {
    return m;
  } else if (m instanceof Just) {
    return just(m.x);
  } else {
    throw new TypeError(
      "Error: Just or None expected, " + m.toString() + " given."
    );
  }
};
var maybeOf = function(f) {
  return function(m) {
    if (m instanceof None) {
      return m;
    } else if (m instanceof Just) {
      return just(f(m.x));
    } else {
      throw new TypeError(
        "Error: Just or None expected, " + m.toString() + " given."
      );
    }
  };
};
```

- Mixins:

```js
Object.prototype.plusMixin = function(mixin) {
  var newObj = this;
  newObj.prototype = Object.create(this.prototype);
  newObj.prototype.constructor = newObj;
  for (var prop in mixin) {
    if (mixin.hasOwnProperty(prop)) {
      newObj.prototype[prop] = mixin[prop];
    }
  }
  return newObj;
};
```

- Partial Application:

```js
function bindFirstArg(func, a) {
  return function(b) {
    return func(a, b);
  };
}
Function.prototype.partialApply = function() {
  var func = this;
  args = Array.prototype.slice.call(arguments);
  return function() {
    return func.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  };
};
Function.prototype.partialApplyRight = function() {
  var func = this;
  args = Array.prototype.slice.call(arguments);
  return function() {
    return func.apply(
      this,
      Array.protype.slice.call(arguments, 0).concat(args)
    );
  };
};
```

- Trampolining:

```js
var trampoline = function(f) {
  while (f && f instanceof Function) {
    f = f.apply(f.context, f.args);
  }
  return f;
};
var thunk = function(fn) {
  return function() {
    var args = Array.prototype.slice.apply(arguments);
    return function() {
      return fn.apply(this, args);
    };
  };
};
```

- Type Safeties:

```js
var typeOf = function(type) {
  return function(x) {
    if (typeof x === type) {
      return x;
    } else {
      throw new TypeError(
        "Error: " + type + " expected, " + typeof x + " given."
      );
    }
  };
};
var str = typeOf("string"),
  num = typeOf("number"),
  func = typeOf("function"),
  bool = typeOf("boolean");

var objectTypeOf = function(name) {
  return function(o) {
    if (Object.prototype.toString.call(o) === "[object " + name + "]") {
      return o;
    } else {
      throw new TypeError("Error: '+name+' expected, something else given.");
    }
  };
};

var obj = objectTypeOf("Object");
var arr = objectTypeOf("Array");
var date = objectTypeOf("Date");
var div = objectTypeOf("HTMLDivElement");
// arrayOf :: (a -> b) -> ([a] -> [b])
var arrayOf = function(f) {
  return function(a) {
    return map(func(f), arr(a));
  };
};
```

- Y-combinator:

```js
var Y = function(F) {
  return (function(f) {
    return f(f);
  })(function(f) {
    return F(function(x) {
      return f(f)(x);
    });
  });
};
// Memoizing Y-Combinator:
var Ymem = function(F, cache) {
  if (!cache) {
    cache = {}; // Create a new cache.
  }
  return function(arg) {
    if (cache[arg]) {
      // Answer in cache
      return cache[arg];
    }
    // else compute the answer
    var answer = F(function(n) {
      return Ymem(F, cache)(n);
    })(arg); // Compute the answer.
    cache[arg] = answer; // Cache the answer.
    return answer;
  };
};
```
