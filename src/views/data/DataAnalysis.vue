<template>
  <v-sheet
    class="ma-3 rounded-lg"
    style="height: 100vh; max-height: calc(100vh - 65px - 24px)"
    color="#ffffff00"
  >
    <v-sheet class="mb-3 rounded-lg">
      <SelectedShipSummary />
    </v-sheet>
    <v-sheet class="content-container pa-3 rounded-lg">
      <v-sheet class="px-3 py-3 rounded-lg" color="#333334">
        <div class="d-flex justify-space-between align-center">
          <!-- <div class="align-center">Equipment</div> -->
          <div class="d-flex ga-2">
            <input class="noticeList-datePicker" type="datetime-local" v-model="startDate" />
            <input class="noticeList-datePicker" type="datetime-local" v-model="endDate" />
            <i-btn @click="fetchPeriodAnalysis" text="조회" height="43"></i-btn>
            <i-btn
              text="항차조회"
              @click="openVoyagesPopup()"
              :imoNumber="curSelectedShip.imoNumber"
              color="#3D3D40"
            ></i-btn>
          </div>
        </div>
      </v-sheet>

      <v-container class="performance-chart-container mt-3 pa-0" fluid>
        <v-row class="h-100" no-gutters>
          <v-col cols="6" class="col">
            <v-sheet class="h-100 rounded-lg" color="#333334">
              <div class="d-flex justify-space-between align-center px-4 pt-4">
                <div class="chart-title">Engine Fuel Consumption</div>
                <div class="d-flex align-center">
                  <i-selectbox
                    v-model="selectedEngine"
                    :items="shipEngines"
                    variant="solo-filled"
                    density="compact"
                    class="equipmentSelector w-15"
                    bg-color="#434348"
                    :hide-details="true"
                  ></i-selectbox>
                </div>
              </div>
              <Echart
                :option="engineFuelConsumptionOption"
                class="chart-height"
                ref="fuelChart"
              ></Echart>
              <div class="text-center">Speed (rpm)</div>
            </v-sheet>
          </v-col>
          <v-col cols="6" class="col pl-3">
            <v-sheet class="h-100 rounded-lg" color="#333334">
              <div class="d-flex justify-space-between align-center px-4 pt-4">
                <div class="chart-title">Engine Speed Power</div>
                <div>
                  <i-selectbox
                    v-model="selectedEnginePower"
                    :items="shipEngines"
                    variant="solo-filled"
                    density="compact"
                    class="equipmentSelector w-15"
                    bg-color="#434348"
                    :hide-details="true"
                  ></i-selectbox>
                </div>
              </div>
              <Echart :option="speedPowerOption" class="chart-height" ref="speedChart"></Echart>
              <div class="text-center">Speed (rpm)</div>
            </v-sheet></v-col
          >
          <v-col cols="6" class="col pt-3">
            <v-sheet class="h-100 rounded-lg" color="#333334">
              <div class="d-flex justify-space-between align-center px-4 pt-4">
                <div class="chart-title">Fuel Consumption - Power Curve</div>
                <div>
                  <i-selectbox
                    v-model="selectedEngineFuel"
                    :items="shipEngines"
                    variant="solo-filled"
                    density="compact"
                    class="equipmentSelector w-15"
                    bg-color="#434348"
                    :hide-details="true"
                  ></i-selectbox>
                </div>
              </div>
              <Echart :option="fuelPowerOption" class="chart-height" ref="powerChart"></Echart>
              <div class="text-center">Power (kW)</div>
            </v-sheet>
          </v-col>

          <v-col cols="6" class="col pt-3 pl-3">
            <v-sheet class="h-100 rounded-lg" color="#333334">
              <div class="d-flex justify-space-between align-center px-4 pt-4">
                <div class="chart-title">Power - Propeller RPM Curve</div>
                <div>
                  <i-selectbox
                    v-model="selectedPropeller"
                    :items="shipPropellers"
                    variant="solo-filled"
                    density="compact"
                    class="equipmentSelector w-15"
                    bg-color="#434348"
                    :hide-details="true"
                  ></i-selectbox>
                </div>
              </div>
              <Echart
                :option="powerPropellerOption"
                class="chart-height"
                ref="propellerChart"
              ></Echart>

              <div class="text-center">Speed (rpm)</div>
            </v-sheet></v-col
          >
        </v-row>
      </v-container>
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
  </v-sheet>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { getAllVoyageByImoNumber } from '@/api/voyage.js'
