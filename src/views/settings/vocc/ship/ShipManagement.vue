<template>
  <v-container fluid class="h-100 detail-page settings">
    <v-row class="h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-center">선박명</div>
              <div v-if="displayByRole">
                <i-btn
                  text="새 선박 등록"
                  @click="changeComponent('ShipInfoRegisterForm')"
                  color="#3D3D40"
                  prepend-icon="mdi-plus"
                  width="120"
                ></i-btn>
                <i-btn
                  @click="showConfirmModal('정말로 선택한 선박을 삭제 하시겠습니까?')"
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
              ref="shipGrid"
              :data-source="ships"
              key-expr="imoNumber"
              class="tab-dx-grid"
              :show-borders="true"
              :active-state-enabled="activeStatus"
              :focused-row-enabled="activeStatus"
              :on-focused-cell-changed="selectShip"
              @refresh-grid="refreshGrid"
            >
              <DxScrolling column-rendering-mode="virtual" />
              <DxColumn
                data-field="imoNumber"
                caption="imoNumber"
                :visible="false"
                class="pl-10"
                :allow-editing="false"
              ></DxColumn>
              <DxColumn
                data-field="name"
                caption="선박명"
                :allow-editing="false"
                cell-template="shipName-template"
              >
              </DxColumn>
              <template #shipName-template="{ data: templateOptions }">
                <div class="d-flex justify-space-between align-center">
                  <div>{{ templateOptions.data.name }}</div>
                  <i-btn
                    v-if="displayByRole"
                    text="이미지 변경"
                    @click="changeComponent('ShipImageEditForm')"
                  ></i-btn>
                </div>
              </template>
            </DxDataGrid>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div>선박정보</div>
          </v-card-title>
          <v-card-text>
            <!-- 24.07.02 [이채원 사원] -->
            <component
              :is="componentList[currentComponent]"
              :voccId="voccId"
              :shipImoNumber="shipImoNumber"
              style="background-color: #1f1e1e"
              @change-component="changeComponent"
              @updateShipInfo="updateShipInfo"
              @registerShipInfo="fetchVoccShips"
            >
            </component>
            <!-- <ShipInfoEditByUserForm :shipImoNumber="shipImoNumber" ></ShipInfoEditByUserForm> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <AppModal v-model="showModal" @close="closeConfirmModal">
    <template #default>
      {{ modalMessage }}
    </template>

    <template #actions>
      <div v-if="shipImoNumber">
        <i-btnGroup type="delete" @close="closeConfirmModal" @delete="removeShip"></i-btnGroup>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, onMounted, computed, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useVoccStore } from '@/stores/voccStore'
import { useToast } from '@/composables/useToast'

import { displayByUserRole } from '@/composables/util'
import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil'

import NoSelectShip from '@/components/NoSelectShip.vue'
import ShipInfoEditByUserForm from '@/views/settings/vocc/ship/form/ShipInfoEditByUserForm.vue'
import ShipInfoRegisterForm from '@/views/settings/vocc/ship/form/ShipInfoRegisterForm.vue'
import ShipImageEditForm from '@/views/settings/vocc/ship/form/ShipImageEditForm.vue'
import AppModal from '@/components/modal/AppModal.vue'

const { showResMsg } = useToast()
const shipStore = useShipStore()
const { ships } = storeToRefs(shipStore)

const voccStore = useVoccStore()
const { voccInfo } = storeToRefs(voccStore)

const shipImoNumber = ref('')
const shipsByVocc = ref('')

const shipGrid = ref()
provide('shipGrid', shipGrid)

let role
const voccId = ref()
/**
 * 선박 목록 조회
 */
onMounted(() => {
  fetchVoccShips()
  role = sessionStorage.getItem('userRole')
})

const displayByRole = computed(displayByUserRole)

const fetchVoccShips = async () => {
  voccId.value = voccInfo.value.id
  await shipStore.fetchShipsByVocc()
  shipsByVocc.value = [...ships.value]
  console.dir(shipsByVocc)
}

/**
 * 선박 상세 조회
 */
const activeStatus = ref(true)
const selectShip = async (e) => {
  // 선택한 선박의 IMO 번호
  const cellKey = e['row']['key']
  shipImoNumber.value = cellKey
  changeComponent('ShipInfoEditByUserForm')
}

/**
 * 동적 컴포넌트 변경
 * 버튼에 따라 등록 폼, 수정 폼 변경
 */
const currentComponent = ref('NoSelectShip')
const componentList = {
  NoSelectShip,
  ShipInfoEditByUserForm,
  ShipInfoRegisterForm,
  ShipImageEditForm
}

const changeComponent = (name) => {
  const instance = getDxGridInstance(shipGrid)

  currentComponent.value = name
  if (name != 'ShipInfoEditByUserForm' && name != 'ShipImageEditForm') {
    instance.clearSelection()
    instance.option('focusedRowKey', null)
  }
}

/**
 * 선박 삭제 확인 팝업창
 */
const showModal = ref(false)
const modalMessage = ref('')
const showConfirmModal = (message) => {
  if (!shipImoNumber.value) {
    modalMessage.value = '선박을 선택해주세요'
  } else {
    modalMessage.value = message
  }
  showModal.value = true
}
const closeConfirmModal = () => {
  showModal.value = false
}

/**
 * 선박 삭제
 */
const removeShip = async () => {
  let imoNumber = shipImoNumber.value
  const instance = getDxGridInstance(shipGrid)
  const result = await shipStore.removeShip(imoNumber)

  // 24.07.02 [이채원 사원]
  if (result == 200)
    setTimeout(async () => {
      showModal.value = false
      await fetchVoccShips()
      /*
      이전 소스
      let index = ships.value.findIndex((ship) => ship.imoNumber == imoNumber)
      ships.value.splice(index, 1)
      */
      refreshGrid()
      instance.option('focusedRowKey', null)
      changeComponent('NoSelectShip')
    }, 500)
}

const refreshGrid = () => {
  dxGridRefresh(shipGrid)
}

const updateShipInfo = (shipNameInfo) => {
  let { originShipName, newShipName } = shipNameInfo
  let index = ships.value.findIndex((ship) => ship.name == originShipName)
  console.log('선박 목록')
  console.dir(ships.value)
  console.log('위치')
  console.log(index)
  ships.value[index].name = newShipName
}
</script>

<style scoped>
@media (max-height: 825px) {
  .tab-container {
    height: 724px;
    max-height: 724px;
    overflow-y: auto;
  }
}
</style>
