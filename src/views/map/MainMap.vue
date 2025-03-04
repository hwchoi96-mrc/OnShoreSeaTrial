<template>
  <div class="map-container">
    <div class="map" ref="map">
      <!-- 지도 컴포넌트 -->
      <WindyMap ref="windyMap" />
      <!-- :selWeather="selWeather" -->
    </div>
    <PopupLayout
      ref="popupLayout"
      v-model="isShow"
      :isShow="isShow"
      @closePopup="isShow = false"
    ></PopupLayout>
    <PopupRoute
      ref="popupRoute"
      v-model="isRouteShow"
      :isRouteShow="isRouteShow"
      @closePopup="isRouteShow = false"
    ></PopupRoute>

    <PopupMenu cclass="popMenu" ref="popupMenu"></PopupMenu>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useMapStore } from '@/stores/mapStore'
import { useShipStore } from '@/stores/shipStore'
import { useRouteStore } from '@/stores/routeStore'
import { getPlanList } from '@/api/routePlanApi'
import { changeShipByImoNumber, changePortByName } from '@/api/worldMap.js'
import emitter from '@/composables/eventbus.js'
import OlMap from '@/components/map/OlMap.vue'
import WindyMap from '@/components/map/WindyMap.vue'

/**
 * 팝업 레이아웃 import
 */
import PopupLayout from '@/views/map/popup/PopupLayout.vue'
import PopupMenu from '@/views/map/popup/PopupMenu.vue'
import PopupRoute from '@/views/map/popup/PopupRoute.vue'

import sailImage from '/images/sail-blue.png'

import { openNewPopup } from '@/composables/util.js'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const mapStore = useMapStore()
const {
  clickedShipInfo,
  imoNumberList,
  vesselTrackStatus,
  startDate,
  endDate,
  isPastVesselTracks,
  isCurrentTrack,
  isPastTrack,
  isRemoveTrack,
  layerBright,
  checkWind,
  checkWave,
  checkFlow,
  checkTempair,
  checkTempwater,
  layerMode,
  isSelect
} = storeToRefs(mapStore)

const routeplanStore = useRouteStore()
const { routeMaster, routeDetail, routelist } = storeToRefs(routeplanStore)

const shipStore = useShipStore()
const { checkedShips, curSelectedShip } = storeToRefs(shipStore)

const popupLayout = ref(null)
const popupMenu = ref(null)
const popupRoute = ref(null)
const isShow = ref(false)
const isRouteShow = ref(false)
let curSelectedShipImoNumber = null
const olmap = ref(null)

//windyMap
const windyMap = ref(null)
const map = ref(null)
const markers = ref(null)

const openPopup = () => {
  isShow.value = true
  return isShow.value
}

const closePopup = () => {
  isShow.value = false
}

const openRoutePopup = () => {
  isRouteShow.value = true
  return isRouteShow.value
}

/**
 * 좌측 사이드바에서 선박 선택했을 때, 선박 imoNumber 전달받는 함수
 * @param {} imoNumbers imoNumber 목록
 */
const displayShipsOnMap = () => {
  imoNumberList.value = checkedShips.value.map((checkedShip) => checkedShip.imoNumber)

  if (clickedShipInfo.value) {
    if (!imoNumberList.value.includes(clickedShipInfo.value.imoNumber)) {
      closePopup()
    }
  }
}

const clickShip = async (imoNumber) => {
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  await mapStore.fetchShipSummary(curSelectedShipImoNumber)
  // if (!imoNumberList.value.includes(clickedShipInfo.value.imoNumber)) {
  //   closePopup()
  //   return
  // }

  if (curSelectedShipImoNumber) {
    // 팝업창 표시하는 함수
    const response = openPopup()
    // 백엔드에 Ship이 변경되었다고 알려주는 함수
    let uuid = userInfo.value.uuid
    var parseValue = JSON.parse(sessionStorage.getItem('userInfo'))
    uuid = parseValue.uuid
    changeShipByImoNumber({ subScribeId: uuid, imoNumber: curSelectedShipImoNumber })
  }
}

const openPortPopup = (portCode) => {
  let url = ''
  switch (portCode) {
    case 'CHSHG':
      url = 'https://naver.com'
      break
    case 'ZACPT':
      url = 'https://daum.net'
      break

    case 'KRPUS':
      url = 'https://google.com'
      break

    default:
      url = 'https://naver.com'
      break
  }
  openNewPopup(`/popup/monitoring/port?portCode=${curPortCode.value}`)
}

const curPortCode = ref()
const changePort = async (portCode) => {
  let uuid = userInfo.value.uuid
  curPortCode.value = portCode
  if (uuid) {
    await changePortByName({ subScribeId: uuid, portCode: curPortCode.value })
  }
}

watch(curSelectedShip, clickShip)

watch(checkedShips, displayShipsOnMap)
</script>

<style scoped>
.map-container {
  position: relative;
  height: 100%;
}
.menuBar {
  width: 100%;
  height: 32px;
  background: #82837f96;
}
.menuBar select {
  -webkit-appearance: listbox;
  border-style: solid;
  background: #82837f96;
}
.menuBar select option {
  background: #82837f96;
}
.menuTable-0 {
  padding-left: 1em;
  display: inline-block;
  float: left;
  margin-right: 1em;
}
.menuTable-0 tr {
  display: flex;
  align-items: center;
}
.menuTable-0 td {
  display: flex;
  align-items: center;
}
.menuTable-0 input {
  margin: 0;
  padding: 0 1em;
  display: inline-table;
}
.menuTable-0 p {
  margin: 0;
  display: inline-table;
}

.menuTable-0 button {
  margin: 0;
  display: inline-table;
}

.menuTable-1 {
  display: inline-block;
}
.menuTable-1 tr {
  display: flex;
  align-items: center;
}
.menuTable-1 td {
  display: flex;
  align-items: center;
  height: 30px;
}
.menuTable-1 button {
  margin: 0;
  display: inline-table;
}

.menuTable-2 {
  display: inline-table;
  float: right;
  margin-right: 1em;
}
.menuTable-2 tr {
  display: flex;
  align-content: center;
}
.menuTable-2 td {
  display: flex;
  align-content: center;
}
.menuTable-2 select {
  display: inline-table;
  height: 30px;
  background-color: rgba(4, 82, 137, 0.5);
  color: white;
}
#selectDate::-webkit-inner-spin-button,
#selectDate::-webkit-calendar-picker-indicator {
  display: inline-block;
}

#selectDate::-webkit-datetime-edit {
  display: none;
}
#selectDate {
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 0.5rem;
  background-color: rgba(4, 82, 137, 0.5);
  color: white;
}
#weatherTime {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  background-color: rgba(4, 82, 137, 0.5);
  color: white;
}
.test {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.red {
  position: absolute;
  background-color: #fff;
  bottom: 62%;
  left: 51%;
}

.yellow {
  position: absolute;
  background-color: #fff;
  bottom: 55%;
  right: 45%;
}

.green {
  position: absolute;
  background-color: #fff;
  right: 45%;
  top: 27%;
}

.test-container {
  /* position: absolute; */
  position: relative;
}
.sub-container {
  position: relative;
}
</style>
