<route lang="json">
{
  "meta": {
    "title": "系统管理",
    "icon": "cog",
    "menuOrder": 3,
    "showInMenu": true,
    "breadcrumbName": "系统管理"
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

