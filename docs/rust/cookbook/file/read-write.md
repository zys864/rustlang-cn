# 文件读写

## 从文件中读取字符串行

将三行消息写入文件，然后使用Lines创建的迭代器 一次将其读回一行BufRead::lines。File实现Read，其提供BufReader `trait`。 File::create打开File写作，File::open阅读。

```rust
use std::fs::File;
use std::io::{Write, BufReader, BufRead};

fn run() -> Result<()> {
    let path = "lines.txt";

    let mut output = File::create(path)?;
    write!(output, "Rust\n💖\nFun")?;

    let input = File::open(path)?;
    let buffered = BufReader::new(input);

    for line in buffered.lines() {
        println!("{}", line?);
    }

    Ok(())
}
```

## 避免同时从同一个文件写入和读取

用于[same_file::Handle](https://docs.rs/same-file/*/same_file/struct.Handle.html)可以测试与其他句柄相等的文件。在此示例中，将对要读取和将要写入的文件的句柄进行相等性测试。

```rust
extern crate same_file;

use same_file::Handle;
use std::path::Path;
use std::fs::File;
use std::io::{BufRead, BufReader};

fn run() -> Result<()> {
    let path_to_read = Path::new("new.txt");

    let stdout_handle = Handle::stdout()?;
    let handle = Handle::from_path(path_to_read)?;

    if stdout_handle == handle {
        bail!("You are reading and writing to the same file");
    } else {
        let file = File::open(&path_to_read)?;
        let file = BufReader::new(file);
        for (num, line) in file.lines().enumerate() {
            println!("{} : {}", num, line?.to_uppercase());
        }
    }

    Ok(())
}
```

`cargo run` 显示文件new.txt的内容。

```rust
cargo run >> ./new.txt
```

结果： '错误，因为这两个文件是相同的'

## 使用内存映射随机访问文件

使用[memmap](https://docs.rs/memmap/0.7.0/memmap/)创建文件的内存映射，并模拟文件中的一些非顺序读取。使用内存映射意味着您只需索引切片而不是处理[seek](https://doc.rust-lang.org/std/fs/struct.File.html#method.seek)导航文件。

该[Mmap::map](https://docs.rs/memmap/*/memmap/struct.Mmap.html#method.map)函数假定内存映射后面的文件没有被另一个进程同时修改，否则就会出现[竞争条件](https://en.wikipedia.org/wiki/Race_condition#File_systems)。

```rust
extern crate memmap;

use memmap::Mmap;

fn run() -> Result<()> {
    let file = File::open("content.txt")?;
    let map = unsafe { Mmap::map(&file)? };

    let random_indexes = [0, 1, 2, 19, 22, 10, 11, 29];
    assert_eq!(&map[3..13], b"hovercraft");
    let random_bytes: Vec<u8> = random_indexes.iter()
        .map(|&idx| map[idx])
        .collect();
    assert_eq!(&random_bytes[..], b"My loaf!");
    Ok(())
}
```