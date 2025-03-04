<template>
  <v-container style="height: 100vh" fluid>
    <v-row no-gutters class="h-100">
      <v-col cols="4" lg="4" class="d-flex flex-column h-100">
        <v-sheet
          class="d-flex justify-space-between align-center rounded-lg px-4"
          height="60"
          color="#333334"
        >
          <div style="font-size: 1.3rem">GPS</div>
          <div class="d-flex ga-4">
            <div class="ship-latitude">{{ gpsInfo.gpsLatitude }}</div>
            <div class="ship-longitude">{{ gpsInfo.gpsLongitute }}</div>
          </div>
        </v-sheet>
        <!-- DRAFT / LIST -->
        <v-sheet class="d-flex flex-column flex-grow-1 ga-4" color="#000000">
          <v-card class="mt-4 rounded-lg d-flex flex-column" style="flex: 4" color="#333334">
            <v-card-title>DRAFT/LIST</v-card-title>
            <v-card-text class="d-flex justify-center flex-grow-1 ga-8">
              <div class="d-flex flex-column align-center w-100">
                <div class="content-title">DRAFT</div>
                <div>
                  <v-img :src="draft" width="230" height="230"></v-img>
                </div>
                <v-sheet
                  class="d-flex justify-space-around mt-4 flex-grow-1 align-center w-100"
                  color="#030914"
                >
                  <div class="text-center">
                    <div class="lcc-default-font text-secondary mb-2">AFT</div>
                    <div class="lcc-default-font text-primary">
                      {{ draftListInfo.draftAft }}
                      <span class="text-secondary lcc-sub-font">M</span>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="lcc-default-font text-secondary mb-2">FWD</div>
                    <div class="lcc-default-font text-primary">
                      {{ draftListInfo.draftFwd }}
                      <span class="text-secondary lcc-sub-font">M</span>
                    </div>
                  </div>
                </v-sheet>
              </div>
              <div class="d-flex flex-column align-center">
                <div class="content-title">LIST</div>
                <div>
                  <v-img :src="list" width="230" height="230"></v-img>
                </div>
                <v-sheet
                  class="d-flex justify-space-around mt-4 flex-grow-1 align-center w-100"
                  color="#030914"
                >
                  <div class="lcc-default-font text-primary">
                    {{ draftListInfo.list }}
                    <span class="text-secondary lcc-sub-font">°</span>
                  </div>
                </v-sheet>
              </div>
            </v-card-text>
          </v-card>

          <!-- ENGINE -->
          <v-card class="rounded-lg d-flex flex-column" style="flex: 3" color="#333334">
            <v-card-title>ENGINE</v-card-title>
            <v-card-text class="d-flex ga-2">
              <div class="d-flex flex-column align-center w-50">
                <div class="content-title mb-6">Main Engine</div>
                <div class="w-100" style="flex-grow: 2">
                  <EChart :option="mainEngineChartOption" :style="mainEngineChartOption.style" />
                </div>
                <v-sheet
                  class="d-flex flex-column justify-center align-center flex-grow-1 ga-4 w-100"
                  color="#030914"
                >
                  <div class="lcc-default-font text-primary">
                    {{ engineInfo.mainEngineRpm }}
                    <span class="lcc-default-font text-secondary">RPM</span>
                  </div>

                  <div class="lcc-default-font text-primary">
                    {{ engineInfo.mainEngineLoad }}%
                    <span class="lcc-default-font text-secondary">LOAD</span>
                  </div>
                </v-sheet>
              </div>
              <div class="d-flex flex-column align-center w-50">
                <div class="content-title mb-6">Generator Engine</div>
                <div class="w-100" style="flex-grow: 2">
                  <EChart :option="generatorEngineChartOption" autoresize />
                </div>

                <v-sheet
                  class="d-flex flex-column justify-center align-center flex-grow-1 ga-4 w-100 lcc-default-font"
                  color="#030914"
                >
                  <div class="d-flex align-center ga-2">
                    <div class="lcc-default-font text-primary">
                      {{ engineInfo.generatorEngineRpm }}
                    </div>
                    <div class="text-secondary">RPM</div>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <div class="lcc-default-font text-primary">
                      {{ engineInfo.generatorEngineLoad }}%
                    </div>
                    <div class="text-secondary">LOAD</div>
                  </div>
                </v-sheet>
              </div>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-col>
      <v-col cols="8" lg="8" class="px-4 overflow-hidden h-100">
        <v-sheet class="d-inline-flex justify-space-between w-25">
          <template v-for="item in tabList" :key="item.id">
            <v-btn
              class="tab-button lcc-default-font"
              :class="tab == item.id ? 'tab-active' : 'tab-inactive'"
              @click="tab = item.id"
            >
              {{ item.text }}
            </v-btn>
          </template>
        </v-sheet>
        <v-window v-model="tab" class="shiptype-tab-container">
          <template v-for="item in tabList" :key="item.id">
            <v-window-item :value="item.id" class="h-100">
              <div class="h-100" style="position: relative">
                <EquipmentCanvas
                  v-if="updateKey"
                  :key="item.id"
                  :updateKey="updateKey"
                  :imageUrl="item.image"
                  :list="equipmentList"
                />
              </div>
            </v-window-item>
          </template>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'

