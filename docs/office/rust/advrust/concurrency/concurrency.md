# Concurrency and Parallelism

> 原文跟踪[concurrency.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/concurrency.md) &emsp; Commit: 0e6c680ebd72f1860e46b2bd40e2a387ad8084ad

Rust as a language doesn't *really* have an opinion on how to do concurrency or
parallelism. The standard library exposes OS threads and blocking sys-calls
because everyone has those, and they're uniform enough that you can provide
an abstraction over them in a relatively uncontroversial way. Message passing,
green threads, and async APIs are all diverse enough that any abstraction over
them tends to involve trade-offs that we weren't willing to commit to for 1.0.

However the way Rust models concurrency makes it relatively easy to design your own
concurrency paradigm as a library and have everyone else's code Just Work
with yours. Just require the right lifetimes and Send and Sync where appropriate
and you're off to the races. Or rather, off to the... not... having... races.
