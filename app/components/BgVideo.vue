<script setup lang="ts">
interface Source {
  src: string
  type: string
}

const props = withDefaults(
  defineProps<{
    poster: { desktop: string; mobile: string }
    sources: Source[]
    containerClass?: string
    priority?: boolean
  }>(),
  { containerClass: '', priority: false },
)

const BLUR =
  'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABwBACdASoUABYAPqVCmkmmI6KhN/qoAMAUiWQAnTNMQ0KsQC6j5sAeC6RQZAD+2QXFGgF08i0Kj8bb/uD5GpjApvu38b+/0qcrX6NzkIpoMMW7QsyI0UlhZeieUe2ACWDVd5vrPOAZh4wAAAA='

const root = ref<HTMLElement | null>(null)
const video = ref<HTMLVideoElement | null>(null)
const isNarrow = ref(true)
const source = ref<Source | null>(null)
const loaded = ref(false)
let visible = false
let observer: IntersectionObserver | undefined
let resizeTimer: ReturnType<typeof setTimeout> | undefined

const pickSource = () => {
  isNarrow.value = window.matchMedia('(max-width: 1279px)').matches
  if (isNarrow.value) {
    source.value = null
    loaded.value = false
    return
  }
  const probe = document.createElement('video')
  source.value = props.sources.find((s) => probe.canPlayType(s.type) !== '') ?? props.sources[props.sources.length - 1]!
}

const tryPlay = () => {
  if (visible && video.value && loaded.value) video.value.play().catch(() => {})
}

const onReady = () => {
  loaded.value = true
  tryPlay()
}

const onResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(pickSource, 300)
}

watch(source, async (s) => {
  if (!s) return
  await nextTick()
  video.value?.load()
})

onMounted(() => {
  pickSource()
  window.addEventListener('resize', onResize)
  observer = new IntersectionObserver(
    ([entry]) => {
      visible = !!entry?.isIntersecting
      if (visible) tryPlay()
      else video.value?.pause()
    },
    { rootMargin: '200px 0px' },
  )
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  clearTimeout(resizeTimer)
  observer?.disconnect()
})

const imgClass = computed(
  () =>
    `absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${!isNarrow.value && loaded.value ? 'opacity-0' : 'opacity-100'}`,
)
</script>

<template>
  <div ref="root" class="relative overflow-hidden" :class="containerClass">
    <div class="absolute inset-0 bg-[#0d1017] bg-cover bg-center" :style="{ backgroundImage: `url(${BLUR})` }" />
    <picture>
      <source media="(max-width: 1279px)" :srcset="poster.mobile" />
      <img
        :src="poster.desktop"
        alt=""
        aria-hidden="true"
        decoding="async"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined"
        :class="imgClass"
      />
    </picture>
    <video
      v-if="!isNarrow && source"
      ref="video"
      loop
      muted
      playsinline
      preload="metadata"
      class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @loadeddata="onReady"
      @canplay="onReady"
    >
      <source :src="source.src" :type="source.type" />
    </video>
  </div>
</template>
