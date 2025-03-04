<template>
  <v-sheet
    class="pa-3 rounded-lg mt-3 engine-monitoring-page d-flex justify-space-between"
    color="#333334"
  >
    <div>
      <i-selectbox
        v-model="selectedEngineName"
        :items="engineKeys"
        item-title="name"
        item-value="id"
        variant="solo-filled"
        density="compact"
        return-object
        class="w-100"
        bg-color="#434348"
        :hide-details="true"
        @update:modelValue="changeSelectedEngineName"
      ></i-selectbox>
    </div>
    <div class="d-flex flex-grow-1 justify-end">
      <v-btn @click="openEngineRealTimePopup" icon="mdi-fullscreen" v-if="displayByRole"></v-btn>
    </div>
  </v-sheet>
  <v-sheet class="real-time-container mt-3">
    <v-sheet class="rounded-lg d-flex flex-column ga-3 justify-center align-center" color="#333334">
      <div class="text-center">
        <div class="rh-title">Running Hour</div>
        <div class="rh-value">
          {{ selectedEngineData.runningHours }} <span class="unit">h</span>
        </div>
      </div>

      <div class="text-center">
        <div class="rh-title">Power</div>
        <div class="rh-value">{{ selectedEngineData.power }} <span class="unit">kw</span></div>
      </div>
    </v-sheet>
    <v-sheet class="h-100 rounded-lg" color="#333334">
      <EChart :option="powerBarOption" autoresize />
    </v-sheet>
    <v-sheet class="h-100 rounded-lg" color="#333334" style="grid-column: 3 / 5">
      <EChart :option="rpmGuageChartOption" autoresize />
    </v-sheet>

    <v-sheet
      class="h-100 justify-center rounded-lg ga-4 pa-6 align-center"
      color="#333334"
      style="display: grid; grid-template-columns: 1fr 1fr; grid-column: 5 / 7"
    >
      <div class="d-flex flex-column align-center justify-center">
        <div class="rh-title">Scav.Air Press</div>
        <div class="rh-value" :style="thresholdColor.scavairpress">
          {{ selectedEngineData.scavAirPress }} <span class="unit">bar</span>
        </div>
      </div>
      <div class="d-flex flex-column align-center justify-center">
        <div class="rh-title">Scav.Air Temp</div>
        <div class="rh-value" :style="thresholdColor.scavairtemp">
          {{ selectedEngineData.scavAirTemp }} <span class="unit">℃</span>
        </div>
      </div>
      <div class="d-flex flex-column align-center justify-center">
        <div class="rh-title">L.O Inlet Press</div>
        <div class="rh-value" :style="thresholdColor.loinletpress">
          {{ selectedEngineData.loInletPress }} <span class="unit">bar</span>
        </div>
      </div>
      <div class="d-flex flex-column align-center justify-center">
        <div class="rh-title">L.O Inlet Temp</div>
        <div class="rh-value" :style="thresholdColor.loinlettemp">
          {{ selectedEngineData.loInletTemp }} <span class="unit">℃</span>
        </div>
      </div>
    </v-sheet>

    <v-sheet
      class="h-100 rounded-lg ga-4 pa-6"
      style="display: grid; grid-template-columns: 1fr 1fr; grid-column: 7 / 9"
      color="#333334"
    >
      <div class="d-flex flex-column justify-center align-center">
        <div class="rh-title">F.G Mass Flow</div>
        <div class="rh-value" :style="thresholdColor.fgmassflow">
          {{ selectedEngineData.fgMassFlow }} <span class="unit">kg/h</span>
        </div>
      </div>
      <div class="d-flex flex-column justify-center align-center">
        <div class="rh-title">F.O Inlet Press</div>
        <div class="rh-value" :style="thresholdColor.foinletpress">
          {{ selectedEngineData.foInletPress }} <span class="unit">bar</span>
        </div>
      </div>
      <div class="d-flex flex-column justify-center align-center">
        <div class="rh-title">F.O Inlet Temp</div>
        <div class="rh-value" :style="thresholdColor.foinlettemp">
          {{ selectedEngineData.foInletTemp }} <span class="unit">℃</span>
        </div>
      </div>
      <div class="d-flex flex-column justify-center align-center">
        <div class="rh-title">F.O Inlet Viscosity</div>
        <div class="rh-value" :style="thresholdColor.foinletviscosity">
          {{ selectedEngineData.foInletVelocity }} <span class="unit">Cst</span>
        </div>
      </div>
    </v-sheet>

    <v-sheet class="rounded-lg" style="grid-column: 1 / 3; grid-row: 2 / 3" color="#333334">
      <EChart :option="turboChargerChartOption" autoresize />
    </v-sheet>
    <v-sheet class="rounded-lg" style="grid-column: 3 / 9; grid-row: 2 / 3" color="#333334">
      <EChart :option="cylinderChartOption" autoresize
    /></v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted,watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { getAlertThreshold } from '@/api/alarmApi'
