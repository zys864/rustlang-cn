# Beneath std

> 原文跟踪[beneath-std.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/beneath-std.md) &emsp; Commit: a0c1de174abda5bc5655ed27b0c5741a1a48a92e

This section documents (or will document) features that are provided by the standard library and
that `#![no_std]` developers have to deal with (i.e. provide) to build `#![no_std]` binary crates. A
(likely incomplete) list of such features is shown below:

- #[lang = "eh_personality"]
- #[lang = "start"]
- #[lang = "termination"]
- #[panic_implementation]
