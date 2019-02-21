# Alternative representations

> 源-[other-reprs](https://github.com/rust-lang-nursery/nomicon/blob/master/src/other-reprs.md) &nbsp; Commit: 7f019ec5c87da39fe0b9b5149e413d914528e945

Rust允许您从默认中指定替代数据布局策略。 这里有[reference].

## repr(C)

这是最重要的一种`repr`。它的目的很简单，就是和C保持一致。数据的顺序、大小、对齐方式都和你在C或C++中见到的一摸一样。所有你需要通过FFI交互的类型都应该有`repr(C)`，因为C是程序设计领域的世界语。而且如果我们要在数据布局方面玩一些花活的话，比如把数据重新解析成另一种类型，`repr(C)`也是很有必要的。

我们强烈建议您使用[rust-bindgen]和/或[cbdingen]来管理您的FFI边界。 Rust团队与这些项目密切合作，以确保它们运行稳健，并与当前和未来有关类型布局和`reprs`保证兼容。

必须牢记`repr（C）`与Rust更具特殊的数据布局特性的相互作用。 由于其"用于FFI"和"用于布局控制"的双重目的，`repr（C）`可以应用于通过FFI边界时无意义或有问题的类型。

* ZST的大小是0，尽管这在C语言中不是标准行为，而且它也与C++中的空类型有着明显的不同，C++的空类型还是要占用一个字节的空间的。

* DST的指针（胖指针），元组都是C中没有的，因此也不是FFI安全的。

* Enums with fields also aren't a concept in C or C++, but a valid bridging
  of the types [is defined][really-tagged].

* If `T` is an [FFI-safe non-nullable pointer
  type](ffi.html#the-nullable-pointer-optimization),
  `Option<T>` is guaranteed to have the same layout and ABI as `T` and is
  therefore also FFI-safe. As of this writing, this covers `&`, `&mut`,
  and function pointers, all of which can never be null.

* Tuple structs are like structs with regards to `repr(C)`, as the only
  difference from a struct is that the fields aren’t named.

* `repr(C)` is equivalent to one of `repr(u*)` (see the next section) for
fieldless enums. The chosen size is the default enum size for the target platform's C
application binary interface (ABI). Note that enum representation in C is implementation
defined, so this is really a "best guess". In particular, this may be incorrect
when the C code of interest is compiled with certain flags.

* Fieldless enums with `repr(C)` or `repr(u*)` still may not be set to an
integer value without a corresponding variant, even though this is
permitted behavior in C or C++. It is undefined behavior to (unsafely)
construct an instance of an enum that does not match one of its
variants. (This allows exhaustive matches to continue to be written and
compiled as normal.)

## repr(transparent)

This can only be used on structs with a single non-zero-sized field (there may
be additional zero-sized fields). The effect is that the layout and ABI of the
whole struct is guaranteed to be the same as that one field.

The goal is to make it possible to transmute between the single field and the
struct. An example of that is [`UnsafeCell`], which can be transmuted into
the type it wraps.

Also, passing the struct through FFI where the inner field type is expected on
the other side is guaranteed to work. In particular, this is necessary for `struct
Foo(f32)` to always have the same ABI as `f32`.

More details are in the [RFC][rfc-transparent].

## repr(u*), repr(i*)

These specify the size to make a fieldless enum. If the discriminant overflows the integer it has to fit in, it will produce a compile-time error. You can manually ask Rust to allow this by setting the overflowing element to explicitly be 0. However Rust will not allow you to create an enum where two variants have the same discriminant.

"fieldless enum" 的意思是枚举的每一个变量里都不关联数据。不指定repr(u*)或repr(i*)的无成员枚举依然是一个Rust的合法原生类型，它们都没有固定的ABI表示方法。给它们指定`repr`使其有了固定的类型大小，方便在ABI中使用。

如果枚举有字段，则效果类似于`repr（C）`，因为有一个定义的类型布局。 这使得它可以将枚举传递给C代码，或直接访问类型的原始表示操纵它的标签和字段。 有关详细信息，请参阅RFC [really-tagged]。

为枚举显式指定`repr`将抑制空指针优化。

这些`repr`对于结构体无效。

## repr(packed)

`repr(packed)`强制Rust不填充空数据，只将类型与一个字节对齐。 这可能会改善内存占用，但可能会产生其他负面影响。

特别是，大多数架构都强烈推荐将数据对齐。 这意味着加载未对齐的数据会很低效（x86)，甚至是错误的(一些ARM芯片)。 对于直接加载或存储打包字段的简单情况，编译器可能能够通过移位和掩码来解决对齐问题。 但是，如果您对打包字段进行引用，则编译器不太可能生成代码以避免未对齐的加载。

**[从Rust 2018开始，这仍然会导致未定义的行为][ub loads]**

`repr(packed)` 不能轻易使用。 除非您有极端要求，否则不应使用此选项。

这个repr是`repr（C）`和`repr（rust）`的修改。

## repr(align(n))

`repr(align(n))` (where `n` is a power of two) forces the type to have an
alignment of *at least* n.

This enables several tricks, like making sure neighboring elements of an array
never share the same cache line with each other (which may speed up certain
kinds of concurrent code).

This is a modifier on `repr(C)` and `repr(rust)`. It is incompatible with
`repr(packed)`.

[reference]: https://github.com/rust-rfcs/unsafe-code-guidelines/tree/master/reference/src/representation
[drop flags]: drop-flags.html
[ub loads]: https://github.com/rust-lang/rust/issues/27060
[`UnsafeCell`]: ../std/cell/struct.UnsafeCell.html
[rfc-transparent]: https://github.com/rust-lang/rfcs/blob/master/text/1758-repr-transparent.md
[really-tagged]: https://github.com/rust-lang/rfcs/blob/master/text/2195-really-tagged-unions.md
[rust-bindgen]: https://rust-lang-nursery.github.io/rust-bindgen/
[cbindgen]: https://github.com/eqrion/cbindgen
