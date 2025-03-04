<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    class="map-aside bg-aside-top-bottom"
  >
    <v-list density="compact">
      <v-list-item v-if="rail" :prepend-avatar="rail ? getLogoImage : getLogoImage"> </v-list-item>
      <v-list-item class="d-flex justify-center w-100 logo" v-else
        ><v-img :src="getLogoImage" class="w-100" height="40" cover></v-img>
      </v-list-item>

      <v-list-item v-if="!rail" class="pa-0">
        <v-sheet class="mt-5 pa-4 bg-aside-content">
          <i-input
            id="searchBox"
            v-model="searchShip"
            prepeod-inner-icon="mdi-magnify"
            single-line
            hide-details
            @input="searchByShip"
            style="width: 220px"
            placeholder="선박명을 입력해주세요"
          ></i-input>

          <DxTreeList
            id="fleetsGrid"
            ref="fleetsGrid"
            :data-source="initFleetsAndShip"
            key-expr="id"
            parent-id-expr="parentId"
            :selected-row-keys="selectedRowKeys"
            :autoExpandAll="true"
            @row-click="selectShip"
            @cell-prepared="hideCheckBox"
            :on-selection-changed="checkShip"
            class="noStripe map-ship-selector mt-4"
            style="height: 100vh; max-height: calc(100vh - 225px)"
          >
            <DxSelection
              mode="multiple"
              :recursive="true"
              show-check-boxes-mode="always"
            ></DxSelection>
            <DxColumn
              data-field="displayName"
              cell-template="status-template"
              caption="Select all"
            />
            <DxColumn data-field="shipStatus" caption="Status" :visible="false" />
            <template #status-template="{ data: templateOptions }">
              <div class="ship-container d-flex">
                <div
                  class="mr-4 ship-name ellipsis"
                  :class="getSelectShipClass(templateOptions.data)"
                  :title="templateOptions.data.displayName"
                  :data-tooltip="templateOptions.data.displayName"
                >
                  {{ templateOptions.data.displayName }}
                  <v-tooltip
                    activator="parent"
                    location="bottom"
                    style="--tooltip-text-color: yellow"
                    class="tooltip-text2"
                  >
                    {{ templateOptions.data.displayName }}
                    <span v-if="templateOptions.data.imoNumber"
                      >({{ templateOptions.data.imoNumber }})</span
                    >
                  </v-tooltip>
                </div>

                <div
                  class="ship-alarm-type"
                  v-if="
                    templateOptions.data.parentId != 0 &&
                    templateOptions.data.shipStatus != '' &&
                    templateOptions.data.shipStatus != null
                  "
                  :class="getStatus(templateOptions.data.shipStatus)"
                >
                  ●
                </div>
              </div>
            </template>
          </DxTreeList>
        </v-sheet>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-divider></v-divider>
      <div class="d-flex">
        <v-btn variant="text" icon="mdi-chevron-double-left" @click.stop="rail = !rail"></v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted, ref } from 'vue'
import moment from 'moment'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/authStore'
import { useAccessMenuStore } from '@/stores/accessMenuStore'
import { useVoccStore } from '@/stores/voccStore'
import { useShipStore } from '@/stores/shipStore'
import { useAlarmStore } from '@/stores/alarmStore'
import { useLoadingStore } from '@/stores/loadingStore'

import { getVoccListAll, fetchShipCondition } from '@/api/voccApi'
import { getShipInfo } from '@/api/shipApi'

import { getDxGridInstance } from '@/composables/dxGridUtil'
import emitter from '@/composables/eventbus.js'
import { fetchMachineData, isStatusOk } from '@/composables/util'

import uipaLogoImgKr from '@/assets/images/uipa-logo.png'
import { changeShipByImoNumber } from '@/api/worldMap.js'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const voccStore = useVoccStore()
const { voccInfo, fleetsAndShip } = storeToRefs(voccStore)
const shipStore = useShipStore()
const { checkedShips, curSelectedShip, usedFuels } = storeToRefs(shipStore)
const alertStore = useAlarmStore()
const { curShipAlarmColor } = storeToRefs(alertStore)

const loadingStore = useLoadingStore()
const { refreshDataTime } = storeToRefs(loadingStore)

/**
 * 사이드바 접힘 여부 관련 변수
 */
const drawer = ref(true)
const rail = ref(false)

const voccs = ref('')
const userRole = ref()
const initFleetsAndShip = ref([])

// DevExtreme 관련 속성
const voccsGrid = ref(null)
let voccsInstance = ''
const fleetsGrid = ref(null)
let fleetsInstance = ''
const selectedRowKeys = ref([])

