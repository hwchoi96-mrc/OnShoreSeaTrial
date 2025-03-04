<template>
  <v-sheet class="performance-container rounded-lg pt-3">
    <v-sheet class="pa-3 mb-3 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <i-selectbox
            v-model="selectedEngineName"
            :items="shipEngines"
            item-title="name"
            item-value="id"
            variant="solo-filled"
            density="compact"
            return-object
            class="equipmentSelector"
            bg-color="#434348"
            :hide-details="true"
          ></i-selectbox>
          <input class="noticeList-datePicker" type="datetime-local" v-model="startDate" />
          <input class="noticeList-datePicker" type="datetime-local" v-model="endDate" />
          <i-btn @click="fetchPeriodPerformance" text="조회" height="43"></i-btn>

          <i-btn
            text="항차조회"
            @click="openVoyagesPopup"
            :imoNumber="curSelectedShip.imoNumber"
            color="#3D3D40"
          ></i-btn>
        </div>

        <div class="d-flex flex-grow-1 justify-end" v-if="displayByRole">
          <v-btn @click="openEnignePerformancePopup" icon="mdi-fullscreen"></v-btn>
        </div>
      </div>
    </v-sheet>

    <v-row no-gutters class="engine-data-item performance-chart">
      <v-col cols="4">
        <!-- <i-selectBox :items="test"></i-selectBox> -->
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart ref="loadSpeedChart" :option="loadSpeedrOption" class="chart-height"> </EChart>
          <!-- @finished="onChartFinished" -->
          <div class="chart-xais-name text-center">Load (%)</div>
        </v-sheet>
      </v-col>
      <v-col cols="4" class="px-3">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart ref="loadPressChart" :option="loadPressOption" class="chart-height"></EChart>
          <div class="chart-xais-name text-center">Load (%)</div>
        </v-sheet>
      </v-col>

      <v-col cols="4">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart ref="loadTcChart" :option="loadTcOption" class="chart-height"></EChart>
          <div class="chart-xais-name text-center">Load (%)</div>
        </v-sheet>
      </v-col>

      <v-col cols="4" class="pa-0 pt-3">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart ref="loadTcSpeedChart" :option="loadTcSpeedrOption" class="chart-height"></EChart>
          <div class="chart-xais-name text-center">Load (%)</div>
        </v-sheet>
      </v-col>
      <v-col cols="4" class="pa-0 px-3 pt-3">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart ref="loadScavChart" :option="loadScavOption" class="chart-height" />
          <div class="chart-xais-name text-center">Load (%)</div>
        </v-sheet>
      </v-col>
    </v-row>
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
import { ref, onMounted, watch, computed, toDisplayString } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { useToast } from '@/composables/useToast'

import moment from 'moment'
import EChart from '@/components/echart/Echarts.vue'
import { getEnginePerformanceData } from '@/api/dataApi'
import { getAllVoyageByImoNumber } from '@/api/voyage.js'

import {
  convertDateTimeType,
  convertUTCTimezone,
  openNewPopup,
  displayOnlySuperAdmin
} from '@/composables/util.js'

import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'

const startDate = ref(null)
const endDate = ref(null)
let utcStartTime = ''
let utcEndTime = ''

const shipStore = useShipStore()
const { curSelectedShip, shipMachineInfo, shipEngines, shipEngines1 } = storeToRefs(shipStore)

const loadingStore = useLoadingStore()
const { loadingStatus } = storeToRefs(loadingStore)

let selectedEngineName = ref(shipEngines.value[0])
const { showResMsg } = useToast()
onMounted(() => {
  initFetchData()
})

const loadSpeedChart = ref()
const loadPressChart = ref()
const loadTcChart = ref()
const loadTcSpeedChart = ref()
const loadScavChart = ref()

const displayByRole = computed(() => {
  const result = displayOnlySuperAdmin()
  console.log(result)
  return result
})

