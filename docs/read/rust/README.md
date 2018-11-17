# 深入理解编译器

> [原文出处](https://bbs.pediy.com/thread-247810.htm)

欢迎向Rust中文社区投稿,**[投稿地址](https://github.com/rustlang-cn/articles)**,好文将在以下地方直接展示

- 1 [Rust中文社区首页](https://rustlang-cn.github.io)
- 2 Rust中文社区[Rust文章栏目](https://rustlang-cn.github.io/read/rust/)
- 3 知乎专栏[Rust语言](https://zhuanlan.zhihu.com/tianqingse)

## 编程语言是如何工作的

从内部理解编译器会使你更有效的使用它。在这个时间顺序的摘要中，概括了编程语言和编译器是如何工作的。我们排版了大量的链接，示例代码，和图表来帮助你理解。

## 作者注

理解编译器—— 是我的在Medium上第二篇文章的后续，超过了21000的阅读量。我很高兴我能在人们的教育产生积极的影响，我很兴奋能够**根据我从原始文章收到的反馈进行完全的重写**。

> [Understanding Compilers — For Humans](https://medium.com/@CanHasCommunism/understanding-compilers-for-humans-ba970e045877)

我选择Rust作为这部作品的主要语言。它是冗长，高效，现代的，并且在设计上似乎对编写器非常简单。我喜欢使用它。https://www.rust-lang.org/

 
本文的目的是为了保持读者的注意力而非20页的麻木阅读。本文有许多链接会导航您到引起您兴趣的主题以进行更深入的探索。大多数链接会带领你到Wikipedia。

## 什么是编译器

总的来说，你所谓的编程语言其实就是软件，叫做编译器，它读取文本文件，做了许多处理，并生成二进制文件。 由于计算机只能读1或0，人们写Rust更高质量，而不是写二进制文件，编译器被用来将人类可读的文本转换为计算机可读的机器码。

 
编译器可以是任何一个能将一个文本翻译为另一个文本的程序。例如，这是一个用Rust写的编译器，它将所有的0转为1，1转为0 。

```rust
// An example compiler that turns 0s into 1s, and 1s into 0s.
 
fn main() {
    let input = "1 0 1 A 1 0 1 3";
 
    // iterate over every character `c` in input
    let output: String = input.chars().map(|c|
        if c == '1' { '0' }
        else if c == '0' { '1' }
        else { c } // if not 0 or 1, leave it alone
    ).collect();
 
    println!("{}", output); // 0 1 0 A 0 1 0 3
}
```

尽管这个编译器不读取文件，不生成AST，不产生二进制文件，但是它仍然被认为是一个编译器，因为它翻译了输入。

## 编译器做了什么

简单来说，编译器读取源代码生成二进制文件。由于直接将复杂的、人类可读的代码转为一和零是非常复杂的，编译器在程序可运行前有几个步骤要做：

* 1 读取你给它的源代码中的独立字符。
* 2 将字符分类为字，数字，符号和操作符。
* 3 获取已排序完的字符，并通过将它们与模式匹配相匹配和生成操作树来确定它们尝试进行的操作。
* 4 迭代上一步中生成操作树中的每一个操作，并生成等效的二进制文件。

当我说编译器立刻从一个操作树转化到二进制文件时，它实际生成了汇编代码，汇编代码随后被汇编/编译成二进制文件。汇编像是更高级的，人类可读的二进制文件。在这里阅读关于[汇编](https://en.wikipedia.org/wiki/Assembly_language)更多的东西。

![](https://bbs.pediy.com/upload/attach/201811/703263_PBGUBSBPVQH5KY8.png)

## 解释器（Interpreter）是什么

[解释器](https://en.wikipedia.org/wiki/Interpreter_%28computing%29)非常像编译器，它们读取一门语言并处理它。但是，**解释器跳过代码生成并且会[即时执行](https://en.wikipedia.org/wiki/Just-in-time_compilation)AST**。解释器的最大的优点是它在调试期间运行你的程序时所用的时间。一个编译器在程序执行前可能会花费一秒到几分钟时间编译程序，然而解释器立刻执行，不需要编译。解释器最大的缺点是它要求在程序可被执行前，用户的电脑上必须安装解释器。

![](https://bbs.pediy.com/upload/attach/201811/703263_QT9AB6W7R5UZH5E.png)

本文主要谈论编译器，但是你应该清楚他们之间的不同以及和编译器之间的关系。

## 1. 词法分析

第一步是按字符分割输入字符。这步叫做词法分析，或者符号化。词法分析主要的思想是 将字符组合在一起形成单词，标识符，符号等等。词法分析大多不处理任何类似2+2的逻辑——它只会说有三个符号：一个数字：2，一个加号，以及另一个数字：2。

 
假设你正在分析如12+3这样的字符串：它会读取字符1,2,+,和3。我们有了独立的字符，但我们必须将他们组合在一起，这是符号化的主要任务之一。例如，我们得到了1和2作为独立的字母，但是我们需要将他们放在一起，并解析他们作为一个单独的整型数字。+同样需要被认为是一个加号，而不是它的文字字符值——字符码43.

![](https://bbs.pediy.com/upload/attach/201811/703263_ECSKEHYDYWUEADJ.png)

如果你可以看到代码，并以这种方式赋予更多的意义，随后，按照Rust符号化可以组合数字位32-bit整型，加号作为Token值Plus。

>[Rust Playground](https://play.rust-lang.org/?gist=070c3b6b985098a306c62881d7f2f82c&version=stable&mode=debug&edition=2015)

你可以在Rust 操作界面点击左上角的“运行”按钮来在浏览器中编译和执行代码。

在编程语言的编译器中，词法分析器可能需要几种不同类型的符号。例如：符号（symbols），数字，标识符，字符串，操作符等。它完全依赖于语言自身，才能知道您需要从源代码中提取哪种类型的符号。

```c
int main() {
    int a;
    int b;
    a = b = 4;
    return a - b;
}
 
Scanner production:
[Keyword(Int), Id("main"), Symbol(LParen), Symbol(RParen), Symbol(LBrace), Keyword(Int), Id("a"), Symbol(Semicolon), Keyword(Int), Id("b"), Symbol(Semicolon), Id("a"), Operator(Assignment), Id("b"),
Operator(Assignment), Integer(4), Symbol(Semicolon), Keyword(Return), Id("a"), Operator(Minus), Id("b"), Symbol(Semicolon), Symbol(RBrace)]

```

这是一段经过词法分析的C语言源码，且它的符号都被打印了出来。

## 2. 解析

解析器是语法（分析）的核心。**解析器使用词法分析器生成的符号，尝试判断它们是否处于某种排列样式，随后，将那些排列形式与表达式联系，如调用函数，召回变量或者数学操作**。 解析器是按照字面定义语言的语法。

 
int a = 3 和 a: int = 3的不同在解析器中。解析器决定了语法的外观。它确定了括号和花括号平衡，每条语句以分号结束，每个函数有一个名字。解析器知道当符号不能匹配到预设的样式时，有些东西的顺序出现了问题。

 
你可以编写几种不同[类型的解析器](https://en.wikipedia.org/wiki/Parsing#Types_of_parsers)。其中最常见的是自上而下,[递归下降解析器](https://en.wikipedia.org/wiki/Recursive_descent_parser)。递归下降解析是最容易使用和理解的。我编写的许多解析器示例都是基于递归解析的。

 
可以使用[语法](https://en.wikipedia.org/wiki/Formal_grammar)来概括语法解析器解析。如[EBNF](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)这样的语法可以描述解析器的简单数学操作，如12+3：

```EBNF
expr = additive_expr ;
additive_expr = term, ('+' | '-'), term ;
term = number ;
```

简单加减表达式的EBNF语法

记住，语法文件不是解析器，但是它的确概括了解析器所做的。你按照这样的语法构造一个类似的解析器。它被人类使用，相对于直接查看解析器的代码更容易阅读和理解。

 
该语法的解析器是`expr`解析器，因为它是顶级项目，基本所有都与它有关。唯一有效的输入必须是任何数字，接加号或减号，接任何数字。`expr`期望一个`additive_expr`,这是加法和减法主要出现的地方。`additive_expr`首先期望一项(`term`)（一个数字），随后是加号或减号，另一项。

![](https://bbs.pediy.com/upload/attach/201811/703263_PNS6VAN2U8Z5Y5P.png)

解析12+3生成的AST示例

**当解析器解析时生成的树称为抽象语法树（abstract syntax tree）,或AST**。 AST包含了所有的操作。解析器不需要计算（所解析的）操作，只需以正确的顺序收集它们即可。

我之前添加了我们的词法分析器代码，以便与我们的语法匹配，并生成如图中的ASTs。我用`// BEGIN PARSER //`和`// END PARSER //`标记了新解析器代码的开始和结束。

[Rust Playground](https://play.rust-lang.org/?gist=205deadb23dbc814912185cec8148fcf&version=stable&mode=debug&edition=2015)

我们实际上可以更深入。假设我们想支持只有数字没有操作的输入，或者添加乘法或除法，甚至添加优先级。这可以快速更改语法文件，并在我们解析器代码中做调整来反映出来。

```EBNF
expr = additive_expr ;
additive_expr = multiplicative_expr, { ('+' | '-'), multiplicative_expr } ;
multiplicative_expr = term, { ("*" | "/"), term } ;
term = number ;
```

新语法

[Rust Playground](https://play.rust-lang.org/?gist=1587a5dd6109f70cafe68818a8c1a883&version=nightly&mode=debug&edition=2018)

![](https://bbs.pediy.com/upload/attach/201811/703263_CC2SDTTJ32XKUSH.png)

C语言的扫描器（又称词法分析器）和解析器的案例。从字符序列“if(net>0.0)total+=net*(1.0+tax/100.0);”开始，扫描器组建了符号序列，并分类，例如作为标识符，保留字，数字字符，或操作符。后面的序列由解析器转换成语法树，然后由生于的编译器阶段处理。扫描器和解析器处理C语言语法常规的和正确的无上下文的部分。

## 3. 生成代码

[代码生成器](https://en.wikipedia.org/wiki/Code_generation_%28compiler%29)使用AST和代码的等价物或者汇编代码。**代码生成器必须以递归下降顺序遍历AST中的每一项——很像解析器所做的——随后发出等效的代码**。

> [Compiler Explorer - Rust (rustc 1.29.0)](https://godbolt.org/z/K8416_)

如果你打开了上面的链接，你可以看到左侧示例代码产生的汇编代码。汇编代码的3-4行展示了编译器在遇到常量时如何生成常量的代码。

 
Godbolt Compiler Explorer是非常好的工具，允许你用高级语言写代码并看到它生成的汇编代码。你可以对用它做一些有趣的尝试，看看生成哪一类的代码，但是，不要忘记对你的编译器添加优化标志来显示它的智能之处。（Rust语言使用-o）

 
如果你对ASM中编译器是如何保存局部变量到内存感兴趣，[这篇文章](https://norasandler.com/2018/01/08/Write-a-Compiler-5.html)(代码生成节)详细解释了栈。大多时候，当变量不是局部的，高级编译器会在堆上为变量分配内存，并在那里存储，而不是在栈上。你可以阅读更多有关存储变量的内容在[StackOverflow答案](https://stackoverflow.com/questions/18446171/how-do-compilers-assign-memory-addresses-to-variables/18446414#18446414)。

 
由于汇编是完全不同的，复杂的主题，我不会特别谈论它太多。我只想强调代码生成器的工作和重要性。并且，代码生成器可以生成的不仅仅是汇编。Haxe有可以生成超过六种不同编程语言的[后端](https://en.wikipedia.org/wiki/Compiler#Back_end);包括C++，Java和Python。

 
后端指的是编译器的代码生成器或评估器；因此，前端是词法分析器和解析器。也有中端，大多数是做本节之后的优化和IRs解释。后端大多与前端无关，只需考虑接受到的AST。这意味着可以为几个不同的前端或语言重用相同的后端。众人皆知的[GNU Compiler Collection](https://gcc.gnu.org/)就是一个。

 
我的C编译器后端是最好的代码生成器示例；你可以在[这里](https://github.com/asmoaesl/ox/blob/master/src/generator.rs)找到它。

 
汇编产生后，它会被写入新的汇编文件（.s或.asm）。这个文件会被汇编器传递，汇编器是汇编的编译器，会生成二进制的等价物。二进制代码随后会被写入称作对象文件的新文件（.o）。

 **对象文件是机器码，但不可执行**。要让它们变得可执行，对象文件需要一起被链接。链接器使用这个通用机器码，并使它变得可执行，共享库或静态库。更多关于连接器点击[这里](https://en.wikipedia.org/wiki/Linker_%28computing%29#Overview) 。

 **链接器是基于操作系统的可变有效程序。一个单独的，第三方的链接器应该能够编译你的后端生成的对象代码。当制作编译器时，不需要创建你自己的链接器。**

 ![](https://bbs.pediy.com/upload/attach/201811/703263_GMARFPVDSRRRKEG.png)

 编译器可能有[中间表示(intermediate representation,IR)](https://en.wikipedia.org/wiki/Intermediate_representation)。IR是用于无损地表示原始指令以进行优化或翻译成另一种语言。 IR不是原始源代码；IR是为了在代码中找到潜在优化的无损简化。[循环展开](https://en.wikipedia.org/wiki/Loop_unrolling)和[矢量化](https://en.wikipedia.org/wiki/Automatic_vectorization)是使用IR完成的。更多有关IR的优化示例可以在[这个PDF](http://www.keithschwarz.com/cs143/WWW/sum2011/lectures/140_IR_Optimization.pdf)中找到。

## 总结

当你理解了编译器，你可以更高效的使用你的编程语言。可能有一天你会想制作你自己的编程语言？我希望本文可以帮助到你。

## 参考&拓展阅读

- http://craftinginterpreters.com/ ——指导您使用C和Java制作解释器

- https://norasandler.com/2017/11/29/Write-a-Compiler.html——可能对我来说是最有用的“编写编译器”的教程

- 我的C编译器和科学计算器解析器可以在[这里](https://github.com/asmoaesl/ox)和[这里](https://github.com/asmoaesl/rsc)被找到

- 另一种类型解析器示例，称为优先级攀爬解析器，可以在[这里](https://play.rust-lang.org/?gist=d9db7cfad2bb3efb0a635cddcc513839&version=stable&mode=debug&edition=2015)找到。版权所有：Wesley Norris