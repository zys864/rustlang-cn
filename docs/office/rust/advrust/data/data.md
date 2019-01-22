# Data Representation in Rust

> 原文跟踪[data.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/data.md) &emsp; Commit: 885c5bc5e721a9a9e9f94ed2101ad3d5e4424975

低级编程关注数据布局。 这是一个大问题。 它也普遍影响了语言的其余部分，因此我们将首先深入研究如何在Rust中表示数据。

理想情况下，本章与参考文献的[类型布局部分](https://doc.rust-lang.org/reference/type-layout.html)一致，并使其冗余。 本书第一次编写时，参考文献完全失修，本书试图作为参考资料的部分替代品。 现在不再是这种情况，所以理想情况下可以删除整章。

我们将本章保持一段时间，但理想情况下，您应该为`Reference`贡献任何新的事实或改进。
