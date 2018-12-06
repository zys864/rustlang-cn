# 异步化

Future 是用于管理异步的。想实现一个可以异步完成的 future ，我们就要正确地处理从内部 future 获得 `Async::NotReady` 的过程。

让我们从实现一个新的 future 开始，这个 future 将建立与远端的TCP套接字，然后把对端的 IP 地址写入到标准输出（stdout）。

```rust
# #![deny(deprecated)]
extern crate tokio;
#[macro_use]
extern crate futures;

use tokio::net::{TcpStream, tcp::ConnectFuture};
use futures::{Future, Async, Poll};

struct GetPeerAddr {
    connect: ConnectFuture,
}

impl Future for GetPeerAddr {
    type Item = ();
    type Error = ();

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        match self.connect.poll() {
            Ok(Async::Ready(socket)) => {
                println!("peer address = {}", socket.peer_addr().unwrap());
                Ok(Async::Ready(()))
            }
            Ok(Async::NotReady) => Ok(Async::NotReady),
            Err(e) => {
                println!("failed to connect: {}", e);
                Ok(Async::Ready(()))
            }
        }
    }
}

fn main() {
    let addr = "192.168.0.1:1234".parse().unwrap();
    let connect_future = TcpStream::connect(&addr);
    let get_peer_addr = GetPeerAddr {
        connect: connect_future,
    };

# if false {
    tokio::run(get_peer_addr);
# }
}
```

`GetPeerAddr` 的 future 实现非常类似于上一页的 `Display`。主要的区别在于, 这个例子中的 `self.connect.poll()` 在返回连接的套接字之前将 (有可能) 多次返回 `Async::NotReady`。此时，我们的 future 将返回 `NotReady`.

`GetPeerAddr` 所包含的 future 对象 [`ConnectFuture`] 在 TCP 流建立时被完成。它是由 [`TcpStream::connect`] 返回的.

当 `GetPeerAddr` 作为参数传递给 `tokio::run`时，Tokio 将多次调用 `poll` 函数，直到它返回 `Ready`。其中的确切机制将在后续章节介绍。

在实现 `Future` 时， **除非** 我们通过调用内部 future 的 `poll` 函数获得了 `Async::NotReady`，我们的 `poll` **一定不能** 返回 `Async::NotReady`。
一种理解思路是：当一个 future 被拉取值时，它必须尽其所能的执行任务，直到它被完成或者被内部的 future 阻塞。

# 链式计算

现在，我们拿着这个建立连接的 future，给它加上 TCP 套接字建立后打印 “hello world” 的功能。

```rust
# #![deny(deprecated)]
extern crate tokio;
extern crate bytes;
#[macro_use]
extern crate futures;

use tokio::io::AsyncWrite;
use tokio::net::{TcpStream, tcp::ConnectFuture};
use bytes::{Bytes, Buf};
use futures::{Future, Async, Poll};
use std::io::{self, Cursor};

// HelloWorld 有两个状态, 即等待连接的状态和已经连接的状态
enum HelloWorld {
    Connecting(ConnectFuture),
    Connected(TcpStream, Cursor<Bytes>),
}

impl Future for HelloWorld {
    type Item = ();
    type Error = io::Error;

    fn poll(&mut self) -> Poll<(), io::Error> {
        use self::HelloWorld::*;

        loop {
            let socket = match *self {
                Connecting(ref mut f) => {
                    try_ready!(f.poll())
                }
                Connected(ref mut socket, ref mut data) => {
                    // 只要缓冲区还有可用的数据，就一直将其写入到套接字中
                    while data.has_remaining() {
                        try_ready!(socket.write_buf(data));
                    }

                    return Ok(Async::Ready(()));
                }
            };

            let data = Cursor::new(Bytes::from_static(b"hello world"));
            *self = Connected(socket, data);
        }
    }
}

fn main() {
    let addr = "127.0.0.1:1234".parse().unwrap();
    let connect_future = TcpStream::connect(&addr);
    let hello_world = HelloWorld::Connecting(connect_future);
# let hello_world = futures::future::ok::<(), ()>(());

    // 运行之
    tokio::run(hello_world)
}
```

将 future 实现为其可能状态的枚举类型是很常见的用法。这使得 future 实现可以通过枚举值的变化跟踪内部状态。

此例中的 future 被描述为以下状态的枚举：

1. 连接中
2. 将 “hello world” 写入到套接字中

The future starts in the connecting state with an inner future of type
[`ConnectFuture`]. It repeatedly polls this future until the socket is returned.
The state is then transitioned to `Connected`.

From the `Connected` state, the future writes data to the socket. This is done
with the [`write_buf`] function. I/O functions are covered in more detail in the
[next section][io_section]. Briefly, [`write_buf`] is a non-blocking function to
write data to the socket. If the socket is not ready to accept the write,
`NotReady` is returned. If some data (but not necessarily all) was written,
`Ready(n)` is returned, where `n` is the number of written bytes. The cursor is
also advanced.

Once in the `Connected` state, the future must loop as long as there is data
left to write. Because [`write_buf`] is wrapped with `try_ready!()`, when
[`write_buf`] returns `NotReady`, our `poll` function returns with `NotReady`.

At some point in the future, our `poll` function is called again. Because it is
in the `Connected` state, it jumps directly to writing data.

**Note** the loops are important. Many future implementations contain loops.
These loops are necessary because `poll` cannot return until either all the data
is written to the socket, or an inner future ([`ConnectFuture`] or
[`write_buf`]) returns `NotReady`.

[`ConnectFuture`]: https://docs.rs/tokio/0.1/tokio/net/tcp/struct.ConnectFuture.html
[`write_buf`]: https://docs.rs/tokio/0.1/tokio/io/trait.AsyncWrite.html#method.write_buf
[`TcpStream::connect`]: https://docs.rs/tokio/0.1.12/tokio/net/struct.TcpStream.html#method.connect