import { getAnalysisData } from '@/api/dataApi.js'

import {
  convertDateTimeType,
  convertDateType,
  convertUTCTimezone,
  isStatusOk,
  addOption
} from '@/composables/util.js'

import Echart from '@/components/echart/Echarts.vue'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'
import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'

import { useToast } from '@/composables/useToast'
import moment from 'moment'
import _ from 'lodash'

const startDate = ref(null)
const endDate = ref(null)
const isShowPopupModal = ref(false)
const voyages = ref(false)

const shipStore = useShipStore()
const { curSelectedShip, shipEngines, shipPropellers, shipMachineInfo } = storeToRefs(shipStore)
const loadingStore = useLoadingStore()
const { loadingStatus } = storeToRefs(loadingStore)

const { showResMsg } = useToast()

const fuelChart = ref()
const speedChart = ref()
const powerChart = ref()
const propellerChart = ref()
// const fuelConsumptionSeries = ref([])
// const powerPropellerSeries = ref([])
// const speedPowerSeries = ref([])
// const fuelPowerSeries = ref([])

const selectedEngine = ref(shipEngines.value[1])
const selectedEnginePower = ref(shipEngines.value[1])
const selectedEngineFuel = ref(shipEngines.value[1])
const selectedPropeller = ref(shipPropellers.value[1])

const selectedFuelEngine = computed(() => selectedEngine.value || _.cloneDeep(shipEngines.value[1]))

const selectedOption = [
  {
    type: 'engine',
    value: selectedEngine
  },
  {
    type: 'engine',
    value: selectedEnginePower
  },
  { type: 'engine', value: selectedEngineFuel },
  { type: 'propeller', value: selectedPropeller }
]

