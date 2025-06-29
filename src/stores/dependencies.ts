import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockDependencies, type Dependency } from '../data/mockData'

export const useDependenciesStore = defineStore('dependencies', () => {
  const dependencies = ref<Dependency[]>(generateMockDependencies())
  const loading = ref(false)
  const searchQuery = ref('')
  const selectedFilters = ref({
    type: [] as string[],
    license: [] as string[],
    status: [] as string[],
    securityLevel: [] as string[]
  })

  const filteredDependencies = computed(() => {
    let filtered = dependencies.value

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(dep =>
        dep.name.toLowerCase().includes(query) ||
        dep.description.toLowerCase().includes(query) ||
        dep.license.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (selectedFilters.value.type.length > 0) {
      filtered = filtered.filter(dep =>
        selectedFilters.value.type.includes(dep.type)
      )
    }

    // License filter
    if (selectedFilters.value.license.length > 0) {
      filtered = filtered.filter(dep =>
        selectedFilters.value.license.includes(dep.license)
      )
    }

    // Status filter
    if (selectedFilters.value.status.length > 0) {
      filtered = filtered.filter(dep =>
        selectedFilters.value.status.includes(dep.status)
      )
    }

    // Security level filter
    if (selectedFilters.value.securityLevel.length > 0) {
      filtered = filtered.filter(dep =>
        selectedFilters.value.securityLevel.includes(dep.securityLevel)
      )
    }

    return filtered
  })

  const dependencyStats = computed(() => {
    const total = dependencies.value.length
    const critical = dependencies.value.filter(d => d.securityLevel === 'critical').length
    const outdated = dependencies.value.filter(d => d.status === 'outdated').length
    const upToDate = dependencies.value.filter(d => d.status === 'up-to-date').length

    return {
      total,
      critical,
      outdated,
      upToDate,
      vulnerabilities: dependencies.value.reduce((sum, d) => sum + d.vulnerabilities.length, 0)
    }
  })

  const addDependency = (dependency: Omit<Dependency, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDependency: Dependency = {
      ...dependency,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    dependencies.value.push(newDependency)
  }

  const updateDependency = (id: string, updates: Partial<Dependency>) => {
    const index = dependencies.value.findIndex(d => d.id === id)
    if (index !== -1) {
      dependencies.value[index] = {
        ...dependencies.value[index],
        ...updates,
        updatedAt: new Date()
      }
    }
  }

  const deleteDependency = (id: string) => {
    const index = dependencies.value.findIndex(d => d.id === id)
    if (index !== -1) {
      dependencies.value.splice(index, 1)
    }
  }

  return {
    dependencies,
    loading,
    searchQuery,
    selectedFilters,
    filteredDependencies,
    dependencyStats,
    addDependency,
    updateDependency,
    deleteDependency
  }
})