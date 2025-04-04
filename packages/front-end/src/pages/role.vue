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

<script setup lang="ts">
defineOptions({
    name: 'role'
})
</script>

<template>
  <RouterView :key="$route.fullPath"/>
</template>

