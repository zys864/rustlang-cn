exports.asyncrust = (title) => {
    return [
        '',
        {
            title: '开始',
            collapsable: false,
            children: [
            'getting_started/chapter',
            'getting_started/why_async',
            'getting_started/async_await_primer',
            'getting_started/http_server_example'
            ]
        },
        {
            title: 'Execution',
            collapsable: false,
            children: [
            'execution/chapter',
            'execution/future',
            'execution/wakeups',
            'execution/executor'
            ]
        },
        {
            title: 'Pinning',
            collapsable: false,
            children: [
            'pinning/chapter'
            ]
        }
    ]
}