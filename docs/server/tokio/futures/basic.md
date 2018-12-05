# 实现 future

使用Tokio时，实现 future 是很常见的. 让我们从一个基本的 future 开始，它不执行异步逻辑，只简单返回一个消息。（经典的“hello world”）

# `Future` 特质

下面是 `Future` 特质的定义:

```rust,ignore
trait Future {
    /// The type of the value returned when the future completes.
    type Item;

    /// The type representing errors that occurred while processing the computation.
    type Error;

    /// The function that will be repeatedly called to see if the future is
    /// has completed or not. The `Async` enum can either by `Ready` or
    /// or `NotReady` and indicates whether the future is ready
    // to produce a value or not.
    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error>;
}
```

让我们为 "hello world" future 实现它:

```rust
# #![deny(deprecated)]
extern crate futures;

// `Poll` 是 `Result<Async<T>, E>` 类型的一个别名
use futures::{Future, Async, Poll};

struct HelloWorld;

impl Future for HelloWorld {
    type Item = String;
    type Error = ();

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        Ok(Async::Ready("hello world".to_string()))
    }
}
```

`Item` 和 `Error` 的关联类型定义了 future 完成时返回的变量类型。`Item` 代表成功值的类型，`Error` 代表执行遇到错误时返回的值类型。通常，把不会失败的 future 的 `Error` 设置为 `()`。

Future 使用基于拉取的模型。future 对象的消费者会多次调用 `poll` 函数，这个 future 就会尝试完成。如果这个 future 能够完成，它就会返回 `Async::Ready(value)`；如果这个 future 因为被内部资源（比如一个TCP套接字）阻塞导致不能完成，它就会返回 `Async::NotReady`。

当一个future的 `poll` 函数被调用时，其实现将**异步**地做尽可能多的工作，直到它逻辑上被某个尚未发生的异步事件阻塞。然后，future 实现将在内部保存它的状态，这样当 `poll` 函数再次被调用时（在收到一个内部事件之后），它会从之前离开的地方继续执行。这里不会做重复工作。

此处的 “hello world” future 不需要异步处理，是立即就绪的，所以它直接返回 `Ok(Async::Ready(value))`

# 执行 future

Tokio 负责将 future 对象执行完成。这是通过将 future 传递给 `tokio::run` 函数来实现的。

`tokio::run` 函数接受 `Item` and `Error` 都被设置为 `()` 的 future 作为参数。这是因为 Tokio 只执行 future而不会对它们的值做任何操作。Tokio 的使用者需要包揽处理 future 中的所有值。

在我们的例子，让我们把 future 打印到标准输出（stdout）中. 我们将通过一个 `Display` future 来实现这个效果。

```rust
# #![deny(deprecated)]
extern crate futures;

use futures::{Future, Async, Poll};
use std::fmt;

struct Display<T>(T);

impl<T> Future for Display<T>
where
    T: Future,
    T::Item: fmt::Display,
{
    type Item = ();
    type Error = T::Error;

    fn poll(&mut self) -> Poll<(), T::Error> {
        let value = match self.0.poll() {
            Ok(Async::Ready(value)) => value,
            Ok(Async::NotReady) => return Ok(Async::NotReady),
            Err(err) => return Err(err),
        };

        println!("{}", value);
        Ok(Async::Ready(()))
    }
}
```

The `Display` takes a future that yields items that can be displayed. When it is
polled, it first tries to poll the inner future. If the inner future is **not
ready** then `Display` cannot complete. In this case, `Display` also returns
`NotReady`.

**`poll` implementations must never return `NotReady` unless they received
`NotReady` by calling an inner future.** This will be explained in more detail
in a later section.

The `Display` future will error when the inner future errors. The error is
bubbled up.

When `HelloWorld` is combined with `Display`, both the `Item` and `Error` types
are `()` and the future can be executed by Tokio:

```rust
# #![deny(deprecated)]
extern crate tokio;
# extern crate futures;
# struct HelloWorld;
# struct Display<T>(T);
# impl<T> futures::Future for Display<T> {
#     type Item = ();
#     type Error = ();
#     fn poll(&mut self) -> futures::Poll<(), ()> {
#         Ok(().into())
#     }
# }

let future = Display(HelloWorld);
tokio::run(future);
```

Running this results in "hello world" being outputted to standard out.

# Cleaning things up

The pattern of waiting on an inner future is common enough that there is a
helper macro: `try_ready!`.

The poll function can be rewritten using the macro as such:

```rust
# #![deny(deprecated)]
#[macro_use]
extern crate futures;

use futures::{Future, Async, Poll};
use std::fmt;

struct Display<T>(T);

impl<T> Future for Display<T>
where
    T: Future,
    T::Item: fmt::Display,
{
    type Item = ();
    type Error = T::Error;

    fn poll(&mut self) -> Poll<(), T::Error> {
        let value = try_ready!(self.0.poll());
        println!("{}", value);
        Ok(Async::Ready(()))
    }
}

# fn main() {}
```
