# `async`/`await!` 入门

`async`/`await!` 是 Rust 编写像同步代码那样的异步函数的内置工具。`async` 将一个代码块转化为一个实现了名为 `Future` 的特质（trait）的状态机。该代码块可以使用一个 future 的执行器来完成执行：

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

在一个 `async fn` 中，你可以使用 `await!` 来等待另一个实现了 `Future` 特质的类型完成，比如另一个 `async fn` 的输出:

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

However, we're not giving the best performance possible this way-- we're
only ever doing one thing at once! Clearly we have to learn the song before
we can sing it, but it's possible to dance at the same time as learning and
singing the song. To do this, we can create two separate `async fn` which
can be run concurrently:

```rust
async fn learn_and_sing() {
    // Wait until the song has been learned before singing it.
    // We use `await!` here rather than `block_on` to prevent blocking the
    // thread, which makes it possible to `dance` at the same time.
    let song = await!(learn_song());
    await!(sing_song(song));
}
 async fn async_main() {
    let f1 = learn_and_sing();
    let f2 = dance();
     // `join!` is like `await!` but can wait for multiple futures concurrently
    join!(f1, f2)
}
 fn main() {
    block_on(async_main());
}
```

In this example, learning the song must happen before singing the song, but
both learning and singing can happen at the same time as dancing. If we used
`block_on(learn_song())` rather than `await!(learn_song())` in `learn_and_sing`,
the execution would block until learning the song completed, making it
impossible to dance at the same time. By `await!`ing learning the song, we
allow other tasks to run concurrently.

Now that you've learned the basics of `async`/`await!`, let's try out an
example.