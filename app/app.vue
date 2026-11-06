<script setup lang="ts">
import { ScrollSmoother, ScrollTrigger, isTouch } from '~/utils/gsap'

let smoother: ScrollSmoother | undefined

onMounted(() => {
  document.documentElement.classList.add('loaded')
  ScrollTrigger.config({ ignoreMobileResize: true })
  if (!isTouch() && window.innerWidth >= 1024) {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
      effects: true,
      normalizeScroll: false,
    })
  }
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => smoother?.kill())
</script>

<template>
  <ThePreloader />
  <TheCursor />
  <AppHeader />
  <HeroActions />
  <main id="smooth-wrapper" class="home">
    <div id="smooth-content" class="content">
      <div>
        <HeroSection />
      </div>
      <div class="flex flex-col mt-[60px] lg:mt-[40px] md:mt-[40px] sm:mt-[40px] xs:mt-[24px] gap-[12px] bg-white">
        <LazyLogosMarquee hydrate-never />
        <div class="flex flex-col gap-[100px] xs:gap-[100px] sm:gap-[100px] md:gap-30 lg:gap-30 xl:gap-[160px]">
          <CasesSection />
          <ServicesSection />
          <CompanyStats />
          <LazyTeamSection hydrate-on-visible />
          <AwardsSection />
          <LazyMediaSection hydrate-never />
          <ReviewsSection />
        </div>
        <WorkApproach />
      </div>
      <div class="relative z-10 -mt-1 bg-[var(--Foreground-default)] flex flex-col">
        <div id="form-section">
          <LazyFormSection hydrate-on-visible />
        </div>
        <div>
          <LazyAppFooter hydrate-never />
        </div>
      </div>
    </div>
  </main>
  <ModalForm />
  <SuccessModal />
</template>
