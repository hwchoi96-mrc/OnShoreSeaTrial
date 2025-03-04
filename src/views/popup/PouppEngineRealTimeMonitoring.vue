<template>
  <v-sheet class="popup-container w-100" color="#000000">
    <!-- <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-sheet
          class="pa-3 rounded-lg engine-monitoring-pag engine-selector"
          color="#333334"
          :style="{ display: isHovering ? 'block' : 'none' }"
        >
          <i-selectbox
            v-model="selectedEngineName"
            :items="engineKeys"
            item-title="name"
            item-value="id"
            variant="solo-filled"
            density="compact"
            return-object
            class="equipmentSelector"
            bg-color="#434348"
            :hide-details="true"
          ></i-selectbox>
        </v-sheet>
      </template>
    </v-hover> -->
    <!-- <v-sheet
      @mouseenter="showSheet"
      @mouseleave="hideSheet"
      class="pa-3 rounded-lg engine-monitoring-pag engine-selector"
      color="#333334"
    >
      <i-selectbox
        v-model="selectedEngineName"
        :items="engineKeys"
        item-title="name"
        item-value="id"
        variant="solo-filled"
        density="compact"
        return-object
        class="equipmentSelector"
        bg-color="#434348"
        :hide-details="true"
        v-show="isSheetVisible"
      ></i-selectbox>
    </v-sheet> -->
    <div class="engine-selector-container" @mouseover="drawer = true"></div>
    <v-navigation-drawer v-model="drawer" location="top" class="engine-selector h-auto" absolute>
      <v-sheet
        class="pa-3 rounded-lg engine-monitoring-page"
        id="engine-selector"
        color="#333334"
        @mouseleave="drawer = false"
      >
        <i-selectbox
          v-model="selectedEngineName"
          :items="engineKeys"
          item-title="name"
          item-value="id"
          variant="solo-filled"
          density="compact"
          return-object
          class="equipmentSelector"
          bg-color="#434348"
          :hide-details="true"
          @update:modelValue="changeSelectedEngineName"
        ></i-selectbox>
      </v-sheet>
    </v-navigation-drawer>
    <v-sheet class="real-time-container popup" color="#000000">
      <v-sheet
        class="rounded-lg d-flex flex-column ga-3 justify-center align-center"
        color="#333334"
      >
        <div class="text-center">
          <div class="lcc-rh-title">Running Hour</div>
          <div class="lcc-rh-value">
            {{ selectedEngineData.runningHours }} <span class="unit">h</span>
          </div>
        </div>

        <div class="text-center">
          <div class="lcc-rh-title">Power</div>
          <div class="lcc-rh-value">
            {{ selectedEngineData.power }} <span class="unit">kw</span>
          </div>
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
          <div class="lcc-rh-title">Scav.Air Press</div>
          <div class="lcc-rh-value" :style="thresholdColor.scavairpress">
            {{ selectedEngineData.scavAirPress }} <span class="unit">bar</span>
          </div>
        </div>
        <div class="d-flex flex-column align-center justify-center">
          <div class="lcc-rh-title">Scav.Air Temp</div>
          <div class="lcc-rh-value" :style="thresholdColor.scavairtemp">
            {{ selectedEngineData.scavAirTemp }} <span class="unit">℃</span>
          </div>
        </div>
        <div class="d-flex flex-column align-center justify-center">
          <div class="lcc-rh-title">L.O Inlet Press</div>
          <div class="lcc-rh-value" :style="thresholdColor.loinletpress">
            {{ selectedEngineData.loInletPress }} <span class="unit">bar</span>
          </div>
        </div>
        <div class="d-flex flex-column align-center justify-center">
          <div class="lcc-rh-title">L.O Inlet Temp</div>
          <div class="lcc-rh-value" :style="thresholdColor.loinlettemp">
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
          <div class="lcc-rh-title">F.G Mass Flow</div>
          <div class="lcc-rh-value" :style="thresholdColor.fgmassflow">
            {{ selectedEngineData.fgMassFlow }} <span class="unit">kg/h</span>
          </div>
        </div>
        <div class="d-flex flex-column justify-center align-center">
          <div class="lcc-rh-title">F.O Inlet Press</div>
          <div class="lcc-rh-value" :style="thresholdColor.foinletpress">
            {{ selectedEngineData.foInletPress }} <span class="unit">bar</span>
          </div>
        </div>
        <div class="d-flex flex-column justify-center align-center">
          <div class="lcc-rh-title">F.O Inlet Temp</div>
          <div class="lcc-rh-value">
            {{ selectedEngineData.foInletTemp }} <span class="unit">℃</span>
          </div>
        </div>
        <div class="d-flex flex-column justify-center align-center">
          <div class="lcc-rh-title">F.O Inlet Viscosity</div>
          <div class="lcc-rh-value" :style="thresholdColor.foinletviscosity">
            {{ selectedEngineData.foInletVelocity }} <span class="unit">Cst</span>
          </div>
        </div>
      </v-sheet>

      <v-sheet class="rounded-lg" style="grid-column: 1 / 3; grid-row: 2 / 3" color="#333334">
        <EChart :option="turboChargerChartOption" autoresize style="80%" />
      </v-sheet>
      <v-sheet class="rounded-lg" style="grid-column: 3 / 9; grid-row: 2 / 3" color="#333334">
        <EChart :option="cylinderChartOption" autoresize
      /></v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { v4 } from 'uuid'
