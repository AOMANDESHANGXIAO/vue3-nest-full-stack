<route lang="json">
{
  "meta": {
    "title": "权限管理",
    "icon": "user",
    "menuOrder": 3,
    "showInMenu": true,
    "breadcrumbName": "权限管理"
  }
}
</route>

<script setup lang="ts">
defineOptions({
    name: 'role'
})
</script>

<template>
  <RouterView :key="$route.fullPath"/>
</template>

