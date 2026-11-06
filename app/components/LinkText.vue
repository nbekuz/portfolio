<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span class="link-wrapper cursor-pointer"><span class="link-current">{{ text }}</span><span class="link-hover" aria-hidden="true">{{ text }}</span></span>
</template>
