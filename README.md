# JavaScript 中的函数式编程

> 原著由 Dan Mantyla 编写

近几年来随着 Haskell、Scala、Clojure 等这些充满学究气息的原生支持函数式编程的偏门语言越来越受到关注，同时主流的 Java、JavaScript、Python 甚至 C++都陆续支持函数式编程。特别值得一提的是 JavaScript 在 nodejs 出现后成为第一种从前端到后台的全栈语言，除此之外 JavaScript 支持多范式编程。应用函数式编程最大挑战就是思维模式的改变——从传统面向对象的范式改变到函数式编程范式。

Functional Programming in JavaScript 是 javascript 函数式编程极具代表性的原作书籍，由于版权原因及商业化原因，15 年出版的这本至今未被中文翻译和中文售卖，于是本人尝试着翻译，希望在翻译的过程中有所收益，欢迎朋友们加入一起翻译。

![Front End Handbook 2018 Cover](https://blog.ahthw.com/wp-content/uploads/2019/12/Functional_Programming_in_JavaScript.jpg)

[主站](https://github.ahthw.com/natpagle/) · [下载电子版](https://blog.ahthw.com/wp-content/uploads/2019/12/Dan_Mantyla_Functional_Programming_in_JavaScript.pdf)

## 贡献内容

如果你想参与这本书的共同创作，修改或添加内容，可以先 [Fork](https://github.com/halldwang/natpagle) 这本书的仓库，然后将修改的内容提交 [Pull requests](https://github.com/halldwang/natpagle/pulls) ；或者创建 [Issues](https://github.com/halldwang/natpagle/issues)。

Fork 后的仓库如何同步本仓库？

```bash
# 添加 upstream 源，只需执行一次
git remote add upstream git@github.com:halldwang/natpagle.git

# 拉取远程代码
git pull upstream master

# 提交修改
git add .
git commit

# 更新 fork 仓库
git push origin master
```

更多参考： [Syncing a fork](https://help.github.com/articles/syncing-a-fork/)

注意，本书内容在 `/docs` 目录中， `/dist`是网站文件，通过脚本自动生成的。

## 生成电子书

这本书使用 [Vuepress](https://vuepress.vuejs.org/zh/) 撰写并生成[网站](https://github.com/halldwang/natpagle/)，请查看 `package.json` 中的 `scripts` 配置和 `/scripts` 目录中的脚本来了解这本书的构建和发布过程。

```bash
# 初始化 nodejs 依赖
npm install

# 安装 vuepress 插件
npm install -g vuepress

# 进入图书目录
cd docs

# 开始写作
vuepress dev .

# 构建静态文件
vuepress build .

# 查看写作内容
# visit http://localhost:8080

```

## 更新日志

[https://github.com/halldwang/natpagle/commits/master](https://github.com/halldwang/natpagle/commits/master)
