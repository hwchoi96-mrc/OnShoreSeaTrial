<template>
  <v-sheet class="mx-3 mt-3 rounded-lg">
    <SelectedShipSummary />
  </v-sheet>
  <v-sheet class="ma-3 px-3 rounded-lg tabs-container ship-summary">
    <v-tabs v-model="tab" class="tabs-button" color="#5789FE" style="position: relative">
      <v-tab value="ecdis">ECDIS</v-tab>
      <v-tab value="radar">RADAR</v-tab>
      <v-btn
        icon="mdi-fullscreen"
        @click="openINSMonitoringPopup"
        class="full-screen-button"
        v-if="displayByRole"
      ></v-btn>
    </v-tabs>

    <v-window v-model="tab">
      <!-- ECDIS Monitoring -->
      <v-window-item value="ecdis">
        <ECDISMonitoring />
      </v-window-item>

      <!-- RADAR Monitoring-->
      <v-window-item value="radar">
        <RADARMonitoring />
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

import ECDISMonitoring from '@/views/ins/ECDISMonitoring.vue'
import RADARMonitoring from '@/views/ins/RADARMonitoring.vue'
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
const openINSMonitoringPopup = () => {
  let imoNumber = curSelectedShip.value.imoNumber
  let tabName = tab.value
  let url = ''

  if (tabName == 'ecdis') {
    url = `/popup/monitoring/ecdis?imoNumber=${imoNumber}`
  } else if (tabName == 'radar') {
    url = `/popup/monitoring/radar?imoNumber=${imoNumber}`
  }

  openNewPopup(url)
}
</script>

<style scoped>
.full-screen-button {
  position: absolute;
  right: 0;
  top: 8%;
  background: #333334;
}
</style>
