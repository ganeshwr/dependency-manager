<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {{ dependency ? 'Edit Dependency' : 'Add New Dependency' }}
              </h3>
              <div class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Package Name
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., react, lodash, express"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Version
                    </label>
                    <input
                      v-model="form.version"
                      type="text"
                      class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="1.0.0"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Latest Version
                    </label>
                    <input
                      v-model="form.latestVersion"
                      type="text"
                      class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="1.2.0"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    v-model="form.type"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="production">Production</option>
                    <option value="development">Development</option>
                    <option value="peer">Peer</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    License
                  </label>
                  <select
                    v-model="form.license"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="MIT">MIT</option>
                    <option value="Apache-2.0">Apache-2.0</option>
                    <option value="GPL-3.0">GPL-3.0</option>
                    <option value="BSD-3-Clause">BSD-3-Clause</option>
                    <option value="ISC">ISC</option>
                    <option value="LGPL-2.1">LGPL-2.1</option>
                    <option value="MPL-2.0">MPL-2.0</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief description of the dependency"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Security Level
                  </label>
                  <select
                    v-model="form.securityLevel"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Projects Using This Dependency
                  </label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span
                      v-for="project in form.projects"
                      :key="project"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {{ project }}
                      <button
                        @click="removeProject(project)"
                        class="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                  <div class="flex space-x-2">
                    <input
                      v-model="newProject"
                      @keyup.enter="addProject"
                      type="text"
                      placeholder="Add project name"
                      class="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      @click="addProject"
                      type="button"
                      class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="save"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {{ dependency ? 'Update' : 'Create' }}
          </button>
          <button
            @click="$emit('close')"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Dependency } from '../../data/mockData'
import { X } from 'lucide-vue-next'

interface Props {
  dependency?: Dependency | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

const form = ref({
  name: '',
  version: '',
  latestVersion: '',
  type: 'production' as 'production' | 'development' | 'peer',
  license: 'MIT',
  description: '',
  securityLevel: 'low' as 'low' | 'medium' | 'high' | 'critical',
  projects: [] as string[]
})

const newProject = ref('')

const addProject = () => {
  if (newProject.value.trim() && !form.value.projects.includes(newProject.value.trim())) {
    form.value.projects.push(newProject.value.trim())
    newProject.value = ''
  }
}

const removeProject = (project: string) => {
  const index = form.value.projects.indexOf(project)
  if (index > -1) {
    form.value.projects.splice(index, 1)
  }
}

const save = () => {
  if (!form.value.name.trim() || !form.value.version.trim()) {
    return
  }

  const dependencyData = {
    ...form.value,
    status: form.value.version === form.value.latestVersion ? 'up-to-date' : 'outdated',
    vulnerabilities: props.dependency?.vulnerabilities || []
  }

  emit('save', dependencyData)
}

onMounted(() => {
  if (props.dependency) {
    form.value = {
      name: props.dependency.name,
      version: props.dependency.version,
      latestVersion: props.dependency.latestVersion,
      type: props.dependency.type,
      license: props.dependency.license,
      description: props.dependency.description,
      securityLevel: props.dependency.securityLevel,
      projects: [...props.dependency.projects]
    }
  }
})
</script>