# `async`/`await!` 入门

`async`/`await!` 是 Rust 语言用于编写像同步代码一样的异步函数的内置工具。`async` 将一个代码块转化为一个实现了名为 `Future` 的特质（trait）的状态机。该代码块可以使用一个 future 的执行器来完成执行：

```rust
use futures::executor::block_on;
 async fn hello_world() {
    println!("hello, world!");
}
 fn main() {
    let future = hello_world(); // 不打印任何信息
    block_on(future); // `future` 被执行并打印 "hello, world!"
}
```

在一个 `async fn` 中，你可以使用 `await!` 来等待另一个实现了 `Future` 特质的类型的完成，比如另一个 `async fn` 的输出:

```rust
use futures::executor::block_on;
 async fn hello_world() {
    println!("hello, world!");
}
 async fn async_main() {
    await!(hello_world());
    await!(hello_world());
}
 fn main() {
    // 执行由 `async_main` 返回的 future，使 "hello, world!" 被打印两次
    block_on(async_main());
}
```

不同于 `block_on`, `await!` 不阻塞当前线程，而是异步地等待 future 完成，这就允许我们在当前任务无法运行时运行其它任务。比如，想象一下我们由这样三个 `async fn`：`learn_song`、`sing_song` 以及
`dance`：

```rust
async fn learn_song() -> Song { ... }
async fn sing_song(song: Song) { ... }
async fn dance() { ... }
```

一种执行“学习”、“唱歌” 和 “跳舞” 的方法是，在执行每一项任务时阻塞：

```rust
fn main() {
  let song = block_on(learn_song());
  block_on(sing_song(song));
  block_on(dance);
}
```

但是，我们使用这种方式并没有发挥出最大的性能——我们只是把它们一个个执行了。很明显，我们唱歌之前必须要学会它，但是在学歌和唱歌的同时我们也是可以跳舞的。要实现这样的效果，我们可以分别创建两个 `async fn` 来并发地执行：

```rust
async fn learn_and_sing() {
    // 在唱歌之前等待学歌完成
    // 这里我们使用 `await!` 而不是 `block_on` 来防止阻塞线程，这样就可以同时执行 `dance` 了。
    let song = await!(learn_song());
    await!(sing_song(song));
}
 async fn async_main() {
    let f1 = learn_and_sing();
    let f2 = dance();
     // `join!` 类似于 `await!` ，但是可以等待多个 future 并发完成
    join!(f1, f2)
}
 fn main() {
    block_on(async_main());
}
```

在本例中，学歌必须发生在唱歌之前，但是学习和唱歌当同时都可以跳舞。如果我们在 `learn_and_sing` 中使用 `block_on(learn_song())` 而不是 `await!(learn_song())` 的话，它的执行将阻塞至学歌结束，就无法同时跳舞了。通过 `await!` 学歌这一操作，我们允许其他任务并发执行。

到目前为止你已经学会了 `async`/`await!` 的基本用法，现在我们尝试写一个例子。