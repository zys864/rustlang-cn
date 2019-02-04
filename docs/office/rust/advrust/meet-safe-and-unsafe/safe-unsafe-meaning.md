# Safe 和 Unsafe 如何相互交互

> 原文跟踪[safe-unsafe-meaning.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/safe-unsafe-meaning.md) &emsp; Commit: b6e3cbf5b0f12df1d5e30198ef7cfc17d9c70b6e

Safe Rust 和 Unsafe Rust 之间是什么关系呢? 它们之间如何相互作用呢?

用 `unsafe` 关键字控制 Safe Rust 和 Unsafe rust 之间的界限, 对两者来说就像一个接口(interface). 这也是为什么我们称 Rust 是一个安全的编程语言: 所有不安全的部分都只出现在 `unsafe` 的界限之后. 如果你愿意, 你甚至可以把 `#![forbid(unsafe_code)]` 加入到你的代码中, 用来保证你只写安全的 Rust 代码.

`unsafe` 关键词有两个用处: 声明不能通过编译器检查的部分逻辑, 和声明这部分逻辑已经被程序员检查过并符合规范.

你可以用 `unsafe` 指明 _方法_ 和 _ trait 的声明_ 是不检查 rust  相应规范的.  方法中, `unsafe` 意味着方法的用户必须查阅其文档,  以确认他们在使用  上符合方法维护者的规范要求. 在 trait 中, `unsafe` 意味着 trait 的实现者必须查阅其文档,  以确认他们的实现符合 unsafe trait  维护者的规范要求.

你还可以用 `unsafe` 一块作用域内, 所有不安全动作的执行, 都经过相应使用约定的规范的验证. 举例来说, 传给 `slice::get_unchecked` 的索引参数, 就是受使用约定  规范约束的.

你可以在 trait 的实现上使用 `unsafe` 来声明这个实现, 遵守 trait 的使用约定  规范. 举个例子,  一个类型其 `Send` trait 的实现, 就是可以安全的移动到其他线程.

Rust 标准库有一系列的 unsafe 方法或函数, 包括:

-   `slice::get_unchecked`, 执行了未检查的  索引查找, 允许了自由违反内存安全的约定准则.
-   `mem::transmute` 将某些值重新解释为具有给定类型， 很随意的就绕过了类型安全(详情可查阅 [conversions])
-   每个指向一个 sized 类型的原始指针(raw pointer), 都有 `offset` 方法, 如果传递的 offset 不是 ["in bounds"][ptr_offset], 则会  触发未定义的行为.
-   调用所有 FFI(外部方法接口) 的方法都是 `unsafe` 的, 因为 rust 不能检查其他语言做的非安全的操作行为.

Rust 1.29.2 版本的标准库定义了如下 unsafe trait (其他还有, 但是其他的目前不稳定, 后续可能会继续改动, 而其中有一些可能会是一直不稳定的状态):

-   [`Send`] 是一个标记 trait(没有 API 的 trait), 用来承诺: 其实现的类型可以安全的发送(移动)到另一个线程.
-   [`Sync`] 也是一个标记 trait, 用来承诺: 不同线程可以通过一个共享引用, 来安全的共享其实现的数据或类型.
-   [`GlobalAlloc`] 允许整个程序的内存自定义分配

很多 Rust 标准库其实也在使用其内部使用 Unsafe Rust. 那些非安全的实现, 通常会经过非常严格的人肉检查, 所以  说, 在非安全实现的基础上, 构建的安全 Rust 的接口, 是可以认定为是安全的.

为什么需要分离 Safe Rust 和 Unsafe Rsut, 其实是归结到一个 Safe Rust 的一个基础特性:

**不管如何, Safe Rust 不会引起未定义的行为**

Rust safe/unsafe 的拆分设计, 意味着它们之间存在着不对称的信任关系. Safe Rust 天然的相信所有其触及的 Unsafe Rust, 盲目相信 Unsafe Rust 的编写是正确的. 另一方面, Unsafe Rust 必须非常谨慎的相信 Safe Rust.

