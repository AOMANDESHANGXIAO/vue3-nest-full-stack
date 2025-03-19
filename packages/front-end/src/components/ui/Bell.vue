<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { vHoverClass } from '@/directives/v-hover-class';

defineOptions({
  name: 'bell',
})
const props = withDefaults(
  defineProps<{
    showDot?: boolean
  }>(),
  {
    showDot: true,
  }
)
const emits = defineEmits(['click'])
</script>

<template>
  <div class="relative" @click="emits('click')">
    <FontAwesomeIcon
      ref="dom"
      icon="bell"
      class="cursor-pointer"
      v-hover-class="'animate__animated animate__swing'"
    ></FontAwesomeIcon>
    <div
      v-if="props.showDot"
      class="w-5px h-5px rounded-full bg-red-500 absolute top-0 right-0"
    ></div>
  </div>
</template>

<style lang="scss" scoped></style>
