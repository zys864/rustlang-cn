在本章中，我们将介绍以下配方：

 - 在Rust中构建宏
 - 在宏中实现匹配
 - 玩常见的Rust宏
 - 实施指定人
 - 重载宏
 - 实施重复
 - 实施DRY


# 介绍

到目前为止，我们已经看到Rust中的许多语句以感叹号（！）结尾，例如println！，try！等等。 这些命令执行了强大的操作来执行特定任务。 Rust提供了一个强大的宏系统，允许元编程。 宏看起来像函数，但它们的名字以感叹号结尾（！）。 宏被扩展为源代码，并被编译到程序中。 在本文中，我们将研究宏的各个方面，从定义您自己的特定于应用程序的宏到测试它们。

# 在Rust中构建宏
在本文中，我们将学习macro_rules！ - 这将有助于我们定义自定义应用程序特定宏的语法，该宏可以根据应用程序术语具有唯一名称。

## 做好准备
我们将要求Rust编译器和任何文本编辑器来开发Rust代码片段。

## 怎么做...

按照给定的步骤实现此配方：
1.创建名为sample_macro.rs的文件，并在文本编辑器中将其打开。
2.使用相关信息编写代码头：

```
//-- #########################
//-- Task: Building your first macro in Rust
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 26 March 17
//-- #########################
```

3.创建一个名为Welcome_RustBook的宏：

```
// This is a simple macro named `say_hello`.
macro_rules! Welcome_RustBook {
() => (
// The macro will expand into the contents of this block.
println!("Welcome to Rust Cookbook!");
)
}
```

4.定义main函数并调用Welcome_RustBook宏：

```
fn main() {
// This call will expand into`println!("Hello");`
Welcome_RustBook!()
}
```

我们将在成功执行代码时获得以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180925234640574?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)





## 怎么运行的...
我们使用macro_rules！ 用于创建自定义宏的宏; 在这里，我们制作了一个名为Welcome_RustBook的宏！ macro_rules的一般语法！ 如下：

```
macro_rules! macro_name { ... }


```

在macro_rules里面！ 宏，我们匹配参数。 在这个配方的情况下，我们不接受用户的任何参数，所以我们匹配（）=>（一组特定的动作项）。 代码中的空括号（）表示宏不带参数。 宏将在编译时扩展为无参数块的内容，其中我们有println！（“欢迎来到Rust Cookbook！”）;它基本上打印了一个默认语句。

在main函数中，我们调用Welcome_RustBook！ 函数定义中的宏，就像我们调用任何其他宏一样。 我们将在终端中看到打印的默认语句。


# 在宏中实现匹配

让我们继续，通过在宏中添加更多规则使我们的宏更复杂，规则基本上是模式匹配情况。 在这个配方中，关键是要学习如何在宏规则中定义模式匹配案例。

## 做好准备
我们将要求Rust编译器和任何文本编辑器来开发Rust代码片段。

## 怎么做...

按照上述步骤实现此配方：
1.创建名为sample_match.rs的文件，并在文本编辑器中将其打开。
2.使用相关信息编写代码头：

```
//-- #########################
//-- Task: Implement matching
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 26 March 17
//-- #########################
```

3.创建一个名为Check_Val的宏：

```
macro_rules! Check_Val {
(x => $e:expr) => (println!("mode X: {}", $e));
(y => $e:expr) => (println!("mode Y: {}", $e));
}
```

4.定义main函数并调用Check_Val宏：

```
fn main() {
Check_Val!(y => 3);
}
```

我们将在成功执行代码时获得以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180925234912394?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 怎么运行的...
在这个配方中，我们创建了一个名为Check_Val！的宏，它基本上扮演匹配表达臂的角色，但是在编译时通过Rust语法树进行匹配。 模式的通用语法如下：

```
( $( $x:expr ),* ) => { ... };
```

这里，术语模式指的是=>的左侧，在Rust中称为匹配器。

$ x：expr匹配器将匹配任何Rust表达式并将其绑定到语法树到元变量$ x，匹配器中出现的任何Rust标记必须完全匹配。

我们在这里有两个模式匹配案例：x => $ e：expr和y => $ e：expr。 元变量是$ e，它用于宏定义中，用于在宏规则的成功模式匹配之后进行的操作。 当我们调用Check_Val！（y => 3）; 在主函数中，输出为模式Y：3。 这里传递第二种情况，$ e的值与传递给Check_Val的参数的值相同！ 主要功能中的宏。

>如果我们调用Check-Val！（z => 3）; 我们会得到错误：没有规则期望令牌`z`，因为我们没有为令牌z定义规则并用$（...）包围匹配器，*将匹配零个或多个表达式，用逗号分隔。


