<template>
  <MainLayout>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dependencies</h1>
        <p class="text-gray-600 dark:text-gray-400">Track and manage all project dependencies</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="exportData"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <Download class="w-4 h-4 mr-2" />
          Export
        </button>
        <button
          @click="showAddDependency = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus class="w-4 h-4 mr-2" />
          Add Dependency
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Package class="w-8 h-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Dependencies</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ dependenciesStore.dependencyStats.total }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <AlertTriangle class="w-8 h-8 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Critical Issues</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ dependenciesStore.dependencyStats.critical }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <RefreshCw class="w-8 h-8 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Outdated</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ dependenciesStore.dependencyStats.outdated }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Up to Date</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ dependenciesStore.dependencyStats.upToDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="dependenciesStore.searchQuery"
              type="text"
              placeholder="Search dependencies..."
              class="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
          <select
            v-model="selectedType"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            <option value="production">Production</option>
            <option value="development">Development</option>
            <option value="peer">Peer</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="selectedStatus"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="up-to-date">Up to Date</option>
            <option value="outdated">Outdated</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Security Level</label>
          <select
            v-model="selectedSecurityLevel"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Dependencies Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Version
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                License
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Security
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Projects
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="dependency in paginatedDependencies"
              :key="dependency.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-8 h-8">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <Package class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ dependency.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {{ dependency.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ dependency.version }}</div>
                <div
                  v-if="dependency.version !== dependency.latestVersion"
                  class="text-xs text-blue-600 dark:text-blue-400"
                >
                  → {{ dependency.latestVersion }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getTypeBadgeClass(dependency.type)">
                  {{ dependency.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ dependency.license }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(dependency.status)" class="status-badge">
                  {{ dependency.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getSecurityBadgeClass(dependency.securityLevel)" class="status-badge">
                  {{ dependency.securityLevel }}
                </span>
                <div
                  v-if="dependency.vulnerabilities.length > 0"
                  class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                >
                  {{ dependency.vulnerabilities.length }} vulnerabilities
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ dependency.projects.length }} projects
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editDependency(dependency)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteDependency(dependency.id)"
                    class="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredDependencies.length) }} of {{ filteredDependencies.length }} results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft class="w-5 h-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="page === currentPage 
                    ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900 dark:text-primary-300' 
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600'"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <ChevronRight class="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dependency Modal -->
    <DependencyModal
      v-if="showAddDependency || editingDependency"
      :dependency="editingDependency"
      @close="closeModal"
      @save="saveDependency"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import DependencyModal from '../components/modals/DependencyModal.vue'
import { useDependenciesStore } from '../stores/dependencies'
import { useToastStore } from '../stores/toast'
import type { Dependency } from '../data/mockData'
import {
  Plus,
  Download,
  Search,
  Package,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

const dependenciesStore = useDependenciesStore()
const toastStore = useToastStore()

const showAddDependency = ref(false)
const editingDependency = ref<Dependency | null>(null)
const selectedType = ref('')
const selectedStatus = ref('')
const selectedSecurityLevel = ref('')
const currentPage = ref(1)
const pageSize = 10

const filteredDependencies = computed(() => {
  let filtered = dependenciesStore.filteredDependencies

  if (selectedType.value) {
    filtered = filtered.filter(d => d.type === selectedType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(d => d.status === selectedStatus.value)
  }

  if (selectedSecurityLevel.value) {
    filtered = filtered.filter(d => d.securityLevel === selectedSecurityLevel.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredDependencies.value.length / pageSize))

const paginatedDependencies = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredDependencies.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Watch for filter changes and reset pagination
watch([selectedType, selectedStatus, selectedSecurityLevel, () => dependenciesStore.searchQuery], () => {
  currentPage.value = 1
})

const getTypeBadgeClass = (type: string) => {
  const classes = {
    production: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    development: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    peer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'up-to-date': 'status-up-to-date',
    'outdated': 'status-outdated',
    'deprecated': 'status-critical'
  }
  return classes[status as keyof typeof classes] || 'status-unknown'
}

const getSecurityBadgeClass = (level: string) => {
  const classes = {
    low: 'status-low',
    medium: 'status-medium',
    high: 'status-high',
    critical: 'status-critical'
  }
  return classes[level as keyof typeof classes] || 'status-unknown'
}

const editDependency = (dependency: Dependency) => {
  editingDependency.value = dependency
}

const deleteDependency = (id: string) => {
  if (confirm('Are you sure you want to delete this dependency?')) {
    dependenciesStore.deleteDependency(id)
    toastStore.success('Dependency Deleted', 'Dependency has been successfully removed')
  }
}

const closeModal = () => {
  showAddDependency.value = false
  editingDependency.value = null
}

const saveDependency = (dependencyData: any) => {
  if (editingDependency.value) {
    dependenciesStore.updateDependency(editingDependency.value.id, dependencyData)
    toastStore.success('Dependency Updated', 'Dependency has been successfully updated')
  } else {
    dependenciesStore.addDependency(dependencyData)
    toastStore.success('Dependency Added', 'New dependency has been successfully created')
  }
  closeModal()
}

const clearFilters = () => {
  dependenciesStore.searchQuery = ''
  selectedType.value = ''
  selectedStatus.value = ''
  selectedSecurityLevel.value = ''
  currentPage.value = 1
}

const exportData = () => {
  const data = filteredDependencies.value.map(dep => ({
    name: dep.name,
    version: dep.version,
    latestVersion: dep.latestVersion,
    type: dep.type,
    license: dep.license,
    status: dep.status,
    securityLevel: dep.securityLevel,
    vulnerabilities: dep.vulnerabilities.length,
    projects: dep.projects.join(', ')
  }))

  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'dependencies.csv'
  a.click()
  URL.revokeObjectURL(url)
  
  toastStore.success('Export Complete', 'Dependencies data has been exported to CSV')
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>