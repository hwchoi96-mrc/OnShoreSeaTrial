<template>
  <div class="radarContainer area-container content pa-4">
    <v-img src="https://marinegyaan.com/wp-content/uploads/2016/06/ECDIS-1-1.jpg"></v-img>
    <div class="raderName text-center mt-2">S-Band Rader</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'


const ONE_MINUTES_TO_SECONDS = 1000

let interval = ''

onMounted(() => {
  interval = setInterval(getSBandRaderUrl, ONE_MINUTES_TO_SECONDS);
})

onUnmounted(() => {
  clearInterval(interval)
})

const getSBandRaderUrl = () => {
}

</script>

<style scoped>
.raderName {
  color : #ffffffab;
  text-decoration: underline;
}


.radarContainer .v-responsive.v-img{
  height: calc(100% - 35px);
}
</style>