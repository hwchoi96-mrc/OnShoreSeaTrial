<template>
  <v-sheet class="mx-3 mt-3 rounded-lg">
    <SelectedShipSummary />
  </v-sheet>
  <v-sheet
    class="mx-3 mt-3 mb-3 px-6 rounded-lg tabs-container ship-summary"
    style="overflow: hidden"
  >
    <v-tabs v-model="tab" color="#5789FE" class="tabs-button">
      <v-tab value="ciiList">Voyage CII List</v-tab>
      <v-tab value="simulation">CII Simulation</v-tab>
      <v-tab value="annulCii">Annual CII</v-tab>
    </v-tabs>

    <v-window v-model="tab" style="overflow: visible">
      <!-- CII Monitoring -->
      <v-window-item value="ciiList" style="height: calc(100vh - 199px)">
        <VoyageCIIList />
      </v-window-item>

      <!-- Simulation  -->
      <v-window-item
        value="simulation"
        style="height: calc(100vh - 65px - 58px - 62px - 24px - 24px)"
      >
        <CllSimulation />
      </v-window-item>

      <!-- Report -->
      <v-window-item value="annulCii" class="tabs-content-container ship-summary">
        <AnualCIIReport />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import AnualCIIReport from '@/views/voyage/cii/AnualCIIReport.vue'
import VoyageCIIList from '@/views/voyage/cii/VoyageCIIList.vue'
import CllSimulation from '@/views/voyage/cii/CIISimulation.vue'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'

const tab = ref(null)
</script>

<style scoped>
/* .cii-tab-container .v-window__container {
  flex: 1 1 auto;
}

.cii-tab-container .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
} */
</style>
