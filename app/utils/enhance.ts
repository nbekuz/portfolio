import Swiper from 'swiper'
import { Autoplay, FreeMode } from 'swiper/modules'
import { gsap, ScrollTrigger, SplitText, isTouch, isMobileWidth, prefersReducedMotion, refreshScroll, scrollToElement } from '~/utils/gsap'
import { awards, bgVideos } from '~/data/site'

type Cleanup = () => void

const on = <K extends keyof HTMLElementEventMap>(el: EventTarget, type: K | string, fn: (e: any) => void, opts?: AddEventListenerOptions): Cleanup => {
  el.addEventListener(type, fn, opts)
  return () => el.removeEventListener(type, fn, opts)
}

const all = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel)) as T[]

const isLite = () => isTouch() || window.innerWidth < 1024

function accordions(root: HTMLElement): Cleanup {
  let busy = false
  const setOpen = (header: HTMLElement, open: boolean) => {
    const body = header.nextElementSibling as HTMLElement | null
    header.classList.toggle('active', open)
    header.querySelector('.services_accordion_header_plus')?.classList.toggle('active', open)
    if (!body?.classList.contains('services_accordion_body')) return
    gsap.killTweensOf(body)
    if (open) {
      gsap.fromTo(
        body,
        { height: 0, opacity: 0 },
        {
          height: body.scrollHeight,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(body, { height: 'auto' })
            ScrollTrigger.refresh()
          },
        },
      )
    } else {
      const from = body.offsetHeight
      body.classList.remove('svc-body-open')
      gsap.fromTo(body, { height: from, opacity: 1 }, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut', onComplete: () => ScrollTrigger.refresh() })
    }
  }
  return on(root, 'click', (e: MouseEvent) => {
    const target = e.target as Element
    const header = target.closest<HTMLElement>('.services_accordion_header')
    if (!header || !root.contains(header) || target.closest('a') || busy) return
    busy = true
    setTimeout(() => (busy = false), 500)
    const accordion = header.closest('.services_accordion')
    const wasOpen = header.classList.contains('active')
    accordion &&
      all(accordion, '.services_accordion_header.active').forEach((h) => h !== header && h.closest('.services_accordion') === accordion && setOpen(h, false))
    setOpen(header, !wasOpen)
  })
}

function swipers(root: HTMLElement): Cleanup {
  const reduced = prefersReducedMotion()
  const instances = all(root, '.swiper').map((el) => {
    const team = el.classList.contains('team-swiper')
    return new Swiper(el, {
      modules: [Autoplay, FreeMode],
      spaceBetween: 12,
      slidesPerView: 'auto',
      observer: true,
      observeParents: true,
      freeMode: { enabled: true, momentum: false },
      allowTouchMove: true,
      grabCursor: team,
      speed: team ? (isMobileWidth() ? 3500 : 10000) : 8000,
      autoplay: reduced ? false : { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: team },
      on: { touchEnd: (s) => void (!reduced && s.autoplay?.start()) },
    })
  })
  return () => instances.forEach((s) => s.destroy(true, true))
}

function filters(root: HTMLElement): Cleanup {
  const offs: Cleanup[] = []
  all(root, 'button').forEach((btn) => {
    const group = btn.parentElement
    if (!group || group.dataset.filterReady || btn.children.length !== 2 || !/^Все$/.test(btn.children[0]!.textContent!.trim())) return
    group.dataset.filterReady = '1'
    const buttons = all<HTMLButtonElement>(group, ':scope > button')
    const blogCards = all(root, '[data-blog-card]')
    const caseCards = blogCards.length ? [] : all(root, 'a.case_card')
    const activate = (active: HTMLButtonElement) => {
      const label = active.children[0]!.textContent!.trim()
      buttons.forEach((b) => {
        const on = b === active
        b.classList.toggle('bg-[var(--Foreground-default)]', on)
        b.classList.toggle('text-white', on)
        b.classList.toggle('bg-[#A1A7B31A]', !on)
        b.classList.toggle('text-[var(--Foreground-default)]', !on)
      })
      if (blogCards.length) {
        const tag = '#' + label.replace(/\s+/g, '-')
        blogCards.forEach((c) => {
          const show = label === 'Все' || (c.dataset.blogTags || '').split('|').includes(tag)
          c.style.display = show ? '' : 'none'
        })
      } else {
        caseCards.forEach((c) => {
          const tags = all(c, '.case_tag').map((t) => t.textContent!.trim())
          c.style.display = label === 'Все' || tags.includes(label) ? '' : 'none'
        })
      }
      refreshScroll()
    }
    buttons.forEach((b) => offs.push(on(b, 'click', () => activate(b))))
  })
  return () => offs.forEach((f) => f())
}

