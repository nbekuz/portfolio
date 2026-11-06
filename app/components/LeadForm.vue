<script setup lang="ts">
import { budgets, ext } from '~/data/site'

const props = withDefaults(defineProps<{ blackText?: boolean }>(), { blackText: false })
const emit = defineEmits<{ success: [] }>()

const { showSuccess } = useUi()

const inputClass =
  'the_form_input p-5 text-[20px] rounded-2xl xl:p-5 xl:text-xl lg:py-4 lg:px-5 lg:text-base md:py-4 md:px-5 md:text-base sm:py-4 sm:px-5 sm:text-base xs:py-4 xs:px-5 xs:text-[15px]'
const textareaClass =
  'the_form_input the_form_input_textarea min-h-[152px] rounded-2xl p-5 xl:p-5 xl:h-[152px] lg:p-4 lg:h-[128px] md:p-4 md:h-[128px] sm:p-4 sm:h-[128px] xs:p-4 xs:h-[120px] xl:text-xl lg:text-base md:text-base sm:text-base xs:text-[15px]'
const budgetClass =
  'the_form_budget_button rounded-xl px-4 py-3 xl:text-base xl:rounded-xl xl:px-4 xl:py-3 lg:text-sm lg:rounded-xl lg:px-4 lg:py-3 md:text-sm md:rounded-xl md:px-4 md:py-3 sm:text-sm sm:rounded-xl sm:px-4 sm:py-3 xs:text-[14px] xs:rounded-lg xs:px-3 xs:py-2'
const required = 'Поле обязательно для заполнения'

const form = reactive({ name: '', contact: '', project: '', budget: null as string | null, isChecked: false })
const errors = reactive({ name: false, contact: false, isChecked: false })
const sending = ref(false)
const nameEl = ref<HTMLInputElement | null>(null)
const contactEl = ref<HTMLInputElement | null>(null)

const textColor = computed(() => (props.blackText ? 'text-var(--Foreground-default)' : 'text-white'))

const toggleCheck = () => {
  form.isChecked = !form.isChecked
  errors.isChecked = false
}

const reset = () => {
  Object.assign(form, { name: '', contact: '', project: '', budget: null, isChecked: false })
  Object.assign(errors, { name: false, contact: false, isChecked: false })
}

const submit = async () => {
  if (sending.value) return
  errors.name = !form.name.trim()
  errors.contact = !form.contact.trim()
  errors.isChecked = !form.isChecked
  if (errors.name) return nameEl.value?.focus()
  if (errors.contact) return contactEl.value?.focus()
  if (errors.isChecked) return
  sending.value = true
  await new Promise((r) => setTimeout(r, 600))
  sending.value = false
  reset()
  emit('success')
  showSuccess()
}
</script>

