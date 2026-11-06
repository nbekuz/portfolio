<script setup lang="ts">
import { gsap, SplitText, prefersReducedMotion } from '~/utils/gsap'

const active = ref(true)
const progress = ref(0)
const panel = ref<HTMLElement | null>(null)
const black = ref<HTMLElement | null>(null)
const texts = ref<HTMLElement | null>(null)

let loop: gsap.core.Timeline | undefined
let interval: ReturnType<typeof setInterval> | undefined
let maxTimer: ReturnType<typeof setTimeout> | undefined
let loaded = false

const finish = () => {
  if (!panel.value || !black.value) return
  const tl = gsap.timeline()
  tl.to(black.value, { y: '0%', duration: 0.1, ease: 'none' })
  tl.to(panel.value, { y: '-100%', duration: 1.8, ease: 'power4.inOut' }, '+=0')
  tl.to(black.value, { y: '-100%', duration: 1.8, ease: 'power4.inOut' }, '-=1.7')
  tl.call(() => {
    document.body.style.overflow = ''
    loop?.kill()
    active.value = false
  })
}

const onLoad = () => (loaded = true)

onMounted(() => {
  const skip =
    prefersReducedMotion() || window.matchMedia('(max-width: 767px)').matches || !!localStorage.getItem('hasVisited')
  if (skip) {
    active.value = false
    return
  }
  localStorage.setItem('hasVisited', 'true')
  document.body.style.overflow = 'hidden'

  gsap.set(black.value, { y: '100%' })
  const items = texts.value?.querySelectorAll<HTMLElement>('.text') ?? []
  gsap.set(items, { opacity: 0 })
  const slots = [
    { start: 0, end: 1.5 },
    { start: 1.5, end: 3 },
    { start: 3, end: 4.5 },
    { start: 4.5, end: 6 },
  ]
  loop = gsap.timeline({ repeat: -1 })
  items.forEach((item, i) => {
    const chars = new SplitText(item, { type: 'chars,words,lines', linesClass: 'split-line' }).chars
    const slot = slots[i]!
    const len = slot.end - slot.start
    const inDur = 0.4 * len
    loop!.set(item, { opacity: 1 }, slot.start)
    loop!.from(chars, { y: 100, opacity: 0, duration: inDur, ease: 'power4.out', stagger: 0.02 }, slot.start)
    loop!.to(chars, { y: -100, opacity: 0, duration: 0.4 * len, ease: 'power4.in', stagger: 0.01 }, slot.start + inDur + 0.2 * len)
    loop!.set(item, { opacity: 0 }, slot.end)
  })

  if (document.readyState === 'complete') onLoad()
  else window.addEventListener('load', onLoad, { once: true })

  const startedAt = Date.now()
  interval = setInterval(() => {
    const elapsed = Date.now() - startedAt
    const cap = loaded ? 100 : 90
    const goal = Math.min((elapsed / 4000) * cap, cap)
    const prev = progress.value
    let next = prev + (goal - prev) * (loaded && elapsed >= 4000 ? 0.3 : 0.16) + 0.25 * Number(!loaded && elapsed < 3000)
    next = Math.max(next, prev)
    if (elapsed > 200 && next < 5) next = 5
    if (loaded && elapsed >= 4000 && cap === 100 && next > 99.5) next = 100
    progress.value = next
    if (next >= 100) {
      clearInterval(interval)
      clearTimeout(maxTimer)
      finish()
    }
  }, 50)

  maxTimer = setTimeout(() => {
    clearInterval(interval)
    progress.value = 100
    finish()
  }, 12000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  clearTimeout(maxTimer)
  loop?.kill()
  window.removeEventListener('load', onLoad)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="active" class="relative preloader-root">
    <div ref="panel" class="preloader">
      <div class="absolute sm:top-10 top-4">
        <IconsLogoIcon class="text-[#202024] w-[85px] h-[30px]" />
      </div>
      <div ref="texts" class="preloader_texts">
        <div class="text">Мы</div>
        <div class="text">Работаем</div>
        <div class="text">Иначе</div>
        <div class="text">Else Digital</div>
      </div>
      <div class="preloader_loading_time absolute sm:bottom-10 bottom-4">
        <div class="preloader_loading_time_text">{{ Math.round(progress) }}%</div>
      </div>
      <div class="preloader_progress_container">
        <div class="preloader_progress_bar" :style="{ width: `${progress}%` }" />
      </div>
    </div>
    <div ref="black" class="preloader_black_section" />
  </div>
</template>
