# 简介

我们是否需要了解高级数学（类别理论，Lambda微积分，多态性），才能使用函数式编程编写应用程序？ 我们需要重新造轮子吗？ 毋庸置疑，不需要。

在本章中，我们将调研影响我们用JavaScript编写函数式编程方式的各个方面。

- 库 Libraries
- 工具包 Toolkits
- 开发环境 Development environments
- 编译为函数式编程的JavaScript特性 Functional language that compiles to JavaScript
- 其它

首先明确，JavaScript基础库的当前状况是非常不稳定的。 像其它编程语言一样，开发者社区对语言的维护在周期性变化。 可以采用新的基础库，随时放弃旧库。 例如，在本书撰写过程中，其开源社区已为I/O提供了流行且稳定的Node.js平台，它的未来还是不确定的。

因此，从本章中最重要的概念不是如何使用当前的库进行函数编程，而是如何使用任何增强JavaScript函数编程方法的库。 本章将以探索JavaScript中存在的所有多种风格的函数式编程为目标，探索尽可能多的库。

## JavaScript的函数式编程库

每个程序员都编写自己的函数库，而函数式JavaScript程序员也不例外。 使用当今的开源代码托管平台（例如GitHub，Bower和NPM），可以更轻松地共享，协作和扩展这些库。 存在许多用于使用JavaScript进行功能编程的库，范围从微型工具包到整体式模块库。

每个库都推广自己的函数式编程风格。 从严格的，基于数学的风格到宽松的，非正式的样式，每个库都是不同的，但是它们都具有一个共同的特征：它们都具有抽象的JavaScript功能，以提高代码的重用性，可读性和健壮性。

在撰写本文时，单个库尚未定为为官方js标准。 有人可能会说underscore.js是其中之一，但是，正如您将在下一节中看到的那样，建议避免使用underscore.js。

## Underscore.js

在许多人眼中，underscore已成为标准的功能性JavaScript库。 它是成熟，稳定的，由Backbone.js和CoffeeScript库创建者Jeremy Ashkenas开发。 underscore实际上是Ruby的Enumerable模块的重新实现，这解释了为什么CoffeeScript也受Ruby影响。

与jQuery相似，underscore没有扩展任何 JavaScript 内置对象，而是使用符号定义其自己的对象：下划线字符“ _”。 因此，使用underscore.js可以像这样书书写：

```js
var x = _.map([1, 2, 3], Math.sqrt); // Underscore's map function
console.log(x.toString());
```

JavaScrip Array对象的原生map()方法，其工作方式如下：

```js
var x = [1, 2, 3].map(Math.sqrt);
```

区别在于，在underscore中，将Array对象和callback()函数作为参数传递给underscore对象的map()方法(_.map)，而不是仅将回调传递给数组的原生map()方法（Array.prototype.map）。

除了map()和其他内置函数之外，underscore还有其他方法来加强。它有很多非常方便的函数，比如find()、invoke()、cluck()、sortyBy()、groupBy()等等。

```js
var greetings = [
  { origin: "spanish", value: "hola" },
  { origin: "english", value: "hello" }
];
console.log(_.pluck(greetings, "value"));
// Grabs an object's property.
// Returns: ['hola', 'hello']
console.log(
  _.find(greetings, function(s) {
    return s.origin == "spanish";
  })
);
// Looks for the first obj that passes the truth test
// Returns: {origin: 'spanish', value: 'hola'}
greetings = greetings.concat(
  _.object(["origin", "value"], ["french", "bonjour"])
);
console.log(greetings);
// _.object creates an object literal from two merged arrays
// Returns: [{origin: 'spanish', value: 'hola'},
//{origin: 'english', value: 'hello'},
//{origin: 'french', value: 'bonjour'}]
```

underscore提供了一种将方法链接在一起的方法：

```js
var g = _.chain(greetings)
  .sortBy(function(x) {
    return x.value.length;
  })
  .pluck("origin")
  .map(function(x) {
    return x.charAt(0).toUpperCase() + x.slice(1);
  })
  .reduce(function(x, y) {
    return x + " " + y;
  }, "")
  .value();
// Applies the functions
// Returns: 'Spanish English French'
console.log(g);
```

