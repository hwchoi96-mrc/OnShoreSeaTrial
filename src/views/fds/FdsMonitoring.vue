<template>
  <v-sheet class="py-3 rounded-lg detail-page tabs-inner-content-container">
    <v-sheet class="px-3 py-3 mb-3 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex ga-2 w-25">
          <v-autocomplete
            v-model="selectedDeck"
            :items="decks"
            item-title="deckName"
            item-value="deckName"
            variant="solo-filled"
            density="compact"
            class="equipmentSelector"
            bg-color="#434348"
            :hide-details="true"
            placeholder="Deck를 선택해주세요"
            return-object
            no-data-text="데이터가 없습니다"
            @update:modelValue="() => { filterImageByFetch(); filterFdsByClick(); }"
          ></v-autocomplete>

          <i-selectbox
            v-model="selectedSensorType"
            :items="sensorTypes"
            item-title="title"
            item-value="value"
            variant="solo-filled"
            density="compact"
            class="equipmentSelector"
            bg-color="#434348"
            placeholder="SensorType을 선택해주세요"
            return-object
            @update:modelValue="filterFdsByClick"
            :hide-details="true"
          ></i-selectbox>

          <i-selectbox
            v-model="selectedAlarmStatus"
            :items="statuses"
            item-title="title"
            item-value="value"
            variant="solo-filled"
            density="compact"
            return-object
            @update:modelValue="filterFdsByClick"
            class="equipmentSelector"
            bg-color="#434348"
            placeholder="Status를 선택해주세요"
            :hide-details="true"
          ></i-selectbox>
        </div>
        <div class="d-flex justify-end" v-if="displayByRole">
          <v-btn icon="mdi-fullscreen" @click="openFDSPopup"></v-btn>
        </div>
      </div>
    </v-sheet>

    <!-- 선박 이미지 여부에 따른 숨김 처리 필요  -->
    <v-sheet
      v-if="isDeckImageUrl != null && isDeckImageUrl != ''"
      class="deck-image-container d-flex justify-center py-4"
      style="border: 1px solid #5f5f67; background: #000"
    >
      <v-sheet class="image-container w-50" v-if="isDeckImageUrl" style="position: relative">
        <v-img :src="isDeckImageUrl" class="deck-image w-100 h-100" />
        <div
          v-for="icon in icons"
          :key="icon.id"
          class="icon"
          :style="{ top: `${icon.posY}%`, left: `${icon.posX}%` }"
          :data-id="icon.id"
        >
          <div class="sensor-icon" :class="getIconColorByAlarmType(icon.status)" />
        </div>
      </v-sheet>
    </v-sheet>

    <div class="mt-3" style="height: calc(100% - 84px)">
      <DxDataGrid
        id="fdsMonitoringGrid"
        ref="fdsMonitoringGrid"
        key-expr="id"
        :data-source="sensorsStatusList"
        :class="isDeckImageUrl ? 'deck-image-container' : 'full-container'"
        :column-auto-width="true"
        :show-borders="true"
      >
        <DxSelection mode="single"></DxSelection>
        <DxScrolling mode="virtual" />

        <DxColumn data-field="id" :visible="false"></DxColumn>
        <DxColumn
          data-field="deck"
          caption="Deck"
          alignment="center"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="installationLocation"
          caption="Installation Location"
          alignment="center"
          :allow-editing="false"
        />
        <DxColumn
          data-field="sensorType"
          caption="Sensor Type"
          alignment="center"
          :allow-editing="false"
          width="10%"
        />

        <DxColumn
          data-field="status"
          caption="status"
          alignment="center"
          cell-template="alarm-type-template"
          width="10%"
          :allow-editing="false"
        >
        </DxColumn>

        <template #alarm-type-template="{ data: templateOptions }">
          <div class="d-flex justify-center">
            <div class="" :class="getColorByAlarmType(templateOptions.data.status)">●</div>
            <div class="ml-2">{{ getTextByAlarmType(templateOptions.data.status) }}</div>
          </div>
        </template>

        <DxColumn
          data-field="description"
          caption="Description"
          alignment="center"
          width="auto"
          :allow-editing="false"
          cell-template="description-template"
        />

        <template #description-template="{ data: templateOptions }">
          <div class="d-flex">
            <div class="ml-2">{{ getDescriptionByAlarmType(templateOptions.data.status) }}</div>
          </div>
        </template>
      </DxDataGrid>
    </div>
  </v-sheet>
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { getDeckList, getFDSMonitoring, getDeckImage } from '@/api/fdsApi'
import { useToast } from '@/composables/useToast'
import { isStatusOk, displayOnlySuperAdmin} from '@/composables/util'

const { showResMsg } = useToast()

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const loadingStore = useLoadingStore()
const { refreshDataTime } = storeToRefs(loadingStore)

let curSelectedShipImoNumber = null
let originData = []

const fdsMonitoringGrid = ref()
const fdsMonitoringInstance = ref()
const sensorsStatusList = ref([])

