<template>
  <div class="tagList d-flex ga-3 w-50">
    <i-selectbox v-if="role == 'ROLE_LCC_ADMIN'" label="선사명" v-model="selectedVocc" :items="voccs" item-title="name"
      item-value="id" return-object variant="solo-filled" density="comfortable" hide-details>
    </i-selectbox>
    <i-selectbox label="선단명" v-model="selectedFleet" :items="fleetList" item-title="name" item-value="id" return-object
      variant="solo-filled" density="comfortable" hide-details placeholder="선단을 선택해주세요" no-data-text="선단 정보가 없습니다 "
      clearable>
    </i-selectbox>
    <i-selectbox label="선박명" v-model="selectedShip" :items="ships" item-title="name" item-value="imoNumber"
      return-object variant="solo-filled" density="comfortable" hide-details no-data-text="선박 정보가 없습니다"
      clearable></i-selectbox>
  </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore'
import { useFleetStore } from '@/stores/fleetStore'
import { useShipStore } from '@/stores/shipStore'
import { useMapStore } from '@/stores/mapStore'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const voccStore = useVoccStore()

const shipStore = useShipStore()

const fleetStore = useFleetStore()
const { fleets } = storeToRefs(fleetStore)

const mapStore = useMapStore()
const { clickedShipInfo } = storeToRefs(mapStore)

const voccs = ref();
const selectedVocc = ref();
const fleetList = ref();
const selectedFleet = ref();
const selectedShip = ref();
const ships = ref();

const role = ref('')
onMounted(() => {
  role.value = userInfo.value.role

  if (role.value == "ROLE_LCC_ADMIN") {
    fetchVoccAll()
  } else {
    getFleetList()
  }
})

const fetchVoccAll = async () => {
  const result = await voccStore.fetchVoccListAll();
  voccs.value = result;
  selectedVocc.value = voccs.value.filter(vocc => vocc.id == clickedShipInfo.value.voccId)[0]

  fetchFleetsByVoccId()
}

/**
 * 로그인한 사용자의 선단 목록 조회
 */
const getFleetList = async () => {
  await fleetStore.fetchFleetsByVocc()
  fleetList.value = fleets.value

  if (role.value !== "ROLE_LCC_ADMIN") {
    console.log('test')
    selectedFleet.value = fleetList.value[0]
  }
}

const fetchFleetsByVoccId = async () => {
  selectedFleet.value = ''
  selectedShip.value = ''
  const voccId = selectedVocc.value.id

  const result = await fleetStore.fetchFleetsByVoccId(voccId);
  fleetList.value = result.data;
}

const fetchShipscByFleetId = async () => {
  if (!selectedFleet.value) {
    selectedShip.value = ''
    ships.value = ''
  } else {
    const fleetId = selectedFleet.value.id
    const result = await shipStore.fetchShipsByFleetId(fleetId);
    ships.value = result;
    selectedShip.value = ships.value[0]
  }
}

watch(selectedVocc, fetchFleetsByVoccId, { deep: true, immediate: false })
watch(selectedFleet, fetchShipscByFleetId, { deep: true, immediate: false })
</script>

<style>

</style>