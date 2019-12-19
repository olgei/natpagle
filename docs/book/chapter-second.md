# 简介

到目前为止，我们已经看到了函数式编程的一小部分功能。

但是什么是函数式编程呢？是什么让这一种语言具有这种能力，而不是另一种？是什么让这一种编程风格具有功能，而不是另一种？在本章中，我们将首先回答这些问题，然后介绍函数式编程的核心概念：

- 使用函数和数组控制流
- 编写纯函数、匿名函数、递归函数等
- 像对象一样传递函数
- 使用 map()、filter()和 reduce()函数

## 函数式编程语言

函数式编程是促进函数式编程范例的语言。冒着过度简化的风险，我们可以说，如果一种语言包括函数式编程所需的功能，那么它就是一种函数式语言。在大多数情况下，这是编程风格。

## 为什么语言有这样的特性

功能编程不能在像 C 和 Java 语言中执行，因为这些语言不包含支持它的构造方法。它们是纯粹面向对象的非函数式语言。其次，面向对象的编程不能在纯函数式语言上执行（如 Scheme、Haskell 和 Lisp）。但某些语言也支持这两种模型。 Python 是一个著名的例子，但还有其他例子：Ruby，Julia 和我们感兴趣的 JavaScript。 这些语言如何支持两种截然不同的设计模式？ 它们包含两种编程范例所需的功能。 但对于 JavaScript，功能特性值得我们发掘。

但实际上，它涉及的更多。 那么什么使语言具有这样的特性？

|   特性   |            命令            |                     功能性                     |
| :------: | :------------------------: | :--------------------------------------------: |
| 编程风格 | 执行分步任务并管理状态更改 | 定义问题是什么以及实现解决方案需要哪些数据转换 |
| 状态更改 |            重要            |                     不存在                     |
| 执行顺序 |            重要            |                     不重要                     |
| 主程控制 |  循环、条件语句和函数调用  |                 函数调用和递归                 |
| 操纵单元 |        结构和类对象        |           作为一级对象和数据集的函数           |

一种语言的语法必须允许某些设计模式，例如类型推导，以及使用匿名函数的能力。 例如该语言必须实现 λ 演算。 同样，解释器的评估策略应为非严格且按需调用（也称为延迟执行），这允许不可变的数据结构和非严格的惰性计算。

## 优势

可以这样说，学习和理解函数式编程所得的收获：不管你是否成为成为一名全职的函数式程序员，学习的经历都会使你在以后的项目开发中成为一个更好的程序员。

从形式上讲，使用函数式编程的实际优势是什么？

### 代码精简

函数式编程代码更简洁，更小。 简化了调试，测试和维护成本。

例如，假设我们实现一个将二维数组转换为一维数组的函数。 仅使用命令式编程风格，我们这样实现它：

```js
function merge2dArrayIntoOne(arrays) {
  var count = arrays.length;
  var merged = new Array(count);
  var c = 0;
  for (var i = 0; i < count; ++i) {
    for (var j = 0, jlen = arrays[i].length; j < jlen; ++j) {
      merged[c++] = arrays[i][j];
    }
  }
  return merged;
}
```

使用函数式编程技术，可以这样写：

```js
var merge2dArrayIntoOne2 = function(arrays) {
  return arrays.reduce(function(p, n) {
    return p.concat(n);
  });
};
```

这两个函数都使用相同的输入并返回相同的输出。 但是，该下面示例更加简洁明了。

### 模块化

函数式编程的特点将大问题分解为要解决的同一问题的较小实例。 这意味着代码更加模块化。 明确规定了模块化程序，易于调试和维护。同时测试更加容易，因为可以对每个模块化代码进行正确性检查。

### 复用性

由于功能编程的模块化，功能程序共享各种常用的方法。 发现这些功能可以在各种不同的应用程序中重复使用。

后续章节将展示许多最常用的函数功能。作为函数式编程程序员时，不可避免地会开发自己的工具函数库（utils），这些函数可以反复使用。 例如，设计良好的函数方法可以搜索配置文件的各行，也可以用于搜索哈希表。

### 减少耦合

耦合是程序中模块之间的依赖量。由于函数式程序员致力于编写一级、高阶、纯函数，这些函数彼此完全独立，对全局变量没有副作用，因此耦合大大减少。当然，功能之间不可避免地会相互依赖。但修改一个函数不会改变另一个函数，只要输入到输出的一对一映射保持正确。

