import { reactive, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import {
  addFleet,
  getFleetsByVocc,
  getFleetsByVoccId,
  addShipsByFleet,
  deleteFleet
} from '@/api/fleetApi.js'
import { useShipStore } from '@/stores/shipStore'
import { useToast } from '@/composables/useToast'

export const useFleetStore = defineStore(
  'fleetManagement',
  () => {
    const fleets = ref([])
    const fleetInfo = ref()
    let currentFleet = ref()
    const shipStore = useShipStore()
    const { showResMsg } = useToast()

    /**
     * 선단 추가
     * @param {*} fleetRegisterForm
     */
    const registerFleet = async (fleetRegisterForm) => {
      try {
        const response = await addFleet(fleetRegisterForm)
        let {
          data: { data, statusCode }
        } = response

        let status = parseInt(statusCode.substr(0, 3))
        if (status == 201) {
          fleets.value.push({ id: data, ...fleetRegisterForm, imoNumberList: null })
          showResMsg('새 선단이 추가되었습니다')
        }
      } catch (error) {
        console.log(error)
      }
    }

    /**
     * 선단에 속한 선박 리스트 업데이트
     * @param {} shipList
     */
    const saveShipsByFleet = async (name, shipList, editShipArray) => {
      try {
        const response = await addShipsByFleet(shipList)

        console.dir(response)

        let {
          data: { statusCode }
        } = response

        let status = parseInt(statusCode.substr(0, 3))

        if (status == 200) {
          const { id, imoNumberList } = shipList
          const { newValue, removedValue } = editShipArray

          shipStore.ships.forEach((ship) => {
            if (newValue.includes(ship.imoNumber)) {
              ship.fleetId = id
              ship.fleetName = name
            }

            if (removedValue.includes(ship.imoNumber)) {
              ship.fleetId = null
              ship.fleetName = null
            }
          })
        }
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    /**
     * 로그인한 사용자가 속한 선사의 선단 목록 조회
     * @returns
     */
    const fetchFleetsByVocc = async () => {
      try {
        const response = await getFleetsByVocc()
        // ({
        //     data: { data: fleets.value }
        //   } = response)
        fleets.value = response.data.data
      } catch (error) {
        if (error.response) {
          const errCode = error.response.data.errCode
          if (errCode == 'NOT_FOUND_FLLET_INFO') {
            fleets.value = []
          }
        }
      }
    }

    /**
     * 선사 아이디를 통해 선단 목록 조회
     * @returns
     */
    const fetchFleetsByVoccId = async (voccId) => {
      let result = ''
      try {
        const response = await getFleetsByVoccId(voccId)
        const {
          data: { data }
        } = response
        return data
      } catch (error) {
        const errStatus = error.response.status
        console.error(error)
        if (errStatus == 404) {
          result = []
        }
      }
      return result
    }

    /**
     * 선단 정보 삭제
     * @returns
     */
    const removeFleet = async (fleetId) => {
      try {
        const response = await deleteFleet(fleetId)

        let {
          data: { statusCode }
        } = response

        let status = parseInt(statusCode.substr(0, 3))

        if (status == 200) {
          const index = fleets.value.findIndex((fleet) => fleet.id === fleetId)
          fleets.value.splice(index, 1)

          return status
        }
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    return {
      fleets,
      currentFleet,
      fleetInfo,
      registerFleet,
      fetchFleetsByVocc,
      fetchFleetsByVoccId,
      saveShipsByFleet,
      removeFleet
    }
  },
  { persist: true }
)