import { getMonitoring } from '@/api/dataApi'
import { convertFloatFormatObject, openNewPopup, displayOnlySuperAdmin} from '@/composables/util'
import { useToast } from '@/composables/useToast'
import EChart from '@/components/echart/Echarts.vue'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const loadingStore = useLoadingStore()
const { refreshDataTime } = storeToRefs(loadingStore)

const { showResMsg } = useToast()
let selectedFix = null

let engineKeys = ref(['ME1', 'ME2', 'ME3', 'ME4', 'GE1', 'GE2', 'GE3', 'GE4'])

let selectedEngineName = ref(null)

let engineDataMap = ref(null)

let selectedEngineData = ref({
  runningHours: 0,
  power: 0,
  powerPercent: 0,
  load: 0,
  speed: 0,
  scavAirPress: 0,
  scavAirTemp: 0,
  loInletPress: 0,
  loInletTemp: 0,
  fgMassFlow: 0,
  foInletPress: 0,
  foInletTemp: 0,
  foInletVelocity: 0,
  turboChargerDataList: [],
  cylinderDataList: []
})
const displayByRole = computed(() => {
  const result = displayOnlySuperAdmin()
  return result
})

const changeDisplayEngine = async () => {
  if (!Object.is(engineDataMap, null)) {
    selectedEngineData.value = engineDataMap.value[selectedEngineName.value]

    powerBarOption.value.series[0].data[0] = selectedEngineData.value.powerPercent

    rpmGuageChartOption.value.series[0].data[0].value = selectedEngineData.value.speed
    rpmGuageChartOption.value.series[0].data[1].value = selectedEngineData.value.load

    turboChargerChartOption.value.yAxis[0].data = []
    cylinderChartOption.value.xAxis[0].data = []

    for (let count = 0; count < turboChargerChartOption.value.series.length; ++count) {
      turboChargerChartOption.value.series[count].data = []
    }

    for (let count = 0; count < turboChargerChartOption.value.series.length; ++count) {
      cylinderChartOption.value.series[count].data = []
    }

    for (let count = 0; count < selectedEngineData.value.turboChargerDataList.length; ++count) {
      let order = count + 1
      turboChargerChartOption.value.yAxis[0].data.push('TC' + order)
    }

    for (let count = 0; count < selectedEngineData.value.cylinderDataList.length; ++count) {
      let order = count + 1
      cylinderChartOption.value.xAxis[0].data.push('CYL' + order)
    }

    for (let count = 0; count < selectedEngineData.value.turboChargerDataList.length; ++count) {
      turboChargerChartOption.value.series[0].data[count] =
        selectedEngineData.value.turboChargerDataList[count].speed
      turboChargerChartOption.value.series[1].data[count] =
        selectedEngineData.value.turboChargerDataList[count].exhGasInletTemp
      turboChargerChartOption.value.series[2].data[count] =
        selectedEngineData.value.turboChargerDataList[count].exhGasOutletTemp
      turboChargerChartOption.value.series[3].data[count] =
        selectedEngineData.value.turboChargerDataList[count].exhGasTempDiff
      turboChargerChartOption.value.series[4].data[count] =
        selectedEngineData.value.turboChargerDataList[count].pressAirClrOutlet
    }

    for (let count = 0; count < selectedEngineData.value.cylinderDataList.length; ++count) {
      cylinderChartOption.value.series[0].data[count] =
        selectedEngineData.value.cylinderDataList[count].exhGasTemp
      cylinderChartOption.value.series[1].data[count] =
        selectedEngineData.value.cylinderDataList[count].pcoTemp
      cylinderChartOption.value.series[2].data[count] =
        selectedEngineData.value.cylinderDataList[count].jcwOutTemp
      cylinderChartOption.value.series[3].data[count] =
        selectedEngineData.value.cylinderDataList[count].pmax
      cylinderChartOption.value.series[4].data[count] =
        selectedEngineData.value.cylinderDataList[count].pcomp
      cylinderChartOption.value.series[5].data[count] =
        selectedEngineData.value.cylinderDataList[count].deltaP
      cylinderChartOption.value.series[6].data[count] =
        selectedEngineData.value.cylinderDataList[count].pi
    }
  }
}

const clearChart = async () => {
  selectedEngineData.value = null

  turboChargerChartOption.value.yAxis[0].data = []
  cylinderChartOption.value.xAxis[0].data = []

  rpmGuageChartOption.value.series[0].data[0].value = 0
  rpmGuageChartOption.value.series[0].data[1].value = 0

  for (let count = 0; count < turboChargerChartOption.value.series.length; ++count) {
    turboChargerChartOption.value.series[count].data = []
  }

  for (let count = 0; count < turboChargerChartOption.value.series.length; ++count) {
    cylinderChartOption.value.series[count].data = []
  }
}

