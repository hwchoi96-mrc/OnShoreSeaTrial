<template>
  <v-card class="sensor-register-area">
    <v-card-title>
      <div>센서 정보 수정</div>
    </v-card-title>
    <v-card-text class="">
      <v-form @submit.prevent="" class="w-100">
        <div class="tab-container">
          <div class="sensor-container ga-2">
            <div class="sensor-item">
              <div class="mb-1">Deck</div>
              <i-input
                v-model="sensorEditForm.deck"
                :items="sensorData.decks"
                item-title="deckName"
                item-value="id"
                density="compact"
                bg-color="#434348"
                variant="solo-filled"
                placeholder="Deck를 선택하여 주십시오"
                no-data-text="데이터가 없습니다"
                hide-details
              />
            </div>
            <div class="sensor-item mt-4">
              <div class="mb-1">Installation Location</div>
              <i-input
                label=""
                type="text"
                v-model="sensorEditForm.installationLocation"
                placeholder="nstallation Location를 입력하여 주십시오"
                :hide-details="true"
              >
              </i-input>
            </div>
            <div class="sensor-item mt-4">
              <div class="mb-1">Sensor Type</div>
              <i-selectbox
                v-model="sensorEditForm.sensorType"
                :items="sensorTypes"
                item-title="title"
                item-value="value"
                variant="solo-filled"
                density="compact"
                bg-color="#434348"
                placeholder="SensorType을 선택해주세요"
                :hide-details="true"
              ></i-selectbox>
            </div>
            <div class="sensor-item mt-4">
              <div class="mb-1">Tag ID</div>
              <i-input
                label="Tag ID"
                type="text"
                v-model="sensorEditForm.tagId"
                placeholder="Tag ID를 입력하여 주십시오"
                :hide-details="true"
                disabled
              >
              </i-input>
            </div>
            <div class="sensor-item mt-4">
              <div class="mb-1">Sensor No</div>
              <i-input
                label="TYPE"
                type="text"
                v-model="sensorEditForm.sensorNumber"
                placeholder="Sensor No를 입력하여 주십시오"
                :hide-details="true"
                readonly
              >
              </i-input>
            </div>

            <div class="sensor-item d-flex ga-2 mt-4">
              <div class="flex-grow-1">
                <div class="mb-1">X</div>
                <i-input
                  label="TYPE"
                  type="number"
                  v-model="sensorEditForm.posX"
                  placeholder="x를 입력하여 주십시오"
                  :hide-details="true"
                  @input="validateInputX(sensorEditForm.posX)"
                >
                </i-input>
              </div>

              <div class="flex-grow-1">
                <div class="mb-1">Y</div>
                <i-input
                  label="TYPE"
                  type="number"
                  v-model="sensorEditForm.posY"
                  placeholder="y를 입력하여 주십시오"
                  :hide-details="true"
                  @input="validateInputY(sensorEditForm.posY)"
                >
                </i-input>
              </div>
            </div>
          </div>

          <div class="sensor-item"></div>
          <div class="button-container d-flex ga-4 mt-4">
            <i-btn @click="resetComponent" color="#5E616A" width="48%" text="취소"></i-btn>
            <i-btn type="submit" width="48%" text="수정" @click="editFDSSensor"></i-btn>
          </div>
        </div>
      </v-form> </v-card-text
  ></v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useToast } from '@/composables/useToast'

import { getFDSSensorInfo, updateFDSSensor } from '@/api/fdsApi'
import { isStatusOk } from '@/composables/util'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)
const { showResMsg } = useToast()

import sensorData from '@/assets/mockup/fdsMonitoring.json'
import _ from 'lodash'

const validateInputX = (posX) => {
  if (posX > 99) {
    showResMsg(`최대값은 99입니다.`)
    setTimeout(() => {
      sensorEditForm.value.posX = 99
    }, 0)
  }

  if (posX < 0) {
    showResMsg(`최소값은 0입니다.`)
    setTimeout(() => {
      sensorEditForm.value.posX = 0
    }, 0)
  }
}

const validateInputY = (posY) => {
  if (posY > 96) {
    showResMsg(`최대값은 96입니다.`)
    setTimeout(() => {
      sensorEditForm.value.posY = 96
    }, 0)
  }

  if (posY < 0) {
    showResMsg(`최소값은 0입니다.`)
    setTimeout(() => {
      sensorEditForm.value.posY = 0
    }, 0)
  }
}

const props = defineProps({
  deckName: {
    type: String
  },
  sensorNo: {
    type: [String, Number]
  },
  selectedTagId: {
    type: String
  }
})

const emits = defineEmits(['resetComponent', 'updatePos'])
let selectedShipImoNumber = null
onMounted(() => {
  fetchSensorInfo()
})

const sensorTypes = [
  {
    id: 1,
    title: '열 감지기',
    value: 'HEAT'
  },
  {
    id: 2,
    title: '연기 감지기',
    value: 'SMOKE'
  }
]

const sensorEditForm = ref({
  deck: '',
  installationLocation: '',
  sensorType: '',
  tagId: '',
  sensorNumber: 0,
  posX: 0,
  posY: 0
})

const fetchSensorInfo = async () => {
  selectedShipImoNumber = curSelectedShip.value.imoNumber
  sensorEditForm.value.deck = props.deckName

  console.log('태그 아이디' + props.selectedTagId)

  let requestForm = {
    imoNumber: selectedShipImoNumber,
    tagId: props.selectedTagId
  }
  const {
    data: { data }
  } = await getFDSSensorInfo(requestForm)

  sensorEditForm.value.deck = data.deck
  sensorEditForm.value.installationLocation = data.installationLocation
  sensorEditForm.value.sensorNumber = props.sensorNo
  sensorEditForm.value.tagId = props.selectedTagId
  sensorEditForm.value.sensorType = data.sensorType
  sensorEditForm.value.posX = data.posX
  sensorEditForm.value.posY = data.posY
}

const editFDSSensor = async () => {
  let requestForm = _.cloneDeep(sensorEditForm.value)
  requestForm.imoNumber = selectedShipImoNumber
  delete requestForm.sensorNo
  const { status } = await updateFDSSensor(requestForm)

  console.log('editFDSSensor' + status)
  if (isStatusOk(status)) {
    console.log('정보 변경 성공')
    showResMsg('선택한 센서의 정보가 수정되었습니다')
    emits('resetComponent')
  }
}

const resetComponent = () => {
  emits('resetComponent')
}

watch(
  sensorEditForm,
  () => {
    let posX = sensorEditForm.value.posX
    let posY = sensorEditForm.value.posY
    emits('updatePos', { type: 'edit', posX, posY })
  },
  { deep: true }
)

watch(() => props.selectedTagId, fetchSensorInfo)
</script>

<style scoped>
.title {
  font-size: 1.2em;
  margin-bottom: 16px;
}
</style>
