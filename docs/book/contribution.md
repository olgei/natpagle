# 贡献内容

如果你想参与这本书的共同创作，修改或添加内容，可以先 [Fork](https://github.com/hex-translate/natpagle) 这本书的仓库，然后将修改的内容提交 [Pull requests](https://github.com/hex-translate/natpagle/pulls) ；或者创建 [Issues](https://github.com/hex-translate/natpagle/issues)。

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

这本书使用 [Vuepress](https://vuepress.vuejs.org/zh/) 撰写并生成[网站](https://github.com/hex-translate/natpagle)，请查看 `package.json` 中的 `scripts` 配置和 `/scripts` 目录中的脚本来了解这本书的构建和发布过程。

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

[https://github.com/hex-translate/natpagle/tree/master](https://github.com/hex-translate/natpagle/tree/master)
