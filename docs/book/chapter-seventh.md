# 简介

您会经常听到 JavaScript 是一种空白语言，其中 blank 是面向对象的，功能性的或通用的。 这本书着重于 JavaScript 作为一种函数式语言，并竭尽全力地证明了这一点。 但是事实是，JavaScript 是一种通用语言，这意味着它完全能够支持多种编程样式。 像 Python 和 F＃一样，JavaScript 是多范式的。但与这些语言不同，JavaScript 是基于原型 OOP 编程，而大多数其他通用语言是基于类的。

在最后一章中，我们将把函数式编程和面向对象的编程都与 JavaScript 相关联，并了解这两种范例如何相互补充和并存。 本章将讨论以下主题：

- JavaScript 如何具有函数式和 OOP？
- JavaScript 的 OOP –使用原型链
- 如何在 JavaScript 中混合函数式和 OOP
- 功能 inheritance (extends)
- 功能 mixins

写更好的代码是我们的目标。函数式和面向对象编程正是实现这一目标的手段。

## 多范式语言

如果面向对象编程意味着把所有变量都当作对象，而函数编程意味着把所有函数都当作变量，那么函数就不能被当作对象来对待吗？在 JavaScript 中，当然可以。

但是说函数式编程意味着把函数当作变量是有点不准确的。一个更好的说法是：函数式编程意味着将所有内容都视为值，特别是函数。

描述函数式编程的更好方法可能是将其称为声明式。 声明式编程独立于编程风格的必要分支，表达了解决问题所需的计算逻辑。 告诉计算机问题是什么，而不是如何解决问题的过程。

同时，面向对象的编程是从命令式编程风格派生而来的：计算机被分步指令如何解决问题。 OOP 要求将计算指令（方法）及其所处理的数据（成员变量）组织为称为对象的单元。 访问该数据的唯一方法是通过对象的方法。

那么如何将这两种风格融合在一起？

- 对象方法中的代码通常以命令式编写。 但是，如果它是函数式风格呢？ 毕竟，OOP 不会排除不可变的数据和高阶函数。
- 也许将两者结合起来的更纯粹的方法是将对象视为函数和基于类的对象。
- 也许我们可以简单地将函数式编程中的一些想法（例如 promise、递归）包含到面向对象的应用程序中。
- OOP 涵盖诸如封装，多态性和抽象之类的主题。 函数式编程也是如此，只是以一种不同的方式进行。因此，我们可以在面向函数式的应用程序中包含来自面向对象编程的方法。

关键是：OOP 和 FP 可以混合在一起，有几种方法可以做到，它们不相互排斥。

## 使用原型实现面向对象

JavaScript 是一种无类语言。 这并不意味着它比其他计算机语言更不流行。 类更少意味着它不像面向对象语言那样具有类结构。相反，它使用原型进行继承。

可能有 C++和 Java 背景下的程序员感到困惑，但基于原型的继承比传统继承更具表现力。下面是 C++与 JavaScript 之间的差异的简单比较：

| C++    | JavaScript |
| :----- | ---------: |
| 强类型 |     松散型 |
| 静态的 |     动态的 |
| 基于类 |   基于原型 |
| 类     |       功能 |
| 方法   |       功能 |

## 继承(Inheritance)

在进一步讨论之前，让我们确保充分理解面向对象编程中继承的概念。以下(伪)代码演示了基于类的继承：

```js
class Polygon {
  int numSides;
  function init(n) {
    numSides = n;
  }
}
class Rectangle inherits Polygon {
  int width;
  int length;
  function init(w, l) {
    numSides = 4;
    width = w;
    length = l;
  }
  function getArea() {
    return w * l;
  }
}
class Square inherits Rectangle {
  function init(s) {
    numSides = 4;
    width = s;
    length = s;
  }
}
```

