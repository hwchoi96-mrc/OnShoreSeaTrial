<template>
  <v-sheet class="tabs-inner-content-container w-100">
    <v-sheet class="px-6 py-3 my-3 rounded-lg" color="#333334">
      <div class="d-flex ga-2 align-center">
        <div class="d-flex ga-2">
          <input class="noticeList-datePicker" type="datetime-local" v-model="startDate" />
          <input
            class="noticeList-datePicker"
            type="datetime-local"
            v-model="endDate"
            :min="startDate"
          />
          <i-btn @click="fetchPeriodEngineData()" text="조회"></i-btn>
          <i-btn
            text="항차조회"
            @click="openVoyagesPopup()"
            :imoNumber="curSelectedShip.imoNumber"
            color="#3D3D40"
          ></i-btn>
        </div>
        <div class="d-flex flex-grow-1 justify-end" v-if="displayByRole">
          <v-btn @click="openEnigneTimeBasedPopup" icon="mdi-fullscreen"></v-btn>
        </div>
        <!-- <div class="d-flex ml-6">
          <i-selectbox v-model="selectedEngineName" :items="engineKeys" item-title="name" item-value="id" variant="solo-filled"
        density="compact" return-object class="equipmentSelector" bg-color="#434348" :hide-details="true"></i-selectbox>
        </div> -->
      </div>
    </v-sheet>

    <v-sheet class="period-engine-page">
      <v-sheet class="rounded-lg" color="#333334">
        <EChart ref="heatmapChart" :option="heatmapOption"></EChart>
      </v-sheet>
      <v-sheet class="rounded-lg" color="#333334">
        <EChart ref="runningHourChart" :option="runningHourSeries"></EChart>
      </v-sheet>
      <v-sheet class="rounded-lg" color="#333334">
        <EChart ref="averageSpeedChart" :option="averageSpeedSeries"></EChart>
      </v-sheet>
      <v-sheet class="rounded-lg" color="#333334">
        <EChart ref="averagePowerChart" :option="averagePowerSeries"></EChart>
      </v-sheet>
    </v-sheet>
  </v-sheet>
  <VoyagesPopup
    v-model="isShowPopupModal"
    :imoNumber="curSelectedShip.imoNumber"
    @selectVoyage="updateDate"
    @close="closeVoyagesPopup"
    :departureTime="startDate"
    :arrivalTime="endDate"
    ref="voyagePopup"
  />
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/stores/loadingStore'
import { useShipStore } from '@/stores/shipStore'
import { useToast } from '@/composables/useToast'
import { getPeriodEngineData } from '@/api/dataApi'
import { getCurrentVoyage } from '@/api/voyage.js'
import {
  convertUTCTimezone,
  convertDateTimeType,
  openNewPopup,
  displayOnlySuperAdmin
} from '@/composables/util.js'

import EChart from '@/components/echart/Echarts.vue'
import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'
import moment from 'moment'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const { showResMsg } = useToast()

const startDate = ref(null)
const endDate = ref(null)
const isShowPopupModal = ref(false)

const heatmapChart = ref()
const runningHourChart = ref()
const averageSpeedChart = ref()
const averagePowerChart = ref()

const loadingStore = useLoadingStore()
const { loadingStatus } = storeToRefs(loadingStore)

onMounted(() => {
  initFetchData()
})

const displayByRole = computed(() => {
  const result = displayOnlySuperAdmin()
  return result
})

let utcStartTime = ''
let utcEndTime = ''

