<template>
  <v-card class="operation-info h-100 tabs-title-container">
    <v-card-title class="px-0 py-4 align-center tab-title ">
      운항 가능 추정 거리 및 예상 연료 충전 비용
    </v-card-title>
    <v-card-text class="pa-0">
      <v-sheet class="pa-6 ">
        <div class="d-flex w-100 align-center">
          <div class="w-30">
            <div class="mb-1">잔여연료(MGO)(M³)</div>
            <i-input label="잔여연료(MGO)(M³)" v-model="fuelInfo.residualMgo" disabled></i-input>
          </div>
          <div class="w-5 d-flex align-center justify-center">
            <div>X</div>
          </div>
          <div class="w-30">
            <div class="mb-1">기준 연료당 거리(NM)</div>
            <!-- <i-input label="기준 연료당 거리(NM)" v-model="fuelInfo.perMgoDistance"></i-input> -->
            <div></div>
            <v-text-field v-model="fuelInfo.perMgoDistance" @input="calcEstimatedDistanceMGO" variant="solo-filled"
              density="compact" bg-color="#434348" hide-details></v-text-field>
          </div>
          <div class="w-5 d-flex align-center justify-center">=</div>
          <div class="w-30">
            <div class="mb-1">운항 가능 추정 거리(NM)</div>
            <i-input label="운항 가능 추정 거리(NM)" v-model="fuelInfo.estimatedDistanceByMgo" disabled></i-input>
          </div>
        </div>
        <div class="d-flex w-100 my-5">
          <div class="w-30">
            <div class="mb-1">잔여연료(LNG)(M³)</div>
            <i-input label="잔여연료(LNG)(M³)" v-model="fuelInfo.residualLng" disabled></i-input>
          </div>
          <div class="w-5 d-flex align-center justify-center">X</div>
          <div class="w-30">
            <!-- <i-input label="기준 연료당 거리(NM)" v-model="fuelInfo.perLngDistance" ></i-input> -->
            <div class="mb-1">기준 연료당 거리(NM)</div>
            <v-text-field v-model="fuelInfo.perLngDistance" @input="calcEstimatedDistanceLNG" variant="solo-filled"
              density="compact" bg-color="#434348" hide-details></v-text-field>
          </div>
          <div class="w-5 d-flex align-center justify-center">=</div>
          <div class="w-30">
            <div class="mb-1">운항 가능 추정 거리(NM)</div>
            <i-input label="운항 가능 추정 거리(NM)" v-model="fuelInfo.estimatedDistanceByLng" disabled></i-input>
          </div>
        </div>
        <!-- 충전가능 연료 MGO -->
        <div class="d-flex w-100 ">
          <div class="w-30">
            <div class="mb-1">운항 가능 추정 거리(NM)</div>
            <i-input label="충전 가능 연료(MGO)(M³)" v-model="fuelInfo.chargeableMgo" disabled></i-input>
          </div>
          <div class="w-5 d-flex align-center justify-center">X</div>
          <div class="w-30">
            <div class="mb-1">기준 연료당 거리(원)</div>
            <!-- <i-input label="기준 연료당 거리(NM)" v-model="fuelInfo.perchargeableMgo"></i-input> -->
            <v-text-field v-model="fuelInfo.perchargeableMgo" @input="calcCostMGO" variant="solo-filled"
              density="compact" bg-color="#434348" hide-details></v-text-field>
          </div>
          <div class="w-5 d-flex align-center justify-center">=</div>
          <div class="w-30">
            <div class="mb-1">운항 가능 추정 거리(NM)</div>
            <i-input label="운항 가능 추정 거리(NM)" v-model="fuelInfo.chargeableCostMgo" disabled></i-input>
          </div>
        </div>
        <!-- 충전 가능 연료 LNG -->
        <div class="d-flex w-100  mt-5 ">
          <div class="w-30">
            <div class="mb-1">충전가능연료(LNG)(M³)</div>
            <i-input label="충전가능연료(LNG)(M³)" v-model="fuelInfo.chargeableLng" disabled></i-input>
          </div>
          <div class="w-5 d-flex align-center justify-center">X</div>
          <div class="w-30">
            <div class="mb-1">기준 연료당 거리(원)</div>
            <!-- <i-input label="기준 연료당 거리(원)" v-model="fuelInfo.perchargeableLng"></i-input> -->
            <v-text-field v-model="fuelInfo.perchargeableLng" @input="calcCostLNG" variant="solo-filled"
              density="compact" bg-color="#434348" hide-details></v-text-field>
          </div>
          <div class="w-5 d-flex align-center justify-center">=</div>
          <div class="w-30">
            <div class="mb-1">기준 단위당 충전 가능 연료 비용(원/M³)</div>
            <i-input label="기준 단위당 충전 가능 연료 비용(원/M³)" v-model="fuelInfo.chargeableCostLng" disabled></i-input>
          </div>
        </div>
        <div></div>
      </v-sheet>
    </v-card-text>
    <v-card-actions class="d-flex justify-end my-4">
      <!-- <i-btnGroup type="update" @update="editFuelInfo"></i-btnGroup> -->
      <i-btn @click="editFuelInfo" text="수정"></i-btn>
    </v-card-actions>


  </v-card>
