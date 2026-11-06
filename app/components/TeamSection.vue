<script setup lang="ts">
import Swiper from 'swiper'
import { Autoplay, FreeMode } from 'swiper/modules'
import team from '~/data/team.json'
import { ext } from '~/data/site'
import { srcset } from '~/utils/img'
import { isMobileWidth, prefersReducedMotion } from '~/utils/gsap'

const el = ref<HTMLElement | null>(null)
let swiper: Swiper | undefined

onMounted(() => {
  if (!el.value) return
  const reduced = prefersReducedMotion()
  swiper = new Swiper(el.value, {
    modules: [Autoplay, FreeMode],
    spaceBetween: 12,
    slidesPerView: 'auto',
    observer: true,
    observeParents: true,
    watchOverflow: false,
    preventClicks: true,
    preventClicksPropagation: true,
    freeMode: { enabled: true, momentum: false },
    allowTouchMove: true,
    grabCursor: true,
    speed: isMobileWidth() ? 3500 : 10000,
    autoplay: reduced ? false : { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true },
    on: {
      touchEnd: (s) => {
        if (!reduced) s.autoplay?.start()
      },
    },
  })
})

onBeforeUnmount(() => swiper?.destroy(true, true))

const cardImgClass =
  'relative w-[180px] h-[220px] sm:w-[260px] sm:h-[318px] md:w-[300px] md:h-[367px] lg:w-[340px] lg:h-[416px] xl:w-[450px] xl:h-[550px] rounded-[16px] overflow-hidden'
</script>

<template>
  <div class="team bg-white relative gap-[36px] sm:gap-[36px] md:gap-[40px] lg:gap-[40px] xl:gap-[48px]">
    <div class="team_header">
      <div class="awards_title gap-2 pl-[16px] xs:pl-[16px] sm:pl-[24px] md:pl-[38px] lg:pl-[42px] xl:pl-14">
        <h2
          class="awards_title_text tracking-[-1.2px] text-[28px] xs:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[52px] xl:text-[70px] xs:tracking-[-1.2px] sm:tracking-[-1px] md:tracking-[-1.81px] lg:tracking-[-2.1px] xl:tracking-[-2.8px]"
        >
          Наша команда IT-специалистов
        </h2>
        <span
          class="title_count text-[15px] xs:text-[15px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[20px] tracking-[0px] xs:tracking-[0px] sm:tracking-[0px] md:tracking-[0px] lg:tracking-[0px] xl:tracking-[-0.2px]"
          >35</span
        >
      </div>
    </div>
    <div class="team_slider_wrapper">
      <div ref="el" class="swiper team-swiper" style="transition-timing-function: linear">
        <div class="swiper-wrapper">
          <div v-for="member in team" :key="member.image" class="swiper-slide team-slide">
            <component
              :is="member.href ? 'a' : 'div'"
              :href="member.href"
              class="team_card flex flex-col gap-[12px] touch-manipulation"
            >
              <div :class="cardImgClass">
                <img :alt="member.name" draggable="false" loading="lazy" decoding="async" class="object-cover w-full h-full fill-img" :src="member.image"
                  :srcset="srcset(member.image, [480], 900)"
                  sizes="(max-width: 639px) 180px, (max-width: 767px) 260px, (max-width: 1023px) 300px, (max-width: 1439px) 340px, 450px"
                />
              </div>
              <div class="flex flex-col gap-[4px]">
                <div
                  class="team_card_name text-[18px] leading-[135%] tracking-[-0.3px] xs:text-[18px] xs:leading-[135%] xs:tracking-[-0.3px] sm:text-[18px] sm:leading-[135%] sm:tracking-[-0.3px] md:text-[18px] md:leading-[135%] md:tracking-[-0.3px] lg:text-[20px] lg:leading-[140%] lg:tracking-[-0.36px] xl:text-[24px] xl:leading-[135%] xl:tracking-[-0.48px]"
                >
                  {{ member.name }}
                </div>
                <div
                  class="team_card_position text-[15px] leading-[145%] tracking-[0px] xs:text-[15px] xs:leading-[145%] xs:tracking-[0px] sm:text-[16px] sm:leading-[150%] sm:tracking-[0px] md:text-[16px] md:leading-[150%] md:tracking-[0px] lg:text-[16px] lg:leading-[150%] lg:tracking-[0px] xl:text-[20px] xl:leading-[140%] xl:tracking-[-0.2px]"
                >
                  {{ member.position }}
                </div>
              </div>
            </component>
          </div>
        </div>
      </div>
    </div>
    <div class="team_footer flex items-center justify-center">
      <a
        class="see_all_cases flex items-center justify-center rounded-2xl bg-[#A1A7B31A] font-main black_overlay_btn h-[54px] w-[184px] text-[15px] xs:h-[54px] xs:w-[184px] xs:text-[15px] sm:h-[56px] sm:w-[193px] sm:text-[16px] md:h-[56px] md:w-[193px] md:text-[16px] lg:h-[56px] lg:w-[193px] lg:text-[16px] xl:h-[60px] xl:w-[226px] xl:text-[20px]"
        :href="ext('/vacancies/')"
        ><span>Смотреть вакансии</span></a
      >
    </div>
  </div>
</template>
