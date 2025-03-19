<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  useSystemConfigStore,
  type ColorScheme,
} from '@/stores/modules/use-system-config-store'
import { vHoverClass } from '@/directives/v-hover-class'
import { rgbToHex } from '@/utils/color'

defineOptions({
  name: 'appearence-setting',
})
const systemConfigStore = useSystemConfigStore()
type ColorSwitcher = {
  label: string
  value: ColorScheme
  icon: string
  key: string
}
const colorSwitherList: Array<ColorSwitcher> = [
  {
    label: '浅色',
    value: 'light',
    icon: 'sun',
    key: 'light',
  },
  {
    label: '深色',
    value: 'dark',
    icon: 'moon',
    key: 'dark',
  },
  {
    label: '跟随系统',
    value: 'auto',
    icon: 'sun',
    key: 'auto',
  },
]
const hoverAnimateClass = 'animate__animated animate__tada'
</script>

<template>
  <div class="w-full">
    <p class="text-16px">颜色模式🪄</p>
    <div class="mt-5px grid grid-cols-3 gap-10px">
      <div
        v-for="item in colorSwitherList"
        v-hover-class="hoverAnimateClass"
        @click="
          e => {
            systemConfigStore.switchColorMode(e, item.value)
          }
        "
        :key="item.key"
        class="flex flex-col items-center cursor-pointer"
      >
        <section
          class="xb-box-border rounded-xl w-full h-50px flex justify-center items-center"
          :class="{
            active: systemConfigStore.config.colorModeSelect === item.value,
          }"
        >
          <FontAwesomeIcon :icon="item.icon" />
        </section>
        <p class="mt-5px">{{ item.label }}</p>
      </div>
    </div>
    <p class="text-16px mt-10px">主题色✨</p>
    <div class="grid grid-cols-2 grid-cols-3 gap-10px">
      <div
        v-for="item in systemConfigStore.themes"
        :key="item.key"
        class="flex flex-col items-center"
        v-hover-class="hoverAnimateClass"
      >
        <div
          :class="{
            active: systemConfigStore.config.themeKey === item.key,
          }"
          @click="systemConfigStore.setTheme(item)"
          class="cursor-pointer box-border xb-box-border rounded-xl w-full h-50px flex justify-center items-center"
        >
          <div
            class="w-25px h-25px rounded-5px"
            :style="{
              backgroundColor: rgbToHex(item.cssVars['--color-primary']),
            }"
          ></div>
        </div>
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.xb-box-border {
  border: 1px solid rgba($color: #000000, $alpha: 0.2);
}
.dark .xb-box-border {
  border: 1px solid rgba($color: #ffffff, $alpha: 0.2);
}
.active {
  border: 2px solid rgb(var(--color-primary));
}
.dark .active {
  border: 2px solid rgb(var(--color-primary));
}
</style>