function forms(root: HTMLElement): Cleanup {
  const { showSuccess, openForm } = useUi()
  const required = 'Поле обязательно для заполнения'
  const offs: Cleanup[] = []
  all(root, '.the_form_parent').forEach((parent) => {
    const form = parent.querySelector('form')
    if (!form) return
    form.noValidate = true
    const light = !!form.querySelector('.offcanvas_form_input')
    const errorClass = light ? 'error_text offcanvas_error_text' : 'error_text'
    const checkbox = form.querySelector<HTMLElement>('.privacy_checkbox')
    const checkboxIcon = checkbox?.querySelector('span')
    const emptyIcon = checkboxIcon?.innerHTML ?? ''
    let checked = false
    let sending = false

    const setChecked = (v: boolean, error = false) => {
      checked = v
      if (!checkbox || !checkboxIcon) return
      checkbox.classList.toggle('privacy_checkbox_checked', v)
      if (light) checkbox.classList.toggle('offcanvas_privacy_checkbox_checked', v)
      checkboxIcon.innerHTML = v
        ? '<svg width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" rx="4" fill="white"/><path d="M11.5503 19.6538L6.21582 14.3193L7.28482 13.2501L11.5503 17.5156L20.7158 8.3501L21.7848 9.41935L11.5503 19.6538Z" fill="#1F1F1F"/></svg>'
        : error
          ? '<svg width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="27" height="27" rx="3.5" fill="white" fill-opacity="0.1"/><rect x="0.5" y="0.5" width="27" height="27" rx="3.5" stroke="#FF453A"/></svg>'
          : emptyIcon
    }

    const setError = (field: HTMLElement, msg: string | null) => {
      const box = field.parentElement!
      box.querySelector(':scope > .error_text')?.remove()
      field.classList.toggle('error_input', !!msg)
      if (msg) box.insertAdjacentHTML('beforeend', `<div class="${errorClass}">${msg}</div>`)
    }

    const consentError = (show: boolean) => {
      form.querySelector(':scope > .consent-error')?.remove()
      if (show) form.insertAdjacentHTML('beforeend', `<div class="${errorClass} consent-error">Необходимо согласие на обработку данных</div>`)
    }

    if (checkbox) {
      checkbox.setAttribute('role', 'checkbox')
      checkbox.tabIndex = 0
      offs.push(
        on(checkbox, 'click', () => {
          setChecked(!checked)
          consentError(false)
        }),
      )
    }

    all(form, '.the_form_budget').forEach((group) => {
      const multi = /стек/i.test(group.querySelector('.the_form_budget_title')?.textContent || '')
      const selected = light ? 'offcanvas_selected_budget_btn' : 'selected_budget_btn'
      all(group, '.the_form_budget_button').forEach((b) => {
        b.setAttribute('role', 'button')
        b.tabIndex = 0
        offs.push(
          on(b, 'click', () => {
            const was = b.classList.contains(selected)
            if (!multi) all(group, '.the_form_budget_button').forEach((x) => x.classList.remove(selected))
            b.classList.toggle(selected, !was)
          }),
        )
      })
    })

    const vacancies = [...new Set(all(root, '.services_accordion_header_title').map((t) => t.textContent?.trim() || ''))].filter(Boolean)
    const selects = all(form, 'div.the_form_input').map((box) => {
      const label = box.querySelector<HTMLElement>('span')!
      const placeholder = label.textContent || ''
      const state = { box, placeholder, value: '', set: (v: string) => {} }
      const list = document.createElement('div')
      list.className = 'form-select-list'
      list.hidden = true
      vacancies.forEach((v) => {
        const opt = document.createElement('div')
        opt.className = 'form-select-option'
        opt.textContent = v
        list.appendChild(opt)
      })
      box.after(list)
      state.set = (v: string) => {
        state.value = v
        label.textContent = v || placeholder
        label.classList.toggle('text-[#FFFFFF99]', !v)
        if (v) setError(box, null)
      }
      box.style.cursor = 'pointer'
      offs.push(
        on(box, 'click', () => (list.hidden = !list.hidden)),
        on(list, 'click', (e: MouseEvent) => {
          const opt = (e.target as HTMLElement).closest('.form-select-option')
          if (!opt) return
          state.set(opt.textContent || '')
          list.hidden = true
        }),
        on(document, 'click', (e: MouseEvent) => {
          if (!box.parentElement!.contains(e.target as Node)) list.hidden = true
        }),
      )
      return state
    })

    all<HTMLInputElement>(form, 'input[type=file]').forEach((input) => {
      const trigger = input.previousElementSibling as HTMLElement | null
      const label = trigger?.querySelector<HTMLElement>('span:last-child')
      const initial = label?.textContent || ''
      if (trigger) offs.push(on(trigger, 'click', () => input.click()))
      offs.push(on(input, 'change', () => label && (label.textContent = input.files?.[0]?.name || initial)))
      offs.push(on(form, 'reset', () => label && (label.textContent = initial)))
    })

    const fields = all<HTMLInputElement | HTMLTextAreaElement>(form, 'input:not([type=file]), textarea')
    fields.forEach((f) => offs.push(on(f, 'input', () => setError(f, null))))

    const submit = async (e?: Event) => {
      e?.preventDefault()
      if (sending) return
      let firstInvalid: HTMLElement | null = null
      fields.forEach((f) => {
        const invalid = (f.placeholder || '').trim().endsWith('*') && !f.value.trim()
        setError(f, invalid ? required : null)
        if (invalid && !firstInvalid) firstInvalid = f
      })
      selects.forEach((s) => {
        const invalid = s.placeholder.trim().endsWith('*') && !s.value
        setError(s.box, invalid ? required : null)
        if (invalid && !firstInvalid) firstInvalid = s.box
      })
      if (firstInvalid) return (firstInvalid as HTMLElement).focus()
      if (checkbox && !checked) {
        setChecked(false, true)
        consentError(true)
        return
      }
      sending = true
      const btn = parent.querySelector<HTMLElement>('.the_form_btn button')
      const label = btn?.textContent
      if (btn) btn.textContent = 'Отправляется...'
      await new Promise((r) => setTimeout(r, 600))
      if (btn) btn.textContent = label ?? 'Отправить заявку'
      sending = false
      form.reset()
      fields.forEach((f) => (f.value = ''))
      selects.forEach((s) => s.set(''))
      all(form, '.selected_budget_btn, .offcanvas_selected_budget_btn').forEach((b) => b.classList.remove('selected_budget_btn', 'offcanvas_selected_budget_btn'))
      setChecked(false)
      showSuccess()
    }

    offs.push(on(form, 'submit', submit))
    const btn = parent.querySelector('.the_form_btn')
    if (btn) offs.push(on(btn, 'click', submit))

    if (selects[0])
      all(root, '.services_accordion_body button').forEach((b) => {
        if (b.textContent?.trim() !== 'Откликнуться') return
        offs.push(
          on(b, 'click', () => {
            const title = b.closest('.services_accordion_body')?.previousElementSibling?.querySelector('.services_accordion_header_title')?.textContent?.trim() || ''
            selects[0]!.set(title)
            const target = root.querySelector('#form-section')
            if (target && window.matchMedia('(min-width: 768px)').matches) scrollToElement(target, 80)
            else openForm()
          }),
        )
      })
  })
  all(root, '.form_parent_left .the_form_btn').forEach((b) => offs.push(on(b, 'click', () => openForm())))
  return () => offs.forEach((f) => f())
}

