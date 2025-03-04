<template>
  <div class="area-container d-flex flex-column h-100">
    <div class=" d-flex justify-space-between align-center my-1">
      <div class="ciiList-title">| CII Rating</div>
      <i-btn icon="mdi-plus" width="30" height="30" color="transparent"></i-btn>
    </div>

    <div class="overflow-y-auto" style="height: calc(100% - 30px);">
      <AnualCIIChart class="area-container content h-100"></AnualCIIChart>
      <AnualCIITable class="area-container my-4 pa-4" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import AnualCIIChart from '@/views/voyage/cii/AnualCIIChart.vue'
import AnualCIITable from '@/views/voyage/cii/AnualCIITable.vue'
</script>

<style scoped>
.ciiList-title {
  font-size: 1.2em;
}
</style>