# Atomics

> 原文跟踪[atomics.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/atomics.md) &emsp; Commit: 6dd445b8e72bcbc502cf28240830be52d2a8240d

在内存原子性(atomics)模型上, rust 就公然的直接继承了 C11 的模型, 这不是因为这个模型多好或者多容易懂, 相反这个模型挺复杂的, 还有若干已知[缺陷](http://plv.mpi-sws.org/c11comp/popl15.pdf). 但事实上不是每个都善于去给内存原子性建模, 所以似乎这样也不错的. 至少我们可以从 C 现有的工具和研究中学到店什么.

本文不会尝试完全充分的解释这个模型. 它是用令人发狂的因果关系图定义的, 需要用一整本书去尽可能的解释的清楚. 想知道更多细节可以看下 [C 语言的规范(第 7.17 章节部分)](http://www.open-std.org/jtc1/sc22/wg14/www/standards.html#9899). 不过本文会尝试把基本的概念和一些 Rust 开发者碰到的一些问题都覆盖到.

C11 内存模型本质上来说, 是为了在桥接对人来说的语义性, 对编译器来说优化性, 对硬件来说的非一致混乱性. 简单说就是希望我们写的程序, 按照我们的想法跑的又快又好.




# Compiler Reordering 编译器重新排序

编译器本质上希望能够通过进行一些复杂的转换和减少数据依赖, 来消除死代码(dead code). 特别是, 它可以从根本上改变代码的运行的顺序, 或者让一些代码的逻辑永远不再出现. 举个例子, 如果有如下代码:

```rust,ignore
x = 1;
y = 3;
x = 2;
```

编译器可能推断出, 改成如下可能更好:

```rust,ignore
x = 2;
y = 3;
```

这样的顺序倒转, 就消除了第一条赋值事件. 从单线程的角度, 这样的变化是完全无法察觉的: 所有语句执行完之后的状态完全相同. 但是如果程序是多线程的, 第一句赋值在 y 分配之前的逻辑, 就完全可能真的是有逻辑依赖的. 我们希望编译器有能力进行这样类型的优化, 毕竟这样做可以大幅提升性能. 另一方面, 我们也希望程序能够完全按照*我们的意愿*执行.




# Hardware Reordering 硬件重新排序

话说就算编译器完全按照我们的意愿去执行理解我们的代码, 还有硬件也会出来给你使绊子. 主要原因是多级高速缓存的结构对 CPU 的影响. 全局共享内存对 cpu 来说*又远又慢*. 每个 cpu 核心宁可使用本地数据缓存, 只有当本地缓存没数据时, 才会去找全局共享内存找.

所以这个问题主要是在 cpu 的多级缓存上, 如果每次读取缓存都要去共享内存立检查下数据有没有改变, 那缓存就没存在意义了. 结果就是硬件层面上, 不同线程不能保证程序逻辑相同. 为此, 我们必须通过发出特殊的 cpu 指令, 让他不要这么聪明.

举个例子, 我们保证编译器编译结果逻辑如下:

```text
initial state: x = 0, y = 1

THREAD 1        THREAD2
y = 3;          if x == 1 {
x = 1;              y *= 2;
                }
```

理想情况下这段程序有这样 2 个分支:

* `y = 3`: (线程 2 先于线程 1 执行)
* `y = 6`: (线程 2 后于线程 1 执行)

但是还有第 3 个潜在的分支:

* `y = 2`: (线程 2 取到 x 时 `x = 1`, 但此时 y 还没有被赋值为 3)

注意不同类型的 CPU 提供不同的保证, 通常将硬件分为两类: 强排序(strongly-ordered)和弱排序(weakly-ordered).
X86/64 架构提供强排序保证, ARM 架构提供弱排序排序保证.
这对并发编程产生了两个影响:

* 在强排序保证机器上要求强排序保证, 代价极低, 低到可以忽略不计, 因为硬件提供了无条件的强排序保证. 弱排序保证可能在弱排序机器上有性能优势.

* 即使程序确实有问题, 多数情况下, 是在强排序保证机器上, 要求极弱顺序的保证是有可能正常工作的. 如果可能, 应该在弱排序保证的机器上测试并发算法的性能



# Data Accesses 数据访问

C11 内存模型试图通过让我们讨论程序*因果关系*, 来拉近我们和程序底层的逻辑. 通常, 这是通过在程序的各个部分与运行它们的线程之间建立*之前的*关系. 这样就给了硬件和编译器优化的空间, 可以更加激进的优化"发生前"关系建立之前, 但是强制它们在关系建立后更加谨慎. 我们通过*数据访问(data acesses)*和*原子性访问(atomic accesses)*来和这些关系联系起来.
> The C11 memory model attempts to bridge the gap by allowing us to talk about the
*causality* of our program. Generally, this is by establishing a *happens before* relationship between parts of the program and the threads that are running them. This gives the hardware and compiler room to optimize the program
more aggressively where a strict happens-before relationship isn't established,
but forces them to be more careful where one is established. The way we
communicate these relationships are through *data accesses* and *atomicaccesses*.


数据访问是编程世界的面包和黄油. 它们本质上失败非同步的, 编译器可以自由激进的优化它们. 尤其是当程序是单线程的, 编译器可以自由的重新排序所有数据访问. 硬件层面上也可以将数据的改动惰性的非一致的随意传播. 关键是, 数据访问会产生数据竞争. 数据访问对硬件和编译非常友好, 但是在代码语义上, 数据访问提供了极为*弱鸡*的语法, 事实上简直弱爆了.

**仅用数据访问来写正确同步代码是不可能的**

使用原子性的数据访问(atomic accesses)正是我们在告诉编译器和硬件, 我们现在写的程序是多线程的. 每个原子访问可以用*顺序*标记, 以指定它与其他访问建立的关系类型. 实际上, 这其实就是在告诉编译器和硬件, 哪些优化你*别做*, 哪些事情你*不能做*. 对编译器来说, 主要是内容就是围绕指令的重新排序(re-ordering). 对硬件来说, 主要内容就是围绕数据传播到其他线程的写入方式. Rust 暴露这几种:

* Sequentially Consistent (SeqCst)
* Release
* Acquire
* Relaxed

(Note: Rust 明确不暴露 C11 的 *consume* 顺序)

TODO: negative reasoning vs positive reasoning? TODO: "can't forget to
synchronize"



# Sequentially Consistent

Sequentially Consistent is the most powerful of all, implying the restrictions
of all other orderings. Intuitively, a sequentially consistent operation
cannot be reordered: all accesses on one thread that happen before and after a
SeqCst access stay before and after it. A data-race-free program that uses
only sequentially consistent atomics and data accesses has the very nice
property that there is a single global execution of the program's instructions
that all threads agree on. This execution is also particularly nice to reason
about: it's just an interleaving of each thread's individual executions. This
does not hold if you start using the weaker atomic orderings.

The relative developer-friendliness of sequential consistency doesn't come for
free. Even on strongly-ordered platforms sequential consistency involves
emitting memory fences.

In practice, sequential consistency is rarely necessary for program correctness.
However sequential consistency is definitely the right choice if you're not
confident about the other memory orders. Having your program run a bit slower
than it needs to is certainly better than it running incorrectly! It's also
mechanically trivial to downgrade atomic operations to have a weaker
consistency later on. Just change `SeqCst` to `Relaxed` and you're done! Of
course, proving that this transformation is *correct* is a whole other matter.




# Acquire-Release

Acquire and Release are largely intended to be paired. Their names hint at their
use case: they're perfectly suited for acquiring and releasing locks, and
ensuring that critical sections don't overlap.

Intuitively, an acquire access ensures that every access after it stays after
it. However operations that occur before an acquire are free to be reordered to
occur after it. Similarly, a release access ensures that every access before it
stays before it. However operations that occur after a release are free to be
reordered to occur before it.

When thread A releases a location in memory and then thread B subsequently
acquires *the same* location in memory, causality is established. Every write
that happened before A's release will be observed by B after its acquisition.
However no causality is established with any other threads. Similarly, no
causality is established if A and B access *different* locations in memory.

Basic use of release-acquire is therefore simple: you acquire a location of
memory to begin the critical section, and then release that location to end it.
For instance, a simple spinlock might look like:

```rust
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;

fn main() {
    let lock = Arc::new(AtomicBool::new(false)); // value answers "am I locked?"

    // ... distribute lock to threads somehow ...

    // Try to acquire the lock by setting it to true
    while lock.compare_and_swap(false, true, Ordering::Acquire) { }
    // broke out of the loop, so we successfully acquired the lock!

    // ... scary data accesses ...

    // ok we're done, release the lock
    lock.store(false, Ordering::Release);
}
```

On strongly-ordered platforms most accesses have release or acquire semantics,
making release and acquire often totally free. This is not the case on
weakly-ordered platforms.




# Relaxed

Relaxed accesses are the absolute weakest. They can be freely re-ordered and
provide no happens-before relationship. Still, relaxed operations are still
atomic. That is, they don't count as data accesses and any read-modify-write
operations done to them occur atomically. Relaxed operations are appropriate for
things that you definitely want to happen, but don't particularly otherwise care
about. For instance, incrementing a counter can be safely done by multiple
threads using a relaxed `fetch_add` if you're not using the counter to
synchronize any other accesses.

There's rarely a benefit in making an operation relaxed on strongly-ordered
platforms, since they usually provide release-acquire semantics anyway. However
relaxed operations can be cheaper on weakly-ordered platforms.





[C11-busted]: http://plv.mpi-sws.org/c11comp/popl15.pdf
[C11-model]: http://www.open-std.org/jtc1/sc22/wg14/www/standards.html#9899
