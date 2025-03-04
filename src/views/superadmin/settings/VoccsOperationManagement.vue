<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div>선사별 선박 목록</div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <!-- 선사 목록 -->
                <DxDataGrid
                  id="groupGrid"
                  class="title-container"
                  ref="groupGrid"
                  key-expr="id"
                  :data-source="voccs"
                  :selected-row-keys="selectedVoccId"
                  :active-state-enabled="activeStatus"
                  :focused-row-enabled="activeStatus"
                  :on-focused-cell-changed="selectVocc"
                  :show-borders="true"
                >
                  <DxScrolling column-rendering-mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="id" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>
              <v-col>
                <!-- 선박 목록 -->
                <DxDataGrid
                  ref="shipGrid"
                  :data-source="ships"
                  key-expr="imoNumber"
                  ::active-state-enabled="activeStatus"
                  :focused-row-enabled="activeStatus"
                  :selected-row-keys="selectedShipImoNumber"
                  :on-focused-cell-changed="selectShip"
                  @refresh-grid="refreshGrid"
                  show-borders="true"
                  class="title-container"
                >
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
                    </div>
                  </template>

                  <DxSelection mode="single"></DxSelection>
                  <DxScrolling mode="virtual" />
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 사용자 목록 -->
      <v-col cols="6">
        <v-sheet class="px-6 rounded-lg tabs-container">
          <v-tabs v-model="tab" color="#5789FE" align-tabs="left">
            <v-tab :value="tabItem[2]">선박제원관리</v-tab>
            <!-- <v-tab :value="tabItem[0]">기준연료정보</v-tab> -->
          </v-tabs>
          <v-window v-model="tab">
            <!-- <v-window-item :value="tabItem[1]">
              <CIIInformation :selectedShipImoNumber=shipImoNumber />
            </v-window-item> -->
            <v-window-item :value="tabItem[2]">
              <VoccsEquipmentManagement :selectedShipImoNumber="shipImoNumber" />
            </v-window-item>
            <!-- <v-window-item :value="tabItem[0]">
              <FuelInformation />
            </v-window-item> -->
          </v-window>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useVoccStore } from '@/stores/voccStore'

import { getShipsByVoccId } from '@/api/voccApi'

import FuelInformation from '@/views/settings/operation/tab/FuelInformation.vue'
import CIIInformation from '@/views/settings/operation/tab/CIIInformation.vue'
import VoccsEquipmentManagement from '@/views/superadmin/settings/operation/VoccsEquipmentManagement.vue'
// import VoccsFuelInformation from '@/views/superadmin/settings/operation/VoccsFuelInformation.vue';
// import VoccsImoDcsInformation from '@/views/superadmin/settings/operation/VoccsImoDcsInformation.vue';
// import VoccsEquipmentManagement from '@/views/superadmin/settings/operation/VoccsEquipmentManagement.vue'
import { onMounted } from 'vue'
const tab = ref(null)
const tabItem = ref(['cii', 'usedFuel', 'fuel'])
const voccStore = useVoccStore()
const selectedVoccId = ref([])
const selectedShipImoNumber = ref([])
const shipImoNumber = ref()

const voccs = ref()
const _voccId = ref()

const ships = ref()

onMounted(() => {
  init()
})

const init = async () => {
  let voccId
  await fetchVoccs()
  voccId = voccs.value[0].id
  selectedVoccId.value = [voccId]
  await fetchShipsByVoccId(voccId)
}

/**
 * 선사 목록 조회
 */
const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs()
  voccs.value = result
}

/**
 * 선사 선택 시 해당 선사의 선박 목록 조회 함수 호출
 * @param {*} e
 */
const selectVocc = (e) => {
  console.dir(e)
  let voccId = e.row.key
  selectedVoccId.value = [voccId]
  shipImoNumber.value = null

  fetchShipsByVoccId(voccId)
}

/**
 * 선박 목록 조회
 * @param {*} voccId
 */
const fetchShipsByVoccId = async (voccId) => {
  ;({
    data: { data: ships.value }
  } = await getShipsByVoccId(voccId))

  if (ships.value.length != 0) {
    let shipId = ships.value[0].imoNumber
    selectedShipImoNumber.value = [shipId]
    shipImoNumber.value = shipId
  } else {
    shipImoNumber.value = null
  }
}

const selectShip = (e) => {
  let shipId = e.row.key
  shipImoNumber.value = shipId
  selectedShipImoNumber.value = [shipId]
}
</script>

<style scoped></style>
