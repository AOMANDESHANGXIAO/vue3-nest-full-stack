<route lang="json">
{
  "meta": {
    "title": "角色管理",
    "icon": "user",
    "menuOrder": 3,
    "showInMenu": true,
    "breadcrumbName": "角色管理"
  }
}
</route>

<script lang="ts" setup>
import ContentContainer from '@/components/layouts/content-container.vue';
defineOptions({
  name: "role",
});
</script>

<template>
  <ContentContainer></ContentContainer>
</template>

<style lang="scss" scoped></style>
