在本章中，我们将介绍以下配方：

 - 使用Cargo创建新项目
 - 从crates.io下载外部箱子处理现有的货物项目
 - 用Cargo运行测试
 - 项目的配置管理
 - 在Travis CI上构建项目
 - 上传到crates.io
# 介绍

Cargo是Rust的独特卖点之一，它是系统编程领域的第一个此类卖点。 Cargo是Rust的软件包管理器，它使开发人员在创建，开发，打包，维护，测试和部署应用程序代码或工具到生产方面变得轻松，而且不费吹灰之力。 在本章中，我们将介绍使开发人员能够利用Cargo的所有功能并从开发的第一天开始生产生产级Rust应用程序的配方。

# 使用Cargo创建新项目
Cargo是Rust的独特产品，在系统编程领域是一个非常新的产品。 它也是Rust的卖点之一，因为它使开发人员能够打包，运送和测试他们的Rust应用程序。

我们将在本章介绍Cargo的许多功能。


## 做好准备
我们需要Rust编译器，Cargo和任何文本编辑器进行编码。
## 怎么做...

1.打开终端。
2.转到要创建项目的目录：

```
cd project_location
```

3.输入以下命令以创建新的Rust项目：

```
cargo new project_name --bin
```

创建一个名为hello_world的项目，如以下示例所示：

```
cargo new hello_world --bin
```

你应该得到以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924211126838?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

4.您应该使用项目名称创建一个新文件夹。

首先，进入项目并检查它：

```
cd hello_world
tree .
```

你应该得到以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924211141911?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

这是新创建的项目的整个结构。

5.使用Linux中的cat命令打印Cargo.toml文件的内容：

```
cat Cargo.toml
```

你应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924211151238?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

6.转到项目内的src目录，在该目录中找到默认的main.rs文件，并使用Linux中的cat命令打印其内容：

```
cd src
cat main.rs
```

你应该得到以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924211208268?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)


7.构建cargo new命令附带的示例项目：

```
cargo build
```

你应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924211220305?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

8. Cargo构建将创建一个名为target的新目录和一个名为cargo.lock的文件。

运行已编译的项目，该目录是目标目录中的可执行文件。

```
. project_directory/target/debug/hello_world
```

由于这是一个可执行文件，您应该能够看到应用程序的输出。
你应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924211234608?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

9.我们必须按照前面两个步骤来构建可执行代码，然后执行Rust应用程序，但是使用Cargo命令我们可以同时执行：

```
cd project_location
cargo run
```

你应该得到以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924211242517?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)


## 怎么运行的...

Cargo是一个命令行工具，随Rust的安装一起提供。 这一点至关重要，原因如下：

 - 它引入了传达项目所有细节的元数据文件
 - 它调用了rustc编译器来构建项目
 - 它有助于开发人员更好地构建和维护代码
货物新命令为我们创建完整的文件夹结构。 对于我们的项目， - bin表示二进制文件。 这意味着我们正在创建一个Rust应用程序，该应用程序可以在解决实际问题方面开箱即用。 但是，在这种情况下，我们创建了一个不使用--bin选项作为命令行工具的库。 图书馆在Rust中被称为板条箱。 我们将在接下来的章节中稍后在Rust中创建一个箱子。

Cargo.toml是一个清单文件，其中包含Cargo编译项目所需的所有元数据。 当您运行货运构建命令时，您将看到源代码被转换为可执行字节代码，这将是最终应用程序; 这将创建目标目录并将可执行文件放在其中的调试文件夹中。 在debug文件夹中，我们主要有deps目录，其中包含为执行应用程序而下载的不同依赖包。

您的项目可以选择包含名为example，test和bench的文件夹，Cargo将分别视为包含示例，集成测试和基准测试。

Rust非常智能，只有在代码发生变化时才会编译。

>在调试模式下编译cargo build - 发布适用于开发，并且编译时间较短，因为编译器不进行任何优化和检查。 但是，当您在发布模式下运行代码时，编译需要更长时间，但代码将在生产中运行得更快。 发布模式将在目标内的release文件夹而不是debug目录中准备构建。

我们看到构建过程创建了一个Cargo.lock文件。 此文件包含有关依赖项的所有信息。 我们将在即将发布的食谱中详细介绍此文件。

