在本章中，我们将介绍以下配方：

 - 在Rust中定义一个模块
 - 构建嵌套模块
 - 使用struct创建模块
 - 控制模块
 - 访问模块
 - 创建文件层次结构
 - 在Rust中构建库
 - 调用外部包


# 介绍

本章重点介绍Rust中的模块和包。 它将帮助您开发高度模块化和生产级的Rust应用程序。 有了这个，您将拥有一个出色的文件层次结构，这将以模块化方式补充功能的开发。 本章中的配方还将帮助您在Rust中构建库，并通过外部程序定义，控制和访问功能。

# 在Rust中定义一个模块

所有应用程序必须模块化，以便易于维护和开发。 在Rust中，我们可以为我们的应用程序提供一个功能强大的模块系统，可以将应用程序源代码分层次地拆分为逻辑单元（我们称之为模块），并在整个应用程序中管理它们的可见性（公共/私有）。

模块的字典描述是它是项的集合，例如函数，结构，特征，impl块，甚至其他模块。

您将学习如何创建示例模块并了解此配方中可见性的概念。

## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

1.创建一个名为sample_mod.rs的文件，并在文本编辑器中将其打开。
2.使用相关信息编写代码头：

```
//-- #########################
//-- Task: To create a sample module to illustrate
how to use a module in rust
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 4 March 17
//-- #########################
```

3.使用mod关键字创建名为sample_mod的模块，并在其中定义名为private_function的函数：

```
// Defined module named `sample_mod`
mod sample_mod {
// By default all the items in module have private
visibility
fn private_function() {
println!("called `sample_mod::private_function()`
\n");
}
```

4.使用模块中的pub关键字，通过将其可见性标记为public来定义名为sample_function的函数：

```
// Using the `pub` keyword changes it visibility to public
pub fn sample_function() {
println!("called `sample_mod::sample_function()` \n");
}
```

5.声明一个公共函数indirect_private_fn，它将调用private_function：

```
// Public items of the module can access the private visible
items
pub fn indirect_private_fn() {
print!("called `sample_mod::indirect_access()`, that \n ");
private_function();
}
}
```

6.在sample_mod模块的范围之外定义sample_function：

```
// Created a sample function to illustrate calling of
fn sample_function() {
println!("Called the `sample_function()` which is not a part
of
mod `sample_mod` \n");
}
```

7.声明main函数，我们将在其中调用sample_mod模块的每个项目以了解它们的工作方式并打印输出：

```
// Execution of the program starts from here
fn main() {
// Calling the sample_function which is outside module
sample_function();
// Calling the public visible sample_mod's sample_function
sample_mod::sample_function();
// Accessing the private function indirectly
sample_mod::indirect_private_fn();
// Error! `private_function` is private
//sample_mod::private_function(); // TODO ^ Try uncommenting
this line
}
```

在正确设置上述代码后，您应该在编译和运行程序时获得以下屏幕截图输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180925204830789?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 怎么运行的...

在本文中，您学习了如何在Rust中创建示例模块以及如何调用模块中的项目。

从本章开始，我们将遵循标题样式，这是我们的第一步。 它基本上描述了应用程序单元的代码或部分功能。 这是一个非常好的代码实践，因为它有助于另一个人从你开发的地方开始。

我们使用mod关键字创建了一个名为sample_mod的模块，然后是大括号{}。 模块的内容是它的项目。 每个项目都旨在执行特定任务。 默认情况下，模块中的所有项都具有私有可见性，这意味着无法直接在范围外访问它们。 在sample_mod模块中，我们使用pub关键字显式创建了两个具有公共可见性的函数。 我们在使用fn关键字创建或声明函数之前添加了关键字。 这使项目在模块范围之外公开可见。 可以在模块范围内访问私有函数或项目，其中所有项目可以相互调用，因此我们可以间接调用公共项目以从中访问私有项目。

我们在此代码中创建了四个函数，其中三个在模块内部，一个可以全局访问。 我们在sample_mod中创建的第一个函数是private_function，默认情况下，它具有私有可见性。 然后我们创建了两个公共函数，即sample_function和indirect_private_fn，其中indirect_private_fn在其体内调用private_function

要在其范围之外调用模块的项，我们必须遵循特定的语法-module_name :: publically_visible_function名称。 在main函数中，我们调用sample_fucntion（它是常规函数）和sample_mode模块的两个公开可见项：function sample_mod :: sample_function（）和sample_mod :: indirect_private_fn（）。 这些项目将执行各自范围内的内容。

>在调用模块的私有项时，它将抛出一个错误，指出特定项是私有的。 例如，在前面的配方中，当我们直接调用sample_mod :: private_function（）时，我们得到了一个错误; 从主要功能。

