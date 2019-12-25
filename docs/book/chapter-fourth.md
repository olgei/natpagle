# 简介

大家现在要集中精力了，因为现在真的要进入实用的编程思维模式了。

在本章中，我们将执行以下操作：

- 把所有的核心概念整合成一个连贯的范例
- 当我们完全致力于这种风格时，探索函数式编程所能提供的好处
- 在函数式编程模式相互构建的过程中逐步编写它们的逻辑过程
- 我们将构建一个简单的程序，完成一些非常酷的功能

上一章中提出了一些函数式编程概念，但在第2章“函数编程的基本原理”中没有提到。那是有原因的！Compositions, currying, partial application，等等。让我们来学习这些库为什么以及如何实现这些概念。

函数式编程可以有多种风格和模式。本章将介绍许多不同风格的函数式编程：

- 数据通用编程
- 一般函数式编程
- 响应式函数式编程

这一章将尽可能的保持编程风格平和。在不过分依赖一种风格的函数式编程的情况下，总目标是寻找有更好的方法来编写代码，而不是采用唯一的方法。如果你以多种方式来编写代码的先入为主的观念解放编程思想，你就可以做任何你想做的事情。反之，如果你不遵循规律，随意写代码，可能会产生很多问题。

## 函数局部应用和柯里化

许多语言支持可选参数，但在JavaScript中不支持。JavaScript使用完全不同的模式，允许向函数传递任意数量的参数。这就为一些非常有趣和不同寻常的设计模式打开了大门。函数可以部分或全部应用。

JavaScript中的部分应用程序是将值绑定到函数的一个或多个参数的过程，该函数返回另一个接受其余未绑定参数的函数。类似地，curring是将具有多个参数的函数转换为具有一个参数的函数的过程，该参数返回另一个根据需要接受更多参数的函数。

两者之间的区别现在可能还不清楚，但最终会差异很大。

## 函数操作

实际上，在我们进一步解释如何实现偏函数应用和柯里化之前，我们需要做一个系统回顾。我们要探索JavaScriptC语言，暴露它的功能底层，我们需要了解JavaScript中的原函数、函数和原型是如何工作的；如果我们只是想设置一些cookie或验证一些表单字段，我们就不需要考虑这些。

### apply、call和this关键字

在纯函数式语言中，函数不被调用；而是被应用。JavaScript也以同样的方式工作，甚至提供了手动调用和应用函数的实用程序。这都是关于`this`关键字的，当然也是函数所属的对象。

使用call()函数可以将this关键字定义为第一个参数。 其工作方式如下：

```js
console.log(["Hello", "world"].join(" ")); // normal way
console.log(Array.prototype.join.call(["Hello", "world"], " ")); // using call
```

可以使用call()函数来调用匿名函数:

```js
console.log(
  function() {
    console.log(this.length);
  }.call([1, 2, 3])
);
```

apply()函数与call()函数非常相似，但更有用：

```js
console.log(Math.max(1, 2, 3)); // returns 3
console.log(Math.max([1, 2, 3])); // won't work for arrays though
console.log(Math.max.apply(null, [1, 2, 3])); // but this will work
```

根本的区别是，尽管call()函数接受参数列表，而apply()函数接受参数数组。

call()和apply()函数允许你编写一次函数，然后在其他对象中继承它，而无需再次编写函数。它们都是Function参数的成员。

> 当你自己使用call()函数时，可能会发生一些非常有意思的事情：

```js
// 两者相等
func.call（thisValue）;
Function.prototype.call.call（func，thisValue）;
```

## 绑定参数

bind()函数的作用是：将一个方法应用于一个对象，并将这个this关键字分配给另一个对象。在内部，它与call()函数相同，但它链接到该方法并返回一个新的有界函数。

它对于回调特别有用，如下代码片段所示：

