<template>
  <v-chart ref="chart" autoresize :theme="currentEchartTheme" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { use, registerTheme, registerTransform } from 'echarts/core'
import blackTheme from '@/components/echart/theme/black.json'
import { useThemeStore } from '@/stores/themeStore.js'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import {
  BarChart,
  PieChart,
  LineChart,
  GaugeChart,
  PictorialBarChart,
  ScatterChart,
  HeatmapChart
} from 'echarts/charts'
import {
  GridComponent,
  MarkLineComponent,
  DataZoomComponent,
  BrushComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  TransformComponent,
  VisualMapComponent,
  MarkAreaComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  LineChart,
  GaugeChart,
  PictorialBarChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  MarkLineComponent,
  DataZoomComponent,
  BrushComponent,
  TransformComponent,
  VisualMapComponent,
  MarkAreaComponent,
  HeatmapChart
])

const store = useThemeStore()
let { currentEchartTheme } = storeToRefs(store)
const chart = ref()

const clearChart = () => {
  chart.value.clear()
}

defineExpose({ chart, clearChart })
registerTheme('echartBlackTheme', blackTheme)
</script>
