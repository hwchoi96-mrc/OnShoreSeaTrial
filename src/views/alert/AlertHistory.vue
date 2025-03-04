<template>
  <v-sheet class="detail-page tabs-inner-content-container">
    <!-- 날짜 필터 -->
    <v-sheet class="px-3 py-3 rounded-lg mt-3 w-100" color="#333334">
      <div class="d-flex justify-space-between align-center w-100">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <i-selectbox
            v-model="selectedEngine"
            :items="shipEngineList"
            item-title="name"
            item-value="id"
            variant="solo-filled"
            density="compact"
            return-object
            class="equipmentSelector w-15"
            bg-color="#434348"
            :hide-details="true"
          ></i-selectbox>

          <i-selectbox
            v-model="selectedStatus"
            :items="statuses"
            item-title="name"
            item-value="id"
            variant="solo-filled"
            density="compact"
            return-object
            class="equipmentSelector w-20"
            bg-color="#434348"
            :hide-details="true"
          ></i-selectbox>
          <input class="noticeList-datePicker" type="datetime-local" v-model="startDate" />
          <input
            class="noticeList-datePicker"
            type="datetime-local"
            v-model="endDate"
            :min="startDate"
          />

          <i-btn @click="fetchAlarmHistory" text="조회"></i-btn>
          <i-btn
            text="항차조회"
            @click="openVoyagesPopup()"
            :imoNumber="curSelectedShip.imoNumber"
            color="#3D3D40"
          ></i-btn>
        </div>

        <!-- <div class="d-flex ga-2">
          <div class="d-flex align-center">
            <span class="mr-6" style="font-size: 1rem">Chart Interval</span>
            <i-selectbox
              v-model="chartInterval[0]"
              :items="chartInterval"
              item-title="name"
              item-value="id"
              variant="solo-filled"
              density="compact"
              return-object
              class="equipmentSelector"
              bg-color="#434348"
              :hide-details="true"
            ></i-selectbox>
          </div>
        </div> -->
      </div>
    </v-sheet>
    <v-sheet class="mt-3 pa-3 rounded-lg tabs-exclude-filter-container" color="#333334">
      <DxDataGrid
        id="alarmHistoryGrid"
        ref="alarmHistoryGrid"
        key-expr="id"
        class="h-100"
        style="max-height: 100%"
        @selection-changed="clickAlarm"
        @row-click="expandRow"
        :column-auto-width="false"
        :data-source="alarmHistory"
        :show-borders="true"
      >
        <!-- @selection-changed="clickAlarm" -->
        <DxSelection mode="single"></DxSelection>
        <DxScrolling mode="virtual" />
        <DxColumn
          data-field="id"
          caption="No"
          alignment="center"
          :visible="false"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="raisedTime"
          caption="RalsedTime"
          alignment="center"
          :allow-editing="false"
          cell-template="raisedTime-template"
        />
        <template #raisedTime-template="{ data: templateOptions }">
          <div class="d-flex">
            <div class="ml-2">{{ convertDateTimeType(templateOptions.data.raisedTime) }}</div>
          </div>
        </template>
        <DxColumn
          data-field="status"
          caption="status"
          alignment="center"
          cell-template="alarm-type-template"
          :allow-editing="false"
        />

        <DxColumn data-field="alarmStateType" caption="alarmStateType" :visible="false"></DxColumn>
        <DxColumn data-field="description" caption="Description" width="20%" :allow-editing="false">
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
            <div class="" :class="getColorByAlarmType(templateOptions.data.status)">●</div>
            <div class="ml-2">{{ templateOptions.data.status }}</div>
          </div>
        </template>

        <DxMasterDetail :enabled="false" template="detailTemplate"></DxMasterDetail>

        <template #detailTemplate="{ data: alertHistory }">
          <AlertHistoryDetail
            :equipmentTags="equipmentTags"
            :checkedTags="checkedTags"
            :startDate="startDate"
            :endDate="endDate"
            :alarmDetailEngine="alarmDetailEngine"
            :tagIdDetail="tagIdDetail"
            :chartHistories="chartSeries"
            @click="handleAlertHistoryDetail"
            @filterEngine="filterAlarmDetailEngineType"
          />
        </template>
      </DxDataGrid>
    </v-sheet>
  </v-sheet>
  <VoyagesPopup
    ref="voyagePopup"
    v-model="isShowPopupModal"
    :imoNumber="curSelectedShip.imoNumber"
    :departureTime="startDate"
    :arrivalTime="endDate"
    @selectVoyage="updateDate"
    @close="closeVoyagesPopup"
  />
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { getAlarmHistory } from '@/api/alarmApi'
import { getEquimentTagList, getEquimentChartData } from '@/api/dataApi'
import { useToast } from '@/composables/useToast'
import { convertUTCTimezone, convertDateTimeType, isStatusOk } from '@/composables/util'

import AlertHistoryDetail from '@/views/alert/AlertHistoryDetail.vue'
import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'

import moment from 'moment'
import _ from 'lodash'

