<template>
  <div class="radarContainer h-100 area-container content">
    <v-img :src="radarImage" cover></v-img>
    <div class="raderName text-center mt-2">X-Band Rader</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// import radarImage from '/images/ins/radar.png'


const ONE_MINUTES_TO_SECONDS = 1000

let interval = ''

onMounted(() => {
  interval = setInterval(getXBandRaderUrl, ONE_MINUTES_TO_SECONDS);
})


onUnmounted(() => {
  clearInterval(interval)
})

const getXBandRaderUrl = () => {
}

</script>

<style scoped>
.raderName {
  color: #ffffffab;
  text-decoration: underline;
}

.radarContainer .v-responsive.v-img{
  height: calc(100% - 35px);
}
</style>