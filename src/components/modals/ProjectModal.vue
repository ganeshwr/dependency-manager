<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {{ project ? 'Edit Project' : 'Add New Project' }}
              </h3>
              <div class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter project description"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    v-model="form.status"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Team
                  </label>
                  <select
                    v-model="form.team"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Frontend Team">Frontend Team</option>
                    <option value="Backend Team">Backend Team</option>
                    <option value="DevOps Team">DevOps Team</option>
                    <option value="Mobile Team">Mobile Team</option>
                    <option value="Data Team">Data Team</option>
                    <option value="Security Team">Security Team</option>
                    <option value="Platform Team">Platform Team</option>
                    <option value="QA Team">QA Team</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tech Stack
                  </label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span
                      v-for="tech in form.techStack"
                      :key="tech"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {{ tech }}
                      <button
                        @click="removeTech(tech)"
                        class="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                  <div class="flex space-x-2">
                    <input
                      v-model="newTech"
                      @keyup.enter="addTech"
                      type="text"
                      placeholder="Add technology"
                      class="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      @click="addTech"
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
            {{ project ? 'Update' : 'Create' }}
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
import type { Project } from '../../data/mockData'
import { X } from 'lucide-vue-next'

interface Props {
  project?: Project | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

const form = ref({
  name: '',
  description: '',
  status: 'active' as 'active' | 'maintenance' | 'deprecated',
  team: 'Frontend Team',
  techStack: [] as string[]
})

const newTech = ref('')

const addTech = () => {
  if (newTech.value.trim() && !form.value.techStack.includes(newTech.value.trim())) {
    form.value.techStack.push(newTech.value.trim())
    newTech.value = ''
  }
}

const removeTech = (tech: string) => {
  const index = form.value.techStack.indexOf(tech)
  if (index > -1) {
    form.value.techStack.splice(index, 1)
  }
}

const save = () => {
  if (!form.value.name.trim()) {
    return
  }

  const projectData = {
    ...form.value,
    totalDependencies: props.project?.totalDependencies || Math.floor(Math.random() * 50) + 10,
    outdatedDependencies: props.project?.outdatedDependencies || Math.floor(Math.random() * 10),
    securityScore: props.project?.securityScore || Math.floor(Math.random() * 10) + 1,
    healthScore: props.project?.healthScore || Math.floor(Math.random() * 40) + 60,
    lastScan: new Date(),
    dependencies: props.project?.dependencies || []
  }

  emit('save', projectData)
}

onMounted(() => {
  if (props.project) {
    form.value = {
      name: props.project.name,
      description: props.project.description,
      status: props.project.status,
      team: props.project.team,
      techStack: [...props.project.techStack]
    }
  }
})
</script>