### 数学上正确

最后一个是从理论上讲的。 由于其起源于 Lambda 微积分，因此可以从数学上证明功能程序是正确的。 对于需要证明程序的增长率，时间复杂度和数学正确性的研究人员来说，这是一个很大的优势。

让我们看一下斐波那契数列。 尽管除了概念证明之外，它很少用于其他任何方面，但它很好地说明了这一概念。 评估斐波那契序列的标准方法是创建一个递归函数，该函数表示:

`fibonnaci（n）= fibonnaci（n-2）+ fibonnaci（n-1`）

并在 n <2 时返回 1，这使得可能 停止递归并开始累加递归调用堆栈中每个步骤返回的值。

以下描述了计算序列所涉及的中间步骤。

```js
var fibonacci = function(n) {
  if (n < 2) {
    return 1;
  } else {
    return fibonacci(n - 2) + fibonacci(n - 1);
  }
};
console.log(fibonacci(8));
// Output: 34
```

但是，借助实现惰性执行策略的库，可以生成不确定的序列，该序列说明定义整个数字序列的数学方程式。 仅计算所需数量的数字。

```js
var fibonacci2 = Lazy.generate(
  (function() {
    var x = 1,
      y = 1;
    return function() {
      var prev = x;
      x = y;
      y += prev;
      return prev;
    };
  })()
);

console.log(fibonacci2.length()); // Output: undefined
console.log(fibonacci2.take(12).toArray()); // Output: [1, 1, 2, 3, 5,8, 13, 21, 34, 55, 89, 144]
var fibonacci3 = Lazy.generate(
  (function() {
    var x = 1,
      y = 1;
    return function() {
      var prev = x;
      x = y;
      y += prev;
      return prev;
    };
  })()
);

console.log(
  fibonacci3
    .take(9)
    .reverse()
    .first(1)
    .toArray()
);
// Output: [34];
```

二个例子显然在数学上更合理。 它依靠惰性计算。 JavaScript 库。 还有其他库也可以在这里提供帮助，例如 Sloth.js 和 wu.js。 这些将在第 3 章，建立函数式编程环境中介绍。

### 非函数世界中的函数式编程

函数式编程和非函数式编程可以混合在一起吗？ 这是第 7 章 JavaScript 的功能和面向对象编程的主题，但在此之前，首先要弄清楚一些事情很重要。

本书无意教你如何实现严格遵守纯函数式编程进行项目开发，此类应用很少在学术界以外适用。 这本书将教你如何在应用程序中使用函数式编程设计策略来补充必要的命令性代码。

例如，如果您需要仅包含某些文本中的字母的前四个单词，则可以这样简单地编写它们：

```js
var words = [],
  count = 0;
text = myString.split(" ");
for (i = 0; count < 4, i < text.length; i++) {
  if (!text[i].match(/[0-9]/)) {
    words = words.concat(text[i]);
    count++;
  }
}
console.log(words);
```

相比之下，函数式编程这样写：

```js
var words = [];
var words = myString
  .split(" ")
  .filter(function(x) {
    return !x.match(/[1-9]+/);
  })
  .slice(0, 4);
console.log(words);
```

使用功能性编程实用程序库，可以进一步简化它们：

```js
var words = toSequence(myString)
  .match(/[a-zA-Z]+/)
  .first(4);
```

标识可以以更实用的方式编写的函数的关键是查找循环和临时变量，例如上例中的 words 和 count 实例。

我们可以通过使用高阶函数代替临时变量和循环来消除它们，我们将在本章稍后进行探讨。

## JavaScript 是函数式语言吗

JavaScript 是函数语言还是非函数式语言？

JavaScript 世界上最流行、最难理解的函数式编程语言。JavaScript 是一种类似 C 语言的函数式编程语言。不可否认，它的语法类似于 C，这意味着它使用 C 的块语法和中缀顺序（infix ordering）。它是现存的口碑最差语言之一。基本上很多人会把 JavaScript 与 Java 相混淆，实际上，它与 Java 几乎没有什么共同之处。

而且，为了真正巩固 JavaScript 是面向对象语言的思想，Dojo.js 和 ease.js 等库和框架一直在努力抽象 JavaScript 并使其适合于面向对象编程。JavaScript 诞生于 20 世纪 90 年代，当时 OOP 思想一时，有人告诉我们 JavaScript 是面向对象的，因为我们非常希望它是面向对象的。但事实并非如此。

