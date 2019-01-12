# Implementing Arc and Mutex

> 原文跟踪[arc-and-mutex.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/arc-and-mutex.md) &emsp; Commit: 0e6c680ebd72f1860e46b2bd40e2a387ad8084ad

Knowing the theory is all fine and good, but the *best* way to understand
something is to use it. To better understand atomics and interior mutability,
we'll be implementing versions of the standard library's Arc and Mutex types.

TODO: ALL OF THIS OMG
