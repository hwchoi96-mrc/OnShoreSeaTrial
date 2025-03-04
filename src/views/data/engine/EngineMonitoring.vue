<template>
  <v-sheet class="mx-3 mt-3 rounded-lg">
    <SelectedShipSummary />
  </v-sheet>
  <v-sheet class="ma-3 px-3 rounded-lg tabs-container ship-summary">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab value="realtime">Real-time</v-tab>
      <v-tab value="timebased">Time-based</v-tab>
      <v-tab value="performance">Performance</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="">
      <component :is="currentComponent" />
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue'
import EngineRealTimeMonitoring from '@/views/data/engine/EngineRealTimeMonitoring.vue'
import EnginePeriodMonitoring from '@/views/data/engine/EnginePeriodMonitoring.vue'
import EquipmentPerformance from '@/views/data/engine/EnginePerformance.vue'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'

const tab = ref('realtime')
const currentComponent = computed(() => {
  switch (tab.value) {
    case 'realtime':
      return EngineRealTimeMonitoring
    case 'timebased':
      return EnginePeriodMonitoring
    case 'performance':
      return EquipmentPerformance
    default:
      return null
  }
})
</script>

<style scoped>
/* .engine-monitoring-page {
  height: calc(100vh - 65px - 32px);
  min-height: 600px;
  overflow: auto;
}
f
.engine-data-item {
  flex: 1 1 40%;
}

.engine-monitoring-container {
  height: 100%;
}

.engine-monitoring-container .v-window__container {
  flex: 1 1 auto;
}

.engine-monitoring-container .v-window-item {
  display: flex;
  flex: 1 1 auto;
  height: calc(100%);
} */

.title {
  font-size: 1.2em;
}
</style>