const isExistDeckImage = ref(false)
const isDeckImageUrl = ref()
const icons = ref([])

const selectedDeck = ref()
const selectedSensorType = ref()
const selectedAlarmStatus = ref()
const decks = ref([])

const sensorTypes = [
  { id: 1, title: 'All', value: 'All' },
  { id: 2, title: '열 감지기', value: 'HEAT' },
  { id: 3, title: '연기 감지기', value: 'SMOKE' }
]
const statuses = [
  { id: 1, title: 'All', value: 'All' },
  { id: 2, title: '정상', value: 'NORMAL' },
  { id: 3, title: '신호없음', value: 'NO SIGNAL' },
  { id: 4, title: '경보', value: 'WARNING' }
]

let selectedFix = {deck : 'All' , sensorType :'All', status : 'All'}


const fetchFds = async () => {
  let selectedDeckName = null
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  isDeckImageUrl.value = null
  //선박을 선택하지 않았다면 종료
  if (!curSelectedShipImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }

  //선박리스트에 { id: 0, deckName: All } 객체 추가
  await fetchDeckList(curSelectedShipImoNumber)
  if (decks.value.length <= 0) {
    return
  }
  //설렉트박스 선택 초기화
  selectedSensorType.value = sensorTypes[0]
  selectedAlarmStatus.value = statuses[0]
  selectedDeck.value = decks.value[0]

  if (selectedDeck.value.deckName != 'All') {//deckName 키가 All이 아니라면 사진 데이터를 받음
    selectedDeckName = selectedDeck.value.deckName
  } else {//deckName 키가 All이면 사진 데이터를 받지 않고 종료
    selectedDeckName = ''
  }
  const {
    status,
    data: { data }
  } = await getFDSMonitoring(curSelectedShipImoNumber, selectedDeckName)

  icons.value = data
  originData = JSON.parse(JSON.stringify(data))

  if (isStatusOk(status)) {
    if (selectedDeckName) {
      const response = await getDeckImage(curSelectedShipImoNumber, selectedDeckName)
      let {
        data: {
          data: { deckImage }
        }
      } = response

      if (deckImage) {
        let deckImageUrl = `data:image/png;base64,${deckImage}`

        isExistDeckImage.value = true
        isDeckImageUrl.value = deckImageUrl
      }
    }

    sensorsStatusList.value = data
  }
}


const fetchDeckList = async (imoNumber) => {
  ;({
    data: { data: decks.value }
  } = await getDeckList(imoNumber))
  if (decks.value.length == 0) {
    resetFds()
    return
  }

  let deckKey = 'deckName'
  let allOptionName = 'All'
  let existAllOption = null

  existAllOption = decks.value.some(
    (obj) => obj.hasOwnProperty(deckKey) && obj[deckKey] === allOptionName
  )
  if (!existAllOption) {
    let allOption = { id: 0, deckName: allOptionName }
    decks.value.unshift(allOption)
  }
}

const resetFds = () => {
  isDeckImageUrl.value = ''
  fetchDeckList.value = []
  selectedDeck.value = []
  decks.value = []
  icons.value = []
  sensorsStatusList.value = []
}

const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmColor = 'normal'
      break
    case 'NO SIGNAL':
      alarmColor = 'caution'
      break

    case 'WARNING':
      alarmColor = 'warning'
      break
  }
  return alarmColor
}

const getIconColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmColor = 'normal'
      break
    case 'NO SIGNAL':
      alarmColor = 'caution'
      break
    case 'Caution':
      alarmColor = 'caution'
      break
    case 'WARNING':
      alarmColor = 'warning'
      alarmColor += ' danger-animation'
      break
  }
  return alarmColor
}

const getTextByAlarmType = (alarmType) => {
  let alarmStatus = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmStatus = '정상'
      break
    case 'NO SIGNAL':
      alarmStatus = '신호없음'
      break
    case 'WARNING':
      alarmStatus = '경보'
      break
  }

  return alarmStatus
}

const getDescriptionByAlarmType = (alarmType) => {
  let alarmStatus = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmStatus = '센서가 정상 작동하고 있습니다.'
      break
    case 'NO SIGNAL':
      alarmStatus = '센서가작동하지않거나, 오류를 일으키는 상태입니다'
      break
    case 'WARNING':
      alarmStatus = '화재가 감지 되었습니다'
      break
  }

  return alarmStatus
}
const filterImageByFetch = async () => {

  if (!('deckName' in selectedDeck.value)) {//deckName 키가 없으면 종료
    return
  }
  let selectedDeckName = selectedDeck.value.deckName
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  if (selectedDeckName == 'All') {//deckName 키가 All이면 사진 데이터를 받지 않고 종료
    sensorsStatusList.value = originData
    isDeckImageUrl.value = null
    return
  }else{//deckName 키가 All이 아니라면 사진 데이터를 받음
    const {
      status,
      data: { data }
    } = await getFDSMonitoring(curSelectedShipImoNumber, selectedDeckName)

    icons.value = data

    if (isStatusOk(status)) {
      if (selectedDeckName) {
        const response = await getDeckImage(curSelectedShipImoNumber, selectedDeckName)
        let {
          data: {
            data: { deckImage }
          }
        } = response

        if (deckImage) {
          let deckImageUrl = `data:image/png;base64,${deckImage}`

          isExistDeckImage.value = true
          isDeckImageUrl.value = deckImageUrl
        } else {
          isDeckImageUrl.value = null
        }
      } else if (selectedDeckName == 'All') {
        isDeckImageUrl.value = null
      }

      sensorsStatusList.value = data
    }
  }
}

