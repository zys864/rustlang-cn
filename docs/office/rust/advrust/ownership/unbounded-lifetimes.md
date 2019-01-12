# Unbounded Lifetimes

> 原文跟踪[unbounded-lifetimes.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/unbounded-lifetimes.md) &emsp; Commit: 0e6c680ebd72f1860e46b2bd40e2a387ad8084ad

Unsafe code can often end up producing references or lifetimes out of thin air.
Such lifetimes come into the world as *unbounded*. The most common source of this
is dereferencing a raw pointer, which produces a reference with an unbounded lifetime.
Such a lifetime becomes as big as context demands. This is in fact more powerful
than simply becoming `'static`, because for instance `&'static &'a T`
will fail to typecheck, but the unbound lifetime will perfectly mold into
`&'a &'a T` as needed. However for most intents and purposes, such an unbounded
lifetime can be regarded as `'static`.

Almost no reference is `'static`, so this is probably wrong. `transmute` and
`transmute_copy` are the two other primary offenders. One should endeavor to
bound an unbounded lifetime as quickly as possible, especially across function
boundaries.

Given a function, any output lifetimes that don't derive from inputs are
unbounded. For instance:

```rust
fn get_str<'a>() -> &'a str;
```

会产生无限的生命周期。 避免无限生命期的最简单方法是在函数边界使用生命周期遗漏。 如果省略输出生命周期，则必须受输入生命周期的限制。 当然它可能受到错误生命周期的限制，但这通常只会导致编译器错误，而不是简单地违反内存安全性。

在函数内，边界生命周期更容易出错。 绑定生命周期的最安全和最简单的方法是从具有绑定生存期的函数返回它。 但是，如果这是不可接受的，您可以将引用放在具有特定生命周期的位置。 遗憾的是，无法命名函数中涉及的所有生命周期。
