export const ORIGIN = 'https://else-digital.ru'

export const ext = (path: string) => (path.startsWith('http') ? path : ORIGIN + path)

export const PHONE = '+7 (495) 118-37-10'
export const PHONE_HREF = 'tel:+74951183710'
export const EMAIL = 'info@else-digital.ru'
export const TELEGRAM = 'https://t.me/DmitryMukhin'

export const navigation = [
  { label: 'Услуги', href: ext('/services/') },
  { label: 'Кейсы', href: ext('/cases/') },
  { label: 'Компания', href: ext('/about/') },
  { label: 'Технологии', href: ext('/technologies/') },
  { label: 'Блог', href: ext('/blog/') },
  { label: 'Вакансии', href: ext('/vacancies/') },
  { label: 'Контакты', href: ext('/contacts/') },
]

export const socials = {
  telegram: 'https://t.me/else_digital',
  vc: 'https://vc.ru/else_digital',
  behance: 'https://www.behance.net/else-digital',
  dprofile: 'https://dprofile.ru/else',
  vk: 'https://vk.ru/else_digital',
}

export const budgets = ['До 1 млн рублей', 'От 1 до 5 млн рублей', 'Более 5 млн рублей']

export const cases = [
  {
    id: 'nuzhnie-lyudi',
    title: 'Мобильное приложение Нужные Люди',
    description: 'Сервис для поиска специалистов на строительные работы',
    tags: ['Мобильное приложение', 'Строительство'],
    video: '/assets/cases/lyudi/video-coverH264.mp4',
    image: '/assets/cases/lyudi/cover.webp',
  },
  {
    id: 'regro-vahta',
    title: 'Сервис автоматизации Регро Вахта',
    description: 'HR портал с личными кабинетами соискателей',
    tags: ['Мобильное приложение', 'Веб-сервис', 'Услуги'],
    video: '/assets/cases/regro/cover.mp4',
    image: '/assets/cases/regro/cover.webp',
  },
  {
    id: 'sozvezdie_mebeli',
    title: 'B2B-портал Созвездие Мебели',
    description: 'B2B/B2C портал с личными кабинетами партнёров',
    tags: ['Веб-сервис', 'B2B/B2C-портал', 'Производство'],
    video: '/assets/cases/mebel/cover.mp4',
    image: '/assets/cases/mebel/cover.webp',
  },
  {
    id: 'meridian',
    title: 'Мобильное приложение Меридиан',
    description: 'Мобильное приложение для HoReCa',
    tags: ['Мобильное приложение', 'Услуги'],
    video: '/assets/cases/meridian/meridian.mp4',
    image: '/assets/cases/meridian/cover.webp',
  },
]

const awardVideo = (category: string, place: string) => {
  const base = '/assets/videos/awards/'
  if (category === 'Премия WDA') return base + 'star.mp4'
  if (category === 'Ruward') return base + 'ruward.mp4'
  if (category === 'Tagline Awards') return base + 'tagline.mp4'
  if (category === 'Рейтинг Рунета') {
    if (place === '1 место') return base + '1.mp4'
    if (place === '3 место') return base + '3.mp4'
  }
  return base + 'metal.mp4'
}

export const awards = [
  ['1 место', 'Разработка мобильных приложений в Ростове-на-Дону', 'Рейтинг Рунета', '2024-2026'],
  ['1 место', 'Разработка интернет-магазинов в Ростове-на-Дону', 'Рейтинг Рунета', '2024-2026'],
  ['3 место', 'Поддержка и развитие сайтов в Ростове-на-Дону', 'Рейтинг Рунета', '2024-2026'],
  ['3 место', 'Разработка сайтов в Ростове-на-Дону', 'Рейтинг Рунета', '2024'],
  ['3 место', 'Разработка интернет-магазинов для B2C', 'Рейтинг Рунета', '2024'],
  ['5 место', 'Разработка сайтов в категории «Микробизнес»', 'Рейтинг Рунета', '2024'],
  ['7 место', 'Разработка интернет-магазинов на платформе «1С-Битрикс»', 'Рейтинг Рунета', '2024'],
  ['ТОП 10', 'Лучшая мобильная разработка', 'Премия WDA', '2024'],
  ['10 место', 'Разработка сайтов на Django', 'Рейтинг Рунета', '2024'],
  ['11 место', 'Разработка мобильных приложений для B2B микро/малого/среднего бизнеса', 'Рейтинг Рунета', '2024'],
  ['12 место', 'Разработка мобильных приложений в категории «Здоровье и фитнес»', 'Рейтинг Рунета', '2024'],
  ['13 место', 'Разработка интернет-магазинов', 'Рейтинг Рунета', '2024'],
  ['14 место', 'Аустаффинг разработки', 'Ruward', '2024'],
  ['14 место', 'Поддержка мобильных приложений', 'Рейтинг Рунета', '2024'],
  ['18 место', 'Мобильная и бэкенд разработка', 'Ruward', '2024'],
  ['19 место', 'Дизайн UX/UI', 'Ruward', '2024'],
  ['68 место', 'Разработка мобильных приложений', 'Tagline Awards', '2024'],
  ['98 место', 'Веб-разработка', 'Tagline Awards', '2024'],
].map(([place, title, category, year]) => ({
  place: place!,
  title: title!,
  category: category!,
  year: year!,
  rating: `${category} ${year}`,
  video: awardVideo(category!, place!),
}))