# 玩常见的Rust宏
在本书中，我们已经定义并使用了常用的Rust宏来帮助我们执行基本操作，例如打印等。 Rust默认提供这些宏，因为这些宏很难由用户实现。 在这个配方中，我们将学习一些常见的Rust宏。


我们将要求Rust编译器和任何文本编辑器来开发Rust代码片段。

## 怎么做...

按照给定的步骤实现此配方：
1.创建名为sample_common_macros.rs的文件，并在文本编辑器中将其打开。
2.使用相关信息编写代码头：

```
//-- #########################
//-- Task: Implementing common macros in rust
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 26 March 17
//-- #########################
```

3.创建我们实现一些内置标准Rust宏的main函数：

```
fn main() {
// Creating a vector
let v = vec![1, 2, 3, 4, 5];
print!("Vector :- {:?}", v);
// Macros used for testing
assert!(true);
assert_eq!(5, 3 + 2);
// assert!(5 < 3);
// assert_eq!(5, 3);
// Gives a message to panic
// panic!("oh no!");
}
```

我们将在成功执行代码时获得以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180925235836224?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 怎么运行的...

我们在main函数中声明了所有标准宏。 让我们按照以下顺序深入研究它们中的每一个：

我们用过vec！ 宏在Rust中创建一个向量。 它创建了Vec <T>。

接下来的两个宏在测试中被广泛使用：第一个是assert !,它接受一个布尔值传递，第二个是assert_eq！，它接受两个值并检查它们的相等性。 真正的价值通过，虚假的价值导致恐慌！ 宏，导致线程恐慌或中断。

在这个食谱中，我们使用了Vec！ 用于创建向量的宏，v。断言内的条件！ 和assert_eq！ 宏传递。 故障情况已被注释掉，因为它们会在运行时引起恐慌。

# 实施指定人

Rust提供了一个指示符列表，它们可以帮助我们创建单元，例如函数，并在宏中执行表达式。





## 做好准备
我们将要求Rust编译器和任何文本编辑器来开发Rust代码片段。

## 怎么做...

按照上述步骤实现此配方：
1.创建一个名为sample_designator.rs的文件，并在文本编辑器中打开它。
2.使用相关信息编写代码头：

```
//-- #########################
//-- Task: Implementing designator
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 26 March 17
//-- #########################
```

3.创建一个名为create_function的宏，它接受一个指示符作为参数：

```
macro_rules! create_function {
($func_name:ident) => (
fn $func_name() {
// The `stringify!` macro converts an `ident`
into a string.
println!("You called {:?}()",
stringify!($func_name))
}
)
}
```

4.调用create_function宏来创建两个函数foo和bar：

```
create_function!(foo);
create_function!(bar);
te a macro named
```

5.创建一个名为print_result的宏：

```
macro_rules! print_result {
($expression:expr) => (
println!("{:?} = {:?}",
stringify!($expression),
$expression)
)
}
```

6.定义main函数，我们在其中使用我们创建的宏：

```
fn main() {
foo();
bar();
print_result!(1u32 + 1);
// Recall that blocks are expressions too!
print_result!({
let x = 1u32;
x * x + 2 * x - 1
});
}
```

我们将在成功执行代码时获得以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/2018092600025764?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 怎么运行的...

通常，宏的参数以美元符号（$）和带有指示符的注释类型为前缀。 在这个配方中，我们使用了两个常用的指示符，它们是用于表达式的expr，以及用于变量/函数名称的ident。

让我们理解为了在Rust代码中实现指定符而创建的两个主要宏：

 - create_function：此宏接受ident指示符的参数，并创建一个名为$ func_name的函数，该函数在代码中用于创建函数。如前所述，ident指示符用于变量/函数名称。 在（$ func_name：ident）模式块中，我们定义了函数fn $
   func_name，我们有了stringify！ body中的宏，它将$ func_name转换为字符串。
 - print_result：此宏接受expr类型的表达式，并将其作为字符串及其结果打印出来。 expr指示符用于表达式。
   在表达式模式的块中，我们使用stringify！ 宏，它将表达式转换为字符串并执行它。
   
我们使用create_function（foo）创建名为foo和bar的函数和前面的宏; 和create_function！（bar）;. 在main函数中，我们调用了两个函数，即foo和bar，它们返回字符串。 我们称之为function_name。 接下来，我们使用表达式块作为参数调用print_result !,我们在其中创建一个变量x，并为其赋值1u32，这是一个32位无符号整数类型。 然后我们运行x * x + 2 * x - 1，它给出了2的输出。

# 重载宏
在Rust中重载宏是提供类似参数的多个组合的过程，我们期望宏处理它们并根据传递的组合提供自定义结果。
## 做好准备
我们将要求Rust编译器和任何文本编辑器来开发Rust代码片段。

## 怎么做...

