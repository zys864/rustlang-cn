# 目录遍历

## 在过去24小时内修改过的文件名

通过调用获取当前工作目录[env::current_dir](https://doc.rust-lang.org/std/env/fn.current_dir.html)，然后对于每个条目[fs::read_dir](https://doc.rust-lang.org/std/fs/fn.read_dir.html)，提取 [DirEntry::path](https://doc.rust-lang.org/std/fs/struct.DirEntry.html#method.path)并获取metada via [fs::Metadata](https://doc.rust-lang.org/std/fs/struct.Metadata.html)。在 [Metadata::modified](https://doc.rust-lang.org/std/fs/struct.Metadata.html#method.modified)返回[SystemTime::elapsed](https://doc.rust-lang.org/std/time/struct.SystemTime.html#method.elapsed)上次修改时间。[Duration::as_secs](https://doc.rust-lang.org/std/time/struct.Duration.html#method.as_secs)将时间转换为秒，并与24小时（`24 * 60 * 60`秒）进行比较。[Metadata::is_file](https://doc.rust-lang.org/std/fs/struct.Metadata.html#method.is_file)过滤掉目录。

```rust
use std::{env, fs};

fn run() -> Result<()> {
    let current_dir = env::current_dir()?;
    println!(
        "Entries modified in the last 24 hours in {:?}:",
        current_dir
    );

    for entry in fs::read_dir(current_dir)? {
        let entry = entry?;
        let path = entry.path();

        let metadata = fs::metadata(&path)?;
        let last_modified = metadata.modified()?.elapsed()?.as_secs();

        if last_modified < 24 * 3600 && metadata.is_file() {
            println!(
                "Last modified: {:?} seconds, is read only: {:?}, size: {:?} bytes, filename: {:?}",
                last_modified,
                metadata.permissions().readonly(),
                metadata.len(),
                path.file_name().ok_or("No filename")?
            );
        }
    }

    Ok(())
}
```

## 查找给定路径的循环

使用[same_file::is_same_file](https://docs.rs/same-file/*/same_file/fn.is_same_file.html)检测循环对于给定的路径。例如，可以通过符号链接在Unix系统上创建循环：

```bash
mkdir -p /tmp/foo/bar/baz
ln -s /tmp/foo/  /tmp/foo/bar/baz/qux
```

以下将声明存在循环。

```rust
extern crate same_file;

use std::io;
use std::path::{Path, PathBuf};
use same_file::is_same_file;

fn contains_loop<P: AsRef<Path>>(path: P) -> io::Result<Option<(PathBuf, PathBuf)>> {
    let path = path.as_ref();
    let mut path_buf = path.to_path_buf();
    while path_buf.pop() {
        if is_same_file(&path_buf, path)? {
            return Ok(Some((path_buf, path.to_path_buf())));
        } else if let Some(looped_paths) = contains_loop(&path_buf)? {
            return Ok(Some(looped_paths));
        }
    }
    return Ok(None);
}

fn main() {
    assert_eq!(
        contains_loop("/tmp/foo/bar/baz/qux/bar/baz").unwrap(),
        Some((
            PathBuf::from("/tmp/foo"),
            PathBuf::from("/tmp/foo/bar/baz/qux")
        ))
    );
}
```

## 递归查找重复的文件名

在当前目录中以递归方式查找重复文件名，仅打印一次。

```rust
extern crate walkdir;

use std::collections::HashMap;
use walkdir::WalkDir;

fn main() {
    let mut filenames = HashMap::new();

    for entry in WalkDir::new(".")
            .into_iter()
            .filter_map(Result::ok)
            .filter(|e| !e.file_type().is_dir()) {
        let f_name = String::from(entry.file_name().to_string_lossy());
        let counter = filenames.entry(f_name.clone()).or_insert(0);
        *counter += 1;

        if *counter == 2 {
            println!("{}", f_name);
        }
    }
}
```

## 递归查找具有给定谓词的所有文件

查找当前目录中最后一天内修改的JSON文件。使用[follow_links](https://docs.rs/walkdir/*/walkdir/struct.WalkDir.html#method.follow_links)确保遵循符号链接，就像它们是普通目录和文件一样。

```rust
extern crate walkdir;

use walkdir::WalkDir;

fn run() -> Result<()> {
    for entry in WalkDir::new(".")
            .follow_links(true)
            .into_iter()
            .filter_map(|e| e.ok()) {
        let f_name = entry.file_name().to_string_lossy();
        let sec = entry.metadata()?.modified()?;

        if f_name.ends_with(".json") && sec.elapsed()?.as_secs() < 86400 {
            println!("{}", f_name);
        }
    }

    Ok(())
}
```

## 跳过dotfiles时遍历目录

用于[filter_entry](https://docs.rs/walkdir/*/walkdir/struct.IntoIter.html#method.filter_entry)递归下降到传递is_not_hidden谓词的条目， 从而跳过隐藏的文件和目录。 即使父项是隐藏目录，也[Iterator::filter](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.filter)适用于每个[WalkDir::DirEntry](https://docs.rs/walkdir/*/walkdir/struct.DirEntry.html)。

根目录`"."`通过 谓词中的[WalkDir::depth](https://docs.rs/walkdir/*/walkdir/struct.DirEntry.html#method.depth)使用产生`is_not_hidden`。

```rust
extern crate walkdir;

use walkdir::{DirEntry, WalkDir};

fn is_not_hidden(entry: &DirEntry) -> bool {
    entry
         .file_name()
         .to_str()
         .map(|s| entry.depth() == 0 || !s.starts_with("."))
         .unwrap_or(false)
}

fn main() {
    WalkDir::new(".")
        .into_iter()
        .filter_entry(|e| is_not_hidden(e))
        .filter_map(|v| v.ok())
        .for_each(|x| println!("{}", x.path().display()));
}
```

## 递归计算给定深度的文件大小

递归深度可以通过[WalkDir::min_depth](https://docs.rs/walkdir/*/walkdir/struct.WalkDir.html#method.min_depth)＆[WalkDir::max_depth](https://docs.rs/walkdir/*/walkdir/struct.WalkDir.html#method.max_depth)方法灵活设置。计算所有文件大小的总和为3个子文件夹深度，忽略根文件夹中的文件。

```rust
extern crate walkdir;

use walkdir::WalkDir;

fn main() {
    let total_size = WalkDir::new(".")
        .min_depth(1)
        .max_depth(3)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| entry.metadata().ok())
        .filter(|metadata| metadata.is_file())
        .fold(0, |acc, m| acc + m.len());

    println!("Total size: {} bytes.", total_size);
}
```

## 以递归方式查找所有png文件

递归查找当前目录中的所有PNG文件。在这种情况下，`**模式`匹配当前目录和所有子目录。

使用`**模式`在任何路径部分中。例如，`/media/**/*.png` 匹配所有PNG 在media及其子目录。

```rust
extern crate glob;

use glob::glob;

fn run() -> Result<()> {
    for entry in glob("**/*.png")? {
        println!("{}", entry?.display());
    }

    Ok(())
}
```

## 查找给定模式忽略文件名大小写的所有文件。

查找/media/目录中与img_[0-9]*.png模式匹配的所有图像文件。

将自定义[MatchOptions](https://docs.rs/glob/*/glob/struct.MatchOptions.html)结构传递给[glob_with](https://docs.rs/glob/*/glob/fn.glob_with.html)函数，使得glob模式不区分大小写，同时保留其他选项[Default](https://doc.rust-lang.org/std/default/trait.Default.html)。

```rust
extern crate glob;

use glob::{glob_with, MatchOptions};

fn run() -> Result<()> {
    let options = MatchOptions {
        case_sensitive: false,
        ..Default::default()
    };

    for entry in glob_with("/media/img_[0-9]*.png", &options)? {
        println!("{}", entry?.display());
    }

    Ok(())
}
```