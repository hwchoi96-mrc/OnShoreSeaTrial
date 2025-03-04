<template>
  <div class="pa-2 progressbar-container d-flex pointer-cursor">
    <div class="depature d-flex flex-column align-center justify-center">
      <div class="distance-title">{{ aisInfo.departure }}</div>
      <div class="desc">{{ aisInfo.departureTime }}</div>
    </div>

    <div class="slider d-flex align-end">
      <v-slider v-model="aisInfo.process" :thumb-size="10" color="#4E83FF" :thumb-label="true" rounded readonly
        hide-details class="progressBar pointer-cursor"></v-slider>
    </div>
    <div class="arrival d-flex flex-column align-center justify-center">
      <div class="distance-title">{{ aisInfo.arrival }}</div>
      <div class="desc">{{ aisInfo.arrivalTime }}</div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

import emitter from '@/composables/eventbus.js'

const mapStore = useMapStore()
const { aisInfo } = storeToRefs(mapStore)

const progress = ref(aisInfo.progress)


onMounted(() => {
  init()
})


const init = () => {
  if (!aisInfo.value.departure) {
    aisInfo.value.departure = '-'
  }

  if (!aisInfo.value.departureTime) {
    aisInfo.value.departureTime = '-'
  }

  if (!aisInfo.value.arrival) {
    aisInfo.value.arrival = '-'
  }

  if (!aisInfo.value.arrivalTime) {
    aisInfo.value.arrivalTime = '-'
  }
}


// emitter.on('fetchAisInfo', ())

</script>

<style scoped>
.progressbar-container {
  background: #282828;
  position: relative;
}

.progressBar-style {
  position: absolute;
  left: 25%;
  right: 23%;
  top: 40%;
}

.distance-title {
  font-size: 0.8em;
}

.desc {
  color: #ADB2B8;
  font-size: 0.8em;
  ;
}

.v-slider.v-input--horizontal>.v-input__control {
  min-height: 15px !important;
}

.w-20 {
  width: 20%;
}

.depature,
.arrival {
  flex: 1 1 20%
}

.slider {
  flex: 1 1 40%;
  position: relative;
}

.slider .v-input {
  position: absolute;
  width: 95%;
  bottom: -8px;
}


.progressbar-container {
  min-width: 300px;
}

@media screen and (max-width: 1250px) {
  .progressbar-container {
    min-width: 250px;
  }
}
</style>