const initFetchData = async () => {
  if (!curSelectedShip.value.imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  const today = moment()
  let parseEndTimeZone = moment.parseZone(today)
  let sevenDaysAgo = today.clone().subtract(8, 'days')

  // let parseStartTimeZone = moment.parseZone(sevenDaysAgo)
  // utcStartTime = parseStartTimeZone.toISOString()
  utcEndTime = parseEndTimeZone.toISOString()

  // if (shipEngines.value.length != 0) {
  //   selectedEngineName.value = shipEngines.value[0]
  // }

  await shipStore.fetchShipMachineInfo(curSelectedShip.value.imoNumber)

  if (shipEngines.value.length != 0) {
    selectedEngineName.value = shipEngines.value[0]
  }

  startDate.value = sevenDaysAgo

  endDate.value = today

  fetchPerformanceData()
}

const convertSeries = (xAxisData, yAxisData) => {
  const loadPressSeries = []
  console.log('차트 데이터')
  console.dir(yAxisData)

  for (let i = 0; i < yAxisData.length; i++) {
    let data = yAxisData[i].data.map((data, index) => [xAxisData[index], data])
    loadPressSeries.push({
      symbolSize: 10,
      itemStyle: {
        opacity: 0.5
      },
      data: data,
      name: yAxisData[i].name,
      type: 'scatter'
    })
  }
  console.log('시리즈 변환')
  console.dir(loadPressSeries)
  return loadPressSeries
}
const fetchPerformanceData = async () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber

  let utcStartTime = convertUTCTimezone(startDate.value)
  let utcEndTime = convertUTCTimezone(endDate.value)

  let periodForm = {
    imoNumber: curSelectedImoNumber,
    startTime: utcStartTime,
    endTime: utcEndTime,
    engineName: selectedEngineName.value,
    intervalHours: 0
  }

  loadingStatus.value = true
  try {
    const response = await getEnginePerformanceData(periodForm)
    const {
      status,
      data: {
        data: {
          loadMap,
          speedMap,
          averageCylinderPmaxMap,
          averageCylinderPcompMap,
          averageTCSpeedMap,
          averageTCExhGasInletTempMap,
          averageTCExhGasOutletTempMap,
          averageCylinderExhGasTempMap,
          scavAirPressMap
        }
      }
    } = response

    if (status == 204) {
      clearChart()
      showResMsg('데이터가 없습니다')
      startDate.value = convertDateTimeType(utcStartTime)
      endDate.value = convertDateTimeType(utcEndTime)
      return
    }

    // Load - Speed 차트
    if (speedMap) {
      const speedChart = speedMap.map((speed, index) => [loadMap[index], speed])
      loadSpeedrOption.value.series[0].data = speedChart
    }

    // Load - Press 차트
    if (averageCylinderPmaxMap || averageCylinderPcompMap) {
      let loadPressData = [
        {
          name: 'Cyl Pmax',
          data: averageCylinderPmaxMap
        },
        {
          name: 'Cyl Pcomp',
          data: averageCylinderPcompMap
        }
      ]
      loadPressOption.value.series = convertSeries(loadMap, loadPressData)
    }

    // Load - T/C Temp 차트
    if (
      averageTCExhGasInletTempMap ||
      averageTCExhGasOutletTempMap ||
      averageCylinderExhGasTempMap
    ) {
      let loadTcData = [
        {
          name: 'Exh.Gas.Inlet',
          data: averageTCExhGasInletTempMap
        },
        {
          name: 'Exh.Gas.Outlet',
          data: averageTCExhGasOutletTempMap
        },
        {
          name: 'Cyl.Gas.Temp',
          data: averageCylinderExhGasTempMap
        }
      ]
      loadTcOption.value.series = convertSeries(loadMap, loadTcData)
    }

    // Load - T/C Speed 차트
    if (averageTCSpeedMap) {
      const tcSpeedChart = averageTCSpeedMap.map((tcSpeed, index) => [loadMap[index], tcSpeed])
      loadTcSpeedrOption.value.series[0].data = tcSpeedChart
    }

    // Load - Scav Air Pressure 차트
    if (scavAirPressMap) {
      const scavAirPressChart = scavAirPressMap.map((speed, index) => [loadMap[index], speed])
      loadScavOption.value.series[0].data = scavAirPressChart
    }

    startDate.value = convertDateTimeType(utcStartTime)
    endDate.value = convertDateTimeType(utcEndTime)

    // test.value.chart.on('finished', () => {
    //   alert('차트 그리기 완')
    // })
  } catch (error) {
    if (error.response.data) {
      const errMsg = error.reponse.data.errorMsg
      showResMsg(errMsg)
    }
  } finally {
    loadingStatus.value = false
  }
}

// const onChartFinished = () => {
//   alert('차트 그리기 완')
// }

