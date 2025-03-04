<template>
  <v-sheet class="mx-3 mt-3 rounded-lg">
    <SelectedShipSummary />
  </v-sheet>
  <v-sheet class="ma-3 px-3 rounded-lg tabs-container ship-summary">
    <v-tabs v-model="tab" class="tabs-button" color="#5789FE">
      <v-tab value="monitoring">Real-time</v-tab>
      <v-tab value="sensor">Sensor Management</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- FDS Monitoring
      <v-window-item value="monitoring">
        <FdsMonitoring />
      </v-window-item> -->

      <!-- Sensor Management
      <v-window-item value="sensor">
        <SensorManagement />
      </v-window-item> -->
      <component :is="currentComponent" />
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref , computed } from 'vue'

import FdsMonitoring from '@/views/fds/FdsMonitoring.vue'
import SensorManagement from '@/views/fds/SensorManagement.vue'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'

const tab = ref('monitoring')
const currentComponent = computed(() => {
  switch (tab.value) {
    case 'monitoring':
      return FdsMonitoring
    case 'sensor':
      return SensorManagement
    default:
      return null
  }
})
</script>

<style scoped></style>
