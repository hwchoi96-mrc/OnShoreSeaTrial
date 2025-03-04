<template>
  <v-container>
    <v-row class="title pl-2 mb-2">■ {{ title }}</v-row>
    <v-row>
      <v-col v-for="[key, value] of Object.entries(items)" :key="key" class="d-flex border pa-2" :cols="cols">
        <v-col class="text-left key">{{ key }}</v-col>
        <v-col class="">{{ convertNumberFormat(value) }}</v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { convertNumberFormat } from '@/composables/util.js'

defineProps({
  title : {
    type : String
  },

  items: {
    type: Object
  },
  cols: {
    type: String
  }
})

/**
 * items 예시
 * 
 const items = {
  power: '70kw',
  scavAirPress: '7.2kg',
  load: '20%',
  scavAirTemp: '13.5',
  speed: '50kw',
  MainLOPress: '80kw',
  SFOC: '50g', 
  BSFC: '20kw'
}
 */
</script>

<style scoped>
.title {
  font-size : 1.1em;
}

.border {
  border: 1px solid #ddd;
}

.v-col-12.border:nth-child(odd) {
  background: #49494E;
}

.v-col-6.border:nth-child(4n + 1){
  background: #49494E;
}

.v-col-6.border:nth-child(4n + 2) {
  background: #49494E;
}
</style>