export const reviews = [
  {
    text: 'Очень довольны работой команды! Сайт получился удобным, интуитивно понятным и визуально привлекательным — цветовая гамма и дизайн действительно бросаются в глаза, в хорошем смысле. Всё работает стабильно, без лишней суеты. Рекомендуем!',
    author: 'Лобов Вячеслав Игоревич',
    company: 'Руководитель отдела продаж ООО ПКФ ШМЗ',
    position: 'center',
    image: '/assets/images/reviews/shmz.webp',
  },
  {
    text: 'Хотим отметить внимательный подход и\u00a0умение учитывать наши индивидуальные потребности. Благодаря вашему вкладу, мы достигли значимых результатов и с уверенностью смотрим в будущее. Ценим наше партнерство и рассчитываем на\u00a0дальнейшее успешное сотрудничество с Else.',
    author: 'Дмитрий Панфилов',
    company: 'Собственник сервиса Panfilov Invest',
    position: 'left',
    image: '/assets/images/reviews/panfilov.webp',
  },
  {
    text: 'Отличный сервис и профессиональный подход к работе! Сотрудничество с Else приносит только положительные эмоции',
    author: 'Ратко',
    company: 'Собственник сервиса Нужные Люди',
    position: 'right',
    image: '/assets/images/reviews/ratko.webp',
  },
  {
    text: 'Работаем уже больше 4 лет. Нравится индивидуальный подход  к задачам и вовлечение в процесс. Рекомендую как надежного партнера',
    author: 'Александр',
    company: 'Собственник сервиса Desbi',
    position: 'center',
    image: '/assets/images/reviews/alexandr.webp',
  },
  {
    text: 'В ходе разработки интернет-магазина, сотрудники компании Else предлагали современные и рациональные решения. Был детально проработан индивидуальный дизайн, произведена интеграция с 1С Предприятие и CRM системой Битрикс24. Настроено взаимодействие с платёжной системой CloudPayments и модулем рассрочки от Тинькофф. Также успешно реализована интеграция со службами доставки СДЭК, КСЕ, Boxberry. Рекомендую Else как надёжного подрядчика в веб-разработке.',
    author: 'Иван',
    company: 'Продакт менеджер Мегафон',
    position: 'left',
    image: '/assets/images/reviews/ivan.webp',
  },
] as const

export const advantages = [
  {
    title: 'Прозрачные процессы разработки и понятная отчетность',
    description:
      'Вы сами выбираете уровень вовлеченности в разработку. Выстроим общение в удобных для вас каналах коммуникации и предоставим отчетность, к которой вы привыкли.',
  },
  {
    title: 'Долгосрочная поддержка и развитие проекта',
    description:
      'Выстраиваем работу на перспективу. Если беремся за проект, то рассчитываем не просто довести его до запуска, а поддерживать и развивать на протяжении всего жизненного цикла.',
  },
  {
    title: 'Работа на результат для бизнеса',
    description:
      'Не предлагаем и не разрабатываем лишний функционал. Мы не просто руки, а опытные специалисты, думающие о последствиях. Работаем так, будто уже в вашей команде, и стремимся к общему результату — росту бизнеса.',
  },
  {
    title: 'Масштабируемые IT-решения на актуальном стеке',
    description:
      'Мы в самой пучине технологий и регулярно изучаем новое в числе первых. Стремимся реализовывать проекты так, чтобы они дорабатывались и развивались, а не были конечным монолитом, с которым уже ничего нельзя поделать.',
  },
  {
    title: 'Продуманный UX и удобство для пользователя',
    description:
      'Мы всегда думаем о конечном пользователе. Кто он, чем занимается, к каким интерфейсам привык, а можно ли сделать сервис еще удобнее и сохранить пользовательский путь? Пожелания заказчика важны, но более приоритетно то, чтобы они действительно были полезны.',
  },
  {
    title: 'Тестирование гипотез на себе',
    description:
      'Находимся в постоянном поиске и каждый день выдвигаем гипотезы для улучшения продуктов и сервисов. Сначала отрабатываем их полностью на себе, а затем самые удачные из них предлагаем внедрить клиентам.',
  },
]

export const bgVideos = {
  video10: {
    poster: { desktop: '/images/video10.webp', mobile: '/images/video10-mob.webp' },
    sources: [
      { src: '/assets/videos/video10HEVC.mp4', type: 'video/mp4; codecs="hvc1.1.6.L123.B0"' },
      { src: '/assets/videos/video10H264.mp4', type: 'video/mp4; codecs="avc1.4D4029"' },
    ],
  },
  video6: {
    poster: { desktop: '/images/video6.webp', mobile: '/images/video6-mob.webp' },
    sources: [
      { src: '/assets/videos/video6HEVC.mp4', type: 'video/mp4; codecs="hvc1.1.6.L120.B0"' },
      { src: '/assets/videos/video6H264.mp4', type: 'video/mp4; codecs="avc1.640032"' },
    ],
  },
  video9: {
    poster: { desktop: '/images/video9.webp', mobile: '/images/video9-mob.webp' },
    sources: [
      { src: '/assets/videos/video9HEVC.mp4', type: 'video/mp4; codecs="hvc1.1.6.L120.B0"' },
      { src: '/assets/videos/video9H264.mp4', type: 'video/mp4; codecs="avc1.640032"' },
    ],
  },
}
