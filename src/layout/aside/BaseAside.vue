<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    class="bg-aside"
  >
    <v-list density="compact">
      <v-list-item v-if="rail" :prepend-avatar="rail ? getLogoImage : getLogoImage"> </v-list-item>
      <v-list-item class="d-flex justify-center" v-else
        ><v-img :src="getLogoImage" width="300" height="50"></v-img>
      </v-list-item>
      <v-list-item v-if="!rail" class="pa-0">
        <v-sheet class="mt-5 pa-2" color="#1f1e1e">
          <i-input
            id="searchBox"
            v-model="searchShip"
            prepend-inner-icon="mdi-magnify"
            single-line
            hide-details
            @input="searchByShip"
            placeholder="선박명을 입력해주세요"
          ></i-input>

          <DxTreeList
            id="menus"
            ref="fleetsGrid"
            :data-source="initFleetsAndShip"
            key-expr="id"
            parent-id-expr="parentId"
            :selected-row-keys="selectedRowKeys"
            :autoExpandAll="true"
            :on-selection-changed="selectShip"
            class="noStripe mt-4"
            @cell-prepared="hideCheckBox"
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
              <div class="d-flex">
                <div class="mr-2 ship-name ellipsis" :title="templateOptions.data.displayName">
                  {{ templateOptions.data.displayName }}
                  <v-tooltip activator="cursor" location="bottom">{{
                    templateOptions.data.displayName
                  }}</v-tooltip>
                </div>

                <div
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useVoccStore } from '@/stores/voccStore'
import { useMapStore } from '@/stores/mapStore'
import { useShipStore } from '@/stores/shipStore'

import emitter from '@/composables/eventbus.js'
import { getVoccListAll, fetchShipCondition } from '@/api/voccApi'
import { getDxGridInstance } from '@/composables/dxGridUtil'
import { fetchMachineData } from '@/composables/util'

const mapStore = useMapStore()
const { clickedShipInfo } = storeToRefs(mapStore)

// import uipaLogoImg from '/images/logo/uipa-logo.png'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const voccStore = useVoccStore()
const { voccInfo, fleetsAndShip } = storeToRefs(voccStore)

const shipStore = useShipStore()
const { selectedShip } = storeToRefs(shipStore)

const drawer = ref(true)
const rail = ref(false)

const voccs = ref('')
const userRole = ref()
const initFleetsAndShip = ref([])

// DevExtreme 관련 속성
const fleetsGrid = ref(null)
const selectedRowKeys = ref()
let fleetsInstance = ref()

//const SECOND_IN_ONE_MINUTE = 1000 * 15
//let interval = null

onMounted(async () => {
  let selectedShip = ''
  userRole.value = userInfo.value.role
  fleetsInstance.value = getDxGridInstance(fleetsGrid)

  if (userRole.value != 'ROLE_LCC_ADMIN') {
    await fetchVocc()
  } else {
    await fetchVoccAll()
  }

  await fetchFleetAndShipByVocc()
  //사용 하지 않는 파일
  //interval = setInterval(fetchShipAlarm, SECOND_IN_ONE_MINUTE)

  if (!clickedShipInfo.value) {
    selectedShip = initFleetsAndShip.value.filter((ship) => ship.imoNumber != '')
    selectedRowKeys.value = [selectedShip[0].id]
  } else {
    let selectedShip = initFleetsAndShip.value.filter(
      (ship) => ship.imoNumber == clickedShipInfo.value.imoNumber
    )
    voccsAdmins.value = [selectedShip[0].id]
  }
})

// onUnmounted(() => {
//   clearInterval(interval)
// })

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
  // api 요청
  let voccids = voccs.value.map((vocc) => vocc.id).toString()
  const test = voccids.toString()
  const result = await voccStore.fetchFleetAndShipByVocc(test)
  // 결과값 반환
  initFleetsAndShip.value = [...fleetsAndShip.value]
}

/**
 * 선박 알람 조회
 */
//사용하지 않는 함수
const fetchShipAlarm = async () => {
  const imoNumberList = fleetsAndShip.value
    .filter((ship) => ship.imoNumber != '')
    .map((result) => result.imoNumber)
  const result = await fetchShipCondition(imoNumberList)
  fleetsAndShip.value.forEach((item) => {
    if (result.hasOwnProperty(item.imoNumber)) {
      item.shipStatus = result[item.imoNumber]
    }
  })
}

/**
 * 알람 상태
 * @param {} status
 */
const getStatus = (status) => {
  let colorClass = ''
  switch (status) {
    case 'NORMAL':
      colorClass = 'blue'
      break
    case 'WARNING':
      colorClass = 'orange'
      break
    case 'DANGER':
      colorClass = 'red'
      break
    case 'BLANK':
      colorClass = 'blue'
      break
  }

  return colorClass
}

/**
 * 좌측 사이드바 관련 로직
 * - 체크박스 숨김 처리
 * - 선박 선택
 * - 선박명 검색
 */

/**
 * 선사, 선단인 경우, 체크박스 숨김 처리
 * @param {*} e
 */
const hideCheckBox = (e) => {
  if (e.rowType == 'header') {
    const header = e.element.querySelector('.dx-header-row')
    header.style.display = 'none'
  }

  if (!e.row || e.row.node.children.length != 0) {
    const checkBox = e.cellElement.querySelector('.dx-select-checkbox')
    const block = e.cellElement.querySelector('.dx-editor-inline-block')
    checkBox.style.display = 'none'
    if (block) {
      block.style.paddingRight = '0px'
    }
  }

  removeBlankSpace()
}

/**
 * 선박 선택할 경우, 상세페이지에 imoNumber 전달
 * @param {*} e
 */

 let isChanged = false
const selectShip = async (e) => {
  let selectedKey = e.currentSelectedRowKeys
  let selectedData = e.selectedRowsData
  let selectedDataLength = e.selectedRowsData.length
  let imoNumber = ''

  if (e.selectedRowKeys.length >= 2) {
    e.selectedRowKeys = selectedKey
    selectedRowKeys.value = selectedKey
    return
  }

  if (selectedData.length != 0) {
    imoNumber = e.selectedRowsData[selectedDataLength - 1].imoNumber
  }

  await fetchMachineData(imoNumber)
  await shipStore.fetchUsedFuels()
  selectedShip.value = imoNumber
  emitter.emit('selectShipOnDetailPage', imoNumber)
}

const searchShip = ref('')
const searchByShip = () => {
  fleetsInstance.value.searchByText(searchShip.value)
}

/**
 * 로고 이미지 출력
 * - 선사 로고 이미지가 있을 경우 - 선사 로고 이미지 출력
 * - 선사 로고 이미지가 없을 경우 - UIPA 로고 이미지 출력
 */
const getLogoImage = computed(() => {
  let logoImage = ''
  if (voccInfo.value.logoImage) {
    logoImage = `data:image/png;base64,${voccInfo.value.logoImage}`
  }
  // return voccInfo.value.logoImage ? logoImage : uipaLogoImg
  return voccInfo.value.logoImage
})

const removeBlankSpace = () => {
  let checkboxEl = document.getElementsByClassName('dx-select-checkbox')

  for (var i = 0; i < checkboxEl.length; i++) {
    let blankEl = checkboxEl[i].previousSibling
    if (checkboxEl[i].style.display !== 'none') {
      // blankEl.style.display = 'none'
    }
  }
}
</script>

<style scoped>
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

.blue {
  color: #5789fe;
}

.orange {
  color: #f7c63a;
}

.gray {
  color: #909cb4;
}

.red {
  color: #ff0045;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
