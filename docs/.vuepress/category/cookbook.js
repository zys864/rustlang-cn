exports.cookbook = (title) => {
    return [
        '',
        {
            title: '正则表达式',
            collapsable: true,
            children: [
            'regex/regex'
            ]
        },
        {
            title: 'Cargo',
            collapsable: true,
            children: [
            'cargo/cargo'
            ]
        },
        {
            title: 'Module',
            collapsable: true,
            children: [
            'module/module'
            ]
        },
        {
            title: 'File',
            collapsable: true,
            children: [
            'file/read-write',
            'file/dir'
            ]
        },
        {
            title: 'Macro',
            collapsable: true,
            children: [
            'macro/macro'
            ]
        },
        {
            title: 'Advance',
            collapsable: true,
            children: [
            'advance/rust-advance-programming'
            ]
        }
    ]
}