<template>
  <div class="the_form_parent gap-12 xl:gap-12 lg:gap-10 md:gap-10 sm:gap-9 xs:gap-9">
    <form class="the_form gap-6 flex flex-col" novalidate @submit.prevent="submit">
      <div class="the_form_inputs gap-3 flex flex-col">
        <div class="flex flex-col gap-[4px]">
          <input
            ref="nameEl"
            v-model="form.name"
            :class="[inputClass, { error_input: errors.name, offcanvas_form_input: blackText }]"
            type="text"
            name="name"
            autocomplete="name"
            placeholder="Имя*"
            @input="errors.name = false"
          />
          <div v-if="errors.name" class="error_text" :class="{ offcanvas_error_text: blackText }">{{ required }}</div>
        </div>
        <div class="flex flex-col gap-[4px]">
          <input
            ref="contactEl"
            v-model="form.contact"
            :class="[inputClass, { error_input: errors.contact, offcanvas_form_input: blackText }]"
            type="text"
            name="contact"
            placeholder="Телефон, почта или telegram*"
            @input="errors.contact = false"
          />
          <div v-if="errors.contact" class="error_text" :class="{ offcanvas_error_text: blackText }">{{ required }}</div>
        </div>
        <div class="flex flex-col gap-[4px]">
          <textarea
            v-model="form.project"
            name="project"
            placeholder="Расскажите о проекте: цели, задачи, сроки и т.д."
            :class="[textareaClass, { offcanvas_form_input: blackText }]"
          />
        </div>
      </div>
      <div class="the_form_budget gap-3 flex flex-col">
        <div class="the_form_budget_title text-[20px] xl:text-xl lg:text-base md:text-base sm:text-base xs:text-base" :class="{ offcanvas_budget_title: blackText }">Бюджет</div>
        <div class="the_form_budget_buttons gap-2 flex flex-wrap">
          <div
            v-for="b in budgets"
            :key="b"
            role="button"
            tabindex="0"
            :aria-pressed="form.budget === b"
            :class="[
              budgetClass,
              { offcanvas_budget_button: blackText },
              form.budget === b && (blackText ? 'offcanvas_selected_budget_btn' : 'selected_budget_btn'),
            ]"
            @click="form.budget = form.budget === b ? null : b"
            @keydown.enter.space.prevent="form.budget = form.budget === b ? null : b"
          >
            {{ b }}
          </div>
        </div>
      </div>
      <div class="privacy_policies gap-3 flex">
        <div
          role="checkbox"
          tabindex="0"
          :aria-checked="form.isChecked"
          class="privacy_checkbox w-7 h-7 xl:w-7 xl:h-7 lg:w-7 lg:h-7 md:w-6 md:h-6 sm:w-6 sm:h-6 xs:w-6 xs:h-6"
          :class="{
            offcanvas_privacy_checkbox: blackText,
            offcanvas_privacy_checkbox_checked: blackText && form.isChecked,
            privacy_checkbox_checked: form.isChecked,
          }"
          @click="toggleCheck"
          @keydown.enter.space.prevent="toggleCheck"
        >
          <span class="inline-flex">
            <svg v-if="form.isChecked" width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="white" />
              <path d="M11.5503 19.6538L6.21582 14.3193L7.28482 13.2501L11.5503 17.5156L20.7158 8.3501L21.7848 9.41935L11.5503 19.6538Z" fill="#1F1F1F" />
            </svg>
            <svg v-else-if="errors.isChecked" width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="27" height="27" rx="3.5" fill="white" fill-opacity="0.1" />
              <rect x="0.5" y="0.5" width="27" height="27" rx="3.5" stroke="#FF453A" />
            </svg>
            <svg v-else width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="27" height="27" rx="3.5" stroke="white" stroke-opacity="0.15" />
            </svg>
          </span>
        </div>
        <div class="font-main text-[14px] mt-1 xl:text-sm lg:text-xs md:text-xs sm:text-xs xs:text-xs">
          <span :class="textColor" class="opacity-[0.6]">Я ознакомлен с </span>
          <span :class="textColor">
            <a class="underline inline-block py-1 -my-1" :href="ext('/privacy-policy/')" target="_blank">политикой конфиденциальности</a><br />
            <a class="underline inline-block py-1 -my-1" :href="ext('/privacy-policy/')" target="_blank">и даю согласие на обработку персональных данных</a>
          </span>
        </div>
      </div>
      <div v-if="errors.isChecked" class="error_text" :class="{ offcanvas_error_text: blackText }">Необходимо согласие на обработку данных</div>
      <button type="submit" class="hidden" tabindex="-1" aria-hidden="true" />
    </form>
    <div
      class="the_form_btn py-4 px-[28px] rounded-2xl gap-1 text-[20px] xl:py-4 xl:px-7 xl:rounded-2xl xl:text-xl lg:py-4 lg:pl-6 lg:pr-5 lg:text-base md:py-4 md:pl-6 md:pr-5 md:text-base sm:py-4 sm:pl-6 sm:pr-5 sm:text-base xs:py-4 xs:pl-6 xs:pr-5 xs:text-[15px] flex"
      :class="sending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
      @click="submit"
    >
      <button type="button" :disabled="sending">{{ sending ? 'Отправляется...' : 'Отправить заявку' }}</button>
    </div>
  </div>
</template>
