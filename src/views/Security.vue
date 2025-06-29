<template>
  <MainLayout>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">Monitor and manage security vulnerabilities</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="runSecurityScan"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Shield class="w-4 h-4 mr-2" />
          Run Security Scan
        </button>
      </div>
    </div>

    <!-- Security Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Critical</p>
            <p class="text-2xl font-semibold text-red-600 dark:text-red-400">{{ securityStats.critical }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <AlertTriangle class="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">High</p>
            <p class="text-2xl font-semibold text-orange-600 dark:text-orange-400">{{ securityStats.high }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <AlertTriangle class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Medium</p>
            <p class="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{{ securityStats.medium }}</p>
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
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Low</p>
            <p class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ securityStats.low }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Overview Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Vulnerability Trends</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Security vulnerabilities over time</p>
        </div>
        <div class="p-6">
          <div class="chart-container">
            <canvas ref="trendChart"></canvas>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Severity Distribution</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Breakdown by severity level</p>
        </div>
        <div class="p-6">
          <div class="chart-container">
            <canvas ref="severityChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Vulnerabilities List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Security Vulnerabilities</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Detailed list of all detected vulnerabilities</p>
          </div>
          <div class="flex space-x-3">
            <select
              v-model="selectedSeverity"
              class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                CVE ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Package
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fixed Version
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Published
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="vulnerability in filteredVulnerabilities"
              :key="vulnerability.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ vulnerability.cve }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ vulnerability.packageName }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ vulnerability.packageVersion }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getSeverityBadgeClass(vulnerability.severity)" class="status-badge">
                  {{ vulnerability.severity }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-md truncate">
                  {{ vulnerability.title }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-md truncate">
                  {{ vulnerability.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  v-if="vulnerability.fixedVersion"
                  class="text-sm text-green-600 dark:text-green-400"
                >
                  {{ vulnerability.fixedVersion }}
                </div>
                <div
                  v-else
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  No fix available
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(vulnerability.publishedDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewVulnerability(vulnerability)"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    View Details
                  </button>
                  <button
                    v-if="vulnerability.fixedVersion"
                    @click="fixVulnerability(vulnerability)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Apply Fix
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vulnerability Details Modal -->
    <VulnerabilityModal
      v-if="selectedVulnerability"
      :vulnerability="selectedVulnerability"
      @close="selectedVulnerability = null"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { format } from 'date-fns'
import MainLayout from '../components/layout/MainLayout.vue'
import VulnerabilityModal from '../components/modals/VulnerabilityModal.vue'
import { useDependenciesStore } from '../stores/dependencies'
import { useToastStore } from '../stores/toast'
import type { Vulnerability } from '../data/mockData'
import {
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-vue-next'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const dependenciesStore = useDependenciesStore()
const toastStore = useToastStore()

const selectedSeverity = ref('')
const selectedVulnerability = ref<any>(null)
const trendChart = ref<HTMLCanvasElement>()
const severityChart = ref<HTMLCanvasElement>()

// Flatten all vulnerabilities from all dependencies
const allVulnerabilities = computed(() => {
  const vulnerabilities: any[] = []
  dependenciesStore.dependencies.forEach(dep => {
    dep.vulnerabilities.forEach(vuln => {
      vulnerabilities.push({
        ...vuln,
        packageName: dep.name,
        packageVersion: dep.version
      })
    })
  })
  return vulnerabilities
})

const filteredVulnerabilities = computed(() => {
  if (!selectedSeverity.value) {
    return allVulnerabilities.value
  }
  return allVulnerabilities.value.filter(v => v.severity === selectedSeverity.value)
})

const securityStats = computed(() => {
  const stats = { critical: 0, high: 0, medium: 0, low: 0 }
  allVulnerabilities.value.forEach(vuln => {
    stats[vuln.severity as keyof typeof stats]++
  })
  return stats
})

const getSeverityBadgeClass = (severity: string) => {
  const classes = {
    critical: 'status-critical',
    high: 'status-high',
    medium: 'status-medium',
    low: 'status-low'
  }
  return classes[severity as keyof typeof classes] || 'status-unknown'
}

const formatDate = (date: Date) => {
  return format(date, 'MMM d, yyyy')
}

const runSecurityScan = () => {
  toastStore.info('Security Scan', 'Running comprehensive security scan...')
  setTimeout(() => {
    toastStore.success('Security Scan Complete', `Found ${allVulnerabilities.value.length} vulnerabilities`)
  }, 2000)
}

const viewVulnerability = (vulnerability: any) => {
  selectedVulnerability.value = vulnerability
}

const fixVulnerability = (vulnerability: any) => {
  toastStore.info('Applying Fix', `Updating ${vulnerability.packageName} to ${vulnerability.fixedVersion}`)
  setTimeout(() => {
    toastStore.success('Fix Applied', `${vulnerability.packageName} has been updated`)
  }, 1500)
}

const initCharts = () => {
  nextTick(() => {
    // Trend Chart
    if (trendChart.value) {
      new Chart(trendChart.value, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Critical',
              data: [5, 8, 6, 4, 7, 3],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4
            },
            {
              label: 'High',
              data: [12, 15, 10, 8, 11, 9],
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              tension: 0.4
            },
            {
              label: 'Medium',
              data: [20, 25, 18, 22, 19, 15],
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

    // Severity Distribution Chart
    if (severityChart.value) {
      new Chart(severityChart.value, {
        type: 'doughnut',
        data: {
          labels: ['Critical', 'High', 'Medium', 'Low'],
          datasets: [{
            data: [
              securityStats.value.critical,
              securityStats.value.high,
              securityStats.value.medium,
              securityStats.value.low
            ],
            backgroundColor: [
              'rgb(239, 68, 68)',
              'rgb(249, 115, 22)',
              'rgb(245, 158, 11)',
              'rgb(34, 197, 94)'
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
  })
}

onMounted(() => {
  initCharts()
})
</script>