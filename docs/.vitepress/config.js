export default {
  title: 'TU MCA Docs',
  description: 'A comprehensive guide for MCA admissions at Tezpur University',
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '57x57', href: '/apple-icon-57x57.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '60x60', href: '/apple-icon-60x60.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '72x72', href: '/apple-icon-72x72.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-icon-76x76.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '114x114', href: '/apple-icon-114x114.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-icon-120x120.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '144x144', href: '/apple-icon-144x144.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-icon-152x152.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-icon-192x192.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'msapplication-TileColor', content: '#ffffff' }],
    ['meta', { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }]
  ],
  themeConfig: {
    siteTitle: 'TU MCA Docs',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'TUEE', link: '/tuee/registration' },
      { text: 'CUET', link: '/cuet/paper-info' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Home',
          items: [
            { text: 'Overview', link: '/' },
            { text: 'Anti-Ragging', link: '/anti-ragging' }
          ]
        },
        {
          text: 'TUEE',
          collapsed: false,
          items: [
            { text: 'Registration', link: '/tuee/registration' },
            { text: 'Required Documents', link: '/tuee/documents' },
            { text: 'Syllabus', link: '/tuee/syllabus' },
            { text: 'Seat Capacity', link: '/tuee/seat-capacity' },
            { text: 'Suggested Videos', link: '/tuee/suggested-videos' },
            { text: 'Cut Off', link: '/tuee/cut-off' },
            { text: 'Previous Year Papers', link: '/tuee/previous-year-papers' },
            { text: 'Previous Year Ranksheets', link: '/tuee/previous-year-ranksheets' }
          ]
        },
        {
          text: 'CUET',
          collapsed: false,
          items: [
            { text: 'Paper Info', link: '/cuet/paper-info' },
            { text: 'Cut Off', link: '/cuet/cut-off' },
            { text: 'CUET Ranksheets', link: '/cuet/ranksheets' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/not-ayan/tezumca/' }
    ]
  }
}
