<script setup lang="ts">
import { gsap, ScrollTrigger, refreshScroll } from '~/utils/gsap'
import { awards } from '~/data/site'

const first = awards.slice(0, 5)
const rest = awards.slice(5)

const body = ref<HTMLElement | null>(null)
const layer = ref<HTMLElement | null>(null)
const more = ref<HTMLElement | null>(null)
const v1 = ref<HTMLVideoElement | null>(null)
const v2 = ref<HTMLVideoElement | null>(null)
const activeRow = ref<number | null>(null)
const expanded = ref(false)

const visibleCount = computed(() => (expanded.value ? awards.length : first.length))
const rowClass =
  'awards_list grid xl:grid xl:grid-cols-[3fr_2fr_1fr] lg:grid lg:grid-cols-[3fr_2fr_1fr] md:flex md:flex-col sm:grid sm:grid-cols-[1fr_2fr] xs:flex xs:flex-col xl:py-6 xl:px-14 lg:py-5 lg:px-[42px] md:py-5 md:px-[38px] md:pl-[30%] sm:py-4 sm:px-6 xs:py-5 xs:px-4'
const videoClass =
  'award_video xl:left[20%] lg:left-[20%] md:left-[38px] xl:w-[300px] xl:h-[300px] lg:w-[220px] lg:h-[220px] md:w-[228px] md:h-[228px] sm:hidden xs:hidden md:flex lg:flex xl:flex'

let current: 'v1' | 'v2' = 'v1'
let playToken = 0
let lastActive: number | null = null
let ctx: gsap.Context | undefined
let resizeObs: ResizeObserver | undefined
let mq: MediaQueryList | undefined

const srcOf = (v: HTMLVideoElement) => v.getAttribute('src') || ''

const play = (v: HTMLVideoElement, src: string) => {
  const token = ++playToken
  const attempt = () => {
    if (token === playToken && srcOf(v) === src) v.play().catch(() => {})
  }
  v.addEventListener('canplay', attempt, { once: true })
  attempt()
}

const load = (v: HTMLVideoElement, src: string, autoplay: boolean) => {
  if (srcOf(v) !== src) {
    v.pause()
    v.src = src
    v.preload = autoplay ? 'auto' : 'metadata'
    v.load()
  } else v.preload = autoplay ? 'auto' : 'metadata'
  if (autoplay) play(v, src)
  else v.pause()
}

const showVideo = (src: string | null) => {
  const a = v1.value
  const b = v2.value
  if (!a || !b) return
  if (!src) {
    playToken++
    a.pause()
    b.pause()
    gsap.to([a, b], { opacity: 0, duration: 0.3, ease: 'power2.out' })
    return
  }
  const cur = current === 'v1' ? a : b
  if (srcOf(cur) === src) {
    if (cur.paused) play(cur, src)
    gsap.to(cur, { opacity: 1, duration: 0.3, ease: 'power2.out' })
  } else {
    const next = current === 'v1' ? b : a
    load(next, src, true)
    gsap.to(cur, { opacity: 0, duration: 0.3, ease: 'power2.out' })
    gsap.to(next, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    current = current === 'v1' ? 'v2' : 'v1'
  }
  const idle = current === 'v1' ? b : a
  if (activeRow.value !== null) {
    const upcoming = awards.slice(activeRow.value + 1).find((x) => x.video !== src)
    if (upcoming) load(idle, upcoming.video, false)
  }
}

const update = () => {
  const container = body.value
  const l = layer.value
  if (!container || !l) return
  const mid = window.innerHeight / 2
  const box = container.getBoundingClientRect()
  if (box.bottom < mid || box.top > mid) {
    if (lastActive !== null) {
      lastActive = null
      activeRow.value = null
      showVideo(null)
      gsap.to(l, { opacity: 0, duration: 0.6, ease: 'power2.out', pointerEvents: 'none' })
    }
    return
  }
  let best = -1
  let dist = Infinity
  container.querySelectorAll<HTMLElement>('.awards_list').forEach((row, i) => {
    if (i >= visibleCount.value) return
    const r = row.getBoundingClientRect()
    if (r.height < 1) return
    const d = Math.abs(r.top + r.height / 2 - mid)
    if (d < dist) {
      dist = d
      best = i
    }
  })
  if (best >= 0 && lastActive !== best) {
    lastActive = best
    activeRow.value = best
    showVideo(awards[best]!.video)
    gsap.to(l, { opacity: 1, duration: 0.6, ease: 'power2.out' })
  }
}

const setup = () => {
  ctx?.revert()
  ctx = undefined
  window.removeEventListener('scroll', update)
  if (!mq?.matches || !body.value || !layer.value) return
  ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: body.value,
      start: 'top center',
      end: 'bottom center',
      pin: layer.value,
      pinSpacing: false,
      anticipatePin: 1,
      scrub: true,
      onUpdate: update,
    })
  }, body.value)
  update()
  window.addEventListener('scroll', update, { passive: true })
  ScrollTrigger.refresh()
}