它的真实身份与 Scheme 和 Lisp 更加一致，这是两种经典的功能语言。 JavaScript 一直是一种函数式语言。 它的功能是一流的，可以嵌套，具有闭包和组合，并且允许使用 curry 和 monads。 所有这些都是函数式编程的关键。 以下是 JavaScript 是函数式语言的一些其他原因：

- JavaScript 的语法包括将函数传递为参数的能力，具有推断类型，并允许匿名函数、高阶函数、闭包等等。这些事实对于实现函数式编程的结构和行为至关重要。
- 它不是一种纯面向对象的语言，大多数面向对象的设计模式是通过复制原型对象来实现的，这是面向对象编程的一个薄弱模型。European Computer Manufacturers
  Association Script（ECMAScript）是 JavaScript 的正式和标准实现规范，在规范 4.2.1 中规定了以下内容：

`ECMAScript不包含适当的类，例如C++、SimalTalk或Java中的类，而是支持创建对象的构造函数。在基于类的面向对象语言中，一般情况下，状态由实例携带，方法由类携带，继承仅限于结构和行为。在ECMAScript中，状态和方法是由对象携带的，结构、行为和状态都是继承的。`

- 它也是一种解释性语言。 JavaScript 解释器有时也称为“引擎”，通常与 Scheme 解释器非常相似。 两者都是动态的，都有灵活的数据类型，可以轻松地组合和转换，都将代码评估为表达式块，并且都以相似的方式对待函数。

尽管如此，JavaScript 确实不是一种纯函数式语言。缺少的是惰性计算和内置不可变数据。这是因为大多数解释器都是 call-by-name 而不是 call-by-need。由于 JavaScript 处理尾部调用的方式，它对递归也不是很好。然而，只要稍加改进，所有这些问题都可以得到解决。无限序列和延迟计算所需的非严格计算可以通过 lazy.js 的库实现。不可变数据可以简单地通过编程技术来实现，但这需要更多的程序员 polyfill，而不是依赖于语言特性来处理它。而递归的尾部调用消除可以通过一种叫做 Trampolining 的方法来实现。这些问题将在第 6 章，JavaScript 中的高级主题和陷阱中展开。

关于 JavaScript 是函数式语言还是面向对象语言，两者兼而有之，还是两者都不是，还未定论。

最后，函数式编程是通过巧妙的变异、组合和使用函数的方式来编写更简洁的代码的方法。 JavaScript 为这种方法提供了很好的媒介。 如果您确实想充分利用 JavaScript 的潜力，则必须学习如何将其用作函数式语言。

## 使用函数式功能

有时，优雅的实现是一个函数。不是方法。不是一门课。不是框架。只是一个功能。

`-John Carmack, lead programmer of the Doom video game`

函数式编程就是将问题分解为一组函数。 通常，功能连在一起，相互嵌套，传递并被视为头等公民。 如果您使用了诸如 jQuery 和 Node.js 之类的框架，那么您可能已经使用了其中的一些技术，您只是没有意识到！

让我们从一些 JavaScript 难处入手。

假设我们需要编译一个分配给通用对象的值的列表，这些对象可以是任元素：dates，HTML object 等等。

```js
var obj1 = { value: 1 },
  obj2 = { value: 2 },
  obj3 = { value: 3 };

var values = [];

function accumulate(obj) {
  values.push(obj.value);
}

accumulate(obj1);
accumulate(obj2);

console.log(values); // Output: [obj1.value, obj2.value]
```

以上代码能运行，但不稳定。任何代码都可以在不调用 accumulate()函数的情况下修改 values 数组。如果我们忘记把 values 设置为数组[]，那么代码将完全不起作用。

但如果变量是在函数内部声明的，它就不能被任何意外问题行所改变。

```js
function accumulate2(obj) {
  var values = [];
  values.push(obj.value);
  return values;
}

console.log(accumulate2(obj1)); // Returns: [obj1.value]
console.log(accumulate2(obj2)); // Returns: [obj2.value]
console.log(accumulate2(obj3)); // Returns: [obj3.value]
```

代码木起作用！只返回上次传入的对象的值。我们可以在第一个函数中使用嵌套函数来解决这个问题。

```js
var ValueAccumulator = function(obj) {
  var values = [];
  var accumulate = function() {
    values.push(obj.value);
  };
  accumulate();
  return values;
};
```

