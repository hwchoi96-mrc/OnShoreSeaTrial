<template>
  <v-sheet class="detail-page tabs-inner-content-container">
      <!-- 엔진, 경보 / 주의, 차트 관련 필터 -->
      <v-sheet class="rounded-lg px-3 py-3 mt-3" color="#333334">
        <div class="d-flex justify-space-between align-center filter-area ga-2">
          <div class="d-flex ga-2">
            <i-selectbox
              v-model="selectedEngine"
              :items="shipEngineList"
              variant="solo-filled"
              density="compact"
              class="equipment-selector"
              bg-color="#434348"
              :hide-details="true"
              placeholder="Select"
              :persistent-placeholder="true"
              @update:modelValue="filterStatusByClick"
            ></i-selectbox>

            <i-selectbox
              v-model="selectedStatus"
              :items="statuses"
              variant="solo-filled"
              density="compact"
              class="status-setting"
              bg-color="#434348"
              placeholder="Status"
              :hide-details="true"
              @update:modelValue="filterStatusByClick"
            ></i-selectbox>
          </div>

          <div class="d-flex ga-2">
            <v-sheet class="rounded-lg py-2 px-4 mr-2" color="#212121">
              <div class="d-flex ga-12 justify-end align-center">
                <div class="alarm-count-container d-flex align-center">
                  <div class="alarm-type caution mr-2">●</div>
                  <div>CAUTION</div>
                  <div class="caution alarm-count ml-2">{{ cautionCount }}</div>
                </div>
                <div class="alarm-count-container d-flex align-center">
                  <div class="alarm-type danger mr-2">●</div>
                  <div>WARNING</div>
                  <div class="alarm-count danger ml-2">{{ warningCount }}</div>
                </div>
              </div>
            </v-sheet>
            <div class="d-flex align-center">
              <span class="mr-2">Alert Duration Setting</span>
              <i-selectbox
                v-model="duration"
                :items="durations"
                item-title="name"
                item-value="miniute"
                return-object
                class="duration-setting"
                bg-color="#434348"
                variant="solo-filled"
                density="compact"
                :hide-details="true"
                @update:modelValue="filterStatusByClick"
              ></i-selectbox>
            </div>

            <div class="d-flex align-center">
              <span class="mr-2">Chart Interval</span>
              <i-selectbox
                v-model="chartInterval"
                :items="chartIntervals"
                item-title="name"
                item-value="minute"
                return-object
                class="chart-interval"
                variant="solo-filled"
                density="compact"
                bg-color="#434348"
                :hide-details="true"
                @update:modelValue="filterStatusByClick"
              ></i-selectbox>
            </div>
            <v-btn icon="mdi-fullscreen" v-if="displayByRole" @click="openAlterListPopup"></v-btn>
          </div>
        </div>
      </v-sheet>
      <!-- 경보 / 주의 수 출력 -->
      <v-sheet class="mt-3 pa-3 rounded-lg tabs-exclude-filter-container" color="#333334">
        <DxDataGrid
          id="realAlertGrid"
          ref="realAlertGrid"
          class="h-100"
          style="max-height: 100%"
          :column-auto-width="false"
          key-expr="id"
          @row-click="clickAlert"
          :data-source="alarmData"
          :show-borders="true"
        >
          <DxSelection mode="single"></DxSelection>
          <DxScrolling mode="virtual" />
          <DxColumn
            data-field="raisedTime"
            caption="RaisedTime"
            alignment="center"
            :allow-editing="false"
            cell-template="raisedTime-template"
          ></DxColumn>

          <template #raisedTime-template="{ data: templateOptions }">
            <div class="d-flex">
              <div class="ml-2">{{ convertDateTimeType(templateOptions.data.raisedTime) }}</div>
            </div>
          </template>
          <DxColumn
            data-field="status"
            caption="Status"
            alignment="center"
            cell-template="alarm-type-template"
            :allow-editing="false"
          />
          <DxColumn
            data-field="id"
            caption="No"
            alignment="center"
            :visible="false"
            :allow-editing="false"
          ></DxColumn>
          <DxColumn
            data-field="alarmStateType"
            caption="alarmStateType"
            :visible="false">
          </DxColumn>
          <DxColumn
            data-field="description"
            caption="Description"
            width="20%"
            :allow-editing="false"
          >
          </DxColumn>
          <DxColumn
            data-field="equipNo"
            caption="Equip No"
            alignment="center"
            :allow-editing="false"
          ></DxColumn>
          <DxColumn
            data-field="tagId"
            caption="Tag ID"
            alignment="center"
            :allow-editing="false"
          ></DxColumn>
          <DxColumn
            data-field="caution"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="false"
          >
          </DxColumn>
          <DxColumn
            data-field="warning"
            caption="Warning"
            alignment="center"
            :allow-editing="false"
          ></DxColumn>
          <DxColumn
            data-field="value"
            caption="value"
            alignment="center"
            :allow-editing="false"
          ></DxColumn>

          <template #alarm-type-template="{ data: templateOptions }">
            <div class="d-flex">
              <div class="" :class="getColorByAlertType(templateOptions.data.status)">●</div>
              <div class="ml-2">{{ templateOptions.data.status }}</div>
            </div>
          </template>

          <DxMasterDetail :enabled="false" template="detailTemplate"></DxMasterDetail>

          <template #detailTemplate="{ data: alertDetail }">
            <AlertMonitoringDetail
              :template-data="alertDetail"
              :imoNumber="curSelectedShip.imoNumber"
              :chartInterval="chartInterval"
            />
          </template>
        </DxDataGrid>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { getCurrentAlarmData } from '@/api/alarmApi.js'