const shipStore = useShipStore()
const { curSelectedShip, shipEngines } = storeToRefs(shipStore)
const shipEngineList = ref()

const { showResMsg } = useToast()

let interval = null

/**
 * 그리드 관련
 */
const alarmHistoryGrid = ref(null)
const alarmHistoryInstance = ref(null)
const alarmHistory = ref([])

/**
 * 필터 관련
 */
const startDate = ref()
const endDate = ref()
const statuses = ref(['Status', 'Caution', 'Warning'])
const selectedEngine = ref()
const selectedStatus = ref()
const alarmDetailEngine = ref()
const tagIdDetail = ref()

//설렉트박스, 날짜조회값 셋팅
const init = async () => {
  const today = moment()
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  alarmHistoryInstance.value = alarmHistoryGrid.value.instance

  if (!curSelectedImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }

  if (shipEngines.value.length == 0) {
    await shipStore.fetchShipMachineInfo(curSelectedImoNumber)
  }


  shipEngineList.value = _.cloneDeep(shipEngines.value)

  selectedEngine.value = shipEngineList.value[0]
  selectedStatus.value = statuses.value[0]

  endDate.value = today.utc().format('YYYY-MM-DD hh:mm')
  startDate.value = today.utc().subtract(1, 'hours').format('YYYY-MM-DD hh:mm')

  fetchAlarmHistory()
}


//알람목록
const fetchAlarmHistory = async () => {
  let curShipImoNumber = curSelectedShip.value.imoNumber

  shipEngineList.value = _.cloneDeep(shipEngines.value)

  let alertStartDate = null
  let alertEndDate = null

  if (startDate.value != null) {
    alertStartDate = startDate.value
    alertStartDate = convertUTCTimezone(alertStartDate)
  }

  if (endDate.value != null) {
    alertEndDate = endDate.value
    alertEndDate = convertUTCTimezone(alertEndDate)
  }
  let requestForm = {
    imoNumber: curShipImoNumber,
    startTime: alertStartDate,
    endTime: alertEndDate
  }
  const {
    status,
    data: { data }
  } = await getAlarmHistory(requestForm)

  if (isStatusOk(status)) {
    alarmHistory.value = data.filter((alert) => shipEngines.value.includes(alert.equipNo))
    fetchEquimentList()
  }
}

//알람상세
/**
 * 차트 관련
 */
 const chartSeries = ref({
  title: {
    text: '',
    left: 'left',
    textStyle: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bolder'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    show: true,
    top: '0%',
    right: '2%',
    feature: {
      dataZoom: {
        show: true,
        title: {
          zoom: 'Zoom',
          back: 'Restore'
        },
        yAxisIndex: 'none',
        iconStyle: {
          borderColor: '#fff', // Default icon border color
          emphasis: {
            borderColor: '#5789FE' // Icon border color when activated
          }
        }
      }
    }
  },
  legend: {
    show: false,
    orient: 'vertical',
    data: null,
    right: 10
  },
  grid: {
    left: '5%',
    right: '8%',
    bottom: '10%',
    top: '12%'
    // containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    boundaryGap: [0, '30%']
  },
  series: [
    {
      type: 'line',
      data: [],
      symbolSize: 0,
      smooth: true
    }
  ]
})

let originEquipmentTags = []
const equipmentTags = ref()
const checkedTags = ref()

const fetchEquimentList = async (requestfomr) => {
  let engineName = selectedEngine.value
  const {
    data: { data }
  } = await getEquimentTagList(requestfomr)
  originEquipmentTags = data
  equipmentTags.value = data.filter((item) => item.equipNo == engineName)
}

//알람상세
const expandRow = (e) => {
  console.dir(e)
  if (e.rowType === 'data') {
    const isExpanded = e.component.isRowExpanded(e.key)
    let key = e.key
    if (isExpanded) {
      e.component.collapseRow(key)
    } else {
      e.component.collapseAll(-1)
      e.component.expandRow(key)
    }
  }

  if (e.rowType == 'detail') {
    e.preventDefault()
    return
  }
}

//알람상세
const clickAlarm = async (e) => {

  chartSeries.value.series = []

  let tagId = e.selectedRowsData[0].tagId
  let description = e.selectedRowsData[0].description
  alarmDetailEngine.value = e.selectedRowsData[0].equipNo
  tagIdDetail.value = tagId

  checkedTags.value = []

  let alertStartDate = ''
  let alertEndDate = ''

  if (startDate.value != null) {
    alertStartDate = startDate.value
    alertStartDate = convertUTCTimezone(alertStartDate)
  }

  if (endDate.value != null) {
    alertEndDate = endDate.value
    alertEndDate = convertUTCTimezone(alertEndDate)
  }

  let requestform = {
    imoNumber: curSelectedShip.value.imoNumber,
    fieldNameList: [tagId],
    startTime: alertStartDate,
    endTime: (alertEndDate = convertUTCTimezone(alertEndDate)),
    timeContains: true
  }

  let {
    status,
    data: { data }
  } = await getEquimentChartData(requestform)

  if ('Time' in data) {
    console.log('Time 있는지')
    let xAxisDatas = data['Time'].map((date) => convertDateTimeType(date))
    chartSeries.value.xAxis.data = xAxisDatas
  }

  let chartData = [{ 
    name: description, 
    data: data[tagId], 
    tagId: tagId, 
    type: 'line',
    lineStyle: {},
  }]
  nextTick(() => {
    chartSeries.value.series = chartData
  })
}

