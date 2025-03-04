<template>
  <v-carousel v-model="slide" show-arrows :hide-delimiter-background="true" hide-delimiters height="310" class="ciiRating d-flex flex-column flex-grow-1 flex-shrink-1 ">
    <v-carousel-item :value="1">
      <CIIList></CIIList>
    </v-carousel-item>
    <v-carousel-item :value="2">
      <CIIChart></CIIChart>
    </v-carousel-item>
  </v-carousel>

</template>

<script setup>
import { ref } from 'vue'
import CIIList from '@/views/map/part/cii/CIIList.vue';
import CIIChart from '@/views/map/part/cii/CIIChart.vue';

const slide = ref(1)

</script>

<style >
.ciiRating .v-window__container {
  flex: 1 1 auto;
}

.ciiRating .v-carousel-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

</style>