```js
function Drum() {
  this.noise = "boom";
  this.duration = 1000;
  this.goBoom = function() {
    console.log(this.noise);
  };
}
var drum = new Drum();
setInterval(drum.goBoom.bind(drum), drum.duration);
```

这解决了诸如Dojo.js之类的面向对象框架中的许多问题，特别是在使用定义自己的处理函数的类时维护状态的问题。 但是我们也可以将bind()函数用于函数式编程。

## 函数工厂

还记得第二章“函数式编程基础知识”中有关闭包的部分吗？ 闭包是使可以创建有用的JavaScript编程模式（称为函数工厂）的构造。 它们允许我们手动将参数绑定到函数。

首先，我们需要一个将参数绑定到另一个函数的函数：

```js
function bindFirstArg(func, a) {
  return function(b) {
    return func(a, b);
  };
}
```

然后，我们可以使用它来创建更多通用函数：

```js
var powersOfTwo = bindFirstArg(Math.pow, 2);
console.log(powersOfTwo(3)); // 8
console.log(powersOfTwo(5)); // 32
```

它也可以处理其他参数：

```js
function bindSecondArg(func, b) {
  return function(a) {
    return func(a, b);
  };
}
var squareOf = bindSecondArg(Math.pow, 2);
var cubeOf = bindSecondArg(Math.pow, 3);
console.log(squareOf(3)); // 9
console.log(squareOf(4)); // 16
console.log(cubeOf(3)); // 27
console.log(cubeOf(4)); // 64
```

创建泛型函数的功能在函数编程中非常重要。 但是，有一个巧妙的技巧可以使此过程更加通用。 bindFirstArg()函数本身带有两个参数，第一个是函数。 如果我们将bindFirstArg函数作为函数传递给自身，则可以创建可绑定函数。 可以通过以下示例对此进行最好的描述：

```js
var makePowersOf = bindFirstArg(bindFirstArg, Math.pow);
var powersOfThree = makePowersOf(3);
console.log(powersOfThree(2)); // 9
console.log(powersOfThree(3)); // 27
```

这就是为什么它们被称为函数工厂的原因。

## 局部应用

需要注意的是，我们的函数工厂示例的bindFirstArg()和bindSecondArg()函数只适用于只有两个参数的函数。我们可以为不同数量的论据编写新的论据，但这会偏离我们的概括。我们需要的是局部应用。

在哪里需要局部应用？

与bind()函数和Function对象的其他内置方法不同，我们必须为局部应用和currying创建自己的函数。 有两种不同的方法可以做到这一点。

```js
var partial = function(func){... // As a stand-alone function
Function.prototype.partial = function(){... // As a polyfill
```

`Polyfill`用于增加具有新功能的原型，并允许我们将新功能称为要部分应用的功能的方法。 就像这样：`myfunction.partial（arg1，arg2，…）;`

### 从左侧局部应用

这是JavaScript的apply()和call()实用程序对我们有用的地方。 让我们看一下Function对象的可能的polyfill：

```js
Function.prototype.partialApply = function() {
  var func = this;
  args = Array.prototype.slice.call(arguments);
  return function() {
    return func.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  };
};
```

如您所见，它通过对参数特殊变量进行切片而起作用。

让我们看看在示例中使用它时会发生什么。 这次，让我们远离数学，去做一些有用的事情。 我们将创建一个小的应用程序，将数字转换为十六进制值。

