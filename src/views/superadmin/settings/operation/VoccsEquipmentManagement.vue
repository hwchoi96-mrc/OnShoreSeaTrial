<template>
  <v-container
    fluid
    class="detail-page pa-0 tab-content-container"
    style="height: calc(100vh - 65px - 24px - 62px - 44px)"
  >
    <v-row no-gutters class="h-100 settings">
      <v-col cols="12" class="h-100">
        <v-card class="operation-info rounded-lg h-100">
          <v-card-title class="h-auto py-6">
            <div class="d-flex justify-space-between align-center">
              <div class="align-self-center" style="line-height: 1">선박 제원 관리</div>
            </div>
          </v-card-title>
          <v-card-text class="py-0">
            <v-sheet class="tab-card operation-equipment-area" v-if="curImoNumber">
              <v-sheet class="">
                <div class="title mb-1">M/E</div>
                <div class="operation-container d-flex flex-wrap ga-2">
                  <div class="operation-info-item">
                    <div class="mb-1">M/E Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineCount"
                      placeholder="메인엔진 개수를 입력하여 주십시오"
                      @input="validateInput('mainEngineCount')"
                    >
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Max Power</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineMaxPower"
                      placeholder="메인엔진의 최대 파워를 입력하여 주십시오"
                      @input="validateInput('mainEngineMaxPower')"
                    >
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">T/C Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineTurboChargerCount"
                      placeholder="발전기의 T/C 개수를 입력하여 주십시오"
                      @input="validateInput('mainEngineTurboChargerCount')"
                    >
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Max Speed</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineMaxSpeed"
                      placeholder="메인엔진의 최대 파워를 입력하여 주십시오"
                      @input="validateInput('mainEngineMaxSpeed')"
                    >
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Cylinder Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineCylinderCount"
                      placeholder="메인엔진의 Cyl 개수를 입력하여 주십시오"
                      @input="validateInput('mainEngineCylinderCount')"
                    >
                    </i-input>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="title mb-1">G/E</div>
                <div class="operation-container d-flex flex-wrap ga-2">
                  <div class="operation-info-item">
                    <div class="mb-1">G/E Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineCount"
                      placeholder="발전기 개수를 입력하여 주십시오"
                      @input="validateInput('generatorEngineCount')"
                    >
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">Max Power</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineMaxPower"
                      placeholder="발전기의 최대 파워(생산량)을 입력하여 주십시오"
                      @input="validateInput('generatorEngineMaxPower')"
                    >
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">T/C Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineTurboChargerCount"
                      placeholder="발전기의 T/C 개수를 입력하여 주십시오"
                      @input="validateInput('generatorEngineTurboChargerCount')"
                    >
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">Max Speed</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineMaxSpeed"
                      placeholder="발전기의 최대 파워(생산량)을 입력하여 주십시오"
                      @input="validateInput('generatorEngineMaxSpeed')"
                    >
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Cylinder Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineCylinderCount"
                      placeholder="발전기의 Cyl 개수를 입력하여 주십시오"
                      @input="validateInput('generatorEngineCylinderCount')"
                    >
                    </i-input>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="mt-4 d-flex ga-2">
                <div class="operation-info-item">
                  <div class="title mb-2">Propeller</div>
                  <div class="">
                    <div>
                      <div class="mb-1">Propeller Count</div>
                      <i-input
                        type="number"
                        v-model="equipmentInfo.propellerCount"
                        placeholder="프로펠러의 개수를 입력하여 주십시오"
                        @input="validateInput('propellerCount')"
                      >
                      </i-input>
                    </div>
                  </div>
                </div>
                <div class="operation-info-item">
                  <div class="title mb-2">Fuel</div>
                  <div class="operation-container d-flex flex-wrap">
                    <div class="operation-info-item">
                      <div class="mb-1">Used Fuel Type</div>
                      <v-select
                        v-model="selectedFules"
                        :items="fules"
                        item-title="text"
                        item-value="value"
                        multiple
                        density="compact"
                        bg-color="#434348"
                        hide-details
                        variant="solo-filled"
                        class="fuels-select"
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="index < 4">
                            <span>{{ item.title }}</span>
                          </v-chip>
                          <span
                            v-if="index == 4"
                            class="text-caption align-self-center"
                            style="color: #fff"
                          >
                            (+{{ selectedFules.length - 4 }})
                          </span>
                        </template>
                      </v-select>
                    </div>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="d-flex justify-end mt-4">
                <i-btn
                  @click="updateShipDetailInfo"
                  class="d-flex align-self-center mb-2"
                  text="수정"
                ></i-btn>
              </v-sheet>
              <!-- <div class="d-flex align-self-end"></div> -->
            </v-sheet>
            <v-sheet v-else class="d-flex justify-center h-100">
              <div class="no-select-ship h-100 d-flex align-center">
                선택한 선박이 없습니다
              </div></v-sheet
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getShipMachineInfo, updateShipMachineInfo } from '@/api/shipApi'

import { useShipStore } from '@/stores/shipStore'
import { useToast } from '@/composables/useToast'

const { showResMsg } = useToast()

