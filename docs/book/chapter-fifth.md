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