_.chain() 方法返回包含所有underscore函数的包装对象。然后使用值方法来提取包装对象的值。包裹对象对于将underscore与面向对象编程混合也是非常有用的。

尽管开发者社区代码易于使用，但underscore.js库却因编写过于冗长的代码并鼓励错误的模式而受到批评。 underscore的结构可能不理想，甚至功能不全！

在Brian Bons Lonsdorf的演讲youtube视频中“Hey underscore! you're doing it wrong!”中，underscore1.7.0版本中明确给我们我们扩展诸如map()，reduce()，filter()和更多带来阻力。

> 视频：[www.youtube.com/watch?v=m3svKOdZij](https://www.youtube.com/watch?v=m3svKOdZij)

```js
_.prototype.map = function(obj, iterate, [context]) {
  if (Array.prototype.map && obj.map === Array.prototype.map)
    return obj.map(iterate, context);
  // ...
};
```

就范畴理论而言，map()是一个同态函子接口（在第5章范畴理论中对此有更多介绍）。而且我们应该能够将map定义为所需的函子。 因此，这并不是underscore的功能。

而且由于JavaScript没有内置的不可变数据，因此libraries库应谨慎使用，以免其辅助函数改变传递给它的对象。 下面展示了此问题的一个很好的例子。 该代码段的目的是返回一个新的selected列表，并将一个选项设置为默认选项。 但是实际发生的是selected列表在适当位置发生了变化。

```js
function getSelectedOptions(id, value) {
  options = document.querySelectorAll("#" + id + " option");
  var newOptions = _.map(options, function(opt) {
    if (opt.text == value) {
      opt.selected = true;
      opt.text += " (this is the default)";
    } else {
      opt.selected = false;
    }
    return opt;
  });
  return newOptions;
}
var optionsHelp = getSelectedOptions("timezones", "Chicago");
```

我们将不得不插入`opt = opt.cloneNode()`到`callback()`函数，以复制要传递给该函数的列表中的每个对象。 underscore的map()函数为提高性能，但这是以功能缺失付出代价的。 原生Array.prototype.map()函数不需要此功能，因为它可以进行复制，但也不适用于nodelist列表集合。

对于数学上正确的函数式编程，underscore可能不太理想，但是它也从来没有打算将JavaScript扩展或转换为纯函数式语言。 它将自己定义为一个JavaScript库，该库提供了许多有用的功能编程tips。 它可能只是类似的功能或functional-like的集合，也不是严肃的功能库。

有没有更好的库？ 也许是一种基于数学的方法？

## Fantasy Land

[Fantasy Land 简介](https://github.com/fantasyland/fantasy-land)：JavaScript中常见代数结构的互操作性规范

Fantasy Land是功能库的集合，以及有关如何在JavaScript中实现“代数结构”的正式规范。 更具体地说，Fantasy Land指定了常见代数结构或简称代数的互操作性：monads，monoid，setoid，functors，chains,等。 他们的名字听起来很吓人，但它们只是一组值，一组运算符以及必须遵守的一些规则。 换句话说，它们只是对象。

运作方式如下。 每个代数都是一个单独的Fantasy Land规范，并且可能依赖于需要实现的其他代数。

![fantasy-land](https://blog.ahthw.com/wp-content/uploads/2019/12/fantasy-land.png)

一些代数规范包括：

- Setoids:
  - 实现自反性、对称性和传递性
  - 定义equals()方法
- Semigroups
  - 实现联想法
  - 定义concat()方法
- Monoid
  - 实现right identity, left identity
  -定义empty()方法
- Functor
  - 实现identity 和 composition规则
  - 实现map()方法

我们不一定需要确切知道每个代数的用途，但是它一定会有所帮助，特别是如果您正在编写自己的符合规范的库。 它不只是抽象的废话，它概述了一种实现称为类别理论的高级抽象的方法。 类别理论的完整解释可以在第5章类别理论中找到。

Fantasy Land不仅告诉我们如何实现函数式编程，还提供了一组JavaScript函数模块。 但是，文档少且不完整，文档很少。 其实，Fantasy Land并不是唯一实现其开源规范的库。 其他的也有，即：Bilby.js。

## Bilby.js

[Bilby.js 简介](https://github.com/puffnfresh/bilby.js)：面向JavaScript的严肃函数式编程库。

Bilby到底是什么？ 看logo像老鼠又像兔子，比较怪异。 但是，bilib.js库符合Fantasy Land规范。

 正如其文档所述，它应用类别理论来实现高度抽象的代码功能性，这意味着它启用了引用透明的程序。更多说明可以看它的[文档](http://bilby.brianmckenna.org/)。

- 多种ad-hoc多态性的不可变多方法
- 功能数据结构
- 函数语法的运算符重载
- 自动化规范测试（ScalaCheck、QuickCheck）

到目前为止，Bilby.js是最成熟的库，它符合Fantasy Land的代数结构规范，它是完全致力于函数式编程方式的绝佳资源。

举个例子：

```js
// environments in bilby are immutable structure for multimethods
var shapes1 = bilby
  .environment()
  // can define methods
  .method(
    "area", // methods take a name
    function(a) {
      return typeof a == "rect";
    }, // a predicate
    function(a) {
      return a.x * a.y;
    } // and an implementation
  )
  // and properties, like methods with predicates that always
  // return true
  .property(
    "name", // takes a name
    "shape"
  ); // and a function
// now we can overload it
var shapes2 = shapes1.method(
  "area",
  function(a) {
    return typeof a == "circle";
  },
  function(a) {
    return a.r * a.r * Math.PI;
  }
);
var shapes3 = shapes2.method(
  "area",
  function(a) {
    return typeof a == "triangle";
  },
  function(a) {
    return (a.height * a.base) / 2;
  }
);
// and now we can do something like this
var objs = [
  { type: "circle", r: 5 },
  { type: "rect", x: 2, y: 3 }
];
var areas = objs.map(shapes3.area);
// and this
var totalArea = objs.map(shapes3.area).reduce(add);
```

这就是范畴理论和ad-hoc多态性的作用。再次，范畴理论将在第5章:范畴理论中全面介绍。

> 类别理论是数学的一个最近活跃的分支，功能程序员使用它来最大化其代码的抽象性和实用性。 但是有一个主要缺点：很难概念化并快速入门。

事实是，Bilby和Fantasy Land确实实现了在扩展JavaScript函数编程的可能性。 尽管发展令人兴奋，但业界可能还没有为Bibly和Fantasy Land所推动的那种硬核功能风格做好准备。

如此功能强大的JavaScript上如此宏伟的库也许不是我们要做的。 毕竟，我们着手探索补充JavaScript的功能技术，而不是建立功能性编程条款。 让我们将注意力转向另Lazy.js。

## Lazy.js

[lazy.js 简介](https://github.com/dtao/lazy.js)：Like Underscore, but lazier.

Lazy.js是一个更实用的工具库，与underscore.js库类似，但具有惰性求值策略。 因此，Lazy通过功能上计算无法立即解释的序列结果来使不可能成为可能，具有显着的性能提升。

Lazy.js库很年轻。 但是它背后蕴藏着巨大的发展动力和代码社区热情。

在Lazy中思想是：所有的东西都是一个序列，我们可以迭代。由于库控制方法应用顺序的方式，可以实现许多真正酷的事情：异步迭代（并行编程）、无限序列、函数反应式编程等。

举个例子：

```js
// Get the first eight lines of a song's lyrics
var lyrics = "Lorem ipsum dolor sit amet, consectetur adipiscing eli";
// Without Lazy, the entire string is first split into lines
console.log(lyrics.split("\n").slice(0, 3));
// With Lazy, the text is only split into the first 8 lines
// The lyrics can even be infinitely long!
console.log(
  Lazy(lyrics)
    .split("\n")
    .take(3)
);

//First 10 squares that are evenly divisible by 3
var oneTo1000 = Lazy.range(1, 1000).toArray();
var sequence = Lazy(oneTo1000)
  .map(function(x) {
    return x * x;
  })
  .filter(function(x) {
    return x % 3 === 0;
  })
  .take(10)
  .each(function(x) {
    console.log(x);
  });
// asynchronous iteration over an infinite sequence
var asyncSequence = Lazy.generate(function(x) {
  return x++;
})
  .async(100) // 0.100s intervals between elements
  .take(20) // only compute the first 20
  .each(function(e) {
    // begin iterating over the sequence
    console.log(new Date().getMilliseconds() + ": " + e);
  });
```

第4章，在JavaScript中实现函数式编程技术中会介绍更多示例和用例。

但是，将Lazy.js库完全归功于此想法并不完全正确。 它的前身之一Bacon.js库的功能几乎相同。

## Bacon.js

[Bacon.js简介](https://github.com/baconjs/bacon.js) ：用于TypeScript和JavaScript的函数响应式编程库。

![Bacon.js](https://blog.ahthw.com/wp-content/uploads/2019/12/bacon.png)

函数式编程库的必备者，Bacon.js本身就是用于函数式反应式编程的库。 功能性反应式编程仅表示功能性设计模式用于表示反应性且始终在变化的值，例如鼠标在屏幕上的位置或价格
公司的股票。 与Lazy可以通过不计算直到需要的值来摆脱创建无限序列的方式一样，Bacon可以避免在最后一秒钟之前就不必计算不断变化的值。

Bacon.js是函数式编程库的必备者，本身就是用于函响应式编程的库。 函数响应式编程仅仅意味着函数式设计模式被用来表示反应式且总是变化的值，例如鼠标在屏幕上的位置或公司股票的价格。就像Lazy可以通过在需要时才计算值来创建无限序列一样，Bacon可以避免在最后一秒之前计算不断变化的值。

在Lazy.js中被称为序列的序列在Bacon中称为EventStreams和Properties，因为它们更适合处理事件（onmouseover、onkeydown等）和反应性属性（滚动位置、鼠标位置、切换等）。

```js
Bacon.fromEventTarget(document.body, "click").onValue(function() {
  alert("Bacon!");
});
```

Bacon.js比Lazy.js体积稍大一点，但是它的功能集大约只有Lazy.js的一半，它的开发者社区热情也比较活跃。

## 其它提名

在本书的范围之内，实在太多库无法做到全部覆盖。 让我们看看更多用于JavaScript进行函数式编程的库。

- Functional
  - 可能是JavaScript中第一个用于函数式编程的库，Functional是一个包含全面的高阶函数支持以及字符串lambda的库
- wu.js
  - wu.js库尤其因其curryable()函数而倍受赞誉，它是一个非常不错的函数式编程库。 这是（我所知道的）第一个实现惰性计算的库，它使Bacon.js，Lazy.js和其他库的运行更加顺畅
  - 是的，它是以声名狼藉的说唱团体Wu Tang Clan命名的
- sloth.js
  - 与Lazy.js库非常相似，但更小
- stream.js
  - stream.js库支持无限流，而没有太多其他支持
  - 绝对小巧
- lodash.js
  - 顾名思义，lodash.js库的灵感来自underscore.js库
  - 高度优化
- Sugar
  - Sugar是JavaScript的函数式编程技术（如Underscore）的支持库，但是在实现方式上存在一些关键差异
  - 与其在underscore中执行`_.pluck(myObjs，'value')`，不如在Sugar中执行`myObjs.map('value')`。 这意味着它会修改JavaScript内置对象，因此存在很小的风险，即它不能与其他类似原型的库很好地配合使用
  - 非常好的文档、单元测试、分析工具等
- from.js
  - 用于JavaScript的新功能库和LINQ（语言集成查询）引擎，支持.NET提供的大多数相同的LINQ函数
  - 100％惰性求值并支持lambda表达式
  - 诞生不久，但是文档非常棒
- JSLINQ
  - 另一个用于JavaScript的函数式LINQ引擎
  - 比from.js library更老更成熟
- Boiler.js
  - 另一个实用程序库，它将JavaScript的函数方法扩展到更多的原语：字符串、数字、对象、集合和数组
- Folktale
  - 与Bilby.js库一样，Folktale是另一个实现Fantasy Land规范的新库。和它的前辈一样，也是一个JavaScript函数编程库的集合。它很年轻，但未来可期。
- jQuery
  - 看到这里提到的jQuery感到惊讶吗？尽管jQuery不是用来执行函数式编程的工具，但它本身是函数式的。jQuery可能是最广泛使用的库之一，其根源在于函数式编程。
  - jQuery对象实际上是一个monad。jQuery使用一元法则来启用方法链接：`$('#mydiv').fadeIn().css('left': 50).alert('hi!');`

在第7章，JavaScript中的函数式和面向对象编程中可以找到对此的完整解释。

- 它的一些方法是高阶的：`$('li').css('left': function(index){return index*50});`
- 从jQuery 1.8开始，deferred.then参数实现了一个功能被称为Promises.的概念。
- jQuery是一个抽象层，主要用于DOM。 它不是框架或工具包，而只是使用抽象来增加代码重用和减少原生丑陋代码的一种方式。 那不是函数式编程的全部内容吗？

## 搭建开发生产环境

### 环境

就编程风格而言，开发应用程序并将在其中部署哪种类型的环境无关紧要。但是，对于库来说，这确实很重要。

### 浏览器

大多数JavaScript应用程序都设计为在客户端（即客户端的浏览器）中运行。 基于浏览器的环境非常适合开发，因为浏览器无处不在，您可以直接在本地计算机上处理代码，解释器是浏览器的JavaScript引擎，并且所有浏览器都具有开发者控制台。 Firefox的FireBug提供了非常有用的错误消息，并提供了断点等功能，但是在Chrome和Safari中运行相同的代码来交叉引用错误输出通常会很有帮助。 甚至Internet Explorer也包含开发人员工具。

浏览器的问题在于它们对JavaScript的解释不同！ 尽管不常见，但可以在不同的浏览器中编写返回不同结果的代码。 但是通常区别在于它们对待文档对象模型的方式，而不是原型和函数的工作方式。 显然，`Math.sqrt(4)`方法在所有浏览器和`shell`返回2。 但是`scrollLeft`方法取决于浏览器的布局策略。

编写特定于浏览器的代码是浪费时间，这是为什么要使用库的另一个原因。

### 服务器端JavaScript

Node.js库已成为创建服务器端和基于网络的应用程序的标准平台。 函数式编程可以用于服务器端应用程序编程吗？ 答案：是! 但是是否存在为此性能关键环境设计的功能库？ 答案也是：是的。

本章概述的所有功能库都可以在Node.js库中使用，其中许多功能都依赖于browserify.js模块来处理浏览器元素。

### 服务器端环境中的功能用例

服务器端应用程序开发人员经常关心并发性。 经典示例是一个允许多个用户修改同一文件的应用程序。 但是，如果他们尝试同时修改它，您将陷入一团糟。 这是困扰数十年来程序员的状态问题的维持。

假定以下情况：

1. 一天早上，亚当打开了一份报告进行编辑，但他在午餐之前没有保存报告。
2. 比利打开相同的报告，添加他的笔记，然后将其保存。
3. 亚当从午餐回来后，将他的笔记添加到报告中，然后将其保存，在不知不觉中覆盖了比利的笔记。
4. 第二天，比利发现他的笔记丢失了。 老板对他大吼； 每个人都会生气，他们会误导那些失职的应用程序开发人员。

长期以来，解决此问题的方法是创建有关文件的状态。 当某人开始编辑锁定状态时，将其锁定为打开状态，这将阻止其他人对其进行编辑，然后在保存后将其切换为关闭状态。 在我们的情况下，直到亚当从午餐中回来之前，比利才能做他的工作。 而且，如果它从未保存过（例如，如果亚当决定在午休时间中途辞职），那么没人会对其进行编辑。

在这里，函数式编程关于不变数据和状态（或缺少状态）的思想可以真正发挥作用。 与其让用户直接使用功能性方法来修改文件，不如让他们修改文件的副本，这是一个新的修订版。 如果他们去保存修订，并且已经存在一个新修订，那么我们知道其他人已经修改了旧修订。 避免危机。

现在，之前的场景将像这样展开：

1. 一天早晨，亚当打开一份报告进行编辑。 但是他在午餐之前没有保存它。
2. 比利打开相同的报告，添加他的笔记，并将其另存为新修订。
3. 亚当午餐后回来添加笔记。 当他尝试保存新修订时，应用程序告诉他现在存在新修订。
4. 亚当打开新修订，添加注释，然后保存另一个新修订。
5. 通过查看修订历史记录，老板可以看到一切运行顺利。 每个人都很高兴，应用程序开发人员得到了晋升和加薪。

这称为事件源。 没有要维护的明确状态，只有事件。 该过程更加简洁，事件的清晰历史可以回顾。

这个想法以及其他许多想法是为什么服务器端环境中的函数式编程正在兴起的原因。

### CLI

尽管Web和node.js库是两个主要的JavaScript环境，但一些务实而又冒险的用户正在寻找在命令行中使用JavaScript的方法。

使用JavaScript作为命令行界面（CLI）脚本语言可能是应用函数编程的最佳机会之一。 想象一下，在搜索本地文件时可以使用惰性计算，也可以将整个bash脚本重写为功能齐全的JavaScript单行代码。

### 将功能库与JavaScript模块一起使用

Web应用程序由各种各样的东西组成：框架，库，API等。 它们可以作为依赖项，插件或作为共存对象而彼此协同工作。

- Backbone.js
  - 具有RESTful JSON接口的MVP（模型视图提供程序）框架
  - 需要underscore.js库，这是Backbone唯一的硬依赖性
- jQuery
  - Bacon.js库具有用于与jQuery混合的绑定特性
  - underscore.js和jQuery很好地互补
- Prototype JavaScript Framework
  - 以最接近Ruby可枚举的方式为JavaScript提供集合函数
- Sugar.js
  - 修改JavaScript内置对象及其方法
  - 与其他库（尤其是原型库）混合使用时必须小心

### 编译成JavaScript的功能语言

有时候，在JavaScript的内部功能之上，类似C的语法的厚实外表足以让您想要切换到另一种函数式语言。

- Clojure和ClojureScript
  - Closure是一种现代的Lisp实现和一种功能齐全的函数式语言
  - ClojureScript将Clojure转换为JavaScript
- CoffeeScript
  - CoffeeScript是功能语言和用于将该语言反编译为JavaScript的编译器的名称
  - CoffeeScript中的表达式与JavaScript中的表达式之间的一对一映射

还有更多，包括Pyjs，Roy，TypeScript，UHC等。

## 小结

选择使用哪个库取决于你的需求。 需要响应式编程来处理事件和动态值吗？ 使用Bacon.js库。 只需要无限的流，别无其他？ 使用stream.js库。 想要用函数助手来补充jQuery吗？ 试试underscore.js库。 是否需要一个结构化的环境来实现严肃的多态性？ 使用bilby.js库。 需要功能完善的工具进行功能编程吗？ 使用Lazy.js库。如果这些都不满足你的功能，可以尝试自己开发。

何库都只能使用它的方式。 尽管本章概述的一些库有一些缺陷 正确使用库并满足你的需要由你的具体场景决定。

而且，如果我们将代码库导入到我们的JavaScript环境中，那么也许我们也可以导入思想和原则。 也许我们可以通过蒂姆·彼得（Tim Peter）《python之禅》来了解：

```text
Beautiful is better than ugly
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one—and preferably only one—obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than "right" now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea—let's do more of those!

优美胜于丑陋（Python 以编写优美的代码为目标）
明了胜于晦涩（优美的代码应当是明了的，命名规范，风格相似）
简洁胜于复杂（优美的代码应当是简洁的，不要有复杂的内部实现）
复杂胜于凌乱（如果复杂不可避免，那代码间也不能有难懂的关系，要保持接口简洁）
扁平胜于嵌套（优美的代码应当是扁平的，不能有太多的嵌套）
间隔胜于紧凑（优美的代码有适当的间隔，不要奢望一行代码解决问题）
可读性很重要（优美的代码是可读的）
即便假借特例的实用性之名，也不可违背这些规则（这些规则至高无上）
不要包容所有错误，除非你确定需要这样做（精准地捕获异常，不写 except:pass 风格的代码）
当存在多种可能，不要尝试去猜测
而是尽量找一种，最好是唯一一种明显的解决方案（如果不确定，就用穷举法）
虽然这并不容易，因为你不是 Python 之父（这里的 Dutch 是指 Guido ）
做也许好过不做，但不假思索就动手还不如不做（动手之前要细思量）
如果你无法向人描述你的方案，那肯定不是一个好方案；反之亦然（方案测评标准）
命名空间是一种绝妙的理念，我们应当多加利用（倡导与号召）
```
