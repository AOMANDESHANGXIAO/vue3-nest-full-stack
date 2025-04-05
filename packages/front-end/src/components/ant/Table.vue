<script setup lang="ts">
defineOptions({
  name: 'Table',
})
</script>

<template>
  <a-table v-bind="$attrs">
    <template
      v-for="(item, key, index) in $slots"
      :key="index"
      v-slot:[key]="item"
    >
      <slot :name="key" v-bind="item"></slot>
    </template>
  </a-table>
</template>