const initFetchData = async () => {
  if (!curSelectedShip.value.imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  loadingStatus.value = true

  const today = moment()
  utcEndTime = convertUTCTimezone(today.clone())
  utcStartTime = convertUTCTimezone(today.subtract(8, 'days'))

  await fetchEngineData(utcStartTime, utcEndTime)

  loadingStatus.value = false
}

const fetchEngineData = async (utcStartTime, utcEndTime) => {
  clearChart()

  try {
    let periodForm = {
      imoNumber: curSelectedShip.value.imoNumber,
      startTime: utcStartTime,
      endTime: utcEndTime
    }

    loadingStatus.value = true
    const {
      status,
      data: {
        data: { AverageLoad, RunningHours, AverageSpeed, AveragePower }
      }
    } = await getPeriodEngineData(periodForm)

    if (status == 204) {
      clearChart()
      showResMsg('데이터가 없습니다')
      startDate.value = convertDateTimeType(utcStartTime)
      endDate.value = convertDateTimeType(utcEndTime)
      return
    }

    loadingStatus.value = false
    nextTick(() => {
      // AverageLoad 차트
      if (AverageLoad) {
        changeAllDayData(AverageLoad)
        heatmapOption.value.xAxis.data = AverageLoad.recordDaySet
        heatmapOption.value.legend.data = AverageLoad.engineNameList
        heatmapOption.value.series = convertAverageLoadSeries(AverageLoad)
      }

      // RunningHours 차트
      if (RunningHours) {
        changeAllDayData(RunningHours)
        runningHourSeries.value.xAxis.data = RunningHours.recordDaySet
        runningHourSeries.value.legend.data = RunningHours.engineNameList
        runningHourSeries.value.series = convertRunningHourSeries(RunningHours)
      }

      // AverageSpeed 차트
      if (AverageSpeed) {
        changeAllDayData(AverageSpeed)
        averageSpeedSeries.value.xAxis.data = AverageSpeed.recordDaySet
        averageSpeedSeries.value.legend.data = AverageSpeed.engineNameList
        averageSpeedSeries.value.series = convertAverageSpeedSeries(AverageSpeed)
      }

      // AveragePower 차트
      if (AveragePower) {
        changeAllDayData(AveragePower)
        averagePowerSeries.value.xAxis.data = AveragePower.recordDaySet
        averagePowerSeries.value.legend.data = AveragePower.engineNameList
        averagePowerSeries.value.series = convertPowerSeries(AveragePower)
      }
    })
  } catch (error) {
    let errMsg = ''
    if (error.response.data) {
      error.reponse.data.errorMsg
      showResMsg(errMsg)
    } else {
      errMsg = error.response.data.error
      showResMsg(errMsg)
    }
  } finally {
    loadingStatus.value = false
  }

  startDate.value = convertDateTimeType(utcStartTime)
  endDate.value = convertDateTimeType(utcEndTime)
}

function changeAllDayData(data) {
  const dayAndDataObjectArray = data.engineNameList.map((engineName, engineIndex) => {
    const dayAndDataObject = []
    data.recordDaySet.forEach((key, index) => {
      dayAndDataObject.push({ [key]: data.dataList[engineIndex][index] })
    })
    return dayAndDataObject
  })

  const dayArray = []
  const start = new Date(startDate.value.split(' ')[0])
  const end = new Date(endDate.value.split(' ')[0])

  while (start <= end) {
    dayArray.push(start.toISOString().split('T')[0])
    start.setDate(start.getDate() + 1)
  }

  const newArray = dayAndDataObjectArray.map((dayAndDataObject) => {
    const newData = []
    dayArray.forEach((date) => {
      let value = 0.0
      for (let obj of dayAndDataObject) {
        if (date in obj) {
          value = obj[date]
          break
        }
      }
      newData.push({ [date]: value })
    })
    return newData
  })

  const keysArray = dayArray
  const valuesArray = newArray.map((newData) => {
    return newData.map((data) => Object.values(data)[0])
  })

  data.recordDaySet = keysArray
  data.dataList = valuesArray
}

const clearChart = () => {
  heatmapChart.value.clearChart()
  runningHourChart.value.clearChart()
  averageSpeedChart.value.clearChart()
  averagePowerChart.value.clearChart()
}

const fetchPeriodEngineData = () => {
  utcStartTime = convertUTCTimezone(startDate.value)
  utcEndTime = convertUTCTimezone(endDate.value)
  fetchEngineData(utcStartTime, utcEndTime)
}

const convertAverageLoadSeries = (loadData) => {
  let averageLoadSeries = []

  for (let i = 0; i < loadData.engineNameList.length; i++) {
    let loadDataSeries = loadData.dataList[i]

    averageLoadSeries.push({
      name: loadData.engineNameList[i],
      type: 'line',
      data: loadDataSeries
    })
  }

  return averageLoadSeries
}

const convertRunningHourSeries = (runningHourData) => {
  const stackBarSeries = []

  //소수점 첫째자리까지만 연산
  const roundedDataList = runningHourData.dataList.map((engineData) =>
    engineData.map((value) => parseFloat(value.toFixed(1)))
  )

  //누적값 계산
  // const cumulativeDataList = roundedDataList.map((engineData) => {
  //   let cumulative = 0
  //   return engineData.map((value) => {
  //     cumulative += value
  //     return cumulative
  //   })
  // })

  //그래프 시리즈 추가
  for (let i = 0; i < runningHourData.engineNameList.length; i++) {
    const engineName = runningHourData.engineNameList[i]
    let engineData = roundedDataList[i]
    let engineDataLine = roundedDataList[i]

    stackBarSeries.push({
      data: engineData,
      name: engineName,
      type: 'bar'
    })

    stackBarSeries.push({
      data: engineDataLine,
      name: engineName,
      type: 'line',
      endLabel: {
        show: true,
        formatter: '{a}',
        distance: 20
      }
    })
  }

  return stackBarSeries
}

const convertAverageSpeedSeries = (speedData) => {
  let averageSpeedSeries = []

  for (let i = 0; i < speedData.engineNameList.length; i++) {
    let speedDataSeries = speedData.dataList[i]

    averageSpeedSeries.push({
      name: speedData.engineNameList[i],
      type: 'line',
      data: speedDataSeries
    })
  }

  return averageSpeedSeries
}

const convertPowerSeries = (powerData) => {
  const powerSeries = []
  for (let i = 0; i < powerData.engineNameList.length; i++) {
    const engineName = powerData.engineNameList[i]
    let powerDataSeries = powerData.dataList[i]
    powerSeries.push({
      name: engineName,
      type: 'bar',
      stack: 'total',
      barWidth: '60%',
      data: powerDataSeries
    })

    powerSeries.push({
      name: engineName + ' line',
      type: 'line',
      data: powerDataSeries
    })
  }

  return powerSeries
}

const voyagePopup = ref()
const openVoyagesPopup = async () => {
  isShowPopupModal.value = true
  voyagePopup.value.fetchVoyagesByImoNumber()
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const updateDate = (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation

  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)

  fetchPeriodEngineData()
}

const openEnigneTimeBasedPopup = () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber

  if (!curSelectedImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  openNewPopup(`/popup/monitoring/engine/time?imoNumber=${curSelectedImoNumber}`)
}
const { refreshDataTime } = storeToRefs(loadingStore)
const reloadData = () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let result = dateTime.isBefore(refreshDataTime.value)

  if (result) {
    initFetchData()
  }
}

