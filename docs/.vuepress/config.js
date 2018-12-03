let { read } = require ('./category/read.js')
let { rusteco } = require ('./category/rusteco.js')
let { work } = require ('./category/work.js')
let { book } = require ('./category/rust.js')
let { asyncrust } = require ('./category/asyncrust.js')
let { std } = require ('./category/std.js')
let { cookbook } = require ('./category/cookbook.js')
let { tokio } = require ('./category/tokio.js')
let { actix } = require ('./category/actix.js')
let { actixweb } = require ('./category/actixweb.js')
let { diesel } = require ('./category/diesel.js')
let { discovery } = require ('./category/discovery.js')
let { awesome } = require ('./category/awesome.js')

module.exports = {
    title: 'Rust中文社区',
    description: '致力于Rust编程语言中文网络-QQ群:570065685',
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
    serviceWorker: true,
    theme: 'vue',
    themeConfig: {
        repo: 'rustlang-cn/rustlang-cn',
        docsDir: 'docs',
        displayAllHeaders: true,
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新', 
        docsDir: 'docs',
        sidebarDepth: 0,
        search: true,
        searchMaxSuggestions: 11,
        nav: [
          { text: '阅读', items: [ 
            { text: 'Rust文章', link: '/read/rust/2018/深入浅出Rust-Future-Part-1' },
            { text: 'Rust生态', link: '/read/rusteco/2018/rusteco-2018-11-13' }
          ] },
          { text: '工作', link: '/work/2018/rustwork-2018-11-21' },
          { text: '文档', items: [
              { text: 'Rust语言', items: [
                  { text: '深入Rust语言', link: '/rust/book/' },
                  { text: 'Rust异步编程', link: '/rust/async-rust/' },
                  { text: '标准库', link: '/rust/std/' },
                  { text: '参考规范', link: '/rust/reference/' },
                  { text: 'Rust食谱', link: '/rust/cookbook/' }
                ]
              },
              { text: 'Server', items: [ 
                  { text: 'Tokio', link: '/server/tokio/' },
                  { text: 'Actix', link: '/server/actix/' },
                  { text: 'Actix-web', link: '/server/actix-web/' },
                  { text: 'Diesel', link: '/server/diesel/' }
                ] 
              },
              { text: 'Wasm', items: [ 
                  { text: 'Book', link: '/wasm/book/' },
                  { text: 'Wasm-bindgen', link: '/wasm/wasm-bindgen/' }
                ] 
              },
              { text: 'IOT', items: [ 
                  { text: 'Discovery', link: '/iot/discovery/' },
                  { text: 'Embedded-book', link: '/iot/book/' },
                  { text: 'Embedonomicon', link: '/iot/embedonomicon/' }
                ] 
              }
            ]
          },
          { text: '生态', items: [ 
            { text: 'Awesome', link: '/resourse/awesome/' },
            { text: 'Crates', link: '/resourse/crates/' },
            { text: 'Blogs', link: '/resourse/blogs/' },
            { text: '书签', link: '/resourse/mark/' },
            { text: '资源', link: '/resourse/resourse/' }
          ] },
          { text: '论坛', link: 'https://github.com/rustlang-cn/forum/issues' },
          { text: '网络', items: [ 
            { text: '知乎', link: 'https://zhuanlan.zhihu.com/tianqingse' },
            { text: '微博', link: 'https://weibo.com/kriry' },
            { text: '思否', link: 'https://segmentfault.com/blog/rust-lang' }      
          ] }
        ],
        sidebar: {
          '/read/rust/': read('Read'),
          '/read/rusteco/': rusteco('Rusteco'),
          '/work/': work('Work'),
          '/rust/book/': book('Rust'),
          '/rust/async-rust/': asyncrust('Async-Rust'),
          '/rust/std/': std('Std'),
          '/rust/cookbook/': cookbook('Cookbook'),
          '/server/tokio/': tokio('Tokio'),
          '/server/actix/': actix('Actix'),
          '/server/actix-web/': actixweb('Actix-Web'),
          '/server/diesel/': diesel('Diesel'),
          '/iot/discovery/': discovery('Discovery'),
          '/resourse/awesome/': awesome('Awesome')
        }
    }
}