import { getDashboardShipinfo } from '@/api/shipApi'
import { openNewPopup } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'
import { useLoadingStore } from '@/stores/loadingStore'

import { v4 } from 'uuid'

import EquipmentCanvas from '@/components/dashboard/EquipmentCanvas.vue'
import EChart from '@/components/echart/Echarts.vue'

import draft from '/images/dashboard/icon/draft.png'
import list from '/images/dashboard/icon/list.png'

import bulkIso from '/images/dashboard/shiptype/bulk/bulk_iso.png'
import bulkSide from '/images/dashboard/shiptype/bulk/bulk_side.png'
import bulkRear from '/images/dashboard/shiptype/bulk/bulk_rear.png'

import containerIso from '/images/dashboard/shiptype/container/container_iso.png'
import containerRear from '/images/dashboard/shiptype/container/container_rear.png'
import containerSide from '/images/dashboard/shiptype/container/container_side.png'

import lngIso from '/images/dashboard/shiptype/lng/lng_iso.png'
import lngSide from '/images/dashboard/shiptype/lng/lng_side.png'
import lngRear from '/images/dashboard/shiptype/lng/lng_rear.png'

import engineIcon from '/images/dashboard/icon/engine-blue-icon.png'
import voyageIcon from '/images/dashboard/icon/voyage-blue-icon.png'
import propellerIcon from '/images/dashboard/icon/propeller-blue-icon.png'
import fuelIcon from '/images/dashboard/icon/fuel-blue-icon.png'
import moment from 'moment'

const shipStore = useShipStore()
const { curSelectedShip, usedFuels } = storeToRefs(shipStore)

const { showResMsg } = useToast()

const loadingStore = useLoadingStore()
const { refreshDataTime } = storeToRefs(loadingStore)

let uuid = null
let eventSource = ''
const selectedImoNumber = ref('')

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

onMounted(() => {
  let url = new URLSearchParams(location.search)
  let imoNumber = url.get('imoNumber')
  selectedImoNumber.value = imoNumber
  fetchDashboardShipInfo()
})

onUnmounted(() => {
  eventSource.close()
})

const curSelectedShipImoNumber = ref()
const recieveImoNumber = (e) => {
  console.log('구독 이벤트')
  console.dir(e)
  const result = JSON.parse(e.data)

  if (result.sseReturnCode == 'CHANGED_SHIP') {
    console.log('선박 변경')
    console.dir(e)
    console.log(e.msg)
    selectedImoNumber.value = result.msg
    if (result.msg) {
      selectedImoNumber.value = result.msg
      fetchDashboardShipInfo(curSelectedShipImoNumber)
    }
  } else if (result.sseReturnCode == 'REFRESH_DATA_TIME') {
    reloadData()
  }
}

