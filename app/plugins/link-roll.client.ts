import { gsap } from '~/utils/gsap'

export default defineNuxtPlugin(() => {
  const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'
  const timelines = new WeakMap<Element, gsap.core.Timeline>()

  const parts = (wrapper: Element) =>
    [wrapper.querySelector('.link-current'), wrapper.querySelector('.link-hover')].filter(Boolean) as Element[]

  document.addEventListener('mouseover', (e) => {
    const wrapper = (e.target as Element | null)?.closest?.('.link-wrapper')
    if (!wrapper || wrapper.contains(e.relatedTarget as Node | null)) return
    timelines.get(wrapper)?.kill()
    const tl = gsap.timeline()
    tl.to(parts(wrapper), { y: '-100%', duration: 0.4, ease }, 0)
    timelines.set(wrapper, tl)
  })

  document.addEventListener('mouseout', (e) => {
    const wrapper = (e.target as Element | null)?.closest?.('.link-wrapper')
    if (!wrapper || wrapper.contains(e.relatedTarget as Node | null)) return
    timelines.get(wrapper)?.kill()
    gsap.set(parts(wrapper), { y: '0%' })
  })
})
