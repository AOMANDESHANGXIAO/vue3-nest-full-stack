<route lang="jsonc" type="page">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "关于"
  }
}
</route>

<script lang="ts" setup>
import RequestComp from './components/request.vue'
import UploadComp from './components/upload.vue'
</script>

<template>
  <view>
    <view class="mt-8 text-center text-3xl">
      鸽友们好，我是
      <text class="text-red-500">
        菲鸽
      </text>
    </view>
    <RequestComp />
    <UploadComp />
  </view>
</template>

<style lang="scss" scoped>
.test-css {
  // 16rpx=>0.5rem
  padding-bottom: 16rpx;
  // mt-4=>1rem=>16px;
  margin-top: 16px;
  text-align: center;
}
</style>