const tab = ref('iso')
const tabList = computed(() => {
  const type = updateKey.value
  const list = [
    { id: 'iso', text: 'ISO' },
    { id: 'side', text: 'SIDE' },
    { id: 'rear', text: 'REAR' }
  ]
  const imageSet = () => {
    switch (type) {
      case 'LNG':
        return {
          iso: lngIso,
          side: lngSide,
          rear: lngRear
        }
      case 'BULK':
        return {
          iso: bulkIso,
          side: bulkSide,
          rear: bulkRear
        }

      case 'CONTAINER':
        return {
          iso: containerIso,
          side: containerSide,
          rear: containerRear
        }
    }
  }
  const shipImage = imageSet()
  return list.map((el) => ({
    ...el,
    image: shipImage ? shipImage[el.id] : null
  }))
})
const equipmentList = computed(() => {
  const list = [
    { id: 'voyage', image: voyageIcon, listTitle: 'Voyage Status', list: voyageStatus.value || [] },
    { id: 'fuel', image: fuelIcon, listTitle: 'Fuel Remaining', list: fuelsStatus.value || [] },
    { id: 'engine', image: engineIcon, listTitle: 'Engine Status', list: engineStatus.value || [] },
    {
      id: 'propeller',
      image: propellerIcon,
      listTitle: 'Propeller Status',
      list: propellersStatus.value || []
    }
  ]
  const type = updateKey.value
  const position = () => {
    if (type == 'LNG') {
      switch (tab.value) {
        case 'iso':
          return {
            voyage: { image: [63, 31], list: [-20, 0], align: 'left' },
            fuel: { image: [57, 57], list: [0, 8], align: 'bottom' },
            engine: { image: [73, 46], list: [-8, -17], align: 'right' },
            propeller: { image: [87, 35], list: [0, -5], align: 'top' }
          }
        case 'side':
          return {
            voyage: { image: [70, 46], list: [-20, -8], align: 'top' },
            fuel: { image: [55, 57], list: [30, -10], align: 'top' },
            engine: { image: [75, 57], list: [40, -3], align: 'bottom' },
            propeller: { image: [95, 62], list: [0, 5], align: 'bottom' }
          }
        case 'rear':
          return {
            voyage: { image: [64, 25], list: [-15, 0], align: 'left' },
            fuel: { image: [83, 45], list: [-15, 28], align: 'right' },
            engine: { image: [65, 61], list: [6, -3], align: 'right' },
            propeller: { image: [27, 82], list: [-25, -10], align: 'bottom' }
          }
      }
    } else if (type == 'BULK') {
      switch (tab.value) {
        case 'iso':
          return {
            voyage: { image: [80, 25], list: [-10, 0], align: 'left' },
            fuel: { image: [56, 60], list: [0, 10], align: 'bottom' },
            engine: { image: [75, 47], list: [-45, 0], align: 'left' },
            propeller: { image: [90, 35], list: [-20, -25], align: 'right' }
          }
        case 'side':
          return {
            voyage: { image: [85, 48], list: [0, -6], align: 'top' },
            fuel: { image: [40, 55], list: [20, -10], align: 'top' },
            engine: { image: [70, 55], list: [30, 0], align: 'bottom' },
            propeller: { image: [91, 60], list: [0, 0], align: 'bottom' }
          }
        case 'rear':
          return {
            voyage: { image: [42, 30], list: [-15, 0], align: 'left' },
            fuel: { image: [73, 48], list: [-15, 30], align: 'right' },
            engine: { image: [53, 63], list: [8, 5], align: 'right' },
            propeller: { image: [25, 75], list: [0, -10], align: 'right' }
          }
      }
    } else if (type == 'CONTAINER') {
      switch (tab.value) {
        case 'iso':
          return {
            voyage: { image: [55, 40], list: [-25, 0], align: 'left' },
            fuel: { image: [45, 65], list: [0, 0], align: 'bottom' },
            engine: { image: [80, 40], list: [0, -10], align: 'top' },
            propeller: { image: [93, 33], list: [0, 15], align: 'bottom' }
          }
        case 'side':
          return {
            voyage: { image: [57, 48], list: [20, -6], align: 'top' },
            fuel: { image: [45, 55], list: [24, -13], align: 'left' },
            engine: { image: [80, 55], list: [0, 0], align: 'bottom' },
            propeller: { image: [97, 55], list: [0, -10], align: 'top' }
          }
        case 'rear':
          return {
            voyage: { image: [75, 25], list: [18, 3], align: 'top' },
            fuel: { image: [78, 43], list: [0, 0], align: 'right' },
            engine: { image: [55, 61], list: [-25, 0], align: 'left' },
            propeller: { image: [28, 80], list: [25, 5], align: 'right' }
          }
      }
    }
  }
  return list.map((el) => {
    const coord = position()
    return {
      ...el,
      position: type ? coord[el.id]?.image : [],
      listPosition: type ? coord[el.id]?.list : [],
      listAlign: type ? coord[el.id]?.align : 'left'
    }
  })
})

