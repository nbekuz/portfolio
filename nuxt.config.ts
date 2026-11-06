export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: false },
  css: ['~/assets/css/else.css', '~/assets/css/app.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru', class: '__variable_1647ee __variable_6ec4d7 __variable_df9e58 __variable_f2a707' },
      script: [
        {
          innerHTML:
            "try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(max-width: 767px)').matches||localStorage.getItem('hasVisited'))document.documentElement.setAttribute('data-no-preloader','')}catch(e){}",
          tagPosition: 'head',
        },
      ],
      title: 'Else Digital — Разработка цифровых продуктов',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Разрабатываем сложные веб-сервисы, сайты и мобильные приложения. Аналитика, дизайн, разработка, поддержка.',
        },
        { name: 'theme-color', content: '#202024' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/overused-regular.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/overused-medium.woff2', crossorigin: '' },
      ],
    },
  },
  nitro: {
    prerender: { routes: ['/'], crawlLinks: false },
  },
})
