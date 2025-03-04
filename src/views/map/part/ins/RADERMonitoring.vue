<template>
  <v-carousel v-model="slide" show-arrows :hide-delimiter-background="true" hide-delimiters height="310">
    <v-carousel-item :value="1">
      <XBandRader />
    </v-carousel-item>
    <v-carousel-item :value="2">
      <SBandRader />
    </v-carousel-item>
  </v-carousel>

</template>

<script setup>
import { ref } from 'vue'
import XBandRader from '@/views/map/part/ins/XBandRader.vue'
import SBandRader from '@/views/map/part/ins/SBandRader.vue'

const slide = ref(1)
</script>

<style>

</style>