function caseCards(root: HTMLElement): Cleanup {
  const offs: Cleanup[] = []
  const mobile = window.matchMedia('(max-width: 767px)').matches
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const card = e.target as HTMLElement & { _show?: () => void; _hide?: () => void }
        e.isIntersecting ? card._show?.() : card._hide?.()
      }),
    { threshold: 0.6 },
  )
  all(root, 'video[data-video="card"]').forEach((v) => {
    const video = v as HTMLVideoElement
    const card = video.closest<HTMLElement & { _show?: () => void; _hide?: () => void }>('a.case_card')
    const poster = (video.parentElement?.querySelector(':scope > .absolute.inset-0') ?? video.parentElement?.querySelector(':scope > img')) as HTMLElement | null
    if (!card || !poster) return
    let playing = false
    const ensureSrc = () => {
      if (!video.getAttribute('src')) {
        video.preload = 'auto'
        video.src = video.dataset.src!
      }
    }
    const show = () => {
      if (playing) return
      playing = true
      ensureSrc()
      gsap.killTweensOf([video, poster])
      gsap.set(video, { opacity: 0, visibility: 'visible' })
      video.currentTime = 0
      video.play().catch(() => (playing = false))
      gsap.to(video, { opacity: 1, duration: 0.3, ease: 'power2.inOut', onComplete: () => void gsap.to(poster, { opacity: 0, duration: 0.2 }) })
    }
    const hide = () => {
      playing = false
      gsap.killTweensOf([video, poster])
      gsap.to(poster, { opacity: 1, duration: 0.3, ease: 'power2.inOut', onComplete: () => void gsap.to(video, { opacity: 0, duration: 0.2, onComplete: () => video.pause() }) })
    }
    video.classList.remove('opacity-0')
    gsap.set(video, { opacity: 0 })
    if (mobile) {
      card._show = show
      card._hide = hide
      observer.observe(card)
    } else {
      offs.push(on(card, 'mouseenter', show), on(card, 'mouseleave', hide))
    }
  })
  return () => {
    observer.disconnect()
    offs.forEach((f) => f())
  }
}