```js
function nums2hex() {
  function componentToHex(component) {
    var hex = component.toString(16);
    // make sure the return value is 2 digits, i.e. 0c or 12
    if (hex.length == 1) {
      return "0" + hex;
    } else {
      return hex;
    }
  }
  return Array.prototype.map.call(arguments, componentToHex).join("");
}
// the function works on any number of inputs
console.log(nums2hex()); // ''
console.log(nums2hex(100, 200)); // '64c8'

console.log(nums2hex(100, 200, 255, 0, 123)); // '64c8ff007b'
// but we can use the partial function to partially apply
// arguments, such as the OUI of a mac address
var myOUI = 123;
var getMacAddress = nums2hex.partialApply(myOUI);
console.log(getMacAddress()); // '7b'
console.log(getMacAddress(100, 200, 2, 123, 66, 0, 1));
// '7b64c8027b420001'
// or we can convert rgb values of red only to hexadecimal
var shadesOfRed = nums2hex.partialApply(255);
console.log(shadesOfRed(123, 0)); // 'ff7b00'
console.log(shadesOfRed(100, 200)); // 'ff64c8'
```

这个例子表明，我们可以部分地将参数应用于泛型函数，并得到一个新的函数。第一个例子是从左到右，这意味着我们只能部分地应用第一个参数（最左边的参数）。

### 从右侧局部应用

为了从右边应用参数，我们可以定义另一个polyfill。

```js
Function.prototype.partialApplyRight = function() {
  var func = this;
  args = Array.prototype.slice.call(arguments);
  return function() {
    return func.apply(this, [].slice.call(arguments, 0).concat(args));
  };
};
var shadesOfBlue = nums2hex.partialApplyRight(255);
console.log(shadesOfBlue(123, 0)); // '7b00ff'
console.log(shadesOfBlue(100, 200)); // '64c8ff'
var someShadesOfGreen = nums2hex.partialApplyRight(255, 0);
console.log(shadesOfGreen(123)); // '7bff00'
console.log(shadesOfGreen(100)); // '64ff00'
```

部分应用程序使我们可以采用非常通用的功能，并从中提取更多特定的功能。 但是此方法的最大缺陷是参数传递的方式（以多少和顺序排列）可能是模棱两可的。 在编程中，模棱两可绝不是一件好事。 有一种更好的方法可以做到这一点：柯里化。

## 柯里化

柯里化是将具有多个参数的函数转换为具有一个参数的函数的过程，该函数返回另一个需要根据需要使用更多参数的函数。 形式上，具有N个参数的函数可以转换为N个函数的函数链，每个函数只有一个参数。

一个常见的问题是：局部应用和柯里化有什么区别？ 的确，局部应用立即返回了一个值，而柯里化仅返回另一个接受下一个参数的柯里化函数，但根本的区别在于柯里可以更好地控制如何将参数传递给函数。 我们将看到这是怎么回事，但是首先我们需要创建函数来执行该计算。

这是我们为函数原型添加curring的polyfill：

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

numArgs参数使我们可以选择指定未明确定义的函数所需要的参数数量。

让我们看看如何在十六进制转化方法中使用它。 编写一个将RGB值转换为适合HTML的十六进制字符串的函数：

```js
function rgb2hex(r, g, b) {
  // nums2hex is previously defined in this chapter
  return "#" + nums2hex(r) + nums2hex(g) + nums2hex(b);
}
var hexColors = rgb2hex.curry();
console.log(hexColors(11)); // returns a curried function
console.log(hexColors(11, 12, 123)); // returns a curried function
console.log(hexColors(11)(12)(123)); // returns #0b0c7b
console.log(hexColors(210)(12)(0)); // returns #d20c00
```

它将返回curried函数，直到传递了所有需要的参数为止。它们以与curryed函数定义的相同的顺序从左到右传递。

但是我们可以将其提高一个级别，并定义我们需要的更具体的功能，如下所示：

```js
var reds = function(g, b) {
  return hexColors(255)(g)(b);
};
var greens = function(r, b) {
  return hexColors(r)(255)(b);
};
var blues = function(r, g) {
  return hexColors(r)(g)(255);
};
console.log(reds(11, 12)); // returns #ff0b0c
console.log(greens(11, 12)); // returns #0bff0c
console.log(blues(11, 12)); // returns #0b0cff
```

