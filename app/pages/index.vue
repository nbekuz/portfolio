<script setup lang="ts">
useHead({
  title: 'Else Digital — Разработка цифровых продуктов',
  meta: [
    {
      name: 'description',
      content: 'Разрабатываем сложные веб-сервисы, сайты и мобильные приложения. Аналитика, дизайн, разработка, поддержка.',
    },
  ],
})
</script>

<template>
  <div>
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
</template>
