<template>
  <v-card class="bg-card cardContainer h-100">

    <v-card-title>Design Color Concept</v-card-title>
    <v-card-text class="h-100">
      <div class="d-flex flex-nowrap chart-container">
        <div v-for="item in items" :key="item.code" :style="{ background: item.color }" class="d-flex flex-column justify-space-between py-3">
          <div class="colorCode text-center">{{ item.code }}</div>
          <div class="colorDesc">{{ item.desc }}</div>
        </div>
      </div>
    </v-card-text>

    <!-- <v-row class="mt-5 color-container">
        <v-col cols="2" style="background-color: #4e83ff">
          <v-row>
            <v-col class="colorCode">#4E83FF</v-col>
            <v-col class="colorDesc">Primary Color</v-col>
          </v-row>
        </v-col>
        <v-col v-for="item in items" :key="item.code" :style="{ background: item.color }">
          <v-row>
            <v-col class="colorCode">{{ item.code }}</v-col>
            <v-col class="colorDesc">{{ item.desc }}</v-col>
          </v-row>
        </v-col>
      </v-row> -->
  </v-card>
</template>

<script setup>
import { ref, reactive } from 'vue'

const items = ref([
  { color: '#4e83ff', code: '#4e83ff', desc: 'Primary Color' },
  { color: '#1F1E1E', code: '#1F1E1E', desc: 'Menu Bar Color' },
  { color: '#000000', code: '#000000', desc: 'Back Color' },
  { color: '#434348', code: '#434348', desc: 'Input Back Color' },
  { color: '#52545D', code: '#52545D', desc: 'Contents Color' },
  { color: '#5E616A', code: '#5E616A ', desc: '' },
  { color: '#ADB2B8', code: '#ADB2B8 ', desc: '' },
  { color: '#FEBD19', code: '#FEBD19 ', desc: '' },
  { color: '#42D2A7', code: '#42D2A7 ', desc: '' },
  { color: '#FD8100', code: '#FD8100 ', desc: '' }
])
</script>

<style scope>
.colorCode,
.colorDesc {
  font-size: 0.8em;
  font-family: 'Pretendard-Light';
}
</style>
