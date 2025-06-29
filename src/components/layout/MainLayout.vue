<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <div class="w-64 flex-shrink-0">
      <Sidebar />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between px-6 py-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ pageDescription }}
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                v-model="searchQuery"
              />
            </div>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell class="w-5 h-5" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- User Menu -->
            <div class="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="User"
                class="w-8 h-8 rounded-full"
              />
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import { Search, Bell } from 'lucide-vue-next'

const route = useRoute()
const searchQuery = ref('')

const pageTitle = computed(() => {
  const routeName = route.name as string
  return routeName || 'Dashboard'
})

const pageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    Dashboard: 'Overview of your dependency ecosystem',
    Projects: 'Manage and monitor your projects',
    Dependencies: 'Track and analyze dependencies',
    Security: 'Security vulnerabilities and alerts',
    Analytics: 'Insights and reporting',
    Settings: 'System configuration and preferences'
  }
  return descriptions[pageTitle.value] || ''
})
</script>