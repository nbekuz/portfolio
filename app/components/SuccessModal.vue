<script setup lang="ts">
import { gsap, ScrollSmoother } from '~/utils/gsap'

const { successOpen, formOpen } = useUi()

const visible = ref(false)
const root = ref<HTMLElement | null>(null)
const card = ref<HTMLElement | null>(null)

const lock = (on: boolean) => {
  document.body.style.overflow = on ? 'hidden' : ''
  ScrollSmoother.get()?.paused(on)
}

const close = () => (successOpen.value = false)

watch(successOpen, async (open) => {
  if (open) {
    visible.value = true
    lock(true)
    await nextTick()
    if (!root.value || !card.value) return
    gsap.fromTo(root.value, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    gsap.fromTo(card.value, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' })
  } else if (root.value) {
    gsap.to(root.value, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        visible.value = false
        if (!formOpen.value) lock(false)
      },
    })
  }
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && successOpen.value) close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="visible" ref="root" class="success_modal flex justify-end items-end sm:justify-center sm:items-center" role="dialog" aria-modal="true">
    <div class="success_modal_overlay" @click="close" />
    <div
      ref="card"
      class="success_modal_card xl:w-[530px] w-full flex flex-col items-center justify-center xl:rounded-[24px] lg:rounded-[24px] md:rounded-[24px] sm:rounded-[24px] bg-white xl:p-10 xl:pt-12 flex flex-col xl:gap-10 lg:w-[408px] lg:pt-8 lg:p-7 lg:gap-7 md:w-[390px] md:pt-8 md:p-7 md:gap-7 sm:w-[380px] sm:pt-7 sm:p-6 sm:gap-6 xs:w-full xs:rounded-br-[0] xs:rounded-bl-[0] xs:rounded-t-[16px] xs:pt-6 xs:p-4 xs:gap-10"
    >
      <div class="flex flex-col items-center gap-6 xl:gap-8 text-center">
        <div class="success_icon">
          <svg width="100" height="101" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.5" width="100" height="100" rx="50" fill="#3BC766" />
            <path d="M44.2814 64.9463L30.5352 51.2L34.3204 47.4148L44.2814 57.3758L65.6757 35.9814L69.461 39.7667L44.2814 64.9463Z" fill="white" />
          </svg>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div
            class="success_modal_title font-main-medium text-[20px] leading-[120%] tracking-[-0.6px] sm:text-[20px] sm:leading-[120%] sm:tracking-[-0.6px] md:text-[24px] md:leading-[125%] md:tracking-[-0.8px] lg:text-[28px] lg:leading-[120%] lg:tracking-[-1px] xl:text-[36px] xl:leading-[120%] xl:tracking-[-1.44px]"
          >
            Заявка успешно отправлена
          </div>
          <div
            class="success_modal_description font-main font-[450] text-[15px] leading-[145%] sm:text-[16px] sm:leading-[150%] md:text-[16px] md:leading-[150%] lg:text-[16px] lg:leading-[150%] xl:text-[20px] xl:leading-[140%] xl:tracking-[-0.2px]"
          >
            Наш менеджер свяжется с вами в ближайшее время для обсуждения деталей.
          </div>
        </div>
      </div>
      <button
        type="button"
        class="form_button transition-opacity duration-300 flex items-center justify-center h-[54px] w-full py-4 px-5 rounded-2xl text-[15px] gap-1 sm:h-auto sm:w-full sm:py-4 sm:px-5 sm:rounded-2xl sm:text-base sm:gap-1 md:h-auto md:w-full md:py-4 md:px-5 md:rounded-2xl md:text-base lg:h-14 lg:w-full lg:py-4 lg:px-5 lg:rounded-2xl lg:text-base xl:h-[60px] xl:rounded-2xl xl:text-xl bg-[#a1a7b31a] text-[#202024]"
        @click="close"
      >
        Отлично!
      </button>
    </div>
  </div>
</template>
