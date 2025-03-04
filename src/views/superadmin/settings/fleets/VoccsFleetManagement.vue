<template>
  <v-container fluid class="h-100 detail-page settings">
    <v-row class="h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-center">선단 목록</div>
              <div v-if="role != 'ROLE_VOCC_USER'">
                <i-btn
                  text="새 선단 추가"
                  @click="showAddModal"
                  color="#3D3D40"
                  prepend-icon="mdi-plus"
                  width="120"
                ></i-btn>
                <i-btn
                  @click="showConfirmModal('정말로 선택한 선단을 삭제 하시겠습니까?')"
                  class="ml-2"
                  text="삭제"
                  color="#F04A4A"
                  prepend-icon="mdi-trash-can"
                  width="80"
                ></i-btn>
              </div>
            </div>
          </v-card-title>
          <!--      :active-state-enabled="activeStatus"
              :focused-row-enabled="true" -->
          <v-card-text>
            <DxDataGrid
              ref="fleetGrid"
              :data-source="fleets"
              key-expr="id"
              :selected-row-keys="selectedFleetKey"
              @selection-changed="selectFleet"
              :show-borders="true"
              class="tab-dx-grid no-stripe"
            >
              <DxColumn data-field="name" caption="선단명" :allow-editing="false" />
              <DxScrolling mode="virtual" />
              <DxSelection mode="single"></DxSelection>
            </DxDataGrid>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-self-center">선박 목록</div>
              <div>
                <i-btn class="mr-1" @click="saveShipByFleet" text="저장"></i-btn>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <DxDataGrid
              id="ships"
              ref="shipGrid"
              class="tab-dx-grid no-stripe"
              key-expr="imoNumber"
              :data-source="initShips"
              :column-auto-width="true"
              :selected-row-keys="selectedShipsKeys"
              :show-column-lines="false"
              @row-prepared="onRowPrepared"
              @selection-changed="onSelectionChanged"
              @editor-preparing="onEditorPreparing"
              :show-column-headers="false"
              :row-alternation-enabled="true"
              :show-borders="true"
            >
              <DxSelection
                mode="multiple"
                show-check-boxes-mode="always"
                :recursive="true"
              ></DxSelection>
              <DxColumn data-field="name" caption="선박명" cell-template="cellTemplate"></DxColumn>
              <DxColumn data-field="fleetName" :visible="false"></DxColumn>

              <template #cellTemplate="{ data: templateOptions }">
                <div class="d-flex align-self-center">
                  <div class="userName">{{ templateOptions.data.name }}</div>
                  <div
                    class="groupName ml-2"
                    v-if="templateOptions.data.fleetName != null"
                    :class="changeColor(templateOptions.data.fleetName)"
                  >
                    {{ templateOptions.data.fleetName }}
                  </div>
                  <div
                    v-else
                    class="groupName ml-2"
                    :class="changeColor(templateOptions.data.fleetName)"
                  >
                    선단 없음
                  </div>
                </div>
              </template>
            </DxDataGrid>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!--  선단 추가 팝업창 -->
  <AppModal v-model="isShowAddModal" @close="closeAddModal" title="새로운 선단 추가">
    <template #default>
      <i-input
        bg-color="#F1F1F9"
        label="선단명"
        v-model="fleetRegisterForm.name"
        placeholder="선단명을 입력해주세요"
      ></i-input>
    </template>

    <template #actions>
      <i-btnGroup type="add" @close="closeAddModal" @add="registerFleet"></i-btnGroup>
    </template>
  </AppModal>

  <!-- 삭제 확인 팝업창 -->
  <AppModal v-model="showModal" @close="closeConfirmModal" title="선택 선단 삭제">
    <template #default>
      {{ modalMessage }}
    </template>

    <template #actions>
      <div v-if="selectedFleet">
        <i-btnGroup type="delete" @close="closeConfirmModal" @delete="removeFleet"></i-btnGroup>
      </div>
    </template>
  </AppModal>
  <!-- 선단 안내 문구 팝업창-->
  <AppModal v-model="isShowInfoModal" @close="closeInfoModal" title="안내" width="450">
    <template #default>
      <div>선단에 소속 되지않은 선박은 좌측 선박 선택 메뉴에 표시되지않습니다</div>
      <div>선단이 없는 선박은 DEFAULT 선단으로 변경해주시길 바랍니다</div>
    </template>

    <template #actions>
      <i-btn @click="isShowInfoModal = false" text="확인"></i-btn>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, watch } from 'vue'

import { storeToRefs } from 'pinia'
import { useFleetStore } from '@/stores/fleetStore'
import { useShipStore } from '@/stores/shipStore'

import { addShipsByFleet, addFleet, deleteFleet } from '@/api/fleetApi'
import { isStatusOk } from '@/composables/util'
import { useToast } from '@/composables/useToast'
import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil'

import AppModal from '@/components/modal/AppModal.vue'
import ShipInfoRegisterForm from '@/views/settings/vocc/ship/form/ShipInfoRegisterForm.vue'
import ShipInfoEditByUserForm from '@/views/settings/vocc/ship/form/ShipInfoEditByUserForm.vue'
import NoSelectShip from '@/components/NoSelectShip.vue'

