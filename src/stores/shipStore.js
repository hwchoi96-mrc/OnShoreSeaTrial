import { computed, reactive, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import {
  registerShip,
  updateShip,
  updateShipImage,
  getShipsByVocc,
  getShipsByFleetId,
  getShipInfo,
  deleteShip,
  getShipMachineInfo,
  getShipsByVoccId
} from '@/api/shipApi.js'
import { useFleetStore } from '@/stores/fleetStore'
import { useToast } from '@/composables/useToast'
import _ from 'lodash'

export const useShipStore = defineStore(
  'shipManagement',
  () => {
    const ships = ref([])
    const voccShips = ref([])
    const shipInfo = ref()
    const currentShip = ref(null)
    const shipMachineInfo = ref(null)
    const shipEngines = ref([])
    const shipPropellers = ref([])
    const usedFuels = ref([])
    // const usedFuels1 = computed(() => usedFuels.value || [])
    const shipEngines1 = computed(() => shipEngines.value || [])
    // 사이드바에서 선택한 선박
    const checkedShips = ref()

    const curSelectedShip = ref({
      imoNumber: null,
      name: null,
      nation: null,
      mmsiNumber: null,
      type: null,
      voccId: null,
      callSign: null,
      grossTonnage: null,
      summerDwt: null,
      length: null,
      beam: null,
      yearBuilt: null,
      shipImage: null
    })
    const selectedShip = ref(null)
    const fleetStore = useFleetStore()
    const { showResMsg } = useToast()

    /**
     * 선박 추가
     * @param {*} shipRegisterForm
     * @returns
     */
    const addShip = async (shipRegisterForm) => {
      try {
        console.log('등록 요청')
        console.dir(shipRegisterForm)
        const response = await registerShip(shipRegisterForm)
        console.dir(response)
        let {
          data: { statusCode }
        } = response

        let status = parseInt(statusCode.substr(0, 3))
        if (status == 201) {
          ships.value.push(shipRegisterForm)
          showResMsg('선박이 성공적으로 추가가 되었습니다')
          return status
        }
      } catch (error) {
        console.log(error)
      }
    }

    /**
     * 선박 정보 수정
     * @param {} shipEditForm
     */
    const editShipInfo = async (shipEditForm) => {
      try {
        const response = await updateShip(shipEditForm)
        const status = response.status
        if (status == 200) {
          shipInfo.value = { ...shipEditForm }
          showResMsg('선박 정보가 수정되었습니다')
        }
      } catch (error) {
        const errorMsg = error.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    /**
     * 선박 이미지 변경
     * @param {*} imoNumber
     * @param {*} image
     * @returns
     */
    const changeShipImage = async (imoNumber, image) => {
      try {
        const { status } = await updateShipImage(imoNumber, image)

        if (status == 200) {
          let bytes = new Uint8Array(image)
          let binaryString = bytes.reduce((data, byte) => data + String.fromCharCode(byte), '')
          shipInfo.value.shipImage = btoa(binaryString)
          return status
        }
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선사의 선박 목록 조회
     * 선박 정보에 선사 아이디, 선사명 추가
     * @returns
     */
    const fetchShipsByVocc = async () => {
      try {
        const response = await getShipsByVocc()
        const {
          data: { data: result }
        } = response

        if (fleetStore.fleets.length <= 0) {
          await fleetStore.fetchFleetsByVocc()
        }
        let fleetInfo = {}
        const newShipInfo = result.map((item) => {
          fleetInfo = isIncludedShip(fleetStore.fleets, item)
          return { ...item, ...fleetInfo }
        })

        ships.value = _.cloneDeep(newShipInfo)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchShipsByVoccId = async (voccId) => {
      try {
        const response = await getShipsByVoccId(voccId)
        const {
          data: { data }
        } = response

        voccShips.value = data

        return data
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선단 아이디를 통해 선사의 선박 목록 조회
     * @param {} voccId
     */
    const fetchShipsByFleetId = async (fleetId) => {
      try {
        const {
          data: { data }
        } = await getShipsByFleetId(fleetId)

        return data
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선박 정보 조회
     * @returns
     */
    const fetchShipInfo = async (imoNumber) => {
      try {
        const response = await getShipInfo(imoNumber)
        // ({
        //     data: { data: shipInfo.value }
        //   } = response)
        shipInfo.value = response.data.data
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선박 정보 삭제
     * @returns
     */
    const removeShip = async (imoNumber) => {
      try {
        const response = await deleteShip(imoNumber)
        const status = response.status
        if (status == 200) {
          const index = ships.value.findIndex((ship) => ship.imoNumber === imoNumber)
          ships.value.splice(index, 1)
          showResMsg('해당 선박이 성공적으로 삭제되었습니다')
          return status
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchShipMachineInfo = async (imoNumber) => {
      usedFuels.value = []
      shipEngines.value = []
      shipPropellers.value = []

      if (!imoNumber) {
        showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
        return
      }

      let engines = []
      let propellers = []
      try {
        ;({
          data: { data: shipMachineInfo.value }
        } = await getShipMachineInfo(imoNumber))

        if (shipMachineInfo.value) {
          const { mainEngineCount, generatorEngineCount, propellerCount } = shipMachineInfo.value
          for (let i = 1; i < mainEngineCount + 1; i++) {
            engines.push('ME' + i)
          }

          for (let i = 1; i < generatorEngineCount + 1; i++) {
            engines.push('GE' + i)
          }
          for (let i = 1; i <= propellerCount; i++) {
            propellers.push('PROPELLER' + i)
          }

          shipEngines.value = engines
          shipPropellers.value = propellers

          fetchUsedFuels()
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchUsedFuels = () => {
      usedFuels.value = Object.keys(shipMachineInfo.value)
        .filter((key) => key.startsWith('use') && shipMachineInfo.value[key] == true)
        .map((key) => key.replace('use', '').toUpperCase())
    }

    const $reset = () => {
      checkedShips.value = []
    }

    return {
      ships,
      voccShips,
      currentShip,
      selectedShip,
      shipInfo,
      shipMachineInfo,
      usedFuels,
      shipPropellers,
      // usedFuels1,
      shipEngines1,
      shipEngines,
      checkedShips,
      curSelectedShip,
      addShip,
      editShipInfo,
      changeShipImage,
      fetchShipsByVocc,
      fetchShipsByFleetId,
      fetchShipsByVoccId,
      fetchShipInfo,
      fetchShipMachineInfo,
      removeShip,
      fetchUsedFuels
    }
  },
  {
    persist: true
  }
)

/**
 * 선사에 선박이 속하는지 확인
 * @param {*} fleets
 * @param {*} ship
 * @returns
 */
const isIncludedShip = (fleets, ship) => {
  for (let fleet of fleets) {
    if (fleet['imoNumberList'] === null) return

    if (fleet['imoNumberList'].includes(ship.imoNumber)) {
      return { fleetId: fleet['id'], fleetName: fleet['name'] }
    }
  }
}
