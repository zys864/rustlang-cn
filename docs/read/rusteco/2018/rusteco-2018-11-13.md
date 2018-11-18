# Rust生态阅读 2018-11-13

## 新闻和博客

* 🎈🎉 [宣布Rust 1.30.1](https://blog.rust-lang.org/2018/11/08/Rust-1.30.1.html). 🎉🎈
* [Rust Rust不会让你做的事情](https://medium.com/@GolDDranks/things-rust-doesnt-let-you-do-draft-f596a3c740a5).
* [NLL之后：从借用的数据移动和哨兵模式](http://smallcultfollowing.com/babysteps/blog/2018/11/10/after-nll-moving-from-borrowed-data-and-the-sentinel-pattern/).
* [在AWS Lambda中本机运行Rust并在本地测试它](https://medium.com/@bernardo.belchior1/running-rust-natively-in-aws-lambda-and-testing-it-locally-57080421426d).
* [真正零成本的抽象](https://vorner.github.io/2018/11/11/truly-zero-cost.html).
* [Tide中的中间件](https://rust-lang-nursery.github.io/wg-net/2018/11/07/tide-middleware.html).
* [Rust中的Monadic表示法：第一部分](https://varkor.github.io/blog/2018/11/10/monadic-do-notation-in-rust-part-i.html).
* [`proc_macro_attribute`重访](https://llogiq.github.io/2018/11/10/proc-macro.html).
* [pdf] [在Rust中编写网络驱动程序](https://www.net.in.tum.de/fileadmin/bibtex/publications/theses/2018-ixy-rust.pdf).

## 本周的箱子

本周的箱子是[cargo-nono](https://github.com/hobofan/cargo-nono)，这是一个cargo子命令，用于检查箱子与非标准兼容性的依赖关系。感谢Hobofan提出的建议！

## Rust Core的更新

在上周合并了 140个拉取请求

[merged]: https://github.com/search?q=is%3Apr+org%3Arust-lang+is%3Amerged+merged%3A2018-11-05..2018-11-12

* [删除对LLVM 4构建的支持](https://github.com/rust-lang/rust/pull/55698)
* [直接使用lld作为Fuchsia目标](https://github.com/rust-lang/rust/pull/55106)
* [支持memcpy / memmove，具有不同的src / dst对齐方式](https://github.com/rust-lang/rust/pull/55633)
* [对待“proc-macro”包装箱类型相同 proc-macro = true](https://github.com/rust-lang/cargo/pull/6256)
* [尝试doc comment参数时的自定义诊断](https://github.com/rust-lang/rust/pull/55451)
* [在宏中强制使用`unused-must-use`lint](https://github.com/rust-lang/rust/pull/55569)
* [不要向stdout输出`opt fuel`消息，因为它会破坏Rustbuild](https://github.com/rust-lang/rust/pull/55495)
* [NLL：用`elided lifetimes`来修复ICE](https://github.com/rust-lang/rust/pull/55822)
* [NLL：更新盒不敏感性测试](https://github.com/rust-lang/rust/pull/55801)
* [NLL：为借用联合字段而遗漏错误](https://github.com/rust-lang/rust/pull/55696)
* [NLL：unions在分配到现场后没有重新初始化](https://github.com/rust-lang/rust/pull/55657)
* [自定义MIR内联器的优化](https://github.com/rust-lang/rust/pull/55739)
* [在计算相关类型时考虑supertraits](https://github.com/rust-lang/rust/pull/55687)
* [首先是所有匹配武器的类型检查模式，因此我们得到绑定类型](https://github.com/rust-lang/rust/pull/55819)
* [don't inline virtual calls (take 2)](https://github.com/rust-lang/rust/pull/55802)
* [使用SmallVec以避免在`from_decimal_string`分配](https://github.com/rust-lang/rust/pull/55816)
* [un-`P` my `Lit`! Don't allocate it in vain](https://github.com/rust-lang/rust/pull/55777)
* [don't `Box` the `TyCtxt::associated_items`](https://github.com/rust-lang/rust/pull/55604)
* [make `MatcherPos::stack` a `SmallVec`](https://github.com/rust-lang/rust/pull/55525)
* [改进3个IndexVecs的创建](https://github.com/rust-lang/rust/pull/55755)
* [implement rotate using funnel shift on LLVM >= 7](https://github.com/rust-lang/rust/pull/55650)
* [value visitors for miri](https://github.com/rust-lang/rust/pull/55549)
* [删除alloc_system箱子](https://github.com/rust-lang/rust/pull/55660)
* [std：改进访问TLS的codegen大小](https://github.com/rust-lang/rust/pull/55518)
* [std：通过使用`imports`启用`thread_local!`](https://github.com/rust-lang/rust/pull/55597)
* [choose predicates without inference variables over those with them](https://github.com/rust-lang/rust/pull/55453)
* [minor standard library constification](https://github.com/rust-lang/rust/pull/55278)
* [修复Rc/ Arc分配布局](https://github.com/rust-lang/rust/pull/55764)
* [在Rc/ Arcallocation中修复未定义的行为](https://github.com/rust-lang/rust/pull/54922)
* [cargo: avoid retaining all rustc output in memory](https://github.com/rust-lang/cargo/pull/6289)
* [cargo: 超时批量下载，而不是每次下载](https://github.com/rust-lang/cargo/pull/6285)
* [cargo: small things to help with fuzz tests](https://github.com/rust-lang/cargo/pull/6274)
* [cargo: don't include build scripts in --out-dir](https://github.com/rust-lang/cargo/pull/6300)

## 批准的RFC

对Rust的更改遵循Rust RFC（请求注释）过程。这些是本周批准实施的RFC：

本周没有批准RFC。

## 最终评论期

### [RFC文档](https://github.com/rust-lang/rfcs/labels/final-comment-period)

* [disposition: merge] [Linked list 游标](https://github.com/rust-lang/rfcs/pull/2570).
* [disposition: close] [创建Editorconfig文件作为Cargo Project的一部分](https://github.com/rust-lang/rfcs/pull/2549).

### [跟踪问题和PR](https://github.com/rust-lang/rust/labels/final-comment-period)

* [disposition: merge] [将FromIterator添加到Box <[A]>](https://github.com/rust-lang/rust/pull/55843).
* [disposition: merge] [Tracking issue for `literal` fragment specifier (RFC 1576)](https://github.com/rust-lang/rust/issues/35625).
* [disposition: close] [FnBox（）的跟踪问题](https://github.com/rust-lang/rust/issues/28796).

## 新的RFC

* [自定义DSTs](https://github.com/rust-lang/rfcs/pull/2594).
* [枚举变体类型](https://github.com/rust-lang/rfcs/pull/2593).
* [稳定std::task和std::future::Future](https://github.com/rust-lang/rfcs/pull/2592).
* [稳定穷举整数模式匹配](https://github.com/rust-lang/rfcs/pull/2591).