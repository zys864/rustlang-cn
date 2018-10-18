在本章中，我们将介绍以下内容：

 - 定义表达式
 - 定义常量
 - 执行变量绑定
 - 在Rust中执行类型转换
 - 与Rust的决策
 - 在Rust中循环操作
 - 定义枚举类型
 - 定义闭包
 - 在Rust中执行指针操作
 - 定义第一个用户定义的数据类型向用户定义的数据类型添加功能
 - 不同数据类型的类似功能


# 介绍

本章的重点是为您提供实现表达式的所有配方，这些表达式将代表代码的状态，使用决策语句（如if ... else）构建逻辑，声明自定义复杂数据类型以表示真实场景 使用struct，使用traits向复杂数据类型添加功能，并使用循环语句控制代码执行。

# 定义表达式

简单来说，表达式是Rust中的一个语句，通过它我们可以在程序和应用程序中创建逻辑和工作流。 我们将深入了解Rust中的表达式和块。

## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

按照以下步骤操作：
1.使用下一个代码片段创建名为expression.rs的文件。
2.声明main函数并创建变量x_val，y_val和z_val：

```
// main point of execution
fn main() {
// expression
let x_val = 5u32;
// y block
let y_val = {
let x_squared = x_val * x_val;
let x_cube = x_squared * x_val;
// This expression will be assigned to `y_val`
x_cube + x_squared + x_val
};
// z block
let z_val = {
// The semicolon suppresses this expression and `()` is
assigned to `z`
2 * x_val;
};
// printing the final outcomes
println!("x is {:?}", x_val);
println!("y is {:?}", y_val);
println!("z is {:?}", z_val);
}
```
运行代码时应该得到随后的输出。 请参考以下屏幕截图：
![在这里插入图片描述](https://img-blog.csdn.net/2018092408021269?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

所有以分号（;）结尾的语句都是表达式。 块是在{}范围内具有一组语句和变量的语句。 块的最后一个语句是将分配给变量的值。 当我们用分号关闭最后一个语句时，它会返回（）给变量。

在前面的配方中，第一个名为x_val的变量语句被赋值为5.其次，y_val是对变量x_val执行某些操作的块，还有一些变量，x_squared和x_cube包含 变量x_val的平方值和立方值。 变量x_squared和x_cube将在块的范围之后很快删除。

我们声明z_val变量的块在最后一个语句处有一个分号，用于将它赋值给（），从而抑制表达式。 我们最后打印出所有的值。

我们最后打印所有声明的变量值。

# 定义常量
Rust提供了在Rust中的代码中分配和维护常量值的功能。 当我们想要维护全局计数时，这些值非常有用，例如计时器阈值。 Rust提供了两个const关键字来执行此活动。 您将学习如何在此配方中全局提供常量值。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

按着这些次序：
1.使用下一个代码片段创建一个名为constant.rs的文件。
2.使用常量声明全局UPPERLIMIT：

```
// Global variables are declared outside scopes of other
function
const UPPERLIMIT: i32 = 12;
```

3.通过接受一个整数作为输入来创建is_big函数：

```
// function to check if bunber
fn is_big(n: i32) -> bool {
// Access constant in some function
n > UPPERLIMIT
}
```

4.在main函数中，调用is_big函数并执行决策声明：

```
fn main() {
let random_number = 15;
// Access constant in the main thread
println!("The threshold is {}", UPPERLIMIT);
println!("{} is {}", random_number, if
is_big(random_number) { "big" } else { "small"
});
// Error! Cannot modify a `const`.
// UPPERLIMIT = 5;
}
```

运行上述代码后，您应该获得以下屏幕截图作为输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924080858637?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

配方的工作流程非常简单，我们有一个功能来检查整数是否大于固定阈值。 UPPERLIMIT变量定义函数的固定阈值，该函数是一个常量，其值在代码中不会改变，并且可以在整个程序中访问。

我们将15分配给random_number并通过is_big传递它（整数值）; 然后我们得到一个布尔输出，无论是真还是假，因为函数的返回类型是bool类型。 我们的情况的答案是错误的，因为15不大于12，UPPERLIMIT值设置为常数。 我们使用Rust中的if ... else语句执行了这个条件检查。

我们无法改变UPPERLIMIT值; 尝试时，它将抛出一个错误，在代码部分注释。

>常量声明常量值。 它们代表一个值，而不是内存地址：type = value;


# 执行变量绑定
变量绑定是指Rust代码中的变量如何绑定到类型。 我们将在此配方中介绍模式，可变性，范围和阴影概念。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

执行以下步骤：
1.创建一个名为binding.rs的文件，并输入一个代码片段，其中包括声明主函数和不同的变量：

```
fn main() {
// Simplest variable binding
let a = 5;
// pattern
let (b, c) = (1, 2);
// type annotation
let x_val: i32 = 5;
// shadow example
let y_val: i32 = 8;
{
println!("Value assigned when entering the
scope : {}", y_val); // Prints "8".
let y_val = 12;
println!("Value modified within scope :{}", y_val);
// Prints "12".
}p
rintln!("Value which was assigned first : {}", y_val);
// Prints "8".
let y_val = 42;
println!("New value assigned : {}", y_val);
//Prints "42".
}
```

运行上述代码后，您应该获得以下屏幕截图作为输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924081416921?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
# 怎么运行的...

let语句是创建绑定的最简单方法，我们将变量绑定到一个值，即变量a的情况。 要使用let语句创建模式，我们将模式值分配给相同模式中的b和c值。 Rust是一种静态类型语言。 这意味着我们必须在赋值期间指定我们的类型，并且在编译时，检查它是否兼容。 Rust还具有类型引用功能，可在编译时自动标识变量类型。 variable_name：type是我们用于在Rust中明确提及类型的格式。 我们按以下格式阅读作业：

```
x_val is a binding with the type i32 and the value 5.
```
这里，我们将x_val声明为32位有符号整数。 但是，Rust有许多不同的原始整数类型，以i开头表示有符号整数，u表示无符号整数，可能的整数大小为8,16,32和64位。

变量绑定的范围使变量仅在范围内保持活动状态。 一旦它超出范围，资源就会被释放。

块是由{}括起来的语句集合。 函数定义也是块！ 我们使用一个块来说明Rust中的特性，它允许变量绑定被遮蔽。 这意味着以后的变量绑定可以使用相同的名称完成，在我们的例子中是y_val。 这会经历一系列值更改，因为当前在范围内的新绑定会覆盖先前的绑定。 阴影使我们能够将名称重新绑定到不同类型的值。 这就是为什么我们能够将新值分配给块内外的不可变y_val变量的原因。
 
# 在Rust中执行类型转换
在本文中，您将学习如何在Rust中的不同数据类型之间进行转换。 Rust不提供自动类型转换。 开发人员必须手动拥有它。 使用我们将在Rust中执行安全类型转换。 
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...
执行以下步骤：
1.创建名为typecasting.rs的文件，并在脚本中输入以下代码：

```
use std::{i32,f32};
// Sample function for assigning values to
confusion matrix
fn main() {
// assigning random values to the confusion matrix
let(true_positive,true_negative,false_positive,
false_negative)=(100,50,10,5);
// define a total closure
let total = true_positive + true_negative +
false_positive + false_negative;
println!("The total predictions {}",total);
// Calculating the accuracy of the model
println!("Accuracy of the model
{:.2}",percentage(accuracy(true_positive,
true_negative,total)));
}
```

2.在前面的代码片段中，我们创建了四个变量：true_positive，true_negative，false_positive和false_negative。 这些基本上是混淆矩阵的四个测量参数。

3.调用返回最终精度百分比的准确度和百分比函数。

4.总变量是所有测量值的总和：

```
// Accuracy Measures the overall performance of
the model
fn accuracy(tp:i32,tn:i32,total:i32) -> f32 {
// if semi-colon is not put then that returns
// No automatic type cast in rust
(tp as f32 + tn as f32 )/(total as f32)
} /
/ Converting to percentage
fn percentage(value:f32) -> f32 {
value *100.0
}
```

5.精度函数接受所有返回浮点数据类型的int数据类型。
6.从精度函数接收的值传递给百分比函数并打印精度。

运行上述代码后，您应该获得以下屏幕截图作为输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924082019912?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

在这个配方中，我们有两个函数，准确性和百分比，它们从main函数接收参数并转换传递给所需类型的类型，因为我们在Rust中使用as关键字的算术运算的性质 在Rust中的类型转换。 在精度函数的情况下，它需要三个类型为i32的输入参数并返回单个f32类型值。

为了保护开发人员免受意外强制转换，Rust强制要求开发人员手动转换数据类型。 在下面的示例中，我们定义一个名为a的int变量，并为其赋值3; 在赋值操作之后，我们会看到代码的一部分被注释掉了。 这意味着它不会被Rust编译器编译。 如果我们仔细查看代码，我们发现我们将int变量与平值相乘，这将在编译期间给出类型不匹配错误：

```
let a = 3;
/*
let b = a * 0.2; //Won't compile
*/
```

正如我们所看到的，我们使用as关键字将int转换为float（64位），以便将int值乘以float变量。 这一步产生b没有任何错误：

```
let b = a as f64 * 0.2;
```
>请注意，当我们以相同类型的数据类型执行算术运算时，我们不必担心类型转换，因为生成的操作的结果是自动进行类型转换的。


# Rust的决策(条件)
在本文中，我们将了解Rust中的决策语句。 Rust中的条件检查与其他动态编程语言类似，并且非常易于使用。 使用if ... else语句，我们将在Rust中执行条件检查。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...
执行以下步骤：
1.创建名为condition.rs的文件，并在脚本中输入以下代码：

```
use std::{i32};
fn main() {
let age : i32= 10;
// If else statements
if age <= 18{
println!("Go to School");
} else if (age >18) && (age <= 28){
println!("Go to college");
} else {
println!("Do something with your life");
} /
/ if/ else statement in one line
let can_vote = if (age >= 18) {true} else
{false};
println!("Can vote {}",can_vote );
}
```

2.创建名为age的变量，并将其分配给值为10的整数。
3.前面的代码有一个if ... else语句来决定年龄值。 它根据条件执行打印操作。

运行上述代码后，您应该获得以下屏幕截图作为输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924082530933?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
# 怎么运行的...

在这个配方中，我们实现了一个if ... else语句来在Rust中执行条件语句。 条件在年龄变量中执行。 在这个配方中，我们分配了一个值为10的不可变变量; 在此之后，我们将其与各种规则进行比较，并根据合格规则执行操作。

这些规则是开发人员以数学运算的形式生成的条件，产生真或假的结果。 根据操作的输出，我们在决策语句的范围内选择一组特定的操作。

>if ... else语句是开发人员路由程序逻辑的一个很好的工具。 它们非常适合比较应用程序最终状态的阈值，以便做出合理的决策。

在前面的案例中，我们检查了以下流程中的三种情况：

 - if语句检查age变量是否小于18.如果操作返回true，那么我们继续打印Go to School。
 - 当第一个条件返回false时，在else ... if语句中检查下一个条件;
   在这里我们检查年龄是否在18到28之间，如果这个条件返回true，我们打印去大学。

最后，我们有else语句，它没有条件，只有在前面所有条件都失败时才执行。

以非常优化的方式编写通常是非常重要的技能。 我们应该学习开发编写更少和优化代码的技能的能力。

前面的一组语句包含很多代码行，但我们可以用优化的方式编写它，我们将if ... else语句与条件放在一行中。 这种情况的一般语法如下：

```
let variable = if (condition 1 ) {true} else {false};
```

如果条件1操作产生true，我们有一个变量给我们分配; 或者，我们从else语句中分配值。


# 在Rust中循环操作

在本文中，您将学习Rust中的循环语句。 我们在Rust中引用的循环语句提供了交互功能。 使用循环，while和关键字，我们可以在Rust中执行迭代操作。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

# 怎么运行的...

## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

执行以下步骤：
1.创建名为looping.rs的文件，并在脚本中输入以下代码。

2.在main函数中，对可变变量x执行循环操作，该变量最初被赋值为整数值1。

3.定义循环语句，这是一个无限的迭代语句，并检查其范围内的各种条件：

```
fn main() {
// mutuable variable whose value can be changed
let mut x =1;
println!(" Loop even numbers ");
// Continously loops
loop {
// Check if x is an even number or not
if (x % 2 == 0){
println!("{}",x);
x += 1;
// goes to the loop again
continue;
}/
/ exit if the number is greater than 10
if (x > 10) {
break;
}/
/ increment the number when not even
x+=1;
}
```

4.创建一个可变变量y并将其赋值给整数值1，并定义一个y <10条件的while循环：

```
let mut y = 1;
// while loop
println!("while 1 to 9 ");
while y < 10 {
println!("{}",y );
y +=1;
}
```

5.执行与while循环类似的操作。 在这里，使用for循环迭代可变变量z上的1到9范围，该变量最初被赋值为1：

```
let mut z = 1;
//for loop
println!(" For 1 to 9");
for z in 1 .. 10 {
println!("{}",z );
}
}
```

运行上述代码后，您应该获得以下屏幕截图作为输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924083438310?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

loop是Rust中的迭代关键字，其范围内的语句永远运行，即无限期，除非它们被break语句显式停止。 当我们希望进程在应用程序中执行特定任务直到达到特定状态以进行进一步处理时，这非常有用。 考虑一个视频存储应用程序，我想连续保存摄像机源，直到用户发出停止应用程序的命令。

在这个配方中，我们声明了一个可变的int变量x，我们用值1初始化它。当它进入循环语句时，我们有两个条件。 第一个条件打印x的值。 只有当它是偶数时，我们使用％运算符来执行此除数运算，然后增加值。

然后我们使用了continue关键字，它返回循环。 前面的关键字语句将不会被执行。 第二个条件检查x的值是否大于10.只有在运行时才会达到此条件。 在这种情况下，当x的值为奇数时，我们打破循环，这是无限循环的出口点，这类似于前面例子中讨论的视频应用程序中的停止按钮的情况。 接下来，我们增加下一次迭代的值。

在以两种不同的方式打印1到9时，第一种方法使用while，其中我们放置了一个条件，该条件首先与没有条件的循环进行比较。 一直以来，循环都会在每次迭代时检查条件。 只有它是真的，才会继续。 在前面的例子中，我们有一个不可变的变量y，它用值1初始化。我们有一个条件检查在每次迭代时y是否小于10。 在每次迭代中，我们打印y的值并将其值增加1。

执行上述活动的第二种方法是使用for循环语句，其中我们指定要在其中操作的值的范围。 我们没有任何明确的条件检查，就像其他循环语句一样。 我们声明了一个不可变变量z，它被初始化为值1，然后在循环中从1迭代到10，我们在每一步中打印值

当需要在应用程序中重复执行特定任务时，循环语句对开发人员来说非常方便。

# 定义枚举类型
在本文中，您将学习如何在Rust中使用枚举类型。 在Rust中，枚举类型允许开发人员以多种格式表示数据，并且每种格式都可以选择具有与之关联的特定数据。 使用enum关键字，我们在Rust中执行迭代操作。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

执行以下步骤：
1.创建名为enum.rs的文件，并在脚本中输入以下代码：

```
fn main() {
let hulk = Hero::Strong(100);
let fasty = Hero::Fast;
//converting from
let spiderman = Hero::Info
{name:"spiderman".to_owned(),secret:"peter
parker".to_owned()};
get_info(spiderman);
get_info(hulk);
get_info(fasty);
}
```

2.声明一个枚举date type，即Hero：

```
// declaring the enum
enum Hero {
Fast,
Strong(i32),
Info {name : String, secret : String}
}
```

3.创建一个名为get_info的函数，它将枚举数据类型作为参数：

```
// function to perform for each types
fn get_info(h:Hero){
match h {
Hero::Fast => println!("Fast"),
Hero::Strong(i) => println!("Lifts {} tons",i ),
Hero::Info {name,secret} => { println!(" name is: {0} secret is
: {1}", name,secret);} ,
}
}
```

运行上述代码后，您应该获得以下屏幕截图作为输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924091052971?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

枚举是一个非常重要的Rust类型，因为它允许特定数据类型与多个数据变体相关联。 枚举类型的值包含与其关联的数据变体的信息。

在转向代码说明之前，关于Rust中枚举的另一个要点是，您可以使用::语法来使用每个数据变量的名称并为变量赋值。

在配方中，我们创建了一个枚举类型Hero，它有三种类型的数据变体：Fast，没有明确的数据要求; 强（i32），需要32位整数输入; 和Info，它支持两个字符串数据变量，名称和密码。

接下来，让我们在main函数中查看这些数据变体的初始化。 在这里，我们创建了三个代表三种数据变量的变量，并使用所需的数据要求对其进行初始化。 我们还通过传递不同的枚举数据变量来调用get_info（）函数三次以打印数据值。
使用Hero :: Strong（100）enum类型初始化，使用Hero :: Fast快速进行初始化，使用Hero :: Info进行蜘蛛侠初始化，这需要两个变量：名称：“spiderman”.to_owned（）和秘密：“peter parker”.to_owned（）。

>请注意，在将值声明为Hero数据变量Info时，我们使用字符串和.to_owned（）方法分配数据变量，这样做是为了确保在借用时拥有字符串，因为＆str是对字符串的不可变引用， 使用to_owned（）将其转换为我们拥有的字符串。



get_info（argument：enum type）函数将enum作为数据类型，当我们传递每个不同的数据变量时，将为这些参数赋值。 然后我们使用match语句（这是一个决策语句）来比较参数和不同类型的数据变量，这些变量作为match语句中的不同情况提到。

我们传递了快速变量，它是Fast-variant of Hero的类型 - 它将打印Fast，这是match语句的第一种情况。 类似地，对于分别具有Info和Strong类型的spiderman case和hulk，将执行get_info函数匹配中的相应语句。

# 定义闭包
在一个超级级别，闭包类似于函数，调用闭包就像一个函数。 闭包类似于lambda，它们基本上是在闭合范围内对变量进行操作的函数。

## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

执行以下步骤：
1.创建名为closures.rs的文件，并在脚本中输入以下代码：

```
// define a closure
let sum_num = |x:i32 , y:i32| x+y;
println!("7 + 8 ={}", sum_num(7,8));
```

2.定义一个闭包并将其命名为sum_num：

```
// define a closure
let sum_num = |x:i32 , y:i32| x+y;
println!("7 + 8 ={}", sum_num(7,8));
```

3.创建另一个闭包，即add_ten：

```
// example 2
let num_ten = 10;
let add_ten = |x:i32| x+num_ten;
println!("3 + 10 ={}", add_ten(3));
}
```

运行上面的代码时，我们应该得到以下屏幕截图作为输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924093903459?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...
关闭闭包的一个重要问题是它的绑定或其操作是在定义它的范围内。 它类似于在其操作环境中使用自由变量的函数

>闭包是编写数学运算的好方法。 如果开发人员正在使用Rust来加速应用程序的数学计算，那么开发人员可以在他或她的代码中维护不同方程式的闭包，以便更好地进行优化，代码调试和基准测试。


在这个配方中，我们在main函数中创建了两个闭包。 创建简单闭包的基本方法是将一个变量分配给一个操作，然后我们可以在let语句中声明管道符号中的变量类型。 第一个闭包名为sum_num，它基本上添加两个数字并返回一个整数输出作为它使用的两个变量，即x和y，它们是32位整数。 第二个闭包add_ten将一个固定的整数值10添加到传递给闭包的整数。 调用闭包类似于函数的闭包。 惯例是调用闭包的名称，后跟要传递给闭包操作的参数。 在这个配方中，我们调用sum_num（7,8），它在运行时输出15，add_ten（3）产生13。

# 在Rust中执行指针操作

Rust提供了不同的智能指针。 这些是Rust在不同用例中使用的不同类型的指针，但是＆mut T是一个可变（独占）引用，它是其中一个操作。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

执行以下步骤：
1.创建名为pointer.rs的文件，并在脚本中输入以下代码：

```
use std::{i32};
fn main() {
```

2.创建一个名为vect1的向量并将其分配给vec！[1,2,3]：

```
let vect1 = vec![1,2,3];
// Error in case you are doing this in case of non primitive
value
// let vec2 = vec1
// println!("vec1[0] : {:?}", vec1[0]);
let prim_val = 1;
let prim_val2 = prim_val;
println!("primitive value :- {}", prim_val);
```

3.将＆vect1传递给sum_vects（）函数：

```
// passing the ownership to the function
println!("Sum of vects : {}", sum_vects(&vect1));
// Able to pass the non primitive data type
println!("vector 1 {:?}", vect1);
}
```

4.对向量的每个值执行求和运算：

```
// Added a reference in the argument
fn sum_vects (v1: &Vec<i32>) -> i32 {
// apply a closure and iterator
let sum = v1.iter().fold(0, |mut sum, &x | {sum += x; sum});
return sum;
}
```

运行上述代码后，您应该获得以下屏幕截图作为输出：
![在这里插入图片描述](https://img-blog.csdn.net/2018092409500511?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

所有权和借用是Rust构建的主要概念，Rust提供的标准API基于这一概念。 在前面的代码片段中，我们创建了一个向量，即vect1，并使用vec为其分配了1,2,3！ 关键词。

注意，向量是非原始值。 之后的矢量无法重复使用，如代码的注释部分所示。 编译器将抛出一个错误，指出vect1是一个移动的值，不能使用。 当我们将vect1分配给vect2并尝试将vect1分配给print语句时就是这种情况。

在sum_vects（＆vect1）函数中，我们将vect1的所有权传递给sum_vector函数，该函数遍历向量的每个对象并生成总和。 请注意，我们通过带有＆符号的vect1。 这样，我们将向量作为引用或指针共享，但如果我们将它作为＆mut vect1传递，则该函数将具有变异或对向量值进行更改的能力。 我们通过从sum_vects函数处理后来打印vect1来验证这一点，这仍然会产生相同的结果。

在sum_vects（＆vect1）中，我们有v1，这是vect1移动到的参数。 该向量具有标准API中的方法，该方法允许iter函数读取一个
数据对象从零位置开始。

>fold（）函数有两个参数：初始值和闭包。 闭包再次采用两个参数：累加器和元素。 闭包返回累加器在下一次迭代时应具有的值。


这里累加器是sum，元素是x，它在每次迭代中加到sum。 请注意，x在闭包定义中是可变的，可以更改其操作范围内的值。 它存储在sum变量中并返回到main函数。


# 定义您的第一个用户定义的数据类型

在本文中，您将了解结构，这是一种可以在Rust中创建复杂数据类型的方法。 使用struct，我们将在Rust中定义用户定义的数据类型。

## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。


## 怎么做...

执行以下步骤：
1.创建名为struct.rs的文件，并在脚本中输入以下代码：

```
use std::{f64};
fn main() {
// create a struct variable
let mut circle1 = Circle {
x:10.0,radius : 10.0
};
// print radius and variable x
println!("x:{},radius : {}", circle1.x,
circle1.radius );
println!("Radius : {}", get_radius(&circle1) );
}
```

2.创建一个名为Circle的结构，其中包含两个参数，即x和radius：

```
// define your custom user data type
struct Circle {
x : f64,
radius : f64,
}
```

3.通过接受Circle作为用户定义的数据类型来定义函数get_radius：

```
// get radius function
fn get_radius(c1 : &Circle) -> f64{
c1.radius
}
```

运行上述代码后，您应该获得以下屏幕截图作为输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924202345859?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

在产品开发生命周期的某个阶段，开发人员通常需要处理太多变量，而且代码变得非常复杂。 这是结构看起来像一个大救世主的地方。 结构使开发人员能够创建复杂的数据类型，允许在单个名称下统一多种数据类型。

在这个配方中，我们创建了一个名为Circle的自定义数据类型，它有两个标签radius和x，类型为f64，它是一个64位浮点类型。 这里的两个参数都与Circle数据类型相关，并且唯一地表达它们的特征。

>考虑用例，例如数据库管理，机器学习模型等，开发人员必须处理多个传达单个任务/实体属性的变量。 在这些情况下，结构是用于使代码更加优化和模块化的好工具。 这使得开发人员的生活变得轻松; 我们可以轻松地调试错误，并扩展应用程序/产品请求的功能。

我们使用struct关键字来创建用户定义的数据类型，其中自定义名称在关键字后面提供，但是与它使用的不同标签或变量的类型一起提供。

在main函数中，我们初始化了用户定义数据类型Circle的可变变量circle1，并使用其所需的值填充它，半径为10.0，x为10.0。 我们这样做是为了访问程序范围内的变量。 我们通过调用我们需要的变量名称标签来获取值，也就是说，我们通过调用circle1.x和circle.radius来获取赋值的值。

我们将circle1的引用传递给get_radius，其中我们有一个数据类型Circle的参数c1，我们从中得到c1.radius的半径。 然后，我们使用get_radius（＆circle1）调用该函数来获取值。


# 向用户定义的数据类型添加功能

您将学习使用Rust中的impl关键字执行方法调用，这有助于向用户定义的数据类型添加功能。 在这个配方中，impl块帮助我们创建方法。
## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

执行以下步骤：
1.创建名为implement.rs的文件，并在脚本中输入以下代码：

```
use std::{f64};
fn main() {
// create a struct variable
let mut circle1 = Circle {
x:10.0,radius : 10.0
};
println!("x:{},radius : {}", circle1.x,
circle1.radius );
println!("x : {}", circle1.get_x());
}
```

2.创建一个名为Circle的结构，其中包含两个参数x和radius：

```
// define your custom user data type
struct Circle {
x : f64,
radius : f64,
}
```

3.为用户定义的Circle数据类型创建get_x方法：

```
// recommended way of creating structs
impl Circle {
// pub makes this function public which makes it
accessible outsite the scope {}
pub fn get_x(&self) -> f64 {
self.x
}
}
```

运行上述代码后，您应该获得以下屏幕截图作为输出：
![在这里插入图片描述](https://img-blog.csdn.net/2018092420354725?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

在这个配方中，我们创建了一个名为Circle的自定义数据类型，它有两个标签：半径和类型为f64的x，它是64位浮点类型。 这里的两个参数都与Circle数据类型相关，并且唯一地表达其特征。

在main函数中，我们初始化了用户定义数据类型Circle的可变变量circle1，并使用其所需的值填充它，半径为10.0，x为10.0。 要访问程序范围内的变量，我们通过调用我们需要的变量名称标签来获取值，也就是说，我们通过调用circle1.x和circle.radius来获取赋值的值。

但是，我们继续为每种数据类型创建了独特的功能，以便它们可以在与它们相关的标签上执行独特的操作; 这消除了将参数值传递给外部创建的函数的需要。 我们使用impl来实现这个方法调用，我们在其中定义了数据类型的功能。

此功能允许开发人员使用datatype_name.function1（）。function2（）调用数据类型的函数，这样可以降低函数调用的复杂性并提供优化的代码。

在main函数中，我们调用circle1.get_x（）来获取x值的值。 如果你仔细观察Circle的impl代码部分，你会发现我们将＆self传递给get_x（）方法，这是对圆标签数据类型的引用。

# 不同数据类型的类似功能
您将了解此配方中Rust的特征功能与impl类似，它有助于开发人员对用户定义的数据类型进行方法调用。 但是，trait提供了许多功能，例如继承和控制，而不是用户定义的数据类型提供的功能。

## 做好准备
我们将要求Rust编译器和任何文本编辑器进行编码。

## 怎么做...

执行以下步骤：
1.创建名为trait.rs的文件，并在脚本中输入以下代码：

```
use std::{f64};
fn main() {
// variable of circle data type
let mut circle1 = Circle {
r : 10.0
};
println!("Area of circle {}", circle1.area() );
// variable of rectangle data type
let mut rect = Rectangle {
h:10.0,b : 10.0
};
println!("Area of rectangle {}", rect.area() );
}
```

2.创建一个名为Rectangle的结构，其参数为h和b，两者都是64位浮点数据类型：

```
// userdefined data type rectangle
struct Rectangle {
h: f64,
b: f64,
}
```

3.使用参数r创建名为Circle的结构，该结构是64位浮点数据类型：

```
// userdefined data type circle
struct Circle {
r: f64,
}
```

4.使用区域功能创建名为HasArea的特征：

```
// create a functionality for the data types
trait HasArea {
fn area(&self) -> f64;
}
```

5.为Circle用户定义的数据类型定义区域功能：

```
// implement area for circle
impl HasArea for Circle {
fn area(&self) -> f64 {
3.14 * (self.r *self.r)
}
}
```

6.为Rectangle用户定义的数据类型定义区域函数：

```
// implement area for rectangle
impl HasArea for Rectangle {
fn area(&self) -> f64 {
self.h *self.b
}
}
```

运行上述代码后，您应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924204528984?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

# 怎么运行的...

在这个配方中，我们应用了我们在之前学到的所有概念。 我们创建了两种结构类型：半径为f64的Circle和参数h和b为f64的Rectangle。 然后，我们为每个结构数据类型创建了区域功能，这些结构数据类型对标签的数据进行操作，因为它们由self引用。

用户定义的数据类型的函数定义在数学运算方面是不同的。 我们在main函数中定义了数据类型Circle和Rectangle。 我们通过Circle.area（）和Rectangle.area（）实时调用这些函数。


在这里，我们观察到两种数据类型都提供了类似的功能; 这就是特质到位的地方。 它基本上告诉编译器特定函数将使用的功能，因此我们实现了特征。 对于此配方中的数据类型，我们有一个名为HasArea的特征，它只包含范围内的函数的签名，该函数包含返回的输出和作为参数传递的引用。 在这个配方中，我们有一个fn area（＆self） - > f64;的签名，它表示64位浮点类型的计算输出。 该功能通过引用数据类型的标签和值来操作。