以上代码是同一个问题，现在我们不能得到累加函数或 values 变量。

我们需要的是一个自调用函数（self-invoking function）。

## 自调用函数和闭包

如果我们可以返回一个反过来返回值数组的函数表达式呢？函数中声明的变量可用于函数中的任何代码，包括自调用函数。

通过使用自调用函数，我们的困境得到了解决。

```js
var ValueAccumulator = function() {
  var values = [];
  var accumulate = function(obj) {
    if (obj) {
      values.push(obj.value);
      return values;
    } else {
      return values;
    }
  };
  return accumulate;
};

//This allows us to do this:
var accumulator = ValueAccumulator();
accumulator(obj1);
accumulator(obj2);

console.log(accumulator());
// Output: [obj1.value, obj2.value]
```

这都是关于变量作用域的。 即使范围之外的代码调用了这些函数，值变量也可用于内部的 accumulate()函数。闭包是所有功能语言的功能。 传统的命令式语言不允许这样做。

## 高阶函数

自调用函数实际上是高阶函数的一种形式。 高阶函数是将另一个函数作为输入或将一个函数返回作为输出的函数。

高阶函数在传统编程中并不常见。 命令式程序员可能会使用循环来迭代数组，而功能性程序员则会完全采用另一种方法。 通过使用高阶函数，可以通过将该函数应用于数组中的每个项目以创建新数组来处理该数组。

这是函数式编程范例的中心思想。 高阶函数允许的是将逻辑传递给其他函数的能力，就像对象一样。

在 JavaScript 中，函数被视为一等公民，这是 JavaScript 与 Scheme，Haskell 和其他经典函数语言的共同点。 这听起来可能很奇怪，但是这实际上意味着将功能像数字和对象一样被视为基元。 如果数字和对象可以传递，函数也可以传递。

为了了解这一点，让我们在上一节的 ValueAccumulator()函数中使用高阶函数：

```js
// using forEach() to iterate through an array and call a
// callback function, accumulator, for each item
var accumulator2 = ValueAccumulator();
var objects = [obj1, obj2, obj3]; // could be huge array of objects
objects.forEach(accumulator2);
console.log(accumulator2());
```

## 纯函数

一个简单的例子是数学函数。 `Math.sqrt(4)`将始终返回 2，不使用任何隐藏信息（例如设置或状态），并且永远不会造成任何副作用。

纯函数是对“函数”的数学术语的真正解释，“函数”是输入与输出之间的关系。 它们考虑简单，易于重用。 由于它们是完全独立的，因此纯函数可以多次使用。

为了说明这一点，请将以下非纯函数与纯函数进行比较。

```js
// function that prints a message to the center of the screen
var printCenter = function(str) {
  var elem = document.createElement("div");
  elem.textContent = str;
  elem.style.position = "absolute";
  elem.style.top = window.innerHeight / 2 + "px";
  elem.style.left = window.innerWidth / 2 + "px";
  document.body.appendChild(elem);
};
printCenter("hello world");
// pure function that accomplishes the same thing
var printSomewhere = function(str, height, width) {
  var elem = document.createElement("div");
  elem.textContent = str;
  elem.style.position = "absolute";
  elem.style.top = height;
  elem.style.left = width;
  return elem;
};

document.body.appendChild(
  printSomewhere(
    "hello world",
    window.innerHeight / 2 + 10 + "px",
    window.innerWidth / 2 + 10 + "px"
  )
);
```

虽然非纯函数依赖于窗口对象的状态来计算高度和宽度，但是纯自给自足的函数却要求传递这些值。这实际上是在允许将消息打印在任何地方， 这使功能更加通用。

虽然非纯函数似乎更容易选择，因为它执行附加自身而不是返回元素，而纯函数printSomewhere()及其返回值在其他函数式编程设计技术中的作用更好。

```js
var messages = ["Hi", "Hello", "Sup", "Hey", "Hola"];

messages
  .map(function(s, i) {
    return printSomewhere(s, 100 * i * 10, 100 * i * 10);
  })
  .forEach(function(element) {
    document.body.appendChild(element);
  });
```

## 匿名函数

将函数视为一级对象的另一个好处是匿名函数的出现，匿名函数是没有名称的函数。 但是它们不仅仅如此。 它们允许的是能够在现场和根据需要定义临时逻辑的能力。 通常，这是为了方便。 如果该函数仅被引用一次，则无需在其上浪费变量名称。

