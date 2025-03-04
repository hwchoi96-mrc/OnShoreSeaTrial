import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getShipOperationInfo, updateFuelInfo, updateImoDcsInfo } from '@/api/operationApi.js'
import { useToast } from '@/composables/useToast'

import _ from 'lodash'

export const useOperationStore = defineStore('operationManagement', () => {
  const { showResMsg } = useToast()

  const fuelInfo = ref({
    residualMgo: 10, // MGO 잔여연료
    perMgoDistance: 0, // 기준 연료당 거리(MGO)
    estimatedDistanceByMgo: 0, // MGO 운항가능 추정 거리
    residualLng: 10, // LNG 잔여연료
    perLngDistance: 0, // 기준 연료당 거리(LNG)
    estimatedDistanceByLng: 0, // LNG 운항가능 추정거리
    chargeableMgo: 10, // 충전 가능한 연료 (MGO)
    perchargeableMgo: 0, // 기준 연료당 거리(원),
    chargeableCostMgo: 0, // 기준 단위당 충전 가능 연료 비용(MCO)
    chargeableLng: 10, // 충전 가능한 연료 (MGO)
    perchargeableLng: 0, // 기준 연료당 거리(원),
    chargeableCostLng: 0 // 기준 단위당 충전 가능 연료 비용(MCO)
  })

  const ciiInfo = ref({
    requiredCII: 0,
    targetGrade: 'A'
  })

  const fetchShipOperationInfo = async (imoNumber) => {
    try {
      await getShipOperationInfo(imoNumber).then((response) => {
        // detailDataMap에서 위의 FuelInfo 속성 값이 있는지 체크
        console.dir(response)
        const result = response.detailDataMap

        console.dir(result)
        /* _.pick : fuelInfo의 속성만 추출하는 함수
         * shipDetailInfo에는 연료정보뿐만 아니라 다른 정보도 포함되어있기 때문에
         * 해당 함수 사용
         */
        const fuleInformation = _.pick(result, Object.keys(fuelInfo.value))
        if (!_.isEmpty(fuleInformation)) {
          ciiInfo.value = fuleInformation
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const editFuelInfo = async (data) => {
    const editInfo = data
    try {
      const result = await updateFuelInfo(data).then((response) => {
        const { detailDataMap } = editInfo
        fuelInfo.value = { ...detailDataMap }
        showResMsg('해당 정보가 수정되었습니다')
      })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCiiInfo = async (imoNumber) => {
    try {
      const {
        data: { detailDataMap }
      } = await getShipOperationInfo(imoNumber)
      const result = detailDataMap
      // detailDataMap에서 위의 imoInfo 속성 값이 있는지 체크
      const imoInformation = _.pick(result, Object.keys(imoInfo.value))

      if (!_.isEmpty(imoInformation)) {
        ciiInfo.value = imoInformation
      }
      // ({ data: fuelInfo.value } = response
    } catch (error) {
      console.log(error)
    }
  }

  const editImoDcsInfo = async (data) => {
    const editInfo = data
    try {
      const result = await updateImoDcsInfo(data).then((response) => {
        const { detailDataMap } = editInfo
        ciiInfo.value = { ...detailDataMap }
        showResMsg('해당 정보가 수정되었습니다')
      })
    } catch (error) {
      console.log(error)
    }
  }

  return {
    fuelInfo,
    ciiInfo,
    fetchShipOperationInfo,
    editFuelInfo,
    fetchCiiInfo,
    editImoDcsInfo
  }
})
