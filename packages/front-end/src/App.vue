<script lang="ts" setup>
import MenuPage from '@/components/business/menu-page.vue'
import { RouterView, useRoute } from 'vue-router'
import { theme } from 'ant-design-vue'
import { useSystemConfigStore } from '@/stores/modules/use-system-config-store'
import { rgbToHex } from '@/utils/color'

defineOptions({
  name: 'app',
})
const currentRoute = useRoute()
const isRouteInMenu = computed(() => {
  return currentRoute.meta.showInMenu
})
const systemConfig = useSystemConfigStore()
const antTheme = computed(() => {
  return {
    token: {
      colorPrimary: rgbToHex(systemConfig.config.cssVars['--color-primary']),
      fontFamily: 'ali',
    },
    algorithm:
      systemConfig.config.colorMode === 'dark'
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,
  }
})
</script>

<template>
  <a-config-provider :theme="antTheme">
    <div id="root" :style="systemConfig.config.cssVars">
      <component :is="isRouteInMenu ? MenuPage : RouterView"></component>
    </div>
  </a-config-provider>
</template>
