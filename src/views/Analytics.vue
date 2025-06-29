<template>
  <MainLayout>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Insights and reporting for dependency management</p>
    </div>

    <!-- Date Range Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Report Period</h3>
        <div class="flex space-x-4">
          <button
            v-for="period in periods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="selectedPeriod === period.value 
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Dependency Growth</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">+12.5%</p>
            <p class="text-sm text-green-600 dark:text-green-400">vs last month</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <TrendingDown class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Security Issues</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">-8.2%</p>
            <p class="text-sm text-green-600 dark:text-green-400">vs last month</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Resolution Time</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">2.4 days</p>
            <p class="text-sm text-green-600 dark:text-green-400">-0.5 days</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Compliance Score</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">94%</p>
            <p class="text-sm text-green-600 dark:text-green-400">+2%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Dependencies Over Time -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Dependencies Over Time</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Total dependencies tracked per month</p>
        </div>
        <div class="p-6">
          <div class="chart-container">
            <canvas ref="dependenciesChart"></canvas>
          </div>
        </div>
      </div>

      <!-- License Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">License Distribution</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Breakdown of dependency licenses</p>
        </div>
        <div class="p-6">
          <div class="chart-container">
            <canvas ref="licenseChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Project Health Scores -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Project Health Scores</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Health score distribution across projects</p>
        </div>
        <div class="p-6">
          <div class="chart-container">
            <canvas ref="healthChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Security Trend -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Security Vulnerabilities</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Security issues detected over time</p>
        </div>
        <div class="p-6">
          <div class="chart-container">
            <canvas ref="securityChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Dependencies -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Most Used Dependencies</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Dependencies used across multiple projects</p>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="dep in topDependencies"
              :key="dep.name"
              class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Package class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ dep.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ dep.version }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ dep.projectCount }} projects</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ dep.license }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Latest dependency updates and changes</p>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0">
                <div :class="getActivityIconClass(activity.type)" class="w-8 h-8 rounded-full flex items-center justify-center">
                  <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900 dark:text-white">{{ activity.description }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.timestamp }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import { useProjectsStore } from '../stores/projects'
import { useDependenciesStore } from '../stores/dependencies'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Package,
  Plus,
  RefreshCw,
  Shield,
  AlertTriangle
} from 'lucide-vue-next'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const projectsStore = useProjectsStore()
const dependenciesStore = useDependenciesStore()

const selectedPeriod = ref('30d')
const dependenciesChart = ref<HTMLCanvasElement>()
const licenseChart = ref<HTMLCanvasElement>()
const healthChart = ref<HTMLCanvasElement>()
const securityChart = ref<HTMLCanvasElement>()

const periods = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: '1 Year', value: '1y' }
]

const topDependencies = computed(() => {
  const depCounts = new Map()
  
  dependenciesStore.dependencies.forEach(dep => {
    depCounts.set(dep.name, {
      name: dep.name,
      version: dep.version,
      license: dep.license,
      projectCount: dep.projects.length
    })
  })
  
  return Array.from(depCounts.values())
    .sort((a, b) => b.projectCount - a.projectCount)
    .slice(0, 5)
})

const recentActivity = computed(() => [
  {
    id: '1',
    type: 'update',
    description: 'Updated React from 18.2.0 to 18.3.1 in CustomerPortal',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'security',
    description: 'Security vulnerability detected in lodash@4.17.20',
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    type: 'add',
    description: 'Added new dependency: @types/node@20.5.0',
    timestamp: '6 hours ago'
  },
  {
    id: '4',
    type: 'update',
    description: 'Updated TypeScript from 5.1.6 to 5.2.2 in PaymentService',
    timestamp: '1 day ago'
  },
  {
    id: '5',
    type: 'security',
    description: 'Fixed critical vulnerability in express@4.17.1',
    timestamp: '2 days ago'
  }
])

const getActivityIcon = (type: string) => {
  const icons = {
    update: RefreshCw,
    security: Shield,
    add: Plus,
    remove: AlertTriangle
  }
  return icons[type as keyof typeof icons] || Package
}

const getActivityIconClass = (type: string) => {
  const classes = {
    update: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    security: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
    add: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    remove: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
}

const initCharts = () => {
  nextTick(() => {
    // Dependencies Over Time Chart
    if (dependenciesChart.value) {
      new Chart(dependenciesChart.value, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Total Dependencies',
            data: [120, 135, 142, 158, 165, 172],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }

    // License Distribution Chart
    if (licenseChart.value) {
      const licenseData = dependenciesStore.dependencies.reduce((acc, dep) => {
        acc[dep.license] = (acc[dep.license] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      new Chart(licenseChart.value, {
        type: 'doughnut',
        data: {
          labels: Object.keys(licenseData),
          datasets: [{
            data: Object.values(licenseData),
            backgroundColor: [
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)',
              'rgb(139, 92, 246)',
              'rgb(236, 72, 153)'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }

    // Project Health Scores Chart
    if (healthChart.value) {
      const healthScores = projectsStore.projects.map(p => p.healthScore)
      const healthRanges = {
        'Excellent (90-100)': healthScores.filter(s => s >= 90).length,
        'Good (70-89)': healthScores.filter(s => s >= 70 && s < 90).length,
        'Fair (50-69)': healthScores.filter(s => s >= 50 && s < 70).length,
        'Poor (0-49)': healthScores.filter(s => s < 50).length
      }

      new Chart(healthChart.value, {
        type: 'bar',
        data: {
          labels: Object.keys(healthRanges),
          datasets: [{
            label: 'Projects',
            data: Object.values(healthRanges),
            backgroundColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)'
            ],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }

    // Security Vulnerabilities Chart
    if (securityChart.value) {
      new Chart(securityChart.value, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Critical',
              data: [8, 6, 4, 5, 3, 2],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4
            },
            {
              label: 'High',
              data: [15, 12, 10, 8, 6, 5],
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              tension: 0.4
            },
            {
              label: 'Medium',
              data: [25, 22, 18, 15, 12, 10],
              borderColor: 'rgb(245, 158, 11)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }
  })
}

onMounted(() => {
  initCharts()
})
</script>