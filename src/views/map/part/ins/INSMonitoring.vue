<template>
  <div class="insContainer area-container d-flex flex-column">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab :value="cctv">CCTV</v-tab>
      <v-tab :value="ecdis">ECDIS</v-tab>
      <v-tab :value="radar">RADAR</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="insContainer-tab">
      <!-- CCTV -->
      <v-window-item>
        <CCTVMonitoring />
      </v-window-item>

      <!-- ECDIS -->
      <v-window-item>
        <ECDISMonitoring />
      </v-window-item>

      <!-- RADAR  -->
      <v-window-item>
        <RADERMonitoring />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CCTVMonitoring from '@/views/map/part/ins/CCTVMonitoring.vue'
import ECDISMonitoring from '@/views/map/part/ins/ECDISMonitoring.vue'
import RADERMonitoring from '@/views/map/part/ins/RADERMonitoring.vue'

const tab = ref('cctv')
</script>

<style>
.insContainer {
  height: calc(100% - 210px);
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.insContainer-tab {
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.insContainer-tab .v-window__container {
  flex: 1 1 auto;
}

.insContainer-tab .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>