function lazyVideos(root: HTMLElement): Cleanup {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const video = e.target as HTMLVideoElement
        if (e.isIntersecting) {
          if (!video.getAttribute('src')) {
            video.preload = 'auto'
            video.src = video.dataset.src!
            video.addEventListener(
              'loadeddata',
              () => {
                video.classList.remove('opacity-0')
                video.classList.add('opacity-100')
              },
              { once: true },
            )
          }
          video.muted = true
          video.play().catch(() => {})
        } else video.pause()
      }),
    { rootMargin: '200px 0px' },
  )
  all(root, 'video[data-video="bg"]').forEach((v) => observer.observe(v))
  return () => observer.disconnect()
}

function backgroundVideos(root: HTMLElement): Cleanup {
  if (!window.matchMedia('(min-width: 1280px)').matches) return () => {}
  const probe = document.createElement('video')
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const box = e.target as HTMLElement
        let video = box.querySelector<HTMLVideoElement>(':scope > video')
        if (!e.isIntersecting) return video?.pause()
        if (!video) {
          const conf = bgVideos[box.dataset.bgvideo as keyof typeof bgVideos]
          if (!conf) return
          const source = conf.sources.find((s) => probe.canPlayType(s.type) !== '') ?? conf.sources[conf.sources.length - 1]!
          video = document.createElement('video')
          Object.assign(video, { loop: true, muted: true, playsInline: true, preload: 'auto' })
          video.className = 'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 opacity-0'
          video.src = source.src
          video.addEventListener(
            'loadeddata',
            () => {
              video!.classList.replace('opacity-0', 'opacity-100')
              const img = box.querySelector('picture img')
              img?.classList.remove('opacity-100')
              img?.classList.add('opacity-0')
            },
            { once: true },
          )
          box.appendChild(video)
        }
        video.play().catch(() => {})
      }),
    { rootMargin: '200px 0px' },
  )
  all(root, '[data-bgvideo]').forEach((b) => observer.observe(b))
  return () => observer.disconnect()
}