匿名函数的示例：

```js
// The standard way to write anonymous functions
function () {
  return "hello world";
}
// Anonymous function assigned to variable
var anon = function(x, y) {
  return x + y;
};
// Anonymous function used in place of a named callback function,
// this is one of the more common uses of anonymous functions.
setInterval(function() {
  console.log(new Date().getTime());
}, 1000);

// Output: 1413249010672, 1413249010673, 1413249010674, ...
// Without wrapping it in an anonymous function, it immediately
// execute once and then return undefined as the callback:
setInterval(console.log(new Date().getTime()), 1000);
// Output: 1413249010671

```

高阶函数中使用的匿名函数的一个更复杂的示例：

```js
function powersOf(x) {
  return function(y) {
    // this is an anonymous function!
    return Math.pow(x, y);
  };
}
powerOfTwo = powersOf(2);
console.log(powerOfTwo(1)); // 2
console.log(powerOfTwo(2)); // 4
console.log(powerOfTwo(3)); // 8
powerOfThree = powersOf(3);
console.log(powerOfThree(3)); // 9
console.log(powerOfThree(10)); // 59049

```

返回的函数不需要命名。 它不能在powersOf()函数之外的任何地方使用，因此它是一个匿名函数。上上一节的累加器功能可以使用匿名函数重写它。

```js
var obj1 = { value: 1 },
  obj2 = { value: 2 },
  obj3 = { value: 3 };

var values = (function() {
  // anonymous function
  var values = [];
  return function(obj) {
    // another anonymous function!
    if (obj) {
      values.push(obj.value);
      return values;
    } else {
      return values;
    }
  };
})(); // make it self-executing

console.log(values(obj1)); // Returns: [obj.value]
console.log(values(obj2)); // Returns: [obj.value, obj2.value]
```

不仅如此。 如结构`( function () {...}) ();`所示，它也是自执行的。 匿名函数后面的一对括号使该函数立即被调用。 在上面的示例中，将值实例分配给自执行函数调用的输出。

匿名功能的一个缺点仍然存在。 它们很难在调用堆栈中识别，这使调试更加棘手。 应该谨慎使用它们。

## 链式调运

在JavaScript中将方法链接在一起非常普遍。 如果您使用过jQuery，则可能已经执行了此技术。 有时称为“生成器模式”。这是一种用于简化代码的技术，其中将多个功能一个接一个地应用于一个对象。

```js
// Instead of applying the functions one per line...
arr = [1, 2, 3, 4];
arr1 = arr.reverse();
arr2 = arr1.concat([5, 6]);
arr3 = arr2.map(Math.sqrt);

// ...they can be chained together into a one-liner
console.log(
  [1, 2, 3, 4]
    .reverse()
    .concat([5, 6])
    .map(Math.sqrt)
);
// parentheses may be used to illustrate
console.log(
  [1, 2, 3, 4]
    .reverse()
    .concat([5, 6])
    .map(Math.sqrt)
);
```

这仅在函数是要处理的对象的方法时才有效。 例如，如果您创建了自己的函数，该函数需要两个数组并返回两个数组压缩在一起的数组，则必须将其声明为Array.prototype对象的成员。 看一下以下代码片段：

```js
Array.prototype.zip = function(arr2) {
  // ...
};
```

这将使我们能够：

```js
arr.zip([11, 12, 13, 14]).map(function(n) {
  return n * 2;
});
// Output: 2, 22, 4, 24, 6, 26, 8, 28
```

## 递归

递归可能是最著名的函数式编程技术。 如果您现在还不知道，那么递归函数就是一个调用自身的函数。

当函数调用自身时，会发生一些奇怪的事情。 它既充当循环，多次执行同一代码，又充当函数堆栈。

递归函数必须非常小心，以避免无限循环（在这种情况下为无限递归）。 因此，就像循环一样，必须使用条件来知道何时停止。 这称为基本情况。

示例如下：

```js
var foo = function(n) {
  if (n < 0) {
    // base case
    return "hello";
  } else {
    // recursive case
    foo(n - 1);
  }
};
console.log(foo(5));
```

可以将任何循环转换为递归算法，将任何递归算法转换为循环。但是递归算法更适合，几乎是必要的，对于那些与循环非常不同的情况。

一个非常好的例子是树遍历。 虽然使用递归函数遍历树并不难，但循环会复杂得多，并且需要维护堆栈。 这将与函数式编程的精神背道而驰。

