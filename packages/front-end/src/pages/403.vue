<route lang="json">
{
  "meta": {
    "title": "403",
    "showInMenu": false
  }
}
</route>

<script lang="ts" setup>
import router from "@/routers";
defineOptions({
  name: "403",
});
const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div
    class="box-border w-100vw h-100vh flex flex-col justify-center items-center gap-10px p-20px"
  >
    <div class="w-50% h-50%">
      <img src="@/assets/images/403.svg" class="w-100% h-100%" />
    </div>
    <p class="text-xl opacity-70">您没有权限访问该页面或者接口</p>
    <div>
      <a-button type="primary" @click="goHome">返回首页</a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