function circleSections(root: HTMLElement): Cleanup {
  const offs: Cleanup[] = []
  all(root, '.curved_parent').forEach((parent) => {
    const bg = parent.querySelector<HTMLElement>(':scope > .work_bg')
    const section = parent.querySelector<HTMLElement>(':scope > .circle_section')
    if (!bg || !section) return
    const inner = section.firstElementChild as HTMLElement | null
    const stats = all(parent, '.stats_line span')

    if (isLite()) {
      parent.classList.replace('overflow-hidden', 'overflow-visible')
      bg.className = 'pointer-events-none z-0 h-screen w-full overflow-hidden sticky top-0 block'
      bg.style.clipPath = 'none'
      section.classList.replace('h-screen', 'h-auto')
      section.classList.add('mt-[-100vh]')
      const pick = (cls: string) => all(section, `.${cls}`).map((el) => el.textContent?.trim() || '')
      const [t1 = '', v1 = '', d1 = ''] = pick('first-text')
      const [t2 = '', v2 = '', d2 = ''] = pick('second-text')
      const block = (t: string, v: string, d: string, extra = '') => {
        const el = document.createElement('div')
        el.className = `flex flex-col gap-4 text-center items-center ${extra}`
        el.innerHTML = `<div class="font-main font-[450] text-[15px] leading-[145%] sm:text-[16px] sm:leading-[150%] text-[#FFFFFF99]"><h2></h2></div><div class="font-main-medium font-[525] text-[28px] leading-[110%] tracking-[-1.2px] sm:text-[36px] sm:leading-[105%] sm:tracking-[-1px] md:text-[42px] md:leading-[100%] md:tracking-[-1.81px] text-[#FFFFFF]"></div><div class="max-w-[650px]"><div class="font-main font-[450] text-[15px] leading-[145%] sm:text-[16px] sm:leading-[150%] text-[#FFFFFF]"></div></div>`
        el.querySelector('h2')!.textContent = t
        el.children[1]!.textContent = v
        el.querySelector('.max-w-\\[650px\\] > div')!.textContent = d
        return el
      }
      if (inner) {
        const wrap = document.createElement('div')
        wrap.className = 'w-full flex flex-col gap-10 xs:gap-8 mt-[20vh] xs:px-4 sm:px-6 md:px-9 lg:px-10 xl:px-15'
        wrap.append(block(t1, v1, d1), block(t2, v2, d2, 'mt-20'))
        inner.replaceChildren(wrap)
      }
      return
    }

    const w = window.innerWidth
    const radius = w < 768 ? '130px' : w < 1024 ? '150px' : '200px'
    const firsts = all(section, '.first-text')
    const seconds = all(section, '.second-text')
    const descs = all(section, '.description-text')
    const splits = [...firsts, ...seconds].map((el) => new SplitText(el, { type: 'chars', charsClass: 'char' }))
    const firstChars = splits.slice(0, firsts.length).flatMap((s) => s.chars)
    const secondChars = splits.slice(firsts.length).flatMap((s) => s.chars)
    const ctx = gsap.context(() => {
      gsap.set([...firsts, ...seconds], { opacity: 1, visibility: 'visible' })
      gsap.set(firstChars, { y: 0, opacity: 1 })
      gsap.set(secondChars, { y: 80, opacity: 0 })
      if (descs[0]) gsap.set(descs[0], { opacity: 1, y: 0 })
      if (descs[1]) gsap.set(descs[1], { opacity: 0, y: 40 })
      gsap.set(bg, { clipPath: `circle(${radius} at 50% 50%)` })
      const vh = window.innerHeight
      ScrollTrigger.create({ trigger: parent, start: 'top top', end: 'bottom bottom', pin: bg, pinSpacing: false, anticipatePin: 1 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(stats.length ? 2.5 : 1.8) * vh}`,
          scrub: 1,
          pin: section,
          pinSpacing: false,
          anticipatePin: 1,
        },
      })
      tl.to(firstChars, { y: -40, opacity: 0, stagger: 0.015, ease: 'power3.in' }, 0)
      if (descs[0]) tl.to(descs[0], { opacity: 0, y: -30, ease: 'power2.in' }, 0)
      tl.to(secondChars, { y: 0, opacity: 1, stagger: 0.015, ease: 'power3.out' }, 'firstDone+=0')
      if (descs[1]) tl.to(descs[1], { opacity: 1, y: 0, ease: 'power2.out' }, 'firstDone+=0')
      if (inner) tl.to(inner, { opacity: 0, ease: 'power2.out', duration: 1 }, 4)
      tl.to(bg, { clipPath: 'circle(350vh at 50% 50%)', ease: 'power2.inOut', duration: 8 }, 4)
      if (stats.length) {
        gsap.set(stats, { y: '100%' })
        gsap.to(stats, {
          y: '0%',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: stats[0]!.closest('.work_stats') ?? parent, start: 'top 70%', toggleActions: 'play none none reverse' },
        })
      }
    }, parent)
    offs.push(() => {
      ctx.revert()
      splits.forEach((s) => s.revert())
    })
  })
  return () => offs.forEach((f) => f())
}

function heroReveal(root: HTMLElement): Cleanup {
  const content = root.querySelector<HTMLElement>('.hero__content.opacity-0')
  if (!content) return () => {}
  content.classList.remove('opacity-0')
  const spans = all(content, '.line > span')
  if (!spans.length || isMobileWidth() || prefersReducedMotion()) return () => {}
  const ctx = gsap.context(() => {
    all(content, '.line').forEach((l) => (l.style.overflow = 'hidden'))
    gsap.from(spans, { y: 86, opacity: 0, duration: 1.4, stagger: 0.05, ease: 'power2.out', delay: 0.3 })
  }, content)
  return () => ctx.revert()
}

function promotionTexts(root: HTMLElement): Cleanup {
  if (isLite()) return () => {}
  const offs: Cleanup[] = []
  all(root, '.promotion_text').forEach((el) => {
    if (!el.textContent?.trim()) return
    const [r = 0, g = 0, b = 0] = (getComputedStyle(el).color.match(/\d+/g) ?? []).map(Number)
    const light = r + g + b > 600
    const split = new SplitText(el, { type: 'lines', linesClass: 'split-line' })
    const lines = split.lines
    const ctx = gsap.context(() => {
      gsap.set(lines, {
        backgroundImage: `linear-gradient(to right, ${light ? '#FFFFFF' : '#202024'} 50%, #A1A7B380 50%)`,
        backgroundSize: '200% 100%',
        backgroundPositionX: '100%',
        color: 'transparent',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        display: 'inline-block',
        lineHeight: 1,
        textAlign: 'left',
      })
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top center', end: `+=${70 * lines.length}`, scrub: true, invalidateOnRefresh: true } })
      lines.forEach((line) => tl.to(line, { backgroundPositionX: 0, ease: 'none', duration: 0.1 }))
    }, el)
    offs.push(() => {
      ctx.revert()
      split.revert()
    })
  })
  return () => offs.forEach((f) => f())
}

