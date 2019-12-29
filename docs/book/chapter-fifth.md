# 简介

托马斯·沃森（Thomas Watson）曾有一句名言：“我认为世界上可能有五台电脑的市场。”。那是在1948年。那时，每个人都知道计算机只能用于两件事：数学和工程学。即使是科技界最有头脑的人也无法预测，有一天，计算机将能够把西班牙语翻译成英语，或者模拟整个天气系统。当时，最快的机器是IBM的SSEC，每秒50次乘法，多个用户终端共享一个处理器。晶体管改变了一切，但科技公司的远见者仍然没有达到目标。肯·奥尔森（Ken Olson）在1977年做出了另一个著名的愚蠢预测，当时他说“没有理由任何人想要在家里有一台电脑”。

当今，计算机不仅仅是为科学家和工程师服务的，70年前，认为机器不仅仅能做数学的想法根本不是直觉。沃森没有意识到计算机是如何改变一个社会的，他也没有意识到数学的变革和进化的力量。

但并不是每个人都忽视了计算机和数学的潜力。John McCarthy在1958年发明了Lisp，这是一种革命性的基于算法的语言，开创了计算的新纪元。从一开始，Lisp就在使用抽象层-编译器、解释器、虚拟化-来推动计算机从核心数学机器发展到今天的发展方面发挥了重要作用。

Lisp衍生的Scheme是JavaScript的直接祖先。现在我们又回到了原点。如果计算机的核心是只做数学的机器，那么基于数学的编程范例理所当然会出类拔萃。

这里使用的术语“数学”不是用来描述计算机显然能做的“数字运算”，而是用来描述离散数学：研究离散的数学结构，如逻辑中的语句或计算机语言的指令。通过将代码视为一种离散的数学结构，我们可以将数学中的概念和思想应用到代码中。这就是函数式编程在人工智能、图形搜索、模式识别和计算机科学中的其他重大挑战中发挥如此重要作用的原因。

在本章中，我们将试验其中一些概念及其在日常编程挑战中的应用。它们将包括：