import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { getAlertThreshold } from '@/api/alarmApi'
import { getMonitoring } from '@/api/dataApi'
import { convertFloatValueFromObject, isStatusOk } from '@/composables/util'
import { cancleSSE } from '@/api/shipApi.js'
import EChart from '@/components/echart/Echarts.vue'
import PopupSelectedShipSummary from '@/components/ship/PopupSelectedShipSummary.vue'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const loadingStore = useLoadingStore()
const { refreshDataTime } = storeToRefs(loadingStore)

let uuid = null
let eventSource = ''
const drawer = ref(false)
const selectedImoNumber = ref('')
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

  const {
    status,
    data: { data }
  } = await getAlertThreshold(imoNumber)

  if (isStatusOk(status)) {
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
  let imoNumber = selectedImoNumber.value

  if (imoNumber) {
    const response = await getMonitoring(imoNumber)

    if (isStatusOk(response.status)) {
      let {
        data: { data }
      } = response
      let result = convertFloatValueFromObject(data)
      engineKeys.value = Object.keys(data)
      engineDataMap.value = result
      if (selectedFix == null) {
        selectedEngineName.value = engineKeys.value[0]
      } else {
        selectedEngineName.value = selectedFix
      }
      changeDisplayEngine()
    }
  } else {
    clearChart()
  }
}

const reloadData = () => {
  // const today = moment()
  // let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  // let dateTime = moment(loadingDateTime)
  // let result = dateTime.isBefore(refreshDataTime.value)

  // if (result) {
  fetchEngineMonitoringInfo()
  // }
}

function changeSelectedEngineName() {
  selectedFix = selectedEngineName.value
}

watch(curSelectedShip, fetchEngineMonitoringInfo) // 선박이 변경 되었을 경우 감지
watch(selectedEngineName, changeDisplayEngine) // 엔진이 변경 되었을 경우 감지
watch(refreshDataTime, reloadData)
onMounted(() => {
  let url = new URLSearchParams(location.search)
  let imoNumber = url.get('imoNumber')
  selectedImoNumber.value = imoNumber
  fetchEngineMonitoringInfo(imoNumber)
  fetchAlertThreshold()
})
onBeforeMount(() => {
  uuid = v4()
  let sseRequestUrl = import.meta.env.VITE_APP_API_URL + `/sse/subscribe?subScribeId=${uuid}`
  eventSource = new EventSource(sseRequestUrl, {
    withCredentials: true
  })
  eventSource.addEventListener('sse', (e) => {
    recieveImoNumber(e)
  })
})
onUnmounted(() => {
  eventSource.close()
  selectedFix = null
})
const recieveImoNumber = (e) => {
  let curSelectedShipImoNumber = null
  const result = JSON.parse(e.data)

  if (result.sseReturnCode == 'CHANGED_SHIP') {
    curSelectedShipImoNumber = result.msg
    if (result.msg) {
      selectedImoNumber.value = result.msg
      fetchEngineMonitoringInfo(curSelectedShipImoNumber)
    }
  } else if (result.sseReturnCode == 'REFRESH_DATA_TIME') {
    reloadData()
  }
}

window.addEventListener('unload', () => {
  cancleSSE(uuid)
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
    bottom: '5%'
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
    bottom: '5%'
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

.lcc-rh-title {
  font-size: 1.6em;
  color: '#bababa';
}

.lcc-rh-value {
  font-size: 3.2rem;
  font-weight: bold;
  color: #5789fe;
  letter-spacing: -3px;
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

.popup-container {
  height: 100vh;
}

.real-time-container.popup {
  display: grid !important;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: 40% 60%;
  gap: 12px;
  height: 100vh;
  max-height: calc(100vh - 12px);
}

.equipmentSelector {
  width: 10%;
}

// .engine-selector {
//   opacity: 0;
//   visibility: none;
//   transition: all 1s ease-in-out;
// }

// .engine-selector:hover {
//   opacity: 1;
//   visibility: visible;
// }

.unit {
  color: #bababa;
  font-weight: 100;
  font-size: 1.2rem;
}

.engine-selector-container {
  width: 100%;
  height: 50px;
  position: absolute;
  z-index: 999;
}
</style>
