<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationBarTitleText": "上传-状态一体化"
  }
}
</route>

<script lang="ts" setup>
const { loading, data, run } = useUpload()
</script>

<template>
  <view class="p-4 text-center">
    <up-button type="primary" @click="run">
      选择图片并上传
    </up-button>
    <view v-if="loading" class="h-10 text-blue">
      上传...
    </view>
    <template v-else>
      <view class="m-2">
        上传后返回的接口数据：
      </view>
      <view class="m-2">
        {{ data }}
      </view>
      <view v-if="data" class="w-full">
        <image :src="data.url" mode="widthFix" />
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
