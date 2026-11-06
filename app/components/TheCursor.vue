<script setup lang="ts">
import { gsap, prefersReducedMotion } from '~/utils/gsap'

const el = ref<HTMLElement | null>(null)
let cleanup: (() => void) | undefined

onMounted(() => {
  const fine = window.matchMedia('(pointer: fine)').matches
  const hover = window.matchMedia('(hover: hover)').matches
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) document.documentElement.classList.add('is-touch')
  const c = el.value
  if (!fine || !hover || prefersReducedMotion() || !c) return

  const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const pos = { ...target }
  let visible = false
  let raf = 0
  gsap.set(c, { x: pos.x, y: pos.y, scale: 0 })

  const tick = () => {
    pos.x += (target.x - pos.x) * 0.07
    pos.y += (target.y - pos.y) * 0.07
    gsap.set(c, { x: pos.x, y: pos.y })
    raf = requestAnimationFrame(tick)
  }
  tick()

  const onMove = (e: MouseEvent) => {
    target.x = e.clientX
    target.y = e.clientY
    if (!visible) {
      visible = true
      gsap.to(c, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }
  }
  const onOver = (e: MouseEvent) => {
    const t = e.target as Element | null
    c.classList.toggle('-hover', !!t?.closest?.('a, button, .hover-target'))
  }
  const onDown = () => {
    c.classList.add('-click')
    gsap.to(c, { scale: 0.8, duration: 0.3, onComplete: () => void gsap.to(c, { scale: 1, duration: 0.3 }) })
    setTimeout(() => c.classList.remove('-click'), 300)
  }
  const onLeave = () => {
    c.classList.add('-leave')
    gsap.to(c, { scale: 0, duration: 0.3 })
    visible = false
  }
  const onEnter = () => {
    c.classList.remove('-leave')
    if (visible) gsap.to(c, { scale: 1, duration: 0.3 })
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseover', onOver)
  document.addEventListener('mousedown', onDown)
  window.addEventListener('mouseout', onLeave)
  window.addEventListener('mouseover', onEnter)

  cleanup = () => {
    cancelAnimationFrame(raf)
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseover', onOver)
    document.removeEventListener('mousedown', onDown)
    window.removeEventListener('mouseout', onLeave)
    window.removeEventListener('mouseover', onEnter)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div id="cursor" ref="el" class="cursor hidden xs:hidden md:flex sm:flex lg:flex xl:flex" />
</template>
