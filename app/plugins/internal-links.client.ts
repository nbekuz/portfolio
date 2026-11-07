import { scrollToElement } from '~/utils/gsap'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
    const href = a.getAttribute('href')!
    if (href.startsWith('#')) {
      const el = href.length > 1 && document.getElementById(decodeURIComponent(href.slice(1)))
      if (el) {
        e.preventDefault()
        scrollToElement(el, 80)
      }
      return
    }
    if (!href.startsWith('/') || href.startsWith('//')) return
    const url = new URL(href, location.origin)
    if (/\.\w{2,5}$/.test(url.pathname)) return
    e.preventDefault()
    if (url.pathname === location.pathname && url.search === location.search) {
      const el = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (el) scrollToElement(el, 80)
      return
    }
    router.push(url.pathname + url.search + url.hash)
  })
})