const filterFdsByClick = () => {
  //선박,센서,상태를 설렉트박스에서 선택하고
  selectedFix = {
    deck: selectedDeck.value.deckName,
    sensorType: selectedSensorType.value.value,
    status: selectedAlarmStatus.value.value
  }
  //필터링해서 테이블에 표출
  const filters = Object.keys(selectedFix)
    .filter((el) => selectedFix[el] !== 'All' && selectedFix[el] !== '')
    .map((sub) => [sub, '=', selectedFix[sub]])

  if (filters.length != 0) {
    fdsMonitoringInstance.value.filter(filters)
  } else if (filters.length == 0) {
    fdsMonitoringInstance.value.clearFilter()
  }
}
const filterFdsByFetch = () => {

  //선박,센서,상태를 설렉트박스에서 선택하고
  selectedFix = {
    deck: selectedFix.deck,
    sensorType: selectedFix.sensorType,
    status: selectedFix.status
  }

  //필터링해서 테이블에 표출
  const filters = Object.keys(selectedFix)
    .filter((el) => selectedFix[el] !== 'All' && selectedFix[el] !== '')
    .map((sub) => [sub, '=', selectedFix[sub]])

  if (filters.length != 0) {
    fdsMonitoringInstance.value.filter(filters)
  } else if (filters.length == 0) {
    fdsMonitoringInstance.value.clearFilter()
  }

  //설렉트박스에 선택한값 고정
  selectedDeck.value = decks.value.find(deck => deck.deckName === selectedFix.deck);
  selectedSensorType.value = sensorTypes.find(sensor => sensor.value === selectedFix.sensorType);
  selectedAlarmStatus.value = statuses.find(status => status.value === selectedFix.status);

}

const displayByRole = computed(() => {
  const result = displayOnlySuperAdmin()
  console.log(result)
  return result
})

const openFDSPopup = () => {
  let imoNumber = curSelectedShip.value.imoNumber
  var popup = window.open(
    `/popup/monitoring/fds?imoNumber=${imoNumber}`,
    '_blank',
    'menubar=no, toolbar=no, width=300, height=400, scrollbars=0, location=no, width=500, height=300'
  )
}

const reloadData = async () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let result = dateTime.isBefore(refreshDataTime.value)
  
  if (result) {
    await fetchFds(); //FDS 데이터 셋팅이 다 된 후 
    filterFdsByFetch();//FDS 데이터를 설렉트박스에서 선택한대로 필터링하고
    filterImageByFetch();//이미지를 가져온다.
  }
}
watch(curSelectedShip, fetchFds)
watch(refreshDataTime, reloadData)
onMounted(() => {
  fdsMonitoringInstance.value = fdsMonitoringGrid.value.instance
  fetchFds()
})
</script>

<style scoped>
.alarm-type {
  font-size: 1.2em;
}

.w-40 {
  width: 40%;
}

.deck-select-container {
  flex: 1 1 0;
}

.data-container {
  height: 100%;
}

.sensor-icon {
  font-size: 1.5em;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  width: 15px;
  height: 15px;
}
.sensor-icon.warning {
  background: linear-gradient(rgb(255, 0, 0), rgb(215, 45, 51));
}

.danger-animation {
  border-radius: 100%;
  overflow: hidden;
  animation: fadein 0.5s;
  animation: pulse 1.5s infinite;
}

.image-container {
  position: relative;
}
.icon {
  position: absolute;
  cursor: pointer;
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes pulse {
  from {
    box-shadow: 0 0 0 0px rgba(211, 47, 47);
  }

  to {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
}

.deck-image-container {
  height: 100vh;
  min-height: 300px;
  max-height: 300px;
}

.full-container {
  height: 100%;
  max-height: 100%;
}

.image-container > .icon {
  top: 0%;
  left: 0%;
}
.sensor-icon {
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  border-radius: 50%;

  width: 15px;
  height: 15px;
}

.sensor-icon.warning {
  background: #ff0000;
  border-color: #ff0000;
}

.sensor-icon.normal {
  background: #13d254;
  border-color: #13d254;
}

.sensor-icon.caution {
  background: #fff900;
  border-color: #fff900;
}

.tabs-inner-content-container {
  height: 100vh;
  max-height: calc(100vh - 65px - 12px - 60px - 12px - 62px - 12px);
}
</style>
