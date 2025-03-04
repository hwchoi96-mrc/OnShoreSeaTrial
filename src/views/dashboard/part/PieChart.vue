<template>
  <v-card title="PieChart" class="bg-card cardContainer h-100">
    <!-- <v-col> -->
    <Echart :option="option" :style="option.style" class="chart-container" autoresize></Echart>
    <!-- </v-col> -->
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import Echart from '@/components/echart/Echarts.vue'

const option = ref({
  // style: 'width : 100%; height : 180px',
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '3%',
    left: 'center'
  },
  // color: colors,
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      top: '20%',
      label: {
        show: true,
        formatter(param) {
          return param.name + ' (' + param.percent * 2 + '%)'
        },
      },
      center: ['50%', '50%'],
      labelLine: {
        show: true
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
})
</script>

<style></style>
