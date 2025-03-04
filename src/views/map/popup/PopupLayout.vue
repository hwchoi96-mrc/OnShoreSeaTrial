<template>
  <v-sheet
    class="pa-3 rounded-lg popupLayout pointer-cursor"
    :style="getPopupOpacity"
    :class="getPopupOpacity"
    ref="popupLayout"
    min-height="620"
    v-if="isShow"
    width="355"
  >
    <!--  국가이미지, 선박명, 닫기 버튼 -->
    <v-sheet>
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <!-- <v-btn icon="mdi-menu" height="40" width="40" class="mr-6 menuBtn" size="x-large" variant="text"
            @click="changeVisibleStatusMenu" style="background : #3c3c3f "></v-btn> -->
          <div class="d-flex align-center ga-2">
            <div class="align-center pl-1">
              <v-img :src="displayNationImage" width="25"></v-img>
            </div>
            <div class="align-center boatName" style="line-height: 1">
              {{ worldMapShipInfo.name }}
            </div>
          </div>
        </div>
        <v-btn icon="mdi-close" width="" size="small" variant="text" @click="closePopup"></v-btn>
      </div>
    </v-sheet>
    <!-- 선박 요약 정보 (이미지, 선박 타입, IMO 번호 , MMSI 번호) -->
    <v-sheet color="#3C3C3F" class="px-3 py-3 d-flex rounded-lg" height="160" max-height="160">
      <v-row class="h-100">
        <v-col cols="8">
          <div class="h-100">
            <v-img
              min-height="140"
              max-height="140"
              :src="displayImage"
              width="100%"
              height="100%"
              cover
              class="rounded-lg"
            ></v-img>
          </div>
        </v-col>
        <v-col cols="4" class="pl-0">
          <div class="h-100 align-center d-flex flex-column justify-space-between">
            <div class="justify-space-between d-flex flex-column flex-wrap w-100">
              <div class="sub-title ship">Vessel Type</div>
              <div class="text-left sub-desc ship" style="word-break: normal">
                {{ worldMapShipInfo.type }}
              </div>
            </div>
            <div class="mt-1 d-flex flex-column align-start justify-center w-100">
              <div class="sub-title ship">Flag</div>
              <div class="text-left sub-desc">{{ worldMapShipInfo.nation }}</div>
            </div>
            <div class="mt-1 d-flex flex-column align-start justify-center w-100">
              <div class="sub-title ship">IMO Number</div>
              <div class="text-left sub-desc">{{ worldMapShipInfo.imoNumber }}</div>
            </div>
            <div class="justify-space-between mt-1 w-100">
              <div class="sub-title ship">MMSI Number</div>
              <div class="text-left sub-desc">{{ worldMapShipInfo.mmsiNumber }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet>
      <v-sheet class="mt-3 mb-3 d-flex ga-2">
        <v-chip
          @click="tab = 'voyage'"
          class="rounded-10"
          :color="tab == 'voyage' ? '#4E83FF' : '#3C3C3F'"
          variant="flat"
          >Voyage</v-chip
        >
        <v-chip
          @click="tab = 'equipment'"
          class="rounded-10"
          :color="tab == 'equipment' ? '#4E83FF' : '#3C3C3F'"
          variant="flat"
          >Engine / Fuel
        </v-chip>
      </v-sheet>
      <v-window v-model="tab">
        <v-window-item value="voyage">
          <v-sheet color="#3C3C3F" class="pt-3 rounded-10">
            <div class="d-flex justify-space-between px-3 mb-3">
              <div class="card-title">Voyage Information</div>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex justify-space-between px-3">
                <div class="sub-title">Speed</div>
                <div>
                  {{
                    totalInfo.worldMapVoyageInfo.speed ? totalInfo.worldMapVoyageInfo.speed : '-'
                  }}
                  <span class="unit">kn</span>
                </div>
              </div>
              <div class="d-flex justify-space-between px-3">
                <div class="sub-title">Current Draft</div>
                <div>
                  {{
                    totalInfo.worldMapVoyageInfo.draft ? totalInfo.worldMapVoyageInfo.draft : '-'
                  }}
                  <span class="unit">m</span>
                </div>
              </div>
            </div>
            <div class="d-flex px-3 justify-space-between">
              <div style="width: 65%">
                <v-slider
                  v-model="shipProcess"
                  :thumb-size="30"
                  :track-size="7"
                  height="20"
                  color="#052673"
                  rounded
                  hide-details
                  class="progressBar remain"
                  readonly
                >
                </v-slider>
                <div class="d-flex justify-space-between mt-2 ga-2">
                  <div>
                    <div class="">{{ totalInfo.worldMapVoyageInfo.departure }}</div>
                    <div class="voyage-date">{{ departureTime }}</div>
                  </div>
                  <!-- <div style="background : white; color : black; border-radius : 50px; padding:5px; height : 30px; vertical-align:middle">68</div> -->
                  <div>
                    <div class="text-right">{{ totalInfo.worldMapVoyageInfo.arrival }}</div>
                    <div class="voyage-date">{{ arrivalTime }}</div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column text-start justify-center">
                <div class="sub-title text-center mb-1" style="line-height: 1">Remainig</div>
                <div class="sub-title" style="line-height: 1">
                  <span class="emphasis-text">{{
                    totalInfo.worldMapVoyageInfo.remainDay
                      ? Number.parseInt(totalInfo.worldMapVoyageInfo.remainDay)
                      : '-'
                  }}</span>
                  <span class="remainig-subtext"> Days</span>
                  <span class="emphasis-text ml-1">
                    {{
                      totalInfo.worldMapVoyageInfo.remainHour
                        ? Number.parseInt(totalInfo.worldMapVoyageInfo.remainHour)
                        : '-'
                    }}</span
                  >
                  <span class="remainig-subtext"> Hrs</span>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column justify-center">
              <div class="d-flex justify-space-between px-3 mt-2">
                <div class="sub-title">LAT</div>
                <div>{{ totalInfo.worldMapVoyageInfo.latitude }}</div>
              </div>
              <div class="d-flex justify-space-between px-3 mb-2">
                <div class="sub-title">LON</div>
                <div>{{ totalInfo.worldMapVoyageInfo.longitude }}</div>
              </div>
            </div>
            <div class="voyage-tracks-container pa-3">
              <div class="d-flex justify-space-between align-center">
                <div class="sub-title">Vessel Tracks</div>
                <div class="d-flex align-center ga-2">
                  <div class="sub-title" style="line-height: 1">OFF</div>
                  <div class="voyage-track-switch">
                    <v-switch
                      density="compact"
                      v-model="trackStatus"
                      hide-details
                      color="#4e83ff"
                    ></v-switch>
                  </div>
                  <div class="sub-title ml-1" style="line-height: 1">ON</div>
                </div>
              </div>

              <div class="d-flex justify-space-between mt-2">
                <!-- <div class="sub-title">With Date</div> -->
                <div class="voyage-datepicker">
                  <div class="d-flex flex-column ga-2 align-center">
                    <input type="datetime-local" v-model="startDate" />
                  </div>
                  <div class="voyage-datepicker mt-2">
                    <input type="datetime-local" v-model="endDate" />
                  </div>
                </div>
                <div class="d-flex align-center">
                  <i-btn
                    class="align-self-center search-text h-100"
                    color="#555555"
                    @click="openVoyagesPopup()"
                    text="항차조회"
                    height="35"
                    style="font-size: 0.9rem"
                  ></i-btn>
                </div>
                <!-- <i-btn @click="periodData()" class="px-0 search-text" text="조회" width="15" height="20"></i-btn> -->
              </div>
            </div>
          </v-sheet>
          <!-- <v-sheet color="#3C3C3F" class="px-3 py-2 mt-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3">
              <div class="card-title">CII Monitoring</div>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex justify-space-between align-center">
                <div class="sub-title">CII Grade</div>
                <div style="font-size: 1.1rem; line-height: 1">
                  <span
                    class="grade-icon font-weight-bold"
                    :class="getCiiGradeClassName(worldMapCiiMonitoring.ciiGrade)"
                    >{{ worldMapCiiMonitoring.ciiGrade }}</span
                  >
                </div>
              </div>
              <div class="d-flex justify-space-between align-center">
                <div class="sub-title">CII Rating</div>
                <div style="font-size: 1.1rem">
                  <span style="font-size: 0.8em">{{ worldMapCiiMonitoring.ciiRating }}</span>
                  <span class="unit">%</span>
                </div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="sub-title">Distance</div>
                <div>{{ worldMapCiiMonitoring.distance }} <span class="unit">nm</span></div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="sub-title">FOC / CO2</div>
                <div>
                  {{ worldMapCiiMonitoring.foc }} <span class="unit">t</span>
                  <span class="unit">/</span> {{ worldMapCiiMonitoring.co2Emission }}
                  <span class="unit">t</span>
                </div>
              </div>
            </div>
            <div class="cii-range gc-1 align-center mt-2 pt-6 pb-4" style="position: relative">
              <div style="position: relative">
                <div class="d-flex align-center" :style="ciiValue">
                  <div class="cii-arrow-icon">↓</div>
                  <div style="font-size: 0.6rem">
                    {{ worldMapCiiMonitoring.attainedCiiValue }}
                  </div>
                </div>
              </div>
              <div class="d-flex cii-grade" style="height: 25px">
                <div
                  class="cii-grade grade-a d-flex justify-center align-center"
                  style="border-top-left-radius: 10px; border-bottom-left-radius: 10px"
                >
                  A
                </div>
                <div class="cii-grade grade-b d-flex justify-center align-center">B</div>
                <div class="cii-grade grade-c d-flex justify-center align-center">C</div>
                <div class="cii-grade grade-d d-flex justify-center align-center">D</div>
                <div
                  class="cii-grade grade-e d-flex justify-center align-center"
                  style="border-top-right-radius: 10px; border-bottom-right-radius: 10px"
                >
                  E
                </div>
              </div>
              <div class="d-flex grade mt-1" style="position: relative">
                <div
                  class="cii-grade sub-title"
                  style="line-height: 1.1; position: absolute; left: 15%"
                >
                  {{ worldMapCiiMonitoring.ciiValueBoundaryList[0] }}
                </div>
                <div
                  class="cii-grade sub-title"
                  style="line-height: 1.1; position: absolute; left: 35%"
                >
                  {{ worldMapCiiMonitoring.ciiValueBoundaryList[1] }}
                </div>
                <div
                  class="cii-grade sub-title"
                  style="line-height: 1.1; position: absolute; right: 34%"
                >
                  {{ worldMapCiiMonitoring.ciiValueBoundaryList[2] }}
                </div>
                <div
                  class="cii-grade sub-title"
                  style="line-height: 1.1; position: absolute; right: 14%"
                >
                  {{ worldMapCiiMonitoring.ciiValueBoundaryList[3] }}
                </div>
              </div>
            </div>
          </v-sheet> -->
        </v-window-item>
        <v-window-item value="equipment">
          <v-sheet color="#3C3C3F" class="px-3 py-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3" style="line-height: 1">
              <div class="card-title">Main Engine [Power / RPM]</div>
            </div>
            <div class="d-flex flex-column gap-2">
              <div
                v-for="(mainEngine, index) in totalInfo.worldMapMainEngineInfo.enginePowerList"
                :key="index"
                class="d-flex justify-space-between align-center"
              >
                <div class="sub-title">M/E {{ index + 1 }}</div>
                <div>
                  {{ totalInfo.worldMapMainEngineInfo.enginePowerList[index] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapMainEngineInfo.engineRpmList[index] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
            </div>
          </v-sheet>
          <v-sheet color="#3C3C3F" class="px-3 py-3 my-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3">
              <div class="card-title" style="line-height: 1">Generator Engine</div>
            </div>
            <div class="justify-space-between mb-3">
              <div class="d-flex justify-space-between">
                <div class="sub-title">Total Power</div>
                <div class="emphasis-text" style="font-size: 1rem">
                  {{ totalInfo.worldMapGeneratorEngineInfo.totalGeneratedPowerValue }}
                  <span class="unit">/ </span
                  >{{ totalInfo.worldMapGeneratorEngineInfo.totalMaxPowerValue }}
                  <span class="unit"><span class="unit">kw</span></span>
                </div>
              </div>
              <div class="w-100 d-flex align-center ga-4">
                <v-slider
                  class="generator-power mx-0"
                  v-model="generatorPowerPercent"
                  :thumb-size="0"
                  :track-size="10"
                  height="15"
                  color="#4E83FF"
                  rounded
                  readonly
                  hide-details
                >
                </v-slider>
                <div class="d-flex align-center emphasis-text">
                  {{ generatorPowerPercent }} <span class="unit">&nbsp;%</span>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column gap-2">
              <div
                class="d-flex justify-space-between"
                v-for="(item, index) in totalInfo.worldMapGeneratorEngineInfo
                  .generatedPowerPercentList"
                :key="index"
              >
                <div class="sub-title">G/E {{ index + 1 }}</div>
                <div>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[index] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[index] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
            </div>
          </v-sheet>
          <v-sheet color="#3C3C3F" class="px-3 py-3 mt-2 rounded-lg">
            <div class="d-flex justify-space-between">
              <div class="card-title mb-3">Fuel Remaining</div>
            </div>

            <div class="d-flex flex-column justify-space-between fuel-remaining-container ga-2">
              <div class="d-flex ga-4" v-if="usedFuels.includes('HFO')">
                <div class="sub-title align-center" style="width: 15%">HFO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingHfo"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingHfo }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div class="d-flex ga-4" v-if="usedFuels.includes('LFO')">
                <div class="sub-title align-center" style="width: 15%">LFO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingLfo"
                    :thumb-size="0"
                    :track-size="10"
                    color="#b9c8ef"
                    height="15"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingLfo }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div class="d-flex ga-4" v-if="usedFuels.includes('MDO')">
                <div class="sub-title align-center" style="width: 15%">MDO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingMdo"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingMdo }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div class="d-flex ga-4" v-if="usedFuels.includes('MGO')">
                <div class="sub-title align-center" style="width: 15%">MGO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingMgo"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingMgo }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div class="d-flex ga-4" v-if="usedFuels.includes('LPG_P')">
                <div class="sub-title align-center" style="width: 15%">LPG(P)</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingLpgP"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingLpgP }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div class="d-flex ga-4" v-if="usedFuels.includes('LPG_B')">
                <div class="sub-title align-center" style="width: 15%">LPG(B)</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingLpgB"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingLpgB }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div class="d-flex ga-4" v-if="usedFuels.includes('METHANOL')">
                <div class="sub-title align-center" style="width: 15%">MT</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingMethanol"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingMethanol }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div class="d-flex ga-4" v-if="usedFuels.includes('ETHANOL')">
                <div class="sub-title align-center" style="width: 15%">ET</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingEthanol"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingEthanol }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div class="d-flex ga-4" v-if="usedFuels.includes('LNG')">
                <div class="sub-title align-center" style="width: 15%">LNG</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingLng"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingLng }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
            </div>
          </v-sheet>
        </v-window-item>
      </v-window>
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
import { ref, watch, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  convertFloatFormatObject,
  convertDateTimeType,
  convertDateType,
  convertUTCTimezone,
  isPastVoyageState
} from '@/composables/util'
import { useAuthStore } from '@/stores/authStore'
import { useAdminStore } from '@/stores/adminStore'
import { useMapStore } from '@/stores/mapStore'
import { useShipStore } from '@/stores/shipStore'
import { useUserSettingStore } from '@/stores/userSettingStore'
import { useLoadingStore } from '@/stores/loadingStore'

import { getTotalInfo } from '@/api/worldMap'
import { getPopupOpacitySetting } from '@/api/settingsApi.js'
import { getUserSetting } from '@/api/settingsApi.js'
import { getAllVoyageByImoNumber, getCurrentVoyage } from '@/api/voyage.js'
import emitter from '@/composables/eventbus.js'

import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'
import noShipImage from '/images/ship/no-ship-image.png'

import moment from 'moment'

const mapStore = useMapStore()
const { trackStatus, isPastVesselTracks, isCurrentTrack, isPastTrack, startDate2, endDate2 } =
  storeToRefs(mapStore)

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const shipStore = useShipStore()
const { curSelectedShip, usedFuels } = storeToRefs(shipStore)

const userSettingsStore = useUserSettingStore()
const { settingsForm } = storeToRefs(userSettingsStore)

const loadingStore = useLoadingStore()
const { refreshDataTime } = storeToRefs(loadingStore)

const props = defineProps({
  isShow: {
    type: Boolean,
    defalut: false
  }
})

let shipProcess = ref(0)
let generatorPowerPercent = ref(0)

let remainingHfo = ref(0)
let remainingLfo = ref(0)
let remainingMdo = ref(0)
let remainingMgo = ref(0)
let remainingLpgP = ref(0)
let remainingLpgB = ref(0)
let remainingMethanol = ref(0)
let remainingEthanol = ref(0)
let remainingLng = ref(0)

const voyagePopup = ref()

const tab = ref(null)

const startDate = ref(null)
const endDate = ref(null)

const emit = defineEmits(['closePopup'])

const worldMapShipInfo = ref({
  imoNumber: '-',
  name: '-',
  nation: '-',
  mmsiNumber: '-',
  type: '-'
})

const worldMapVoyageInfo = ref({
  speed: '-',
  draft: '-',
  departure: '-',
  arrival: '-',
  departureTime: '-',
  arrivalTime: '-',
  process: '-',
  remainDay: '-',
  remainHour: '-',
  latitude: '-',
  longitude: '-'
})

const worldMapCiiMonitoring = ref({
  ciiGrade: '-',
  ciiRating: '-',
  distance: '-',
  foc: '-',
  co2Emission: '-',
  ciiRatingBoundaryList: [],
  ciiValueBoundaryList: [],
  requiredCiiValue: '-',
  attainedCiiValue: '-'
})

const worldMapMainEngineInfo = ref({
  enginePowerList: [],
  engineRpmList: []
})

const worldMapGeneratorEngineInfo = ref({
  totalGeneratedPowerValue: '-',
  totalMaxPowerValue: '-',
  totalGeneratedPowerPercent: '-',
  generatedPowerValueList: [],
  generatedPowerPercentList: []
})
const worldMapFuelRemainingInfo = ref({
  fuelRemainingMap: {}
})

const popupLayout = ref(null)
const totalInfo = ref({
  worldMapShipInfo: {
    imoNumber: '-',
    name: '-',
    nation: '-',
    mmsiNumber: '-',
    type: '-'
  },
  worldMapVoyageInfo: {
    speed: 0,
    draft: 0,
    departure: '-',
    arrival: '-',
    departureTime: '-',
    arrivalTime: '-',
    process: 50,
    remainDay: 0,
    remainHour: 0,
    latitude: '-',
    longitude: '-'
  },
  worldMapCiiMonitoring: {
    ciiGrade: '-',
    ciiRating: 0,
    distance: 0,
    foc: 0,
    co2Emission: 0,
    ciiRatingBoundaryList: [0, 0, 0, 0],
    ciiValueBoundaryList: [0, 0, 0, 0],
    requiredCiiValue: 0,
    attainedCiiValue: 0
  },
  worldMapMainEngineInfo: {
    enginePowerList: [0, 0, 0, 0],
    engineRpmList: [0, 0, 0, 0]
  },
  worldMapGeneratorEngineInfo: {
    totalGeneratedPowerValue: 0,
    totalMaxPowerValue: 0,
    totalGeneratedPowerPercent: 0,
    generatedPowerValueList: [0, 0, 0, 0],
    generatedPowerPercentList: [0, 0, 0, 0]
  },
  worldMapFuelRemainingInfo: {
    fuelRemainingMap: {
      HFO: 0,
      LFO: 0,
      MDO: 0,
      MGO: 0,
      LPG: 0,
      LNG: 0
    }
  }
})

let departureTime = null
let arrivalTime = null

const SECOND_IN_ONE_MINUTE = 1000 * 60
let interval = null

const periodData = () => {
  isPastVesselTracks.value = true
}

const closePopup = () => {
  emit('closePopup')
  emitter.emit('closePopupMenu')
}

const displayImage = computed(() => {
  let image = ''
  const result = curSelectedShip.value.shipImage
    ? `data:image/png;base64,${curSelectedShip.value.shipImage}`
    : noShipImage
  image = result

  return image
})

const displayNationImage = computed(() => {
  let nation = curSelectedShip.value.nation
  let nationImage = `/images/country/${nation}.png`
  return nationImage
})
let loadingDateTime = ref()
const fetchTotalInfo = async () => {
  reset()
  const today = moment()

  loadingDateTime.value = today.utc().format('YYYY-MM-DD hh:mm')
  const response = await getTotalInfo(curSelectedShip.value.imoNumber)

  let {
    data: { data }
  } = response
  let result = convertFloatFormatObject(data)

  // 선박정보
  for (const key of Object.keys(worldMapShipInfo.value)) {
    if (!data.worldMapShipInfo[key] || data.worldMapShipInfo[key] == 'NaN') {
      worldMapShipInfo.value[key] = '-'
    } else {
      worldMapShipInfo.value[key] = data.worldMapShipInfo[key]
    }
  }

  // 운항정보
  for (const key of Object.keys(worldMapVoyageInfo.value)) {
    worldMapShipInfo.value[key] = data.worldMapShipInfo[key]
  }
  // 출발시각
  worldMapShipInfo.value.departureTime = convertDateTimeType(worldMapShipInfo.value.departureTime)
  // 도착시각
  worldMapShipInfo.value.arrivalTime = convertDateTimeType(worldMapShipInfo.value.arrivalTime)

  // CII 모니터링
  for (const key of Object.keys(worldMapCiiMonitoring.value)) {
    worldMapCiiMonitoring.value[key] = data.worldMapCiiMonitoring[key]

    console.log('cii key', key)
    console.log('cii value', worldMapCiiMonitoring.value[key])
  }

  // 발전기
  generatorPowerPercent.value = parseInt(
    result.worldMapGeneratorEngineInfo.totalGeneratedPowerPercent
  )

  // 연료 소모량
  if (result.worldMapFuelRemainingInfo?.fuelRemainingMap) {
    if ('HFO' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      remainingHfo.value = parseFloat(result.worldMapFuelRemainingInfo.fuelRemainingMap.HFO)
    }

    if ('LFO' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      remainingLfo.value = parseFloat(result.worldMapFuelRemainingInfo.fuelRemainingMap.LFO)
    }

    if ('MDO' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      remainingMdo.value = parseFloat(result.worldMapFuelRemainingInfo.fuelRemainingMap.MDO)
    }

    if ('MGO' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      console.log('MGO 있음')
      console.dir(usedFuels.value)
      remainingMgo.value = parseFloat(result.worldMapFuelRemainingInfo.fuelRemainingMap.MGO)
      console.log(remainingMgo.value)
    }

    if ('LPG_P' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      remainingLpgP.value = parseFloat(result.worldMapFuelRemainingInfo.fuelRemainingMap['LPG_P'])
    }

    if ('LPG_B' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      remainingLpgB.value = parseFloat(result.worldMapFuelRemainingInfo.fuelRemainingMap['LPG_B'])
    }

    if ('METHANOL' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      remainingMethanol.value = parseFloat(
        result.worldMapFuelRemainingInfo.fuelRemainingMap.METHANOL
      )
    }

    if ('ETHANOL' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      remainingEthanol.value = parseFloat(result.worldMapFuelRemainingInfo.fuelRemainingMap.ETHANOL)
    }

    if ('LNG' in result.worldMapFuelRemainingInfo.fuelRemainingMap) {
      remainingLng.value = parseFloat(result.worldMapFuelRemainingInfo.fuelRemainingMap.LNG)
    }
  }

  totalInfo.value = result
}

const getCiiGradeClassName = (ciiGrade) => {
  let ciiGradeClassName = ''
  switch (ciiGrade) {
    case 'A':
      ciiGradeClassName = 'grade-a'
      break
    case 'B':
      ciiGradeClassName = 'grade-b'
      break
    case 'C':
      ciiGradeClassName = 'grade-c'
      break
    case 'D':
      ciiGradeClassName = 'grade-d'
      break
    case 'E':
      ciiGradeClassName = 'grade-e'
      break
  }

  return ciiGradeClassName
}

const reset = () => {
  worldMapShipInfo.value = {
    imoNumber: '-',
    name: '-',
    nation: '-',
    mmsiNumber: '-',
    type: '-'
  }

  worldMapVoyageInfo.value = {
    speed: '-',
    draft: '-',
    departure: '-',
    arrival: '-',
    departureTime: '-',
    arrivalTime: '-',
    process: '-',
    remainDay: '-',
    remainHour: '-',
    latitude: '-',
    longitude: '-'
  }

  worldMapCiiMonitoring.value = {
    ciiGrade: '-',
    ciiRating: '-',
    distance: '-',
    foc: '-',
    co2Emission: '-',
    ciiRatingBoundaryList: [],
    ciiValueBoundaryList: [],
    requiredCiiValue: '-',
    attainedCiiValue: '-'
  }

  worldMapMainEngineInfo.value = {
    enginePowerList: [],
    engineRpmList: []
  }

  worldMapGeneratorEngineInfo.value = {
    totalGeneratedPowerValue: '-',
    totalMaxPowerValue: '-',
    totalGeneratedPowerPercent: '-',
    generatedPowerValueList: [],
    generatedPowerPercentList: []
  }

  worldMapFuelRemainingInfo.value = {
    fuelRemainingMap: {}
  }
}

/**
 * 팝업창 투명도 조회
 */
const getPopupOpacity = computed(() => {
  let userId = userInfo.value.userId
  let popupOpacity = 100
  if ('popupOpacity' in settingsForm.value.settingDataMap) {
    popupOpacity = settingsForm.value.settingDataMap.popupOpacity
  }
  let opacityStyle = 'opacity : '

  if (popupOpacity) {
    opacityStyle = opacityStyle + (100 - popupOpacity) * 0.01
  } else {
    getUserSetting(userId)
  }

  return opacityStyle
})

const fetchCurVoyageDate = async () => {
  const imoNumber = curSelectedShip.value.imoNumber

  const response = await getCurrentVoyage(imoNumber)
  const { first, second } = response?.data?.data ?? { first: null, second: null }

  if (first) {
    startDate.value = convertDateTimeType(first)
  }

  if (second) {
    endDate.value = convertDateTimeType(second)
  }
  // startDate.value =
}

const reloadData = () => {
  let dateTime = moment(loadingDateTime.value)
  let result = dateTime.isBefore(refreshDataTime.value)

  if (result) {
    fetchTotalInfo()
  }
}

const resetData = () => {}

/**
 * 클릭한 선박의 정보가 변경될 경우, 실행되는 함수
 */
watch(curSelectedShip, async () => {
  interval = null
  await fetchCurVoyageDate()
  await fetchTotalInfo()

  if (trackStatus.value) {
    let result = isPastVoyageState(endDate.value)

    if (result) {
      isPastTrack.value = true
      emitter.emit('clickIsPastTrack', true)
    } else {
      isCurrentTrack.value = true
      emitter.emit('clickIsCurrentTrack', true)
    }
  }
})

watch(trackStatus, async (value) => {
  if (trackStatus.value == true) {
    const today = moment()
    let todayDate = convertUTCTimezone(today)

    const {
      data: {
        data: { first, second }
      }
    } = await getCurrentVoyage(curSelectedShip.value.imoNumber)

    let recentVoyageEndDate = convertUTCTimezone(second)
    const result = moment(recentVoyageEndDate).isBefore(todayDate)

    emitter.emit('clickTrackStatus', value)
    if (result) {
      isPastTrack.value = true
      emitter.emit('clickIsPastTrack', true)
    } else {
      isCurrentTrack.value = true
      emitter.emit('clickIsCurrentTrack', true)
    }

    startDate2.value = convertUTCTimezone(first)
    endDate2.value = recentVoyageEndDate
  } else {
    emitter.emit('clickTrackStatus', value)
  }
})

watch(startDate, (value) => {
  emitter.emit('inputStartDate', value)
})

watch(endDate, (value) => {
  emitter.emit('inputEndDate', value)
})

watch(isPastVesselTracks, (value) => {
  emitter.emit('clickPastVesselTracks', value)
})

watch(refreshDataTime, reloadData)
onUnmounted(() => {
  clearInterval(interval)
})

const isShowPopupModal = ref(false)
const voyages = ref(false)
const openVoyagesPopup = async () => {
  isShowPopupModal.value = true
  await voyagePopup.value.fetchVoyagesByImoNumber()
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const updateDate = async (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation
  const today = moment()
  let todayDate = convertUTCTimezone(today)

  const {
    data: {
      data: { first, second }
    }
  } = await getCurrentVoyage(curSelectedShip.value.imoNumber)

  let recentVoyageEndDate = convertUTCTimezone(selectEndDate)
  const result = moment(recentVoyageEndDate).isBefore(todayDate)

  if (result) {
    isPastTrack.value = true
    emitter.emit('clickIsPastTrack', true)
  } else {
    isCurrentTrack.value = true
    emitter.emit('clickIsCurrentTrack', true)
  }

  startDate2.value = selectStartDate
  endDate2.value = selectEndDate
}

const ciiValue = computed(() => {
  let leftValue = 0
  const ciiArray = worldMapCiiMonitoring.value.ciiValueBoundaryList
  const ciiNumberArray = ciiArray.map(Number)
  let fiBoundary = ciiNumberArray[0]
  let seBoundary = ciiNumberArray[1]
  let thBoundary = ciiNumberArray[2]
  let foBoundary = ciiNumberArray[3]

  const ciiRequiredValue = parseFloat(worldMapCiiMonitoring.value.attainedCiiValue)

  //A
  if (0 <= ciiRequiredValue && ciiRequiredValue <= fiBoundary) {
    leftValue = 7
  }
  //B
  if (fiBoundary + 1 <= ciiRequiredValue && ciiRequiredValue <= seBoundary) {
    leftValue = 27
  }
  //C
  if (seBoundary + 1 <= ciiRequiredValue && ciiRequiredValue <= thBoundary) {
    leftValue = 47
  }
  //D
  if (thBoundary + 1 <= ciiRequiredValue && ciiRequiredValue <= foBoundary) {
    leftValue = 67
  }
  //E
  if (foBoundary + 1 <= ciiRequiredValue) {
    leftValue = 86
  }

  return `position: absolute; left: ${leftValue}%; text-align: center; transform: translate(0, -90%);`
})
</script>

<style scoped>
.popupLayout {
  position: absolute;
  top: 45px;
  z-index: 999;
  left: 15px;
  /* height: calc(100% - 24px); */
}

.boatName {
  font-size: 1rem;
}

.voyage-date {
  color: #6c6c6c;
  font-size: 0.7rem;
}

.cii-range .cii-grade {
  flex: 1 0 auto;
  text-align: center;
}

.cii-grade {
  font-size: 0.8rem;
}

.cii-attained-bonudary {
  font-size: 0.6rem;
}

.sub-title {
  color: #aaa;
}

.card-title {
  font-size: 0.9rem;
  line-height: 1;
}

.unit {
  color: #aaa;
  font-size: 0.75rem;
}

.v-slider.generator-power.v-input--horizontal > .v-input__control {
  min-height: 15px;
}

.v-slider.v-input--horizontal {
  align-items: center;
  margin-inline: 0px 0px;
}

.voyage-datepicker input[type='date'] {
  border: 1px solid #717171;
  padding: 2px 4px;
  border-radius: 8px;
  cursor: pointer;
  width: 100px;
  font-size: 0.65rem;
}

.voyage-datepicker input[type='datetime-local'] {
  background: #4b4b4b;
  padding: 2px 4px;
  border-radius: 4px;
}

.cii-arrow-icon {
  color: #4e83ff;
  font-weight: 600;
  font-size: 1.125rem;
}

.search-text {
  font-size: 0.8rem;
}

.voyage-track-switch .v-selection-control__wrapper {
  width: 25px;
  height: 25px;
}

.voyage-track-switch .v-switch .v-selection-control {
  min-height: 25px;
}

.emphasis-text {
  font-size: 1rem;
  color: #4e83ff;
}

.rounded-10 {
  border-radius: 10px;
}

.sub-title.ship {
  font-size: 0.8rem;
}

.sub-title.ship,
.sub-desc.ship {
  line-height: 1.2;
}

.sub-desc {
  line-height: 1;
}

.fuel-remainig-container .v-slider-track__background--opacity {
  opacity: 0.5;
}

.track-bg {
  color: '#b9c8ef';
}

.gap-2 {
  gap: 1px;
}

.voyage-tracks-container {
  background: #4b4b4b;
  border-radius: 15px;
}
.progressBar .v-slider-thumb__surface::after {
  /* content: url('data:image/png;base64,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') !important; */
}

.remainig-subtext {
  font-size: 0.8rem;
}
</style>