let thresholdKey = [
  'scavairpress',
  'scavairtemp',
  'loinletpress',
  'loinlettemp',
  'fgmassflow',
  'foinletpress',
  'foinlettemp',
  'foinletvelocity'
]
let thresholdColor = ref({
  scavairpress: '',
  scavairtemp: '',
  loinletpress: '',
  loinlettemp: '',
  fgmassflow: '',
  foinletpress: '',
  foinlettemp: '',
  foinletvelocity: ''
})
const fetchAlertThreshold = async () => {
  let imoNumber = curSelectedShip.value.imoNumber
  if (!imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }

  const {
    status,
    data: { data }
  } = await getAlertThreshold(imoNumber)

  if (parseInt(status / 100) == 2) {
    //임계값의 Description속성의 값을 key값으로 활용
    //console.log(JSON.stringify(data))
    const modifyThresholdDescriptionToKey = (data) => {
      const textsToRemove = ['me1', 'me2', 'me3', 'me4', 'ge1', 'ge2', 'ge3', 'ge4']

      return data.map((item) => {
        let modifiedDescription = item.description.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        if (modifiedDescription.includes('viscosity')) {
          modifiedDescription = modifiedDescription.replace('viscosity', 'velocity')
        }
        textsToRemove.forEach((text) => {
          if (modifiedDescription.includes(text)) {
            modifiedDescription = modifiedDescription.replace(text, '')
          }
        })
        return { ...item, description: modifiedDescription }
      })
    }
    const modifiedThresholdData = modifyThresholdDescriptionToKey(data)

    //임계값중 화면에 필요하고 선택한 엔진에 맞는 데이터 8개만 추출
    //console.log(modifyDescription(data))
    const filteredThresholdData = modifiedThresholdData
      .filter((item) => thresholdKey.includes(item.description))
      .filter((item) => item.equipNo === selectedEngineName.value)
    //console.log(filteredData)
    //console.log(selectedEngineName.value)
    //console.log(engineDataMap.value[selectedEngineName.value])

    //모니터링값의 속성을 key값으로 활용, 소문자로 변경
    const modifyEngineDataToKey = (obj) => {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key]
        return acc
      }, {})
    }
    //모니터링값중 선택한 엔진에 맞는 데이터만 추출
    const modifiedEngineData = modifyEngineDataToKey(engineDataMap.value[selectedEngineName.value])
    //console.log(modifiedEngineData);

    //모니터링값과 임계값 둘다 thresholdKey 키값을 공통으로 사용
    //임계값.low, 임계값.high, 모니터링값을 비교
    //true : 주의,경보상태
    //false : 보통상태
    const comparisonResults = thresholdKey.map((key) => {
      const dataItem = filteredThresholdData.find((item) => item.description === key)
      if (dataItem && dataItem.use) {
        if (
          parseFloat(modifiedEngineData[key]) < parseFloat(dataItem.lowCaution) ||
          parseFloat(modifiedEngineData[key]) > parseFloat(dataItem.highCaution)
        ) {
          return {
            key: key,
            result: true
          }
        }
      }
      return {
        key: key,
        result: false
      }
    })
    //console.log(comparisonResults);

    //true, false 값에 맞게 텍스트 색 변경하기
    comparisonResults.forEach((result) => {
      thresholdColor.value[result.key] = result.result ? 'color: red' : 'color: #5789fe'
    })
    //console.log(thresholdColor.value);
  }
}

const fetchEngineMonitoringInfo = async () => {

  let imoNumber = curSelectedShip.value.imoNumber
  if (!imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  if (imoNumber) {
    const response = await getMonitoring(imoNumber)

    if (response.status == 200) {
      let {
        data: { data }
      } = response
      let result = convertFloatFormatObject(data)
      engineKeys.value = Object.keys(data)
      engineDataMap.value = result
      if(selectedFix == null) {
        selectedEngineName.value = engineKeys.value[0]
      }else{
        selectedEngineName.value = selectedFix
      }
      changeDisplayEngine()
    }
  } else {
    clearChart()
  }
}

const openEngineRealTimePopup = () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  if (!curSelectedImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  openNewPopup(`/popup/monitoring/engine?imoNumber=${curSelectedImoNumber}`)
}

const reloadData = () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let result = dateTime.isBefore(refreshDataTime.value)

  if (result) {
    fetchEngineMonitoringInfo()
  }
}

function changeSelectedEngineName(){
  selectedFix = selectedEngineName.value;
}

