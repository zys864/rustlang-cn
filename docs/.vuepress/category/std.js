exports.std = (title) => {
    return [
        '',
        {
            title: 'any',
            collapsable: true,
            children: [
            'any/any'
            ]
        },
        {
            title: 'Collection',
            collapsable: true,
            children: [
            'collection/',
            'collection/hashmap',
            'collection/hashset'
            ]
        },
        {
            title: 'Fs',
            collapsable: true,
            children: [
            'fs/',
            'fs/fs'
            ]
        },
        {
            title: 'IO',
            collapsable: true,
            children: [
            'io/',
            'io/io'
            ]
        },
        {
            title: 'Net',
            collapsable: true,
            children: [
            'net/',
            'net/net'
            ]
        }
    ]
}