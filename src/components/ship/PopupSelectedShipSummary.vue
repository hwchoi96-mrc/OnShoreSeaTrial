<template>
  <v-sheet class="d-flex ga-12 rounded-lg px-6 py-2">
    <v-sheet v-if="hasNullKey" class="d-flex ga-4 w-75">
      <v-sheet class="d-flex align-center w-25">
        <!-- <v-btn class="mr-1">
          <v-img :src="vesselName"></v-img>
        </v-btn> -->
        <div
          class="mr-3 d-inline-flex justify-center"
          style="background-color: #4758b8; border-radius: 50%; width: 40px; height: 40px"
        >
          <v-img :src="vesselName" max-width="20"></v-img>
        </div>
        <div>
          <div class="vessel-info-title">Vessel Name</div>
          <div>{{ curSelectedShipInfo.name }}</div>
        </div>
      </v-sheet>
      <v-sheet class="d-flex align-center ga-2 w-25">
        <div
          class="mr-3 d-inline-flex justify-center"
          style="background-color: #4758b8; border-radius: 50%; width: 40px; height: 40px"
        >
          <v-img :src="vesselType" max-width="20"></v-img>
        </div>
        <div>
          <div class="vessel-info-title">Vessel Type</div>
          <div>{{ curSelectedShipInfo.type }}</div>
        </div>
      </v-sheet>
      <v-sheet class="d-flex align-center ga-2 w-25">
        <div
          class="mr-3 d-inline-flex justify-center"
          style="background-color: #4758b8; border-radius: 50%; width: 40px; height: 40px"
        >
          <v-img :src="imoNumber" max-width="15"></v-img>
        </div>
        <div>
          <div class="vessel-info-title">IMO Number</div>
          <div>{{ curSelectedShipInfo.imoNumber }}</div>
        </div>
      </v-sheet>
      <v-sheet class="d-flex align-center ga-2 w-25">
        <div
          class="mr-3 d-inline-flex justify-center"
          style="background-color: #4758b8; border-radius: 50%; width: 40px; height: 40px"
        >
          <v-img :src="mmsiNumber" max-width="15"></v-img>
        </div>
        <div>
          <div class="vessel-info-title">MMSI Number</div>
          <div>{{ curSelectedShipInfo.mmsiNumber }}</div>
        </div>
      </v-sheet>
    </v-sheet>
    <v-sheet v-else>
      <div>선택한 선박이 없습니다.</div>
      <div>선박명을 클릭해주세요</div>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'

import { getShipInfo } from '@/api/shipApi'
const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)
import vesselName from '/images/ship/summary/vesselName.png'
import vesselType from '/images/ship/summary/vesselType.png'
import imoNumber from '/images/ship/summary/imoNumber.png'
import mmsiNumber from '/images/ship/summary/mmsiNumber.png'
import { onMounted } from 'vue'

const validationField = ['name', 'type', 'imoNumber', 'mmsiNumber']

const props = defineProps({
  curSelectedShipImoNumber: {
    type: String,
    default: null
  }
})

const curSelectedShipInfo = ref({
  name: '',
  type: '',
  imoNumber: '',
  mmsiNumber: ''
})

const fetchShipInfo = async () => {
  let selectedShipImoNumber = props.curSelectedShipImoNumber
  if (!selectedShipImoNumber) {
    return
  }
  const {
    status,
    data: { data }
  } = await getShipInfo(selectedShipImoNumber)

  const { name, type, imoNumber, mmsiNumber } = data
  curSelectedShipInfo.value = { name, type, imoNumber, mmsiNumber }
}

const hasNullKey = () => {
  return validationField.some((key) => curSelectedShip[key] === null)
}

watch(() => props.curSelectedShipImoNumber, fetchShipInfo, { immediate: true })
</script>

<style lang="scss" scoped>
.vessel-info-title {
  font-size: 0.8rem;
  color: #aaa;
}
</style>
>
