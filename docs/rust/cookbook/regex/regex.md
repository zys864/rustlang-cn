# 正则表达式

## 从电子邮件地址中提取并验证登录

验证电子邮件地址的格式是否正确，并提取@符号前的所有内容。

```rust
#[macro_use]
extern crate lazy_static;
extern crate regex;

use regex::Regex;

fn extract_login(input: &str) -> Option<&str> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"(?x)
            ^(?P<login>[^@\s]+)@
            ([[:word:]]+\.)*
            [[:word:]]+$
            ").unwrap();
    }
    RE.captures(input).and_then(|cap| {
        cap.name("login").map(|login| login.as_str())
    })
}

fn main() {
    assert_eq!(extract_login(r"I❤email@example.com"), Some(r"I❤email"));
    assert_eq!(
        extract_login(r"sdf+sdsfsd.as.sdsd@jhkk.d.rl"),
        Some(r"sdf+sdsfsd.as.sdsd")
    );
    assert_eq!(extract_login(r"More@Than@One@at.com"), None);
    assert_eq!(extract_login(r"Not an email@email"), None);
}

```

## 从文本中提取唯一的#Hashtags列表

从文本中提取，排序和重复删除主题标签列表。

这里给出的hashtag正则表达式只捕获以字母开头的拉丁语标签。完整的twitter标签正则表达式要复杂得多。

```rust
extern crate regex;
#[macro_use]
extern crate lazy_static;

use regex::Regex;
use std::collections::HashSet;

fn extract_hashtags(text: &str) -> HashSet<&str> {
    lazy_static! {
        static ref HASHTAG_REGEX : Regex = Regex::new(
                r"\#[a-zA-Z][0-9a-zA-Z_]*"
            ).unwrap();
    }
    HASHTAG_REGEX.find_iter(text).map(|mat| mat.as_str()).collect()
}

fn main() {
    let tweet = "Hey #world, I just got my new #dog, say hello to Till. #dog #forever #2 #_ ";
    let tags = extract_hashtags(tweet);
    assert!(tags.contains("#dog") && tags.contains("#forever") && tags.contains("#world"));
    assert_eq!(tags.len(), 3);
}

```

## 从文本中提取电话号码

使用[Regex::captures_iter](https://docs.rs/regex/*/regex/struct.Regex.html#method.captures_iter)捕获多个电话号码处理一串文本。这里的例子是美国会议电话号码。

```rust
#[macro_use]
extern crate error_chain;
extern crate regex;

use regex::Regex;
use std::fmt;

error_chain!{
    foreign_links {
        Regex(regex::Error);
        Io(std::io::Error);
    }
}

struct PhoneNumber<'a> {
    area: &'a str,
    exchange: &'a str,
    subscriber: &'a str,
}

impl<'a> fmt::Display for PhoneNumber<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "1 ({}) {}-{}", self.area, self.exchange, self.subscriber)
    }
}

fn run() -> Result<()> {
    let phone_text = "
    +1 505 881 9292 (v) +1 505 778 2212 (c) +1 505 881 9297 (f)
    (202) 991 9534
    Alex 5553920011
    1 (800) 233-2010
    1.299.339.1020";

    let re = Regex::new(
        r#"(?x)
          (?:\+?1)?                       # Country Code Optional
          [\s\.]?
          (([2-9]\d{2})|\(([2-9]\d{2})\)) # Area Code
          [\s\.\-]?
          ([2-9]\d{2})                    # Exchange Code
          [\s\.\-]?
          (\d{4})                         # Subscriber Number"#,
    )?;

    let phone_numbers = re.captures_iter(phone_text).filter_map(|cap| {
        let groups = (cap.get(2).or(cap.get(3)), cap.get(4), cap.get(5));
        match groups {
            (Some(area), Some(ext), Some(sub)) => Some(PhoneNumber {
                area: area.as_str(),
                exchange: ext.as_str(),
                subscriber: sub.as_str(),
            }),
            _ => None,
        }
    });

    assert_eq!(
        phone_numbers.map(|m| m.to_string()).collect::<Vec<_>>(),
        vec![
            "1 (505) 881-9292",
            "1 (505) 778-2212",
            "1 (505) 881-9297",
            "1 (202) 991-9534",
            "1 (555) 392-0011",
            "1 (800) 233-2010",
            "1 (299) 339-1020",
        ]
    );

    Ok(())
}

quick_main!(run);
```

## 通过匹配多个正则表达式筛选日志文件

读取一个名为的文件application.log，仅输出包含“版本XXX”的行，一些IP地址后跟端口443（例如“192.168.0.1:443”）或特定警告。

A [regex::RegexSetBuilder](https://docs.rs/regex/*/regex/struct.RegexSetBuilder.html)组成一个[regex::RegexSet](https://docs.rs/regex/*/regex/struct.RegexSet.html)。由于反斜杠在正则表达式中非常常见，因此使用 [原始字符串文字](https://doc.rust-lang.org/reference/tokens.html#raw-string-literals)使它们更具可读性。

```rust
#[macro_use]
extern crate error_chain;
extern crate regex;

use std::fs::File;
use std::io::{BufReader, BufRead};
use regex::RegexSetBuilder;

error_chain! {
    foreign_links {
        Io(std::io::Error);
        Regex(regex::Error);
    }
}

fn run() -> Result<()> {
    let log_path = "application.log";
    let buffered = BufReader::new(File::open(log_path)?);

    let set = RegexSetBuilder::new(&[
        r#"version "\d\.\d\.\d""#,
        r#"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:443"#,
        r#"warning.*timeout expired"#,
    ]).case_insensitive(true)
        .build()?;

    buffered
        .lines()
        .filter_map(|line| line.ok())
        .filter(|line| set.is_match(line.as_str()))
        .for_each(|x| println!("{}", x));

    Ok(())
}

quick_main!(run);
```

## 将所有出现的一个文本模式替换为另一个模式。

将所有出现的标准`ISO 8601 YYYY-MM-DD`日期模式替换为等效的美式英语日期和斜杠。例如2013-01-15变成01/15/2013。

该方法[Regex::replace_all](https://docs.rs/regex/*/regex/struct.Regex.html#method.replace_all)替换了整个正则表达式的所有出现。 &str实现Replacer特征，允许变量从搜索正则表达式$abcde引用相应的命名捕获组(?P<abcde>REGEX)。有关示例和转义详细信息，请参阅[替换字符串语法](https://docs.rs/regex/*/regex/struct.Regex.html#replacement-string-syntax)。

```rust
extern crate regex;
#[macro_use]
extern crate lazy_static;

use std::borrow::Cow;
use regex::Regex;

fn reformat_dates(before: &str) -> Cow<str> {
    lazy_static! {
        static ref ISO8601_DATE_REGEX : Regex = Regex::new(
            r"(?P<y>\d{4})-(?P<m>\d{2})-(?P<d>\d{2})"
            ).unwrap();
    }
    ISO8601_DATE_REGEX.replace_all(before, "$m/$d/$y")
}

fn main() {
    let before = "2012-03-14, 2013-01-15 and 2014-07-05";
    let after = reformat_dates(before);
    assert_eq!(after, "03/14/2012, 01/15/2013 and 07/05/2014");
}
```