//알람상세목록
const handleAlertHistoryDetail = async (param) => {
  let imoNumber = curSelectedShip.value.imoNumber//선박번호
  checkedTags.value = param.tagIds//체크된 행

  let chartDatas = []
  let originAxis = _.cloneDeep(chartSeries.value.xAxis.data)
  let xAxisDatas = []
  let isTimeContains = false

  if (!imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }


  if (param.type == 'remove') {
    let deselctedKey = param.deselctedKeys//체크해제한 행

    chartDatas = chartSeries.value.series.filter((item) => {//현재차트에서 체크해제한 행은 없앤다.
      return !deselctedKey.includes(item.tagId)
    })

    let chartFirstData = chartSeries.value.series[0]
    let data = [
      chartFirstData,//현재차트의 첫번째행
      ...chartDatas.filter((el) => JSON.stringify(el) !== JSON.stringify(chartFirstData))//현재차트의 첫번째행을 필터링
    ]

    chartSeries.value.series = data//그걸 차트에 반영
  } else if (param.type == 'add') {
    let startDatetime = startDate.value
    let endDatetime = endDate.value

    let xAxisLength = chartSeries.value.xAxis.data.length

    if (xAxisLength <= 0) {
      isTimeContains = true
    }

    let utcStartTime = convertUTCTimezone(startDatetime)
    let utcEndTime = convertUTCTimezone(endDatetime)

    let requestform = {
      imoNumber: imoNumber,
      fieldNameList: param.tagIds,
      startTime: utcStartTime,
      endTime: utcEndTime,
      timeContains: isTimeContains
    }

    let {
      status,
      data: { data }
    } = await getEquimentChartData(requestform)

    if ('Time' in data) {
      xAxisDatas = data['Time'].map((date) => convertDateTimeType(date))
      chartSeries.value.xAxis.data = xAxisDatas
    }

    let newDatas = []
    newDatas.push(chartSeries.value.series[0])

    Object.keys(data).forEach((key) => {
      let description = originEquipmentTags.find((el) => el.tagId == key).description
      if (key != 'Time') {
        let newData = {
          name: description,
          data: data[key],
          tagId: key,
          type: 'line'
        }

        newDatas.push(newData)
      }
    })
    chartDatas = newDatas
  }

  let updatedAxis = []
  if (isTimeContains) {
    updatedAxis = xAxisDatas
  } else {
    updatedAxis = originAxis
  }
  let newData = chartDatas//차트의 첫번째 행과 필터링된 행의 합한 배열
  chartSeries.value.legend = []
  chartSeries.value.series = []
  nextTick(() => {
    chartSeries.value.xAxis.data = updatedAxis
    chartSeries.value = {
      ...chartSeries.value,
      series: newData
    }
  })
}

//설렉트박스기능 
const filterAlarmHistory = () => {
  if (selectedStatus.value == 'Status') {
    alarmHistoryInstance.value.clearFilter()
  } else {
    alarmHistoryInstance.value.filter((item) => item.status == selectedStatus.value)
  }
}

const filterEngineType = () => {
  if (selectedEngine.value == 'Engine') {
    alarmHistoryInstance.value.clearFilter()
  } else {
    alarmHistoryInstance.value.filter((item) => item.equipNo == selectedEngine.value)
    equipmentTags.value = originEquipmentTags.filter((item) => item.equipNo == selectedEngine.value)
  }
}

const filterAlarmDetailEngineType = (engineName) => {
  if (engineName != 'Engine') {
    equipmentTags.value = originEquipmentTags.filter((item) => item.equipNo == engineName)
  } else {
    equipmentTags.value = originEquipmentTags
  }
}
//항차조회팝업
const isShowPopupModal = ref(false)
const voyagePopup = ref()
const openVoyagesPopup = async () => {
  isShowPopupModal.value = true
  voyagePopup.value.fetchVoyagesByImoNumber()
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const updateDate = async (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation

  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)
  fetchAlarmHistory()
}

const getColorByAlarmType = (alarmType) => {
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

watch(curSelectedShip, init)
watch(selectedStatus, filterAlarmHistory)
watch(selectedEngine, filterEngineType)

onBeforeUnmount(() => {
  clearInterval(interval)
  interval = null
})

onMounted(() => {
  init()
})

</script>

<style lang="scss" scoped>
.alarm-type {
  font-size: 1.2em;
}

.dx-header-row {
  td {
    &#dx-col-27 {
      text-align: center !important;
    }
  }
}

.w-15 {
  width: 150px;
}

.w-20 {
  width: 150px;
}

.noticeList-datePicker {
  width: 30%;
}
</style>