```js
var getLeafs = function(node) {
  if (node.childNodes.length == 0) {
    // base case
    return node.innerText;
  } else {
    // recursive case:
    return node.childNodes.map(getLeafs);
  }
};
```

## 分治算法

在没有for和while循环的情况下，递归不仅仅是一种有趣的迭代方式。 一种称为分而治之的算法设计将问题递归分解为同一问题的较小实例，直到它们足够小以至于无法解决。

这方面的例子是欧几里得算法，用于寻找两个数的最大公分母。

```js
function gcd(a, b) {
  if (b == 0) {
    // base case (conquer)
    return a;
  } else {
    // recursive case (divide)
    return gcd(b, a % b);
  }
}
console.log(gcd(12, 8));
console.log(gcd(100, 20));
```

因此，从理论上讲，分而治之非常有效，但是在现实世界中有什么用吗？ 是! 用于对数组进行排序的JavaScript函数不是很好。 它不仅将数组排序到位，这意味着数据不是不可变的，而且也不可靠且不灵活。 通过分而治之，我们可以做得更好。

合并排序算法使用分而治之递归算法设计，通过将数组递归划分为较小的子数组，然后将它们合并在一起，从而有效地对数组进行排序。

JavaScript的完整实现约为40行代码。

但是，伪代码如下：

```js
var mergeSort = function(arr) {
  if (arr.length < 2) {
    // base case: 0 or 1 item arrays don't need sorting
    return items;
  } else {
    // recursive case: divide the array, sort, then merge
    var middle = Math.floor(arr.length / 2);
    // divide
    var left = mergeSort(arr.slice(0, middle));
    var right = mergeSort(arr.slice(middle));
    // conquer
    // merge is a helper function that returns a new array
    // of the two arrays merged together
    return merge(left, right);
  }
};
```

## 惰性计算

惰性计算，也称为非严格计算，按需调用和延迟执行，是一种计算策略，它等待直到需要值才能计算函数的结果，这对函数编程特别有用。 显然，指出`x = func()`的代码行正在要求通过`func()`将 x 分配给返回值。 但是 x 实际等于什么并不重要，直到需要它为止。 等待调用`func ()`直到需要x称为惰性计算。

这种策略可以大大提高性能，特别是与方法链和数组一起使用时，这是函数式程序员最喜欢的程序流程技术。

惰性计算(求值)的一个很棒的好处是无限级数的存在。 因为实际上什么都不会计算，直到无法进一步延迟为止，所以可以这样做：

```js
// wishful JavaScript pseudocode:
var infinateNums = range(1 to infinity);
var tenPrimes = infinateNums.getPrimeNumbers().first(10);
```

这为许多可能性打开了大门：异步执行，并行化和组合，仅举几例。

但是，存在一个问题：JavaScript不会自行执行惰性运算。 就是说，一些JavaScript的库，它们可以很好地模拟惰性运算。 关注三章，搭建功能编程环境。

## 函数式编程程序员的工具集

仔细查看了到目前为止提供的一些示例，您会注意到正在使用的一些您可能不熟悉的方法。 它们是map()，filter()和reduce()函数，对于任何语言的每个函数程序都至关重要。 它们使您能够删除循环和语句，从而使代码更简洁。

map()，filter()和reduce()函数构成了函数式程序员工具集的核心，是纯的，高阶函数的集合，这些函数是函数方法的主力军。 实际上，它们是纯函数和高阶函数应该是什么样的一个缩影。 它们将函数作为输入，并返回零副作用的输出。

虽然这些方法是ECMAScript 5.1的浏览器的标准配置，但它们仅适用于数组。 每次调用它时，都会创建并返回一个新数组。 现有阵列未修改。 但是，还有更多的情况，它们将函数作为输入，通常采用匿名函数的形式，称为回调函数。 他们遍历数组并将函数应用于数组中的每个项目（我们常用，是不是？）。

```js
myArray = [1, 2, 3, 4];
newArray = myArray.map(function(x) {
  return x * 2;
});
console.log(myArray); // Output: [1,2,3,4]
console.log(newArray); // Output: [2,4,6,8]
```