let treeSelectMode = 'leavesOnly'

onMounted(async () => {
  userRole.value = userInfo.value.role

  if (userRole.value != 'ROLE_LCC_ADMIN') {
    await fetchVocc()
  } else {
    await fetchVoccAll()
  }

  fetchFleetAndShipByVocc()
  fleetsInstance = getDxGridInstance(fleetsGrid)

  if (checkedShips.value) {
    selectedRowKeys.value = checkedShips.value.map((ship) => ship.id)
  }
})

const fetchShipAlarm = async () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  const imoNumberList = fleetsAndShip.value
    .filter((ship) => ship.imoNumber != '')
    .map((result) => result.imoNumber)
  const result = await fetchShipCondition(imoNumberList)
  fleetsAndShip.value.forEach((item) => {
    if (result.hasOwnProperty(item.imoNumber)) {
      item.shipStatus = result[item.imoNumber]

      if (curSelectedImoNumber) {
        if (curSelectedImoNumber == item.imoNumber) {
          curShipAlarmColor.value = result[item.imoNumber]
        }
      }
    }
  })
}

const fetchVoccAll = async () => {
  const result = await voccStore.fetchVoccs()
  voccs.value = result
}

const fetchVocc = async () => {
  if (!voccInfo) {
    await voccStore.fetchVocc()
  }
  const { id, name } = voccInfo.value
  voccs.value = [{ id, name }]
}

const fetchFleetAndShipByVocc = async () => {
  let voccids = voccs.value.map((vocc) => vocc.id).toString()

  const voccIdString = voccids.toString()
  const result = await voccStore.fetchFleetAndShipByVocc(voccIdString)

  //let data = sortData(fleetsAndShip.value)

  initFleetsAndShip.value = [...fleetsAndShip.value]
}

const getStatus = (status) => {
  let colorClass = ''
  switch (status) {
    case 'NORMAL':
      colorClass = 'normal'
      break
    case 'WARNING':
      colorClass = 'warning'
      break
    case 'DANGER':
      colorClass = 'danger'
      break
    case 'BLANK':
      colorClass = 'normal'
      break
  }

  return colorClass
}

const getLogoImage = computed(() => {
  let logoImage = ''
  if (voccInfo.value.logoImage) {
    logoImage = `data:image/png;base64,${voccInfo.value.logoImage}`
  }
  return voccInfo.value.logoImage ? logoImage : ''
})

/**
 * 선박 클릭 시 클릭한 선박의 정보 조회
 * @param {} e
 */
const selectShip = async (e) => {
  let selectedShipImoNumber = e.data.imoNumber

  if (selectedShipImoNumber) {
    const {
      status,
      data: { data }
    } = await getShipInfo(selectedShipImoNumber)
    if (isStatusOk(status)) {
      usedFuels.value = []
      let uuid = userInfo.value.uuid

      let parseValue = JSON.parse(sessionStorage.getItem('userInfo'))
      uuid = parseValue.uuid

      if (uuid) {
        changeShipByImoNumber({ subScribeId: uuid, imoNumber: selectedShipImoNumber })
      }
      // 선박 상태관리하는 변수에 선택한 선박 정보 업데이트
      curSelectedShip.value = { ...data }
      await shipStore.fetchShipMachineInfo(data.imoNumber)
      await shipStore.fetchUsedFuels()
    }
  }
}

let selectedImonumbers = []
const checkShip = async () => {
  const selectedShips = fleetsInstance.getSelectedRowsData(treeSelectMode)

  console.dir(selectedShips)

  selectedImonumbers = getImoNumbers(selectedShips)

  checkedShips.value = [...selectedImonumbers]
  // selectedRowKeys.value = checkedShips.value.map((ship) => ship.id)
}

const getImoNumbers = (selectedShips) => {
  const imoNumbers = selectedShips
    .filter((ship) => ship.imoNumber != null && ship.imoNumber != '')
    .map((ship) => {
      return { id: ship.id, imoNumber: ship.imoNumber }
    })
  return imoNumbers
}

const getSelectShipClass = (data) => {
  let className = ''
  let selectedShipImoNumber = data.imoNumber
  let voccName = data.voccName
  let displayName = data.displayName
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  if (selectedShipImoNumber == curSelectedImoNumber) {
    className = 'active'
  }

  if (voccName == displayName) {
    className += 'voccName'
  }

  return className
}

