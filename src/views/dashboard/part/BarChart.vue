<template>
  <v-card title="BarChart" class="bg-card cardContainer h-100" min-height="230">
    <EChart :option="option" :style="option.style" autoresize class="chart-container"></EChart>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'
import EChart from '@/components/echart/Echarts.vue'

const option = ref({
  // style: 'width :100%; height : 200px;',
  legend: {
    data: ['Evaporation', 'Precipitation']
  },
  xAxis: [
    {
      type: 'category',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#54565F'
        }
      },
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Precipitation',
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value} ml'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#54565F'
        }
      }
    }
  ],
  grid: {
    center: ['50%', '%50%']
  },
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' ml'
        }
      },
      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
    },
    {
      name: 'Precipitation',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' ml'
        }
      },
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    }
  ]
})
</script>
<style></style>
