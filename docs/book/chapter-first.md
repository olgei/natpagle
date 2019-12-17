# 简介

几十年来，函数式编程一直是计算机科学爱好者的推崇，因其数学上的纯洁性和令人费解等特性而倍受推崇，正因为这些特性使函数式编程一直隐藏在数据科学家和博士生计算机实验室中。但现在，它正在经历一次复苏，感谢现代语言，如Python、Julia、Ruby、Clojure和JavaScipt。

> 您说的是JavaScript吗？ web脚本语言？（答案是）是!

事实证明，JavaScript是一项重要的编程技术，并且很长时间内不会消失。 这在很大程度上是由于它具有旺盛的扩展新框架和库的能力，例如backbone.js，jQuery，Dojo，underscore.js等。 这与JavaScript作为功能性编程语言的特性相关。 往长期去看，对于各种语言技能的程序员来说，使用JavaScript进行函数式编程对提高编程能力是非常有好处的。

为什么？ 函数式编程功能强大，健壮且优雅。 它在大型数据结构上非常有用且高效。 使用JavaScript作为客户端语言，去操作DOM，对API响应进行排序或在复杂的网站上执行其他任务或实现功能，实现起来容易。

在本书中，您将学到使用JavaScript编程的相关知识：

- 如何使用函数式编程，如何解锁JavaScript的编程能力。
- 如何编写更好的代码，功能健壮且易于维护，下载速度更快，内存开销少。
- 学习函数式编程的核心概念，如何将特性应用于JavaScript。
- 如何避开使用JavaScript作为函数语言时可能出现的警告和问题。
- 如何在JavaScript开发中使用函数式编程和面向对象编程思想。

但在开始之前，我们先做个实验。

## 案例

案例可能是介绍特性的最佳方法，基于JavaScript编程，比较传统的编程方法和使用函数式编程实现相同功能。

## 应用

应用是一个通过运算咖啡种类和大小（杯）不同，产生不同价格的示例。

## 实现方法

首先，我们看下整个过程。

```js
// 创建对象存储数据.
var columbian = {
  name: "columbian",
  basePrice: 5
};
var frenchRoast = {
  name: "french roast",
  basePrice: 8
};
var decaf = {
  name: "decaf",
  basePrice: 6
};
// 实现一个计算器方法计算成本
// 根据大小显示在页面list上
function printPrice(coffee, size) {
  if (size == "small") {
    var price = coffee.basePrice + 2;
  } else if (size == "medium") {
    var price = coffee.basePrice + 4;
  } else {
    var price = coffee.basePrice + 6;
  }
  // create the new html list item
  var node = document.createElement("li");
  var label = coffee.name + " " + size;
  var textnode = document.createTextNode(label + " price: $" + price);
  node.appendChild(textnode);
  document.getElementById("products").appendChild(node);
}
// now all we need to do is call the printPrice function
// for every single combination of coffee type and size
printPrice(columbian, "small");
printPrice(columbian, "medium");
printPrice(columbian, "large");
printPrice(frenchRoast, "small");
printPrice(frenchRoast, "medium");
printPrice(frenchRoast, "large");
printPrice(decaf, "small");
printPrice(decaf, "medium");
printPrice(decaf, "large");

// 输出 =>
columbian small price: $7
columbian medium price: $9
columbian large price: $11
french roast small price: $10
french roast medium price: $12
french roast large price: $14
decaf small price: $8
decaf medium price: $10
decaf large price: $12
```

如上所见，此代码非常基础。 如果有比我们这里的三种咖啡更多的咖啡种类，该怎么办？ 如果有20、50个怎么办， 如果除了大小（杯）之外，加上有机和非有区别，那该怎么办？ 代码按照这样写下去，代码行会越来越多！使用以上方法，我们告诉咖啡机每种咖啡类型和尺寸的打印内容。 从根本上讲，这需要函数式编程解决问题所在。

## 函数式编程

功能编程（命令式代码）一步一步地告诉机器它需要做什么来解决问题，而函数式编程则试图用数学方法来描述问题，以便机器可以完成其余的工作。

使用更实用的方法，可以按如下方式编写相同的方法：

