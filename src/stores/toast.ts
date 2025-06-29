import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString()
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }
    
    toasts.value.push(newToast)
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }

  const warning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }

  const info = (title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
})