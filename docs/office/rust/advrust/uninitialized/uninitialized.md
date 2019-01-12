# Working With Uninitialized Memory

> 原文跟踪[uninitialized.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/uninitialized.md) &emsp; Commit: 0e6c680ebd72f1860e46b2bd40e2a387ad8084ad

All runtime-allocated memory in a Rust program begins its life as
*uninitialized*. In this state the value of the memory is an indeterminate pile
of bits that may or may not even reflect a valid state for the type that is
supposed to inhabit that location of memory. Attempting to interpret this memory
as a value of *any* type will cause Undefined Behavior. Do Not Do This.

Rust provides mechanisms to work with uninitialized memory in checked (safe) and
unchecked (unsafe) ways.