watch(curSelectedShip, fetchEngineMonitoringInfo)// 선박이 변경 되었을 경우 감지
watch(selectedEngineName, changeDisplayEngine)// 엔진이 변경 되었을 경우 감지
watch(refreshDataTime, reloadData)
onMounted(() => {
  fetchEngineMonitoringInfo()
  fetchAlertThreshold()
})
onUnmounted(() => {
  selectedFix = null
})
let powerBarOption = ref({
  grid: {
    top: '12%',
    bottom: '15%',
    left: '20%'
  },
  xAxis: {
    type: 'category',
    data: ['Power (%)'],
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
    max: 100,
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: [
    {
      data: [0],
      type: 'bar',
      label: {
        show: true,
        color: '#FFD700',
        fontSize: '1.25rem',
        formatter: '{c} %',
        fontWeight: 'bold'
      },
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
})

const rpmGuageChartOption = ref({
  grid: {
    top: '0%',
    left: '0%',
    right: '10%',
    bottom: '5%'
  },
  series: [
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      pointer: {
        show: false
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#464646'
        }
      },
      axisLine: {
        lineStyle: {
          width: 20
        }
      },
      splitLine: {
        show: false,
        distance: 0,
        length: 10
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        distance: 50
      },
      data: [
        {
          value: 0,
          name: 'RPM',
          title: {
            offsetCenter: ['0%', '-45%'],
            color: '#5590FF'
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '-15%'],
            formatter: '{value} rpm',
            fontSize: '1.5rem',
            color: '#5590FF'
          }
        },
        {
          value: 0,
          name: 'LOAD',
          title: {
            offsetCenter: ['0%', '15%'],
            color: '#FFCF1B'
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '40%'],
            formatter: '{value} %',
            color: '#FFCF1B'
          }
        }
      ],
      title: {
        fontSize: 14,
        color: '#fff'
      },
      detail: {
        width: 50,
        height: 20,
        fontSize: '1.5rem',
        color: '#fff',
        formatter: '{value}%'
      }
    }
  ]
})

let turboChargerChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    top: '25%',
    right: '10%',
    bottom: '15%'
  },
  legend: {
    data: [
      'Speed',
      'Exh.gas Inlet Temp',
      'Exh.gas Outlet Temp',
      'Exh.gas Temp Diff',
      'Press Air CLR Outlet'
    ],
    left: '2%',
    top: '4%'
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center'
  },
  xAxis: [
    {
      type: 'value',
      splitLine: {
        lineStyle: {
          width: 1,
          type: 'dashed',
          color: '#5C5C5E',
          opacity: 0.5
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: []
    }
  ],
  series: [
    {
      name: 'Speed',
      type: 'bar',
      barGap: 0.1,
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'Exh.gas Inlet Temp',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'Exh.gas Outlet Temp',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'Exh.gas Temp Diff',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'Press Air CLR Outlet',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ]
})

let cylinderChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '5%',
    right: '2%',
    bottom: '15%'
  },
  legend: {
    top: '4%',
    data: [
      'Exh.Gas Temp (℃)',
      'P.C.O Temp (℃)',
      'JCW Out Temp (℃)',
      'Pmax (bar)',
      'Pcomp (bar)',
      '△P (bar)',
      'Pi (bar)'
    ]
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center'
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: [],
      splitLine: {
        lineStyle: {
          width: 1,
          type: 'dashed',
          color: '#5C5C5E',
          opacity: 0.5
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      splitLine: {
        lineStyle: {
          width: 1,
          type: 'dashed',
          color: '#5C5C5E',
          opacity: 0.5
        }
      }
    }
  ],
  series: [
    {
      name: 'Exh.Gas Temp (℃)',
      type: 'bar',
      barGap: 0.1,
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'P.C.O Temp (℃)',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'JCW Out Temp (℃)',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'Pmax (bar)',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'Pcomp (bar)',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: '△P (bar)',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: 'Pi (bar)',
      type: 'bar',
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ]
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
  font-size: 1.3em;
  color: '#bababa';
}

.rh-value {
  font-size: 1.6rem;
  font-weight: bold;
  color: #5789fe;
}

.engine-data-item {
  > div {
    /* flex: 0 1 33.3%; */
    height: calc(100% / 3);
  }
}

.running-hour-container {
  gap: 12px;
}

.runing-hour-item {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #333334;
}

.real-time-container {
  display: grid !important;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: 40% 60%;
  gap: 12px;
  height: 100vh;
  max-height: calc(100vh - 65px - 60px - 62px - 24px - 64px - 24px - 24px);
}

.equipmentSelector {
  width: 10%;
}

.unit {
  color: #bababa;
  font-weight: 100;
  font-size: 1.2rem;
}
</style>