# 构建嵌套模块
嵌套模块是我们希望模块内部具有模块，执行不同任务的地方。 您将学习如何声明和访问嵌套模块的项目。

嵌套模块是将应用程序中的类似项或功能单元放在一起的好方法，这有助于维护功能和调试崩溃。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...
1.在项目工作区中创建名为sample_nested.rs的文件
2.编写代码头信息，它将提供代码的概述：

```
//-- #########################
//-- Task: To create a sample nested_mod module
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 4 March 17
//-- #########################
```

3.使用mod关键字创建名为sample_mod的模块：

```
// Defined module named `sample_mod`
mod sample_mod {
```

4.在sample_mod模块下创建另一个名为nested_mod的模块，其中包含函数和公共可见性，这使得sample_mod成为嵌套模块：

```
// Defined public Nested module named `nested_mod`
pub mod nested_mod {
pub fn function() {
println!("called `sample_mod::nested_mod::function()`");
}
```

5.在nested_mod模块下创建一个名为private_function的函数：

```
#[allow(dead_code)]
fn private_function() {
println!("called
`sample_mod::nested_mod::private_function()`");
} }
```

6.使用sample_mod中名为function的公共函数定义另一个名为private_nested_mod的模块：

```
// Nested modules follow the same rules for visibility
mod private_nested_mod {
#[allow(dead_code)]
pub fn function() {
println!("called
`sample_mod::private_nested_mod::function()`");
}
} }
```

7.定义main函数并使用其中声明的不同项调用嵌套模块：

```
// Execution starts

fn main() {
sample_mod::nested_mod::function();
// Private items of a module cannot be directly accessed,even
if nested_mod in a public module
// Error! `private_function` is private
//sample_mod::nested_mod::private_function(); // TODO ^ Try
uncommenting this line
// Error! `private_nested_mod` is a private module
//sample_mod::private_nested_mod::function(); // TODO ^ Try
uncommenting this line
}
```

正确设置上述代码后，在编译和运行程序时应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180925211343424?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 怎么运行的...

嵌套模块是一个在另一个模块中有一个模块的概念。 此功能有助于将一组应用程序单元放置在公共标头内。

在这个配方中，我们使用mod关键字创建了一个名为sample_mod的模块; 在这个模块中，我们创建了另外两个模块，即nested_mod和private_nested_mod，具有不同的可见性。 模块可见性的规则遵循与模块项相同的规则：我们必须明确提及pub关键字以提及模块的可见性。 如果我们不提及任何内容，Rust编译器将认为它是私有的。

然后，我们在嵌套模块中创建项目，这些模块位于sample_mod模块下。 在nested_mod（一个公共嵌套模块）中，我们创建了两个项：名为function的公共方法和名为private_function的私有方法。 在另一个私有嵌套模块private_nested_mod中，我们创建了一个名为function的公共方法。


在main函数中，我们调用遵循标准语法的相应项来访问项。 这里唯一的区别是项目驻留在不同的嵌套模块中。 在这种情况下，我们遵循module_name :: nested_module_name：item name语法。 在这里，我们首先调用模块名称，然后是嵌套模块名称及其项目。

我们将公共嵌套模块称为公共项，即sample_mod :: nested_mod :: function（）。 它将运行正常并执行项目的内容。 在调用私有嵌套模块（在我们的配方中是sample_mod :: nested_mod :: private_function），以及公共嵌套模块的类似私有项（在我们的配方中是sample_mod :: private_nested_mod :: function）时，我们将得到一个错误 提到这些项目是私有的，因为私人可见的单位不能在范围之外直接访问。

我们在private_nested_mod模块中有item函数的＃[allow（dead_code）]属性。 这个想法是禁用编译器的dead_code lint，它将警告未使用的函数。 简单来说，lint是标记代码中的错误的软件。

对于驻留在不同模块中的项目/单元，我们可以使用相同的名称。 在前面的配方中，我们有一个名为function的项，它存在于两个嵌套模块中。


# 使用struct创建模块

此配方涵盖了对其字段具有额外可见性的结构。 可见性默认为private，可以使用pub修饰符覆盖。 这种可见性仅在从模块外部访问结构时才有意义，在结构中定义结构并且目标是隐藏信息（封装）。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

1.在项目工作区中创建名为sample_struct.rs的文件

2.使用代码的详细信息编写代码头：

```
//-- #########################
//-- Task: To create a sample nested_mod module
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 4 March 17
//-- #########################
```

3.创建一个名为sample_struct的示例模块，您可以在其中声明一个名为WhiteBox的公共结构：

```
// Sample module which has struct item
mod sample_struct {
// A public struct with a public field of generic type `T`
pub struct WhiteBox<T> {
pub information: T,
}
```