const mainEngineChartOption = ref({
  series: [
    {
      type: 'gauge',
      center: ['50%', '90%'],
      radius: '180%',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 240,
      splitNumber: 4,
      itemStyle: {
        color: '#5789FE',
        shadowColor: 'rgba(0,138,255,0.45)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      progress: {
        show: true,
        //roundCap: true,
        width: 18
      },
      pointer: {
        icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
        length: '60%',
        width: 8,
        offsetCenter: [0, '5%']
      },
      axisLine: {
        // roundCap: true,
        lineStyle: {
          width: 18
        }
      },
      axisTick: {
        splitNumber: 2,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        // distance :
        length: 12,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 30,
        color: '#999',
        fontSize: 12
      },
      title: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        {
          value: 0
        }
      ]
    }
  ]
})

const generatorEngineChartOption = ref({
  series: [
    {
      type: 'gauge',
      center: ['50%', '90%'],
      radius: '180%',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 240,
      splitNumber: 4,
      itemStyle: {
        color: '#5789FE',
        shadowColor: 'rgba(0,138,255,0.45)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      progress: {
        show: true,
        // roundCap: true,
        width: 18
      },
      pointer: {
        icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
        length: '60%',
        width: 8,
        offsetCenter: [0, '5%']
      },
      axisLine: {
        // roundCap: true,
        lineStyle: {
          width: 18
        }
      },
      axisTick: {
        splitNumber: 2,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        // distance :
        length: 12,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 30,
        color: '#999',
        fontSize: 12
      },
      title: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        {
          value: 0
        }
      ]
    }
  ]
})
const curShipType = ref(false)
const updateKey = computed(() => curShipType.value)

const openShipDashboardPopup = () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber

  if (!curSelectedImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  openNewPopup(`/popup/monitoring/ship?imoNumber=${curSelectedImoNumber}`)
}

const gpsInfo = ref({
  gpsLatitude: '-',
  gpsLongitute: '-'
})

const draftListInfo = ref({
  draftAft: '-',
  draftFwd: '-',
  list: '-'
})

const engineInfo = ref({
  mainEngineRpm: '-',
  mainEngineLoad: '-',
  generatorEngineRpm: '-',
  generatorEngineLoad: '-'
})

const voyageStatus = ref([
  { key: 'Course', value: '-', unit: '°' },
  { key: 'Speed', value: '-', unit: 'kn' },
  { key: 'SOG', value: '-', unit: 'kn' },
  { key: 'Wind', value: '-', unit: 'm/s' }
])