因此，这是使用currying的好方法。 但是，如果我们只想直接使用nums2hex()函数，则会遇到一些麻烦。 因为该函数没有定义任何参数，它只是需要传递尽可能多的参数。 我们必须定义参数的数量。 我们使用curry函数的可选参数，该参数允许我们设置正在curry函数的参数数量。

```js
var hexs = nums2hex.curry(2);
console.log(hexs(11)(12)); // returns 0b0c
console.log(hexs(11)); // returns function
console.log(hexs(110)(12)(0)); // incorrect
```

因此，currying不能与接受可变数量的参数的函数配合使用。 对于这种情况，首选部局部应用。这些不仅是为了函数工厂和代码重用。 柯里化和局部应用会发挥更大的作用，称为函数组合(Function composition)。

## 函数组合

最后，我们来到了函数组合。

在函数式编程中，我们希望一切都成为函数。 如果可能，我们特别希望一元函数。 如果我们可以将所有函数转换为一元函数，那么神奇的事情就会发生。

`一元函数是仅接受单个输入的函数。 具有多个输入的函数是双元函数，但是对于接受两个输入的函数，我们通常说成二进制，对于三个输入的函数，我们通常说成三进制。 某些功能不接受特定数量的输入。 我们称这些为可变参数。`

本小节中，我们将探讨如何从较小的函数组成新的函数：将很小的逻辑单元组合成整个方法，这些逻辑单元大于单独的函数之和。

### 组合

组合函数使我们可以从许多简单的通用函数中构建复杂的函数。 通过将功能视为其他功能的构建块，我们可以构建具有出色可读性和可维护性的真正模块化应用程序。

在定义compose() polyfill之前，可以通过以下示例了解工作方式：

```js
var roundedSqrt = Math.round.compose(Math.sqrt);
console.log(roundedSqrt(5)); // Returns: 2

var squaredDate = roundedSqrt.compose(Date.parse)
console.log( squaredDate("January 1, 2014") ); // Returns: 1178370
```

在数学上，将f和g变量的组成定义为f(g(x))。在JavaScript中，可以这样写：

```js
var compose = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};
```

如果我们不这样做，除其他问题外，我们将无法找到此关键字。 解决方案是使用apply()和call()。 与curry相比，compose() polyfill方式非常简单。

```js
Function.prototype.compose = function(prevFunc) {
  var nextFunc = this;
  return function() {
    return nextFunc.call(this, prevFunc.apply(this, arguments));
  };
};
```

为了展示其用法，让我们构建一个完整的示例，如下所示：

```js
function function1(a) {
  return a + " 1";
}
function function2(b) {
  return b + " 2";
}
function function3(c) {
  return c + " 3";
}
var composition = function3.compose(function2).compose(function1);
console.log(composition("count")); // returns 'count 1 2 3'
```

是否注意到首先应用了function3参数？ 功能从右到左应用，这个非常重要。

### 反向组合

因为许多人喜欢从左到右阅读内容，所以按此顺序应用功能也很有意义。 我们称其为序列而不是合成。

要颠倒顺序，我们需要做的就是交换`nextFunc`和`prevFunc`参数。

```js
Function.prototype.sequence = function(prevFunc) {
  var nextFunc = this;
  return function() {
    return prevFunc.call(this, nextFunc.apply(this, arguments));
  };
};
```

这使我们现在可以更自然地调用函数。

```js
var sequences = function1.sequence(function2).sequence(function3);
console.log(sequences("count")); // returns 'count 1 2 3'
```

### 组合与链式

这是同一floorSqrt()函数组成的五个不同实现。 它们似乎是相同的，但值得仔细检查。

```js
function floorSqrt1(num) {
  var sqrtNum = Math.sqrt(num);
  var floorSqrt = Math.floor(sqrtNum);
  var stringNum = String(floorSqrt);
  return stringNum;
}

function floorSqrt2(num) {
  return String(Math.floor(Math.sqrt(num)));
}

function floorSqrt3(num) {
  return [num]
    .map(Math.sqrt)
    .map(Math.floor)
    .toString();
}
var floorSqrt4 = String.compose(Math.floor).compose(Math.sqrt);

var floorSqrt5 = Math.sqrt.sequence(Math.floor).sequence(String);

// all functions can be called like this:
floorSqrt < N > 17; // Returns: 4
```

