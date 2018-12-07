# 组合器

Future 的实现往往遵循相同的模式。为了减少陈词滥调，`future` 库提供了许多被称为 “组合器（Combinator）” 的工具，它们是这些模式的抽象，多以针对 [`Future`] 特质的函数的形式存在。

# 基础构件

让我们回顾之前几页中的 future 实现，看看怎么用组合器去简化它们。

## `map`

[`map`] 组合器拥有一个 future 并返回一个新 future，新 future 的值是通过前一个 future 调用某个给定的函数获得的。

这是之前实现的 future `Display`：

```rust
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

fn main() {
    let future = Display(HelloWorld);
    tokio::run(future);
}
```

如果用 `map` 组合器来写的话，就是这样的:

```rust
extern crate tokio;
extern crate futures;

use futures::Future;

fn main() {
    let future = HelloWorld.map(|value| {
        println!("{}", value);
    });

    tokio::run(future);
}
```

下面是 `map` 的实现:

```rust
pub struct Map<A, F> where A: Future {
    future: A,
    f: Option<F>,
}

impl<U, A, F> Future for Map<A, F>
    where A: Future,
          F: FnOnce(A::Item) -> U,
{
    type Item = U;
    type Error = A::Error;

    fn poll(&mut self) -> Poll<U, A::Error> {
        let value = try_ready!(self.future.poll());
        let f = self.f.take().expect("cannot poll Map twice");

        Ok(Async::Ready(f(value)))
    }
}
```
把 `Map` 和我们的 `Display` 放在一起比较，就可以明显看出它们的相似性。`Map` 在 `Display` 调用 `println!` 的相同位置把值传给了给定的函数。

## `and_then`

现在，让我们开始用 `and_then` 组合器重写建立TCP流以及写入 “hello world” 的 future。

`and_then` 组合器允许我们将两个异步操作连接起来。在第一个操作完成时，其值将被传递到一个函数中。该函数会使用该值创建一个新的 future 并使其运行。 `and_then` 和 `map` 的区别是 `and_then` 的函数返回一个 future，而 `map` 的函数返回一个值。

最初的实现在 [这里][connect-and-write]。用组合器重写的话，就是这样的:

```rust
extern crate tokio;
extern crate bytes;
extern crate futures;

use tokio::io;
use tokio::net::TcpStream;
use futures::Future;

fn main() {
    let addr = "127.0.0.1:1234".parse().unwrap();

    let future = TcpStream::connect(&addr)
        .and_then(|socket| {
            io::write_all(socket, b"hello world")
        })
        .map(|_| println!("write complete"))
        .map_err(|_| println!("failed"));

    tokio::run(future);
}
```

进一步的计算也可以用链式调用 `and_then` 来连接。比如：

```rust
# #![deny(deprecated)]
# extern crate tokio;
# extern crate bytes;
# extern crate futures;
#
# use tokio::io;
# use tokio::net::TcpStream;
# use futures::Future;

fn main() {
    let addr = "127.0.0.1:1234".parse().unwrap();

    let future = TcpStream::connect(&addr)
        .and_then(|socket| {
            io::write_all(socket, b"hello world")
        })
        .and_then(|(socket, _)| {
            // 只读取11个字节
            io::read_exact(socket, vec![0; 11])
        })
        .and_then(|(socket, buf)| {
            println!("got {:?}", buf);
            Ok(())
        });

# let future = futures::future::ok::<(), ()>(());
    tokio::run(future);
}
```

`and_then` 返回的 future 会像我们在之前手动实现的 future 那样执行。

# 基本组合器

花时间看一下 [`Future` 特质][trait-dox] 和其 [模块][mod-dox] 的文档来熟悉所有可用的组合器是很值得的。本文仅提供快速简要的概述。

[trait-dox]: https://docs.rs/futures/0.1/futures/future/trait.Future.html
[mod-dox]: https://docs.rs/futures/0.1/futures/future/index.html

## Concrete futures

Any value can be turned into an immediately complete future. There are a few
functions in the `future` module for creating such a future:

- [`ok`], analogous to `Result::Ok`, converts the provided value into a
  immediately ready future that yields back the value.
