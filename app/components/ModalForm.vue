<script setup lang="ts">
import { gsap, ScrollSmoother } from '~/utils/gsap'

const { formOpen, successOpen, closeForm } = useUi()

const overlay = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)

const lock = (on: boolean) => {
  document.body.style.overflow = on ? 'hidden' : ''
  ScrollSmoother.get()?.paused(on)
}

const open = () => {
  const o = overlay.value
  const p = panel.value
  if (!o || !p) return
  const mobile = window.innerWidth < 768
  gsap.killTweensOf([o, p])
  gsap.set([o, p], { display: 'block' })
  gsap.fromTo(o, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
  gsap.fromTo(p, mobile ? { x: 0, y: '100%' } : { y: 0, x: '100%' }, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' })
  lock(true)
}

const close = () => {
  const o = overlay.value
  const p = panel.value
  if (!o || !p) return
  const mobile = window.innerWidth < 768
  gsap.killTweensOf([o, p])
  gsap.to(o, { opacity: 0, duration: 0.3, ease: 'power2.in' })
  gsap.to(p, {
    ...(mobile ? { y: '100%' } : { x: '100%' }),
    duration: 0.5,
    ease: 'power2.in',
    onComplete: () => {
      gsap.set([o, p], { display: 'none' })
    },
  })
  if (!successOpen.value) lock(false)
}

watch(formOpen, (v) => (v ? open() : close()))

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && formOpen.value) closeForm()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (formOpen.value) lock(false)
})
</script>

<template>
  <div ref="overlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-1000 hidden" @click="closeForm" />
  <div
    ref="panel"
    role="dialog"
    aria-modal="true"
    aria-label="Оставить заявку"
    class="fixed top-4 rounded-t-3xl md:top-4 overflow-y-auto w-full max-w-3xl bg-white z-1150 hidden rounded-3xl md:right-4 sm:bottom-4 sm:left-auto sm:rounded-3xl right-0 bottom-0 left-0 rounded-b-none md:max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-2rem)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#A1A7B3] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[#8a8f99] [&::-webkit-scrollbar-thumb]:transition-colors [scrollbar-width:thin] [scrollbar-color:#A1A7B3_transparent]"
    data-lenis-prevent
  >
    <div class="flex items-center justify-between p-4 rounded-t-3xl md:p-6 xs:sticky sm:starting: sm:top-0 xs:top-0 bg-white">
      <div
        class="font-main-medium text-[20px] leading-[120%] tracking-[-0.6px] sm:text-[20px] sm:leading-[120%] sm:tracking-[-0.6px] md:text-[24px] md:leading-[125%] md:tracking-[-0.8px] lg:text-[28px] lg:leading-[120%] lg:tracking-[-1px] xl:text-[36px] xl:leading-[120%] xl:tracking-[-1.44px] text-var(--Foreground-default)"
      >
        Оставить заявку
      </div>
      <button
        type="button"
        class="p-2 hover:bg-black/10 transition-all duration-300 rounded-full bg-[#A1A7B31A] w-13 h-13 flex items-center justify-center cursor-pointer"
        aria-label="Закрыть"
        @click="closeForm"
      >
        <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="p-4 md:p-6">
      <LeadForm black-text @success="closeForm" />
    </div>
  </div>
</template>
