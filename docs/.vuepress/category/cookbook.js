exports.cookbook = (title) => {
    return [
        '',
        {
            title: '正则表达式',
            collapsable: false,
            children: [
            'regex/regex'
            ]
        },
        {
            title: 'Cargo',
            collapsable: false,
            children: [
            'cargo/cargo'
            ]
        },
        {
            title: 'Module',
            collapsable: false,
            children: [
            'module/module'
            ]
        },
        {
            title: 'File',
            collapsable: false,
            children: [
            'file/read-write',
            'file/dir'
            ]
        },
        {
            title: 'Macro',
            collapsable: false,
            children: [
            'macro/macro'
            ]
        },
        {
            title: 'Advance',
            collapsable: false,
            children: [
            'advance/rust-advance-programming'
            ]
        }
    ]
}