举个例子, Rsut 用 trait `PartialOrd` 和 `Ord` 来区分"仅仅"用来比较的类型, 和那些提供"全序"排序关系的类型(译者注: [全序关系可参考](https://zh.wikipedia.org/wiki/%E5%85%A8%E5%BA%8F%E5%85%B3%E7%B3%BB))的类型(这就基本意味着排序关系的行为是合理的).

`BTreeMap` 对只实现了偏序关系(partially-ordered)的类型来说毫无意义, 它要求类型实现关键 trait `Ord`. 但是, `BTreeMap` 内部的实现包含 Unsafe Rust 代码. 因为一个不合格的 `Ord` 实现(但是是 Safe 的)而导致未定义的行为是不可接受的, BTreeMap 内部编写了 Unsafe Rust 代码用来保证 `Ord` 实现是真正的全序关系顺序, 提升了代码健壮性, 即使它只有 `Ord` trait 的约束.

The Unsafe Rust code just can't trust the Safe Rust code to be written correctly.
That said, `BTreeMap` will still behave completely erratically if you feed in
values that don't have a total ordering. It just won't ever cause Undefined
Behavior.

Unsafe Rust 代码通常假定 Safe Rust 代码不一定正确. 也就是说, `BTreeMap` 仍然会表现的不正常如果你传入的值不是全序关系顺序的. 但是它永远不会导致未定义的行为.

One may wonder, if `BTreeMap` cannot trust `Ord` because it's Safe, why can it
trust _any_ Safe code? For instance `BTreeMap` relies on integers and slices to
be implemented correctly. Those are safe too, right?

The difference is one of scope. When `BTreeMap` relies on integers and slices,
it's relying on one very specific implementation. This is a measured risk that
can be weighed against the benefit. In this case there's basically zero risk;
if integers and slices are broken, _everyone_ is broken. Also, they're maintained
by the same people who maintain `BTreeMap`, so it's easy to keep tabs on them.

On the other hand, `BTreeMap`'s key type is generic. Trusting its `Ord` implementation
means trusting every `Ord` implementation in the past, present, and future.
Here the risk is high: someone somewhere is going to make a mistake and mess up
their `Ord` implementation, or even just straight up lie about providing a total
ordering because "it seems to work". When that happens, `BTreeMap` needs to be
prepared.

The same logic applies to trusting a closure that's passed to you to behave
correctly.

This problem of unbounded generic trust is the problem that `unsafe` traits
exist to resolve. The `BTreeMap` type could theoretically require that keys
implement a new trait called `UnsafeOrd`, rather than `Ord`, that might look
like this:

```rust
use std::cmp::Ordering;

unsafe trait UnsafeOrd {
    fn cmp(&self, other: &Self) -> Ordering;
}
```

Then, a type would use `unsafe` to implement `UnsafeOrd`, indicating that
they've ensured their implementation maintains whatever contracts the
trait expects. In this situation, the Unsafe Rust in the internals of
`BTreeMap` would be justified in trusting that the key type's `UnsafeOrd`
implementation is correct. If it isn't, it's the fault of the unsafe trait
implementation, which is consistent with Rust's safety guarantees.

The decision of whether to mark a trait `unsafe` is an API design choice.
Rust has traditionally avoided doing this because it makes Unsafe
Rust pervasive, which isn't desirable. `Send` and `Sync` are marked unsafe
because thread safety is a _fundamental property_ that unsafe code can't
possibly hope to defend against in the way it could defend against a buggy
`Ord` implementation. Similarly, `GlobalAllocator` is keeping accounts of all
the memory in the program and other things like `Box` or `Vec` build on top of
it. If it does something weird (giving the same chunk of memory to another
request when it is still in use), there's no chance to detect that and do
anything about it.

The decision of whether to mark your own traits `unsafe` depends on the same
sort of consideration. If `unsafe` code can't reasonably expect to defend
against a broken implementation of the trait, then marking the trait `unsafe` is
a reasonable choice.

As an aside, while `Send` and `Sync` are `unsafe` traits, they are _also_
automatically implemented for types when such derivations are provably safe
to do. `Send` is automatically derived for all types composed only of values
whose types also implement `Send`. `Sync` is automatically derived for all
types composed only of values whose types also implement `Sync`. This minimizes
the pervasive unsafety of making these two traits `unsafe`. And not many people
are going to _implement_ memory allocators (or use them directly, for that
matter).

This is the balance between Safe and Unsafe Rust. The separation is designed to
make using Safe Rust as ergonomic as possible, but requires extra effort and
care when writing Unsafe Rust. The rest of this book is largely a discussion
of the sort of care that must be taken, and what contracts Unsafe Rust must uphold.

[`send`]: ../std/marker/trait.Send.html
[`sync`]: ../std/marker/trait.Sync.html
[`globalalloc`]: ../std/alloc/trait.GlobalAlloc.html
[conversions]: conversions.html
[ptr_offset]: ../std/primitive.pointer.html#method.offset
