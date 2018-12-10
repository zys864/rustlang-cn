# 流

流跟 future 很像，但是不只产生一个值，而是可能产生一个或多个值。我们可以把它看作是异步的迭代器。

就像 future 一样，流也可以代表各种各样的事物，只要这些事物可以在未来某几个不同的时间点产生离散的值。比如：

* 由用户和GUI界面交互产生的各种 **UI 事件**。当一个事件发生时，流就会产生一个消息。
* **来自服务器的推送通知**。有时候 “请求/响应模式” 无法满足需求。客户端可以建立到服务器端的通知流，这样就可以直接接收来自服务器的消息，而不需要明确的请求。
* **收到的套接字连接**。当多个客户端连接到某个服务器时，“连接流”将会生成套接字连接。

# `Stream` 特质

就像 `Future` 一样，使用 Tokio 时实现 `Stream` 也是很常见的。`Stream` 特质的定义如下:

```rust
trait Stream {
    /// The type of the value yielded by the stream.
    type Item;

    /// The type representing errors that occurred while processing the computation.
    type Error;

    /// The function that will be repeatedly called to see if the stream has
    /// another value it can yield
    fn poll(&mut self) -> Poll<Option<Self::Item>, Self::Error>;
}
```

关联类型 `Item` 是流所要产生的值的类型。而关联类型 `Error` 则是某些意外发生时产生的错误的类型。`poll` 函数非常类似与 `Future` 的 `poll` 函数。唯一的区别是它的返回值是一个 `Option<Self::Item>`。

流的实现会将 `poll` 函数调用多次。当下一个值就绪时，返回 `Ok(Async::Ready(Some(value)))`；当流**尚未**就绪时，返回 `Ok(Async::NotReady)`；当流耗尽不再产生值时，返回 `Ok(Async::Ready(None))`。就像 future 一样，除非内部的流或者 future 返回 `Async::NotReady`，流本身 **一定不能** 返回 `Async::NotReady`。

当流遇到错误时，将返回 `Err(error)`。返回错误**并不**表示流耗尽了。错误可能只是暂时的，调用者可以再次尝试调用 `poll` 函数，流可能还会产生新的值。而如果错误是致命的，下一次调用 `poll` 函数将返回 `Ok(Async::Ready(None))`。

# 斐波那契数列（Fibonacci）

下面的例子展示了如何将斐波那契数列实现为一个流。

```rust
extern crate futures;

use futures::{Stream, Poll, Async};

pub struct Fibonacci {
    curr: u64,
    next: u64,
}

impl Fibonacci {
    fn new() -> Fibonacci {
        Fibonacci {
            curr: 1,
            next: 1,
        }
    }
}

impl Stream for Fibonacci {
    type Item = u64;

    // 该流将永远不会产生错误
    type Error = ();

    fn poll(&mut self) -> Poll<Option<u64>, ()> {
        let curr = self.curr;
        let next = curr + self.next;

        self.curr = self.next;
        self.next = next;

        Ok(Async::Ready(Some(curr)))
    }
}
```

要使用流，必须创建一个 future 来消费它。下面的 future 将从一个流中获取 10 个值并打印。

```rust
#[macro_use]
extern crate futures;

use futures::{Future, Stream, Poll, Async};
use std::fmt;

pub struct Display10<T> {
    stream: T,
    curr: usize,
}

impl<T> Display10<T> {
    fn new(stream: T) -> Display10<T> {
        Display10 {
            stream,
            curr: 0,
        }
    }
}

impl<T> Future for Display10<T>
where
    T: Stream,
    T::Item: fmt::Display,
{
    type Item = ();
    type Error = T::Error;

    fn poll(&mut self) -> Poll<(), Self::Error> {
        while self.curr < 10 {
            let value = match try_ready!(self.stream.poll()) {
                Some(value) => value,
                // There were less than 10 values to display, terminate the
                // future.
                None => break,
            };

            println!("value #{} = {}", self.curr, value);
            self.curr += 1;
        }

        Ok(Async::Ready(()))
    }
}
```

现在，斐波那契额数列就可以被打印出来了：
Now, the fibonacci sequence can be displayed:

```rust
extern crate tokio;

let fib = Fibonacci::new();
let display = Display10::new(fib);

tokio::run(display);
```

## 异步化

到目前为止, 这个斐波那契流还是同步的。让我们在每两个值之间增加一秒的等待时间来把它变成异步的。而要实现这样的效果，就需要使用 [`tokio::timer::Interval`][interval]。`Interval` 本身就是一个流，它可以按给定时间间隔产生 `()` 值。在间隔时间之外调用 `Interval::poll` 将返回 `Async::NotReady`。

我们把 `Fibonacci` 流改成这样:

