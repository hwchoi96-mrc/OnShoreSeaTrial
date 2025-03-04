<template>
  <div class="d-flex ga-4 voyageDetail">
    <div class="alert-chart-container">
      <Echart :option="chartSeries"></Echart>
    </div>

    <DxDataGrid
      id="alertDetailGrid"
      ref="alertDetailGrid"
      :data-source="alertDetailInfo"
      key-expr="id"
      :show-borders="true"
      :focused-row-enabled="true"
      v-model:focused-row-key="focusedRowKey"
      style="pointer-events: none"
    >
      <!-- RaisedTime -->
      <DxColumn
        data-field="time"
        caption="Time"
        alignment="center"
        :allow-editing="false"
        cell-template="time-template"
      ></DxColumn>
      <template #time-template="{ data: templateOptions }">
        <div class="d-flex justify-center">
          <div>
            {{ convertDateTimeType(templateOptions.data.time) }}
          </div>
        </div>
      </template>

      <!-- Status -->
      <DxColumn
        data-field="status"
        caption="Status"
        alignment="center"
        :allow-editing="false"
        cell-template="alarm-type-template"
      />
      <template #alarm-type-template="{ data: templateOptions }">
        <div class="d-flex justify-center">
          <div class="" :class="getColorByAlarmType(templateOptions.data.status)">●</div>
        </div>
      </template>

      <!-- Value -->
      <DxColumn data-field="value" caption="Value" alignment="center" :allow-editing="false" />

      <!--Caution -->
      <DxColumn data-field="caution" alignment="center" header-cell-template="cautionLow-header" :allow-editing="false"/>
      <template #cautionLow-header="{ data }">
        <div class="d-flex align-center ga-2">
          <div class="caution">●</div>
          <div>Caution</div>
        </div>
      </template>
      <!-- Warning -->
      <DxColumn
        data-field="warning"
        alignment="center"
        :allow-editing="false" 
        header-cell-template="warningLow-header"
      />
      <template #warningLow-header="{ data }">
        <div class="d-flex align-center ga-2">
          <div class="warning">●</div>
          <div>Warning</div>
        </div>
      </template>

      <DxScrolling mode="infinite" />
      <!-- <DxPaging :page-size="6" /> -->
    </DxDataGrid>
  </div>
  <!-- <div>
    <p class="text-center desc">데이터가 없습니다</p>
  </div> -->
  <!-- {{ props.templateData.data }} -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { convertDateTimeType } from '@/composables/util'
import { getAlertDetailInfo } from '@/api/alarmApi'
import Echart from '@/components/echart/Echarts.vue'

const alertDetailInfo = ref(null)
const focusedRowKey=ref();

const props = defineProps({
  templateData: {
    type: Object
  },
  imoNumber: {
    type: [Object, String]
  },
  chartInterval: {
    type: [Object]
  }
})


const chartSeries = ref({
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
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    data: null,
    right: 10,
    bottom: 0
  },
  grid: {
    left: '5%',
    right: '8%',
    bottom: '15%',
    top: '12%'
    // containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    boundaryGap: [0, '30%']
  },
  series: [
    {
      name: null,
      type: 'line',
      data: [],
      markLine: {
        silent: true,
        lineStyle: {
          type: 'dashed',
          color: 'red'
        },
        data: [{ xAxis: null }]
      }
    }
  ]
})


const fetchAlertDetail = async () => {
  let chartIntervalMinute = props.chartInterval.minute

  const { raisedTime, tagId, caution, warning, description } = props.templateData.data

  let requestForm = {
    imoNumber: props.imoNumber,
    chartIntervalMinute,
    raisedTime,
    tagId,
    caution,
    warning
  }
  const {
    data: { data }
  } = await getAlertDetailInfo(requestForm)

  let chartData = data.map((chartData) => chartData.value)
  let dates = data.map((chartData) => convertDateTimeType(chartData.time))

  chartSeries.value.xAxis.data = dates
  chartSeries.value.series[0].data = chartData
  chartSeries.value.series[0].name = description
  chartSeries.value.series[0].markLine.data[0].xAxis = dates[3]

  alertDetailInfo.value = data
  //테이블에 있는 데이터 중에서
  //rasiedtime이랑 같은 행이 있다면
  //그 행은 강조처리
  const highlightId = alertDetailInfo.value
  .filter((item) => convertDateTimeType(item.time) === convertDateTimeType(raisedTime))
  .map((item) => item.id);

  focusedRowKey.value = parseInt(highlightId)

}

const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'Normal':
      alarmColor = 'normal'
      break
    case 'Caution':
      alarmColor = 'caution'
      break
    case 'Warning':
      alarmColor = 'warning'
      break
  }

  return alarmColor
}

watch(() => props.chartInterval, fetchAlertDetail)
onMounted(() => {
  fetchAlertDetail()
})
</script>

<style scoped>
#alertDetailGrid {
  height: 320px;
}

#alertDetailGrid td {
  height: 45px;
}

.alert-chart-container {
  flex: 1 1 0;
}

#alertDetailGrid {
  flex: 2 2 0;
}

.desc {
  font-size: 1.2em;
}
.normal {
  color: #42d2a7;
  border-color: #42d2a7;
}

.caution {
  color: #fff900;
}

.warning {
  color: #ff0000;
  border-color: #ff0000;
}

</style>
