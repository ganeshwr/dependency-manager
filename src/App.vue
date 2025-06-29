<template>
  <div class="h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <Toast />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from './stores/theme'
import Toast from './components/ui/Toast.vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initializeTheme()
})
</script>