另外，这些方法仅适用于数组，因此不适用于其他可迭代的数据结构，例如某些对象。 不用担心，underscore.js，Lazy.js，stream.js等库均实现了自己的map()，filter()和reduce()方法，它们的用途更加广泛(向这些库致敬，大家可以关注我的[bbo工具函数库](https://github.com/Tnfe/bbo.git)项目)。

## 回调函数

鉴于JavaScript允许声明函数的几种不同方式，callback()函数用于传递给其他函数供他们使用。 这是一种传递逻辑的方法，就像传递对象一样：

```js
var myArray = [1, 2, 3];
function myCallback(x) {
  return x + 1;
}
console.log(myArray.map(myCallback));

```

为了简化工作，可以使用匿名函数：

```js
console.log(
  myArray.map(function(x) {
    return x + 1;
  })
);

```

它们不仅用于函数式编程，而且还用于JavaScript中的许多事情。这是在用jQuery进行AJAX调用中使用的callback()函数：

```js
function myCallback(xhr) {
  console.log(xhr.status);
  return true;
}

$.ajax(myURI).done(myCallback);
```

请注意，如果仅使用了函数名称，而没有调用回调并且仅传递了回调的名称，是不能执行的。所以以下代码是错误的：

```js
$.ajax(myURI).fail(myCallback(xhr));
// or
$.ajax(myURI).fail(myCallback());
```

如果我们调用回调会发生什么？ 在那种情况下，`myCallback(xhr)`方法将尝试执行`-"undefined"`将被打印到控制台，并且将返回`True`。 当`ajax()`调用完成时，它将使用`true`作为要使用的回调函数的名称，这将引发错误。

这也意味着我们无法指定将哪些参数传递给回调函数。 如果我们需要与`ajax()`调用传递的参数不同的参数，则可以将回调函数包装在匿名函数中。

```js
function myCallback(status) {
  console.log(status);
  return true;
}
$.ajax(myURI).done(function(xhr) {
  myCallback(xhr.status);
});
```

## 荣誉函数

`map()` `filter()` `reduce()` 这三个函数为函数式编程带来便利。

### Array.prototype.map()

用法：`Syntax: arr.map(callback [, thisArg]);`

它是函数作用域用的做多的，它对数组中的每个元素应用回调函数。

案例：

```js
var integers = [1, -0, 9, -8, 3],
  numbers = [1, 2, 3, 4],
  str = "hello world how ya doing?";
// map integers to their absolute values
console.log(integers.map(Math.abs));
// multiply an array of numbers by their position in the array

console.log(
  numbers.map(function(x, i) {
    return x * i;
  })
);
// Capitalize every other word in a string.
console.log(
  str.split(" ").map(function(s, i) {
    if (i % 2 == 0) {
      return s.toUpperCase();
    } else {
      return s;
    }
  })
);
```

小技巧：

While the Array.prototype.map method is a standard method for the Array object in JavaScript, it can be easily extended to your custom objects as well.

```js
MyObject.prototype.map = function(f) {
  return new MyObject(f(this.value));
};
```

### Array.prototype.filter()

`filter()`函数用于将元素从数组中取出。 回调必须返回`true`（将项目包括在新数组中）或`false`（将其删除）。 通过使用`map()`函数并为要删除的项目返回空值，可以实现类似的效果，但是`filter()`函数将从新数组中删除该项目，而不是在其位置插入空值。

用法：`Syntax: arr.filter(callback [, thisArg]);`

案例：

```js
var myarray = [1, 2, 3, 4];
words = "hello 123 world how 345 ya doing".split(" ");
re = "[a-zA-Z]";
// remove all negative numbers
console.log(
  [-2, -1, 0, 1, 2].filter(function(x) {
    return x > 0;
  })
);
// remove null values after a map operation
console.log(
  words.filter(function(s) {
    return s.match(re);
  })
);
// remove random objects from an array
console.log(
  myarray.filter(function() {
    return Math.floor(Math.random() * 2);
  })
);
```

### Array.prototype.reduce()

有时称为“fold”的`reduce()`函数用于将数组的所有值累加为一个。 回调需要返回要执行的逻辑以合并对象。 如果是数字，通常将它们加在一起以获得总和，或者相乘得到一个乘积。 对于字符串，通常将字符串附加在一起。

用法：`Syntax: arr.reduce(callback [, initialValue]);`

案例：

```js
var numbers = [1, 2, 3, 4];
// sum up all the values of an array
console.log(
  [1, 2, 3, 4, 5].reduce(function(x, y) {
    return x + y;
  }, 0)
);
// sum up all the values of an array
console.log(
  [1, 2, 3, 4, 5].reduce(function(x, y) {
    return x + y;
  }, 0)
);
// find the largest number
console.log(
  numbers.reduce(function(a, b) {
    return Math.max(a, b);
  }) // max takes two arguments
);
```

`map()`，`filter()`和`reduce()`函数在我们的辅助函数工具箱中很常见。几乎所有的函数式方法里都用他们的身影。

### Array.prototype.forEach

用法：`Syntax: arr.forEach(callback [, thisArg]);`

本质上是`map()`的非纯版本，`forEach()`遍历数组，并对每个项目应用callback()函数。但它不返回任何内容。 这是执行for循环的一种更干净的方法。

例子：

```js
var arr = [1, 2, 3];
var nodes = arr.map(function(x) {
  var elem = document.createElement("div");
  elem.textContent = x;
  return elem;
});
// log the value of each item
arr.forEach(function(x) {
  console.log(x);
});
// append nodes to the DOM
nodes.forEach(function(x) {
  document.body.appendChild(x);
});
```

### Array.prototype.concat

当使用数组而不是for和while循环时，通常需要将多个数组连接在一起。另一个JavaScript内置函数`concat()`为我们解决了这一问题。 `concat()`函数返回一个新数组，并保持旧数组不变。 它可以连接传递给它的数组。

```js
console.log([1, 2, 3].concat(['a','b','c']) // concatenate two arrays);
// Output: [1, 2, 3, 'a','b','c']
```

原始阵列保持不变。 它返回一个新数组，两个数组串联在一起。 这也意味着concat()函数可以连接在一起。

```js
var arr1 = [1,2,3];
var arr2 = [4,5,6];
var arr3 = [7,8,9];
var x = arr1.concat(arr2, arr3);

var y = arr1.concat(arr2).concat(arr3);
var z = arr1.concat(arr2.concat(arr3));
console.log(x);
console.log(y);
console.log(z);
```

变量x，y和z都包含[1,2,3,4,5,6,7,8,9]。

### Array.prototype.reverse

另一个JavaScript函数可帮助进行数组转换。 `reverse()`函数会反转数组，以使第一个元素现在是最后一个元素，而最后一个元素现在是第一个元素。

但是，它不会返回新的数组。 相反，它会在适当的位置改变数组。 下面案例做的更好： 这是用于反转数组的纯方法的实现：

```js
var invert = function(arr) {
  return arr.map(function(x, i, a) {
    return a[a.length - (i + 1)];
  });
};
var q = invert([1, 2, 3, 4]);
console.log(q);
```

### Array.prototype.sort

就像`map()`，`filter()`和`reduce()`方法一样，`sort()`方法采用`callback()`函数，该函数定义应如何对数组中的对象进行排序。但是，像`reverse()`函数一样，它会在适当的位置改变数组。

```js
arr = [200, 12, 56, 7, 344];
console.log(arr.sort(function(a,b){return a – b}) );
// arr is now: [7, 12, 56, 200, 344];
```

我们可以编写一个纯粹的sort()函数，该函数不会使数组发生变化，但排序算法是造成很多麻烦的根源。 实际上，需要排序的大型数组实际上应为这种目的而设计的数据结构：quickStort，mergeSort，bubbleSort等。

### Array.prototype.every 与 Array.prototype.some

`Array.prototype.every()`和`Array.prototype.some()`函数既是纯函数又是高阶函数，它们是Array对象的方法，用于针对必须具有`callback()`函数的数组元素进行测试 返回各个输入的布尔值。 如果callback()函数对数组中的每个元素都返回`true`，则`every()`函数将返回`true`，如果数组中的某些元素为`true`，则some()函数将返回`true`。

例子：

```js
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
console.log([1, 2, 3, 4].every(isNumber)); // Return: true
console.log([1, 2, "a"].every(isNumber)); // Return: false
console.log([1, 2, "a"].some(isNumber)); // Return: true
```

## 小结

为加深对函数式编程的理解，本章涵盖了相当广泛的主题。 我们分析了一种编程语言起作用的意义，评估了JavaScript的函数式编程能力。 接下来，我们应用了使用JavaScript进行函数式编程的核心概念，并展示了JavaScript的一些用于函数式编程的内置函数。

尽管JavaScript确实有一些用于函数式编程的工具，但其功能核心大部分仍处于隐藏状态，并且有很多不足之处。 在下一章中，我们将探索一些JavaScript库，以展示其功能。
