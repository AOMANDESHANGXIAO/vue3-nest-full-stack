<route lang="json">
{
  "meta": {
    "title": "数据管理",
    "icon": "database",
    "menuOrder": 4,
    "showInMenu": true,
    "breadcrumbName": "数据管理"
  }
}
</route>

<script setup lang="ts">
defineOptions({
  name: "data-manage",
});
</script>

<template>
  <RouterView :key="$route.fullPath" />
</template>