- [`err`], analogous to `Result::Err`, converts the provided error into an
  immediately ready future that fails with the error.  as an immediately failed
  future.
- [`result`] lifts a result to an immediately complete future.

[`ok`]: https://docs.rs/futures/0.1/futures/future/fn.ok.html
[`err`]: https://docs.rs/futures/0.1/futures/future/fn.err.html
[`result`]: https://docs.rs/futures/0.1/futures/future/fn.result.html

In addition, there is also a function, [`lazy`], which allows constructing a
future given a *closure*. The closure is not immediately invoked, instead it is
invoked the first time the future is polled.

[`lazy`]: https://docs.rs/futures/0.1/futures/future/fn.lazy.html

## IntoFuture

A crucial API to know about is the [`IntoFuture`] trait, which is a trait for
values that can be converted into futures. Most APIs that you think of as taking
futures actually work with this trait instead. The key reason: the trait is
implemented for `Result`, allowing you to return `Result` values in many places
that futures are expected.

Most combinator closures that return a future actually return an instance of
[`IntoFuture`].

[`IntoFuture`]: https://docs.rs/futures/0.1/futures/future/trait.IntoFuture.html

## Adapters

Like [`Iterator`], the `Future` trait includes a broad range of "adapter"
methods. These methods all consume the future, returning a new future providing
the requested behavior. Using these adapter combinators, it is possible to:

* Change the type of a future ([`map`], [`map_err`])
* Run another future after one has completed ([`then`], [`and_then`],
  [`or_else`])
* Figure out which of two futures resolves first ([`select`])
* Wait for two futures to both complete ([`join`])
* Convert to a trait object ([`Box::new`])
* Convert unwinding into errors ([`catch_unwind`])

