<script setup lang="ts">
import { gsap, ScrollTrigger, isMobileDevice } from '~/utils/gsap'
import { advantages, bgVideos } from '~/data/site'

const lite = ref(false)
const openIndex = ref<number | null>(null)

const statsEl = ref<HTMLElement | null>(null)
const bgEl = ref<HTMLElement | null>(null)
const topEl = ref<HTMLElement | null>(null)
const listEl = ref<HTMLElement | null>(null)

let ctx: gsap.Context | undefined
let resizeTimer: ReturnType<typeof setTimeout> | undefined

const toggle = (i: number) => (openIndex.value = openIndex.value === i ? null : i)

const updateBgHeight = () => {
  if (bgEl.value && statsEl.value) bgEl.value.style.height = `${statsEl.value.scrollHeight}px`
}

const build = () => {
  ctx?.revert()
  ctx = undefined
  const stats = statsEl.value
  const bg = bgEl.value
  if (!stats || !bg) return
  if (lite.value) {
    bg.style.height = ''
    return
  }
  const ios = /iPhone|iPod/i.test(navigator.userAgent)
  ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: stats,
      start: 'top top',
      end: 'bottom top',
      pin: bg,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      ...(ios ? { pinType: 'fixed' as const } : {}),
      onRefresh: updateBgHeight,
    })
    const top = topEl.value
    const textSpans = [
      ...(top?.querySelectorAll('.company_stats_text .line span') ?? []),
      ...(top?.querySelectorAll('.work_description .line span') ?? []),
    ]
    const items = Array.from(listEl.value?.querySelectorAll('.work_list_item') ?? [])
    const container = listEl.value?.querySelector('.work_list_container')
    if (!container) return
    const hidden = { opacity: 0, immediateRender: false, willChange: 'transform, opacity' }
    if (textSpans.length) gsap.set(textSpans, { y: 60, ...hidden })
    if (items.length) gsap.set(items, { y: 80, ...hidden })
    gsap.set(container, { y: 50, ...hidden })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stats,
        start: 'top center',
        scrub: ios ? 0.6 : 1.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        onRefresh: updateBgHeight,
      },
    })
    if (textSpans.length) tl.to(textSpans, { y: 0, opacity: 1, stagger: 0.1, duration: 4, ease: 'power2.out', delay: 0.5 })
    tl.to(container, { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 12.8)
    if (items.length) tl.to(items, { y: 0, opacity: 1, stagger: 0.15, duration: 4, ease: 'power2.out' }, 13.6)
    tl.to(container, { y: 0, duration: 32, ease: 'power2.inOut' }, 13.6)
    updateBgHeight()
  }, stats)
}

const onResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    const next = isMobileDevice()
    if (next !== lite.value) lite.value = next
    ctx?.revert()
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
  clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  ctx?.revert()
})
</script>

