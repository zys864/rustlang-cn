# [Actix-net](https://actix.rs/actix-net/actix_net/)

Actix-net - Rust可组合的网络服务框架。

## Crate特性

- tls- 通过native-tls箱启用ssl支持
- ssl- 通过openssl箱启用ssl支持
- rust-tls- 通过rustls箱启用ssl支持

## 模块

- **cloneable**：
- **codec**： 用于编码和解码帧的实用工具
- **connector**： 连接器
- **counter**： 计数器
- **either**： 包含Either服务及相关类型和功能
- **framed**： 帧分发服务和相关实用工具
- **inflight**：
- **keepalive**：keepalive
- **resolver**：
- **server**： 通用网络服务器
- **service**：
- **ssl**：	SSL服务
- **stream**： 流服务
- **time**： Time服务
- **timeout**： 请求超时服务