按照给定的步骤实现此配方：
1.创建名为sample_overloading_macros.rs的文件，并在文本编辑器中将其打开。
2.使用相关信息编写代码头：

```
//-- #########################
//-- Task: Implementing
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 26 March 17
//-- #########################
```

3.创建一个名为test的宏，我们将为其实现重载：

```
macro_rules! test {
($left:expr; and $right:expr) => (
println!("{:?} and {:?} is {:?}",
stringify!($left),
stringify!($right),
$left && $right)
);
($left:expr; or $right:expr) => (
println!("{:?} or {:?} is {:?}",
stringify!($left),
stringify!($right),
$left || $right)
);
}
```

4.定义我们将实现宏功能的主要功能：

```
fn main() {
test!(1i32 + 1 == 2i32; and 2i32 * 2 == 4i32);
test!(true; or false);
}
```

我们将在成功执行代码时获得以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180926002232809?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)


## 怎么运行的...

在这个配方中，我们创建一个名为test的宏，它使用两个expr指示符，用于将表达式作为参数并将其分配给两个变量$ left和$ right，其中$ left分配给第一个表达式，$ right分配给 第二个表达。

在宏内部，我们有两个规则，如下所示：

 - （$ left：expr;和$ right：expr）：在这个规则中，我们想要返回一个布尔值。 在这里，我们评估两个表达式并将值传递给&&运算符。
 - （$ left：expr;或$ right：expr）：在这个规则中，我们想要返回一个布尔值。在这里，我们评估两个表达式并将值传递给||运算符。

>参数不需要用逗号分隔，每个手臂必须以分号结尾。
>
在主要功能中，我们称之为测试！ 宏两次使用不同的参数，我们有组合。 测试！（1i32 + 1 == 2i32;和2i32 * 2 == 4i32）; 组合返回表达式的字符串形式以及结果，这是真的; test！（true;或false）; 类似地返回true。


# 实施重复
重复是特定宏接受至少重复一次的参数的能力。 在本文中，您将学习在Rust中实现重复的语法。
## 做好准备
我们将要求Rust编译器和任何文本编辑器来开发Rust代码片段。

## 怎么做...

## 怎么运行的...

## 做好准备
我们将要求Rust编译器和任何文本编辑器来开发Rust代码片段。

## 怎么做...
怎么做...
按照给定的步骤实现此配方：
1.创建名为sample_repeat.rs的文件，并在文本编辑器中将其打开。
2.使用相关信息编写代码头：

```
//-- #########################
//-- Task: Implementing repeat
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 26 March 17
//-- #########################
```

3.创建一个名为find_min的宏，我们在其中实现repeat：

```
macro_rules! find_min {
// Base case:
($x:expr) => ($x);
// `$x` followed by at least one `$y,`
($x:expr, $($y:expr),+) => (
// Call `find_min!` on the tail `$y`
std::cmp::min($x, find_min!($($y),+))
)
}
```

4.创建一个main函数，我们将多个参数传递给find_min：

```
fn main() {
println!("{}", find_min!(1u32));
println!("{}", find_min!(1u32 + 2 , 2u32));
println!("{}", find_min!(5u32, 2u32 * 3, 4u32));
}
```

我们将在成功执行代码时获得以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180926003957280?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 怎么运行的...

宏可以在参数列表中使用+来指示参数可以重复至少一次或*以指示参数可以重复零次或多次。 在配方中，我们有一个名为find_min的宏，它有两个规则，其中带有$（...），+的匹配器将匹配一个或多个表达式，用逗号分隔。 在第一种情况下，我们有（$ x：expr），它只执行表达式并返回输出; 如果我们只将一个表达式传递给find_min宏，那么这将匹配。 在第二种情况下，我们有（$ x：expr，$（$ y：expr），+）。 在这里，$ x后跟至少一个$ y，在块中，我们调用find_min！ 尾部的宏观$ y; 这些值被送到std :: cmp :: min，它返回参数列表中的最小值。 在第二次调用时，它将执行宏的第一种情况并返回表达式。

 - 在main函数中，我们运行以下情况并打印结果：
 - find_min！（1u32）：这将执行第一个案例并返回1
 - find_min！（1u32 + 2,2u32）：这将转到第二种情况，其中将再次为第二个表达式调用宏，并返回这两个表达式的最小结果，即2
 - find_min！（5u32,2u32 *3,4u32）：这与第二种情况类似，但这里宏将被调用两次，并且将返回所有表达式的最小结果，在这种情况下为4
# 实施DRY

使用Do not Repeat Yourself（DRY），在本文中，我们将为Rust中的一些基本标准算术运算创建一个测试用例。 但问题是，我们将使用宏及其功能来自动化它们，以便我们可以减少冗余代码。


## 做好准备
我们将要求Rust编译器和任何文本编辑器来开发Rust代码片段。