const searchShip = ref('')
const searchByShip = async () => {
  let selectAllElement = document.querySelector('.dx-treelist-select-all')
  const selectAllCheckbox = selectAllElement.querySelector('.dx-checkbox')
  const checkedStatus = selectAllCheckbox.classList.contains('dx-checkbox-checked')

  fleetsInstance.searchByText(searchShip.value)

  if (checkedStatus) {
    setTimeout(() => {
      const filteredData = fleetsInstance
        .getVisibleRows()
        .filter((el) => el.data.imoNumber != '')
        .map((el) => el.key)

      selectedRowKeys.value = filteredData

      const selectedShips = fleetsInstance.getSelectedRowsData(treeSelectMode)

      selectedImonumbers = getImoNumbers(selectedShips)
      checkedShips.value = [...selectedImonumbers]
    }, 0)
  }
}

const selectAllStatus = ref()

const hideCheckBox = (e) => {
  //if (e.rowType == 'header') {
  //  const header = e.element.querySelector('.dx-header-row')
  //  header.style.display = 'none'
  //}

  if (e.rowType == 'header') {
    removeBlankSpace()
    return
  }

  if (!e.row || e.row.node.children.length != 0 || e.row.data.fleetName == e.row.data.displayName) {
    const checkBox = e.cellElement.querySelector('.dx-select-checkbox')
    const block = e.cellElement.querySelector('.dx-editor-inline-block')
    checkBox.style.display = 'none'
    if (block) {
      block.style.paddingRight = '0px'
    }
  }
  removeBlankSpace()
}

const removeBlankSpace = () => {
  let checkboxEl = document.getElementsByClassName('dx-select-checkbox')

  for (var i = 0; i < checkboxEl.length; i++) {
    let blankEl = checkboxEl[i].previousSibling
    if (checkboxEl[i].style.display !== 'none') {
      if (blankEl) {
        blankEl.style.display = 'none'
      }
    }
  }
}

//사용하지 않는 함수
const sortData = (data) => {
  return data.sort((a, b) => {
    // fleetName과 displayName이 같은 항목을 우선적으로 정렬
    if (a.fleetName === a.displayName && b.fleetName !== b.displayName) {
      return -1
    }
    if (a.fleetName !== a.displayName && b.fleetName === b.displayName) {
      return 1
    }

    // 알파벳, 한글 오름차순으로 정렬
    return a.displayName.localeCompare(b.displayName)
  })
}

const changeAlarmColor = () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  const index = fleetsAndShip.value.findIndex((el) => el.imoNumber == curSelectedImoNumber)

  curShipAlarmColor.value = fleetsAndShip.value[index].shipStatus
}

const reloadData = () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let result = dateTime.isBefore(refreshDataTime.value)

  if (result) {
    fetchShipAlarm()
  }
}

watch(refreshDataTime, reloadData)
watch(curSelectedShip, changeAlarmColor)
</script>

<style scoped lang="scss">
.sidemenu:hover,
.sidemenu:active,
.sidemenu.v-list-item--active {
  border-left: 5px solid #4e83ff;
}

.voccSelection .dx-data-row:nth-child(odd) {
  background: #29292d !important;
}

.voccSelection .dx-data-row:nth-child(even) {
  background: #29292d !important;
}

.ship-alarm-type.normal {
  color: #5789fe;
}

.ship-alarm-type.warning {
  color: #5789fe;
}

.ship-alarm-type.blank {
  color: #5789fe;
}

.ship-alarm-type.danger {
  color: #5789fe;
}

.ellipsis {
  /* overflow: hidden; */
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}

/* TOOLTIP */
.ship-container {
  position: relative;
  align-items: center;
}

#fleetsGrid {
}

.ellipsis.ship-name {
  cursor: pointer;
  font-size: 0.8rem;
  color: #9c9c9c;
  display: flex;
  align-self: center;
  position: relative;
}

.ship-name.active {
  background: #5789fe;
  border-radius: 5px;
  padding: 2px;
  font-size: 0.9rem;
  color: #fff;
}

.ship-name.voccName {
  color: #3ea15d;
}

.map-ship-selector .dx-treelist .dx-row > td {
  padding: 4px 7px;
}

.tooltip-text {
  visibility: hidden;
  width: 120px;
  background-color: yellow;
  color: white;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: 20px;
  margin-left: -70px;
  opacity: 0;
  transition: opacity 0.3s;
}

.ship-name:hover > .tooltip-text {
}
.ship-name:hover {
  .tooltip-text {
    opacity: 1;
    visibility: visible;
  }
}

.tooltip-ship-name {
  color: yellow;
}

.v-tooltip .v-tooltip__content {
  background-color: yellow !important;
  color: black !important;
}

/* .ship-name[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 99;
  background: red;
  padding: 5px;
  border-radius: 5px;
} */
</style>
