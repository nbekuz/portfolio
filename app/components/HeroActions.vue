<script setup lang="ts">
const { openForm } = useUi()

const hidden = ref(false)
let observer: IntersectionObserver | undefined
const intersecting = new Set<Element>()

onMounted(() => {
  const targets = [document.getElementById('form-section'), document.querySelector('footer')].filter(Boolean) as Element[]
  if (!targets.length) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? intersecting.add(e.target) : intersecting.delete(e.target)))
      hidden.value = intersecting.size > 0
    },
    { threshold: 0 },
  )
  targets.forEach((t) => observer!.observe(t))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    class="hero-actions fixed transition-opacity duration-300 pointer-events-none right-5 bottom-5 xs:right-2 xs:bottom-2 sm:right-5 sm:bottom-5 md:right-5 md:bottom-5 lg:right-5 lg:bottom-5 xl:right-10 xl:bottom-10 flex items-center justify-between gap-2 sm:gap-3 z-[998]"
  >
    <button
      type="button"
      aria-label="Обсудить проект"
      :aria-hidden="hidden || undefined"
      :tabindex="hidden ? -1 : undefined"
      :disabled="hidden"
      class="hero__button flex items-center justify-between h-[54px] w-auto py-4 px-5 pl-6 rounded-2xl text-[15px] gap-1 sm:h-auto sm:py-4 sm:px-5 sm:pl-6 sm:rounded-2xl sm:text-base sm:gap-1 md:h-auto md:py-4 md:px-5 md:pl-6 md:rounded-2xl md:text-base lg:h-14 lg:py-4 lg:px-5 lg:pl-6 lg:rounded-2xl lg:text-base xl:h-[60px] xl:py-4 xl:px-6 xl:rounded-2xl xl:text-xl bg-white"
      :class="hidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'"
      @click="openForm"
    >
      <span>Обсудить проект</span>
      <span class="w-6 h-6 items-center justify-center hidden lg:flex" aria-hidden="true"><span class="three-dots" /></span>
    </button>
  </div>
</template>