const expand = () => {
  expanded.value = true
  const el = more.value
  if (!el) return
  const from = el.getBoundingClientRect().height
  gsap.set(el, { height: 'auto', overflow: 'hidden' })
  const to = el.scrollHeight
  gsap.set(el, { height: from })
  gsap.to(el, {
    height: to,
    duration: 0.55,
    ease: 'power2.out',
    overwrite: true,
    onComplete: () => {
      gsap.set(el, { height: 'auto', overflow: 'visible' })
      refreshScroll()
    },
  })
  setTimeout(refreshScroll, 280)
}

onMounted(() => {
  if (more.value) gsap.set(more.value, { height: 0, overflow: 'hidden' })
  mq = window.matchMedia('(min-width: 1024px)')
  mq.addEventListener('change', setup)
  resizeObs = new ResizeObserver(() => {
    if (layer.value && body.value) layer.value.style.height = `${body.value.clientHeight}px`
  })
  if (body.value) resizeObs.observe(body.value)
  setup()
})

onBeforeUnmount(() => {
  mq?.removeEventListener('change', setup)
  window.removeEventListener('scroll', update)
  resizeObs?.disconnect()
  ctx?.revert()
})
</script>

<template>
  <div class="awards_list_main relative flex flex-col gap-9 xl:gap-12 lg:gap-10 md:gap-10 sm:gap-9 xs:gap-9 p-0">
    <div class="awards_header">
      <div class="awards_title gap-2 pl-[16px] xs:pl-[16px] sm:pl-[24px] md:pl-[38px] lg:pl-[42px] xl:pl-14">
        <h2
          class="awards_title_text tracking-[-1.2px] text-[28px] xs:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[52px] xl:text-[70px] xs:tracking-[-1.2px] sm:tracking-[-1px] md:tracking-[-1.81px] lg:tracking-[-2.1px] xl:tracking-[-2.8px]"
        >
          Награды нашей IT-компании
        </h2>
        <span
          class="title_count text-[15px] xs:text-[15px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[20px] tracking-[0px] xs:tracking-[0px] sm:tracking-[0px] md:tracking-[0px] lg:tracking-[0px] xl:tracking-[-0.2px]"
          >{{ awards.length }}</span
        >
      </div>
    </div>
    <div class="flex flex-col gap-6 xl:gap-8">
      <div ref="body" class="awards_body overflow-hidden">
        <div
          ref="layer"
          class="award_video_layer"
          style="position: absolute; top: 0; left: 0; width: 100vw; height: 130vh; pointer-events: none; z-index: 1000; opacity: 0; transition: opacity 0.3s ease"
        >
          <video
            ref="v1"
            muted
            loop
            playsinline
            preload="none"
            :class="videoClass"
            style="position: absolute; top: -55px; object-fit: cover; opacity: 0; pointer-events: none"
          />
          <video
            ref="v2"
            muted
            loop
            playsinline
            preload="none"
            :class="videoClass"
            style="position: absolute; top: -55px; object-fit: cover; opacity: 0; pointer-events: none"
          />
        </div>

        <template v-for="(award, i) in first" :key="`${award.title}-${award.year}`">
          <div class="awards_line" />
          <div :class="[rowClass, { 'active bg-[#A1A7B31A]': activeRow === i }]" :style="{ transitionDelay: `${40 * Math.max(0, i - 5)}ms` }">
            <div
              class="award_text award_place xl:text-[20px] xl:font-[400] lg:text-[16px] lg:font-[400] text-[20px] font-[400] lg:text-[16px] md:text-[24px] md:font-[525] sm:text-[20px] md:font-[525] sm:text-xl xs:text-[20px] xs:font-[525]"
            >
              {{ award.place }}
            </div>
            <div class="flex flex-col">
              <div class="award_text award_title xl:text-[20px] xl:font-[400] lg:text-[16px] lg:font-[400] md:text-[16px] md:font-[400] sm:text-[16px] xs:text-[15px]">
                {{ award.title }}
              </div>
              <div class="award_text mobile_rating hidden xl:hidden lg:hidden sm:flex xs:flex sm:text-[#8A8F99] xs:text-[#8A8F99] sm:text-[16px] xs:text-[15px]">
                {{ award.rating }}
              </div>
            </div>
            <div
              class="award_rating desktop_rating xl:flex lg:flex md:hidden sm:hidden xs:hidden flex items-center xl:justify-end lg:justify-end md:justify-start sm:justify-start xs:justify-start xl:text-[20px] xl:font-[400] lg:text-[16px] lg:font-[400] md:text-[16px] md:font-[400] sm:hidden xs:hidden"
            >
              <div class="award_text">{{ award.rating }}</div>
            </div>
          </div>
        </template>

        <div ref="more" class="awards_more" style="height: 0" :class="{ 'is-open': expanded }" :aria-hidden="!expanded" :inert="!expanded || undefined">
          <template v-for="(award, j) in rest" :key="`${award.title}-${award.year}`">
            <div class="awards_line" />
            <div :class="[rowClass, { 'active bg-[#A1A7B31A]': activeRow === (j + 5) }]" :style="{ transitionDelay: `${40 * Math.max(0, (j + 5) - 5)}ms` }">
              <div
                class="award_text award_place xl:text-[20px] xl:font-[400] lg:text-[16px] lg:font-[400] text-[20px] font-[400] lg:text-[16px] md:text-[24px] md:font-[525] sm:text-[20px] md:font-[525] sm:text-xl xs:text-[20px] xs:font-[525]"
              >
                {{ award.place }}
              </div>
              <div class="flex flex-col">
                <div class="award_text award_title xl:text-[20px] xl:font-[400] lg:text-[16px] lg:font-[400] md:text-[16px] md:font-[400] sm:text-[16px] xs:text-[15px]">
                  {{ award.title }}
                </div>
                <div class="award_text mobile_rating hidden xl:hidden lg:hidden sm:flex xs:flex sm:text-[#8A8F99] xs:text-[#8A8F99] sm:text-[16px] xs:text-[15px]">
                  {{ award.rating }}
                </div>
              </div>
              <div
                class="award_rating desktop_rating xl:flex lg:flex md:hidden sm:hidden xs:hidden flex items-center xl:justify-end lg:justify-end md:justify-start sm:justify-start xs:justify-start xl:text-[20px] xl:font-[400] lg:text-[16px] lg:font-[400] md:text-[16px] md:font-[400] sm:hidden xs:hidden"
              >
                <div class="award_text">{{ award.rating }}</div>
              </div>
            </div>
          </template>
        </div>
        <div class="awards_line" />
      </div>

      <div v-if="!expanded && rest.length" class="awards_more_toggle relative z-[1100] m-auto flex items-center justify-center">
        <button
          type="button"
          class="see_all_cases black_overlay_btn relative z-[1100] h-[54px] text-[15px] xs:h-[54px] xs:text-[15px] sm:h-[56px] sm:text-[16px] md:h-[56px] md:text-[16px] lg:h-[56px] lg:text-[16px] xl:h-[60px] xl:text-[20px] py-4 px-7"
          :aria-expanded="expanded"
          @click="expand"
        >
          <span>Показать ещё</span>
        </button>
      </div>
    </div>
  </div>
</template>