const engineStatus = ref([
  { key: 'ME Power', value: '-', unit: 'kw' },
  { key: 'ME Load', value: '-', unit: '%' },
  { key: 'GE Power', value: '-', unit: 'kw' },
  { key: 'GE Load', value: '-', unit: '%' }
])

const fuelsStatus = ref([{ key: '', value: '' }])

const propellersStatus = ref([])

const fetchDashboardShipInfo = async () => {
  let imoNumber = selectedImoNumber.value

  if (!imoNumber) {
    return
  }
  console.log('대시보드 데이터 조회')
  await shipStore.fetchShipMachineInfo(imoNumber)
  await shipStore.fetchUsedFuels()
  const {
    data: { data }
  } = await getDashboardShipinfo(imoNumber)

  console.log('선박 타입')
  console.log(curShipType.value)

  curShipType.value = data.dashboardDisplayType || false
  if (data && !Array.isArray(data)) {
    /**
     * GPS
     */
    gpsInfo.value = {
      gpsLatitude: data.gpsLatitude,
      gpsLongitute: data.gpsLongitude
    }
    /**
     * DRAFT/LIST
     */
    draftListInfo.value = {
      draftAft: data.draftAft.toFixed(1),
      draftFwd: data.draftFwd.toFixed(1),
      list: data.list.toFixed(1)
    }
    /**
     * ENGINE
     */

    if (data.mainEngineRpm != 'NaN') {
      engineInfo.value.mainEngineRpm = data.mainEngineRpm.toFixed(1)
      mainEngineChartOption.value.series[0].data[0].value = parseFloat(
        data.mainEngineRpm.toFixed(1)
      )
    } else {
      engineInfo.value.mainEngineRpm = '-'
      mainEngineChartOption.value.series[0].data[0].value = 0
    }

    if (data.mainEngineLoad != 'NaN') {
      engineInfo.value.mainEngineLoad = data.mainEngineLoad.toFixed(1)
    } else {
      engineInfo.value.mainEngineLoad = '-'
    }

    if (data.mainEngineMaxRpm != 'NaN') {
      mainEngineChartOption.value.series[0].max = parseFloat(data.mainEngineMaxRpm.toFixed(1))
    }

    if (data.generatorEngineRpm != 'NaN') {
      engineInfo.value.generatorEngineRpm = data.generatorEngineRpm.toFixed(1)
      generatorEngineChartOption.value.series[0].data[0].value = parseFloat(
        data.generatorEngineRpm.toFixed(1)
      )
    } else {
      engineInfo.value.generatorEngineRpm = '-'
      generatorEngineChartOption.value.series[0].data[0].value = 0
    }

    if (data.generatorEngineLoad != 'NaN') {
      engineInfo.value.generatorEngineLoad = data.generatorEngineLoad.toFixed(1)
    } else {
      engineInfo.value.generatorEngineLoad = ''
    }

    if (data.generatorEngineMaxRpm != 'NaN') {
      generatorEngineChartOption.value.series[0].max = parseFloat(
        data.generatorEngineMaxRpm.toFixed(1)
      )
    }
    /**
     * Engine Status
     */
    for (const obj of engineStatus.value) {
      if (isNaN(data.engineStatusMap[obj.key])) {
        obj.value = '-'
      } else {
        obj.value = data.engineStatusMap[obj.key].toFixed(1)
      }
    }
    /**
     * Voyage Status
     */
    for (const obj of voyageStatus.value) {
      obj.value = data.voyageStatusMap[obj.key].toFixed(1)
    }
    let propellerStatusList = Object.keys(data.propellerStatusMap).map((el) => {
      const { first, second } = data.propellerStatusMap[el]
      return {
        propellerName: el,
        power: first.toFixed(1),
        rpm: second.toFixed(1)
      }
    })
    propellersStatus.value =
      propellerStatusList.map((el) => ({
        key: el.propellerName,
        power: el.power,
        rpm: el.rpm
      })) || []

    const result = usedFuels.value.map((el) => {
      let curFuleName = el
      if (el == 'LPGP') {
        curFuleName = 'LPG(P)'
        el = 'LPG_P'
      }

      if (el == 'LPGB') {
        curFuleName = 'LPG(B)'
        el = 'LPG_B'
      }

      return {
        fuleName: curFuleName,
        value: parseFloat(data.fuelRemainingMap[el]).toFixed(1)
      }
    })

    // fuelsStatus.value = result
    fuelsStatus.value = result.map((el) => ({
      key: el.fuleName,
      value: el.value,
      unit: 'ton'
    }))
  }
}

