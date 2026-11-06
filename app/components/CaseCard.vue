<script setup lang="ts">
import { gsap } from '~/utils/gsap'
import { ext } from '~/data/site'
import { srcset, withSuffix } from '~/utils/img'

const props = defineProps<{
  item: { id: string; title: string; description: string; tags: string[]; video: string; image: string }
}>()

const media = ref<HTMLElement | null>(null)
const video = ref<HTMLVideoElement | null>(null)
const poster = ref<HTMLElement | null>(null)

let mobile = false
let inView = false
let playing = false
let mq: MediaQueryList | undefined
let observer: IntersectionObserver | undefined

const updateMq = () => {
  mobile = !!mq?.matches
  const v = video.value
  if (!v) return
  const src = mobile ? withSuffix(props.item.video, '-720') : props.item.video
  if (v.getAttribute('src') !== src) {
    v.preload = mobile ? 'none' : 'metadata'
    v.src = src
  }
}

const show = (whenReady = false) => {
  const v = video.value
  const p = poster.value
  if (!v || !p || playing) return
  if (whenReady && v.readyState < 2) return
  playing = true
  gsap.killTweensOf([v, p])
  gsap.set(v, { opacity: 0, visibility: 'visible' })
  gsap.set(p, { opacity: 1, visibility: 'visible' })
  v.currentTime = 0
  v.play().catch(() => {
    playing = false
    gsap.set(v, { opacity: 0, visibility: 'hidden' })
    gsap.set(p, { opacity: 1, visibility: 'visible' })
  })
  if (!mobile) {
    gsap.to(v, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => void gsap.to(p, { opacity: 0, duration: 0.2, ease: 'power2.inOut' }),
    })
  }
}

const hide = () => {
  const v = video.value
  const p = poster.value
  if (!v || !p) return
  playing = false
  gsap.killTweensOf([v, p])
  if (mobile) {
    gsap.set(p, { opacity: 1, visibility: 'visible' })
    gsap.set(v, { opacity: 0, visibility: 'hidden' })
    v.pause()
    return
  }
  gsap.set(p, { visibility: 'visible' })
  gsap.to(p, {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.inOut',
    onComplete: () =>
      void gsap.to(v, { opacity: 0, duration: 0.2, ease: 'power2.inOut', onComplete: () => v.pause() }),
  })
}

const onPlaying = () => {
  const v = video.value
  const p = poster.value
  if (!v || !p || !playing || !mobile) return
  gsap.killTweensOf([v, p])
  gsap.set(v, { visibility: 'visible', opacity: 1 })
  gsap.set(p, { opacity: 0, visibility: 'hidden' })
}

const onLoadedData = () => {
  if (mobile && inView) show(true)
}

onMounted(() => {
  mq = window.matchMedia('(max-width: 767px)')
  updateMq()
  mq.addEventListener('change', updateMq)
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!mobile) return
      inView = !!entry?.isIntersecting
      if (inView) {
        if (video.value && video.value.readyState < 2) video.value.load()
        show(true)
      } else hide()
    },
    { threshold: 0.6 },
  )
  if (media.value) observer.observe(media.value)
})

onBeforeUnmount(() => {
  mq?.removeEventListener('change', updateMq)
  observer?.disconnect()
})
</script>

<template>
  <a
    class="case case_card flex flex-col gap-[24px] lg:gap-[20px] md:gap-[20px] sm:gap-[16px] xs:gap-[16px] transform transition-all"
    :href="ext(`/cases/${props.item.id}/`)"
  >
    <div
      ref="media"
      class="relative w-full h-[380px] sm:h-[354px] md:h-[420px] lg:h-[630px] xl:h-[700px] 2xl:h-[800px] rounded-[1rem] overflow-hidden"
      @mouseenter="!mobile && show()"
      @mouseleave="!mobile && hide()"
    >
      <div ref="poster" class="absolute inset-0 z-[2]">
        <img
          :alt="`${item.title} poster`"
          loading="lazy"
          decoding="async"
          class="object-cover fill-img"
          :src="item.image"
          :srcset="srcset(item.image, [800, 1280], 1920)"
          sizes="(max-width: 767px) 100vw, 50vw"
        />
      </div>
      <video
        ref="video"
        muted
        loop
        playsinline
        preload="none"
        class="w-full object-cover bg-[var(--award-card-bg,#f6f7f8)] absolute inset-0 z-[1] h-full opacity-0"
        @loadeddata="onLoadedData"
        @playing="onPlaying"
      />
    </div>
    <div class="flex flex-col gap-[1rem] xs:gap-[8px] sm:gap-[12px] md:gap-[12px]">
      <div class="flex flex-col gap-[4px]">
        <div class="overflow-hidden">
          <h3
            class="case_title text-[20px] tracking-[-0.6px] sm:text-[20px] sm:tracking-[-0.6px] md:text-[24px] md:tracking-[-0.8px] lg:text-[28px] lg:tracking-[-1px] xl:text-[36px] xl:tracking-[-1.44px] text-foreground-default"
          >
            {{ item.title }}
          </h3>
        </div>
        <div class="overflow-hidden">
          <p
            class="case_description font-[450] text-[15px] tracking-[0] leading-[145%] sm:text-[12px] sm:leading-[150%] md:text-[16px] md:leading-[150%] lg:text-[16px] lg:leading-[150%] xl:text-[20px] xl:tracking-[-0.2px] xl:leading-[140%] text-background-surface_1"
          >
            {{ item.description }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-[4px] sm:gap-[4px] md:gap-[4px] lg:gap-[4px] xl:gap-[6px]">
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="case_tag rounded-[16px] xs:rounded-[8px] sm:rounded-[12px] md:rounded-[16px] lg:rounded-[16px] text-[13px] tracking-[0] py-[4px] px-[8px] sm:text-[16px] sm:py-[8px] sm:px-[12px] md:text-[16px] md:py-[12px] md:px-[16px] lg:text-[16px] lg:py-[12px] lg:px-[16px] xl:text-[20px] xl:tracking-[-0.2px] xl:py-[12px] xl:px-[16px] text-foreground-default transition-all duration-300"
        >
          <span>{{ tag }}</span>
        </span>
      </div>
    </div>
  </a>
</template>
