<template>
  <v-card title="LineChart" class="bg-card cardContainer h-100" min-height="230">
    <!-- <v-col> -->
    <Echart class="chart-container" :option="option" :style="option.style" autoresize></Echart>
    <!-- </v-col> -->
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import Echart from '@/components/echart/Echarts.vue'

const test = () => {
  window.open('/settings/account','_blank','location=no, width=480, height=600, staus=no,toolbar=no,menubar=no')
}

const option = ref({
  // style: 'height : 200px; width :100%',

  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Line1', 'Line2']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  // toolbox: {
  //   feature: {
  //     saveAsImage: {}
  //   }
  // },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    splitLine: {
      show: true,
      lineStyle: {
        color: '#54565F'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#54565F'
      }
    }
  },
  series: [
    {
      name: 'Line1',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Line2',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
      // markLine: {
      //   data: [
      //     {
      //       type: 'average'
      //       // x: 100,
      //       // y: 100
      //     }
      //   ],
      //   silent: false
      // }
    }
  ]
})
</script>

<style></style>
