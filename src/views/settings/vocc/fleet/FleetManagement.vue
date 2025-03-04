<template>
  <v-container fluid class="h-100 detail-page settings">
    <v-row class="h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-center">선단 목록</div>
              <div v-if="displayByRole">
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

          <v-card-text>
            <DxDataGrid
              ref="fleetGrid"
              :data-source="fleets"
              key-expr="id"
              class="tab-dx-grid no-stripe"
              :active-state-enabled="activeStatus"
              :focused-row-enabled="activeStatus"
              :on-focused-cell-changed="selectFleet"
              :show-borders="true"
            >
              <DxScrolling column-rendering-mode="virtual" />
              <DxColumn data-field="name" caption="선단명" :allow-editing="false"></DxColumn>
            </DxDataGrid>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-self-center">선박 목록</div>
              <div v-if="displayByRole">
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
              :show-borders="true"
              :column-auto-width="true"
              :selected-row-keys="selectedRowKeys"
              @row-prepared="onRowPrepared"
              :show-column-lines="false"
              @selection-changed="onSelectionChanged"
              @editor-preparing="onEditorPreparing"
              :show-column-headers="false"
              :row-alternation-enabled="true"
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
import { ref, onMounted, computed, provide, onBeforeMount } from 'vue'

import ColTwoLayout from '@/layout/ColTwoLayout.vue'
import NoSelectShip from '@/components/NoSelectShip.vue'
import ShipInfoEditByUserForm from '@/views/settings/vocc/ship/form/ShipInfoEditByUserForm.vue'
import ShipInfoRegisterForm from '@/views/settings/vocc/ship/form/ShipInfoRegisterForm.vue'
import AppModal from '@/components/modal/AppModal.vue'
import { useToast } from '@/composables/useToast'
import { useFleetStore } from '@/stores/fleetStore'
import { useShipStore } from '@/stores/shipStore'
import { useAuthStore } from '@/stores/authStore'

import { storeToRefs } from 'pinia'
import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil'
import { displayByUserRole } from '@/composables/util'

const colType = ref(1)
const shipsByVocc = ref('')
const { showResMsg } = useToast()
const fleetStore = useFleetStore()
const { fleets } = storeToRefs(fleetStore)

const shipStore = useShipStore()
const { ships } = storeToRefs(shipStore)

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const shipImoNumber = ref('')
const selectedFleet = ref('')

const fleetGrid = ref()

let role = ''
/**
 * 선단 목록 조회
 */
onBeforeMount(() => {
  role = userInfo.value.role

  if (!role) {
    authStore.getMyInfo()
  }
})

onMounted(() => {
  // 선단 목록 조회
  fetchVoccFleets()
  // 선박 목록 조회
  if (ships.value.length == 0) {
    shipStore.fetchShipsByVocc()
  }
})

const displayByRole = computed(displayByUserRole)

const fetchVoccFleets = async () => {
  await fleetStore.fetchFleetsByVocc()
  // shipsByVocc.value = [...ships.value]
}

const fetchAllData = async () => {
  await fetchVoccFleets()
  await shipStore.fetchShipsByVocc()
}

/**
 * 선단별 선박 목록 조회
 */
const initShips = ref([])
// 선택한 선박 메뉴 key 배열
const selectedRowKeys = ref([])
let oldShipKeys = []

/**
 * 선단 선택 시 선박 목록 조회
 */
const activeStatus = ref(true)
const selectFleet = async (e) => {
  await fetchAllData()
  initShips.value = [...ships.value]

  const cellKey = e['row']['key']
  const fleetName = e['row']['cells'][0]['displayValue']

  selectedFleet.value = { id: cellKey, name: fleetName }
  const fleetInfo = fleets.value.find((item) => item.id === cellKey)

  selectedRowKeys.value = fleetInfo.imoNumberList

  oldShipKeys = selectedRowKeys.value
}

const onSelectionChanged = (e) => {
  selectedRowKeys.value = e.selectedRowKeys
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
  // console.log(e)
  if (e.rowType !== 'data') return
  // const isSelected = selectedRowKeys.value.includes(e.key);
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
  name: ''
})

// 24.07.09 [이채원 사원]
const registerFleet = () => {
  if (!fleetRegisterForm.value.name || fleetRegisterForm.value.name.trim() === '') {
    showResMsg('값을 입력하세요')
    return
  }
  fleetStore.registerFleet(fleetRegisterForm.value).then(() => {
    isShowAddModal.value = false
    fetchAllData() // 전체 데이터를 갱신합니다.
    fleetRegisterForm.value.name = ''
  })
}

const saveShipByFleet = async () => {
  const shipByFleet = {
    id: selectedFleet.value.id,
    imoNumberList: selectedRowKeys.value
  }

  const fleetName = selectedFleet.value.name
  // 기존 선단에 없는 선박 배열
  // 추가된 선박 배열

  let newValue = []
  let removedValue = []

  if (oldShipKeys.length > 0) {
    newValue = selectedRowKeys.value.filter((x) => !oldShipKeys.includes(x))
    removedValue = oldShipKeys.filter((x) => !selectedRowKeys.value.includes(x))
  } else {
    newValue = [...selectedRowKeys.value]
  }

  const editShipArray = {
    newValue,
    removedValue
  }

  await fleetStore.saveShipsByFleet(fleetName, shipByFleet, editShipArray)

  await fetchVoccFleets()
  oldShipKeys = [...selectedRowKeys.value]

  const isExistEmptyFleet = initShips.value.some((ship) => ship.fleetId == null)

  if (isExistEmptyFleet) {
    isShowInfoModal.value = true
  }
  showResMsg('선단에 소속된 선박 목록이 업데이트 되었습니다')
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
  // if(selectedRowKeys.value.length > 0){
  //   return;
  // }
  const result = await fleetStore.removeFleet(selectedFleet.value.id)

  if (result == 200) {
    setTimeout(() => {
      showModal.value = false
      const instance = getDxGridInstance(fleetGrid)
      instance.option('focusedRowKey', null)
      dxGridRefresh(fleetGrid)
      initShips.value = []
      selectedFleet.value.id = null
      showResMsg('선택한 선단이 성공적으로 삭제되었습니다')
    }, 500)
  }
}
</script>

<style></style>
