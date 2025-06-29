<template>
  <MainLayout>
    <!-- Header Actions -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage and monitor your project dependencies</p>
      </div>
      <button
        @click="showAddProject = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Plus class="w-4 h-4 mr-2" />
        Add Project
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="projectsStore.searchQuery"
              type="text"
              placeholder="Search projects..."
              class="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="selectedStatus"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team</label>
          <select
            v-model="selectedTeam"
            class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Teams</option>
            <option v-for="team in teams" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div :class="getHealthScoreColor(project.healthScore)" class="w-10 h-10 rounded-lg flex items-center justify-center">
                <span class="text-sm font-semibold text-white">{{ project.healthScore }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ project.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ project.team }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="editProject(project)"
                class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <Edit2 class="w-4 h-4" />
              </button>
              <button
                @click="deleteProject(project.id)"
                class="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ project.description }}</p>

          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tech in project.techStack.slice(0, 3)"
              :key="tech"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {{ tech }}
            </span>
            <span
              v-if="project.techStack.length > 3"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              +{{ project.techStack.length - 3 }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Dependencies</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ project.totalDependencies }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Outdated</p>
              <p class="text-lg font-semibold" :class="project.outdatedDependencies > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                {{ project.outdatedDependencies }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div :class="getStatusBadgeClass(project.status)" class="status-badge">
              {{ project.status }}
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Updated {{ formatDate(project.updatedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Project Modal -->
    <ProjectModal
      v-if="showAddProject || editingProject"
      :project="editingProject"
      @close="closeModal"
      @save="saveProject"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format } from 'date-fns'
import MainLayout from '../components/layout/MainLayout.vue'
import ProjectModal from '../components/modals/ProjectModal.vue'
import { useProjectsStore } from '../stores/projects'
import { useToastStore } from '../stores/toast'
import type { Project } from '../data/mockData'
import {
  Plus,
  Search,
  Edit2,
  Trash2
} from 'lucide-vue-next'

const projectsStore = useProjectsStore()
const toastStore = useToastStore()

const showAddProject = ref(false)
const editingProject = ref<Project | null>(null)
const selectedStatus = ref('')
const selectedTeam = ref('')

const teams = computed(() => {
  const allTeams = projectsStore.projects.map(p => p.team)
  return [...new Set(allTeams)].sort()
})

const filteredProjects = computed(() => {
  let filtered = projectsStore.filteredProjects

  if (selectedStatus.value) {
    filtered = filtered.filter(p => p.status === selectedStatus.value)
  }

  if (selectedTeam.value) {
    filtered = filtered.filter(p => p.team === selectedTeam.value)
  }

  return filtered
})

// Watch for changes in filters and update store
watch([selectedStatus, selectedTeam], () => {
  projectsStore.selectedFilters.status = selectedStatus.value ? [selectedStatus.value] : []
  projectsStore.selectedFilters.team = selectedTeam.value ? [selectedTeam.value] : []
})

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

const formatDate = (date: Date) => {
  return format(date, 'MMM d, yyyy')
}

const editProject = (project: Project) => {
  editingProject.value = project
}

const deleteProject = (id: string) => {
  if (confirm('Are you sure you want to delete this project?')) {
    projectsStore.deleteProject(id)
    toastStore.success('Project Deleted', 'Project has been successfully removed')
  }
}

const closeModal = () => {
  showAddProject.value = false
  editingProject.value = null
}

const saveProject = (projectData: any) => {
  if (editingProject.value) {
    projectsStore.updateProject(editingProject.value.id, projectData)
    toastStore.success('Project Updated', 'Project has been successfully updated')
  } else {
    projectsStore.addProject(projectData)
    toastStore.success('Project Added', 'New project has been successfully created')
  }
  closeModal()
}

const clearFilters = () => {
  projectsStore.searchQuery = ''
  selectedStatus.value = ''
  selectedTeam.value = ''
  projectsStore.selectedFilters = {
    status: [],
    techStack: [],
    team: []
  }
}
</script>