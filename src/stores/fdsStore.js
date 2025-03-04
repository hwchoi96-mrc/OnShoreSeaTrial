import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFdsStore = defineStore('fds', () => {
  const newIconPos = ref({
    posX: 50,
    posY: 50
  })

  const sensorForm = ref({
    imoNumber: '',
    deck: '',
    installationLocation: '',
    sensorType: '',
    tagId: '',
    sensorNumber: 0,
    posX: 0,
    posY: 0
  })
  return {
    newIconPos,
    sensorForm
  }
})
