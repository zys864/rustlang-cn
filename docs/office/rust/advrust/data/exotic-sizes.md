# 特殊尺寸类型

> 原文跟踪[exotic-sizes.md](https://github.com/rust-lang-nursery/nomicon/blob/master/src/exotic-sizes.md) &emsp; Commit: 7f019ec5c87da39fe0b9b5149e413d914528e945

大多数情况下，我们希望类型具有静态已知和正确大小。 Rust中的情况并非总是如此。

## 动态大小类型（DST）

Rust支持动态大小类型（DST）：没有静态已知大小或对齐的类型。 从表面上看，这有点荒谬：Rust必须知道某些东西的大小和对齐方式才能正确使用它！ 在这方面，DST不是正常类型。 因为它们缺少静态已知的大小，所以这些类型只能存在于指针后面。 因此，任何指向DST的指针都变成一个宽指针，由指针和"完整"它们的信息组成（下面将详细介绍）。

该语言暴露了两个主要的DST：

* trait objects: `dyn MyTrait`
* slices: `[T]`, `str`, and others

特质对象表示实现其指定的特质的某种类型。 使用包含使用该类型所需的所有信息的vtable来删除确切的原始类型以支持运行时反射。 完成特质对象指针的信息是vtable指针。 可以从vtable动态请求指针对象的运行时大小。

切片只是一些连续存储的视图 - 通常是数组或Vec。 完成切片指针的信息就是它指向的元素数量。 指针对象的运行时大小只是元素的静态已知大小乘以元素的数量。

`Struct`实际上可以直接存储单个DST作为它们的最后一个字段，但这也使它们成为DST：

```rust
// Can't be stored on the stack directly
struct MySuperSlice {
    info: u32,
    data: [u8],
}
```

虽然没有构建它的方，则这种类型很大程度上是无用的。 目前，唯一正确支持的创建自定义DST的方法是使您的类型具有`generic`并执行**unsizing coercion**：

```rust
struct MySuperSliceable<T: ?Sized> {
    info: u32,
    data: T
}

fn main() {
    let sized: MySuperSliceable<[u8; 8]> = MySuperSliceable {
        info: 17,
        data: [0; 8],
    };

    let dynamic: &MySuperSliceable<[u8]> = &sized;

    // prints: "17 [0, 0, 0, 0, 0, 0, 0, 0]"
    println!("{} {:?}", dynamic.info, &dynamic.data);
}
```

(是的，现在，自定义DST是一个很大程度上是半生不熟的特性.)

## 零大小类型（ZST）

Rust还允许指定不占用空间的类型：

```rust
struct Nothing; // No fields = no size

// All fields have no size = no size
struct LotsOfNothing {
    foo: Nothing,
    qux: (),      // empty tuple has no size
    baz: [u8; 0], // empty array has no size
}
```

就其自身而言，零大小类型（ZST）由于显而易见的原因而非常无用。然而，正如Rust中许多奇特的布局选择一样，它们的潜力是在通用上下文中实现的：Rust很大程度上理解生成或存储ZST的任何操作都可以简化为无操作。首先，存储它甚至没有意义 - 它不占用任何空间。此外，只有一种类型的值，所以加载它的任何东西都可以从中产生它 - 这也是一种无操作，因为它不占用任何空间。

其中一个最极端的例子是`Sets`和`Maps`。给定`Map <Key，Value>`，通常将`Set <Key>`实现为`Map <Key，UselessJunk>`的一个薄包装器。在许多语言中，这需要为`UselessJunk`分配空间，并且只需要存储和加载`UselessJunk`后就可以丢弃它。证明这不必要对编译器来说是一个困难的分析。

但是在Rust中，我们可以说`Set <Key> = Map <Key，（）>`。现在Rust静态地知道每个加载和存储都是无用的，并且没有任何分配有任何大小。结果是单态化代码基本上是`HashSet`的自定义实现，没有`HashMap`必须支持值的开销。

安全代码不必担心ZST，但不安全的代码必须小心没有大小的类型的后果。特别是，指针偏移是无操作，并且当请求零大小的分配时，标准分配器可以返回`null`，这与内存不足结果无法区分。

## 空类型

Rust还允许声明甚至无法实例化的类型。 这些类型只能在类型级别进行讨论，而不能在值级别进行讨论。 可以通过指定不带变量的枚举来声明空类型：

```rust
enum Void {} // No variants = EMPTY
```

空类型比ZST更加边缘化。 空类型的主要激励示例是类型级不可达性。 例如，假设`API`通常需要返回结果，但实际上特定情况是绝对可靠的。 实际上，通过返回`Result <T，Void>`，可以在类型级别进行通信。 `API`的消费者可以自信地打开这样的结果，因为知道这个值在静态上不可能是`Err`，因为这需要提供`Void`类型的值。

原则上，Rust可以基于这个事实做一些有趣的分析和优化。 例如，`Result <T，Void>`仅表示为T，因为`Err`情况实际上并不存在（严格来说，这只是一个无法保证的优化，因此例如将一个转换为另一个仍然是UB）。

以下也可以编译：

```rust,ignore
enum Void {}

let res: Result<u32, Void> = Ok(0);

// Err doesn't exist anymore, so Ok is actually irrefutable.
let Ok(num) = res;
```

但是这个技巧还不行。

关于空类型的最后一个细微的细节是它们的原始指针实际上对构造是有效的，但是取消引用它们是未定义的行为，因为这没有意义。

我们建议不要使用`* const Void`对C的`void *`类型进行建模。 很多人开始这样做但很快就遇到了麻烦，因为Rust没有任何安全措施来防止尝试用不安全的代码实例化空类型，如果你这样做，那就是未定义的行为。 这尤其成问题，因为开发人员习惯将原始指针转换为引用，而`Void`也是未构造的行为。

`* const（）`（或等效的）适用于`void *`，并且可以在没有任何安全问题的情况下成为引用。 它仍然不会阻止您尝试读取或写入值，但至少它会编译为`no-op`而不是UB。

## 外部类型

有一个可接受的RFC来添加具有未知大小的合适类型，称为`extern`类型，这将使Rust开发人员更准确地模拟C的`void *`和其他"声明但未定义"类型的内容。 但是，从Rust 2018开始，该特性`size_of :: <MyExternType>（）`在应该如何表现方面陷入困境。

