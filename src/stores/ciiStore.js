import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCiiListByImoNumber,
  getAnnualCiiData,
  getMonthlyCiiData,
  getQuarterlyCiiData
} from '@/api/cii.js'
import { useToast } from '@/composables/useToast'
import { convertFloatFormatObject } from '@/composables/util'

export const useCiiStore = defineStore('ciiManagement', () => {
  const ciiList = ref([])
  const annualCiiData = ref({})
  const monthlyCiiData = ref({
    ciiGradeList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ciiRatingList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    attainedCiiList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    co2EmissionList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focTotalList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focHfoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focMdoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focMgoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focLfoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focLpgList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focLngList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ciiGradeRangeA: {
      first: null,
      second: null
    },
    ciiGradeRangeB: {
      first: null,
      second: null
    },
    ciiGradeRangeC: {
      first: null,
      second: null
    },
    ciiGradeRangeD: {
      first: null,
      second: null
    },
    ciiGradeRangeE: {
      first: null,
      second: null
    }
  })

  /**
   * 지도 위 클릭한 선박 정보 조회
   * @returns
   */
  const fetchCiiListByImoNumber = async (imoNumber) => {
    try {
      const {
        data: { data }
      } = await getCiiListByImoNumber(imoNumber)

      if (data != null) {
        ciiList.value = data.map((cii) => convertFloatFormatObject(cii))
      } else {
        ciiList.value = []
      }
      console.dir(ciiList.value)
    } catch (error) {
      console.dir(error)
    }
  }

  const fetchAnualCiiData = async (imoNumber, year) => {
    try {
      const {
        data: { data }
      } = await getAnnualCiiData(imoNumber, year)

      if (data != null) {
        annualCiiData.value = convertFloatFormatObject(data)
      } else {
        annualCiiData.value = []
      }
    } catch (error) {
      console.dir(error)
    }
  }

  const fetchMonthlyCiiData = async (imoNumber, year) => {
    try {
      const {
        data: { data }
      } = await getMonthlyCiiData(imoNumber, year)

      if (data) {
        monthlyCiiData.value = convertFloatFormatObject(data)
      } else {
        monthlyCiiData.value = []
      }

      return monthlyCiiData.value
    } catch (error) {
      console.dir(error)
    }
  }

  const fetchQuarterlyCiiData = async (imoNumber, year) => {
    try {
      const {
        data: { data }
      } = await getQuarterlyCiiData(imoNumber, year)

      if (data) {
        monthlyCiiData.value = convertFloatFormatObject(data)
      } else {
        monthlyCiiData.value = []
      }

      return monthlyCiiData.value
    } catch (error) {
      console.dir(error)
    }
  }

  return {
    ciiList,
    annualCiiData,
    monthlyCiiData,
    fetchCiiListByImoNumber,
    fetchAnualCiiData,
    fetchMonthlyCiiData,
    fetchQuarterlyCiiData
  }
})
