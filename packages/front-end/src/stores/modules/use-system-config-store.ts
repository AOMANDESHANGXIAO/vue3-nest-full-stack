import { defineStore } from 'pinia'
import { useLocalStorage, useDark, useToggle } from '@vueuse/core'
import type { MenuTheme } from 'ant-design-vue'
import _ from 'lodash'
import router from '@/routers'

export type SelectedKeyHistoryItem = {
  key: string
  path: string
  title: string
  icon: string
}
export type Theme = {
  name: string
  key: string
  cssVars: Record<string, string>
}
export type AuthLayoutOption = {
  key: 'left' | 'right' | 'center'
  label: string
  icon: string
}
export type ColorScheme = 'auto' | 'light' | 'dark'
export const useSystemConfigStore = defineStore('system-config-store', () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
  })
  const toggleDark = useToggle(isDark)
  const themes: Theme[] = [
    {
      name: '深蓝',
      key: 'shenlan',
      cssVars: {
        '--color-primary': '22, 119, 255',
      },
    },
    {
      name: '春意',
      key: 'shilan',
      cssVars: {
        '--color-primary': '47, 169, 104',
      },
    },
    {
      name: '亮橙',
      key: 'liangcheng',
      cssVars: {
        '--color-primary': '236, 82, 40',
      },
    },
    {
      name: '韵味',
      key: 'yunwei',
      cssVars: {
        '--color-primary': '70, 53, 177',
      },
    },
    {
      name:'鹅黄',
      key:'ehuang',
      cssVars:{
        '--color-primary': '246, 220, 67',
      }
    },
    {
      name:'粉色',
      key:'fenge',
      cssVars:{
        '--color-primary': '236, 127, 169',
      }
    },
    {
      name:'优雅',
      key:'geili',
      cssVars:{
        '--color-primary': '120, 134, 199',
      }
    },
    {
      name: '精致',
      key: 'jingzhi',
      cssVars: {
        '--color-primary': '76, 88, 91',
      },
    },

  ]
  const defaultCssVars = {
    '--color-primary': '22, 119, 255',
    '--color-success': '47, 169, 104',
    '--color-warning': '241, 169, 54',
    '--color-danger': '213, 68, 97',
    '--color-error': '213, 68, 97',
    '--color-info': '144, 147, 153',
    '--color-deep-dark': '20, 20, 20',
    '--color-gray': '28, 31, 35',
  }
  const getThemeCssVarsByKey = (key: string) => {
    return themes.find(i => i.key === key)?.cssVars || defaultCssVars
  }
  const setTheme = (newTheme: Theme) => {
    if (newTheme.key === config.value.themeKey) return
    if (themes.find(i => i.key === newTheme.key) === undefined) return
    config.value.themeKey = newTheme.key
    config.value.cssVars = _.merge({}, defaultCssVars, newTheme.cssVars)
    console.log('切换主题 newTheme:', newTheme)
    console.log('切换主题 cssVars:', config.value.cssVars)
  }
  const resetSelectedKeys = () => {
    config.value.selectedKeysHistory = [
      {
        key: '/home',
        icon: 'home',
        title: '首页',
        path: '/home',
      },
    ]
  }
  const config = useLocalStorage('systemConfig', {
    colorMode: window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : ('light' as MenuTheme),
    colorModeSelect: 'auto' as ColorScheme,
    theme: 'default',
    openKeys: ['home'],
    preOpenKeys: ['home'] as string[],
    collapsed: false,
    selectedKeysHistory: [
      {
        key: '/home',
        icon: 'home',
        title: '首页',
        path: '/home',
      },
    ] as SelectedKeyHistoryItem[],
    themeKey: 'shenlan',
    cssVars: _.merge({}, defaultCssVars, getThemeCssVarsByKey('shenlan')),
    authLayout: 'right' as AuthLayoutOption['key'],
  })
  const removeCache = () => {
    localStorage.clear()
    sessionStorage.clear()
    location.reload()
  }

  const selectedKeys = computed(() => {
    return [router.currentRoute.value.path]
  })
  const activeKey = computed(() => {
    return router.currentRoute.value.path
  })
  if (config.value.colorMode === 'dark' && isDark.value === false) {
    toggleDark()
  }
  const toggleCollapsed = () => {
    config.value.collapsed = !config.value.collapsed
  }
  const switchColorMode = (e: MouseEvent, mode: ColorScheme) => {
    config.value.colorModeSelect = mode
    if (mode === 'auto') {
      // 获取系统的设置
      const systemMode = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      console.log('系统偏好:', systemMode)
      if (systemMode === config.value.colorMode) return
    }
    if (mode === config.value.colorMode) {
      return
    }
    toggleColorMode(e)
  }

  const toggleColorMode = async (e: MouseEvent) => {
    // 以下代码是为了实现一个主题切换的动画
    const transition = document.startViewTransition(() => {
      config.value.colorMode =
        config.value.colorMode === 'light' ? 'dark' : 'light'
      toggleDark()
    })
    transition.ready.then(() => {
      // 由于我们要从鼠标点击的位置开始做动画，所以我们需要先获取到鼠标的位置
      const { clientX, clientY } = e
      // 计算半径，以鼠标点击的位置为圆心，到四个角的距离中最大的那个作为半径
      const radius = Math.hypot(
        Math.max(clientX, innerWidth - clientX),
        Math.max(clientY, innerHeight - clientY)
      )
      const clipPath = [
        `circle(0% at ${clientX}px ${clientY}px)`,
        `circle(${radius}px at ${clientX}px ${clientY}px)`,
      ]
      const isDark = config.value.colorMode === 'dark'
      // 自定义动画
      document.documentElement.animate(
        {
          // 如果要切换到暗色主题，我们在过渡的时候从半径 100% 的圆开始，到 0% 的圆结束
          clipPath: isDark ? clipPath.reverse() : clipPath,
        },
        {
          duration: 500,
          // 如果要切换到暗色主题，我们应该裁剪 view-transition-old(root) 的内容
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      )
    })
  }

  const addSelectedKeyHistory = (item: SelectedKeyHistoryItem) => {
    if (config.value.selectedKeysHistory.find(i => i.key === item.key)) {
      return
    }
    config.value.selectedKeysHistory.push(item)
  }

  const removeSelectedKeyHistory = (key: string) => {
    config.value.selectedKeysHistory = config.value.selectedKeysHistory.filter(
      i => i.key !== key
    )
    // 删除完了就重置一下，返回首页
    if (config.value.selectedKeysHistory.length === 0) {
      resetSelectedKeys()
      router.push('/')
      return
    }
    // 如果删除的是当前的，就把上一个设置为当前
    else if (key === activeKey.value) {
      const lastItem =
        config.value.selectedKeysHistory[
          config.value.selectedKeysHistory.length - 1
        ]
      router.push(lastItem.path)
      return
    }
  }

  const removeSelectedKeyByCondition = (
    condition: 'current' | 'all' | 'other'
  ) => {
    switch (condition) {
      case 'current': {
        removeSelectedKeyHistory(activeKey.value)
        break
      }
      case 'all': {
        resetSelectedKeys()
        router.push('/')
        break
      }
      case 'other': {
        config.value.selectedKeysHistory =
          config.value.selectedKeysHistory.filter(
            i => i.key === activeKey.value
          )
      }
    }
  }

  const authLayoutOptions: AuthLayoutOption[] = [
    {
      label: '靠右',
      key: 'right',
      icon: 'arrow-right',
    },
    {
      label: '靠左',
      key: 'left',
      icon: 'arrow-left',
    },
    {
      label: '居中',
      key: 'center',
      icon: 'align-center',
    },
  ]

  const setAuthLayout = (item: AuthLayoutOption) => {
    if (item.key === config.value.authLayout) return
    config.value.authLayout = item.key
  }

  return {
    config,
    selectedKeys,
    activeKey,
    toggleCollapsed,
    toggleColorMode,
    setTheme,
    themes,
    addSelectedKeyHistory,
    removeSelectedKeyHistory,
    removeSelectedKeyByCondition,
    authLayoutOptions,
    setAuthLayout,
    switchColorMode,
    removeCache
  }
})
