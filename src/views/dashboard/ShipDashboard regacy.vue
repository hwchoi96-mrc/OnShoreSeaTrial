<template>
  <v-container style="height: 100vh; max-height: calc(100vh - 65px)" fluid>
    <v-row>
      <v-col cols="4" lg="4" class="d-flex flex-column">
        <v-sheet class="d-flex justify-space-between align-center rounded-lg px-4" height="60">
          <div style="font-size: 1.3rem">GPS</div>
          <div class="d-flex ga-4">
            <div class="ship-latitude">{{ gpsInfo.gpsLatitude }}</div>
            <div class="ship-longitude">{{ gpsInfo.gpsLongitute }}</div>
          </div>
        </v-sheet>
        <!-- DRAFT / LIST -->
        <v-sheet class="d-flex flex-column flex-grow-1 ga-4" color="#000000">
          <v-card class="mt-4 rounded-lg d-flex flex-column" style="flex: 4">
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
                <div class="lcc-default-font text-secondary">LIST</div>
                <div>
                  <v-img :src="list" width="230" height="230"></v-img>
                </div>
                <v-sheet
                  class="d-flex justify-space-around mt-4 flex-grow-1 align-center w-100"
                  color="#030914"
                >
                  <div class="lcc-default-font text-primary">{{ draftListInfo.list }}</div>
                </v-sheet>
              </div>
            </v-card-text>
          </v-card>

          <!-- ENGINE -->
          <v-card class="rounded-lg d-flex flex-column" style="flex: 3">
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
      <v-col cols="8" lg="8" class="pa-4">
        <v-sheet class="d-inline-flex justify-space-between w-25">
          <v-btn
            class="tab-button lcc-default-font"
            @click="tab = 'iso'"
            :class="tab == 'iso' ? 'tab-active' : 'tab-inactive'"
            >ISO</v-btn
          >
          <v-btn
            class="tab-button lcc-default-font"
            @click="tab = 'side'"
            :class="tab == 'side' ? 'tab-active' : 'tab-inactive'"
            >SIDE</v-btn
          >
          <v-btn
            class="tab-button lcc-default-font"
            @click="tab = 'rear'"
            :class="tab == 'rear' ? 'tab-active' : 'tab-inactive'"
            >REAR</v-btn
          >
          <v-btn icon="mdi-fullscreen" @click="openShipDashboardPopup" class="ml-4"></v-btn>
        </v-sheet>
        <v-window v-model="tab" class="shiptype-tab-container">
          <!-- ISO -->
          <v-window-item value="iso" class="h-100">
            <LngIso
              v-if="curShipType == 'LNG'"
              :voyageStatus="voyageStatusList"
              :fuelsStatus="fuelsStatus"
              :engineStatus="engineStatusList"
              :propellerStatus="propellersStatus"
            />
            <BulkIso
              v-if="curShipType == 'BULK'"
              :voyageStatus="voyageStatusList"
              :fuelsStatus="fuelsStatus"
              :engineStatus="engineStatusList"
              :propellerStatus="propellersStatus"
            ></BulkIso>
          </v-window-item>
          <!-- Side -->
          <v-window-item value="side" class="h-100">
            <LngSide
              v-if="curShipType == 'LNG'"
              :voyageStatus="voyageStatusList"
              :fuelsStatus="fuelsStatus"
              :engineStatus="engineStatusList"
              :propellerStatus="propellersStatus"
            />
            <BulkSide
              v-if="curShipType == 'BULK'"
              :voyageStatus="voyageStatusList"
              :fuelsStatus="fuelsStatus"
              :engineStatus="engineStatusList"
              :propellerStatus="propellersStatus"
            />
          </v-window-item>
          <!-- Rear -->
          <v-window-item value="rear" class="h-100">
            <LngRear
              v-if="curShipType == 'LNG'"
              :voyageStatus="voyageStatusList"
              :fuelsStatus="fuelsStatus"
              :engineStatus="engineStatusList"
              :propellerStatus="propellersStatus"
            />
            <BulkRear
              v-if="curShipType == 'BULK'"
              :voyageStatus="voyageStatusList"
              :fuelsStatus="fuelsStatus"
              :engineStatus="engineStatusList"
              :propellerStatus="propellersStatus"
            />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'

import { getDashboardShipinfo } from '@/api/shipApi'
import { openNewPopup } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'

import LngIso from '@/views/dashboard/ship/LngIso.vue'
import LngSide from '@/views/dashboard/ship/LngSide.vue'
import LngRear from '@/views/dashboard/ship/LngRear.vue'

import BulkIso from '@/views/dashboard/ship/BulkIso.vue'
import BulkSide from '@/views/dashboard/ship/BulkSide.vue'
import BulkRear from '@/views/dashboard/ship/BulkRear.vue'

import EquipmentIcon1 from '@/components/dashboard/EquipmentIcon1.vue'
import EquipmentIcon from '@/components/dashboard/EquipmentIcon.vue'
import PropellerIcon from '@/components/dashboard/PropellerIcon.vue'
import EChart from '@/components/echart/Echarts.vue'

import draft from '/images/dashboard/icon/draft.png'
import list from '/images/dashboard/icon/list.png'

import bulkIso from '/images/dashboard/shiptype/bulk/bulk_iso.png'
import bulkRear from '/images/dashboard/shiptype/bulk/bulk_rear.png'
import bulkSide from '/images/dashboard/shiptype/bulk/bulk_side.png'

import containerIso from '/images/dashboard/shiptype/container/container_iso.png'
import containerRear from '/images/dashboard/shiptype/container/container_rear.png'
import containerSide from '/images/dashboard/shiptype/container/container_side.png'

