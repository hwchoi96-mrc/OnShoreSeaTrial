<template>
  <!-- <v-card class="bg-card cardContainer h-100" min-height="230"> -->
  <!-- <v-col> -->
  <Echart :option="option" :yAxis="yAxis" :title="title"></Echart>
  <!-- </v-col> -->
  <!-- </v-card> -->
</template>

<script setup>
import { ref } from 'vue'
import Echart from '@/components/echart/Echarts.vue'

const props = defineProps({
  series : {
    type : Object
  },
  yAxis : {
    type : Object
  },
  title : {
    type : String
  }
})

const option = ref({
  // style: 'height : 200px; width :100%',
  title : {
    text : props.title,
    left : 'left',
    textStyle : {
      color : '#fff',
      fontSize : 12,
      fontWeight : 'bolder'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: props.series['name'],
    right : 10
  },
  grid: {
    left: '3%',
    right: '8%',
    bottom: '3%',
    containLabel: true
  },
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
  yAxis: props.yAxis,
  series: props.series
})
</script>

<style></style>
