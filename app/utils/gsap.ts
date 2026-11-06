import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText }

export const isMobileWidth = () => window.matchMedia('(max-width: 767px)').matches
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isMobileDevice = () =>
  window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
export const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0

export function refreshScroll() {
  const smoother = ScrollSmoother.get()
  smoother?.refresh()
  ScrollTrigger.refresh()
}

export function scrollToElement(el: Element, offset = 0) {
  const smoother = ScrollSmoother.get()
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  if (smoother) smoother.scrollTo(top, true)
  else window.scrollTo({ top, behavior: 'smooth' })
}
