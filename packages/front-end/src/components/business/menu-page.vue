<script lang="ts" setup>
import MenuPageContent from './menu-page-content.vue';
import Loading from '@/components/ui/Loading.vue';
defineOptions({
    name: 'menu-page'
})
</script>

<template>
  <Suspense>
    <template #default>
      <MenuPageContent/>
    </template>
    <template #fallback>
      <Loading/>
    </template>
  </Suspense>
</template>

<style lang="scss" scoped>

</style>