import { useToast } from '@/composables/useToast'
import { convertDateTimeType, isStatusOk, displayOnlySuperAdmin } from '@/composables/util'

import AlertMonitoringDetail from '@/views/alert/AlertMonitoringDetail.vue'
const shipStore = useShipStore()
const loadingStore = useLoadingStore()
const { showResMsg } = useToast()
const { refreshDataTime } = storeToRefs(loadingStore)
const { shipEngines, curSelectedShip} = storeToRefs(shipStore)


const realAlertGrid = ref(null)
const realAlertInstance = ref(null)

let selectedFix = {equipNo : 'Engine' , status :'Status', duration : 'No duration', chartInterval : '1 min'}
//알람 모니터링 데이터
const alarmData = ref([])
const displayByRole = computed(() => {
  const result = displayOnlySuperAdmin()
  return result
})

//필터 옵션
const selectedEngine = ref()
const selectedStatus = ref()
const statuses = ref(['Status', 'Caution', 'Warning'])
const duration = ref()
const durations = ref([{name: 'No duration',minute: 1},{name: '10 min',minute: 10},{name: '30 min',minute: 30},{name: '1 hour',minute: 60},{name: '3 hour',minute: 180}])
const chartInterval = ref()
const chartIntervals = ref([{name: '1 min',minute: 1},{name: '3 min',minute: 3},{name: '5 min',minute: 5},{name: '10 min',minute: 10},{name: '30 min',minute: 30},{name: '1 hour',minute: 60}])

//엔진 설렉트박스 만들기
const addOption = (data, optionName) => {
  if (!data.includes(optionName)) {
    data.unshift(optionName)
  }

  return data
}
const shipEngineList = computed(() => {
  addOption(shipEngines.value, 'Engine')
  return shipEngines.value
})

