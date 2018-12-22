exports.asyncrust = (title) => {
    return [
        '',
        {
            title: '开始',
            collapsable: true,
            children: [
            'getting_started/chapter',
            'getting_started/why_async',
            'getting_started/async_await_primer',
            'getting_started/http_server_example'
            ]
        },
        {
            title: '执行者',
            collapsable: true,
            children: [
            'execution/chapter',
            'execution/future',
            'execution/wakeups',
            'execution/executor',
            'execution/io'
            ]
        },
        {
            title: 'Async/Await',
            collapsable: true,
            children: [
            'async_await/chapter'
            ]
        },
        {
            title: '固定',
            collapsable: true,
            children: [
            'pinning/chapter'
            ]
        },
        {
            title: '流',
            collapsable: true,
            children: [
            'streams/chapter'
            ]
        },
        'api'
    ]
}