<template>
  <div class="relative xl:mt-[160px] lg:mt-[160px] md:mt-[160px] sm:mt-[160px] xs:mt-[54px]" :class="{ 'overflow-hidden': lite }">
    <div ref="bgEl" :class="lite ? 'work_bg work_bg_stretch' : 'absolute inset-0 bottom-0 right-0 left-0 w-full work_bg'">
      <BgVideo
        :poster="bgVideos.video9.poster"
        :sources="bgVideos.video9.sources"
        :container-class="lite ? 'absolute inset-0 w-full min-h-full h-full' : 'absolute top-0 left-0 bottom-0 right-0 w-full h-screen'"
      />
    </div>
    <div ref="statsEl" class="work_stats pb-[100px] xs:pb-[100px] sm:pb-[100px] md:pb-30 lg:pb-30 xl:pb-[160px]">
      <div class="p-4 sm:p-[36px_24px] md:p-[40px_38px] lg:p-[40px_42px] xl:p-[60px] xl:pb-0 flex flex-col xl:gap-15">
        <div ref="topEl" class="xl:h-[1000px] lg:h-[900px] md:h-[768px] sm:h-[768px] xs:min-h-[800px] flex items-center justify-center">
          <div class="xs:hidden sm:flex md:flex lg:flex xl:flex items-center justify-center flex-col gap-4">
            <div
              class="company_stats_text text-[28px] leading-[30.8px] tracking-[-1.2px] sm:text-[36px] sm:leading-[37.8px] sm:tracking-[-1px] md:text-[42px] md:leading-[42px] md:tracking-[-1.81px] lg:text-[52px] lg:leading-[52px] lg:tracking-[-2.1px] xl:text-[70px] xl:leading-[70px] xl:tracking-[-2.8px]"
            >
              <div class="line h-[auto] sm:h-[auto] md:h-[auto] lg:h-[auto] xl:h-[70px]"><span>Предпочитаем работать по T&amp;M, </span></div>
              <div class="line h-[auto] sm:h-[auto] md:h-[auto] lg:h-[auto] xl:h-[70px]"><span>потому что так выгоднее всем</span></div>
            </div>
            <div
              class="work_description space-y-2 text-[20px] xl:text-[20px] leading-[140%] lg:text-[16px] lg:leading-[150%] md:text-[16px] md:leading-[150%] sm:text-[16px] sm:leading-[150%] xs:text-[15px] xs:leading-[145%]"
            >
              <div class="line h-[auto] m-0"><span>Работаем по фикс-цене только при подробном ТЗ или при</span></div>
              <div class="line h-[auto] m-0"><span>стандартных задачах. В остальных случаях — по Time &amp; Material,</span></div>
              <div class="line h-[auto] m-0"><span>оцениваем стоимость заранее для планирования бюджета.</span></div>
            </div>
          </div>
          <div class="xs:flex sm:hidden md:hidden lg:hidden xl:hidden items-center justify-center flex-col gap-4">
            <div class="company_stats_text text-center text-[28px] leading-[30.8px] tracking-[-1.2px]">
              <div class="line"><span>Предпочитаем работать по T&amp;M, потому что так выгоднее всем </span></div>
            </div>
            <div class="work_description !gap-0 text-[15px] sm:text-[16px]">
              <div class="line !m-0">
                <span
                  >Работаем по фикс-цене только при подробном ТЗ или при стандартных задачах. В остальных случаях — по Time &amp; Material, оцениваем стоимость заранее для
                  планирования бюджета.</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="second-text-section flex flex-col items-start justify-start">
          <div class="services_header_anchor flex items-center pb-[1rem] sm:pb-[1.5rem] lg:pb-[2.625rem]">
            <IconsAnchorSquare class="services_header_anchor_square" aria-hidden="true" />
            <h2 class="services_header_title !text-[#ffffff] xl:text-[20px] lg:text-[16px] md:text-[16px] sm:text-[16px] xs:text-[15px]">Преимущества нашей студии IT-разработки</h2>
          </div>
          <div
            class="font-main-medium font-[525] text-[28px] leading-[110%] tracking-[-1.2px] sm:text-[36px] sm:leading-[105%] sm:tracking-[-1px] md:text-[42px] md:leading-[100%] md:tracking-[-1.81px] lg:text-[52px] lg:leading-[100%] lg:tracking-[-2.1px] xl:text-[70px] xl:leading-[100%] xl:tracking-[-2.8px] max-w-[1550px] company_stats_text xl:max-w-[1200px] lg:max-w-[1200px] md:max-w-[800px] sm:max-w-[720px] xs:w-full"
          >
            Мы хотим, чтобы клиенты Else стремительно завоевывали свой рынок благодаря нашим разработкам
          </div>
        </div>

        <div ref="listEl" class="company_stats_text flex flex-col items-start justify-start xl:mt-75 lg:mt-62 md:mt-50 sm:mt-50 xs:mt-25">
          <div class="pr-20 xl:pr-20 lg:pr-[42px] md:px-6 sm:right-0 xs:pr-0 sm:pl-4 work_list_parent">
            <div class="work_list_container">
              <div
                class="work_list company_stats_text gap-y-20 xl:gap-y-20 lg:gap-y-15 md:gap-y-15 sm:gap-y-[38px] xs:gap-y-9 grid grid-cols-1 xl:grid-cols[1fr_1fr_1fr] lg:grid-cols[1fr_1fr_1fr] md:grid-cols[1fr_1fr] sm:grid-cols[1fr_1fr] xs:grid-cols[1fr]"
              >
                <div
                  v-for="(item, i) in advantages"
                  :key="item.title"
                  class="work_list_item gap-2 xs:gap-3 lg:gap-6 pt-10 xl:pt-10 lg:pt-7 md:pt-7 sm:pt-7 xs:pt-5"
                  :class="{ 'is-open': openIndex === i }"
                >
                  <div
                    class="work_list_header"
                    role="button"
                    tabindex="0"
                    :aria-expanded="openIndex === i"
                    @click="toggle(i)"
                    @keydown.enter.space.prevent="toggle(i)"
                  >
                    <h3
                      class="work_list_title !m-0 xl:min-w-[592px] lg:min-w-[444px] md:min-w-[468px] sm:min-w-[354px] text-[36px] xl:text-[36px] leading-[120%] tracking-[-1.44px] lg:text-[28px] lg:tracking-[-1px] md:text-[24px] md:leading-[125%] md:tracking-[-0.8px] sm:text-[20px] sm:leading-[120%] sm:tracking-[-0.6px] xs:text-[20px] xs:leading-[120%] xs:tracking-[-0.6px]"
                    >
                      {{ item.title }}
                    </h3>
                    <span class="work_list_plus" :class="{ active: openIndex === i }" aria-hidden="true"><IconsPlusIcon /></span>
                  </div>
                  <div class="work_list_body">
                    <div class="work_list_body_inner">
                      <p
                        class="work_list_description xl:min-w-[592px] lg:min-w-[444px] md:min-w-[468px] sm:min-w-[354px] text-[20px] xl:text-[20px] leading-[140%] tracking-[-0.2px] lg:text-[16px] lg:leading-[150%] lg:tracking-[0px] md:text-[16px] md:leading-[150%] md:tracking-[0px] sm:text-[16px] sm:leading-[150%] sm:tracking-[0px] xs:text-[15px] xs:leading-[145%] xs:tracking-[0px]"
                      >
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
