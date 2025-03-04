<template>
  <v-sheet class="mx-3 mt-3 rounded-lg">
    <SelectedShipSummary />
  </v-sheet>

  <v-sheet class="ma-3 px-3 rounded-lg tabs-container ship-summary">
    <v-tabs v-model="tab" class="tabs-button" color="#5789FE">
      <v-tab value="fuel">IMO Data Report</v-tab>
      <v-tab value="bdn">BDN Summaries</v-tab>
      <v-tab value="eepi">Collected Data Summaries</v-tab>
      <v-tab value="data">Part Ⅱ of the SEEMP</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="">
      <!-- Alert Monitoring-->
      <v-window-item value="fuel">
        <IMODataReport />
      </v-window-item>

      <!-- THRESHOLD -->
      <v-window-item value="bdn">
        <BDNSUmmaries />
      </v-window-item>

      <!-- Alert History  -->
      <v-window-item value="eepi">
        <CollectedDataSummaries />
      </v-window-item>

      <!-- Alert History  -->
      <v-window-item value="data">
        <EEDIPlanPart />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'

import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'
import IMODataReport from '@/views/report/imodcs/IMODataReport.vue'
import EEDIPlanPart from '@/views/report/imodcs/EEDIPlanPart.vue'
import BDNSUmmaries from '@/views/report/imodcs/BDNSummaries.vue'
import CollectedDataSummaries from '@/views/report/imodcs/CollectedDataSummaries.vue'

const tab = ref(null)
</script>

<style>
.cii-tab-container .v-window__container {
  flex: 1 1 auto;
}

.cii-tab-container .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
