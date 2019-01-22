# repr(Rust)

> 原文跟踪[repr-rust.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/repr-rust.md) &emsp; Commit: 7f019ec5c87da39fe0b9b5149e413d914528e945

首先，所有类型都有以字节为单位指定的对齐方式。该对齐类型指定哪些地址有效以存储值。 一个对齐“n”的值只能存储在一个`N`倍数的地址中。 因此，对齐2意味着您必须存储在偶数地址，1表示你可以存放在任何地方。

基元通常与它们的大小一致，尽管如此特定于平台的行为。 例如，在x86上，`u64`和`f64`经常出现对齐到4个字节（32位）。

类型的大小必须始终是其对齐的倍数。 这确保了该类型的数组可以始终通过偏移其倍数来索引尺寸。 请注意，可能不知道类型的大小和对齐方式在[动态大小的类型] (https://rustlang-cn.org/office/rust/advrust/data/exotic-sizes.html#dynamically-sized-types-dsts)的情况下。

Rust为您提供了以下布置复合数据的方法：

* structs（命名产品类型）
* tuples（匿名产品类型）
* arrays（同类产品类型）
* enums （命名总和类型 - 标记的`unions`）
* unions（未标记的`unions`）

如果枚举的成员变量没有任何关联数据，则称枚举是**field-less**。

默认情况下，复合结构的对齐方式等于其字段对齐的最大值。因此，Rust将在必要时插入填充，以确保所有字段都正确对齐，并且整体类型的大小是其对齐的倍数。例如：

```rust
struct A {
    a: u8,
    b: u32,
    c: u16,
}
```

将在目标上进行32位对齐，将这些基元与各自的大小对齐。因此整个结构的大小是32位的倍数。它可能会成为：

```rust
struct A {
    a: u8,
    _pad1: [u8; 3], // to align `b`
    b: u32,
    c: u16,
    _pad2: [u8; 2], // to make overall size multiple of 4
}
```

或者可能：

```rust
struct A {
    b: u32,
    c: u16,
    a: u8,
    _pad: u8,
}
```

这些类型为**no indirection**; 所有数据都存储在结构中，正如您在C中所期望的那样。但是除了数组（密集且按顺序）之外，默认情况下不指定数据布局。给出以下两个结构定义：

```rust
struct A {
    a: i32,
    b: u64,
}

struct B {
    a: i32,
    b: u64,
}
```

Rust保证A的两个实例在完全相同的方式布局他们的数据。但是，Rust 目前不保证A的实例具有与B的实例相同的字段排序或填充。

使用A和B编写，这一点似乎很迂腐，但Rust的其他几个特性使得语言可以以复杂的方式来数据布局。

例如，考虑这个结构：

```rust
struct Foo<T, U> {
    count: u16,
    data1: T,
    data2: U,
}
```

现在考虑的monomorphizations Foo<u32, u16>和Foo<u16, u32>。如果Rust以指定的顺序排列字段，我们希望它填充结构中的值以满足其对齐要求。因此，如果Rust没有重新排序字段，我们希望它产生以下内容：

```rust
struct Foo<u16, u32> {
    count: u16,
    data1: u16,
    data2: u32,
}

struct Foo<u32, u16> {
    count: u16,
    _pad1: u16,
    data1: u32,
    data2: u16,
    _pad2: u16,
}
```

后一种情况非常简单地浪费空间。空间的最佳使用需要不同的`monomorphizations`以具有不同成员字段排序。

枚举使这一考虑变得更加复杂。如：

```rust
enum Foo {
    A(u32),
    B(u64),
    C(u8),
}
```

可能布局为：

```rust
struct FooRepr {
    data: u64, // this is either a u64, u32, or u8 based on `tag`
    tag: u8,   // 0 = A, 1 = B, 2 = C
}
```

事实上，这大致是如何布局的（以模块的大小和位置为模）。

然而，在某些情况下，这种表示效率低下。经典的情况是Rust的“空指针优化”：由单个外部单元变量（例如None）和（可能嵌套的）非可空指针变量（例如Some（＆T））组成的枚举使得标签不必要。空指针可以安全地解释为unit (None)变量。最终结果是，例如，size_of :: <Option <＆T >>（）== size_of :: <＆T>（）`。

Rust中有许多类型包含或包含非可空指针，如`Box <T>`，`Vec <T>`，`String`，`＆T`和`＆mut T`.同样，可以想象嵌套枚举将其标记汇集到单个判别式中，因为根据定义它们具有有限范围的有效值。原则上，枚举可以使用相当精细的算法来存储具有禁用值的嵌套类型中的位。因此，特别希望我们今天不指定枚举布局。