为了在同一个Rust项目中编译多个二进制文件，我们必须在Cargo.toml文件中创建某些条目，我们在其中明确提到了我们要构建的目标。 默认情况下，Cargo使用相同的项目名称编译src文件夹中的main.rs文件，但是为了编译需要构建的多个二进制文件，例如守护进程和客户端，我们在Cargo.toml中进行以下提及更改。 文件：

这将构建另外两个名为守护进程和客户端的二进制文件以及项目二进制文件。

>类似地，我们可以在配置文件中包含诸如[lib]，[[bench]]，[[test]]和[[example]]之类的部分来构建库，基准测试，测试和示例。

```
[[bin]]
name = "daemon"
path = "src/daemon/bin/main.rs"
[[bin]]
name = "client"
path = "src/client/bin/main.rs"
```

# 从crates.io下载外部包

要创建复杂的应用程序来解决实际问题，我们需要重用其他开源项目和依赖项来加快开发速度。

https://crates.io/是Rust社区的中央存储库，用作发现和下载包的位置。 命令行工具货物配置为查找请求的包并下载和使用它们。 您将学习如何在此配方中下载和维护外部包（依赖项）。
## 做好准备
我们需要Rust编译器，Cargo和任何文本编辑器进行编码。
## 怎么做...

1.在您喜欢的文本编辑器中打开Cargo.toml文件; 在这个配方中，我们将使用nano编辑器：

```
nano Cargo.toml
```

你应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924212438977?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

2.在cargo.toml文件中添加[dependencies]部分，并在其下面输入time =“0.1.12”和regex =“0.1.41”。

你应该得到以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924212450256?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

3.使用cat命令查看配置列表：

```
cat Cargo.toml
```

你应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924212501229?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

4.构建项目以从https://crates.io/中提取依赖项：

```
cargo build
```

你应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924212514495?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

5.使用我们项目中提取的现有板条箱。

使用nano打开src目录中的main.rs文件并输入以下代码：

```
nano main.rs
```

你应该得到以下输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924212530196?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)


```
// Declare the external crate
extern crate regex;
use regex::Regex;
fn main() {
let check_date = Regex::new(r"^\d{4}-\d{2}-\d{2}$").unwrap();
println!("Did our date match? {}", check_date.is_match("2017
-02-01"));
}
```

您应该获得以下状态输出：
![在这里插入图片描述](https://img-blog.csdn.net/20180924212559558?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)


6.编译并运行项目：

```
cargo run
```

你应该得到以下输出：

![在这里插入图片描述](https://img-blog.csdn.net/20180924212608490?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Njk2OTkw/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)


## 怎么运行的...

我们在Cargo.toml文件中输入项目所需的依赖项。 该文件将获取https://crates.io/中央存储库中提到的包和版本。 在前面的配方中，我们下载了时间和正则表达式包，并且还提到了我们想要处理的所需版本。

当我们在修改Cargo.toml文件之后构建项目时，它会下载本地开发系统的crate中的所有模块，并在Cargo.lock文件中创建一个条目，该文件将包含有关下载的依赖项的所有详细信息。

>如果您计划创建库或改进现有库实现，建议您检查是否在https://crates.io/中实现了任何类似的想法或项目，以评估您的打开项目的价值。 https：//crates.io/存储库中的所有项目都是GitHub上提供的开源项目。

使用其他依赖项的有趣之处在于，您可以重用要在项目中使用的应用程序或函数的可用工作版本，并缩短项目开发时间。

我们在Rust脚本中使用extern crate命令来调用下载的包。

extern crate regex或crate并在其拥有的模块中导入其所有功能。 然后我们通过传递数据在代码中调用它们。

在前面的代码片段中，我们明确提到需要使用use命令使用regex :: Regex调用regex crate中的Regex模块并检查日期是否匹配并在终端中打印布尔值。

我们调用unwrap和is_match函数来检查两个字符串是否相同。 如果它们相似则返回true，否则返回false。


# 工作在现有的 Cargo 项目
## 做好准备
我们需要Rust编译器，Cargo和任何文本编辑器进行编码。
## 怎么做...

## 怎么运行的...

## 做好准备
我们需要Rust编译器，Cargo和任何文本编辑器进行编码。
## 怎么做...

## 怎么运行的...
