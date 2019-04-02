let { book } = require ('./category/rust.js')
let { advrust } = require ('./category/advrust.js')
let { asyncrust } = require ('./category/asyncrust.js')
let { reference } = require ('./category/reference.js')
let { cargo } = require ('./category/cargo.js')
let { tokio } = require ('./category/tokio.js')
let { actix } = require ('./category/actix.js')
let { actixweb } = require ('./category/actixweb.js')
let { diesel } = require ('./category/diesel.js')
let { riker } = require ('./category/riker.js')
let { discovery } = require ('./category/discovery.js')
let { serde } = require ('./category/serde.js')
let { www } = require ('./category/www.js')
let { tokio_blog } = require ('./category/tokio_blog.js')

module.exports = {
    extend: '@vuepress/theme-default',
    title: 'Rust 中文',
    description: '互助Rust爱好者,致力于Rust编程语言中文网络',
    head: [
      ['link', { rel: 'icon', href: `/favicon.ico` }],
      ['link', { rel: 'manifest', href: '/manifest.json' }],
      ['meta', { name: 'theme-color', content: '#3eaf7c' }],
      ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
      ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
      ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
      ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
      ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
    ],
    plugins: ['@vuepress/back-to-top','@vuepress/pwa'],
    themeConfig: {
        repo: 'rustlang-cn/rustlang-cn',
        docsDir: 'docs',
        logo: '/imgs/rust.png',
        displayAllHeaders: true,
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新', 
        sidebarDepth: 0,
        search: true,
        serviceWorker: {
          updatePopup: true
        },
        searchMaxSuggestions: 11,
        nav: [
          { text: '阅读', link: '/read/' },
          { text: '文档', items: [
              { text: '官方Rust书-中文版', link: '/office/rust/' },
              { text: 'Rustlang', items: [
                  { text: 'Rust编程语言', link: '/office/rust/book/' },
                  { text: 'Rust高级编程', link: '/office/rust/advrust/' },
                  { text: 'Rust异步编程', link: '/office/rust/async-rust/' },
                  { text: 'Rust语言规范', link: '/office/rust/reference/' },
                  { text: 'Cargo教程', link: '/office/rust/cargo/' }
                ]
              },
              { text: 'IOT', items: [ 
                  { text: 'Discovery', link: '/office/iot/discovery/' }
                ] 
              }
            ]
          },
          { text: '生态', items: [ 
            { text: 'Rust生态库-中文版', link: '/crates/' },
            { text: 'Actix', link: '/crates/actix/' },
            { text: 'Diesel', link: '/crates/diesel/' },
            { text: 'Riker', link: '/crates/riker/' },
            { text: 'Serde', link: '/crates/serde/' },
            { text: 'Tokio', link: '/crates/tokio/' }
          ] },
          { text: '网络', link: '/www/' },
          { text: '论坛', link: 'http://47.104.146.58' },
          { text: '聊天室', link: 'https://riot.im/app/#/room/#rustlang-cn:matrix.org' }
          
        ],
        sidebar: {
          '/office/rust/book/': book('Rust'),
          '/office/rust/advrust/': advrust('AdvRust'),
          '/office/rust/async-rust/': asyncrust('Async-Rust'),
          '/office/rust/reference/': reference('Reference'),
          '/office/rust/cargo/': cargo('Cargo'),
          '/office/iot/discovery/': discovery('Discovery'),
          '/crates/tokio/docs/': tokio('Tokio'),
          '/crates/actix/actix/': actix('Actix'),
          '/crates/actix/actix-web/': actixweb('Actix-Web'),
          '/crates/diesel/': diesel('Diesel'),
          '/crates/riker/': riker('Riker'),
          '/crates/serde/': serde('Serde'),
          '/www/': www('www'),
          '/crates/tokio/blog/': tokio_blog('tokio_blog')
        }
    }
}

