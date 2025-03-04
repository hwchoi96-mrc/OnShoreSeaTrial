<template>
  <v-card class="operation-info rounded-lg py-3">
    <v-card-text>
      <div class="d-flex">
        <div class="w-25">
          <div class="mb-1">목표 탄소 배출량</div>
          <i-input label="목표 탄소 배출량" v-model="ciiInfo.requiredCII"></i-input>
        </div>
        <div class="w-25 ml-4">
          <div class="mb-1">목표 등급</div>
          <i-selectbox bg-color="#434348" v-model="ciiInfo.targetGrade" :items="grade" density="compact"
            variant="solo-filled" hide-details></i-selectbox>
        </div>
        <div class="d-flex align-self-end"><i-btn @click="editImoDcsInfo" class="d-flex align-self-center ml-4 mb-2"
            text="수정"></i-btn></div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useShipStore } from '@/stores/shipStore.js'
import { storeToRefs } from 'pinia';
import { useOperationStore } from '@/stores/operationStore.js'

import { getShipOperationInfo } from '@/api/operationApi'
import _ from 'lodash'

import emitter from '@/composables/eventbus.js'
const operationStore = useOperationStore()
const shipStore = useShipStore()


const ciiInfo = ref({
  requiredCII: 0,
  targetGrade: 'A'
})

const props = defineProps({
  selectedShipImoNumber: {
    type: [String]
  }
})
const grade = ref([
  'A', 'B', 'C', 'D', 'E'
])

let imoNumber;
const fetchCiiInfo = async () => {
  // resetImoInfo()
  imoNumber = props.selectedShipImoNumber;

  if (imoNumber) {
    const { data: { data: detailDataMap } } = await getShipOperationInfo(imoNumber)
    let result = detailDataMap.detailDataMap
    const ciiInformation = _.pick(result, Object.keys(ciiInfo.value))

    if (!_.isEmpty(ciiInformation)) {
      ciiInfo.value = ciiInformation
    } else {
      resetImoInfo()
    }
  }
}

const editImoDcsInfo = () => {
  const data = {
    imoNumber: imoNumber,
    detailDataMap: ciiInfo.value
  }
  operationStore.editImoDcsInfo(data)
}

const resetImoInfo = () => {
  ciiInfo.value = {
    requiredCII: 0,
    targetGrade: 'A'
  }
}

watch(() => props.selectedShipImoNumber, fetchCiiInfo, { immediate: true })

</script>

<style></style>