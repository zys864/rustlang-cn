# 简单的 HTTP 服务器

让我们用 `async`/`await!` 构建一个 echo 服务器！
首先，执行 `rustup update nightly` 来确保你已经使用了最新以及最好的 Rust 版本——我们要使用最前沿的特性，所以需要保持最新。完成这一步之后，执行 `cargo +nightly new async-await-echo` 来创建一个工程，然后打开生成的 `async-await-echo` 目录。

我们在 `Cargo.toml` 文件中加入一些依赖项:

```toml
[dependencies]
 # The latest version of the "futures" library, which has lots of utilities
# for writing async code. Enable the "tokio-compat" feature to include the
# functions for using futures 0.3 and async/await with the Tokio library.
futures-preview = { version = "0.3.0-alpha.9", features = "tokio-compat"] }
 # Hyper is an asynchronous HTTP library. We'll use it to power our HTTP
# server and to make HTTP requests.
hyper = "0.12.9"
 # Tokio is a runtime for asynchronous I/O applications. Hyper uses
# it for the default server runtime. The `tokio` crate also provides an
# an `await!` macro similar to the one in `std`, but it supports `await!`ing
# both futures 0.1 futures (the kind used by Hyper and Tokio) and
# futures 0.3 futures (the kind produced by the new `async`/`await!` language
# feature).
tokio = { version = "0.1.11", features = ["async-await-preview"] }
```

好的，我们已经搞定了依赖项，现在开始编码。打开 `src/main.rs` 文件，并在文件开头处启用下面的特性：

 ```rust
#![feature(async_await, await_macro, futures_api)]
```

- `async_await` 增加了对 `async fn` 语法的支持。
- `await_macro` 增加了对 `await!` 宏的支持.
- `futures_api` 增加了对 nightly 版本中 `std::future` 和 `std::task` 模块的支持，这两个模块定义了核心库的 `Future` 特质以及相关依赖类型。
  
另外，我们还需要再加一些导入项：

```rust
use {
    hyper::{
        // Miscellaneous types from Hyper for working with HTTP.
        Body, Client, Request, Response, Server, Uri,
         // This function turns a closure which returns a future into an
        // implementation of the the Hyper `Service` trait, which is an
        // asynchronous function from a generic `Request` to a `Response`.
        service::service_fn,
         // A function which runs a future to completion using the Hyper runtime.
        rt::run,
    },
    futures::{
        // `TokioDefaultSpawner` tells futures 0.3 futures how to spawn tasks
        // onto the Tokio runtime.
        compat::TokioDefaultSpawner,
         // Extension traits providing additional methods on futures.
        // `FutureExt` adds methods that work for all futures, whereas
        // `TryFutureExt` adds methods to futures that return `Result` types.
        future::{FutureExt, TryFutureExt},
    },
    std::net::SocketAddr,
     // This is the redefinition of the await! macro which supports both
    // futures 0.1 (used by Hyper and Tokio) and futures 0.3 (the new API
    // exposed by `std::future` and implemented by `async fn` syntax).
    tokio::await,
};
```

处理好了导入项，
Once the imports are out of the way, we can start putting together the
boilerplate to allow us to serve requests:

```rust
async fn serve_req(req: Request<Body>) -> Result<Response<Body>, hyper::Error> {
    unimplemented!()
}
async fn run_server(addr: SocketAddr) {
    println!("Listening on http://{}", addr);
     // Create a server bound on the provided address
    let serve_future = Server::bind(&addr)
        // Serve requests using our `async serve_req` function.
        // `serve` takes a closure which returns a type implementing the
        // `Service` trait. `service_fn` returns a value implementing the
        // `Service` trait, and accepts a closure which goes from request
        // to a future of the response. In order to use our `serve_req`
        // function with Hyper, we have to box it and put it in a compatability
        // wrapper to go from a futures 0.3 future (the kind returned by
        // `async fn`) to a futures 0.1 future (the kind used by Hyper).
        .serve(|| service_fn(|req|
            serve_req(req).boxed().compat(TokioDefaultSpawner)
        ));
     // Wait for the server to complete serving or exit with an error.
    // If an error occurred, print it to stderr.
    if let Err(e) = await!(serve_future) {
        eprintln!("server error: {}", e);
    }
}
fn main() {
    // Set the address to run our socket on.
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
     // Call our run_server function, which returns a future.
    // As with every `async fn`, we need to run that future in order for
    // `run_server` to do anything. Additionally, since `run_server` is an
    // `async fn`, we need to convert it from a futures 0.3 future into a
    // futures 0.1 future.
    let futures_03_future = run_server(addr);
    let futures_01_future =
        futures_03_future.unit_error().boxed().compat(TokioDefaultSpawner);
     // Finally, we can run the future to completion using the `run` function
    // provided by Hyper.
    run(futures_01_future);
}
```

如果现在执行 `cargo run`，你应该能看到终端输出 "Listening on http://127.0.0.1:300" 的消息。在浏览器中打开这个 URL，你将看到 "thread ... panicked at 'not yet implemented'." 的字样。不错！我们只缺处理请求的代码了。开始我们先直接返回一个静态的消息：
If you `cargo run` now, you should see the message "Listening on
http://127.0.0.1:300" printed on your terminal. If you open that URL in your
browser of choice, you'll see "thread ... panicked at 'not yet implemented'."
Great! Now we just need to actually handle requests. To start, let's just
return a static message:

```rust
async fn serve_req(req: Request<Body>) -> Result<Response<Body>, hyper::Error> {
    // Always return successfully with a response containing a body with
    // a friendly greeting ;)
    Ok(Response::new(Body::from("hello, world!")))
}
```

If you `cargo run` again and refresh the page, you should see "hello, world!"
appear in your browser. Congratulations! You just wrote your first asynchronous
webserver in Rust.
 You can also inspect the request itself, which contains information such as
the request URI, HTTP version, headers, and other metadata. For example, we
can print out the URI of the request like this:

```rust
println!("Got request at {:?}", req.uri());
```

You may have noticed that our ight now, we're not even doing
anything asynchronous when handling the request-- we just respond immediately,
so we're not taking advantage of the flexibility that `async fn` gives us.
Rather than just returning a static message, let's try proxying the user's
request to another website using Hyper's HTTP client.
 We start by parsing out the URL we want to request:

```rust
let url_str = "http://www.rust-lang.org/en-US/";
let url = url_str.parse::<Uri>().expect("failed to parse URL");
```

Then we can create a new `hyper::Client` and use it to make a `GET` request,
returning the response to the user:

```rust
let res = await!(Client::new().get(url));
// Return the result of the request directly to the user
println!("request finished --returning response");
res
```

`Client::get` returns a `hyper::client::FutureResponse`, which implements
`Future<Output = Result<Response, Error>>`
(or `Future<Item = Response, Error = Error>` in futures 0.1 terms).
When we `await!` that future, an HTTP request is sent out, the current task
is suspended, and the task is queued to be continued once a response has
become available.

Now, if you `cargo run` and open `http://127.0.0.1:3000/foo` in your browser,
you'll see the Rust homepage, and the following terminal output:

```bash
Listening on http://127.0.0.1:3000
Got request at /foo
making request to http://www.rust-lang.org/en-US/
request finished-- returning response
```

Congratulations! You just proxied an HTTP request.