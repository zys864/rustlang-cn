let { work } = require ('./category/work.js')
let { book } = require ('./category/rust.js')
let { asyncrust } = require ('./category/asyncrust.js')
let { std } = require ('./category/std.js')
let { cookbook } = require ('./category/cookbook.js')
let { tokio } = require ('./category/tokio.js')
let { actix } = require ('./category/actix.js')
let { actixnet } = require ('./category/actixnet.js')
let { actixweb } = require ('./category/actixweb.js')
let { diesel } = require ('./category/diesel.js')
let { riker } = require ('./category/riker.js')
let { discovery } = require ('./category/discovery.js')
let { serde } = require ('./category/serde.js')
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
        // logo: '/imgs/rust.png',
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
            { text: '文章', link: '/read/rust/' },
            { text: '社刊', link: '/read/rustlang-cn/' }
          ] },
          { text: '文档', items: [
              { text: '官方书籍大全', link: '/office/rust/' },
              { text: 'Rustlang', items: [
                  { text: 'Rust编程语言', link: '/office/rust/book/' },
                  { text: 'Rust异步编程', link: '/office/rust/async-rust/' },
                  { text: 'Rust标准库', link: '/office/rust/std/' },
                  { text: 'Rust参考规范', link: '/office/rust/reference/' },
                  { text: 'Rust食谱', link: '/office/rust/cookbook/' }
                ]
              },
              { text: 'Server', items: [ 
                  { text: 'Futures', link: '/office/server/futures/' }
                ] 
              },
              { text: 'Wasm', items: [ 
                  { text: 'Book', link: '/office/wasm/book/' },
                  { text: 'Wasm-bindgen', link: '/office/wasm/wasm-bindgen/' }
                ] 
              },
              { text: 'CLI', items: [ 
                  { text: 'book', link: '/office/cli/book/' }
                ] 
              },
              { text: 'IOT', items: [ 
                  { text: 'book', link: '/office/iot/book/' },
                  { text: 'Discovery', link: '/office/iot/discovery/' },
                  { text: 'Embedonomicon', link: '/office/iot/embedonomicon/' }
                ] 
              }
            ]
          },
          { text: '生态', items: [ 
            { text: 'Actix', link: '/crates/actix/' },
            { text: 'Actix-net', link: '/crates/actix-net/' },
            { text: 'Actix-web', link: '/crates/actix-web/' },
            { text: 'Diesel', link: '/crates/diesel/' },
            { text: 'Riker', link: '/crates/riker/' },
            { text: 'Serde', link: '/crates/serde/' },
            { text: 'Tokio', link: '/crates/tokio/' }
          ] },
          { text: '网络', items: [ 
            { text: 'Awesome', link: '/resourse/awesome/' },
            { text: 'Crates', link: '/resourse/crates/' },
            { text: 'Blogs', link: '/resourse/blogs/' },
            { text: '书签', link: '/resourse/mark/' },
            { text: '资源', link: '/resourse/resourse/' },
            { text: '专栏', items: [ 
              { text: '知乎', link: 'https://zhuanlan.zhihu.com/rustlang-cn' },
              { text: '思否', link: 'https://segmentfault.com/blog/rust-lang' },
              { text: '简书', link: 'https://www.jianshu.com/c/2efae7198ea3' },
              { text: '微博', link: 'https://weibo.com/kriry' }      
            ] }
          ] },
          { text: '工作', link: '/work/2018/rustwork-2018-11-21' },
//           { text: '论坛', link: 'https://github.com/rustlang-cn/forum/issues' }，
          { text: '论坛', link: 'http://47.104.146.58' }
          
        ],
        sidebar: {
          '/office/rust/book/': book('Rust'),
          '/office/rust/async-rust/': asyncrust('Async-Rust'),
          '/office/rust/std/': std('Std'),
          '/office/rust/cookbook/': cookbook('Cookbook'),
          '/office/iot/discovery/': discovery('Discovery'),
          '/crates/tokio/': tokio('Tokio'),
          '/crates/actix/': actix('Actix'),
          '/crates/actix-net/': actixnet('Actix-net'),
          '/crates/actix-web/': actixweb('Actix-Web'),
          '/crates/diesel/': diesel('Diesel'),
          '/crates/riker/': riker('Riker'),
          '/crates/serde/': serde('Serde'),
          '/resourse/awesome/': awesome('Awesome'),
          '/work/': work('Work'),
        }
    }
}

