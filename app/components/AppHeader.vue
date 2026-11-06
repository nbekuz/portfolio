<script setup lang="ts">
import { gsap, ScrollSmoother } from '~/utils/gsap'
import { navigation, PHONE, PHONE_HREF, EMAIL, TELEGRAM, socials } from '~/data/site'

const { menuOpen } = useUi()
const scrolled = ref(false)
const menuRendered = ref(false)
const headerEl = ref<HTMLElement | null>(null)
const logoEl = ref<HTMLElement | null>(null)
const contactEl = ref<HTMLElement | null>(null)
const menuEl = ref<HTMLElement | null>(null)

const dark = computed(() => menuOpen.value || scrolled.value)

let threshold = 40
let lock = false
let ctx: gsap.Context | undefined

const onScroll = () => {
  if (menuOpen.value) {
    scrolled.value = true
    return
  }
  scrolled.value = window.scrollY > threshold
}

const openMenu = async () => {
  menuRendered.value = true
  menuOpen.value = true
  await nextTick()
  if (!menuEl.value) return
  gsap.killTweensOf(menuEl.value)
  gsap.set(menuEl.value, { clipPath: 'inset(0 0 100% 0)', opacity: 1 })
  gsap.to(menuEl.value, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power2.inOut' })
}

const closeMenu = () => {
  const done = () => {
    menuOpen.value = false
    menuRendered.value = false
    onScroll()
  }
  if (!menuEl.value) return done()
  gsap.killTweensOf(menuEl.value)
  gsap.to(menuEl.value, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power2.inOut', onComplete: done })
}

const toggleMenu = () => {
  if (lock) return
  lock = true
  setTimeout(() => (lock = false), 300)
  if (menuOpen.value) closeMenu()
  else openMenu()
}

watch(menuOpen, (open) => {
  document.body.classList.toggle('menu-open', open)
  const smoother = ScrollSmoother.get()
  if (smoother && window.innerWidth >= 1024) smoother.paused(open)
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && menuOpen.value) closeMenu()
}

onMounted(() => {
  threshold = window.innerWidth < 1024 ? 90 : 40
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)

  ctx = gsap.context(() => {
    gsap.set([logoEl.value, contactEl.value], { y: -50, opacity: 0 })
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .to(logoEl.value, { y: 0, opacity: 1, delay: 0.3, duration: 0.8 })
      .to(contactEl.value, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')

    headerEl.value?.querySelectorAll<HTMLElement>('.header__button').forEach((btn) => {
      btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.1, rotation: 5, duration: 0.3 }))
      btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, rotation: 0, duration: 0.3 }))
    })
  }, headerEl.value!)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.body.classList.remove('menu-open')
  ctx?.revert()
})
</script>