- Category theory 范畴论
- Morphisms 态射
- Functors 函子
- Maybes
- Promises
- lenses 状态管理（依赖）[原理](https://blog.csdn.net/weixin_34032792/article/details/87963097)
- Function composition 函数组合

有了这些概念，才能够非常容易和安全地编写函数库和api。我们将从解释范畴理论到用JavaScript正式实现它。

## 范畴论

范畴理论是赋予功能构成权力的理论概念。（此处有删减，举例：[让你烤个面包](https://blog.csdn.net/weixin_43801661/article/details/84670359)。）

### 范畴论简述

范畴论不是一个很难的概念。 它在数学上的位置足以填满整个研究生水平的大学课程，但是在计算机编程中的位置可以很容易地总结出来。

爱因斯坦曾经说过，“如果你不能向一个6岁的孩子解释它，那么你自己也不清楚”。因此，本着向6岁儿童解释的精神，范畴理论只是把这些点联系起来。尽管它可能过于简化范畴理论，但它确实很好地以一种直截了当的方式解释了我们需要知道的东西。

首先你需要知道一些术语。类别只是具有相同类型的集合。在JavaScript中，它们是数组或对象，包含显式声明为数字、字符串、布尔值、日期、节点等的变量。态射是纯函数，当给定一组特定的输入时，总是返回相同的输出。同态操作仅限于一个类别，而多态操作可以操作多个类别。例如，同态函数乘法适用于数字类型，但多态函数加法也可以对字符串起作用。

![img](https://blog.ahthw.com/wp-content/uploads/2019/12/f8b.png)

下图显示了三个类别-A、B和C-以及两个态射-ƒ和ɡ。
范畴理论告诉我们，当我们有两个态射，其中第一个态射的范畴是另一个态射的期望输入时，它们可以组成如下：

![img](https://blog.ahthw.com/wp-content/uploads/2019/12/1577544451533.jpg)

ƒog 符号是同态ƒ和g的组合。现在我们只需要把点连接起来。

![img](https://blog.ahthw.com/wp-content/uploads/2019/12/1577545148359.jpg)

只是连接点而已，仅此而已。

## 类型安全

让我们把这些点连起来。包含两个内容：

1. Objects对象（在JavaScript中，types）。
2. Morphisms态射（在JavaScript中，仅适用于纯函数的类型）。

这些是数学家给范畴理论的术语，因此我们的JavaScript术语中有一些不幸的术语重载。范畴理论中的对象更像是具有显式数据类型的变量，而不是JavaScript定义的对象属性和值集合。形态只是使用这些类型的纯函数。

因此，将范畴理论的思想应用于JavaScript很容易。在JavaScript中使用范畴理论意味着在每个范畴中使用一种特定的数据类型。数据类型包括数字、字符串、数组、日期、对象、布尔值等。但是，由于JavaScript中没有严格的类型系统，可能会出错。所以我们必须自己实现方法来确保数据正确。

JavaScript中有四种基本数据类型：数字、字符串、布尔值和函数。我们可以创建返回变量或抛出错误的类型安全函数。

```js
var str = function(s) {
  if (typeof s === "string") {
    return s;
  } else {
    throw new TypeError("Error: String expected, " + typeof s + "given.");
  }
};
var num = function(n) {
  if (typeof n === "number") {
    return n;
  } else {
    throw new TypeError("Error: Number expected, " + typeof n + "given.");
  }
};
var bool = function(b) {
  if (typeof b === "boolean") {
    return b;
  } else {
    throw new TypeError("Error: Boolean expected, " + typeof b + "given.");
  }
};
var func = function(f) {
  if (typeof f === "function") {
    return f;
  } else {
    throw new TypeError("Error: Function expected, " + typeof f + " given.");
  }
};
```

虽然以上有很多重复的代码，但它们的功满足需要。 相反，我们可以创建一个函数，该函数返回另一个函数，即类型安全函数。

```js
var typeOf = function(type) {
  return function(x) {
    if (typeof x === type) {
      return x;
    } else {
      throw new TypeError(
        "Error: " + type + " expected, " + typeof x + "given."
      );
    }
  };
};
var str = typeOf("string"),
  num = typeOf("number"),
  func = typeOf("function"),
  bool = typeOf("boolean");
```

我们使用它们来确保我们的函数按预期运行。

```js
// unprotected method:
var x = "24";
x + 1; // will return '241', not 25
// protected method
// plusplus :: Int -> Int
function plusplus(n) {
  return num(n) + 1;
}
plusplus(x); // throws error, preferred over unexpected output
```

让我们看一个更重要的例子。 如果要检查由JavaScript函数Date.parse()返回的Unix时间戳的长度，不是字符串，而是数字，则必须使用str()函数。

```js
// timestampLength :: String -> Int
function timestampLength(t) {
  return num(str(t).length);
}
timestampLength(Date.parse("12/31/1999")); // throws error
timestampLength(Date.parse("12/31/1999").toString()); // returns 12
```

像这样显式地将一种类型转换为另一种类型（或同一类型）的函数称为态射。这满足了范畴论的态射公理。这些通过类型安全性函数的强制类型声明以及使用它们的态射是我们在JavaScript中表示类别概念所需要的一切。

## 对象标识

还有一种重要的数据类型：对象。

```js
var obj = typeOf("object");
obj(123); // throws error
obj({ x: "a" }); // returns {x:'a'}
```

但是，对象是不同的。它们可以继承。并非原语的所有内容（数字，字符串，布尔值和函数）都是一个对象，包括数组，日期，元素等。

我们无法从`typeof`关键字中知道某个对象是什么类型的，比如从typeof关键字中知道JavaScript“object”是什么子类型，所以我们必须想其它办法。对象有一个toString()函数，我们可以的劫持它。

```js
var obj = function(o) {
  if (Object.prototype.toString.call(o) === "[object Object]") {
    return o;
  } else {
    throw new TypeError("Error: Object expected, something else given.");
  }
};
```

在所有对象都存在的情况下，我们应该实现一些代码复用。

```js
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
```

以上对于我们的下一个主题：函子将非常有用。

## 函子

态射是类型之间的映射，函子是类别之间的映射。 可以将它们视为将值从容器中取出，变形然后再将其放入新容器中的函数。 第一个输入是该类型的词素，第二个输入是容器。

> 函子的类型签名如：// myFunctor ::（a-> b）-> f a-> f b 这就是说，“给我一个接受a并返回b和包含a(s)的box的函数，然后我将返回包含b(s)的box。

### 创建函子

事实证明，我们已经有一个函子：map()。 它获取容器，数组中的值，并对其应用函数。

```js
[1, 4, 9].map(Math.sqrt); // Returns: [1, 2, 3]
```

但是，我们需要将其编写为全局函数，而不是数组对象的方法。 这将使我们以后可以编写更干净，更安全的代码。

```js
// map :: (a -> b) -> [a] -> [b]
var map = function(f, a) {
  return arr(a).map(func(f));
};
```

这个例子看起来像是一个设计的包装器，因为我们只是搭载在map()函数上。但这是有目的的。它为其他类型的映射提供模板。

```js
// strmap :: (str -> str) -> str -> str
var strmap = function(f, s) {
return str(s).split('').map(func(f)).join('');
}
// MyObject#map :: (myValue -> a) -> a
MyObject.prototype.map(f{
  return func(f)(this.myValue);
}
```

### 数组和函子

数组是在函数式JavaScript中处理数据的首选方法。

有没有一种更简单的方法来创建已经分配给态射的函子？是的，它叫arrayOf。当你传入一个期望整数的态射并返回一个数组时，你得到一个期望整数数组的态射并返回一个数组数组。

它本身不是函子，但它使我们能够根据态射来创建函子。

```js
// arrayOf :: (a -> b) -> ([a] -> [b])
var arrayOf = function(f) {
  return function(a) {
    return map(func(f), arr(a));
  };
};
```

这是通过使用态射来创建函子的方法：

```js
var plusplusall = arrayOf(plusplus); // plusplus is our morphism
console.log(plusplusall([1, 2, 3])); // returns [2,3,4]
console.log(plusplusall([1, "2", 3])); // error is thrown
```

arrayOf函数的有趣之处在于它也可以处理类型安全性。 当为字符串传递类型安全函数时，将返回字符串数组的类型安全函数。 类型安全性像身份函数态射一样对待。 这为数组包含所有正确的类型提供了方式。

## 回顾函数组合

函数是我们可以为其创建函子的另一种原语。 该函子称为`fcompose`。我们将函子定义为从容器中获取值并对其应用函数的对象。 当该容器是一个函数时，我们只需调用它即可获取其内部值。

我们已经知道什么是函数组合，但是让我们看看它们在范畴理论驱动的环境中可以做什么。

函数组合是关联的。如果你的高中代数老师和我一样，教你什么是属性，而不是它能做什么。实际上，组合是关联的属性所能做的事情。

![img](https://blog.ahthw.com/wp-content/uploads/2019/12/WX20191229-230353@2x.png)

我们可以进行任何内部组合，无论如何组合。 请勿将此与可交换属性混淆。ƒ o g并不总是等于g o ƒ。换言之，字符串的第一个单词的反义词与字符串的第一个单词的反义词不同。

这一切意味着，只要每个函数的输入来自前一个函数的输出，那么应用哪个函数和以什么顺序无关紧要。但是，如果右边的函数依赖左边的函数，那么就不能只有一个求值顺序吗？从左到右？但是如果将其封装起来，那么我们可以把控它，不管我们感觉如何。这就是在JavaScript中惰性计算的原因。

![img](https://blog.ahthw.com/wp-content/uploads/2019/12/8027-86964e9a39d1.png)

让我们重写函数组成，而不是作为函数原型的扩展，而是作为一个独立的函数，它将使我们受益匪浅。 基本形式如下：

```js
var fcompose = function(f, g) {
  return function() {
    return f.call(this, g.apply(this, arguments));
  };
};
```

但我们需要它来处理任意数量的实参。

```js
var fcompose = function() {
  // first make sure all arguments are functions
  var funcs = arrayOf(func)(arguments);
  // return a function that applies all the functions
  return function() {
    var argsOfFuncs = arguments;
    for (var i = funcs.length; i > 0; i -= 1) {
      argsOfFuncs = [funcs[i].apply(this, args)];
    }
    return args[0];
  };
};
// example:
var f = fcompose(negate, square, mult2, add1);
f(2); // Returns: -36
```

既然我们已经封装了这些函数，我们就可以控制它们了。我们可以重写compose函数，以便每个函数接受另一个函数作为输入，存储它，并返回一个执行相同操作的对象。我们可以接受源中每个元素的一个数组，执行组合的所有操作（每个map()、filter()等等，组合在一起），最后将结果存储到一个新数组中，而不是接受一个数组作为输入，对它执行一些操作，然后为每个操作返回一个新数组。这是通过函数组合的惰性求值。没有理由在这里重新发明轮子。许多库都很好地实现了这个概念，包括Lazy.js、Bacon.js和wu.js库。

由于采用了这种不同的模型，我们可以做更多的事情：异步迭代，异步事件处理，惰性求值，甚至自动并行化。

`自动并行化？在计算机科学界有一个说法：不可能。但这真的不可能吗？摩尔定律的下一个进化飞跃可能是一个编译器，它可以为我们并行化代码，函数组合也可以吗？不，这样不太管用。JavaScript引擎实际上是在进行并行化，不是自动的，而是经过深思熟虑的代码。Compose只是让引擎有机会将其拆分为并行进程。但这本身就很酷。`

## Monads

Monad是可帮助您编写功能的工具。

与基本类型一样，monad是可以用作函子“触及”的容器的结构。函子抓取数据，对其进行处理，将其放入一个新的monad中，然后返回。

我们将关注三个monad：

- Maybes
- Promises
- Lenses

所以除了数组（map）和函数（compose），我们还有五个函子（map，compose，may，promise和lens）。这些只是许多其他函子和单子中的一部分。

### Maybes

Maybes允许我们优雅地处理可能为空并具有默认值的数据。maybe是一个变量，它要么有一些值要么没有，对调用者来说无关紧要。

就其本身而言，这似乎没什么大不了的。大家都知道，使用if-else语句很容易完成空检查：

```js
if (getUsername() == null) {
  username = "Anonymous";
} else {
  username = getUsername();
}
```

但是在函数式编程中，我们脱离了逐行处理方式，而是使用函数和数据的管道。如果我们必须在中间断开链来检查值是否存在，我们就必须创建临时变量并编写更多代码。Maybes是帮助我们保持逻辑在管道中流动的工具。

要实现Maybes，我们首先需要创建一些构造函数。

```js
// the Maybe monad constructor, empty for now
var Maybe = function() {};
// the None instance, a wrapper for an object with no value
var None = function() {};
None.prototype = Object.create(Maybe.prototype);
None.prototype.toString = function() {
  return "None";
};
// now we can write the `none` function
// saves us from having to write `new None()` all the time
var none = function() {
  return new None();
};
// and the Just instance, a wrapper for an object with a value
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
```

我们可以编写maybe函数。它返回一个新函数，该函数要么不返回任何内容，要么返回maybe。

它是一个函子：

```js
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
```

我们也可以像创建数组一样创建函子生成器:

```js
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

所以Maybe是monad，maybe是函子，maybeOf返回已经分配给态射的函子。我们需要向Maybe monad对象添加一个方法，帮助我们更直观地使用它。

```js
Maybe.prototype.orElse = function(y) {
  if (this instanceof Just) {
    return this.x;
  } else {
    return y;
  }
};
```

在其原型中，maybes可以直接使用。

```js
maybe(just(123)).x; // Returns 123
maybeOf(plusplus)(just(123)).x; // Returns 124
maybe(plusplus)(none()).orElse("none"); // returns 'none'
```

任何返回一个随后被执行的方法的操作都非常复杂。所以我们可以通过调用curry()函数使它更简洁一些。

```js
maybePlusPlus = maybeOf.curry()(plusplus);
maybePlusPlus(just(123)).x; // returns 123
maybePlusPlus(none()).orElse("none"); // returns none
```

当抽象出直接调用none()和just()函数时，maybes的真正强大就会显露。我们将使用一个示例对象User来实现这一点，该对象使用mays作为用户名。

```js
var User = function() {
  this.username = none(); // initially set to `none`
};
User.prototype.setUsername = function(name) {
  this.username = just(str(name)); // it's now a `just
};
User.prototype.getUsernameMaybe = function() {
  var usernameMaybe = maybeOf.curry()(str);
  return usernameMaybe(this.username).orElse("anonymous");
};
var user = new User();
user.getUsernameMaybe(); // Returns 'anonymous'
user.setUsername("Laura");
user.getUsernameMaybe(); // Returns 'Laura'
```

我们有了一个强大而安全的方法来定义默认值。记住这个User对象，因为我们将在本章后面使用它。

## Promises

`承诺的本质是它们不受环境变化的影响。-Frank Underwood，纸牌屋`

在函数式编程中，我们经常使用管道和数据流：函数链，其中每个函数产生的数据类型将被下一个消耗。但是，其中许多函数是异步的：readFile、events、AJAX等。与其使用连续传递样式和深度嵌套的回调，不如如何修改这些函数的返回类型以指示结果？通过将它们包装在promises中。

Promises就像是回调的功能等价物。显然，回调不具有全部功能，因为如果有多个函数正在改变相同的数据，则可能存在争用条件和错误。Promises solve能解决这个问题。

你应该用Promises来解决它：

```js
fs.readFile("file.json", function(err, val) {
  if (err) {
    console.error("unable to read file");
  } else {
    try {
      val = JSON.parse(val);
      console.log(val.success);
    } catch (e) {
      console.error("invalid json in file");
    }
  }
});
```

使用以下代码：

```js
fs.readFileAsync("file.json")
  .then(JSON.parse)
  .then(function(val) {
    console.log(val.success);
  })
  .catch(SyntaxError, function(e) {
    console.error("invalid json in file");
  })
  .catch(function(e) {
    console.error("unable to read file");
  });
```

上面的代码来自[bluebird](https://github.com/petkaantonov/bluebird)的README：一个功能齐全的Promises/a+实现，性能非常好。Promises/A+是用JavaScript实现Promises的规范。(当时考虑到JavaScript社区目前的争论，我们将把实现留给Promises/A+团队，因为它比maybes复杂得多。)

但这里有一个实现的片段：

```js
// the Promise monad
var Promise = require("bluebird");
// the promise functor
var promise = function(fn, receiver) {
  return function() {
    var slice = Array.prototype.slice,
      args = slice.call(arguments, 0, fn.length - 1),
      promise = new Promise();
    args.push(function() {
      var results = slice.call(arguments),
        error = results.shift();
      if (error) promise.reject(error);
      else promise.resolve.apply(promise, results);
    });
    fn.apply(receiver, args);
    return promise;
  };
};
```

现在，我们可以使用promise()函数将回调函数转换为返回promises的函数。

```js
var files = ["a.json", "b.json", "c.json"];
readFileAsync = promise(fs.readFile);
var data = files
  .map(function(f) {
    readFileAsync(f).then(JSON.parse);
  })
  .reduce(function(a, b) {
    return $.extend({}, a, b);
  });
```

## Lenses

程序员真正喜欢monad的另一个原因是它们使编写库变得非常容易。为了探索这一点，让我们使用更多的函数来扩展User对象以getting和getting值，但是，我们将使用lenses而不是使用getter和setter。

lenses是一流的getter和setter。它们不仅允许我们获取和设置变量，还允许我们在变量上运行函数。但是，它不是对原始数据进行改变，而是克隆并返回由函数修改的新数据。它们迫使数据是不可变的，这对于安全性和一致性以及库都非常有用。无论应用程序是什么，它们都非常适合优雅的代码，引入额外的数组副本对性能的影响不是很大。

在编写lens()函数之前，让我们看看它是如何工作的。

```js
var first = lens(
  function(a) {
    return arr(a)[0];
  }, // get
  function(a, b) {
    return [b].concat(arr(a).slice(1));
  } // set
);
first([1, 2, 3]); // outputs 1
first.set([1, 2, 3], 5); // outputs [5, 2, 3]
function tenTimes(x) {
  return x * 10;
}
first.modify(tenTimes, [1, 2, 3]); // outputs [10,2,3]
```

这是lens()函数的工作方式。 它返回定义了get，set和mod的defined.函数。 lens()函数本身就是一个函子。

```js
var lens = fuction(get, set) {
  var f = function (a) {
    return get(a)
  };

  f.get = function (a) {return get(a)};
  f.set = set;
  f.mod = function (f, a) {return set(a, f(get(a)))};

  return f;
};
```

我们来举个例子。我们将在前面的示例中扩展User对象。

```js
// userName :: User -> str
var userName = lens(
  function(u) {
    return u.getUsernameMaybe();
  }, // get
  function(u, v) {
    // set
    u.setUsername(v);
    return u.getUsernameMaybe();
  }
);
var bob = new User();
bob.setUsername("Bob");
userName.get(bob); // returns 'Bob'
userName.set(bob, "Bobby"); //return 'Bobby'
userName.get(bob); // returns 'Bobby'
userName.mod(strToUpper, bob); // returns 'BOBBY'
strToUpper.compose(userName.set)(bob, "robert"); // returns "ROBERT";
userName.get(bob); // returns 'robert'
```

## jQuery是一个monad

如果你认为所有这些抽象的关于范畴、函子和单子都没有实际的应用，请考虑一下。 jQuery是流行的JavaScript库，它为使用HTML提供了一个增强的接口，它提供了用于处理HTML的增强接口，它是一个独立的库。

jQuery对象是monad，其方法是函子实际上，它们是一种称为endofunctors的特殊函子。 Endofunctors是返回与输入相同类别的函子，即F :: X->X。每个jQuery方法都接受一个jQuery对象并返回一个jQuery对象，该对象允许方法被链接，并且它们将具有类型签名。jFunc：：jQuery obj->jQuery obj。

这也是jQuery插件框架的功能所在。 如果插件将jQuery对象作为输入并返回一个作为输出，那么可以将其插入链中。

monad是函子“接触”以获取数据的容器。 这样，数据可以由库保护和控制。 jQuery通过其许多方法提供对基础数据（包装的HTML元素集）的访问。

jQuery对象本身是匿名函数调用的结果。

```js
var jQuery = (function () {
  var j = function (selector, context) {
  var jq-obj = new j.fn.init(selector, context);
  return jq-obj;
};

j.fn = j.prototype = {
  init: function (selector, context) {
    if (!selector) {
      return this;
    }
  }
};

j.fn.init.prototype = j.fn;
  return j;
})();
```

在此高度简化的jQuery版本中，它返回定义j对象的函数，该对象实际上只是增强的init构造函数。

```js
var $ = jQuery(); // the function is returned and assigned to `$`
var x = $("#select-me"); // jQuery object is returned
```

就像函子将值从容器中取出一样，jQuery包装HTML元素并提供对它们的访问，而不是直接修改HTML元素。

jQuery并不经常公布这一点，但它有自己的map()方法来将HTML元素对象从包装器中取出。 就像fmap()方法一样，元素被提升，对它们进行某些处理，然后将它们放回容器中。 这就是jQuery运行中的许多后台命令工作原理。

```js
$("li").map(function(index, element) {
  // do something to the element
  return element;
});

```

另一个用于处理HTML元素的库Prototype.js不能像这样工作。Prototype直接通过helpers修改HTML元素。因此，它在JavaScript社区中并没有得到推崇。

## 功能实现

现在是我们正式将范畴理论定义为JavaScript对象的时候了。 类别是对象（类型）和态射（仅对这些类型起作用的函数）。 这是一种非常高级的，完全声明式的编程方式，它可以确保代码极其安全可靠，对于担心并发性和类型安全性的API和库来说，这是完美的。

首先，我们需要一个函数来帮助我们创建态射。 我们将其称为homoMorph（），因为它们将是同态的。 它将返回一个函数，它将返回一个期望传递函数的函数，并根据输入生成该函数的组合。输入是态射接受作为输入并给予作为输出的类型。 就像我们的类型签名一样，即`// morph :: num-> num-> [num]`，只有最后一个是输出。

```js
var homoMorph = function() /* input1, input2,..., inputN, output */
{
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
// now we don't need to add type signature comments
// because now they're built right into the function declaration
add = homoMorph(
  num,
  num,
  num
)(function(a, b) {
  return a + b;
});
add(12, 24); // returns 36
add("a", "b"); // throws error
homoMorph(
  num,
  num,
  num
)(function(a, b) {
  return a + b;
})(18, 24); // returns 42
```

homoMorph()函数非常复杂。 它使用闭包（请参见第2章，函数编程基础）返回一个接受函数并检查其输入和输出值以确保类型安全的函数。 为此，它依赖于一个辅助函数：checkTypes，其定义如下：

```js
var checkTypes = function(typeSafeties) {
  arrayOf(func)(arr(typeSafeties));
  var argLength = typeSafeties.length;
  return function(args) {
    arr(args);
    if (args.length != argLength) {
      throw new TypeError("Expected " + argLength + " arguments");
    }
    var results = [];
    for (var i = 0; i < argLength; i++) {
      results[i] = typeSafeties[i](args[i]);
    }
    return results;
  };
};
```

现在让我们正式定义一些同态（homomorphisms）。

```js
var lensHM = homoMorph(func, func, func)(lens);

var userNameHM = lensHM(
  function(u) {
    return u.getUsernameMaybe();
  }, // get
  function(u, v) {
    // setu.setUsername(v);
    return u.getUsernameMaybe();
  }
);

var strToUpperCase = homoMorph(
  str,
  str
)(function(s) {
  return s.toUpperCase();
});

var morphFirstLetter = homoMorph(
  func,
  str,
  str
)(function(f, s) {
  return f(s[0]).concat(s.slice(1));
});

var capFirstLetter = homoMorph(
  str,
  str
)(function(s) {
  return morphFirstLetter(strToUpperCase, s);
});
```

最后，我们可以综合下。 以下示例包括函数组和，lens，同态性(homomorphisms)等等。

```js
// homomorphic lenses
var bill = new User();
userNameHM.set(bill, "William"); // Returns: 'William'
userNameHM.get(bill); // Returns: 'William'

// compose
var capatolizedUsername = fcompose(capFirstLetter, userNameHM.get);
capatolizedUsername(bill, "bill"); // Returns: 'Bill'

// it's a good idea to use homoMorph on .set and .get too
var getUserName = homoMorph(obj, str)(userNameHM.get);
var setUserName = homoMorph(obj, str, str)(userNameHM.set);
getUserName(bill); // Returns: 'Bill'
setUserName(bill, "Billy"); // Returns: 'Billy'

// now we can rewrite capatolizeUsername with the new setter
capatolizedUsername = fcompose(capFirstLetter, setUserName);
capatolizedUsername(bill, "will"); // Returns: 'Will'
getUserName(bill); // Returns: 'will'
```

以上的代码是非常声明式的，安全的，可靠的。

`代码是声明式的意味着什么？ 在“命令式”编程中，我们编写一系列指令，以告诉机器如何执行所需的操作。 在函数式编程中，我们描述值之间的关系，这些值告诉机器我们要计算的内容，并且机器找出指令序列来实现它。 函数式编程是声明性的。`

整个库和api都可以这样构造，这样程序员就可以自由地编写代码，而不必担心并发性和类型安全，因为这些担心是在后台处理的。

## 小结

大约每2000人中就有一人患有[通感症](https://baike.baidu.com/item/%E9%80%9A%E6%84%9F%E7%97%87/1079189)，比如说他们在吃好吃的东西的时候，会听到美妙的音乐，听到美妙的音乐会闻到花的香气，绿色可能在他们感觉里是可爱的小熊，难过的情绪对他们来说可能是白色的绵羊。然而，还有一种更为罕见的形式，即句子和段落与品味和感受相关联。

对这些人来说，他们不会逐字逐句地解释。他们查看整个页面/文档/程序，了解它的味道不是在嘴里而是在头脑中。然后他们把文本的各个部分像拼图一样拼在一起。

这就是编写完全声明性代码的方式：描述值之间关系的代码，这些值告诉机器我们希望它计算什么。 程序的各个部分不是按行顺序排列的指令。 通感学也许能够自然地做到这一点，但是只要稍加练习，任何人都可以学习如何将关系性拼图拼凑在一起。

在本章中，我们研究了适用于函数式编程的几个数学概念，以及它们如何使我们在数据之间建立关系。 接下来，我们将探讨JavaScript中的递归和其他高级主题。