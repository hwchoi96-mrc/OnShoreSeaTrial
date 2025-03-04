import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllVoyageByImoNumber, deleteVoyageById } from '@/api/voyage.js'
import { useToast } from '@/composables/useToast'
import {
  convertNumberFormat,
  convertFloatFormatObject,
  convertDateTimeType
} from '@/composables/util'

export const useVoyageStore = defineStore('voyageManagement', () => {
  const voyages = ref([])
  const { showResMsg } = useToast()
  /**
   * 지도 위 클릭한 선박 정보 조회
   * @returns
   */
  const fetchAllVoyageByImoNumber = async (imoNumber) => {
    try {
      const {
        data: { data }
      } = await getAllVoyageByImoNumber(imoNumber)

      if (data) {
        voyages.value = data.map((voyage) => convertFloatFormatObject(voyage))
      } else {
        voyages.value = data
      }
    } catch (error) {
      console.dir(error)
    }
  }

  const removeVoyageById = async (voyageId) => {
    try {
      const { status } = await deleteVoyageById(voyageId)

      if (status == 200) {
        let index = voyages.value.findIndex((voyage) => voyage.id === voyageId)
        voyages.value.splice(index, 1)
        return status
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    voyages,
    fetchAllVoyageByImoNumber,
    removeVoyageById
  }
})