import lngIso from '/images/dashboard/shiptype/lng/lng_iso.png'
import lngRear from '/images/dashboard/shiptype/lng/lng_rear.png'
import lngSide from '/images/dashboard/shiptype/lng/lng_side.png'

import engineIcon from '/images/dashboard/icon/engine-blue-icon.png'
import voyageIcon from '/images/dashboard/icon/voyage-blue-icon.png'
import propellerIcon from '/images/dashboard/icon/propeller-blue-icon.png'
import fuelIcon from '/images/dashboard/icon/fuel-blue-icon.png'

const shipStore = useShipStore()
const { curSelectedShip, shipMachineInfo, usedFuels } = storeToRefs(shipStore)

const tab = ref(null)
const { showResMsg } = useToast()

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
          value: 100
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
          value: 100
        }
      ]
    }
  ]
})
const curShipType = ref('lng')
const getIsoImage = computed(() => {
  let shipType = curShipType.value
  let imageUrl = ''

  switch (shipType) {
    case 'BULK':
      imageUrl = bulkIso
      break
    case 'CONTAINER':
      imageUrl = containerIso
      break
    case 'LNG':
      imageUrl = lngIso
      break
    default:
      imageUrl = bulkIso
      break
  }

  return imageUrl
})

const getSideImage = computed(() => {
  let shipType = curShipType.value
  let imageUrl = ''

  switch (shipType) {
    case 'BULK':
      imageUrl = bulkSide
      break
    case 'CONTAINER':
      imageUrl = containerSide
      break
    case 'LNG':
      imageUrl = lngSide
      break
    default:
      imageUrl = bulkSide
      break
  }

  return imageUrl
})

const getRearImage = computed(() => {
  let shipType = curShipType.value
  let imageUrl = ''

  switch (shipType) {
    case 'BULK':
      imageUrl = bulkRear
      break
    case 'CONTAINER':
      imageUrl = containerRear
      break
    case 'LNG':
      imageUrl = lngRear
      break
    default:
      imageUrl = bulkRear
      break
  }

  return imageUrl
})

const openShipDashboardPopup = () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber

  if (!curSelectedImoNumber) {
    showResMsg('선박명을 클릭해주세요')
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
const voyageStatusList = computed(() => voyageStatus.value)

const engineStatus = ref([
  { key: 'ME Power', value: '-', unit: 'kw' },
  { key: 'ME Load', value: '-', unit: '%' },
  { key: 'GE Power', value: '-', unit: 'kw' },
  { key: 'GE Load', value: '-', unit: '%' }
])
const engineStatusList = computed(() => engineStatus.value)

const fuelsStatus = ref([{ key: '', value: '' }])

const propellersStatus = ref([])

let interval = null
const SECOND_IN_ONE_MINUTE = 1000 * 60
const fetchDashboardShipInfo = async () => {
  let imoNumber = curSelectedShip.value.imoNumber

  if (!imoNumber) {
    return
  }
  console.log('대시보드 데이터 조회')
  await shipStore.fetchShipMachineInfo(imoNumber)
  shipStore.fetchUsedFuels()
  const {
    data: { data }
  } = await getDashboardShipinfo(imoNumber)

  curShipType.value = data.dashboardDisplayType
  /**
   * GPS
   */
  gpsInfo.value = {
    gpsLatitude: data.gpsLatitude,
    gpsLongitute: data.gpsLatitude
  }
  /**
   * DRAFT/LIST
   */
  draftListInfo.value = {
    draftAft: data.draftAft.toFixed(2),
    draftFwd: data.draftFwd.toFixed(2),
    list: data.list.toFixed(2)
  }
  /**
   * ENGINE
   */
  mainEngineChartOption.value.series[0].data[0].value = parseFloat(data.mainEngineRpm.toFixed(2))
  mainEngineChartOption.value.series[0].max = parseFloat(data.mainEngineMaxRpm.toFixed(2))
  generatorEngineChartOption.value.series[0].data[0].value = parseFloat(
    data.generatorEngineRpm.toFixed(2)
  )
  generatorEngineChartOption.value.series[0].max = parseFloat(data.generatorEngineMaxRpm.toFixed(2))

  /**
   * Engine Status
   */
  for (const obj of engineStatus.value) {
    obj.value = data.engineStatusMap[obj.key].toFixed(2)
  }

  /**
   * Voyage Status
   */
  for (const obj of voyageStatus.value) {
    obj.value = data.voyageStatusMap[obj.key].toFixed(2)
  }

  let propellerStatusList = Object.keys(data.propellerStatusMap).map((el) => {
    const { first, second } = data.propellerStatusMap[el]
    return {
      propellerName: el,
      power: first.toFixed(2),
      rpm: second.toFixed(2)
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
      value: parseFloat(data.fuelRemainingMap[el]).toFixed(2)
    }
  })

  // fuelsStatus.value = result
  fuelsStatus.value = result.map((el) => ({
    key: el.fuleName,
    value: el.value,
    unit: 'ton'
  }))
  if (interval != null) {
    clearInterval(interval)
  }
  interval = setInterval(fetchDashboardShipInfo, SECOND_IN_ONE_MINUTE)
}

onMounted(() => {
  fetchDashboardShipInfo()
})

onUnmounted(() => {
  clearInterval(interval)
})

watch(curSelectedShip, fetchDashboardShipInfo)
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
  height: 100vh;
  max-height: calc(100vh - 65px - 50px - 24px - 12px);

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