[`Iterator`]: https://doc.rust-lang.org/std/iter/trait.Iterator.html
[`Box`]: https://doc.rust-lang.org/std/boxed/struct.Box.html
[`Box::new`]: https://doc.rust-lang.org/std/boxed/struct.Box.html#method.new
[`map`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.map
[`map_err`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.map_err
[`then`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.then
[`and_then`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.and_then
[`or_else`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.or_else
[`select`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.select
[`join`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.join
[`catch_unwind`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.catch_unwind

# When to use combinators

Using combinators can reduce a lot of boilerplate, but they are not always a
good fit. Due to limitations, implementing `Future` manually is going to be common.

## Functional style

Closures passed to combinators must be `'static`. This means it is not possible
to pass references into the closure. Ownership of all state must be moved into
the closure. The reason for this is that lifetimes are based on the stack. With
asynchronous code, the ability to rely on the stack is lost.

Because of this, code written using combinators end up being very functional in
style. Let's compare Future combinators with synchronous `Result` combinators.

```rust
use std::io;

# struct Data;

fn get_data() -> Result<Data, io::Error> {
#     unimplemented!();
    // ...
}

fn get_ok_data() -> Result<Vec<Data>, io::Error> {
    let mut dst = vec![];

    for _ in 0..10 {
        get_data().and_then(|data| {
            dst.push(data);
            Ok(())
        });
    }

    Ok(dst)
}
```

This works because the closure passed to `and_then` is able to obtain a mutable
borrow to `dst`. The Rust compiler is able to guarantee that `dst` will outlive
the closure.

However, when using futures, it is no longer possible to borrow `dst`. Instead,
`dst` must be passed around. Something like:

```rust
extern crate futures;

use futures::{stream, Future, Stream};
use std::io;

# struct Data;

fn get_data() -> impl Future<Item = Data, Error = io::Error> {
# futures::future::ok(Data)
    // ...
}

fn get_ok_data() -> impl Future<Item = Vec<Data>, Error = io::Error> {
    let mut dst = vec![];

    // Start with an unbounded stream that uses unit values.
    stream::repeat(())
        // Only take 10. This is how the for loop is simulated using a functional
        // style.
        .take(10)
        // The `fold` combinator is used here because, in order to be
        // functional, the state must be moved into the combinator. In this
        // case, the state is the `dst` vector.
        .fold(dst, move |mut dst, _| {
            // Once again, the `dst` vector must be moved into the nested
            // closure.
            get_data().and_then(move |item| {
                dst.push(item);

                // The state must be included as part of the return value, so
                // `dst` is returned.
                Ok(dst)
            })
        })
}
# fn main() {}
```

Another strategy, which tends to work best with immutable data, is to store the
data in an `Arc` and clone handles into the closures. One case in which this
works well is sharing configuration values in multiple closures. For example:

```rust
extern crate futures;

use futures::{future, Future};
use std::io;
use std::sync::Arc;

fn get_message() -> impl Future<Item = String, Error = io::Error> {
    // ....
# futures::future::ok("".to_string())
}

fn print_multi() -> impl Future<Item = (), Error = io::Error> {
    let name = Arc::new("carl".to_string());

    let futures: Vec<_> = (0..1).map(|_| {
        // Clone the `name` handle, this allows multiple concurrent futures
        // to access the name to print.
        let name = name.clone();

        get_message()
            .and_then(move |message| {
                println!("Hello {}, {}", name, message);
                Ok(())
            })
    })
    .collect();

    future::join_all(futures)
        .map(|_| ())
}
```

## Returning futures

Because combinators often use closures as part of their type signature, it is
not possible to name the future type. This, in turn, means that the future type
cannot be used as part of a function's signature. When passing a future as a
function argument, generics can be used in almost all cases. For example:

```rust
extern crate futures;

use futures::Future;

fn get_message() -> impl Future<Item = String> {
    // ...
# futures::future::ok::<_, ()>("".to_string())
}

fn with_future<T: Future<Item = String>>(f: T) {
    // ...
# drop(f);
}

let my_future = get_message().map(|message| {
    format!("MESSAGE = {}", message)
});

with_future(my_future);
```

However, for returning futures, it isn't as simple. There are a few options with
pros and cons:

* [Use `impl Future`](#use-impl-future)
* [Trait objects](#trait-objects)
* [Implement `Future` by hand](#implement-future-by-hand)

### Use `impl Future`

As of Rust version **1.26**, the language feature [`impl Trait`] can be used for
returning combinator futures. This allows writing the following:

[`impl Trait`]: https://github.com/rust-lang/rfcs/blob/master/text/1522-conservative-impl-trait.md

```rust
# extern crate futures;
# use futures::Future;
fn add_10<F>(f: F) -> impl Future<Item = i32, Error = F::Error>
    where F: Future<Item = i32>,
{
    f.map(|i| i + 10)
}
```

The `add_10` function has a return type that is "something that implements
`Future`" with the specified associated types. This allows returning a future
without explicitly naming the future type.

The pros to this approach are that it is zero overhead and covers a wide variety
of cases. However, there is a problem when returning futures from different
code branches. For example:

```rust,ignore
if some_condition {
    return get_message()
        .map(|message| format!("MESSAGE = {}", message));
} else {
    return futures::ok("My MESSAGE".to_string());
}
```

#### Returning from multiple branches

This results in `rustc` outputting a compilation error of `error[E0308]: if and
else have incompatible types`. Functions returning `impl Future` must still have
a single return type. The `impl Future` syntax just means that the return type
does not have to be named. However, each combinator type has a **different**
type, so the types being returned in each conditional branch are different.

Given the above scenario, there are two options. The first is to change the
function to return a [trait object](#trait-objects). The second is to use the
[`Either`] type:

```rust
# extern crate futures;
# use futures::Future;
# use futures::future::{self, Either};
# fn get_message() -> impl Future<Item = String> {
# future::ok::<_, ()>("".to_string())
# }
# fn my_op() -> impl Future<Item = String> {
# let some_condition = true;
if some_condition {
    return Either::A(get_message()
        .map(|message| format!("MESSAGE = {}", message)));
} else {
    return Either::B(
        future::ok("My MESSAGE".to_string()));
}
# }
# fn main() {}
```

This ensures that the function has a single return type: `Either`.

In situations where there are more than two branches, `Either` enums must be
nested (`Either<Either<A, B>, C>`) or a custom, multi variant, enum is defined.

This scenario comes up often when trying to conditional return errors.
Consider:

```rust
# extern crate futures;
# use futures::{future::{self, Either}, Future};
# fn is_valid(_: &str) -> bool { true }
# fn get_message() -> impl Future<Item = String, Error = &'static str> { future::ok("".to_string()) }
fn my_operation(arg: String) -> impl Future<Item = String> {
    if is_valid(&arg) {
        return Either::A(get_message().map(|message| {
            format!("MESSAGE = {}", message)
        }));
    }

    Either::B(future::err("something went wrong"))
}
# fn main() {}
```

In order to return early when an error has been encountered, an `Either` variant
must be used to contain the error future.

[`Either`]: https://docs.rs/futures/0.1.25/futures/future/enum.Either.html

#### Associated types

Traits with functions that return futures must include an associated type for
that future. For example, consider a simplified version of the Tower [`Service`]
trait:

```rust,ignore
pub trait Service {
    /// Requests handled by the service.
    type Request;

    /// Responses given by the service.
    type Response;

    /// Errors produced by the service.
    type Error;

    /// The future response value.
    type Future: Future<Item = Self::Response, Error = Self::Error>;

    fn call(&mut self, req: Self::Request) -> Self::Future;
}
```

In order to implement this trait, the future returned by `call` must be
nameable and set to the `Future` associated type. In this case, `impl Future`
does not work and the future must either be boxed as a [trait
object](#trait-objects) or a custom future must be defined.

[`Service`]: https://docs.rs/tower-service/0.1/tower_service/trait.Service.html

### Trait objects

Another strategy is to return a boxed future as a [trait object]:

```rust
# extern crate futures;
# use std::io;
# use futures::Future;
# fn main() {}
fn foo() -> Box<Future<Item = u32, Error = io::Error> + Send> {
    // ...
# loop {}
}
```

The pro of this strategy is that it is easy to write `Box`. It also is able to
handle the "branching" described above with arbitrary number of branches:

```rust
# extern crate futures;
# use futures::{future::{self, Either}, Future};
# fn is_valid(_: &str) -> bool { true }
# fn get_message() -> impl Future<Item = String, Error = &'static str> { future::ok("".to_string()) }
fn my_operation(arg: String) -> Box<Future<Item = String, Error = &'static str> + Send> {
    if is_valid(&arg) {
        if arg == "foo" {
            return Box::new(get_message().map(|message| {
                format!("FOO = {}", message)
            }));
        } else {
            return Box::new(get_message().map(|message| {
                format!("MESSAGE = {}", message)
            }));
        }
    }

    Box::new(future::err("something went wrong"))
}
# fn main() {}
```

The downside is that the boxing approach requires more overhead. An allocation
is required to store the returned future value. In addition, whenever the future
is used Rust needs to dynamically unbox it via a runtime lookup (vtable).
This can make boxed futures slightly slower in practice, though the difference
is often not noticeable.

There is one caveat that can trip up authors trying to use a `Box<Future<...>>`,
particularly with `tokio::run`. By default, `Box<Future<...>>` is **not** `Send`
and cannot be sent across threads, **even if the future contained in the box is
`Send`**.

To make a boxed future `Send`, it must be annotated as such:

```rust,ignore
fn my_operation() -> Box<Future<Item = String, Error = &'static str> + Send> {
    // ...
}
```

[trait object]: https://doc.rust-lang.org/book/trait-objects.html

### Implement `Future` by hand

Finally, when the above strategies fail, it is always possible to fall back on
implementing `Future` by hand. Doing so provides full control, but comes at a
cost of additional boilerplate given that no combinator functions can be used
with this approach.

## When to use combinators

Combinators are powerful ways to reduce boilerplate in your Tokio based
application, but as discussed in this section, they are not a silver bullet. It
is common to implement custom futures as well as custom combinators. This raises
the question of when combinators should be used versus implementing `Future` by
hand.

As per the discussion above, if the future type must be nameable and a `Box` is
not acceptable overhead, then combinators may not be used. Besides this, it
depends on the complexity of the state that must be passed around between
combinators.

Scenarios when the state must be accessed concurrently from multiple combinators
may be a good case for implementing a `Future` by hand.

TODO: This section needs to be expanded with examples. If you have ideas to
improve this section, visit the [doc-push] repo and open an issue with your
thoughts.

[doc-push]: https://github.com/tokio-rs/doc-push
[`map`]: https://docs.rs/futures/0.1/futures/future/trait.Future.html#method.map
