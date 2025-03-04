<template>
  <!-- <v-card class="bg-card cardContainer h-100" min-height="230"> -->
  <!-- <v-col> -->
  <Echart :option="option"></Echart>
  <!-- </v-col> -->
  <!-- </v-card> -->
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Echart from '@/components/echart/Echarts.vue'

const props = defineProps({
  series: {
    type: Object
  },
  title: {
    type: String
  }
})

const orient = ref('horizontal')
onMounted(() => {
  if (props.series.length > 3) {
    orient.value = 'vertical'
  }
})

const option = ref({
  // style: 'height : 200px; width :100%',
  title: {
    text: props.title,
    left: 'left',
    textStyle: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bolder'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    orient: orient.value,
    data: props.series['name'],
    right: 10
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
    show: false
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
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#54565F'
      }
    }
  },
  series: props.series,
  markLine: {
    silent: true,
    lineStyle: {
      type: 'dashed',
      color: 'red'
    },
    data: [{ xAxis: 'Wed' }]
  }
})
</script>

<style></style>
