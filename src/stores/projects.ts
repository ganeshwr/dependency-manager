import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockProjects, type Project } from '../data/mockData'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>(generateMockProjects())
  const loading = ref(false)
  const searchQuery = ref('')
  const selectedFilters = ref({
    status: [] as string[],
    techStack: [] as string[],
    team: [] as string[]
  })

  const filteredProjects = computed(() => {
    let filtered = projects.value

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.team.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (selectedFilters.value.status.length > 0) {
      filtered = filtered.filter(project =>
        selectedFilters.value.status.includes(project.status)
      )
    }

    // Tech stack filter
    if (selectedFilters.value.techStack.length > 0) {
      filtered = filtered.filter(project =>
        project.techStack.some(tech =>
          selectedFilters.value.techStack.includes(tech)
        )
      )
    }

    // Team filter
    if (selectedFilters.value.team.length > 0) {
      filtered = filtered.filter(project =>
        selectedFilters.value.team.includes(project.team)
      )
    }

    return filtered
  })

  const projectStats = computed(() => {
    const total = projects.value.length
    const critical = projects.value.filter(p => p.securityScore <= 3).length
    const outdated = projects.value.filter(p => p.outdatedDependencies > 0).length
    const upToDate = projects.value.filter(p => p.outdatedDependencies === 0).length

    return {
      total,
      critical,
      outdated,
      upToDate,
      averageHealthScore: Math.round(
        projects.value.reduce((sum, p) => sum + p.healthScore, 0) / total
      )
    }
  })

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    projects.value.push(newProject)
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.value[index] = {
        ...projects.value[index],
        ...updates,
        updatedAt: new Date()
      }
    }
  }

  const deleteProject = (id: string) => {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
    }
  }

  const getProject = (id: string) => {
    return projects.value.find(p => p.id === id)
  }

  return {
    projects,
    loading,
    searchQuery,
    selectedFilters,
    filteredProjects,
    projectStats,
    addProject,
    updateProject,
    deleteProject,
    getProject
  }
})