4.使用私有泛型类型T声明名为BlackBox的公共结构：

```
// A public struct with a private field of generic type `T`
#[allow(dead_code)]
pub struct BlackBox<T> {
information: T,
}
```

5.使用impl关键字创建一个名为const_new的公共构造函数，该关键字将泛型T类型作为输入：

```
impl<T> BlackBox<T> {
// A public constructor method
pub fn const_new(information: T) -> BlackBox<T> {
BlackBox {
information: information,
}
}
} }
```

6.通过调用thesample_struct模块的结构项来声明main函数，该模块是whitebox结构项：

```
// Execution starts here
fn main() {
// Public structs with public fields can be constructed as
usual
let white_box = sample_struct::WhiteBox { information:
"public
information n" };

// and their fields can be normally accessed.
println!("The white box contains: {} \n",
white_box.information);
// Public structs with private fields cannot be constructed
using field names.
// Error! `BlackBox` has private fields
//let black_box = sample_struct::BlackBox { information:
"classified information" };
// TODO ^ Try uncommenting this line
// However, structs with private fields can be created using
// public constructors
let _black_box = sample_struct::BlackBox::const_new("classified
information \n");
// and the private fields of a public struct cannot be
accessed.
// Error! The `information` field is private
//println!("The black box contains: {}",
_black_box.information);
// TODO ^ Try uncommenting this line
}
```

正确设置上述代码后，在编译和运行程序时应该得到以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180925212220165?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 怎么运行的...

到目前为止，在前面的配方中，我们只研究具有充当其项目功能的模块。 在这个配方中，我们将创建对其字段具有额外可见性的结构项。

默认情况下，可见性是私有的，可以使用pub关键字进行更改。 当我们尝试访问模块范围之外的模块时，可见性允许我们隐藏信息。

我们使用mod关键字创建了一个名为sample_struct的模块。 我们使用pub和struct关键字创建了两个具有公共可见性的结构，名为WhiteBox和BlackBox。 在这两个结构项中，我们都有一个通用类型T.

>在Rust中，泛型意味着特定单元可以接受一个或多个泛型类型参数<T>。 例如，考虑fn foo <T>（T）{...}。 这里，T是使用<T>指定为泛型类型参数的参数，它允许它接受任何类型的任何参数。


在这两个结构中，我们有一个名为information的字段，它与T绑定，这是我们收到的参数。 唯一的区别是我们提到WhiteBox中的信息在结构中是公共的，而BlackBox中的信息默认为私有。

接下来，我们为BlackBox创建了一个实现块，我们在impl块中明确指定了泛型类型T. 在其中，我们创建了一个名为const_new的方法，我们公开显示它，它接受泛型类型T作为参数并返回一个BlackBox结构。 const_new充当BlackBox的公共构造函数，我们想在其中创建数据类型。


在主块中，我们首先创建了WhiteBox结构，并通过sample_struct :: WhiteBox {information：“public information \ n”}将其分配给名为white_box的变量。 在这里，我们调用模块，创建一个复杂的数据结构并打印white_box，信息字段，这是在前面的步骤中提供的。 接下来，我们尝试以类似的方式创建一个具有BlackBox数据结构的变量。 这导致错误说字段名称是私有的。 这就是为什么我们创建了一个公共方法const_new，它是BlackBox数据类型的构造函数。 我们通过sample_struct :: BlackBox :: const_new（“分类信息\ n”）执行此步骤并将其分配给_black_box。

这将参数从main传递到impl块并创建了结构。 通过这种方式，我们能够使用私有字段定义公共结构，但我们仍然无法通过_black_box.information公开访问信息字段，因为它最初是一个私有字段。

可以通过模块中的间接方法访问私有成员。 请考虑以下代码段：

```
pub mod root {
use self::foo::create_foo;
mod foo {
pub struct Foo {
i: i32,
} i
mpl Foo{
pub fn hello_foo(&self){
println!("Hello foo");
}
} p
ub fn create_foo(i: i32) -> Foo{
Foo { i: i }
}
} p
ub mod bar {
pub struct Bar {
pub f: ::root::foo::Foo,
} i
mpl Bar {
pub fn new(i: i32) -> Self {
Bar { f: ::root::foo::create_foo(i) }
}
}
}
} f
n main() {
//still private
//let f = root::foo::create_foo(42);
let b = root::bar::Bar::new(42);
b.f.hello_foo();
}
```

我们在foo模块中公开了一个公共构造函数create_foo，但模块foo仍然是私有的，我们只用use关键字在root中公开create_foo，这意味着bar现在可以创建一个Foo结构但是create_foo在root之外仍然是私有的。

# 控制模块
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

## 怎么运行的...
