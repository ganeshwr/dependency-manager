<template>
  <MainLayout>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Projects"
        :value="projectsStore.projectStats.total"
        :icon="FolderOpen"
        color="blue"
        :change="5.2"
        description="Active projects being monitored"
      />
      <StatsCard
        title="Dependencies"
        :value="dependenciesStore.dependencyStats.total"
        :icon="Package"
        color="green"
        :change="12.1"
        description="Total dependencies tracked"
      />
      <StatsCard
        title="Security Alerts"
        :value="dependenciesStore.dependencyStats.critical"
        :icon="Shield"
        color="red"
        :change="-8.3"
        description="Critical vulnerabilities found"
      />
      <StatsCard
        title="Health Score"
        :value="`${projectsStore.projectStats.averageHealthScore}%`"
        :icon="Activity"
        color="purple"
        :change="2.4"
        description="Average project health score"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Project Health Overview -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Project Health Overview</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Health scores and security status for all projects</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="project in topProjects"
                :key="project.id"
                class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div :class="getHealthScoreColor(project.healthScore)" class="w-10 h-10 rounded-lg flex items-center justify-center">
                      <span class="text-sm font-semibold text-white">{{ project.healthScore }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ project.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ project.team }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="text-right">
                    <p class="text-sm text-gray-900 dark:text-white">{{ project.totalDependencies }} deps</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ project.outdatedDependencies }} outdated
                    </p>
                  </div>
                  <div :class="getStatusBadgeClass(project.status)" class="status-badge">
                    {{ project.status }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Alerts -->
      <div class="space-y-6">
        <!-- Recent Alerts -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Security Alerts</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Recent vulnerabilities detected</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="alert in securityAlerts"
                :key="alert.id"
                class="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex-shrink-0">
                  <div :class="getSeverityColor(alert.severity)" class="w-2 h-2 rounded-full mt-2"></div>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ alert.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ alert.package }}</p>
                  <div class="flex items-center justify-between mt-2">
                    <span :class="getSeverityBadgeClass(alert.severity)" class="status-badge">
                      {{ alert.severity }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ alert.age }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div class="p-6 space-y-3">
            <button
              @click="runSecurityScan"
              class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Shield class="w-4 h-4 mr-2" />
              Run Security Scan
            </button>
            <button
              @click="updateDependencies"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <RefreshCw class="w-4 h-4 mr-2" />
              Update Dependencies
            </button>
            <button
              @click="generateReport"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Download class="w-4 h-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import StatsCard from '../components/ui/StatsCard.vue'
import { useProjectsStore } from '../stores/projects'
import { useDependenciesStore } from '../stores/dependencies'
import { useToastStore } from '../stores/toast'
import {
  FolderOpen,
  Package,
  Shield,
  Activity,
  RefreshCw,
  Download
} from 'lucide-vue-next'

const projectsStore = useProjectsStore()
const dependenciesStore = useDependenciesStore()
const toastStore = useToastStore()

const topProjects = computed(() => {
  return projectsStore.projects
    .slice(0, 6)
    .sort((a, b) => b.healthScore - a.healthScore)
})

const securityAlerts = computed(() => [
  {
    id: '1',
    title: 'Critical vulnerability in lodash',
    package: 'lodash@4.17.20',
    severity: 'critical' as const,
    age: '2 days ago'
  },
  {
    id: '2',
    title: 'XSS vulnerability in axios',
    package: 'axios@0.21.1',
    severity: 'high' as const,
    age: '5 days ago'
  },
  {
    id: '3',
    title: 'DoS vulnerability in express',
    package: 'express@4.17.1',
    severity: 'medium' as const,
    age: '1 week ago'
  }
])

const getHealthScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    active: 'status-up-to-date',
    maintenance: 'status-medium',
    deprecated: 'status-critical'
  }
  return classes[status as keyof typeof classes] || 'status-unknown'
}

const getSeverityColor = (severity: string) => {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }
  return colors[severity as keyof typeof colors] || 'bg-gray-500'
}

const getSeverityBadgeClass = (severity: string) => {
  const classes = {
    critical: 'status-critical',
    high: 'status-high',
    medium: 'status-medium',
    low: 'status-low'
  }
  return classes[severity as keyof typeof classes] || 'status-unknown'
}

const runSecurityScan = () => {
  toastStore.info('Security Scan', 'Initiating security scan across all projects...')
  // Simulate scan completion
  setTimeout(() => {
    toastStore.success('Security Scan Complete', 'Found 3 new vulnerabilities')
  }, 2000)
}

const updateDependencies = () => {
  toastStore.info('Dependency Update', 'Checking for dependency updates...')
  setTimeout(() => {
    toastStore.success('Dependencies Updated', '12 dependencies updated successfully')
  }, 3000)
}

const generateReport = () => {
  toastStore.success('Report Generated', 'Security report has been downloaded')
}
</script>