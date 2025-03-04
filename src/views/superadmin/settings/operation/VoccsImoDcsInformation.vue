<template>
  <v-card class="operation-info rounded-lg py-3">
    <v-card-text>
      <div class="d-flex">
        <div class="w-25">
          <div class="mb-1">목표 탄소 배출량</div>
          <i-input label="목표 탄소 배출량" v-model="imoInfo.requiredCII"></i-input>
        </div>
        <div class="w-25 ml-4">
          <div class="mb-1">목표 등급</div>
          <i-selectbox bg-color="#434348" v-model="imoInfo.targetGrade" :items="grade" density="compact" variant="solo-filled"
            hide-details></i-selectbox>
        </div>
        <div class="d-flex align-self-end"><i-btn @click="editImoDcsInfo" class="d-flex align-self-center ml-4 mb-2" text="수정"></i-btn></div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useShipStore } from '@/stores/shipStore.js'
import { storeToRefs } from 'pinia';
import { useOperationStore } from '@/stores/operationStore.js'
import emitter from '@/composables/eventbus.js'
const operationStore = useOperationStore()
const { imoInfo } = storeToRefs(operationStore)

const shipStore = useShipStore()
const { currentShip } = storeToRefs(shipStore)

const grade = ref([
  'A', 'B', 'C', 'D', 'E'
])

emitter.on('headerEvent', () => {
  fetchImoDcsInfo()
});

// onMounted(()=>{
//   fetchImoDcsInfo()
// })
let imoNumber;
const fetchImoDcsInfo = () => {
  resetImoInfo()
  imoNumber = currentShip.value['imoNumber']
  operationStore.fetchImoDcsInfo(imoNumber)

  console.dir(imoInfo.value)
}

const editImoDcsInfo = () => {
  const data = {
    imoNumber: imoNumber,
    detailDataMap: imoInfo.value
  }
  operationStore.editImoDcsInfo(data)
}

/**
 * TODO : 추후 잔여연료 , 충전 가능 연료 정보 조회하는 api 연동 필요
 */
const resetImoInfo = () => {
  imoInfo.value = {
    requiredCII: 0 ,
    targetGrade: 'A'
  }
}


watch(currentShip, fetchImoDcsInfo, { deep: true })

</script>

<style></style>