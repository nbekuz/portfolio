<script setup lang="ts">
import { TELEGRAM } from '~/data/site'

const { openForm } = useUi()
</script>

<template>
  <div
    class="form_parent xs:mt-0 xl:p-[60px_60px_160px] lg:p-[40px_42px_120px_42px] md:p-[40px_38px_40px_38px] sm:p-[36px_24px_100px_24px] xs:p-[36px_16px_60px_16px] gap-3 md:gap-3 sm:gap-9 xs:gap-9 grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr] sm:grid-cols-1 xs:grid-cols-1 bg-[var(--Foreground-default)]"
  >
    <div class="form_parent_left flex flex-col gap-6 md:gap-4">
      <div class="flex flex-col gap-3">
        <div
          class="form_parent_left_title xl:text-[70px] xl:tracking-[-2.8px] lg:text-[52px] lg:tracking-[-2.1px] md:text-[42px] md:tracking-[-1.81px] sm:text-[36px] sm:tracking-[-1px] xs:text-[28px] xs:tracking-[-1.2px]"
        >
          Пора обсудить <br class="sm:hidden xs:hidden block" />
          ваш проект!
        </div>
        <div
          class="form_parent_left_text_row flex items-center justify-start sm:gap-3 xl:flex-row xl:items-center lg:flex-row lg:items-center md:flex-row md:items-center sm:flex sm:flex-row sm:items-center xs:flex xs:flex-col xs:items-start gap-0"
        >
          <div
            class="form_parent_left_text_row_title xl:text-[20px] xl:tracking-[-0.2px] xl:leading-[140%] lg:text-[16px] lg:tracking-[0] lg:leading-[150%] md:text-[16px] md:tracking-[0] md:leading-[150%] sm:text-[16px] sm:tracking-[0] sm:leading-[150%] xs:text-[15px] xs:tracking-[0] xs:leading-[145%]"
          >
            Оставьте заявку или напишите
          </div>
          <div class="flex gap-3 items-center">
            <img
              alt="Дима, Founder Else digital"
              loading="lazy"
              width="36"
              height="36"
              decoding="async"
              class="form_parent_left_text_row_image w-10 h-10 lg:w-[36px] lg:h-[36px] md:w-[36px] md:h-[36px] sm:w-[36px] sm:h-[36px] xs:w-[36px] xs:h-[36px]"
              src="/assets/images/ava.webp"
            />
            <a
              :href="TELEGRAM"
              target="_blank"
              rel="noopener"
              class="form_parent_left_text_row_link xl:text-[20px] xl:tracking-[-0.2px] xl:leading-[140%] lg:text-[16px] lg:tracking-[0] lg:leading-[150%] md:text-[16px] md:tracking-[0] md:leading-[150%] sm:text-[16px] sm:tracking-[0] sm:leading-[150%] xs:text-[16px] xs:tracking-[0] xs:leading-[150%]"
              ><LinkText class="cursor-pointer" text=" Диме в Telegram"
            /></a>
          </div>
        </div>
      </div>
      <div class="flex md:hidden">
        <div
          class="the_form_btn py-4 px-[28px] rounded-2xl gap-1 text-[20px] xl:py-4 xl:px-7 xl:rounded-2xl xl:text-xl lg:py-4 lg:pl-6 lg:pr-5 lg:text-base md:py-4 md:pl-6 md:pr-5 md:text-base sm:py-4 sm:pl-6 sm:pr-5 sm:text-base xs:py-4 xs:pl-6 xs:pr-5 xs:text-[15px] flex cursor-pointer"
          @click="openForm"
        >
          <button type="button">Отправить заявку</button>
        </div>
      </div>
    </div>
    <div class="form_parent_right hidden md:block">
      <LeadForm />
    </div>
  </div>
</template>
