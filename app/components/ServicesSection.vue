<script setup lang="ts">
import { gsap, ScrollTrigger } from '~/utils/gsap'
import services from '~/data/services.json'

const active = ref(0)
const mounted = ref(false)
const bodies = ref<HTMLElement[]>([])
const headers = ref<HTMLElement[]>([])
let animating = false

const caseClass =
  'services_accordion_header_case px-2 py-1 text-xs rounded-sm xs:px-3 xs:py-2 xs:text-sm xs:rounded-lg sm:px-3 sm:py-2 sm:text-base sm:rounded-xl md:px-4 md:py-3 md:text-base md:rounded-xl lg:px-4 lg:py-3 lg:text-base lg:rounded-xl xl:px-4 xl:py-3 xl:text-xl xl:rounded-xl'
const titleClass =
  'text-xl tracking-tight xs:text-xl xs:tracking-tight sm:text-xl sm:tracking-tight md:text-2xl md:-tracking-wider lg:text-3xl lg:-tracking-wide xl:text-4xl xl:-tracking-widest'

const toggle = (index: number) => {
  if (animating) return
  animating = true
  const current = active.value
  const prevBody = bodies.value[current]
  const nextBody = bodies.value[index]

  if (current !== -1 && prevBody && current !== index) {
    gsap.fromTo(
      prevBody,
      { height: prevBody.scrollHeight, opacity: 1 },
      { height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut', onComplete: () => ScrollTrigger.refresh() },
    )
  }

  if (index === current) {
    if (nextBody) {
      gsap.fromTo(
        nextBody,
        { height: nextBody.scrollHeight, opacity: 1 },
        {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            ScrollTrigger.refresh()
            setTimeout(() => (animating = false), 100)
          },
        },
      )
    } else animating = false
    active.value = -1
    return
  }

  active.value = index
  if (!nextBody) {
    animating = false
    return
  }
  gsap.fromTo(
    nextBody,
    { height: 0, opacity: 0 },
    {
      height: nextBody.scrollHeight,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(nextBody, { height: 'auto' })
        ScrollTrigger.refresh()
        const header = headers.value[index]
        if (header) {
          const top = header.getBoundingClientRect().top + window.scrollY
          window.scrollTo({ top: top - (window.innerWidth < 768 ? 36 : 80), behavior: 'smooth' })
        }
        setTimeout(() => (animating = false), 800)
      },
    },
  )
}

onMounted(() => {
  mounted.value = true
  if (window.innerWidth <= 767) {
    active.value = -1
    bodies.value.forEach((b) => gsap.set(b, { height: 0, opacity: 0 }))
  }
})
</script>

