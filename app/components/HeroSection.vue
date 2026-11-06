<script setup lang="ts">
import { gsap, isMobileWidth, prefersReducedMotion } from '~/utils/gsap'
import { bgVideos } from '~/data/site'

const root = ref<HTMLElement | null>(null)
const ready = ref(false)
let ctx: gsap.Context | undefined

onMounted(() => {
  ready.value = true
  ctx = gsap.context(() => {
    root.value!.querySelectorAll<HTMLElement>('.line').forEach((l) => (l.style.overflow = 'hidden'))
    const spans = root.value!.querySelectorAll('.line span')
    if (spans.length >= 3 && !isMobileWidth() && !prefersReducedMotion()) {
      gsap.set(spans, { y: 86, opacity: 0 })
      gsap.to(spans, { y: 0, opacity: 1, duration: 1.4, stagger: 0.05, ease: 'power2.out', delay: 1 })
    }
  }, root.value!)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="hero">
    <div class="hero__background">
      <BgVideo :poster="bgVideos.video10.poster" :sources="bgVideos.video10.sources" container-class="hero__bg-image" priority />
    </div>
    <div class="hero__content p-[1rem] sm:p-[1.5rem] lg:p-[2.625rem] xl:p-[3.75rem]" :class="{ 'hero__content--pending': !ready }">
      <h1
        class="hero__title mt-[96px] sm:mt-auto text-[28px] tracking-[-1.2px] sm:text-[50px] sm:tracking-[-1.6px] md:text-[52px] md:tracking-[-1.8px] lg:text-[60px] lg:tracking-[-2.4px] xl:text-[80px] xl:tracking-[-3.2px]"
      >
        <span class="line block"><span>Разработка сложных IT-продуктов</span></span>
        <span class="line block"><span>веб-сервисов</span></span>
        <span class="line block"><span>и мобильных приложений </span></span>
      </h1>
    </div>
  </section>
</template>
