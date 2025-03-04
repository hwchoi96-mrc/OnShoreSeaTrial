<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col cols="4">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div>선박 목록</div>
          </v-card-title>
          <v-card-text>
            <!-- 선사 목록 -->
            <DxDataGrid
              ref="shipGrid"
              :data-source="ships"
              key-expr="imoNumber"
              :focused-row-enabled="activeStatus"
              :selected-row-keys="selectedRowKey"
              :on-focused-cell-changed="selectShip"
              @refresh-grid="refreshGrid"
              show-borders="true"
              class="tab-dx-grid"
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
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-sheet class="px-6 rounded-lg tabs-container">
          <v-tabs v-model="tab" color="#5789FE" align-tabs="left">
            <v-tab :value="tabItem[2]">선박제원관리</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item :value="tabItem[2]">
              <EquipmentManagement :selectedShipImoNumber="shipImoNumber" />
            </v-window-item>
          </v-window>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import FuelInformation from '@/views/settings/operation/tab/FuelInformation.vue'
import CIIInformation from '@/views/settings/operation/tab/CIIInformation.vue'
import EquipmentManagement from '@/views/settings/operation/tab/EquipmentManagement.vue'

import { useShipStore } from '@/stores/shipStore'
import { storeToRefs } from 'pinia'

const shipStore = useShipStore()
const { ships } = storeToRefs(shipStore)
const tab = ref(null)
const tabItem = ref(['cii', 'usedFuel', 'fuel'])

const selectedRowKey = ref()

const shipImoNumber = ref('')

onMounted(() => {
  init()
})

const init = async () => {
  await shipStore.fetchShipsByVocc()
  let shipsLength = ships.value.length
  if (shipsLength != 0) {
    let imoNumber = ships.value[0].imoNumber
    selectedRowKey.value = imoNumber
    shipImoNumber.value = imoNumber
  }
}

/**
 * 선박 선택
 */
const activeStatus = ref(true)
const selectShip = async (e) => {
  // 선택한 선박의 IMO 번호
  console.dir(e)
  const cellKey = e['row']['key']
  selectedRowKey.value = [cellKey]
  shipImoNumber.value = cellKey
}
</script>

<style scoped></style>