function workPins(root: HTMLElement): Cleanup {
  const offs: Cleanup[] = []
  all(root, '.work_bg').forEach((bg) => {
    const parent = bg.parentElement
    const stats = parent?.querySelector<HTMLElement>(':scope > .work_stats')
    if (!parent || !stats || parent.classList.contains('curved_parent')) return
    const box = bg.querySelector<HTMLElement>('[data-bgvideo]')
    if (isLite()) {
      bg.className = 'work_bg work_bg_stretch'
      box?.classList.remove('h-screen')
      box?.classList.add('min-h-full', 'h-full')
      return
    }
    const ios = /iPhone|iPod/i.test(navigator.userAgent)
    const fitBg = () => (bg.style.height = `${stats.scrollHeight}px`)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stats,
        start: 'top top',
        end: 'bottom top',
        pin: bg,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        ...(ios ? { pinType: 'fixed' as const } : {}),
        onRefresh: fitBg,
      })
      const spans = all(stats, '.company_stats_text .line span, .work_description .line span')
      const items = all(stats, '.work_list_item')
      const container = stats.querySelector('.work_list_container')
      if (!container) return
      const hidden = { opacity: 0, immediateRender: false, willChange: 'transform, opacity' }
      if (spans.length) gsap.set(spans, { y: 60, ...hidden })
      if (items.length) gsap.set(items, { y: 80, ...hidden })
      gsap.set(container, { y: 50, ...hidden })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stats, start: 'top center', scrub: ios ? 0.6 : 1.5, invalidateOnRefresh: true, fastScrollEnd: true, preventOverlaps: true, onRefresh: fitBg },
      })
      if (spans.length) tl.to(spans, { y: 0, opacity: 1, stagger: 0.1, duration: 4, ease: 'power2.out', delay: 0.5 })
      tl.to(container, { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 12.8)
      if (items.length) tl.to(items, { y: 0, opacity: 1, stagger: 0.15, duration: 4, ease: 'power2.out' }, 13.6)
      tl.to(container, { y: 0, duration: 32, ease: 'power2.inOut' }, 13.6)
      fitBg()
    }, parent)
    offs.push(() => ctx.revert())
  })
  return () => offs.forEach((f) => f())
}

