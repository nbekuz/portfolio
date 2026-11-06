<script setup lang="ts">
import { gsap, ScrollTrigger, SplitText, isMobileDevice } from '~/utils/gsap'
import { reviews } from '~/data/site'

const text = 'Клиенты нас ценят за индивидуальный подход и цифровые решения, которые усиливают и развивают их бизнес'

const pinEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const cardsEl = ref<HTMLElement | null>(null)
const lite = ref(false)

let ctx: gsap.Context | undefined
let split: SplitText | undefined
let resizeTimer: ReturnType<typeof setTimeout> | undefined
let disposed = false

const gradient = {
  backgroundImage: 'linear-gradient(to right, #202024 50%, #A1A7B380 50%)',
  backgroundSize: '200% 100%',
  backgroundPositionX: '100%',
  color: 'transparent',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
}

const cleanup = () => {
  ctx?.revert()
  ctx = undefined
  split?.revert()
  split = undefined
}

const build = () => {
  const pin = pinEl.value
  const title = titleEl.value
  const cards = cardsEl.value
  if (!pin || !title || !cards || disposed) return
  cleanup()
  if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => !disposed && build())
    return
  }
  split = new SplitText(title, { type: 'lines' })
  const lines = split.lines
  if (!lines.length) return
  if (lite.value) {
    ctx = gsap.context(() => {
      lines.forEach((l) => gsap.set(l, gradient))
      const tl = gsap.timeline({ scrollTrigger: { trigger: pin, start: 'top 75%', toggleActions: 'play none none none' } })
      lines.forEach((l, i) => tl.to(l, { backgroundPositionX: 0, ease: 'power2.out', duration: 0.8 }, 0.1 * i))
    })
    return
  }
  ctx = gsap.context(() => {
    gsap.set(cards, { y: window.innerHeight })
    lines.forEach((l) => gsap.set(l, gradient))
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: 'top 40%',
        end: `+=${window.innerHeight * 6 * lines.length}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => gsap.set(cards, { y: window.innerHeight }),
      },
    })
    lines.forEach((l, i) => tl.to(l, { backgroundPositionX: 0, ease: 'none', duration: 5 }, 0.5 * i))
    tl.to({}, { duration: 11 })
    tl.to(cards, { y: 0, ease: 'none', duration: 49 }, '>')
  })
}

const onResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    const nextLite = isMobileDevice()
    cleanup()
    if (nextLite !== lite.value) lite.value = nextLite
    ScrollTrigger.refresh()
    requestAnimationFrame(() => nextTick(build))
  }, 250)
}

onMounted(() => {
  lite.value = isMobileDevice()
  nextTick(build)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  disposed = true
  clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  cleanup()
})

const positionClass = (position: string, i: number) => [
  position === 'left' && 'xl:justify-start lg:justify-start',
  position === 'center' && 'xl:justify-center lg:justify-center',
  position === 'right' && 'xl:justify-end lg:justify-end',
  i % 2 === 0 ? 'sm:justify-start md:justify-start' : 'sm:justify-end md:justify-end',
]
</script>

<template>
  <div class="relative w-full flex flex-col">
    <div
      class="flex flex-col items-center justify-center xs:items-end xs:justify-start sm:items-center sm:justify-center md:items-center md:justify-center lg:items-center lg:justify-center xl:items-center xl:justify-center"
      :class="lite ? 'h-auto py-0 xs:m-25' : 'xl:h-[100vh] lg:h-[100vh] md:h-[100vh] sm:h-[100vh] xs:h-auto xs:mt-25'"
    >
      <div ref="pinEl" class="flex flex-col items-start sm:items-center w-full">
        <div class="services_header_anchor flex items-center justify-center p-[1rem] sm:p-[1.5rem] md:px-9 lg:p-[2.625rem] xl:p-[3.75rem]">
          <IconsAnchorSquare class="services_header_anchor_square" aria-hidden="true" />
          <h2
            class="services_header_title xl:text-[20px] lg:text-[16px] md:text-[16px] sm:text-[16px] xs:text-[15px] xl:tracking-[-0.2px] lg:tracking-[0] md:tracking-[0] sm:tracking-[0] xs:tracking-[0] xl:leading-[140%] lg:leading-[150%] md:leading-[150%] sm:leading-[150%] xs:leading-[145%]"
          >
            Отзывы об Else Digital
          </h2>
        </div>
        <p
          ref="titleEl"
          class="awards_scroll_title text-center xs:text-start px-4 text-[28px] tracking-[-1.2px] max-w-[322px] sm:text-[36px] sm:tracking-[-1px] sm:max-w-[720px] md:text-[42px] md:tracking-[-1.81px] md:max-w-[820px] lg:text-[52px] lg:tracking-[-2.1px] lg:max-w-[990px] xl:text-[70px] xl:tracking-[-2.8px] xl:max-w-[1290px] xs:!w-full"
        >
          {{ text }}
        </p>
      </div>
    </div>
    <div
      ref="cardsEl"
      class="cards-wrapper py-9 px-6 pb-0 xs:px-4 sm:p-[36px_24px] md:p-[40px_38px] lg:p-[40px_42px] xl:p-[60px]"
      :class="
        lite
          ? 'xl:min-h-0 lg:min-h-0 md:min-h-0 sm:min-h-0 xl:mt-0 lg:mt-0 md:mt-0'
          : 'xl:min-h-[360dvh] xl:mt-[0] lg:mt-[100dvh] md:mt-[100dvh] lg:min-h-[290dvh] md:min-h-[265dvh] sm:min-h-[260dvh]'
      "
    >
      <div class="award_card_list flex flex-col award_card_list gap-12 sm:gap-[12px] md:gap-[12px] lg:gap-[28px] xl:gap-32 xs:gap-3">
        <div v-for="(review, i) in reviews" :key="review.author" class="flex award_card_position" :class="positionClass(review.position, i)">
          <div
            class="award_card gap-10 padding-10 w-full max-w-none p-[20px] sm:w-[354px] sm:max-w-[354px] sm:p-[24px] sm:gap-[24px] md:w-[468px] md:max-w-[468px] md:p-[28px] md:gap-[40px] lg:w-[490px] lg:max-w-[490px] lg:p-[28px] lg:gap-[40px] xl:w-[650px] xl:max-w-[650px] xl:p-[40px] xl:gap-[40px]"
          >
            <p
              class="award_card_title text-[15px] leading-[145%] tracking-[0] sm:text-[16px] sm:leading-[150%] sm:tracking-[0] md:text-[18px] md:leading-[135%] md:tracking-[-0.3px] lg:text-[18px] lg:leading-[135%] lg:tracking-[-0.3px] xl:text-[24px] xl:leading-[135%] xl:tracking-[-0.8px]"
            >
              {{ review.text }}
            </p>
            <div class="flex items-center award_card_text_row gap-[12px] sm:gap-[12px] md:gap-[16px] lg:gap-[16px] xl:gap-[20px] award_card_text_row">
              <img
                :alt="review.author"
                loading="lazy"
                width="60"
                height="60"
                decoding="async"
                class="award_card_image rounded-3 w-[44px] h-[44px] rounded-[8px] sm:w-[56px] sm:h-[56px] sm:rounded-[12px] md:w-[56px] md:h-[56px] md:rounded-[12px] lg:w-[56px] lg:h-[56px] lg:rounded-[12px] xl:w-[60px] xl:h-[60px] xl:rounded-[12px]"
                :src="review.image"
              />
              <div>
                <p
                  class="award_card_author text-[20px] xs:text-[15px] tracking-[0] sm:text-[16px] sm:tracking-[0] md:text-[16px] md:tracking-[0] lg:text-[18px] lg:tracking-[0] xl:text-[20px] xl:tracking-[-0.2px]"
                >
                  {{ review.author }}
                </p>
                <p class="award_card_company text-[20px] xs:text-[15px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[20px]">
                  {{ review.company }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