const reloadData = () => {
  // const today = moment()
  // let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  // let dateTime = moment(loadingDateTime)
  // let result = dateTime.isBefore(refreshDataTime.value)

  // if (result) {
  fetchDashboardShipInfo()
  // }
}

watch(curSelectedShip, fetchDashboardShipInfo)
watch(refreshDataTime, reloadData)
</script>

<style lang="scss" scoped>
.ship-latitude {
  position: relative;
}

.ship-latitude,
.ship-longitude {
  font-size: 1.35rem;
  color: #5789fe;
}

.ship-latitude::after {
  content: '';
  display: block;
  position: absolute;
  top: 0px;
  right: -7%;
  background-color: #49494e;
  width: 1px;
  height: 32px;
}

.tab-button.v-btn--size-default {
  width: 160px;
  height: 50px;
}

.v-window.v-theme--customBlackTheme.shiptype-tab-container {
  overflow: visible;
}
.shiptype-tab-container {
  height: calc(100vh - 65px - 50px - 24px - 12px);

  .v-window__container {
    height: 100%;
  }
}

.voyage-icon {
  position: absolute;
  top: 22%;
  right: 34%;
}

.voyage-desc {
  position: absolute;
  top: 16%;
  left: 5%;
  min-width: 320px;
  overflow: visible;
}

.voyage-desc::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 61%;
  display: inline-block;
  width: 78%;
  height: 3px;
  background-color: #5789fe;
  z-index: -1;
  transform: translate(50%, 0);
}

.fuel-icon {
  position: absolute;
  bottom: 44%;
  right: 37%;
}

.fuel-desc {
  position: absolute;
  bottom: 12%;
  left: 45%;
  min-width: 320px;
  overflow: visible;
}

.fuel-desc::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 49%;
  display: inline-block;
  width: 1px;
  height: 14vh;
  border-left: 3px solid #5789fe;
  border-bottom: 3px solid #5789fe;
  z-index: -1;
}

.engine-icon {
  position: absolute;
  bottom: 57%;
  right: 22%;
}

.engine-desc {
  position: absolute;
  bottom: 30%;
  right: 0%;
  min-width: 320px;
  overflow: visible;
}

.engine-desc::after {
  content: '';
  width: 6.4vh;
  height: 8.6vh;
  display: inline-block;
  position: absolute;
  top: -50%;
  right: 50%;
  z-index: -1;
  border-top: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
  transform: translate(2%);
}

.propeller-icon {
  position: absolute;
  top: 20%;
  right: 13%;
}

.propeller-desc {
  position: absolute;
  top: -5%;
  right: 5%;
  min-width: 320px;
  z-index: 9999;
  overflow: visible;
}

.propeller-desc::after {
  content: '';
  // width: 20%;
  height: 64%;
  display: inline-block;
  position: absolute;
  top: 100%;
  right: 33%;
  z-index: -1;
  // border-bottom: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
}

.side-voyage-icon {
  position: absolute;
  top: 41%;
  right: 28%;
}

.side-voyage-desc {
  position: absolute;
  top: 3%;
  right: 17%;
  min-width: 320px;
  overflow: visible;
}

.side-voyage-desc::after {
  content: '';
  width: 1px;
  height: 15vh;
  display: inline-block;
  position: absolute;
  // top: 100%;
  left: 50%;
  z-index: -1;
  border-bottom: 3px solid #5789fe;
  border-left: 3px solid #5789fe;
}

