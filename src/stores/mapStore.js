import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getShipInfo, getShipAisInfo } from '@/api/shipApi.js'
import { getVoyageList, getShipData } from '@/api/worldMap.js'
import { useToast } from '@/composables/useToast'
import { convertNumberFormat, convertDateType, convertDateTimeType } from '@/composables/util'
import { resetObject } from '@/composables/util'

export const useMapStore = defineStore(
  'mapManagement',
  () => {
    const clickedShipInfo = ref({
      beam: 0,
      callSign: '',
      grossTonnage: 0,
      imoNumber: '',
      length: 0,
      mmsiNumber: '',
      name: '',
      nation: '',
      shipImage: '',
      type: '',
      voccId: null,
      yearBuilt: ''
    })
    const selectedPopMenu = ref(null)
    const aisInfo = ref({
      departure: null,
      departureTime: null,
      arrival: null,
      arrivalTime: null,
      endDateTime: null,
      process: 0,
      latitude: 0,
      longitude: 0,
      course: 0,
      speed: 0,
      draft: 0
    })

    const voyageList = ref([])
    const imoNumberList = ref([])
    const shipDataList = ref([])

    const vesselTrackStatus = ref(false)
    const vesselTrackStatus2 = ref(false)

    const trackStatus = ref(false)
    const isRemoveTrack = ref(false) // 항적 삭제 여부
    const isCurrentTrack = ref(false) // 실시간 항차 조회 여부
    const isPastTrack = ref(false) // 과거 항차 조회 여부

    const startDate = ref('')
    const endDate = ref('')
    const startDate2 = ref('')
    const endDate2 = ref('')
    const isPastVesselTracks = ref(false)

    const layerBright = ref('Day')
    const checkWind = ref(false)
    const checkWave = ref(false)
    const checkFlow = ref(false)
    const checkTempair = ref(false)
    const checkTempwater = ref(false)
    const layerMode = ref('Base')

    const isSelect = ref(false)

    // 지도 레벨 설정
    const mapLevel = ref(0)
    const lon = ref(0)
    const lat = ref(0)

    /**
     * 지도 위 클릭한 선박 정보 조회
     * @returns
     */
    const fetchShipSummary = async (imoNumber) => {
      try {
        const response = await getShipInfo(imoNumber)
        // ({
        //     data: { data: shipInfo.value }
        //   } = response)
        clickedShipInfo.value = response.data.data
        sessionStorage.setItem('clickedShipInfo', JSON.stringify(clickedShipInfo.value))
        console.dir(clickedShipInfo.value)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchShipAisInfo = async (imoNumber) => {
      try {
        const response = await getShipAisInfo(imoNumber)
        let {
          data: { data }
        } = response
        console.dir(response)

        data.departure = data.departure ? data.departure : '-'
        data.arrival = data.arrival ? data.arrival : '-'
        data.departureTime = data.departureTime ? convertDateType(data.departureTime) : '-'
        data.arrivalTime = data.arrivalTime ? convertDateType(data.arrivalTime) : '-'
        data.arrivalDateTime = convertDateTimeType(data.arrivalTime) // 팝업창 내 ETA 시간 표시하기 위함

        data.course = data.course.toFixed(1)
        data.speed = data.speed.toFixed(1)
        data.draft = data.draft.toFixed(1)
        data.process = data.process.toFixed(1)

        aisInfo.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const fetchVoyageList = async (imoNumber) => {
      try {
        const response = await getVoyageList(imoNumber)
        let {
          data: { data }
        } = response

        voyageList.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const fetchShipData = async (imoNumberList) => {
      try {
        const response = await getShipData(imoNumberList)
        let {
          data: { data }
        } = response

        console.log(data)
        shipDataList.value = data.data
      } catch (error) {
        console.error(error)
      }
    }

    const $reset = () => {
      resetObject(clickedShipInfo.value)
      resetObject(selectedPopMenu)
      selectedPopMenu.value = null
      voyageList.value = []
      imoNumberList.value = []
      shipDataList.value = []
    }

    return {
      aisInfo,
      voyageList,
      imoNumberList,
      shipDataList,
      clickedShipInfo,
      vesselTrackStatus,
      vesselTrackStatus2,
      trackStatus,
      startDate,
      endDate,
      startDate2,
      endDate2,
      isPastVesselTracks,
      selectedPopMenu,
      layerBright,
      checkWind,
      checkWave,
      checkFlow,
      checkTempair,
      checkTempwater,
      layerMode,
      mapLevel,
      lon,
      lat,
      isRemoveTrack,
      isPastTrack,
      isCurrentTrack,
      isSelect,
      fetchShipSummary,
      fetchShipAisInfo,
      fetchVoyageList,
      fetchShipData,
      $reset
    }
  },
  {
    persist: true
  }
)
