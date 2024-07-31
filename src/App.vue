<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'

useUserStore().login() // 在 setup 中登录
</script>
