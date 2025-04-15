<script setup lang="ts">
defineProps<{
  tags: string[];
  color?: string;
}>();
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center items-center">
    <a-tag v-for="tag in tags" :key="tag" :color="color || 'success'">{{
      tag
    }}</a-tag>
  </div>
</template>

<style scoped></style>