Polygon 类是其他类继承的父类。 它仅定义一个成员变量，即边数，该变量在 init()函数中设置。 Rectangle 子类继承自 Polygon 类，并添加了另外两个成员变量 length 和 width 和方法 getArea()。 它不需要定义 numSides 变量，因为它已经由其继承的类定义，并且它也覆盖了 init()函数。 Square 类通过从 Rectangle 类继承其 getArea()方法来进一步继承此继承链。 通过再次简单地重写 init()函数以使长度和宽度相同，getArea()函数就可以保持不变，并且需要编写的代码更少。

在传统的 OOP 语言中，继承就是这样的。如果我们想向所有对象添加一个颜色属性，我们只需将其添加到多边形对象，而不必修改从其继承的任何对象。

## 原型链

JavaScript 的继承可以归结为原型。 每个对象都有一个称为其原型的内部属性，该属性是指向另一个对象的链接。 该对象具有自己的原型。 此模式可以重复进行，直到到达未定义为其原型的对象为止。 这就是原型链，这就是继承在 JavaScript 中的工作方式。下图解释了 JavaScirpt 中的继承：

![img](https://blog.ahthw.com/wp-content/uploads/2020/01/prototype.png)

当运行对对象函数定义的搜索时，JavaScript“遍历”原型链，直到找到具有正确名称的函数的第一个定义。因此，重写它就像在子类的原型上提供新的定义一样简单。

## Object.create()方法

正如用 JavaScript 创建对象有很多方法一样，复制基于类的经典继承也有很多方法。但最好的方法是使用 Object.create()方法。

```js
var Polygon = function(n) {
  this.numSides = n;
};
var Rectangle = function(w, l) {
  this.width = w;
  this.length = l;
};
// the Rectangle's prototype is redefined with Object.create
Rectangle.prototype = Object.create(Polygon.prototype);
// it's important to now restore the constructor attribute
// otherwise it stays linked to the Polygon
Rectangle.prototype.constructor = Rectangle;
// now we can continue to define the Rectangle class
Rectangle.prototype.numSides = 4;
Rectangle.prototype.getArea = function() {
  return this.width * this.length;
};
var Square = function(w) {
  this.width = w;
  this.length = w;
};
Square.prototype = Object.create(Rectangle.prototype);
Square.prototype.constructor = Square;
var s = new Square(5);
console.log(s.getArea()); // 25
```

对于许多人来说，这种语法可能看起来并不常见，但是通过一点实践，它将变得熟悉。 必须使用 prototype 关键字来访问所有对象都具有的内部属性[[Prototype]]。 Object.create()方法声明一个带有指定对象的新对象，以使其原型从其继承。 这样，可以在 JavaScript 中实现经典继承。

:::tip
Object.create()方法于 2011 年在 ECMAScript 5.1 中引入，被称为创建对象的新方法和首选方法。 这只是将继承集成到 JavaScript 中的许多尝试之一。 幸运的是，这种方法效果很好。
:::

在第 5 章范畴理论中构建 Maybe 类时看到了这种继承结构。下面是 Maybe、None 和 Just 类，它们像前面的示例一样相互继承。

```js
var Maybe = function() {};
var None = function() {};
None.prototype = Object.create(Maybe.prototype);
None.prototype.constructor = None;
None.prototype.toString = function() {
  return "None";
};
var Just = function(x) {
  this.x = x;
};
Just.prototype = Object.create(Maybe.prototype);
Just.prototype.constructor = Just;
Just.prototype.toString = function() {
  return "Just " + this.x;
};
```

这表明 JavaScript 中的类继承可以帮助我们函数式编程。

一个常见的错误是将构造函数传递到 Object.create()而不是原型对象。在子类尝试使用继承的成员函数之前，虽然不会抛出错误，但会使问题更加复杂。

```js
Foo.prototype = Object.create(Parent.prototype); // correct
Bar.prototype = Object.create(Parent); // incorrect
Bar.inheritedMethod(); // Error: function is undefined
```

如果 InheritedMethod()方法已附加到 Foo.prototype 类，则找不到该函数。 如果使用 Bar 构造函数中的`this.inheritedMethod = function(){...}`将`InheritedMethod()`方法直接附加到实例，则使用 Parent 作为`Object.create()`的参数可能是正确的。

## 函数式和 OOP

几十年来，面向对象编程一直是主要的编程范例。 它在全世界 101 个计算机科学课程中教授，而函数编程则不是。 这是软件架构师用来设计应用程序的功能，而函数式编程则不是。 而且这也很有意义：OOP 使抽象概念的概念化变得容易。 它使编写代码变得更加容易。

所以，除非你能让老板相信应用程序必须是全功能的，否则我们将在面向对象的世界中使用函数式编程。本节将探讨如何做到这一点。

## 函数继承

将函数式编程应用于 JavaScript 应用程序的最方便的方法也许是在 OOP 原则内使用大多数函数式样式，例如继承。

为了探索这是如何工作的，让我们构建一个简单的应用程序来计算产品的价格。 首先，我们需要一些产品类别：

```js
var Shirt = function(size) {
  this.size = size;
};
var TShirt = function(size) {
  this.size = size;
};
TShirt.prototype = Object.create(Shirt.prototype);
TShirt.prototype.constructor = TShirt;
TShirt.prototype.getPrice = function() {
  if (this.size == "small") {
    return 5;
  } else {
    return 10;
  }
};
var ExpensiveShirt = function(size) {
  this.size = size;
};
ExpensiveShirt.prototype = Object.create(Shirt.prototype);
ExpensiveShirt.prototype.constructor = ExpensiveShirt;
ExpensiveShirt.prototype.getPrice = function() {
  if (this.size == "small") {
    return 20;
  } else {
    return 30;
  }
};
```

然后我们可以将它们组织到一个 Store 类中，如下所示：

```js
var Store = function(products) {
  this.products = products;
};
Store.prototype.calculateTotal = function() {
  return (
    this.products.reduce(function(sum, product) {
      return sum + product.getPrice();
    }, 10) * TAX
  ); // start with $10 markup, times global TAX var
};
var TAX = 1.08;
var p1 = new TShirt("small");
var p2 = new ExpensiveShirt("large");
var s = new Store([p1, p2]);
console.log(s.calculateTotal()); // Output: 35
```

computeTotal()方法使用数组的 reduce()函数将所有产品的价格干净地加在一起。

但是如果我们需要一种动态方法来计算标记值怎么办？ 为此，我们可以转向一个称为“战略模式”的概念。

## 策略模式

策略模式是定义一系列可互换算法的方法。 OOP 程序员使用它在运行时操纵行为，但它基于一些函数式编程原则：

- 逻辑与数据分离 (Separation of logic and data)
- 功能组成 (Composition of functions)
- 用作一流的对象 (Functions as first-class objects)

还有一些 OOP 原则：

- 封装
- 继承

在前面解释过的计算产品成本的示例应用程序中，假设我们希望对某些客户给予优惠，并且必须调整加价以反映这一点。

因此，让我们创建一些客户类别：

```js
var Customer = function() {};
Customer.prototype.calculateTotal = function(products) {
  return (
    products.reduce(function(total, product) {
      return total + product.getPrice();
    }, 10) * TAX
  );
};
var RepeatCustomer = function() {};
RepeatCustomer.prototype = Object.create(Customer.prototype);
RepeatCustomer.prototype.constructor = RepeatCustomer;
RepeatCustomer.prototype.calculateTotal = function(products) {
  return (
    products.reduce(function(total, product) {
      return total + product.getPrice();
    }, 5) * TAX
  );
};
var TaxExemptCustomer = function() {};
TaxExemptCustomer.prototype = Object.create(Customer.prototype);
TaxExemptCustomer.prototype.constructor = TaxExemptCustomer;
TaxExemptCustomer.prototype.calculateTotal = function(products) {
  return products.reduce(function(total, product) {
    return total + product.getPrice();
  }, 10);
};
```

每个 Customer 类都封装算法。 现在，我们只需要 Store 类来调用 Customer 类的 calculateTotal()方法。

```js
var Store = function(products) {
  this.products = products;
  this.customer = new Customer();
  // bonus exercise: use Maybes from Chapter 5 instead of a
  default customer instance
}

Store.prototype.setCustomer = function(customer) {
  this.customer = customer;
}
Store.prototype.getTotal = function(){
  return this.customer.calculateTotal(this.products);
};
var p1 = new TShirt('small');
var p2 = new ExpensiveShirt('large');
var s = new Store([p1,p2]);
var c = new TaxExemptCustomer();
s.setCustomer(c);
s.getTotal(); // Output: 45
```

Customer 类进行计算，Product 类保存数据（价格），Store 类维护上下文。这将实现非常高的凝聚力，并将面向对象编程和函数编程很好地结合起来。JavaScript 的高级表达能力使得这一点成为可能，而且非常简单。

## Mixins

简而言之，mixins 是可以允许其他类使用其方法的类。 这些方法仅应由其他类使用，并且 mixin 类本身永远不会实例化。 这有助于避免继承的歧义。 它们是将函数式编程与面向对象的编程相结合的好方法。

在每种语言中，mixin 的实现方式都不同。 由于 JavaScript 的灵活性和表现力，mixin 被实现为仅具有方法的对象。 尽管可以将它们定义为函数对象(即`var mixin = function(){...};`)，但是对于代码的结构学科而言，将它们定义为对象常量（即`var mixin = {...};`）。 这将帮助我们区分类和混合。 毕竟，mixins 应该被视为进程，而不是对象。

让我们开始声明一些混合。 我们将从上一节扩展我们的 Store 应用程序，使用 mixins 扩展类。

```js
var small = {
  getPrice: function() {
    return this.basePrice + 6;
  },
  getDimensions: function() {
    return [44, 63];
  }
};
var large = {
  getPrice: function() {
    return this.basePrice + 10;
  },
  getDimensions: function() {
    return [64, 83];
  }
};
```

不仅如此。 可以添加更多的 mixin，例如颜色或织物材料。 我们将不得不稍微重写一下 Shirt 类，如以下代码片段所示：

```js
var Shirt = function() {
  this.basePrice = 1;
};
Shirt.getPrice = function() {
  return this.basePrice;
};
var TShirt = function() {
  this.basePrice = 5;
};
TShirt.prototype = Object.create(Shirt.prototype);
TShirt.prototype.constructor = TShirt;
```

我们终于可以使用 mixins 了。

### 经典Mixins

您可能想知道这些 mixins 如何与类混合。经典方法是将 mixin 的功能复制到接收对象中。 这可以通过对 Shirt 原型的以下扩展来完成：

```js
Shirt.prototype.addMixin = function(mixin) {
  for (var prop in mixin) {
    if (mixin.hasOwnProperty(prop)) {
      this.prototype[prop] = mixin[prop];
    }
  }
};
```

这样可以按以下方式添加 mixins：

```js
TShirt.addMixin(small);
var p1 = new TShirt();
console.log(p1.getPrice()); // Output: 11
TShirt.addMixin(large);
var p2 = new TShirt();
console.log(p2.getPrice()); // Output: 15
```

但是，存在一个主要问题。 再次计算 p1 的价格时，它将返回 15，即大型商品的价格。 它应该是一个小的 price。

```js
console.log(p1.getPrice()); // Output: 15
```

问题在于，每次向其添加 mixin 时，都会重写 Shirt 对象的 prototype.getPrice()方法。 这根本不是很有功能，不是我们想要的。

### plusMixins

还有另一种使用 mixin 的方法，一种与函数式编程更加一致的方法。

无需将 mixin 的方法复制到目标对象，我们需要创建一个新对象，该对象是添加了 mixin 的方法的目标对象的副本。必须首先克隆该对象，这可以通过创建一个新对象来实现。 从其继承的对象。 我们将这种变体称为 plusMixin。

```js
Shirt.prototype.plusMixin = function(mixin) {
  // create a new object that inherits from the old
  var newObj = this;
  newObj.prototype = Object.create(this.prototype);
  for (var prop in mixin) {
    if (mixin.hasOwnProperty(prop)) {
      newObj.prototype[prop] = mixin[prop];
    }
  }
  return newObj;
};
var SmallTShirt = Tshirt.plusMixin(small); // creates a new class
var smallT = new SmallTShirt();
console.log(smallT.getPrice()); // Output: 11
var LargeTShirt = Tshirt.plusMixin(large);
var largeT = new LargeTShirt();
console.log(largeT.getPrice()); // Output: 15
console.log(smallT.getPrice()); // Output: 11 (not effected by 2nd mixin call)
```

现在我们可以使用 mixins 真正发挥作用了。 我们可以创建产品和 mixin 的所有可能组合。

```js
// in the real world there would be way more products and mixins!
var productClasses = [ExpensiveShirt, Tshirt];
var mixins = [small, medium, large];
// mix them all together
products = productClasses.reduce(function(previous, current) {
  var newProduct = mixins.map(function(mxn) {
    var mixedClass = current.plusMixin(mxn);
    var temp = new mixedClass();
    return temp;
  });
  return previous.concat(newProduct);
}, []);
products.forEach(function(o) {
  console.log(o.getPrice());
});
```

为了使其更加面向对象，我们可以使用此功能重写 Store 对象。 我们还将向 Store 对象（而不是产品）添加显示功能，以保持界面逻辑和数据分离。

```js
// the store
var Store = function() {
  productClasses = [ExpensiveShirt, TShirt];
  productMixins = [small, medium, large];
  this.products = productClasses.reduce(function(previous, current) {
    var newObjs = productMixins.map(function(mxn) {
      var mixedClass = current.plusMixin(mxn);
      var temp = new mixedClass();
      return temp;
    });
    return previous.concat(newObjs);
  }, []);
};
Store.prototype.displayProducts = function() {
  this.products.forEach(function(p) {
    $("ul#products").append(
      "<li>" + p.getTitle() + ":$" + p.getPrice() + "</li>"
    );
  });
};
```

我们要做的就是创建一个 Store 对象并调用其 displayProducts()方法来生成产品和价格的列表`

```text
<ul id="products">
  <li>small premium shirt: $16</li>
  <li>medium premium shirt: $18</li>
  <li>large premium shirt: $20</li>
  <li>small t-shirt: $11</li>
  <li>medium t-shirt: $13</li>
  <li>large t-shirt: $15</li>
</ul>
```

这些行需要添加到产品类和 mixins 中，以使前面的输出起作用：

```js
Shirt.prototype.title = 'shirt';
TShirt.prototype.title = 't-shirt';
ExpensiveShirt.prototype.title = 'premium shirt';
// then the mixins got the extra 'getTitle' function:
var small = {
  ...
  getTitle: function() {
    return 'small ' + this.title; // small or medium or large
  }
}
```

而且，就像这样，我们有一个高度模块化和可扩展的电子商务应用程序。 可以轻松地添加新的衬衫样式，只需定义一个新的 Shirt 子类并向其中添加 Store 类的数组产品类即可。 Mixins 以相同的方式添加。 因此，现在当老板说：“嘿，我们有一种新型的衬衫和外套，每种都有标准颜色，我们需要在今天回家之前将它们添加到网站上”，我们可以放心，我们不会熬夜！

## 小结

JavaScript 具有很高的表现力。 这使得混合函数式和面向对象编程成为可能。 现代 JavaScript 不仅是 OOP 或功能，而且是两者的结合。Strategy Pattern 和 mixins 之类的概念非常适合 JavaScript 的原型结构，它们有助于证明当今的 JavaScript 中的最佳实践共享了相同数量的函数编程和面向对象编程。

如果你从这本书中只拿走一件事，我希望它是如何将函数式编程技术应用到实际应用中。这一章向你展示了如何做到这一点。
