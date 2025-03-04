<template>
  <div class="area-container d-flex flex-column px-2" style="height: calc(100vh - 210px); overflow:hidden;">
    <div class="d-flex justify-space-between align-center my-0">
      <div class="voyageList-title">| Voyage List</div>
      <i-btn @click="goDetailPage" icon="mdi-plus" width="30" height="30" color="transparent"></i-btn>
    </div>

    <DxDataGrid id="voyagelist-grid" :data-source="voyageList" :column-auto-width="true" :show-borders="false"
      :show-column-lines="false">
      <!-- 출발지 -->
      <DxColumn data-field="departure" caption="Departure" cell-template="departure-template" :allow-editing="false" />
      <template #departure-template="{ data: templateOptions }">
        <PortInfo :portName="templateOptions.data.departure" :time="templateOptions.data.departureTime"
          :country="templateOptions.data.departureCountry">
        </PortInfo>
      </template>
      <!-- 목적지  -->
      <DxColumn data-field="arrival" caption="Arrival" cell-template="arrival-template" :allow-editing="false" />
      <template #arrival-template="{ data: templateOptions }">
        <PortInfo :portName="templateOptions.data.arrival" :time="templateOptions.data.arrivalTime"
          :country="templateOptions.data.arrivalCountry">
        </PortInfo>
      </template>
      <!-- 운항시간 -->
      <DxColumn data-field="elapsedHours" :allow-editing="false" caption="Hours" alignment="center" />
      <!-- 운항거리 -->
      <DxColumn data-field="distance" :allow-editing="false" alignment="center" cell-template="distance-template" />
      <template #distance-template="{ data: templateOptions }">
        {{ convertNumberFormat(templateOptions.data.distance) }}
      </template>
      <!-- 항차번호 -->
      <DxColumn data-field="id" cell-template="track-template" caption="" :allow-editing="false" alignment="center">
      </DxColumn>
      <template #track-template>
        <v-btn icon="mdi-map" size="x-small"></v-btn>
      </template>

      <DxPaging :page-size="5" />
    </DxDataGrid>

  </div>
</template>
<script setup>
import {onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

import { convertNumberFormat, goPage } from '@/composables/util.js'

import PortInfo from '@/components/voyage/PortInfo.vue';

const mapStore = useMapStore()
const { clickedShipInfo, voyageList } = storeToRefs(mapStore);

onMounted(() => {
  fetchVoyageList()
})

const fetchVoyageList = async () => {
  let imoNumber = clickedShipInfo.value.imoNumber;
  await mapStore.fetchVoyageList(imoNumber)
}

const goDetailPage = () => {
  goPage('/voyage/report')
}
</script>

<style scoped>
.voyageList-title {
  font-size: 1.2em;
}

#voyagelist-grid{
  height: calc(100% - 30px);
}
</style>