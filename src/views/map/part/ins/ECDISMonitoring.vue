<template>
  <div class="area-container content pa-4">
    <v-img src="https://marinegyaan.com/wp-content/uploads/2016/06/ECDIS-1-1.jpg" cover></v-img>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'


const ONE_MINUTES_TO_SECONDS = 1000

let interval = ''

onMounted(()=>{
  interval = setInterval(getImageUrl , ONE_MINUTES_TO_SECONDS);
})

onUnmounted(()=>{
  clearInterval(interval)
})

const getImageUrl = () => {

}

</script>

<style>

</style>