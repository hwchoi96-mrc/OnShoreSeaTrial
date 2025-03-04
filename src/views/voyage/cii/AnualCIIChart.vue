<template>
  <!-- <v-sheet class="bg-card cardContainer h-100" min-height="230"> -->

  <EChart :option="option" :style="option.style" autoresize class="cii-chart"></EChart>
  <!-- </v-sheet> -->
</template>
<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useCiiStore } from '@/stores/ciiStore'
import { useToast } from '@/composables/useToast'

import { getMonthlyCiiData, getQuarterlyCiiData } from '@/api/cii.js'

import { convertFloatFormatObject, removeComma } from '@/composables/util'

import EChart from '@/components/echart/Echarts.vue'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)
const { showResMsg } = useToast()

const props = defineProps({
  selectedYear: {
    type: String,
    default: ''
  }
})

const monthlyCiiData = ref([])
let curSelectedImoNumber = null

let option = ref({
  grid: {
    bottom: 30,
    right: 5,
    left: '5%'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: 15
  },
  xAxis: {
    type: 'category',
    data: ['', '1', '2', '3', '4', '5', '6', '7', '8']
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#54565F'
      }
    }
    // max: 0
  },
  series: [
    // {
    //   name: 'Attained CII',
    //   data: 0,
    //   type: 'bar',
    //   smooth: true
    // },
    {
      name: 'Attained CII',
      color: '#FD8100',
      data: 0,
      type: 'line',
      smooth: true
    },
    {
      symbolSize: 0,
      name: 'Required CII',
      data: [],
      type: 'line',
      color: '#42D2A7'
    }
  ]
})

const fetchMonthlyCiiData = async () => {
  resetChartOption()

  console.log(props.selectedYear)
  curSelectedImoNumber = curSelectedShip.value.imoNumber

  if (!curSelectedImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  const {
    data: { data }
  } = await getQuarterlyCiiData(curSelectedImoNumber, props.selectedYear)

  if (data) {
    monthlyCiiData.value = data
  } else {
    monthlyCiiData.value = []
    return
  }

  // option.value.yAxis.max = monthlyCiiData.value.ciiGradeRangeE.second

  // monthlyCiiData.value.attainedCiiList.forEach((item) => removeComma(item))
  // monthlyCiiData.value.requiredCiiList.forEach((item) => removeComma(item))

  // option.value.yAxis.max = monthlyCiiData.value.ciiGradeRangeE.second
  // let attainedCII = [...monthlyCiiData.value.attainedCiiList]
  let attainedCII = [...monthlyCiiData.value.attainedCiiList]

  // let requiredCII = new Array(8).fill(monthlyCiiData.value.requiredCii)
  let requiredCII = [...monthlyCiiData.value.requiredCiiList]

  attainedCII.unshift('-')
  requiredCII.unshift('-')

  option.value.series[0].data = attainedCII
  option.value.series[1].data = requiredCII
  // option.value.series[2].data = requiredCII
  // option.value.series[2].markArea.data[0][1].yAxis = monthlyCiiData.value.ciiGradeRangeA.second
  // option.value.series[2].markArea.data[1][0].yAxis = monthlyCiiData.value.ciiGradeRangeB.first
  // option.value.series[2].markArea.data[1][1].yAxis = monthlyCiiData.value.ciiGradeRangeB.second
  // option.value.series[2].markArea.data[2][0].yAxis = monthlyCiiData.value.ciiGradeRangeC.first
  // option.value.series[2].markArea.data[2][1].yAxis = monthlyCiiData.value.ciiGradeRangeC.second
  // option.value.series[2].markArea.data[3][0].yAxis = monthlyCiiData.value.ciiGradeRangeD.first
  // option.value.series[2].markArea.data[3][1].yAxis = monthlyCiiData.value.ciiGradeRangeD.second
  // option.value.series[2].markArea.data[4][0].yAxis = monthlyCiiData.value.ciiGradeRangeE.first
  // option.value.series[2].markArea.data[4][1].yAxis = monthlyCiiData.value.ciiGradeRangeE.second
}

const resetChartOption = () => {
  let initSeries = [
    // {
    //   name: 'Attained CII',
    //   data: 0,
    //   type: 'bar',
    //   smooth: true
    // },
    {
      name: 'Attained CII',
      color: '#FD8100',
      data: 0,
      type: 'line',
      smooth: true
    },
    {
      symbolSize: 0,
      name: 'Required CII',
      data: [],
      type: 'line',
      color: '#42D2A7'
      // markArea: {
      //   emphasis: {
      //     disabled: true
      //   },
      //   data: [
      //     [
      //       {
      //         name: 'A',
      //         nameLocation: 'middle',
      //         label: {
      //           position: 'insideLeft',
      //           fontSize: '25px',
      //           color: '#fff'
      //         },
      //         yAxis: 0,
      //         itemStyle: {
      //           color: '#ADB2B81A'
      //           // opacity: 0.3,
      //         }
      //       },
      //       {
      //         yAxis: 0
      //       }
      //     ],
      //     [
      //       {
      //         name: 'B',
      //         nameLocation: 'vertical',
      //         label: {
      //           position: 'insideLeft',
      //           fontSize: '25px',
      //           color: '#fff'
      //         },
      //         yAxis: 0,
      //         itemStyle: {
      //           color: '#42D2A71A'
      //           // opacity: 0.3,
      //         }
      //       },
      //       {
      //         yAxis: 0
      //       }
      //     ],
      //     [
      //       {
      //         name: 'C',
      //         label: {
      //           position: 'insideLeft',
      //           fontSize: '25px',
      //           color: '#fff'
      //         },
      //         yAxis: 0,
      //         itemStyle: {
      //           color: '#FD81001A'
      //           //  opacity: 0.3,
      //         }
      //       },
      //       { yAxis: 0 }
      //     ],
      //     [
      //       {
      //         name: 'D',
      //         label: {
      //           position: 'insideLeft',
      //           fontSize: '25px',
      //           color: '#fff'
      //         },
      //         yAxis: 0,
      //         itemStyle: {
      //           color: '#FEBD191A'
      //           //  opacity: 0.3,
      //         }
      //       },
      //       { yAxis: 0 }
      //     ],
      //     [
      //       {
      //         name: 'E',
      //         label: {
      //           position: 'insideLeft',
      //           fontSize: '25px',
      //           color: '#fff'
      //         },
      //         yAxis: 0,
      //         itemStyle: {
      //           color: '#5789FE1A'
      //           // /opacity: 0.3,
      //         }
      //       },
      //       { yAxis: 0 }
      //     ]
      //   ]
      // }
    }
  ]

  nextTick(() => {
    option.value = { ...option.value, series: initSeries }
  })
}

watch(curSelectedShip, fetchMonthlyCiiData)
watch(() => props.selectedYear, fetchMonthlyCiiData)
// watch(monthlyCiiData, setChartOption, {deep : true})
</script>
<style></style>