但有几个关键的区别，我们应该回顾一下：

- 显然，第一种方法冗长且效率低下。
- 第二种方法是很好的一行程序，但是这种方法在只应用了几个函数之后就变得非常不可读了。

`如果说代码越少越好，那就没有意义了。当有效的指令更简洁时，代码更易于维护。如果在不更改执行的有效指令的情况下减少代码字符数，则会导致完全相反的效果：代码变得更难理解，而且不易维护；例如，当我们使用嵌套的三元运算符或将多个命令连在一行上时。这些方法减少了代码量，但并没有减少该代码实际指定的步骤的数量。因此，这样做的结果是混淆并使代码更难理解。使代码更易于维护的一种简洁性是，它有效地减少了指定的指令（例如，通过使用更简单的算法，用更少和/或更简单的步骤来实现相同的结果），或者当我们简单地用消息替换代码时，例如，用有良好文档记录的API调用第三方库。`

- 第三种方法是一系列数组函数，尤其是map函数。 这样写没问题，但在数学上不正确。
- 这是我们正在使用的compose()函数。所有方法都必须是一元的纯函数，这些函数鼓励使用更好，更简单和更小的函数来完成一件事并做好。
- 最后一种方法反向组合使用compose()函数，同样有效。

### 组合编程

compose最重要的是，除了应用的第一个函数外，它还与纯一元函数（仅接受一个参数的函数）一起使用效果最佳。

所应用的第一个功能的输出将发送到下一个功能。 这意味着该函数必须接受先前传递给它的函数。 这是类型签名背后的主要影响。

`类型签名用于显式声明函数接受的输入类型和输出的类型。最初由Haskell使用，Haskell实际上在编译器要使用的函数定义中使用它们。但是，在JavaScript中，我们只是将它们放在代码注释中。它们看起来像这样：foo :: arg1 -> argN -> output`

示例：

```js
// getStringLength :: String -> Int
function getStringLength(s){return s.length};
// concatDates :: Date -> Date -> [Date]
function concatDates(d1,d2){return [d1, d2]};
// pureFunc :: (int -> Bool) -> [int] -> [int]
pureFunc(func, arr){return arr.filter(func)}
```

为了真正获得compose的好处，任何应用程序都需要大量的一元、纯函数集合。这些是组成更大功能的构建块，反过来，这些功能又用于使应用程序非常模块化、可靠和可维护。

让我们举个例子。首先，我们需要许多构建块函数。其中一些建立在其他基础之上，如下所示：

```js
// stringToArray :: String -> [Char]
function stringToArray(s) {
  return s.split("");
}
// arrayToString :: [Char] -> String
function arrayToString(a) {
  return a.join("");
}
// nextChar :: Char -> Char
function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}
// previousChar :: Char -> Char
function previousChar(c) {
  return String.fromCharCode(c.charCodeAt(0) - 1);
}
// higherColorHex :: Char -> Char
function higherColorHex(c) {
  return c >= "f" ? "f" : c == "9" ? "a" : nextChar(c);
}
// lowerColorHex :: Char -> Char
function lowerColorHex(c) {
  return c <= "0" ? "0" : c == "a" ? "9" : previousChar(c);
}
// raiseColorHexes :: String -> String
function raiseColorHexes(arr) {
  return arr.map(higherColorHex);
}
// lowerColorHexes :: String -> String
function lowerColorHexes(arr) {
  return arr.map(lowerColorHex);
}
```

让我们把它们组合在一起。