watch(curSelectedShip, initFetchData, { deep: true })
watch(refreshDataTime, reloadData)

const heatmapOption = ref({
  title: {
    text: 'Average Load',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    right: '3%',
    bottom: '5%',
    data: []
  },
  grid: {
    left: '3%',
    right: '5%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: ['20%', '20%'],
    data: []
  },
  yAxis: {
    name: 'Load (%)',
    nameLocation: 'middle',
    nameGap: 38,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    type: 'value',
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    boundaryGap: [0, '70%']
  },
  series: []
})

const runningHourSeries = ref({
  title: {
    text: 'Running Hours',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  grid: {
    left: '9%',
    right: '3%'
  },
  legend: {
    right: '3%',
    bottom: '5%',
    data: []
  },
  tooltip: {
    position: 'top'
  },
  yAxis: {
    name: 'hours (h)',
    nameLocation: 'middle',
    nameGap: 50,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
  xAxis: {
    type: 'category',
    data: []
  },
  series: []
})

const averageSpeedSeries = ref({
  title: {
    text: 'Average Speed',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    right: '3%',
    bottom: '5%',
    data: []
  },
  grid: {
    left: '3%',
    right: '5%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: ['20%', '20%'],
    data: []
  },
  yAxis: {
    name: 'speed (rpm)',
    nameLocation: 'middle',
    nameGap: 38,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
  series: []
})

const averagePowerSeries = ref({
  title: {
    text: 'Average Power',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  grid: {
    left: '9%',
    right: '3%'
  },
  legend: {
    selectedMode: false,
    right: '3%',
    bottom: '5%'
  },
  tooltip: {
    trigger: 'axis'
  },
  yAxis: {
    name: 'power (kW)',
    nameLocation: 'middle',
    nameGap: 50,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
  xAxis: {
    type: 'category',
    data: []
  },
  series: []
})
</script>

<style lang="scss" scoped>
.item {
  flex: 1 1 40%;
}

.v-card.item {
  background: #5f5f67;
}

.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.rh-item {
  background: #333334;
  flex: 1 1 40%;
}

.rh-title {
  font-size: 1.2em;
}

.rh-value {
  font-size: 2.5em;
  font-weight: bold;
}

.engine-data-item {
  > div {
    /* flex: 0 1 33.3%; */
    height: calc(100% / 3);
  }
}

.running-hour-container {
  gap: 16px;
}

.runing-hour-item {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #333334;
}

.performance-chart-container {
  height: 100vh;
  max-height: calc(100% - 92px - 24px);
  // background: blue;
}

.tabs-content-test {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px);
}

.period-engine-page {
  height: 100vh;
  // max-height: calc(100vh - 65px - 24px - 62px - 24px - 48px - 40px - 24px - 24px - 12px);
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 48px - 40px - 24px - 24px - 20px);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
}
.tabs-inner-content-container {
  height: 100vh;
  max-height: calc(100vh - (65px + 12px + 60px + 12px + 62px + 12px));
}
</style>