const cautionCount = ref()
const warningCount = ref()
const fetchAlertMonitoring = async () => {
  if(curSelectedShip.value.imoNumber) {
  const imoNumber = curSelectedShip.value.imoNumber
  //엔진 설렉트박스에 All 조건 추가
  if (shipEngines.value) {
    let ShipEngineList = [...shipEngines.value]
    await addOption(ShipEngineList, 'Engine')
    shipEngines.value = ShipEngineList
    //설렉트박스 초기화
    selectedEngine.value = shipEngines.value[0]
  }

  //설렉트박스 초기화
  selectedStatus.value = statuses.value[0]
  duration.value = durations.value[0]
  chartInterval.value = chartIntervals.value[0]
  if (imoNumber) {
    let requestForm = {
      imoNumber: imoNumber,
      alertDurationMinute:duration.value.minute
    }
    const {
      status,
      data: { data }
    } = await getCurrentAlarmData(requestForm)

    if (isStatusOk(status)) {
      alarmData.value = data.filter((alert) => shipEngines.value.includes(alert.equipNo))
      warningCount.value = alarmData.value.filter((alarm) => alarm.status == 'Warning').length
      cautionCount.value = alarmData.value.filter((alarm) => alarm.status == 'Caution').length
    }
  }
  }else{
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
  }
  realAlertInstance.value = realAlertGrid.value.instance
}


const clickAlert = (e) => {
  const isExpanded = e.component.isRowExpanded(e.key)

  if (e.rowType == 'detail') return

  if (isExpanded) {
    e.component.collapseRow(e.key)
  } else {
    e.component.collapseAll(-1)
    e.component.expandRow(e.key)
  }
}
const filterStatusByClick = () => {
  selectedFix = {
    equipNo: selectedEngine.value,
    status: selectedStatus.value,
    duration: duration.value.name,
    chartInterval : chartInterval.value.name

  }
}

const filterStatusByFetch = () => {
  const obj = {
    equipNo: selectedFix.equipNo,
    status: selectedFix.status
  }

  const filters = Object.keys(obj)
    .filter((el) => obj[el] !== 'Engine' && obj[el] !== '')
    .filter((el) => obj[el] !== 'Status' && obj[el] !== '')
    .map((sub) => [sub, '=', obj[sub]])

  if (filters.length != 0) {
    realAlertInstance.value.filter(filters)
  } else if (filters.length == 0) {
    realAlertInstance.value.clearFilter()
  }
  selectedEngine.value = shipEngineList.value.find(deck => deck === selectedFix.equipNo)
  selectedStatus.value = statuses.value.find(deck => deck === selectedFix.status)
  duration.value = durations.value.find(deck => deck.name === selectedFix.duration)
  chartInterval.value = chartIntervals.value.find(deck => deck.name === selectedFix.chartInterval)

  setTimeout(() => {
    let data = realAlertInstance.value.getVisibleRows()
    warningCount.value = data.filter((el) => el.data.status == 'Warning').length
    cautionCount.value = data.filter((el) => el.data.status == 'Caution').length
  }, 100)
}
const getColorByAlertType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'Caution':
      alarmColor = 'caution'
      break
    case 'Warning':
      alarmColor = 'warning'
      break
  }

  return alarmColor
}
const reloadData = async () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let result = dateTime.isBefore(refreshDataTime.value)
  await fetchAlertMonitoring()
  filterStatusByFetch()
}
watch(curSelectedShip, fetchAlertMonitoring)
//watch(duration, fetchAlertMonitoring)
watch(selectedStatus, filterStatusByFetch)
watch(selectedEngine, filterStatusByFetch)
watch(refreshDataTime, reloadData)
const openAlterListPopup = () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber

  if (!curSelectedImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  var popup = window.open(
    `/popup/alert?imoNumber=${curSelectedImoNumber}`,
    '_blank',
    'menubar=no, toolbar=no, width=300, height=400, scrollbars=0, location=no, width=500, height=300'
  )
}
onMounted(() => {
  fetchAlertMonitoring()
  realAlertInstance.value = realAlertGrid.value.instance
})

</script>

<style scoped>
.normal {
  color: #42d2a7;
  border-color: #42d2a7;
}

.alarm-type {
  font-size: 0.8rem;
}

.alarm-container {
  font-size: 0.9rem;
}

.alarm-count {
  font-size: 1.2rem;
}

#dx-col-5 {
  text-align: center !important;
}

.equipment-selector {
  width: 50%;
}
</style>
