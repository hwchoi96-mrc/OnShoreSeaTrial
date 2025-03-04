<template>
  <div class="area-container px-2">
    <!-- <div style="font-size:1.2em" class="mb-2">| Engine Performance</div> -->
    <div class=" d-flex justify-space-between align-center my-2">
      <div class="ciiList-title" style="font-size:1.2em">| Engine Performance</div>
      <i-btn icon="mdi-plus" width="30" height="30" color="transparent"></i-btn>
    </div>
    <v-carousel v-model="slide" show-arrows :hide-delimiter-background="true" hide-delimiters height="310">
      <v-carousel-item :value="chart" class="h-100">
        <EnginePerformanceChart />
      </v-carousel-item>
      <v-carousel-item :value="monitoring" class="h-100">
        <EngineDataMonitoring />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import EnginePerformanceChart from '@/views/map/part/engine/EnginePerformanceChart.vue'
import EngineDataMonitoring from '@/views/map/part/engine/EngineDataMonitoring.vue'

const slide = ref('chart')

</script>

<style>
</style>