function awardsBlock(root: HTMLElement): Cleanup {
  const body = root.querySelector<HTMLElement>('.awards_body') ?? root.querySelector<HTMLElement>('.award_video_layer')?.parentElement
  const layer = root.querySelector<HTMLElement>('.award_video_layer')
  const more = root.querySelector<HTMLElement>('.awards_more')
  const toggle = root.querySelector<HTMLElement>('.awards_more_toggle button')
  if (!body || !layer) return () => {}
  const offs: Cleanup[] = []
  const rows = () => all(body, '.awards_list')
  const [a, b] = all<HTMLVideoElement>(layer, 'video')
  let current = a
  let lastActive: number | null = null
  let expanded = false

  if (more) {
    gsap.set(more, { height: 0, overflow: 'hidden' })
    if (toggle)
      offs.push(
        on(toggle, 'click', () => {
          expanded = true
          more.classList.add('is-open')
          more.removeAttribute('inert')
          more.setAttribute('aria-hidden', 'false')
          toggle.parentElement!.style.display = 'none'
          gsap.set(more, { height: 'auto' })
          const to = more.scrollHeight
          gsap.fromTo(more, { height: 0 }, { height: to, duration: 0.55, ease: 'power2.out', onComplete: () => (gsap.set(more, { height: 'auto', overflow: 'visible' }), refreshScroll()) })
        }),
      )
  }

  const show = (src: string | null) => {
    if (!a || !b) return
    if (!src) {
      a.pause()
      b.pause()
      gsap.to([a, b], { opacity: 0, duration: 0.3 })
      return
    }
    if (current.getAttribute('src') === src) {
      current.play().catch(() => {})
      gsap.to(current, { opacity: 1, duration: 0.3 })
      return
    }
    const next = current === a ? b : a
    next.src = src
    next.muted = true
    next.play().catch(() => {})
    gsap.to(current, { opacity: 0, duration: 0.3 })
    gsap.to(next, { opacity: 1, duration: 0.3 })
    current = next
  }

  const update = () => {
    const mid = window.innerHeight / 2
    const box = body.getBoundingClientRect()
    if (box.bottom < mid || box.top > mid) {
      if (lastActive !== null) {
        lastActive = null
        rows().forEach((r) => r.classList.remove('active', 'bg-[#A1A7B31A]'))
        show(null)
        gsap.to(layer, { opacity: 0, duration: 0.6 })
      }
      return
    }
    let best = -1
    let dist = Infinity
    rows().forEach((row, i) => {
      if (!expanded && row.closest('.awards_more')) return
      const r = row.getBoundingClientRect()
      if (r.height < 1) return
      const d = Math.abs(r.top + r.height / 2 - mid)
      if (d < dist) {
        dist = d
        best = i
      }
    })
    if (best >= 0 && best !== lastActive) {
      lastActive = best
      rows().forEach((r, i) => {
        r.classList.toggle('active', i === best)
        r.classList.toggle('bg-[#A1A7B31A]', i === best)
      })
      show(awards[best]?.video ?? null)
      gsap.to(layer, { opacity: 1, duration: 0.6 })
    }
  }

  if (!window.matchMedia('(min-width: 1024px)').matches) return () => offs.forEach((f) => f())
  const ro = new ResizeObserver(() => (layer.style.height = `${body.clientHeight}px`))
  ro.observe(body)
  const ctx = gsap.context(() => {
    ScrollTrigger.create({ trigger: body, start: 'top center', end: 'bottom center', pin: layer, pinSpacing: false, anticipatePin: 1, scrub: true, onUpdate: update })
  }, body)
  offs.push(on(window, 'scroll', update, { passive: true }))
  update()
  return () => {
    ro.disconnect()
    ctx.revert()
    offs.forEach((f) => f())
  }
}

export function enhancePage(root: HTMLElement): Cleanup {
  const cleanups = [heroReveal, accordions, swipers, filters, forms, caseCards, lazyVideos, backgroundVideos, circleSections, workPins, promotionTexts, awardsBlock].map((fn) => {
    try {
      return fn(root)
    } catch (e) {
      console.error(e)
      return () => {}
    }
  })
  requestAnimationFrame(() => ScrollTrigger.refresh())
  return () => cleanups.reverse().forEach((f) => f())
}