.side-fuel-icon {
  position: absolute;
  bottom: 40%;
  right: 58%;
}

.side-fuel-desc {
  position: absolute;
  top: 2%;
  left: 4%;
  min-width: 320px;
  overflow: visible;
}

.side-fuel-desc::after {
  content: '';
  width: 5vh;
  height: 36vh;
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 100%;
  z-index: -1;
  border-top: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
}

.side-engine-icon {
  position: absolute;
  bottom: 40%;
  left: 55%;
}

.side-engine-desc {
  position: absolute;
  bottom: 10%;
  left: 19%;
  min-width: 320px;
  overflow: visible;
}

.side-engine-desc::after {
  content: '';
  width: 5.7vw;
  height: 16.5vh;
  display: inline-block;
  position: absolute;
  bottom: 47%;
  left: 100%;
  z-index: -1;
  border-bottom: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
}

.side-propeller-icon {
  position: absolute;
  bottom: 35%;
  right: 8%;
}

.side-propeller-desc {
  position: absolute;
  bottom: 15.5%;
  right: 0%;
  min-width: 320px;
  z-index: 9999;
  overflow: visible;
}

.side-propeller-desc::after {
  content: '';
  width: 1px;
  height: 3vh;
  display: inline-block;
  position: absolute;
  bottom: 100%;
  left: 67%;
  z-index: -1;
  border-top: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
}

/*
* Rear 아이콘, 설명 관련 CSS
*/
.rear-container {
  .rear-ais-icon {
    position: absolute;
    top: 35%;
    right: 40%;
  }

  .rear-voyage-desc {
    position: absolute;
    top: 29%;
    right: 70%;
    min-width: 320px;
    overflow: visible;
  }

  .rear-voyage-desc::after {
    content: '';
    width: 22vh;
    height: 3px;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 100%;
    z-index: -1;
    background: #5789fe;
  }

  .rear-fuel-icon {
    position: absolute;
    bottom: 50%;
    right: 22%;
  }

  .rear-fuel-desc {
    position: absolute;
    top: -5%;
    right: 0%;
    min-width: 320px;
    overflow: visible;
  }

  .rear-fuel-desc::after {
    content: '';
    width: 7.9vh;
    height: 31vh;
    display: inline-block;
    position: absolute;
    top: 100%;
    right: 45%;
    z-index: -1;
    border-bottom: 3px solid #5789fe;
    border-right: 3px solid #5789fe;
  }

  .rear-engine-icon {
    position: absolute;
    bottom: 34%;
    right: 38%;
  }

  .rear-engine-desc {
    position: absolute;
    bottom: 26%;
    right: 0%;
    min-width: 320px;
    overflow: visible;
  }

  .rear-engine-desc::after {
    content: '';
    width: 7.5vh;
    height: 3px;
    display: inline-block;
    position: absolute;
    top: 43%;
    right: 100%;
    transform: translate(2%);
    z-index: -1;
    background: #5789fe;
  }

  .rear-propeller-icon {
    position: absolute;
    bottom: 15%;
    left: 24%;
  }

  .rear-propeller-desc {
    position: absolute;
    bottom: 0%;
    left: 40%;
    min-width: 320px;
    z-index: 9999;
    overflow: visible;
  }

  .rear-propeller-desc::after {
    content: '';
    width: 12vh;
    height: 5.5vh;
    display: inline-block;
    position: absolute;
    bottom: 50%;
    right: 101%;
    z-index: -1;
    border-bottom: 3px solid #5789fe;
    border-left: 3px solid #5789fe;
    transform: translate(2%);
  }
}

.v-application__wrap .v-window-item .v-card-title {
  height: inherit;
}

.content-title {
  font-size: 1.15rem;
}

.tab-active {
  background: #39393d;
  color: white;
}
.tab-inactive {
  background: #222224;
  color: #ffffff7d;
}
</style>
