<template>
  <div class="h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Package class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">DepManager</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Enterprise Edition</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-4 space-y-2">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="isActiveRoute(item.path) 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
          <span
            v-if="item.badge"
            class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            :class="item.badgeClass"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- Theme Toggle -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="themeStore.toggleTheme()"
          class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Sun v-if="themeStore.isDark" class="w-5 h-5 mr-3" />
          <Moon v-else class="w-5 h-5 mr-3" />
          {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../../stores/theme'
import { useProjectsStore } from '../../stores/projects'
import { useDependenciesStore } from '../../stores/dependencies'
import {
  Package,
  LayoutDashboard,
  FolderOpen,
  Shield,
  BarChart3,
  Settings,
  Sun,
  Moon
} from 'lucide-vue-next'

const route = useRoute()
const themeStore = useThemeStore()
const projectsStore = useProjectsStore()
const dependenciesStore = useDependenciesStore()

const navigation = computed(() => [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Projects',
    path: '/projects',
    icon: FolderOpen,
    badge: projectsStore.projectStats.total,
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  {
    name: 'Dependencies',
    path: '/dependencies',
    icon: Package,
    badge: dependenciesStore.dependencyStats.total,
    badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  {
    name: 'Security',
    path: '/security',
    icon: Shield,
    badge: dependenciesStore.dependencyStats.critical > 0 ? dependenciesStore.dependencyStats.critical : undefined,
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart3
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings
  }
])

const isActiveRoute = (path: string) => {
  return route.path === path
}
</script>