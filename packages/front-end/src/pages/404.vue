<route lang="json">
{
  "meta": {
    "title": "404",
    "showInMenu": false
  }
}
</route>

<script lang="ts" setup>
import router from '@/routers';
defineOptions({
  name: '404',
})
const goHome = () => {
  router.push('/')
}
const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="box-border w-100vw h-100vh flex flex-col justify-center items-center gap-10px p-20px">
    <div class="w-50% h-50%">
      <img src="@/assets/images/404.svg" class="w-100% h-100%" />
    </div>
    <p class="text-xl opacity-70">您访问的页面可能已被移除或暂时无法访问。请检查输入的网址是否正确，或者尝试以下操作：</p>
    <div>
      <a-button type="primary" @click="goHome">返回首页</a-button>
      <a-button class="ml-10px" @click="goBack">返回上一页</a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
