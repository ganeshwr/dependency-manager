<template>
  <MainLayout>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">Configure your dependency management preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="activeSection = section.id"
            :class="activeSection === section.id 
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'"
            class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <component :is="section.icon" class="w-5 h-5 mr-3" />
            {{ section.name }}
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2">
        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Configure basic application preferences</p>
          </div>
          <div class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization Name
              </label>
              <input
                v-model="settings.organizationName"
                type="text"
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Scan Frequency
              </label>
              <select
                v-model="settings.scanFrequency"
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div class="flex items-center">
              <input
                v-model="settings.autoUpdate"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                Enable automatic dependency updates
              </label>
            </div>

            <div class="flex items-center">
              <input
                v-model="settings.emailNotifications"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                Send email notifications for security alerts
              </label>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeSection === 'security'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Configure security scanning and alert preferences</p>
          </div>
          <div class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Security Level for Alerts
              </label>
              <select
                v-model="settings.minSecurityLevel"
                class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div class="flex items-center">
              <input
                v-model="settings.blockCriticalVulns"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                Block deployments with critical vulnerabilities
              </label>
            </div>

            <div class="flex items-center">
              <input
                v-model="settings.autoSecurityScans"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                Run automatic security scans on new dependencies
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vulnerability Database Sources
              </label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                    v-model="settings.vulnSources.nvd"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                    National Vulnerability Database (NVD)
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="settings.vulnSources.github"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                    GitHub Security Advisories
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="settings.vulnSources.snyk"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                    Snyk Vulnerability Database
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeSection === 'notifications'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Configure how and when you receive notifications</p>
          </div>
          <div class="p-6 space-y-6">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Email Notifications</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                    v-model="settings.notifications.securityAlerts"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                    Security vulnerability alerts
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="settings.notifications.dependencyUpdates"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                    Dependency update notifications
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    v-model="settings.notifications.weeklyReports"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                    Weekly summary reports
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Slack Integration</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slack Webhook URL
                  </label>
                  <input
                    v-model="settings.slackWebhook"
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div class="flex items-center">
                  <input
                    v-model="settings.slackNotifications"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                    Send notifications to Slack
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Integrations Settings -->
        <div v-if="activeSection === 'integrations'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Integrations</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Connect with external services and tools</p>
          </div>
          <div class="p-6 space-y-6">
            <!-- GitHub Integration -->
            <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Github class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">GitHub</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Sync repositories and security advisories</p>
                  </div>
                </div>
                <button
                  @click="toggleIntegration('github')"
                  :class="settings.integrations.github 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ settings.integrations.github ? 'Connected' : 'Connect' }}
                </button>
              </div>
              <div v-if="settings.integrations.github">
                <input
                  v-model="settings.githubToken"
                  type="password"
                  placeholder="GitHub Personal Access Token"
                  class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <!-- JIRA Integration -->
            <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <ExternalLink class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">JIRA</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Create tickets for security vulnerabilities</p>
                  </div>
                </div>
                <button
                  @click="toggleIntegration('jira')"
                  :class="settings.integrations.jira 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ settings.integrations.jira ? 'Connected' : 'Connect' }}
                </button>
              </div>
              <div v-if="settings.integrations.jira" class="space-y-3">
                <input
                  v-model="settings.jiraUrl"
                  type="url"
                  placeholder="JIRA Instance URL"
                  class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  v-model="settings.jiraToken"
                  type="password"
                  placeholder="JIRA API Token"
                  class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="mt-6 flex justify-end">
          <button
            @click="saveSettings"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Save class="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import { useToastStore } from '../stores/toast'
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Zap,
  Github,
  ExternalLink,
  Save
} from 'lucide-vue-next'

const toastStore = useToastStore()

const activeSection = ref('general')

const sections = [
  { id: 'general', name: 'General', icon: SettingsIcon },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'integrations', name: 'Integrations', icon: Zap }
]

const settings = ref({
  organizationName: 'Acme Corporation',
  scanFrequency: 'weekly',
  autoUpdate: false,
  emailNotifications: true,
  minSecurityLevel: 'medium',
  blockCriticalVulns: true,
  autoSecurityScans: true,
  vulnSources: {
    nvd: true,
    github: true,
    snyk: false
  },
  notifications: {
    securityAlerts: true,
    dependencyUpdates: false,
    weeklyReports: true
  },
  slackWebhook: '',
  slackNotifications: false,
  integrations: {
    github: false,
    jira: false
  },
  githubToken: '',
  jiraUrl: '',
  jiraToken: ''
})

const toggleIntegration = (integration: 'github' | 'jira') => {
  settings.value.integrations[integration] = !settings.value.integrations[integration]
  
  if (settings.value.integrations[integration]) {
    toastStore.success('Integration Enabled', `${integration} integration has been enabled`)
  } else {
    toastStore.info('Integration Disabled', `${integration} integration has been disabled`)
  }
}

const saveSettings = () => {
  // In a real app, this would save to a backend
  localStorage.setItem('depmanager-settings', JSON.stringify(settings.value))
  toastStore.success('Settings Saved', 'Your preferences have been updated successfully')
}

// Load settings from localStorage on component mount
const loadSettings = () => {
  const saved = localStorage.getItem('depmanager-settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      settings.value = { ...settings.value, ...parsed }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }
}

loadSettings()
</script>