```rust
#[macro_use]
extern crate futures;
extern crate tokio;

use tokio::timer::Interval;
use futures::{Stream, Poll, Async};
use std::time::Duration;

pub struct Fibonacci {
    interval: Interval,
    curr: u64,
    next: u64,
}

impl Fibonacci {
    fn new(duration: Duration) -> Fibonacci {
        Fibonacci {
            interval: Interval::new_interval(duration),
            curr: 1,
            next: 1,
        }
    }
}

impl Stream for Fibonacci {
    type Item = u64;

    // The stream will never yield an error
    type Error = ();

    fn poll(&mut self) -> Poll<Option<u64>, ()> {
        // Wait until the next interval
        try_ready!(
            self.interval.poll()
                // The interval can fail if the Tokio runtime is unavailable.
                // In this example, the error is ignored.
                .map_err(|_| ())
        );

        let curr = self.curr;
        let next = curr + self.next;

        self.curr = self.next;
        self.next = next;

        Ok(Async::Ready(Some(curr)))
    }
}
```

因为 `Display10` 已经支持异步了，所以不需要修改。

像这样运行这个基于时间间隔限流的斐波那契数列:

```rust
extern crate tokio;

use std::time::Duration;

let fib = Fibonacci::new(Duration::from_secs(1));
let display = Display10::new(fib);

tokio::run(display);
```

# 组合器

跟 future 一样，流也可以通过很多组合器来减少重复代码。很多组合器都是以函数的形式存在于 [`Stream`][trait-dox] 特质中的。

我们可以使用 [`unfold`] 函数来重写斐波那契流：

```rust
extern crate futures;

use futures::{stream, Stream};

fn fibonacci() -> impl Stream<Item = u64, Error = ()> {
    stream::unfold((1, 1), |(curr, next)| {
        let new_next = curr + next;

        Some(Ok((curr, (next, new_next))))
    })
}
```

同样也跟 future 一样，使用流的组合器也需要函数式的编程风格。并且，`impl Stream` 也可以作为返回流的函数的返回值类型。返回 future 的策略同样适用于返回流。

`Display10` 可以使用 [`take`] 和 [`for_each`] 重新实现:

```rust
extern crate tokio;
extern crate futures;

use futures::Stream;

tokio::run(
    fibonacci().take(10)
        .for_each(|num| {
            println!("{}", num);
            Ok(())
        })
);
```

[`take`] 组合器限制斐波那契流只会产生 10 个值. 而 [`for_each`] 组合器会异步地遍历流的各个值。[`for_each`] 会消费这个流，并返回 future，每个 future 都会在闭包参数使用一个值执行时被完成。它就是 Rust 中 `for` 循环的异步版。

# 基本组合器

It is worth spending some time with the [`Stream` trait][trait-dox] and
[module][mod-dox] documentation to gain some familiarity with the full set of
available combinators. This guide will provide a very quick overview.

## 既定的流

The [`stream` module][mod-dox] contains functions for converting values and
iterators into streams.

- [`once`] converts the provided value into an immediately ready stream that
  yields a single item: the provided value.
- [`iter_ok`] and [`iter_result`] both take [`IntoIterator`] values and converts
  them to an immediately ready stream that yields the iterator values.
- [`empty`] returns a stream that immediately yields `None`.

For example:

```rust
extern crate tokio;
extern crate futures;

use futures::{stream, Stream};

let values = vec!["one", "two", "three"];

tokio::run(
    stream::iter_ok(values).for_each(|value| {
        println!("{}", value);
        Ok(())
    })
)
```

## 适配器

Like [`Iterator`], the `Stream` trait includes a broad range of "adapter"
methods. These methods all consume the stream, returning a new stream providing
the requested behavior. Using these adapter combinators, it is possible to:

* Change the type of a stream ([`map`], [`map_err`], [`and_then`]).
* Handle stream errors ([`or_else`]).
* Filter stream values ([`take`], [`take_while`], [`skip`], [`skip_while`],
  [`filter`], [`filter_map`]).
* Asynchronously iterate the values ([`for_each`], [`fold`]).
* Combine multiple streams together ([`zip`], [`chain`], [`select`]).

[interval]: https://docs.rs/tokio/0.1/tokio/timer/struct.Interval.html
[trait-dox]: https://docs.rs/futures/0.1/futures/stream/trait.Stream.html
[mod-dox]: https://docs.rs/futures/0.1/futures/stream/index.html
[`unfold`]: https://docs.rs/futures/0.1/futures/stream/fn.unfold.html
[`take`]: https://docs.rs/futures/0.1/futures/stream/trait.Stream.html#method.take
[`for_each`]: https://docs.rs/futures/0.1/futures/stream/trait.Stream.html#method.for_each
[`once`]: https://docs.rs/futures/0.1/futures/stream/fn.once.html
[`iter_ok`]: https://docs.rs/futures/0.1/futures/stream/fn.iter_ok.html
[`iter_result`]: https://docs.rs/futures/0.1/futures/stream/fn.iter_result.html
[`empty`]: https://docs.rs/futures/0.1/futures/stream/fn.empty.html
[`IntoIterator`]: https://doc.rust-lang.org/std/iter/trait.IntoIterator.html
[`Iterator`]: https://doc.rust-lang.org/std/iter/trait.Iterator.html
[`map`]: #
[`map_err`]: #
[`and_then`]: #
[`or_else`]: #
[`filter`]: #
[`filter_map`]: #
[`for_each`]: #
[`fold`]: #
[`take`]: #
[`take_while`]: #
[`skip`]: #
[`skip_while`]: #
[`zip`]: #
[`chain`]: #
[`select`]: #
