<script setup lang="ts">
import { cases, ext } from '~/data/site'
</script>

<template>
  <div class="flex flex-col gap-6 sm:gap-9 md:gap-10 xl:gap-12">
    <div
      class="services_header_anchor flex items-center justify-start p-[1rem] sm:p-[1.5rem] md:px-9 lg:p-[2.625rem] xl:p-[3.75rem] pb-[0] sm:pb-[0] lg:pb-[0] xl:pb-[0]"
    >
      <h2
        class="services_title xl:text-[70px] lg:text-[52px] md:text-[42px] sm:text-[36px] xs:text-[28px] xl:tracking-[-2.8px] lg:tracking-[-2.1px] md:tracking-[-1.81px] sm:tracking-[-1px] xs:tracking-[-1.2px] xl:leading-[100%] lg:leading-[100%] md:leading-[100%] sm:leading-[105%] xs:leading-[110%]"
      >
        Наши IT-продукты
      </h2>
    </div>
    <div
      class="cases-container grid grid-cols-1 sm:grid-cols-2 xl:gap-y-[60px] xl:gap-x-[12px] p-[1rem] sm:p-[1.5rem] md:px-9 lg:p-[2.625rem] xl:p-[3.75rem] xs:gap-x-[36px] sm:gap-x-[12px] md:gap-x-[12px] lg:gap-x-[12px] xs:gap-y-[36px] sm:gap-y-[40px] md:gap-y-[40px] lg:gap-y-[50px] xl:pb-[48px] lg:pb-[40px] md:pb-[40px] sm:pb-[36px] xs:pb-[36px] !pt-0"
    >
      <CaseCard v-for="item in cases" :key="item.id" :item="item" />
    </div>
    <div class="m-auto flex items-center justify-center">
      <a
        class="see_all_cases black_overlay_btn h-[54px] w-[184px] text-[15px] xs:h-[54px] xs:w-[184px] xs:text-[15px] sm:h-[56px] sm:w-[193px] sm:text-[16px] md:h-[56px] md:w-[193px] md:text-[16px] lg:h-[56px] lg:w-[193px] lg:text-[16px] xl:h-[60px] xl:w-[226px] xl:text-[20px]"
        :href="ext('/cases/')"
      >
        <span> Смотреть все кейсы</span>
      </a>
    </div>
  </div>
</template>