```js
// separate the data and logic from the interface
var printPrice = function(price, label) {
  var node = document.createElement("li");
  var textnode = document.createTextNode(label + " price: $" + price);
  node.appendChild(textnode);
  document.getElementById("products 2").appendChild(node);
};
// create function objects for each type of coffee
var columbian = function() {
  this.name = "columbian";
  this.basePrice = 5;
};
var frenchRoast = function() {
  this.name = "french roast";
  this.basePrice = 8;
};
var decaf = function() {
  this.name = "decaf";
  this.basePrice = 6;
};
// create object literals for the different sizes
var small = {
  getPrice: function() {
    return this.basePrice + 2;
  },
  getLabel: function() {
    return this.name + " small";
  }
};
var medium = {
  getPrice: function() {
    return this.basePrice + 4;
  },
  getLabel: function() {
    return this.name + " medium";
  }
};
var large = {
  getPrice: function() {
    return this.basePrice + 6;
  },
  getLabel: function() {
    return this.name + " large";
  }
};
// put all the coffee types and sizes into arrays
var coffeeTypes = [columbian, frenchRoast, decaf];
var coffeeSizes = [small, medium, large];
// build new objects that are combinations of the above
// and put them into a new array
var coffees = coffeeTypes.reduce(function(previous, current) {
  var newCoffee = coffeeSizes.map(function(mixin) {
    // `plusmix` function for functional mixins, see Ch.7
    var newCoffeeObj = plusMixin(current, mixin);
    return new newCoffeeObj();
  });
  return previous.concat(newCoffee);
}, []);
// we've now defined how to get the price and label for each
// coffee type and size combination, now we can just print them
coffees.forEach(function(coffee) {
  printPrice(coffee.getPrice(), coffee.getLabel());
});
```

首先应该清楚的是，它更模块化。这使得添加新大小（杯）或新咖啡类型变得简单，如下面的代码片段所示：

```js
var peruvian = function() {
  this.name = "peruvian";
  this.basePrice = 11;
};
var extraLarge = {
  getPrice: function() {
    return this.basePrice + 10;
  },
  getLabel: function() {
    return this.name + " extra large";
  }
};
coffeeTypes.push(Peruvian);
coffeeSizes.push(extraLarge);
```

咖啡对象数组和大小（杯）对象数组通过一个名为plusMixin的自定义函数“mixed”在一起，即它们的方法和成员变量组合在一起（请参见第7章，JavaScript中的面向函数和面向对象的编程）。

咖啡类型类包含成员变量，尺寸包含用于计算名称和价格的方法。 “mixing”发生在映射操作中，该操作将纯函数应用于数组中的每个元素，并在reduce()操作内部返回一个新函数，这是另一个类似于映射函数的高阶函数，只是其中的所有元素,数组合并为一个。

最后，使用forEach()方法迭代所有类型和大小的所有可能组合的新数组。forEach()方法是另一个高阶函数，它将回调函数应用于数组中的每个对象。 在上面示例中，我们将其作为匿名函数，该函数实例化对象并使用对象的getPrice()和getLabel()方法作为参数来调用printPrice()函数。

另外，通过删除coffee变量并将函数连接在一起，我们可以使这个示例更加实用，这是函数式编程中的另一个小技巧。

```js
coffeeTypes
  .reduce(function(previous, current) {
    var newCoffee = coffeeSizes.map(function(mixin) {
      // `plusMixin` function for functional mixins, see Ch.7
      var newCoffeeObj = plusMixin(current, mixin);
      return new newCoffeeObj();
    });
    return previous.concat(newCoffee);
  }, [])
  .forEach(function(coffee) {
    printPrice(coffee.getPrice(), coffee.getLabel());
  });
```

另外，函数式编程控制流并不像命令式代码那样自上而下。在函数式编程中，map()函数和其他高阶函数代替for和while循环，对执行顺序的关注程度很低。这使得新进入范例的人阅读代码变得有点棘手，但是，一旦你掌握了它的窍门，就不难理解了，你会发现它要好得多。

这个案例几乎没有涉及到函数式编程在JavaScript中能做什么，在这本书中，你将看到更强大的函数式编程方法的案例。
