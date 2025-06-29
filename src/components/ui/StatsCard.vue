<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="iconClasses">
          <component :is="icon" class="w-6 h-6" />
        </div>
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ title }}
          </dt>
          <dd class="flex items-baseline">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ value }}
            </div>
            <div
              v-if="change"
              class="ml-2 flex items-baseline text-sm font-semibold"
              :class="changeClasses"
            >
              <component :is="changeIcon" class="w-4 h-4 mr-1" />
              {{ Math.abs(change) }}%
            </div>
          </dd>
        </dl>
      </div>
    </div>
    <div v-if="description" class="mt-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

interface Props {
  title: string
  value: string | number
  icon: any
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  change?: number
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const iconClasses = computed(() => {
  const baseClasses = 'flex items-center justify-center w-10 h-10 rounded-lg'
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
    red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
  }
  return `${baseClasses} ${colorClasses[props.color]}`
})

const changeClasses = computed(() => {
  if (!props.change) return ''
  return props.change > 0
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'
})

const changeIcon = computed(() => {
  if (!props.change) return null
  return props.change > 0 ? TrendingUp : TrendingDown
})
</script>