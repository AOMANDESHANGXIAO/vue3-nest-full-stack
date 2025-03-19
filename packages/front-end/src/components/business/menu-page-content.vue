<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
import type { MenuProps } from 'ant-design-vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import _ from 'lodash'
import router, { routes } from '@/routers'
import { useSystemConfigStore } from '@/stores/modules/use-system-config-store'
import { useUserStore } from '@/stores/modules/use-user-store'
import Bell from '@/components/ui/Bell.vue'
import AppearenceSetting from './appearence-setting.vue'

const userStore = useUserStore()
await userStore.initUser()
const systemConfigStore = useSystemConfigStore()
const { toggleCollapsed, toggleColorMode, addSelectedKeyHistory } =
  systemConfigStore
const systemConfig = toRef(systemConfigStore.config)
const transformRouteToMenu = (route: RouteRecordRaw) => {
  const meta = route.meta
  if (!meta || !meta.showInMenu) {
    return void 0
  }
  if (!meta.icon) {
    return {
      key: route.name,
      label: meta!.title,
      title: meta!.title,
      // In fact, the generated `route.name` represents the complete path, rather than `route.path`.
      path: route.name,
    }
  }
  return {
    key: route.name,
    icon: () => h(FontAwesomeIcon, { icon: meta!.icon as string }),
    label: meta!.title,
    title: meta!.title,
    path: route.name,
    iconName: meta!.icon,
  }
}

const mapRouteToMenu = (routes: RouteRecordRaw[]): MenuProps['items'] => {
  const routes_ = _.cloneDeep(routes)
  return _.sortBy(routes_, route => {
    return route.meta?.menuOrder || 0
  }).map((route: RouteRecordRaw) => {
    if (route.children) {
      return {
        ...transformRouteToMenu(route),
        children: route.children ? mapRouteToMenu(route.children) : [],
      }
    }
    return transformRouteToMenu(route) as MenuProps['items']
  }) as MenuProps['items']
}
const items = mapRouteToMenu(routes)?.filter(item => item?.key)
console.log('items', items)
const menuStyle = computed(() => {
  return {
    flex: 1,
    'min-width': systemConfig.value.collapsed ? '30px' : '200px',
  }
})
// The type, e.g,MenuProps['onClick'], provided by ant-design-vue is not correct.
// So that, I use any here.
const handleMenuClick = (e: any) => {
  if (!e || !e.item.originItemValue.path) return

  addSelectedKeyHistory({
    key: e.key,
    path: e.item.originItemValue.path,
    title: e.item.originItemValue.title,
    icon: e.item.originItemValue.iconName,
  })
  router.push({
    path: e.item.originItemValue.path,
    replace: true,
  })
}
const handleClickTab = ({ path }: { path: string }) => {
  router.push(path)
}
const open = ref(false)
const handleClickSetting = () => {
  open.value = !open.value
}

const activeSetting = ref('appearance')

const handleClickLogout = () => {
  userStore.logout()
  systemConfigStore.removeCache()
}
</script>

