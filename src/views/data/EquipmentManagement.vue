<template>
  <v-sheet class="ma-6 px-6 rounded-lg tabs-container">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab value="monitoring">MANAGEMENT</v-tab>
      <v-tab value="sensor">ANALYSIS</v-tab>
    </v-tabs>
    <v-window v-model="tab">

      <v-window-item value="monitoring">
        <DataChartManagement />
      </v-window-item>


      <v-window-item value="sensor">
        <DataAnalysis />
      </v-window-item>
    </v-window>


    <!-- <v-window v-model="tab" class="analysis-tab-container d-flex flex-column">
        
        <v-window-item value="monitoring">
          <DataChartManagement />
        </v-window-item>

        
        <v-window-item value="sensor">
          <DataAnalysis />
        </v-window-item>
      </v-window> -->
  </v-sheet>

</template>

<script setup>
import { ref } from 'vue'

import DataChartManagement from '@/views/data/DataChartManagement.vue'
import DataAnalysis from '@/views/data/DataAnalysis.vue';

const tab = ref(null)
</script>

<style scoped>
.normal {
  color: #42D2A7;
  border-color: #42D2A7;
}

.warning {
  color: #FD8100
}

.danger {
  color: #F04A4A;
  border-color: #F04A4A;
}

.alarm-type {
  font-size: 1.2em;
  ;
}

.w-40 {
  width: 40%;
}

.analysis-container {
  height: calc(100vh - 65px - 32px);
}

.analysis-tab-container {
  height: calc(100% - 60px);
}

.v-window.analysis-tab-container .v-window__container {
  flex: 1 1 auto;
}
</style>