```js
var lighterColor = arrayToString
  .compose(raiseColorHexes)
  .compose(stringToArray);
var darkerColor = arrayToString.compose(lowerColorHexes).compose(stringToArray);
console.log(lighterColor("af0189")); // Returns: 'bf129a'
console.log(darkerColor("af0189")); // Returns: '9e0078'
```

我们甚至可以一起使用compose（）和curry（）函数。 实际上，他们在一起工作得很好。 让我们将curry示例与我们的compose示例结合在一起。 首先，我们需要以前的帮助程序功能。

我们甚至可以同时使用compose()和curry()函数。它们搭配使用效果很好。让我们将curry示例与我们的compose示例结合在一起。我们需要上上小结的函数方法。

```js
// component2hex :: Ints -> Int
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
// nums2hex :: Ints* -> Int
function nums2hex() {
  return Array.prototype.map.call(arguments, componentToHex).join("");
}
```

我们创建柯里函数和部分应用的函数，然后将它们组合到其他组合函数中。

```js
var lighterColors = lighterColor.compose(nums2hex.curry());

var darkerRed = darkerColor.compose(nums2hex.partialApply(255));

var lighterRgb2hex = lighterColor.compose(nums2hex.partialApply());

console.log(lighterColors(123, 0, 22)); // Returns: 8cff11
console.log(darkerRed(123, 0)); // Returns: ee6a00
console.log(lighterRgb2hex(123, 200, 100)); // Returns: 8cd975
```

以上函数整体不错。我们从一件事的小功能开始。然后我们就可以把功能组合在一起了。

让我们看最后一个例子。 这是一个可将可变值的RGB值变亮的函数。 然后，我们可以使用组合从中创建新功能。

```js
// lighterColorNumSteps :: string -> num -> string
function lighterColorNumSteps(color, n) {
  for (var i = 0; i < n; i++) {
    color = lighterColor(color);
  }
  return color;
}

// now we can create functions like this:
var lighterRedNumSteps = lighterColorNumSteps.curry().compose(reds)(0, 0);
// and use them like this:
console.log(lighterRedNumSteps(5)); // Return: 'ff5555'
console.log(lighterRedNumSteps(2)); // Return: 'ff2222'
```

同样，我们可以轻松创建更多功能，以创建更浅和更深的蓝色，绿色，灰色，紫色或任何想要的颜色。 这是构造API的绝佳方法。

我们只是勉强了解函数组合可以做什么。 compose所做的是从JavaScript中夺走控制权。 通常，JavaScript将从左到右求值，但是现在解释器会说“好吧，其他的事情会处理好的，我就转到下一个。”现在compose()函数可以控制序列求值了！

这就是Lazy.js，Bacon.js和其他人能够实现诸如惰性求值和无限序列之类的方式的方式。 接下来，我们将研究如何使用这些库。

## 主要函数式编程

什么是没有副作用的程序？答案是：一个什么也不做的程序。

用具有不可避免的副作用的函数式代码来补充我们的代码可以称为“主要函数式编程”。在同一个代码库中使用多个范例并在它们最理想的地方应用它们是最好的方法。大多数情况下，函数式编程是建模纯传统函数式程序的方式：：将大部分逻辑保持在纯函数中，并与命令式代码接口。

这就是我们要编写自己的：‘a little application’编程方式。

在这个例子中，我们有一个老板告诉我们，我们需要一个用于跟踪员工可用性状态的web应用程序。这家虚构公司的所有员工只有一个工作：使用我们的网站。员工上班时会签到，离开时会签退。但这还不够，它还需要随着内容的变化自动更新内容，因此我们的老板不必不断刷新页面。

我们将使用Lazy.js作为我们的功能库：我们不必假装要处理所有登录和注销的用户，WebSocket，数据库等等，而是假装有一个通用应用程序对象为我们完成此任务的完美API。

所以现在，让我们把丑陋的部分，界面和创造副作用的部分去掉。

