<template>
  <v-sheet class="mx-3 mt-3 rounded-lg">
    <SelectedShipSummary />
  </v-sheet>
  <v-sheet class="ma-3 px-3 rounded-lg tabs-container ship-summary" style="position: relative">
    <v-tabs v-model="tab" class="tabs-button" color="#5789FE">
      <v-tab value="monitoring">Real-time</v-tab>
      <v-tab value="history">Time-based</v-tab>
      <v-btn
        icon="mdi-fullscreen"
        @click="openCCTVMonitoringPopup"
        class="full-screen-button"
        v-if="displayByRole"
      ></v-btn>
    </v-tabs>

    <v-window v-model="tab">
      <!-- CII Monitoring -->
      <v-window-item value="monitoring">
        <CCTVMonitoring />
      </v-window-item>

      <!-- Sensor -->
      <v-window-item value="history">
        <CCTVHistory />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useShipStore } from '@/stores/shipStore'

import { openNewPopup, displayOnlySuperAdmin } from '@/composables/util'

import CCTVMonitoring from '@/views/ins/cctv/CCTVMonitoring.vue'
import CCTVHistory from '@/views/ins/cctv/CCTVHistory.vue'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const tab = ref(null)

const displayByRole = computed(() => {
  const result = displayOnlySuperAdmin()
  console.log(result)
  return result
})

const openCCTVMonitoringPopup = () => {
  let imoNumber = curSelectedShip.value.imoNumber
  let url = `/popup/monitoring/cctv?imoNumber=${imoNumber}`
  openNewPopup(url)
}
</script>

<style scoped>
.full-screen-button {
  position: absolute;
  right: 0;
  top: 5%;
  background: #333334;
}
</style>