const { showResMsg } = useToast()

const fleetStore = useFleetStore()
const fleetGrid = ref()
const fleets = ref([])
const selectedFleet = ref('')
const selectedFleetKey = ref([])

const shipStore = useShipStore()

const shipImoNumber = ref('')

const props = defineProps({
  voccId: {
    type: [String, Number, Object]
  }
})

let role = ''
let noFleetName = '선단 없음'

/**
 * 선단별 선박 목록 조회
 */
const initShips = ref([])
// 선택한 선박 메뉴 key 배열
const selectedShipsKeys = ref([])
let oldShipKeys = []

const fetchVoccFleets = async () => {
  let voccId = props.voccId
  fleets.value = await fleetStore.fetchFleetsByVoccId(voccId)
  initShips.value = []
  selectedFleet.value = {}
}

/**
 * 선단 선택 시 선박 목록 조회
 */

// 24.07.02 [이채원 사원]
const selectFleet = async (e) => {
  const fleetId = e['currentSelectedRowKeys'][0]
  const fleetName = e['selectedRowsData'][0]['name']

  selectedFleet.value = { id: fleetId, name: fleetName }

  // 해당 선사의 선박 목록 조회
  let voccId = props.voccId
  const ships = await shipStore.fetchShipsByVoccId(voccId)

  // const data = ships.map((ship) => {
  //   const matchFleet = fleets.value.find((fleet) => fleet.imoNumberList.includes(ship.imoNumber))
  //   return {
  //     ...ship,
  //     fleetName: matchFleet ? matchFleet.name : null,
  //     fleetId: matchFleet ? matchFleet.id : null
  //   }
  // })

  let isMatchedFleet = ''
  // 기존 소스
  const data = ships.map((ship) => {
    let matchFleet = fleets.value.find((fleet) => {
      if (fleet.imoNumberList) {
        isMatchedFleet = fleet.imoNumberList.includes(ship.imoNumber)
      }

      return isMatchedFleet
    })

    return {
      ...ship,
      fleetName: matchFleet ? matchFleet.name : null,
      fleetId: matchFleet ? matchFleet.id : null
    }
  })

  initShips.value = data
  const fleetInfo = fleets.value.find((item) => item.id === fleetId)

  selectedShipsKeys.value = fleetInfo.imoNumberList
  oldShipKeys = [...selectedShipsKeys.value] // 배열 복사
}

const onSelectionChanged = (e) => {
  selectedShipsKeys.value = e.selectedRowKeys
}

// 24.07.02 [이채원 사원]
const reload = async (e) => {
  // const fleetId = e['currentSelectedRowKeys'][0]
  // const fleetName = e['selectedRowsData'][0]['name']

  // selectedFleet.value = { id: fleetId, name: fleetName }

  const fleetId = selectedFleetKey.value[0]
  // 해당 선사의 선박 목록 조회
  let voccId = props.voccId
  const ships = await shipStore.fetchShipsByVoccId(voccId)

  let isMatchedFleet = ''
  // 기존 소스
  const data = ships.map((ship) => {
    let matchFleet = fleets.value.find((fleet) => {
      if (fleet.imoNumberList) {
        isMatchedFleet = fleet.imoNumberList.includes(ship.imoNumber)
      }

      return isMatchedFleet
    })

    return {
      ...ship,
      fleetName: matchFleet ? matchFleet.name : null,
      fleetId: matchFleet ? matchFleet.id : null
    }
  })

  initShips.value = data
  const fleetInfo = fleets.value.find((item) => item.id === fleetId)

  selectedShipsKeys.value = fleetInfo.imoNumberList
  oldShipKeys = [...selectedShipsKeys.value] // 배열 복사
}

const changeColor = (groupName) => {
  return groupName ? 'primary' : 'gray'
}

/**
 * 할당된 선단이 있을 경우, 체크박스 및 클릭 이벤트 비활성화
 * onEditorPreparing은 체크박스 비활성화된 것처럼만 보이고,
 * 실제 동작하기 때문에 이벤트를 막는 코드 추가
 * @param {*} e
 */
const onRowPrepared = (e) => {
  if (e.rowType !== 'data') return
  // const isSelected = selectedShipsKeys.value.includes(e.key);
  // 선택된 항목 관련 배경색 지정할 경우
  // if (isSelected) {
  //   e.rowElement.style.backgroundColor = '#4E83FF';
  // }
  if (e.data.fleetName != null && selectedFleet.value.id != e.data.fleetId) {
    e.rowElement.style.pointerEvents = 'none'
  }
}

/**
 * 할당된 그룹이 있을 경우, 체크박스 비활성화
 * @param {*} e
 */
const onEditorPreparing = (e) => {
  // 타입이 dataRow일 경우만 동작
  if (e.type !== 'selection' || e.parentType !== 'dataRow') return
  if (e.row.data.fleetName != null && selectedFleet.value.id != e.row.data.fleetId) {
    e.editorOptions.disabled = true
  }
}

