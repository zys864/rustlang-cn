# The Dot Operator

> 原文跟踪[dot-operator.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/dot-operator.md) &emsp; Commit: 0e6c680ebd72f1860e46b2bd40e2a387ad8084ad

The dot operator will perform a lot of magic to convert types. It will perform
auto-referencing, auto-dereferencing, and coercion until types match.

TODO: steal information from http://stackoverflow.com/questions/28519997/what-are-rusts-exact-auto-dereferencing-rules/28552082#28552082
