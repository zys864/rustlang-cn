# 运行`Future`

Riker可以执行并推动`Future`完成。 实际上，内部参与者由调度员作为`Future`执行。 这意味着Riker可以与演员一起在同一个调度员上运行任何未来。

ActorSystem和Context都有一个接受未来运行的execute方法：