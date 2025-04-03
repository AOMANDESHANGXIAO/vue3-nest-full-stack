<script lang="ts" setup>
defineOptions({
  name: 'content-container',
})
</script>

<template>
  <div class="box-border w-full h-full p-20px flex-shrink-0">
    <div
      class="w-full h-full p-20px box-border bg-white dark:bg-deep-dark rounded-xl overflow-x-hidden overflow-y-auto"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  --p: 20px;
  padding: var(--p);
  height: calc(80% - var(--p) * 2);
  width: calc(90% - var(--p) * 2);
}
</style>
