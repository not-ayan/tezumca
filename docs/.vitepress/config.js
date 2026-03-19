export default {
  title: 'TU MCA Docs',
  description: 'A comprehensive guide for MCA admissions at Tezpur University',
  themeConfig: {
    logo: '/logo.png', // Optional: add a logo.png to docs/public/
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
            { text: 'Overview', link: '/' }
          ]
        },
        {
          text: 'TUEE',
          collapsed: false,
          items: [
            { text: 'Registration', link: '/tuee/registration' },
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
