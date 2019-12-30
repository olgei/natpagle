# 简介

JavaScript被称为“web的汇编语言”。类比（它不是完美的，还还有更完美的么？），从JavaScipt通常被编译的目标（即Clojure和CoffeeScript）这一事实出发，还从许多其他来源（如pyjamas（python to JS）和Google Web Kit（Java到JS））中得出结论。

引用了一个更愚蠢的想法，JavaScript和x86程序集一样具有表现力和低级。也许这个概念源于这样一个事实：自从JavaScript在1995年首次随Netscape一起发布以来，它就一直因其设计缺陷和疏忽而受到抨击。它是在匆忙中开发和发布的，正因为如此，一些有问题的设计模式进入了JavaScript，这种语言很快成为了事实上的web脚本语言。“;”是个大错误。定义函数的方法也不明确。是var foo = function();还是function foo();

函数式编程是处理这些错误的一个很好的方法。 通过关注JavaScript确实是一种函数式语言这一事实，在前面关于声明函数的不同方法的示例中，最好将函数声明为变量。分号主要是为了让JavaScript看起来更像C语言。

但是请始终记住您使用的语言。 与其他任何语言一样，JavaScript也有其缺陷。 而且，当以一种经常避开可能的前沿优势的风格进行编程时，这些小问题可能会变成不可恢复的问题陷阱。 其中一些陷阱包括：

- 递归
- 可变范围和闭包
- 函数声明与函数表达式

不过，这些问题只要稍加注意就可以解决。

## 递归

递归对于任何语言的函数式编程都非常重要。许多函数式语言甚至不提供for和while循环语句，从而要求迭代递归；只有当语言保证消除尾部调用时，这才是可能的，而JavaScript则不是这样。在第2章“函数式编程基础”中快速介绍了递归。但在本节中，我们将深入研究递归在JavaScript中的工作原理。

### 尾递归

JavaScript处理递归的例程称为tail递归，这是基于堆栈的递归实现。 这意味着，对于每个递归调用，堆栈中都会有一个新帧。

为了说明这个方法可能产生的问题，让我们使用经典的阶乘递归算法。

```js
var factorial = function(n) {
  if (n == 0) {
    // base case
    return 1;
  } else {
    // recursive case
    return n * factorial(n - 1);
  }
};
```

该算法将调用n次以获取答案。 它实际上是在计算（1 x 1 x 2 x 3 x…x N）。 这意味着时间复杂度为O（n）。

::: tip

O(n)，发音为“big oh to the n,"”，意味着随着输入大小的增长，算法将以n的速率增长，即较窄的增长。 O(n2)是指数增长，O(log(n))是对数
增长等等。 此符号可用于时间复杂度和空间复杂度。
:::

但是，因为在每个迭代中分配了存储器堆栈中的新帧，所以空间复杂度也是O（n）。这是个问题。这意味着内存的消耗速度将很容易超过内存限制。在我的笔记本电脑上，阶乘factorial(23456)返回`Uncaught Error：RangeError: Maximum call stack size exceeded`超出最大调用堆栈大小。

尽管计算23,456的阶乘是一件轻而易举的事，但是可以放心，用递归解决的许多问题将增长到该大小而不会带来太多麻烦。 考虑数据树的情况。 树可以是任何东西：搜索应用程序，文件系统，路由表等等。 下面是树遍历功能的一个非常简单的实现：

```js
var traverse = function(node) {
  node.doSomething(); // whatever work needs to be done
  node.childern.forEach(traverse); // many recursive calls
};
```

每个节点只有两个子节点，时间复杂度和空间复杂度（在最坏的情况下，必须遍历整棵树才能找到答案）都将是O(n2)，因为每个将有两个递归调用。 每个节点有许多子代，复杂度将为O(nm)，其中m是子代数。 递归是树遍历的首选算法； while循环会复杂得多，并且需要维护堆栈。

这样的指数增长意味着不需要很大的tree就可以抛出RangeError异常。肯定有更好的办法。

### 尾部调用消除

我们需要一种方法来消除每个递归调用的新堆栈帧的分配。 这被称为尾部调用消除。

使用尾部调用消除，当函数返回调用自身的结果时，语言实际上不会执行另一个函数调用。它把整件事都变成了一个循环。

好，那我们该怎么做呢？ 有了惰性求值。 如果我们可以重写它来折叠一个延迟序列，这样函数返回一个值，或者它返回调用另一个函数的结果而不对该结果做任何处理，那么就不需要分配新的堆栈帧。

要将其放入“尾递归形式”，必须重写阶乘函数，以使内部过程事实在控制流中最后调用自身，如以下代码片段所示：

```js
var factorial = function(n) {
  var _fact = function(x, n) {
    if (n == 0) {
      // base case
      return x;
    } else {
      // recursive case
      return _fact(n * x, n - 1);
    }
  };
  return fact(1, n);
};
```

::: tip
结果不是由递归尾中的第一个函数生成（如在n *factorial(n-1)中），而是由递归尾中的最后一个函数生成（通过调用_fact(r* n，n-1) ）），并由该尾部的最后一个函数产生（带有return r;）。 计算仅向下进行一次，而不向上进行。 将其作为解释器的迭代进行处理相对容易。
:::

但是，消除尾部调用在JavaScript中不起作用。 将上面的代码放入您最喜欢的JavaScript引擎中，`factorial(24567)`仍返回Uncaught Error：RangeError: Maximum call stack size exceeded exception(最大调用堆栈大小超出异常)。 Tail-call消除被列为新功能，将包含在下一版ECMAScript中，但是所有浏览器都需要一段时间才能实现。

语言规范和运行时解释器的功能，简单明了。 它与解释器如何获取堆栈帧资源有关。 某些语言在不需要记住任何新内容时会重用同一堆栈框架，例如前面的函数。 这就是消除Tail-call的方法，从而减少了时间和空间的复杂性。

不幸的是，JavaScript无法做到这一点。 但是，如果这样做，它将从此重组堆栈帧：

```txt
call factorial (3)
  call fact (3 1)
    call fact (2 3)
      call fact (1 6)
        call fact (0 6)
        return 6
      return 6
    return 6
  return 6
return 6
```

具体如下：

```js
call factorial (3)
  call fact (3 1)
  call fact (2 3)
  call fact (1 6)
  call fact (0 6)
return 6
return 6
```

### 蹦床函数

解决方案？ 一个被称为蹦床的过程。 这是通过使用thunks将“尾声消除”概念“破解”到程序中的一种方法。

::: tip
因此，Thunk是带有参数的表达式，这些参数包装了没有自身参数的匿名函数。 例如：`function (str){return function() {console.log(str)}`。 这样可以防止在接收函数调用匿名函数之前对表达式进行求值。
:::

蹦床是一个函数，它接受一个函数作为输入，并重复执行其返回值，直到返回函数以外的其他值。下面的代码片段显示了一个简单的实现：

```js
var trampoline = function(f) {
  while (f && f instanceof Function) {
    f = f.apply(f.context, f.args);
  }
  return f;
};
```
