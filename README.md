# Rustlang-cn [![Build Status](https://travis-ci.org/rustlang-cn/rustlang-cn.svg?branch=master)](https://travis-ci.org/rustlang-cn/rustlang-cn)

## 一：参与Rust中文社区专栏投稿

> Rust中文社区致力于Rust编程语言中文网络建设，期待你的参与向Rust中文社区专栏投稿.

**说明** ：文章投稿可以直接PR本仓库，也可以投递文章链接（请选用易使用的格式如:Markdown），本专栏默认MIT协议，如你的文章有其他要求可注明。

## 二：参与Rust中文社区网站建设

> 因为本repo的修改会自动发布到[rustlang-cn](https://rustlang-cn.org/)网站,请参与时遵循以下步骤，请保持构建为成功状态.

## (a)参与文档：

**如果你只想修改文件，不用操作下面添加文件的步骤，你可以修改docs目录内的任何md文件**

## (b)参与网站：

**如果你想添加更多文件或改变主题结构布局，请遵循以下步骤**

### 步骤1

克隆/fork本仓库到你的github

```bash
$ git clone https://github.com/你的github名/rustlang-cn
$ cd rustlang-cn
$ npm install
```

### 步骤2

```bash
npm run dev  // 测试，可以在终端查看测试输出
```
打开浏览器 http://localhost:8080 查看页面效果

### 步骤3

修改/添加**docs**目录内的文件, 保证步骤二测试运行没有错误

### 步骤4

push到你的github仓库，然后提交PR到本repo仓库
