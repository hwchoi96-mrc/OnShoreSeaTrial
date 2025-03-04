import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loadingStatus = ref(false)

  const refreshDataTime = ref('')

  return {
    loadingStatus,
    refreshDataTime
  }
})