const loadSpeedrOption = ref({
  grid: {
    left: '13%',
    right: '5%',
    bottom: '18%'
  },
  title: {
    text: 'Load - Speed',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: {
    max: 100,
    interval: 25,
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
    name: 'Speed (rpm)',
    nameLocation: 'middle',
    nameGap: 45,
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    nameTextStyle: {
      color: '#fff'
    }
  },
  legend: {
    data: ['Load-Speed'],
    right: '5%',
    bottom: '0%',
    textStyle: {
      fontSize: '0.75rem'
    }
  },
  series: [
    {
      name: 'Load-Speed',
      symbolSize: 10,
      data: [],
      type: 'scatter'
    }
  ]
})

const loadPressOption = ref({
  grid: {
    left: '13%',
    right: '5%',
    bottom: '18%'
  },
  title: {
    text: 'Load - Press',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    // data: ['Cyl Pmax (bar)', 'Cyl Pcomp (bar)'],
    right: '5%',
    bottom: '0%',
    textStyle: {
      fontSize: '0.75rem'
    }
  },
  xAxis: {
    max: 100,
    interval: 25,
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
    name: 'Press (bar)',
    nameLocation: 'middle',
    nameGap: 45,
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    nameTextStyle: {
      color: '#fff'
    }
  },
  series: []
})

const loadTcOption = ref({
  grid: {
    left: '13%',
    right: '5%',
    bottom: '18%'
  },
  title: {
    text: 'Load - T/C Temp',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    right: '5%',
    bottom: '0%',
    textStyle: {
      fontSize: '0.75rem'
    }
  },
  xAxis: {
    max: 100,
    interval: 25,
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
    name: 'Temp (℃)',
    nameLocation: 'middle',
    nameGap: 45,
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    nameTextStyle: {
      color: '#fff'
    }
  },
  series: []
})

const loadTcSpeedrOption = ref({
  grid: {
    left: '13%',
    right: '5%',
    bottom: '18%'
  },
  title: {
    text: 'Load - T/C Speed',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: {
    max: 100,
    interval: 25,
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
    name: 'Speed (rpm)',
    nameLocation: 'middle',
    nameGap: 45,
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    nameTextStyle: {
      color: '#fff'
    }
  },
  legend: {
    data: ['Load-T/CSpeed'],
    right: '5%',
    bottom: '0%',
    textStyle: {
      fontSize: '0.75rem'
    }
  },
  series: [
    {
      name: 'Load-T/CSpeed',
      symbolSize: 10,
      data: [],
      type: 'scatter',
      itemStyle: {
        opacity: 0.5
      }
    }
  ]
})

const loadScavOption = ref({
  grid: {
    left: '13%',
    right: '5%',
    bottom: '18%'
  },
  title: {
    text: 'Load - Scav Air Pressure',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: {
    max: 100,
    interval: 25,
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
    name: 'Scav.Air Pressure (Kg/cm²)',
    nameLocation: 'middle',
    nameGap: 45,
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    nameTextStyle: {
      color: '#fff'
    }
  },
  legend: {
    data: ['Load-Scav Air Pressure'],
    right: '5%',
    bottom: '0%',
    textStyle: {
      fontSize: '0.75rem'
    }
  },
  series: [
    {
      name: 'Load-Scav Air Pressure',
      symbolSize: 10,
      data: [],
      type: 'scatter',
      itemStyle: {
        opacity: 0.5
      }
    }
  ]
})

const isShowPopupModal = ref(false)
const voyages = ref(false)
const voyagePopup = ref()
const openVoyagesPopup = async () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  isShowPopupModal.value = true
  voyagePopup.value.fetchVoyagesByImoNumber()
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const updateDate = async (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation

  console.dir(dateInformation)
  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)
  fetchPerformanceData()
}

const fetchPeriodPerformance = () => {
  clearChart()
  utcStartTime = convertUTCTimezone(startDate.value)
  utcEndTime = convertUTCTimezone(endDate.value)
  fetchPerformanceData()
}

const openEnignePerformancePopup = () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber

  if (!curSelectedImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
  }
  openNewPopup(`/popup/monitoring/engine/performance?imoNumber=${curSelectedImoNumber}`)
}

const clearChart = () => {
  loadSpeedrOption.value.series[0].data = null
  loadPressOption.value.series = null
  loadTcOption.value.series = null

  loadTcSpeedrOption.value.series[0].data = null
  loadScavOption.value.series[0].data = null

  loadSpeedChart.value.clearChart()
  loadPressChart.value.clearChart()
  loadTcChart.value.clearChart()
  loadTcSpeedChart.value.clearChart()
  loadTcSpeedChart.value.clearChart()
}
watch(curSelectedShip, initFetchData)
watch(selectedEngineName, fetchPerformanceData)
</script>

<style scoped lang="scss">
.performance-container {
  height: 100vh;
  max-height: calc(100vh - 65px - 12px - 60px - 12px - 62px - 12px);

  min-height: 600px;
  overflow: auto;
  // gap : 16px;
}

.performance-chart {
  height: calc(100% - 79px - 12px);
}

.performance-container .chart-item {
  flex: 1 1 30%;
  background: yellow;
}

.engine-data-item {
  > div {
    /* flex: 0 1 33.3%; */
    height: calc(100% / 2);
  }
}

.title {
  font-size: 1.15rem;
}

.chart-height {
  height: calc(100% - 35px);
}

.chart-xais-name {
  font-family: sans-serif;
  font-size: 0.75rem;
  color: #fff;
}
</style>
