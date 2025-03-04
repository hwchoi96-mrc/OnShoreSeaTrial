<template>
  <div class="d-flex flex-column h-100">
    <div class=" d-flex justify-space-between mb-2">
      <div class="d-flex align-center ga-2">
        <!-- <div class="align-center">Equipment</div> -->
        <i-selectbox v-model="equipmentName" :items="equipments" item-title="name" item-value="id" variant="solo-filled"
          density="compact" return-object class="equipmentSelector" bg-color="#434348"
          :hide-details="true"></i-selectbox>
      </div>
      <div class="d-flex ga-2">
        <div class="datePicker"><input type="date" v-model="startDate" /></div>
        <div class="datePicker"><input type="date" v-model="endDate" /></div>
        <i-btn @click="periodData()" text="조회" width="20"></i-btn>
      </div>
    </div>

    <div class="overflow-y-auto">
      <EChart class="area-container chart" :option="rpmOption"></EChart>
      <EChart class="area-container chart my-2" :option="areaOption" :style="areaOption.style" autoresize></EChart>
      <EChart class="area-container chart" :option="lineOption" :style="lineOption.style" autoresize></EChart>
      <EChart class="area-container chart my-2" :option="option" :style="option.style" autoresize></EChart>
      <EChart class="area-container chart" :option="barOption" :style="barOption.style" autoresize></EChart>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EChart from '@/components/echart/Echarts.vue'
const equipmentName = ref('ME1')
const startDate = ref('')
const endDate = ref('')


const equipments = [
  {
    id: 1,
    name: 'ME1'
  },
  {
    id: 2,
    name: 'ME2'
  },
  {
    id: 3,
    name: 'GE1'
  },
  {
    id: 4,
    name: 'GE2'
  },
  {
    id: 5,
    name: 'GE3'
  }
]


const option = ref({
  grid : {
    bottom : 30
  },
  xAxis: {},
  yAxis: {},
  title : {
    text: "Scatter Chart",
    left : 20,
    top : 10,
    textStyle :{
      color : '#fff',
      fontSize: '16px'
    }
  },
  series: [
    {
      symbolSize: 8,
      data: [
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68]
      ],
      type: 'scatter',
    }
  ]
})


const areaOption = ref({
  grid: {
    bottom: 30,
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top : 10,
    data: ['Engine Load']
  },
  title: {
    text: "Engine Load",
    left: 20,
    top: 10,
    textStyle: {
      color: '#fff',
      fontSize : '16px'
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2024-03-30', '2024-03-31', '2024-04-01', '2024-04-02', '2024-04-03', '2024-04-04', '2024-04-05'],
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
      name: 'Engine Load',
      type: 'line',
      areaStyle: {},
      data: [120, 132, 101, 134, 90, 230, 210]
    },
  ]
})

const lineOption = ref({
  grid: {
    bottom: 30,
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top : 10,
    right : 20,
    data: ['T/C Inlet', 'T/C Outlet']
  },
  title: {
    text: "T/C Inlet / Outlet",
    left: 20,
    top: 10,
    textStyle: {
      color: '#fff',
      fontSize: '16px'
    }
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
  series: [
    {
      name: 'T/C Inlet',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'T/C Outlet',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
})


const barOption = ref({
  grid : {
    bottom : 30,
    right : 10
  },
  legend: {
    top: 10,
    right : 20,
    data: ['Evaporation', 'Precipitation']
  },
  title: {
    text: "Bar Chart",
    left: 20,
    top: 10,
    textStyle: {
      color: '#fff',
      fontSize: '16px'
    }
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
      // name: 'Precipitation',
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

const rpmOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid : {
    bottom : 30,
  },
  legend: {
    top : 10,
    data: ['Engine RPM']
  },
  title: {
    text: "Engine RPM",
    left: 30,
    top: 10,
    textStyle: {
      color: '#fff',
      fontSize: '16px'
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2024-03-23', '2024-03-24', '2024-03-25', '2024-03-26', '2024-03-27', '2024-03-28', '2024-03-29','2024-03-30', '2024-03-31', '2024-04-01', '2024-04-02', '2024-04-03', '2024-04-04', '2024-04-05'],
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
      name: 'Engine RPM',
      type: 'line',
      center: ['50%', '60%'],
      data: [50, 55, 53, 52, 50, 52, 53, 50, 55, 53, 52, 50, 52, 53]
    },
  ]
})
</script>

<style scoped>
input[type=date] {
  background: #434348;
  /* border: 1px solid #49494E; */
  padding: 10px 15px;
  border-radius: 5px;
  width: 120px;
  font-size: 0.9em;
  border-color: transparent;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}

.equipmentSelector {
  width: 100px;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #5c5c5c;
  border-radius: 2px;
}

.area-container.chart{
  background: #2b2b2d !important;
  border-radius: 10px !important;
}
</style>