<template>
  <header
    ref="headerEl"
    class="h-[60px] xl:h-[80px] header"
    :class="{ 'header--menu-open': menuOpen, 'header--scrolled': scrolled }"
  >
    <div class="header__container px-4 sm:px-6 md:px-9 lg:px-10 xl:px-15">
      <div ref="logoEl" class="header__logo md:mr-[40px]">
        <a href="/" aria-label="Else Digital">
          <IconsLogoIcon class="w-[68px] h-[24px] 2xl:w-[85px] 2xl:h-[30px]" :class="dark ? 'text-[#202024]' : 'text-white'" />
        </a>
      </div>

      <div class="hidden md:flex">
        <nav class="navigation w-full md:border-none lg:border-none xl:border-none sm:border-t sm:border-[#A1A7B34D] xs:border-t xs:border-[#A1A7B34D]">
          <ul
            class="navigation__list w-full flex flex-col items-center justify-end gap-6 pl-0 sm:flex-col md:flex-row md:pl-[22px] lg:pl-[187px] xl:pl-[300px] md:gap-[20px] lg:gap-[20px] xl:gap-[20px] xs:gap-[0] sm:gap-[0]"
          >
            <li
              v-for="item in navigation"
              :key="item.label"
              class="navigation__item w-full md:border-none lg:border-none xl:border-none sm:border-b sm:border-[#A1A7B34D] xs:border-b xs:border-[#A1A7B34D] sm:py-4 xs:py-[12px]"
            >
              <a
                class="navigation__link xl:text-[20px] lg:text-[20px] md:text-[20px] xs:text-[24px] sm:text-[32px] flex text-right items-start justify-end sm:justify-start xs:justify-start"
                :href="item.href"
              >
                <LinkText :text="item.label" />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div ref="contactEl" class="header__contact gap-3 lg:gap-4 xl:gap-7">
        <a :href="PHONE_HREF" class="hidden xl:flex lg:flex header__phone"><LinkText :text="PHONE" /></a>
        <a :href="PHONE_HREF" aria-label="Позвонить" class="hidden xl:hidden lg:hidden md:flex sm:flex xs:flex header__button hover-tg">
          <svg v-if="dark" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none">
            <rect width="36" height="36" fill="#fff" rx="18" />
            <rect width="36" height="36" fill="#A1A7B3" fill-opacity="0.1" rx="18" />
            <path
              fill="#202024"
              d="M24.625 25.5q-2.604 0-5.146-1.135t-4.625-3.22q-2.083-2.082-3.219-4.624-1.134-2.542-1.135-5.146 0-.375.25-.625a.85.85 0 0 1 .625-.25h3.375q.291 0 .52.198a.76.76 0 0 1 .272.469l.541 2.916q.042.334-.02.563a.9.9 0 0 1-.23.396l-.978.988c-.619.625-.77 1.595-.242 2.3q.093.122.19.243.572.719 1.26 1.385a15 15 0 0 0 1.571 1.364c.726.542 1.729.399 2.37-.242l.871-.872q.187-.187.49-.28.302-.094.593-.053l2.875.583a.97.97 0 0 1 .48.302.73.73 0 0 1 .187.49v3.375q0 .375-.25.625a.85.85 0 0 1-.625.25"
            />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none">
            <rect width="36" height="36" fill="#fff" fill-opacity="0.3" rx="18" />
            <path
              fill="#fff"
              d="M24.625 25.5q-2.604 0-5.146-1.135t-4.625-3.22q-2.083-2.082-3.219-4.624-1.134-2.542-1.135-5.146 0-.375.25-.625a.85.85 0 0 1 .625-.25h3.375q.291 0 .52.198a.76.76 0 0 1 .272.469l.541 2.916q.042.334-.02.563a.9.9 0 0 1-.23.396l-.978.988c-.619.625-.77 1.595-.242 2.3q.093.122.19.243.572.719 1.26 1.385a15 15 0 0 0 1.571 1.364c.726.542 1.729.399 2.37-.242l.871-.872q.187-.187.49-.28.302-.094.593-.053l2.875.583a.97.97 0 0 1 .48.302.73.73 0 0 1 .187.49v3.375q0 .375-.25.625a.85.85 0 0 1-.625.25"
            />
          </svg>
        </a>
        <a :href="TELEGRAM" target="_blank" aria-label="Написать в Telegram" class="hidden lg:flex md:flex sm:flex xs:flex header__button hover-tg header_tg">
          <div class="w-9 h-9 xl:w-10 xl:h-10">
            <svg v-if="dark" xmlns="http://www.w3.org/2000/svg" fill="none" class="w-full h-full" viewBox="0 0 40 40" width="40" height="40">
              <rect width="40" height="40" fill="#A1A7B3" fill-opacity="0.1" rx="20" />
              <path
                fill="#202024"
                fill-rule="evenodd"
                d="M10.223 19.932c5.099-2.25 8.494-3.747 10.198-4.472 4.852-2.059 5.872-2.414 6.527-2.429.146 0 .466.03.685.208.175.148.219.34.248.488s.058.46.029.696c-.262 2.814-1.399 9.64-1.982 12.78-.247 1.332-.728 1.777-1.194 1.821-1.02.09-1.792-.681-2.768-1.332-1.545-1.022-2.404-1.66-3.905-2.666-1.734-1.155-.612-1.792.379-2.828.262-.267 4.735-4.413 4.822-4.783.015-.045.015-.223-.087-.311-.102-.09-.248-.06-.364-.03-.16.03-2.608 1.688-7.372 4.96-.7.49-1.326.726-1.894.712-.627-.015-1.822-.356-2.725-.652-1.093-.356-1.967-.548-1.894-1.17.044-.326.48-.651 1.297-.992"
                clip-rule="evenodd"
              />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" class="w-full h-full" viewBox="0 0 40 40" width="40" height="40">
              <g fill="#fff">
                <path fill-opacity="0.3" d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20" />
                <path
                  fill-rule="evenodd"
                  d="M10.223 19.929c5.099-2.25 8.494-3.746 10.198-4.472 4.852-2.059 5.872-2.414 6.527-2.429.146 0 .466.03.685.208.175.148.219.34.248.488s.058.46.029.696c-.262 2.814-1.399 9.64-1.982 12.78-.247 1.333-.728 1.777-1.194 1.821-1.02.09-1.792-.68-2.768-1.332-1.545-1.022-2.404-1.659-3.905-2.666-1.734-1.155-.612-1.792.379-2.828.262-.267 4.735-4.413 4.822-4.783.015-.045.015-.223-.087-.311-.102-.09-.248-.06-.364-.03-.16.03-2.608 1.688-7.372 4.96-.7.49-1.326.726-1.894.712-.627-.015-1.822-.356-2.725-.652-1.093-.355-1.967-.548-1.894-1.17.044-.326.48-.651 1.297-.992"
                  clip-rule="evenodd"
                />
              </g>
            </svg>
          </div>
        </a>
        <button
          type="button"
          class="header__burger inline-flex md:hidden"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          :aria-expanded="menuOpen"
          @click="toggleMenu"
        >
          <div class="burger flex justify-center items-center flex-col gap-[10px] w-[36px] h-[36px] transition-colors duration-300">
            <div
              class="burger_line h-[1px] w-[36px] transition-all duration-300"
              :class="menuOpen ? 'rotate-45 translate-y-[18px] bg-[var(--Foreground-default)]' : scrolled ? 'bg-[var(--Foreground-default)]' : 'bg-[var(--text-light)]'"
            />
            <div
              class="burger_line h-[1px] w-[36px] transition-all duration-300"
              :class="menuOpen ? '-rotate-45 -translate-y-[18px] bg-[var(--Foreground-default)]' : scrolled ? 'bg-[var(--Foreground-default)]' : 'bg-[var(--text-light)]'"
            />
          </div>
        </button>
      </div>
    </div>

    <div v-if="menuRendered" ref="menuEl" class="header_menu w-full block md:flex lg:flex xl:flex py-4 sm:pt-[60px] xs:pt-[60px] top-0 pb-0 bg-white">
      <div class="sm:p-[36px_24px] xs:p-[36px_16px] flex sm:flex xs:flex md:hidden lg:hidden xl:hidden">
        <div class="flex flex-col w-full">
          <nav class="navigation w-full sm:border-t sm:border-[#A1A7B34D] xs:border-t xs:border-[#A1A7B34D]">
            <ul class="navigation__list w-full flex flex-col items-center justify-end gap-6 pl-0 sm:flex-col xs:gap-[0] sm:gap-[0]">
              <li
                v-for="item in navigation"
                :key="item.label"
                class="navigation__item w-full sm:border-b sm:border-[#A1A7B34D] xs:border-b xs:border-[#A1A7B34D] sm:py-4 xs:py-[12px]"
              >
                <a
                  class="navigation__link xs:text-[24px] sm:text-[32px] flex text-right items-start justify-end sm:justify-start xs:justify-start"
                  :href="item.href"
                >
                  <LinkText :text="item.label" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="sm:p-[36px_24px] xs:p-[36px_16px] flex sm:flex xs:flex md:hidden lg:hidden xl:hidden gap-[24px] flex-col">
        <div class="flex flex-col gap-[16px]">
          <div class="for_contact">Для связи</div>
          <div class="flex flex-col gap-[8px]">
            <a class="for_contact_text" :href="PHONE_HREF">{{ PHONE }}</a>
            <a class="for_contact_text" :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
            <a target="_blank" class="for_contact_text" :href="TELEGRAM">Telegram</a>
          </div>
        </div>
        <div class="flex flex-col gap-[16px]">
          <div class="for_contact">Соцсети</div>
          <SocialIcons class="flex items-center justify-start gap-[8px]" :links="socials" />
        </div>
      </div>
    </div>
  </header>
</template>
