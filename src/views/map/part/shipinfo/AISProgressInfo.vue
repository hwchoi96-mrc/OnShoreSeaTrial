<template>
  <div style="margin-bottom: -25px;">
    <v-slider v-model="aisInfo.process" :thumb-size="18" :track-size="10" height="50" color="#4E83FF"
      thumb-label="always" rounded readonly hide-details class="progressBar">
    </v-slider>
    <div class="d-flex justify-space-between">
      <div>
        <div class="distance-title text-center">{{ aisInfo.departure }}</div>
        <div class="desc"> {{ aisInfo.departureTime }}</div>
      </div>
      <!-- <div style="background : white; color : black; border-radius : 50px; padding:5px; height : 30px; vertical-align:middle">68</div> -->
      <div>
        <div class="distance-title text-center">{{ aisInfo.arrival }}</div>
        <div class="desc">{{ aisInfo.arrivalTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

import emitter from '@/composables/eventbus.js'


const mapStore = useMapStore()
const { clickedShipInfo, aisInfo } = storeToRefs(mapStore)


// emitter.on('fetchAisInfo', ()=> {

// })
</script>

<style scoped>
.distance-title{
  font-size: 1em;
}

.desc{
  color : #ADB2B8;
  font-size: 1em;;
}

.v-slider.v-input--horizontal>.v-input__control{
  min-height: 15px !important;
}

</style>>