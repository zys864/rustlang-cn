# `Stream`特质

tream`特质类似于Future，但可以在完成之前得到多个值，类似于标准库的`Iterator`特质：

```rust
trait Stream {
    /// The type of value yielded by the stream.
    type Item;

    /// Attempt to resolve the next item in the stream.
    /// Returns `Poll::Pending` if not ready, `Poll::Ready(Some(x))` if a value
    /// is ready, and `Poll::Ready(None)` if the stream has completed.
    fn poll_next(self: Pin<&mut Self>, lw: &LocalWaker)
        -> Poll<Option<Self::Item>>;
}
```

`Stream`的一个常见的例子是 来自`futures`箱子的`Receiver`通道类型。每次从Sender端发送一个值时它都会产生某个值，并且一旦`Sender`端被删除，它就会产生`None`并且收到端暂停所有消息接收：

```rust
use futures::channel::mpsc;
use futures::prelude::*;

let fut = async {
    let (tx, rx) = mpsc::channel(BUFFER_SIZE);
    await!(tx.send(1)).unwrap();
    await!(tx.send(2)).unwrap();
    drop(tx);

    // `StreamExt::next` is similar to `Iterator::next`, but returns a
    // type that implements `Future<Output = Option<T>>`.
    assert_eq!(Some(1), await!(rx.next()));
    assert_eq!(Some(2), await!(rx.next()));
    assert_eq!(None, await!(rx.next()));
};
```

## 模式：迭代和并发

与同步`Iterators` 类似，有许多不同的方法可以迭代和处理`Stream`中的值。有组合子式的方法，如`map`，`filter`和`fold`，和` try_map`，`try_filter`和`try_fold`。

不幸的是，`for`循环不能用于`Streams`，但是对于命令式代码，`while let`和`for_each`可用：

```rust
use futures::prelude::*;

let fut = async {
    let mut stream: impl Stream<Item = Result<i32, io::Error>> = ...;

    // processing with `try_for_each`:
    await!(stream.try_for_each(async |item| {
        // handle `item`
        Ok(())
    }))?;

    // processing with `while let`:
    while let Some(item) = await!(stream.try_next())? {
        // handle `item`
    }

    ...

    Ok(())
};
```

但是，如果我们一次只处理一个元素，那么我们可能会失去并发机会，毕竟，这就是我们为什么要编写异步代码的原因。要同时处理流中的多个项，请使用`for_each_concurrent`和`try_for_each_concurrent` 方法：

```rust
use futures::prelude::*;

let fut = async {
    let mut stream: impl Stream<Item = Result<i32, io::Error>> = ...;

    await!(stream.try_for_each_concurrent(MAX_CONCURRENT_JUMPERS, async |num| {
        await!(jump_n_times(num))?;
        await!(report_jumps(num))?;
        Ok(())
    })?;

    ...
    Ok(())
};
```

这种方法允许最多`MAX_CONCURRENT_JUMPERS`一次跳转（或对项执行任何操作，就此而言 - API并不严格依赖于跳跃）。如果您希望一次允许无限数量的操作，您可以使用`None`而不是`MAX_CONCURRENT_...`，但要注意，如果`stream`来自不受信任的用户输入，这可能允许不端的客户端行为使系统同时请求过多而过载。