</template>


<script setup>
import { ref, onMounted, computed, watch, watchEffect } from 'vue';
import { resetObject } from '@/composables/util'
import { storeToRefs } from 'pinia';
import { useOperationStore } from '@/stores/operationStore.js'
import { useShipStore } from '@/stores/shipStore.js'
import emitter from '@/composables/eventbus.js'

const opertaionStore = useOperationStore()
const { fuelInfo } = storeToRefs(opertaionStore)
const shipStore = useShipStore()
const { currentShip } = storeToRefs(shipStore)

// fuelInfo 정보
//   residualMgo : 0, // MGO 잔여연료
//   perMgoDistance : 0, // 기준 연료당 거리(MGO)
//   estimatedDistanceByMgo : 0, // MGO 운항가능 추정 거리
//   residualLng: 0, // LNG 잔여연료
//   perLngDistance: 0, // 기준 연료당 거리(LNG)
//   estimatedDistanceByLng: 0, // LNG 운항가능 추정거리
//   chargeableMgo : 0, // 충전 가능한 연료 (MGO)
//   perchargeableMgo : 0, // 기준 연료당 거리(원),
//   chargeableCostMgo : 0, // 기준 단위당 충전 가능 연료 비용(MCO)
//   chargeableLng: 0, // 충전 가능한 연료 (MGO)
//   perchargeableLng: 0, // 기준 연료당 거리(원),
//   chargeableCostLng: 0// 기준 단위당 충전 가능 연료 비용(MCO)

emitter.on('getCurrentShipEvent', () => {
  fetchShipOperationInfo();
});


const calcEstimatedDistanceMGO = () => {
  fuelInfo.value.estimatedDistanceByMgo = fuelInfo.value.residualMgo * fuelInfo.value.perMgoDistance
}
const calcEstimatedDistanceLNG = () => {
  fuelInfo.value.estimatedDistanceByLng = fuelInfo.value.residualLng * fuelInfo.value.perLngDistance
}
const calcCostMGO = () => {
  fuelInfo.value.chargeableCostMgo = fuelInfo.value.chargeableMgo * fuelInfo.value.perchargeableMgo
}
const calcCostLNG = () => {
  fuelInfo.value.chargeableCostLng = fuelInfo.value.chargeableLng * fuelInfo.value.perchargeableLng
}

// onMounted(()=>{
//   fetchShipOperationInfo()
// })


let imoNumber;
const fetchShipOperationInfo = () => {
  resetFuelInfo()
  imoNumber = currentShip.value['imoNumber']
  opertaionStore.fetchShipOperationInfo(imoNumber)
}

// watchEffect(fetchShipOperationInfo, { deep : true})

const editFuelInfo = () => {
  const data = {
    imoNumber: imoNumber,
    detailDataMap: fuelInfo.value
  }
  opertaionStore.editFuelInfo(data)
}
/**
 * TODO : 추후 잔여연료 , 충전 가능 연료 정보 조회하는 api 연동 필요
 */
const resetFuelInfo = () => {
  fuelInfo.value = {
    residualMgo: 10, // MGO 잔여연료
    perMgoDistance: 0, // 기준 연료당 거리(MGO)
    estimatedDistanceByMgo: 0, // MGO 운항가능 추정 거리
    residualLng: 10, // LNG 잔여연료
    perLngDistance: 0, // 기준 연료당 거리(LNG)
    estimatedDistanceByLng: 0, // LNG 운항가능 추정거리
    chargeableMgo: 10, // 충전 가능한 연료 (MGO)
    perchargeableMgo: 0, // 기준 연료당 거리(원),
    chargeableCostMgo: 0, // 기준 단위당 충전 가능 연료 비용(MCO)
    chargeableLng: 10, // 충전 가능한 연료 (MGO)
    perchargeableLng: 0, // 기준 연료당 거리(원),
    chargeableCostLng: 0 // 기준 단위당 충전 가능 연료 비용(MCO)
  }
}

watch(currentShip, fetchShipOperationInfo, { deep: true })
let boatName = ''
window.addEventListener("message", function (event) {
  console.log(event.origin)
  // if (event.origin === "http://localhost:5173"){

  //   console.log(event.data.boatName);

  // }

  // alert(event.data.boatName)
  boatName = event.data
}, false);


</script>

<style scoped>
.w-5 {
  width: 5%;
}

.w-30 {
  width: 30%;
}

.operation-info .v-card-text {
  border: 1px solid #585A61;
}
</style>