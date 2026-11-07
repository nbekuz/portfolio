<script setup lang="ts">
import type { PageMeta } from '~/composables/usePageMeta'
import { enhancePage } from '~/utils/enhance'

interface PageData extends PageMeta {
  path: string
  title: string
  description: string
  html: string
}

const loaders = import.meta.glob<PageData>('../content/pages/*.json', { import: 'default' })

const route = useRoute()
const nuxtApp = useNuxtApp()
const slug = route.params.slug
const key = (Array.isArray(slug) ? slug : [slug]).filter(Boolean).join('__')
const loader = loaders[`../content/pages/${key}.json`]
const notFound = !loader

if (notFound && import.meta.server) useRequestEvent()!.node.res.statusCode = 404

const meta = useState<Omit<PageData, 'html'> | null>(`page:${key || '__404'}`, () => null)
const html = ref('')

// During hydration the prerendered markup is reused, so the content chunk is only fetched on client-side navigation.
const prerendered = import.meta.client && nuxtApp.isHydrating ? document.querySelector('[data-page-content]') : null
if (prerendered && meta.value) {
  html.value = prerendered.innerHTML
} else {
  const { html: content, ...rest } = await (loader ?? loaders['../content/pages/__404.json']!)()
  meta.value = rest
  html.value = content
}

useHead({
  title: () => meta.value?.title,
  meta: [{ name: 'description', content: () => meta.value?.description }],
})

const root = ref<HTMLElement | null>(null)
let cleanup: (() => void) | undefined

onMounted(() => {
  if (root.value) cleanup = enhancePage(root.value)
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="root" data-page-content v-html="html" />
</template>
