import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const isShow = ref(false)
  const resMessage = ref('')
  const duration = ref(3000)

  const showResMsg = (message, timeout = duration.value) => {
    isShow.value = true
    resMessage.value = message
    duration.value = timeout
  }

  return {
    isShow,
    resMessage,
    duration,
    showResMsg
  }
})
