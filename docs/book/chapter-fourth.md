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

因此，currying不能与接受可变数量的参数的函数配合使用。 对于这种情况，首选部局部应用。这些不仅是为了函数工厂和代码重用。 柯里化和局部应用会发挥更大的作用，称为组合模式(Function composition)。
