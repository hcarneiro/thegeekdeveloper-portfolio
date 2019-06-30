const pkg = require('./package')
const dev = !(process.env.NODE_ENV === 'production')
const baseURL = dev ? 'http://localhost:3333' : process.env.API_URL
let private
if (dev) {
  try {
    private = require('./config/private.json')
  } catch (err) {
    private = undefined
  }
}

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - The Geek Developer',
    meta: [
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'keywords', name: 'keywords', keywords: 'Portfolio, Personal Website, Web Developer, Designer, Developer, Geek, Gamer' },
      { hid: 'og-image', property: 'og:image', content: baseURL + '/portfolio-preview.jpg' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: '/textboxio/textboxio.js'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#facf5a',
    failedColor: '#83d6d6'
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/modernizr-custom.js', ssr: false },
    { src: '~/plugins/nuxt-swiper-plugin.js', ssr: false },
    { src: '~/plugins/vue-dialog.js', ssr: false },
    { src: '~/plugins/vue-share.js', ssr: false },
    '~/plugins/fontawesome.js',
    '~/plugins/directives.js'
  ],

  /*
  ** Global CSS
  */
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'swiper/dist/css/swiper.css',
    '@/assets/index.scss',
    '@/assets/main.css'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/onesignal',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/google-analytics',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap'
  ],

  /*
  ** Sitemap configuration
  */
  sitemap: {
    gzip: true,
    exclude: [
      '/auth',
      '/api/**',
      '/logout'
    ],
    defaults: {
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      lastmodrealtime: true
    },
    routes: [
      '/work/fliplet-studio-v2',
      '/work/nuxtjs-with-basic-authentication',
      '/work/sortable-dom-tree',
      '/work/the-geek-developer-portfolio'
    ]
  },

  /*
  ** Google Analytics configuration
  */
  googleAnalytics: {
    id: dev && private ? private.GOOGLE_ANALYTICS : process.env.GOOGLE_ANALYTICS,
    autoTracking: {
      screenview: true
    }
  },

  /*
  ** Meta configuration
  */
  meta: {
    name: 'The Geek Developer',
    description: false,
    ogHost: dev ? 'http://localhost:3333' : 'https://www.thegeekdeveloper.com', 
    twitterCard: 'summary',
    twitterSite: '@thehugodesigns',
    twitterCreator: '@thehugodesigns'
  },

  /*
  ** OneSignal module configuration
  */
  oneSignal: {
    init: {
      appId: dev && private ? private.ONESIGNAL_APP_ID : process.env.ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        "title": "The Geek Developer",
        "message": "Thank you!"
      }
    }
  },
  webfontloader: {
    google: {
      families: [
        'Roboto:300,400,700',
        'Roboto+Slab:300,400,700'
      ]
    }
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    https: dev ? false : true
  },

  router: {
    middleware: 'auth'
  },

  render: {
    http2: {
      push: true
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