<template>
  <div class="services" :class="{ 'svc-ssr': !mounted }">
    <div class="flex flex-col pl-4 gap-4 xl:gap-4 lg:gap-4 md:gap-2 sm:gap-2 xs:gap-2 xl:pl-[60px] lg:pl-[42px] md:pl-[38px] sm:pl-6 xs:px-4">
      <div class="services_header_anchor flex items-center justify-start">
        <IconsAnchorSquare />
        <h2
          class="services_header_title xl:text-[20px] lg:text-[16px] md:text-[16px] sm:text-[16px] xs:text-[15px] xl:tracking-[-0.2px] lg:tracking-[0] md:tracking-[0] sm:tracking-[0] xs:tracking-[0] xl:leading-[140%] lg:leading-[150%] md:leading-[150%] sm:leading-[150%] xs:leading-[145%]"
        >
          Услуги студии веб-разработки Else Digital
        </h2>
      </div>
      <div
        class="services_title xl:text-[70px] lg:text-[52px] md:text-[42px] sm:text-[36px] xs:text-[28px] xl:tracking-[-2.8px] lg:tracking-[-2.1px] md:tracking-[-1.81px] sm:tracking-[-1px] xs:tracking-[-1.2px] xl:leading-[100%] lg:leading-[100%] md:leading-[100%] sm:leading-[105%] xs:leading-[110%]"
      >
        Любим хайлоад системы, сложные <br />
        интеграции по API и UХ-интерфейсы
      </div>
    </div>

    <div class="services_accordion">
      <div
        v-for="(service, i) in services"
        :key="service.title"
        class="services_accordion_item transition-all duration-300 hover:bg-[#A1A7B31A]"
      >
        <div
          :ref="(el) => el && (headers[i] = el as HTMLElement)"
          class="services_accordion_header p-4 w-full items-center grid grid-cols-1 sm:grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2fr] xs:px-[16px] xs:py-[20px] sm:px-6 sm:py-6 md:px-[38px] md:py-[28px] lg:px-[42px] lg:py-[28px] xl:px-[60px] xl:py-[40px] xl:gap-[32px] gap-5 md:gap-[70px] lg:gap-[24px] sm:gap-[46px]"
          :class="{ active: active === i }"
          style="cursor: pointer"
          @click="toggle(i)"
        >
          <div class="services_accordion_header_cases hidden xs:hidden md:flex lg:flex sm:hidden xl:flex justify-start items-center gap-2">
            <div v-for="c in service.caseTitles" :key="c" :class="caseClass">{{ c }}</div>
          </div>
          <div class="xs:hidden hidden md:hidden lg:hidden sm:flex xl:hidden services_accordion_header_title" :class="titleClass">
            {{ service.title }}
          </div>
          <div class="w-full flex items-center justify-between">
            <div class="flex flex-col gap-2">
              <div class="services_accordion_header_cases hidden xs:hidden md:hidden lg:hidden sm:flex xl:hidden justify-start items-center gap-2">
                <div v-for="c in service.caseTitles" :key="c" :class="caseClass">{{ c }}</div>
              </div>
              <div class="services_accordion_header_title xs:flex md:flex lg:flex sm:hidden xl:flex" :class="titleClass">
                {{ service.title }}
              </div>
              <div class="xs:flex md:hidden lg:hidden sm:hidden xl:hidden services_accordion_header_cases justify-start items-center gap-2">
                <div
                  v-for="c in service.caseTitles"
                  :key="c"
                  class="services_accordion_header_case w-max px-[4px] py-[2px] mt-1 text-xs rounded-sm xs:px-[8px] xs:py-[4px] xs:text-sm xs:rounded-lg sm:px-3 sm:py-2 sm:text-base sm:rounded-xl md:px-4 md:py-3 md:text-base md:rounded-xl lg:px-4 lg:py-3 lg:text-base lg:rounded-xl xl:px-4 xl:py-3 xl:text-xl xl:rounded-xl"
                >
                  {{ c }}
                </div>
              </div>
            </div>
            <div
              class="services_accordion_header_plus w-12 h-12 xs:min-w-12 xs:min-h-12 sm:min-w-12 sm:min-h-12 md:min-w-12 md:min-h-12 lg:min-w-12 lg:min-h-12 xl:min-w-13 xl:min-h-13 xs:max-w-12 xs:max-h-12 sm:max-w-12 sm:max-h-12 md:max-w-12 md:max-h-12 lg:max-w-12 lg:max-h-12 xl:w-13 xl:h-13"
              :class="{ active: active === i }"
              @click.stop="toggle(i)"
            >
              <IconsPlusIcon />
            </div>
          </div>
        </div>
        <div
          :ref="(el) => el && (bodies[i] = el as HTMLElement)"
          class="services_accordion_body"
          :class="{ 'svc-body-open': i === 0 }"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-1 p-4 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2fr] xl:p-[0_0_80px_60px] lg:p-[0_0_56px_42px] md:p-[0_0_56px_42px] sm:p-[0_0_28px_24px] xs:p-[20px] xs:pt-2 xs:pb-[40px]"
          >
            <div
              v-if="service.image"
              class="services_accordion_body_image relative rounded-2xl w-100 h-100 md:hidden sm:hidden xs:hidden lg:flex xl:flex lg:w-75 lg:h-75 xl:w-100 xl:h-100"
            >
              <img :alt="service.title" loading="lazy" decoding="async" class="object-cover rounded-2xl fill-img" :src="service.image" />
            </div>
            <div
              class="services_accordion_body_sub_items grid xl:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr] sm:grid-cols-[1fr_1fr] xs:grid-cols-[1fr]"
            >
              <div v-for="item in service.items" :key="item.title" class="services_accordion_body_sub_items_card">
                <a
                  :href="item.href"
                  class="services_accordion_body_sub_items_title xs:text-[15px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[20px] block hover:opacity-80 transition-opacity duration-200"
                >
                  <LinkText :text="item.title" />
                </a>
                <div class="services_accordion_body_sub_items_description xs:text-[15px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[20px]">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="services_accordion_last_divider" />
    </div>
  </div>
</template>
