module.exports = {
  title: "JavaScript中的函数式编程",
  description: "JavaScript 中的函数式编程",
  dest: "./dist",
  base: "/natpagle/",
  sidebarDepth: 2,
  themeConfig: {
    repo: "halldwang/natpagle",
    docsBranch: "master",
    editLinkText: "在 GitHub 上编辑此页",
    lastUpdated: "上次更新",
    editLinks: true,
    smoothScroll: true,
    nav: [
      { text: "首页", link: "/" },
      { text: "章节", link: "/book/cover-preface" },
      { text: "贡献内容", link: "/book/contribution" }
    ],
    sidebar: [
      ["./book/cover-preface", "章节和目录"],
      ["./book/chapter-first", "第一章：通过一个案例了解JavaScript语言能力"],
      ["./book/chapter-second", "第二章：函数式编程基础"],
      ["./book/chapter-third", "第三章：搭建函数式编程环境"],
      ["./book/chapter-fourth", "第四章：JavaScript中的函数式编程实现"],
      ["./book/chapter-fifth", "第五章：理论范畴"],
      ["./book/chapter-sixth", "第六章：JavaScript中的高级函数和陷阱话题"],
      ["./book/chapter-seventh", "第七章：JavaScript中的函数式和面向对象编程"],
      ["./book/appendix", "附录：JavaScript中常用函数的函数式方法"],
      ["./book/contribution", "贡献内容"]
    ]
  }
};