<template>
  <div class="w-100vw h-100vh overflow-hidden flex">
    <!-- 菜单 -->
    <div
      id="xb-menu"
      class="relative h-full bg-white flex flex-col dark:bg-deep-dark gray-border transition-width-300"
      :class="{
        'w-200px': !systemConfig.collapsed,
        'w-80px': systemConfig.collapsed,
      }"
    >
      <header
        class="flex-shrink-0 h-50px text-center line-height-50px box-border"
      >
        <a-space align="center">
          <FontAwesomeIcon
            icon="graduation-cap"
            class="text-16px text-primary"
          />
          <span class="text-16px" v-if="!systemConfig.collapsed"
            >教务管理系统</span
          >
        </a-space>
      </header>
      <section
        class="flex-1 overflow-y-auto overflow-x-hidden hidden-scrollbar"
      >
        <a-menu
          @click="handleMenuClick"
          id="menu"
          v-model:openKeys="systemConfigStore.config.openKeys"
          :selectedKeys="systemConfigStore.selectedKeys"
          :style="menuStyle"
          mode="inline"
          :inline-collapsed="systemConfig.collapsed"
          :items="items"
        >
        </a-menu>
      </section>
    </div>

    <!-- 设置抽屉 -->
    <a-drawer
      v-model:open="open"
      placement="right"
      getContainer="#root"
      :class="['xb-drawer']"
      :closable="false"
      :body-style="{
        padding: '0px',
        position: 'relative',
      }"
    >
      <header
        :class="['xb-drawer__header']"
        class="box-border border-b-1px border-gray-200 p-10px flex justify-between items-center"
      >
        <span class="text-16px">偏好设置</span>
        <FontAwesomeIcon
          @click="open = false"
          icon="times"
          class="cursor-pointer"
        />
      </header>
      <main class="box-border p-10px p-t-0" :class="['xb-drawer__main']">
        <a-tabs v-model:activeKey="activeSetting">
          <a-tab-pane key="appearance" tab="外观" class="text-16px">
            <AppearenceSetting />
          </a-tab-pane>
          <a-tab-pane key="layout" tab="布局"></a-tab-pane>
          <a-tab-pane key="common" tab="通用"></a-tab-pane>
        </a-tabs>
      </main>
      <footer
        class="box-border p-10px absolute bottom-0 w-full"
        :class="['xb-drawer__footer']"
      >
        <a-button class="w-100%" @click="handleClickLogout">清空缓存&退出登录</a-button>
      </footer>
    </a-drawer>

    <div id="xb-content" class="gray-border">
      <!-- header -->
      <header
        id="xb-content__header"
        class="flex-shrink-0 flex items-center justify-between bg-white dark:bg-deep-dark p-x-16px"
      >
        <div class="flex items-center gap-15px">
          <component
            @click="toggleCollapsed"
            class="text-16px"
            :is="systemConfig.collapsed ? MenuFoldOutlined : MenuUnfoldOutlined"
          ></component>
          <RedoOutlined class="cursor-pointer" />
        </div>

        <a-space size="large">
          <div
            class="rounded-2xl dark:bg-gray-700 p-x-16px p-y-4px bg-#f4f4f5 cursor-pointer hover:scale-105 transition-all-300"
          >
            <a-space size="small" align="center">
              <FontAwesomeIcon icon="search"></FontAwesomeIcon>
              <span>搜索</span>
              <div class="dark:bg-gray-8 p-x-6px rounded-r-2xl text-small">
                Ctrl K
              </div>
            </a-space>
          </div>

          <!-- setting icon-->
          <FontAwesomeIcon
            @click="handleClickSetting"
            icon="cog"
            class="cursor-pointer hover:rotate-45 transition-transform-300"
          ></FontAwesomeIcon>

          <!-- color mode icon -->
          <FontAwesomeIcon
            @click="toggleColorMode"
            :icon="systemConfig.colorMode === 'dark' ? 'moon' : 'sun'"
            class="cursor-pointer hover:rotate-45 transition-transform-300"
          ></FontAwesomeIcon>

          <!-- bell -->
          <Bell />

          <a-space align="center" size="small">
            <a-avatar :src="userStore.user!.avatarUrl"></a-avatar
            ><span class="text-14px color-inherit">{{
              userStore.user!.username
            }}</span>
          </a-space>
        </a-space>
      </header>

      <!-- tabs container -->
      <TransitionGroup
        name="list"
        tag="ul"
        id="xb-content__tabs"
        class="relative flex items-center bg-white dark:bg-deep-dark p-x-8px gap-25px overflow-x-auto hidden-scrollbar"
      >
        <div
          class="absolute h-full top-0 right-0 bottom-0 flex justify-center items-center bg-white dark:bg-deep-dark"
          :key="'xb-content__tabs__close-all'"
        >
          <a-dropdown>
            <FontAwesomeIcon
              :icon="['fas', 'chevron-up']"
              class="cursor-pointer transform rotate-180 mr-10px"
            />
            <template #overlay>
              <a-menu>
                <a-menu-item
                  @click="
                    systemConfigStore.removeSelectedKeyByCondition('current')
                  "
                >
                  关闭当前
                </a-menu-item>
                <a-menu-item
                  @click="
                    systemConfigStore.removeSelectedKeyByCondition('other')
                  "
                >
                  关闭其他
                </a-menu-item>
                <a-menu-item
                  @click="systemConfigStore.removeSelectedKeyByCondition('all')"
                >
                  关闭所有
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>

        <!-- tabs -->

        <li
          v-for="item in systemConfigStore.config.selectedKeysHistory"
          :key="item.key"
          @click="handleClickTab(item)"
          class="box-border shrink-0 cursor-pointer line-height-30px text-14px transition-all-300"
          :class="{
            'xb-content__tabs__item': true,
            'tab-item': true,
            'text-primary border-b-primary active':
              systemConfigStore.activeKey === item.key,
            'opacity-70 hover:opacity-100':
              systemConfigStore.activeKey !== item.key,
          }"
        >
          <FontAwesomeIcon
            :icon="item.icon ? item.icon : 'file'"
            class="mr-8px"
          ></FontAwesomeIcon
          ><span> {{ item.title }}</span>
        </li>
      </TransitionGroup>

      <!-- content -->
      <main id="xb-content__wrapper">
        <RouterView v-slot="{ Component }">
          <Transition
            mode="out-in"
            :appear="false"
            enter-active-class="animate__animated animate__fadeInRight"
          >
            <KeepAlive>
              <component :is="Component" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hidden-scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
}
.text-primary {
  color: rgb(var(--color-primary));
}
.border-b-primary {
  border-bottom: 2px solid rgb(var(--color-primary));
}
li {
  list-style: none;
}
#xb-content {
  border-left: 1px solid rgba($color: #000000, $alpha: 0.2);
}
.dark #xb-content {
  border-top: 1px solid rgba($color: #ffffff, $alpha: 0.2);
  border-left: 1px solid rgba($color: #ffffff, $alpha: 0.2);
}
.dark #xb-content {
  #xb-content__tabs {
    border-top: 1px solid rgba($color: #ffffff, $alpha: 0.2);
    border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.2);
  }
}
#xb-content {
  width: 100%;
  --w-header: 50px;
  --w-tab: 35px;
  #xb-content__header {
    height: var(--w-header);
  }
  #xb-content__tabs {
    border-top: 1px solid rgba($color: #000000, $alpha: 0.2);
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
    .xb-content__tabs__item {
      height: var(--w-tab);
    }
  }
  #xb-content__wrapper {
    height: calc(100vh - var(--w-header) - var(--w-tab));
  }
}

:deep(.ant-menu-line) {
  border: none !important;
}
::view-transition-new(root),
::view-transition-old(root) {
  /* 关闭默认动画，否则影响自定义动画的执行 */
  animation: none;
}
.dark::view-transition-old(root) {
  z-index: 100;
}
.light::view-transition-new(root) {
  z-index: 100;
}
.dark .xb-content__header {
  border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.2);
}
.xb-drawer {
  --h-header: 50px;
  --h-footer: 50px;
  height: 100vh;
  overflow: hidden;
  .xb-drawer__header {
    height: var(--w-header);
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
  }
  .xb-drawer__main {
    height: calc(100vh - var(--w-header) - var(--w-footer));
    overflow-x: hidden;
    overflow-y: auto;
  }
  .xb-drawer__footer {
    height: var(--w-footer);
  }
}
</style>
