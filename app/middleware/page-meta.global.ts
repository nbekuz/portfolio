import type { PageMeta } from '~/composables/usePageMeta'
import exceptions from '~/content/meta.json'
import routes from '~/content/routes.json'

const known = new Set(['/', ...routes])
const DEFAULT_META: PageMeta = { header: 'dark', hero: 'Обсудить проект' }

export default defineNuxtRouteMiddleware((to) => {
  const path = to.path.endsWith('/') ? to.path : `${to.path}/`
  const meta = (exceptions as Record<string, PageMeta>)[known.has(path) ? path : '__404']
  usePageMeta().value = meta ?? DEFAULT_META
})