/**
 * 선단 정보 등록
 */
const fleetRegisterForm = ref({
  name: '',
  voccId: ''
})

// 24.07.02 [이채원 사원]
const registerFleet = async () => {
  let curVoccId = props.voccId
  fleetRegisterForm.value.voccId = curVoccId

  // 입력 값이 공백인지 확인
  if (!fleetRegisterForm.value.name || fleetRegisterForm.value.name.trim() === '') {
    showResMsg('값을 입력하세요')
    return
  }

  const {
    status,
    data: { data }
  } = await addFleet(fleetRegisterForm.value)

  if (isStatusOk(status)) {
    /*기존 소스
    fleets.value.push({ id: data, ...fleetRegisterForm.value, imoNumberList: null })
    isShowAddModal.value = false  */

    const newFleet = { id: data, ...fleetRegisterForm.value, imoNumberList: [] }
    fleets.value.push(newFleet)

    // 선단 생성 후, 새로 생성된 선단을 선택된 선단으로 설정
    selectedFleet.value = newFleet
    selectedFleetKey.value = [data]

    // 선단 목록을 다시 로드하여 선택된 선단이 반영되도록 설정
    dxGridRefresh(fleetGrid)

    // 팝업창 닫기 및 입력 필드 초기화
    isShowAddModal.value = false
    fleetRegisterForm.value.name = ''

    // 사용자에게 성공 메시지 표시
    showResMsg('새 선단이 추가되었습니다')
  }
}

// 24.07.02 [이채원 사원]
const saveShipByFleet = async () => {
  const shipByFleet = {
    id: selectedFleet.value.id,
    imoNumberList: selectedShipsKeys.value
  }

  const fleetName = selectedFleet.value.name
  let newValue = []
  let removedValue = []

  if (oldShipKeys.length > 0) {
    newValue = selectedShipsKeys.value.filter((x) => !oldShipKeys.includes(x))
    removedValue = oldShipKeys.filter((x) => !selectedShipsKeys.value.includes(x))
  } else {
    newValue = [...selectedShipsKeys.value]
  }
  /*
  // 기존 소스
    const editShipArray = {
    newValue,
    removedValue
  }
  */

  const { status } = await addShipsByFleet(shipByFleet)

  if (isStatusOk(status)) {
    const { id } = shipByFleet
    initShips.value.forEach((ship) => {
      if (newValue.includes(ship.imoNumber)) {
        ship.fleetId = id
        ship.fleetName = fleetName
      }

      if (removedValue.includes(ship.imoNumber)) {
        ship.fleetId = null
        ship.fleetName = null
      }
    })

    // 선단 목록 갱신
    fleets.value = await fleetStore.fetchFleetsByVoccId(props.voccId)
  }

  oldShipKeys = [...selectedShipsKeys.value]
  showResMsg('선단에 소속된 선박 목록이 업데이트 되었습니다')

  console.log('선박 목록')
  console.dir(initShips.value)

  const isExistEmptyFleet = initShips.value.some((ship) => ship.fleetId == null)

  if (isExistEmptyFleet) {
    isShowInfoModal.value = true
  }
}

/**
 * 동적 컴포넌트 변경
 * 버튼에 따라 등록 폼, 수정 폼 변경
 */
const currentComponent = ref('NoSelectShip')
const componentList = {
  NoSelectShip,
  ShipInfoEditByUserForm,
  ShipInfoRegisterForm
}

const changeComponent = (name) => {
  currentComponent.value = name
}

/**
 * 선단 등록 팝업창
 */
const isShowAddModal = ref(false)
const showAddModal = () => {
  isShowAddModal.value = true
}
const closeAddModal = () => {
  isShowAddModal.value = false
}

/**
 * 선단 삭제 확인 팝업창
 */
const showModal = ref(false)
const modalMessage = ref('')
const showConfirmModal = (message) => {
  const { id, name } = selectedFleet.value
  if (!id) {
    showResMsg('선단을 선택해주세요')
  } else if (name == 'DEFAULT') {
    showResMsg('디폴트 선단은 삭제할 수 없습니다')
  } else {
    modalMessage.value = message
    showModal.value = true
  }
}
const closeConfirmModal = () => {
  showModal.value = false
}

const isShowInfoModal = ref()
const closeInfoModal = () => {
  isShowInfoModal.value = false
}

/**
 * 선단 삭제
 */
const removeFleet = async () => {
  const curFleedId = selectedFleet.value.id
  const { status } = await deleteFleet(curFleedId)

  if (isStatusOk(status)) {
    const instance = getDxGridInstance(fleetGrid)
    const index = fleets.value.findIndex((fleet) => fleet.id === curFleedId)
    fleets.value.splice(index, 1)
    showModal.value = false
    instance.option('focusedRowKey', null)
    dxGridRefresh(fleetGrid)
    initShips.value = []
    selectedFleet.value.id = null
    showResMsg('선택한 선단이 성공적으로 삭제되었습니다')
  }
}

defineExpose({
  reload
})

watch(() => props.voccId, fetchVoccFleets, { immediate: true })
</script>

<style></style>
