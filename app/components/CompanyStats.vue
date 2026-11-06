<script setup lang="ts">
import { gsap } from "~/utils/gsap"
import { bgVideos } from "~/data/site"

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

onMounted(() => {
  ctx = gsap.context(() => {
    const spans = root.value!.querySelectorAll(".stats_line span")
    gsap.set(spans, { y: 86, opacity: 0 })
    gsap.to(spans, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: { trigger: root.value, start: "top 80%", toggleActions: "play none none none", invalidateOnRefresh: true },
    })
  }, root.value!)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div class="company_stats relative" ref="root">
    <div class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat">
        <BgVideo :poster="bgVideos.video6.poster" :sources="bgVideos.video6.sources" container-class="absolute top-0 left-0 w-full h-full" /></div>
    <div class="company_stats_content p-[36px_24px] xs:py-6 xs:px-4 sm:p-[36px_24px] md:p-[40px_38px] lg:p-[40px_42px] xl:p-[60px]">
      <div class="company_stats_text text-[28px] leading-[30.8px] tracking-[-1.2px] sm:text-[36px] sm:leading-[37.8px] sm:tracking-[-1px] md:text-[42px] md:leading-[42px] md:tracking-[-1.81px] lg:text-[52px] lg:leading-[52px] lg:tracking-[-2.1px] xl:text-[70px] xl:leading-[70px] xl:tracking-[-2.8px]">
        <div class="xl:flex lg:flex md:flex sm:flex xs:hidden stats_line h-[auto] sm:h-[auto] md:h-[auto] lg:h-[auto] xl:h-[70px]">
          <span>Else — аккредитованная IT-компания, которая </span>
        </div>
        <div class="xl:flex lg:flex md:flex sm:flex xs:hidden stats_line h-[auto] sm:h-[auto] md:h-[auto] lg:h-[auto] xl:h-[70px]">
          <span>стабильно набирает обороты на рынке digital-услуг.</span>
        </div>
        <div class="xl:flex lg:flex md:flex sm:flex xs:hidden stats_line h-[auto] sm:h-[auto] md:h-[auto] lg:h-[auto] xl:h-[70px]">
          <span> Мы ценим прозрачную коммуникацию, командную</span>
        </div>
        <div class="xl:flex lg:flex md:flex sm:flex xs:hidden stats_line h-[auto] sm:h-[auto] md:h-[auto] lg:h-[auto] xl:h-[70px]">
          <span> работу и инфинит-развитие</span>
        </div>
        <div class="stats_line h-[auto] sm:h-[auto] md:h-[auto] lg:h-[auto] xl:h-[70px] xs:flex sm:hidden md:hidden lg:hidden xl:hidden">
          <span>Else — аккредитованная IT-компания, которая стабильно набирает обороты на рынке digital-услуг. Мы ценим прозрачную коммуникацию, командную работу и инфинит-развитие
          </span>
        </div>
      </div>
    </div>
    <div class="company_stats_content mt-72 sm:mt-80 p-[36px_24px] xs:py-6 xs:px-4 sm:p-[36px_24px] md:p-[40px_38px] lg:p-[40px_42px] xl:p-[60px]">
      <div class="company_stats_content_bottom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="company_stats_content_bottom_card border-t border-[var(--Stroke-default-inversed)] flex flex-col gap-2 pt-10 xs:pt-[20px] sm:pt-[20px] md:pt-[24px] lg:pt-[28px] xl:pt-[40px]">
          <span class="font-main font-[450] text-[60px] leading-[90%] tracking-[-2px] sm:text-[70px] sm:leading-[90%] sm:tracking-[-3px] md:text-[80px] md:leading-[90%] md:tracking-[-4px] lg:text-[100px] lg:leading-[90%] lg:tracking-[-5px] xl:text-[140px] xl:leading-[90%] xl:tracking-[-7px] company_stats_content_bottom_card_title text-[var(--text-light)]">№1</span>
          <div class="company_stats_content_bottom_card_description text-[13px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[20px] leading-[140%] tracking-[-0.002em] text-[var(--text-light)]">
            Среди mobile и e-commerce разработчиков <br>
            в Ростове-на-Дону (Рейтинг Рунета 2024)
          </div>
        </div>
        <div class="company_stats_content_bottom_card border-t border-[var(--Stroke-default-inversed)] flex flex-col gap-2 pt-10 xs:pt-[20px] sm:pt-[20px] md:pt-[24px] lg:pt-[28px] xl:pt-[40px]">
          <span class="font-main font-[450] text-[60px] leading-[90%] tracking-[-2px] sm:text-[70px] sm:leading-[90%] sm:tracking-[-3px] md:text-[80px] md:leading-[90%] md:tracking-[-4px] lg:text-[100px] lg:leading-[90%] lg:tracking-[-5px] xl:text-[140px] xl:leading-[90%] xl:tracking-[-7px] company_stats_content_bottom_card_title text-[var(--text-light)]">250+</span>
          <div class="company_stats_content_bottom_card_description text-[13px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[20px] leading-[140%] tracking-[-0.002em] text-[var(--text-light)]">
            Реализованных проектов по разработке <br>
            и поддержке цифровых продуктов
          </div>
        </div>
        <div class="company_stats_content_bottom_card border-t border-[var(--Stroke-default-inversed)] flex flex-col gap-2 pt-10 xs:pt-[20px] sm:pt-[20px] md:pt-[24px] lg:pt-[28px] xl:pt-[40px]">
          <span class="font-main font-[450] text-[60px] leading-[90%] tracking-[-2px] sm:text-[70px] sm:leading-[90%] sm:tracking-[-3px] md:text-[80px] md:leading-[90%] md:tracking-[-4px] lg:text-[100px] lg:leading-[90%] lg:tracking-[-5px] xl:text-[140px] xl:leading-[90%] xl:tracking-[-7px] company_stats_content_bottom_card_title text-[var(--text-light)]">35</span>
          <div class="company_stats_content_bottom_card_description text-[13px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[20px] leading-[140%] tracking-[-0.002em] text-[var(--text-light)]">
            Специалистов в команде: аналитики, менеджеры, <br>
            дизайнеры, разработчики, тестировщики
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