const engineFuelConsumptionOption = ref({
  title: {
    // text: 'Engine Fuel Consumption',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'
  },
  legend: {
    right: '2%',
    bottom: '0%'
  },
  grid: {
    bottom: '30%',
    top: '5%',
    right: '3%'
  },

  xAxis: {
    // name: 'Speed (knots)',
    nameLocation: 'start',
    // nameGap: 50,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
    name: 'Fuel Consumption (kg/h)',
    nameLocation: 'middle',
    nameGap: 55,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: []
})

const speedPowerOption = ref({
  title: {
    // text: 'Speed - Power Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'
  },
  legend: {
    // data: [],
    right: '2%',
    bottom: '0%'
  },
  grid: {
    bottom: '30%',
    top: '5%',
    right: '3%'
  },
  xAxis: {
    // name: 'Speed (knot)',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
    name: 'Power (kW)',
    nameLocation: 'middle',
    nameGap: 55,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: []
})

const fuelPowerOption = ref({
  title: {
    // text: 'Fuel Consumption - Power Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'
  },
  legend: {
    // data: [],
    right: '2%',
    bottom: '0%'
  },
  grid: {
    bottom: '30%',
    top: '5%',
    right: '3%'
  },
  xAxis: {
    // name: 'Power (kW)',
    nameLocation: 'center',
    nameGap: 40,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
    name: 'Fuel Consumption (kg/h)',
    nameLocation: 'center',
    nameGap: 55,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: []
})

const powerPropellerOption = ref({
  title: {
    // text: 'Power - Propeller RPM Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'
  },
  legend: {
    // data: [],
    right: '2%',
    bottom: '0%'
  },
  grid: {
    bottom: '30%',
    top: '5%',
    right: '3%'
  },
  xAxis: {
    // name: 'Propeller Speed (rpm)',
    nameLocation: 'center',
    // nameGap: 30,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
    name: 'Power (kW)',
    nameLocation: 'middle',
    nameGap: 55,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: []
})

let engineFuelConsumption = []
let speedPower = []
let fuelConsumptionPower = []
let powerPropeller = []

let originEngineFuelConsumption = []
let originSpeedPower = []
let originFuelConsumptionPower = []
let originPowerPropeller = []

let utcStartTime = ''
let utcEndTime = ''

onMounted(() => {
  if (!curSelectedShip.value.imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  initFetchData()
})

const initFetchData = async () => {
  // 선박 제원정보 조회
  await shipStore.fetchShipMachineInfo(curSelectedShip.value.imoNumber)
  addOption(shipEngines.value, 'All')
  addOption(shipPropellers.value, 'All')

  // 현재 선택한 엔진 저장
  selectedEngine.value = shipEngines.value[1]
  selectedEnginePower.value = shipEngines.value[1]
  selectedEngineFuel.value = shipEngines.value[1]
  selectedPropeller.value = shipPropellers.value[1]

  // 데이터 조회 기간 설정
  const today = moment()
  let parseEndTimeZone = moment.parseZone(today)
  let sevenDaysAgo = today.subtract(8, 'days')
  let parseStartTimeZone = moment.parseZone(sevenDaysAgo)
  utcStartTime = parseStartTimeZone.toISOString()
  utcEndTime = parseEndTimeZone.toISOString()

  // 분석 데이터 조회
  fetchAnalysisData(utcStartTime, utcEndTime)
}

const fetchAnalysisData = async (utcStartTime, utcEndTime) => {
  loadingStatus.value = true
  try {
    let currentShipImoNumber = curSelectedShip.value.imoNumber

    let requestForm = {
      imoNumber: currentShipImoNumber,
      startTime: utcStartTime,
      endTime: utcEndTime
    }
    const {
      status,
      data: { data }
    } = await getAnalysisData(requestForm)

    if (data.length == 0) {
      console.log('No content')
      resetChartOption()
      return
    }

    if ('Engine Fuel Consumption' in data) {
      let curEngine = selectedEngine.value
      engineFuelConsumption = data['Engine Fuel Consumption']
      originEngineFuelConsumption = data['Engine Fuel Consumption']
      let chartData = []
      if (curEngine != 'All') {
        Object.keys(engineFuelConsumption).forEach((el) => {
          if (el.includes(curEngine) || el.includes('AVG')) {
            chartData.push({
              name: el,
              symbolSize: 10,
              itemStyle: {
                opacity: 0.5
              },
              data: engineFuelConsumption[el],
              type: 'scatter'
            })
          }
        })
      }

      engineFuelConsumptionOption.value.series = chartData
    }

    if ('Speed - Power Curve' in data) {
      let curEngine = selectedEnginePower.value
      speedPower = data['Speed - Power Curve']
      originSpeedPower = data['Speed - Power Curve']
      let chartData = []
      if (curEngine != 'All') {
        Object.keys(speedPower).forEach((el) => {
          console.dir(el)
          if (el == curEngine) {
            chartData.push({
              name: el,
              symbolSize: 10,
              itemStyle: {
                opacity: 0.5
              },
              data: speedPower[el],
              type: 'scatter'
            })
          }
        })
      }

      speedPowerOption.value.series = chartData
    }

    if ('Foc - Power Curve' in data) {
      let curEngine = selectedEngineFuel.value
      fuelConsumptionPower = data['Foc - Power Curve']
      originFuelConsumptionPower = data['Foc - Power Curve']
      let chartData = []
      if (curEngine != 'All') {
        Object.keys(fuelConsumptionPower).forEach((el) => {
          console.dir(el)
          if (el.includes(curEngine) || el.includes('AVG')) {
            chartData.push({
              name: el,
              symbolSize: 10,
              itemStyle: {
                opacity: 0.5
              },
              data: fuelConsumptionPower[el],
              type: 'scatter'
            })
          }
        })
      }

      fuelPowerOption.value.series = chartData
    }

    if ('Power - Propeller RPM Curve' in data) {
      let curPropeller = selectedPropeller.value
      powerPropeller = data['Power - Propeller RPM Curve']
      originPowerPropeller = data['Power - Propeller RPM Curve']
      let chartData = []
      if (curPropeller != 'All') {
        Object.keys(powerPropeller).forEach((el) => {
          console.dir(el)
          if (el == curPropeller) {
            chartData.push({
              name: el,
              symbolSize: 10,
              itemStyle: {
                opacity: 0.5
              },
              data: powerPropeller[el],
              type: 'scatter'
            })
          }
        })
      }

      powerPropellerOption.value.series = chartData
    }
    startDate.value = convertDateTimeType(utcStartTime)
    endDate.value = convertDateTimeType(utcEndTime)
  } catch (error) {
    if (error.response.data) {
      const errMsg = error.reponse.data.errorMsg
      showResMsg(errMsg)
    }
  } finally {
    loadingStatus.value = false
  }
}

const fetchPeriodAnalysis = () => {
  utcStartTime = convertUTCTimezone(startDate.value)
  utcEndTime = convertUTCTimezone(endDate.value)
  fetchAnalysisData(utcStartTime, utcEndTime)
}

const getChartOption2 = (chartOptionName, chartData) => {
  let series = []
  console.log()
  console.dir(chartData)
  Object.keys(chartData).forEach((el) => {
    let newData = {
      name: '',
      symbolSize: 10,
      itemStyle: {
        opacity: 0.5
      },
      data: [],
      type: 'scatter'
    }
    newData.name = el
    newData.data = chartData[el]

    series.push(newData)
  })

  chartOptionName.value.legend.data = Object.keys(chartData)

  return { ...chartOptionName.value, series: series }
}

const getChartOption = (chartOptionName, chartData) => {
  let series = []
  console.log()
  console.dir(chartData)
  Object.keys(chartData).forEach((el) => {
    let newData = {
      name: '',
      symbolSize: 10,
      itemStyle: {
        opacity: 0.5
      },
      data: [],
      type: 'scatter'
    }
    newData.name = el
    newData.data = chartData[el]

    series.push(newData)
  })

  chartOptionName.value.legend.data = Object.keys(chartData)

  return { ...chartOptionName.value, series: series }
}

const updateDate = (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation

  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)

  utcStartTime = convertUTCTimezone(startDate.value)
  utcEndTime = convertUTCTimezone(endDate.value)
  fetchAnalysisData(utcStartTime, utcEndTime)
}

const voyagePopup = ref()
const openVoyagesPopup = async () => {
  isShowPopupModal.value = true
  voyagePopup.value.fetchVoyagesByImoNumber()
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const resetChartOption = () => {
  nextTick(() => {
    engineFuelConsumptionOption.value = {
      ...engineFuelConsumptionOption.value,
      series: [],
      legend: []
    }
    speedPowerOption.value = { ...speedPowerOption.value, series: [], legend: [] }
    fuelPowerOption.value = { ...fuelPowerOption.value, series: [], legend: [] }
    powerPropellerOption.value = { ...powerPropellerOption.value, series: [], legend: [] }
  })
}

/**
 * Engine Fuel Consumption 엔진 변경
 */
const filterEngineFuelConsumption = () => {
  fuelChart.value.clearChart()
  let engineName = selectedEngine.value
  engineFuelConsumptionOption.value.series = []
  let result = []

  if (engineName != 'All') {
    Object.keys(originEngineFuelConsumption).forEach((el) => {
      if (el.includes(engineName) || el.includes('AVG')) {
        result.push({
          name: el,
          symbolSize: 10,
          itemStyle: {
            opacity: 0.5
          },
          data: engineFuelConsumption[el],
          type: 'scatter'
        })
      }
    })

    console.dir(result)
  } else {
    Object.keys(originEngineFuelConsumption).forEach((el) => {
      result.push({
        name: el,
        symbolSize: 10,
        itemStyle: {
          opacity: 0.5
        },
        data: engineFuelConsumption[el],
        type: 'scatter'
      })
    })
  }
  engineFuelConsumptionOption.value.series = []

  nextTick(() => {
    engineFuelConsumptionOption.value.series = result
  })
}

const selectSpeedPower = () => {
  speedChart.value.clearChart()
  let engineName = selectedEnginePower.value
  // engineFuelConsumptionOption.value.series = []
  let result = []

  if (engineName != 'All') {
    Object.keys(originSpeedPower).forEach((el) => {
      if (el.includes(engineName) || el.includes('AVG')) {
        result.push({
          name: el,
          symbolSize: 10,
          itemStyle: {
            opacity: 0.5
          },
          data: speedPower[el],
          type: 'scatter'
        })
      }
    })

    console.dir(result)
  } else {
    Object.keys(originSpeedPower).forEach((el) => {
      result.push({
        name: el,
        symbolSize: 10,
        itemStyle: {
          opacity: 0.5
        },
        data: speedPower[el],
        type: 'scatter'
      })
    })
  }
  speedPowerOption.value.series = []

  nextTick(() => {
    speedPowerOption.value.series = result
  })
}

const selectFuelPower = () => {
  powerChart.value.clearChart()
  let engineName = selectedEngineFuel.value
  // engineFuelConsumptionOption.value.series = []
  let result = []

  if (engineName != 'All') {
    Object.keys(originFuelConsumptionPower).forEach((el) => {
      if (el.includes(engineName) || el.includes('AVG')) {
        result.push({
          name: el,
          symbolSize: 10,
          itemStyle: {
            opacity: 0.5
          },
          data: fuelConsumptionPower[el],
          type: 'scatter'
        })
      }
    })

    console.dir(result)
  } else {
    Object.keys(originFuelConsumptionPower).forEach((el) => {
      result.push({
        name: el,
        symbolSize: 10,
        itemStyle: {
          opacity: 0.5
        },
        data: fuelConsumptionPower[el],
        type: 'scatter'
      })
    })
  }
  fuelPowerOption.value.series = []

  nextTick(() => {
    fuelPowerOption.value.series = result
  })
}

const selectPropllerPower = () => {
  propellerChart.value.clearChart()
  let engineName = selectedPropeller.value
  // engineFuelConsumptionOption.value.series = []
  let result = []

  if (engineName != 'All') {
    Object.keys(originPowerPropeller).forEach((el) => {
      if (el.includes(engineName) || el.includes('AVG')) {
        result.push({
          name: el,
          symbolSize: 10,
          itemStyle: {
            opacity: 0.5
          },
          data: powerPropeller[el],
          type: 'scatter'
        })
      }
    })

    console.dir(result)
  } else {
    Object.keys(originPowerPropeller).forEach((el) => {
      result.push({
        name: el,
        symbolSize: 10,
        itemStyle: {
          opacity: 0.5
        },
        data: powerPropeller[el],
        type: 'scatter'
      })
    })
  }
  powerPropellerOption.value.series = []

  nextTick(() => {
    powerPropellerOption.value.series = result
  })
}

watch(curSelectedShip, initFetchData)
watch(selectedEngine, filterEngineFuelConsumption)
watch(selectedEnginePower, selectSpeedPower)
watch(selectedEngineFuel, selectFuelPower)
watch(selectedPropeller, selectPropllerPower)
</script>

<style lang="scss" scoped>
.v-window.analysis-tab-container.d-flex.flex-column .v-window__container {
  /* background : red; */
  flex: 1 1 auto;
}

.analysis-chart-container {
  height: calc(100% - 45px);
}

/* Flex */
/* .chart-analysis-container{
  flex : 1 1 0;
  gap : 16px;
  background : orange;
} */

/* 
.chart-item {
  background: #222224;
  flex: 1 1 40%;
}
*/
/* height : 100%; */

/* Grid */
.chart-analysis-container {
  /* flex: 1 1 0; */

  /* background : yellow; */
}

.chart-grid {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  background: orange;
}

.chart-item {
  background: #222224;
}

.analysis-tab-container .v-window-item {
  height: 100%;
}

.card-bg {
  background: #434348;
}

.v-row.analysis-chart-container {
  > div {
    height: calc(100% / 2);
  }
}

.performance-chart-container {
  height: 100%;
  max-height: calc(100% - 36px - 48px);
  // background: blue;
}

.col {
  height: calc(100% / 2);
}

.chart-height {
  height: calc(100% - 85px);
}

.chart-title {
  font-size: 1.2rem;
}
</style>