const shipStore = useShipStore()

const props = defineProps({
  selectedShipImoNumber: {
    type: [String]
  }
})

const fules = [
  { text: 'HFO', value: 'HFO' },
  { text: 'LFO', value: 'LFO' },
  { text: 'MDO', value: 'MDO' },
  { text: 'MGO', value: 'MGO' },
  { text: 'LPG(P)', value: 'LPGP' },
  { text: 'LPG(B)', value: 'LPGB' },
  { text: 'METHANOL', value: 'METHANOL' },
  { text: 'ETHANOL', value: 'ETHANOL' },
  { text: 'LNG', value: 'LNG' }
]
const selectedFules = ref([])

const equipmentInfo = ref({})

// onMounted(() => {
//   fetchShipMachineInfo()
// })

const curImoNumber = ref()

const fetchShipMachineInfo = async () => {
  console.log('제원정보 조회')
  curImoNumber.value = props.selectedShipImoNumber

  console.dir(curImoNumber.value)

  let imoNumber = curImoNumber.value

  if (imoNumber) {
    const {
      data: { data }
    } = await getShipMachineInfo(imoNumber)
    equipmentInfo.value = data
    selectedFules.value = Object.keys(data)
      .filter((key) => key.startsWith('use') && data[key] == true)
      .map((key) => key.replace('use', '').toUpperCase())
  }
}

const updateShipDetailInfo = async () => {
  let editInfo
  let imoNumber = props.selectedShipImoNumber

  const selectedFuelInfo = {
    useHfo: selectedFules.value.includes('HFO'),
    useLfo: selectedFules.value.includes('LFO'),
    useMdo: selectedFules.value.includes('MDO'),
    useMgo: selectedFules.value.includes('MGO'),
    useLpgP: selectedFules.value.includes('LPGP'),
    useLpgB: selectedFules.value.includes('LPGB'),
    useMethanol: selectedFules.value.includes('METHANOL'),
    useEthanol: selectedFules.value.includes('ETHANOL'),
    useLng: selectedFules.value.includes('LNG')
  }

  editInfo = { ...equipmentInfo.value, ...selectedFuelInfo }

  const response = await updateShipMachineInfo(editInfo)
  if (response.status == 200) {
    equipmentInfo.value = editInfo
    shipStore.fetchShipMachineInfo(imoNumber)
    showResMsg('선박 제원 정보가 수정되었습니다')
  }
}

// 24.07.05 [이채원 사원]
const maxValues = {
  mainEngineCount: 4,
  mainEngineTurboChargerCount: 2,
  mainEngineCylinderCount: 12,
  generatorEngineCount: 4,
  generatorEngineTurboChargerCount: 2,
  generatorEngineCylinderCount: 12,
  propellerCount: 5
}

// 24.07.05 [이채원 사원] 수정 부분
const minValues = {
  mainEngineCount: 0,
  mainEngineTurboChargerCount: 0,
  mainEngineCylinderCount: 0,
  generatorEngineCount: 0,
  generatorEngineTurboChargerCount: 0,
  generatorEngineCylinderCount: 0,
  propellerCount: 0,
  mainEngineMaxPower: 0,
  mainEngineMaxSpeed: 0,
  generatorEngineMaxPower: 0,
  generatorEngineMaxSpeed: 0
}

// 24.07.05 [이채원 사원]
const validateInput = (key) => {
  if (equipmentInfo.value[key] > maxValues[key]) {
    showResMsg(`${key}의 최대값은 ${maxValues[key]}입니다.`)
    setTimeout(() => {
      equipmentInfo.value[key] = maxValues[key]
    }, 0)
  }
  if (equipmentInfo.value[key] < minValues[key]) {
    showResMsg(`${key}의 최소값은 ${minValues[key]}입니다.`)
    setTimeout(() => {
      equipmentInfo.value[key] = minValues[key]
    }, 0)
  }
}

// 24.07.05 [이채원 사원]
watch(
  equipmentInfo.value,
  (newValue) => {
    Object.keys(maxValues).forEach((key) => {
      if (newValue[key] > maxValues[key]) {
        validateInput(key)
      }
      if (newValue[key] < minValues[key]) {
        validateInput(key)
      }
    })
  },
  { deep: true }
)

watch(() => props.selectedShipImoNumber, fetchShipMachineInfo)

// watch(
//   () => props.selectedShipImoNumber,
//   (newVal, oldVal) => {
//     if (newVal !== oldVal) {
//       fetchShipMachineInfo()
//     }
//   },
//   { immediate: true }
// )
</script>

<style lang="scss" scoped>
.v-field .v-chip {
  height: calc(var(--v-chip-height) + 0px);
  background: #5789fe;
}

.operation-info {
  .v-card-text {
    height: 100%;
    max-height: calc(100% - 68px);
  }
}

.operation-info-item {
  flex: 1 1 40%;
}

.operation-info-item.cylinder {
  flex: 0 0 49%;
}
/*
* 선박 제원 관리
*/
.fuels-select {
  .v-field__input {
    flex-wrap: nowrap;
  }
}

.no-select-ship {
  font-size: 1.2rem;
}
</style>