## 怎么做...
按照给定的步骤实现此配方：
1.创建名为sample_dry.rs的文件，并在文本编辑器中将其打开。
2.使用相关信息编写代码头：

```
//-- #########################
//-- Task: Implementing
//-- Author: Vigneshwer.D
//-- Version: 1.0.0
//-- Date: 26 March 17
//-- #########################
```

3.调用标准操作箱：

```
use std::ops::{Add, Mul, Sub};
```

4.创建一个名为assert_equal_len的宏：

```
macro_rules! assert_equal_len {
($a:ident, $b: ident, $func:ident, $op:tt) => (
assert!($a.len() == $b.len(),
"{:?}: dimension mismatch: {:?} {:?} {:?}",
stringify!($func),
($a.len(),),
stringify!($op),
($b.len(),));
)
}
```

5.创建一个名为op的宏：

```
macro_rules! op {
($func:ident, $bound:ident, $op:tt, $method:ident) => (
fn $func<T: $bound<T, Output=T> + Copy>(xs: &mut Vec<T>, ys:
&Vec<T>) {
assert_equal_len!(xs, ys, $func, $op);
for (x, y) in xs.iter_mut().zip(ys.iter()) {
*x = $bound::$method(*x, *y);
// *x = x.$method(*y);
}
} )
}
```

6.实现add_assign，mul_assign和sub_assign函数：

```
op!(add_assign, Add, +=, add);
op!(mul_assign, Mul, *=, mul);
op!(sub_assign, Sub, -=, sub);
```

7.创建一个名为test的模块：mod test {：

```
use std::iter;
macro_rules! test {
($func: ident, $x:expr, $y:expr, $z:expr) => {
#[test]
fn $func() {
for size in 0usize..10 {
let mut x: Vec<_> =
iter::repeat($x).take(size).collect();
let y: Vec<_> = iter::repeat($y).take(size).collect();
let z: Vec<_> = iter::repeat($z).take(size).collect();
super::$func(&mut x, &y);
assert_eq!(x, z);
}
}
}
} /
/ Test `add_assign`, `mul_assign` and `sub_assign`
test!(add_assign, 1u32, 2u32, 3u32);
test!(mul_assign, 2u32, 3u32, 6u32);
test!(sub_assign, 3u32, 2u32, 1u32);
}
```

我们将在成功执行代码时获得以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180926205310951?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)


怎么运行的...

宏允许开发人员通过分解函数和/或测试套件的公共部分来编写DRY代码。 在这个配方中，我们在Vec <T>上实现了对+ =，* =和 - =运算符的测试。 我们在这个配方中使用了一个新的指示符，tt; 它代表标记树，用于运算符和标记。

让我们先了解代码中的所有功能宏单元：

 - assert_equal_len：这个宏接受四个参数作为输入，即ident类型的$ a，$ b和$ func，以及tt类型的$ op。
   如果宏接收到这些参数，那么它将使用assert中的len（）方法检查$ a和$ b是否具有相同的长度！ 宏，在成功的情况下将返回布尔值true，否则，它会打印一个说明维度不匹配的失败语句。

 - op：这个宏接受四个参数作为输入，它们是ident类型的$ func，$ bound和$ method，以及tt类型的$ op。 我们用这个宏创建相应的运算符函数，其中$ func是函数的名称，是列表中的第一个参数，有两个Vec <T>类型的参数：xs和ys。 这两个变量都与宏共享，并且xs在共享时提供了可变权限。 在函数内部，我们使用$ bound :: $方法对向量xs和ys的所有值执行操作，结果存储在x中，因为它具有可变访问权限。 这里，$ bound是标准模块，其$ method对应于它的单位。 有了这个宏，我们就能够对传递的数据执行很多方法，从而减少了代码。
 - test：这个宏接受四个参数作为输入，它们是ident类型的$ func，以及$ x，$ y和$ z，它们是ident类型的expr，并且存在于测试模块中，这是 在我们运行测试用例时调用。 在测试宏中，我们创建名为$ func的函数。 通过这样做，它将成为父测试模块的功能或单元。 我们迭代这些值来创建向量，我们在其中执行super :: $ func（＆mut x，＆y）。 super在这里指的是我们使用op宏创建的函数，它根据我们想要执行的操作更新x的值。 在最后一步中，我们通过将更新的x向量与z向量进行比较来验证测试，z向量是期望的值。 assert_eq！ 如果值匹配，宏将返回true; 否则它会惊慌失措。

在这段代码中，我们使用了一组标准库，它们是操作和项目。 首先，我们创建了我们想要实现的不同操作，因此我们称之为操作！ 并创建add_assign，mul_assign和sub_assign。 稍后在测试模块中，我们将测试用于我们创建的不同功能。 在这里，我们给出了传递的所有情况，并在编译期间运行--test选项来运行测试用例。