```js
function Receptor(name, available) {
  this.name = name;
  this.available = available; // mutable state

  this.render = function() {
    output = "<li>";
    output += this.available
      ? this.name + " is available"
      : this.name + " is not available";
    output += "</li>";
    return output;
  };
}
var me = new Receptor();
var receptors = app.getReceptors().push(me);
app.container.innerHTML = receptors
  .map(function(r) {
    return r.render();
  })
  .join("");
```

仅显示可用性列表就足够了，但我们希望它是反响应式的，这会给我们带来第一个难点。

通过使用Lazy.js库按顺序存储对象（在调用toArray()方法之前它实际上不会计算任何东西），我们可以利用其惰性求值来提供一种功能性的响应式编程。

```js
var lazyReceptors = Lazy(receptors).map(function(r) {
  return r.render();
});
app.container.innerHTML = lazyReceptors.toArray().join("");
```

因为Receptor.render()方法返回新的HTML而不是修改当前HTML，所以我们要做的就是将innerHTML参数设置为其输出。

用于用户管理的通用应用程序将提供回调方法供我们使用。

```js
app.onUserLogin = function() {
  this.available = true;
  app.container.innerHTML = lazyReceptors.toArray().join("");
};
app.onUserLogout = function() {
  this.available = false;
  app.container.innerHTML = lazyReceptors.toArray().join("");
};
```

这样，用户每次登录或注销时，都会再次计算lazyReceptors参数，并且将使用最新值打印可用性列表。

## 事件处理

如果应用程序不提供用户登录和注销时的回调该怎么办？ 回调很混乱，代码就变成了面条式代码。相反，我们可以通过直接观察用户来确定它。如果用户的网页处于焦点位置，则他/她必须处于活动状态且可用。我们可以使用JavaScript的focus和blur事件。

```js
window.addEventListener("focus", function(event) {
  me.available = true;
  app.setReceptor(me.name, me.available); // just go with it
  container.innerHTML = lazyReceptors.toArray().join("");
});
window.addEventListener("blur", function(event) {
  me.available = false;
  app.setReceptor(me.name, me.available);
  container.innerHTML = lazyReceptors.toArray().join("");
});
```

等一下，事件不是也有响应式吗？ 也可以惰性计算它们吗？ 在Lazy.js库中，甚至有一个方便的方法。

```js
var focusedReceptors = Lazy.events(window, "focus").each(function(e) {
  me.available = true;
  app.setReceptor(me.name, me.available);
  container.innerHTML = lazyReceptors.toArray().join("");
});
var blurredReceptors = Lazy.events(window, "blur").each(function(e) {
  me.available = false;
  app.setReceptor(me.name, me.available);
  container.innerHTML = lazyReceptors.toArray().join("");
});
```

以上非常简单。

`通过使用Lazy.js库处理事件，我们可以创建无限个事件序列。 每次触发事件时，Lazy.each()函数都可以迭代一次。`

到目前为止，我们的老板很喜欢这个应用程序，但他指出，如果一名员工在离开前一天没有关闭页面就从不注销，那么该应用程序会记录该员工仍然工作。

为了确定某个员工是否在网站上处于活动状态，我们可以监视键盘和鼠标事件。假设他们被认为在30分钟没有活动之后就不可用了。

```js
var timeout = null;
var inputs = Lazy.events(window, "mousemove").each(function(e) {
  me.available = true;
  container.innerHTML = lazyReceptors.toArray().join("");
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    me.available = false;
    container.innerHTML = lazyReceptors.toArray().join("");
  }, 1800000); // 30 minutes
});
```

Lazy.js库使我们很容易将事件处理为可以映射的无限流。它之所以能够做到这一点，是因为它使用函数组合来控制执行顺序。

但这一切都有点问题。如果没有可以锁定的用户输入事件呢？如果有一个属性值一直在变化呢？在下一节中，我们将详细分析这个问题。