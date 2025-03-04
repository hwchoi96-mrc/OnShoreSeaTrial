<template>
  <div class="d-flex ga-4 voyageDetail">
    <div class="charts-container">
      <Echart :option="drawChart" ref="test"></Echart>
    </div>

    <div class="equipment-container">
      <div class="d-flex ga-2 w-50 mb-4">
        <i-selectbox
          v-model="selectedEngineName"
          :items="shipEngineItems"
          variant="solo-filled"
          density="compact"
          class="equipmentSelector"
          bg-color="#434348"
          placeholder="Engine을 선택해주세요"
          :hide-details="true"
          @update:modelValue="selectEngine"
        ></i-selectbox>

        <i-input
          id="searchBox"
          v-model="searchDescription"
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          @input="searchByDescription"
          placeholder="Description을 입력해주세요"
        ></i-input>
      </div>

      <DxDataGrid
        id="alertHistoryDetailGrid"
        ref="historyDetailGrid"
        key-expr="tagId"
        @selection-changed="onSelectionChanged"
        :data-source="equipmentTags"
        :column-auto-width="false"
        :selected-row-keys="checkedTags"
        style="height: 300px"
      >
        <DxSelection mode="multiple" :recursive="true" show-check-boxes-mode="always"></DxSelection>

        <DxColumn
          data-field="equipNo"
          caption="Equip No"
          alignment="center"
          :allow-editing="false"
        />
        <DxColumn
          data-field="description"
          caption="Description"
          alignment="center"
          :allow-editing="false"
        />
        <DxColumn data-field="tagId" caption="Tag ID" alignment="center" :allow-editing="false" />

        <DxScrolling mode="virtual" />
      </DxDataGrid>
    </div>
  </div>
  <!-- <div v-else>
    <p class="text-center desc">데이터가 없습니다</p>
  </div> -->
  <!-- {{ props.templateData.data }} -->
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, mergeProps} from 'vue'
import { storeToRefs } from 'pinia'
import Echart from '@/components/echart/Echarts.vue'

import { getDxGridInstance } from '@/composables/dxGridUtil'
import { useShipStore } from '@/stores/shipStore'


const shipStore = useShipStore()
const { shipEngines } = storeToRefs(shipStore)

const historyDetailGrid = ref()

const props = defineProps({
  id: {
    type: [Number]
  },
  templateData: {
    type: Object
  },
  alarmDetailEngine: {
    type: String
  },
  tagIdDetail :{
    type: String
  },
  startDate: {
    type: [String]
  },
  endDate: {
    type: [String]
  },
  equipmentTags: {
    type: Object
  },
  checkedTags: {
    type: Object
  },
  chartHistories: {
    type: Object,
    default: null
  }
})

const selectedEngineName = ref(props.alarmDetailEngine)

const shipEngineItems = computed(() => {
  return shipEngines.value.filter((el) => el != 'All' || el != 'ALL')
})
const emit = defineEmits(['click', 'filterEngine'])

const test = ref()
const historyInstance = ref()

const onSelectionChanged = (e) => {
  let deselctedKey = e.currentDeselectedRowKeys

  let form = null
  const tagIds = e.selectedRowsData.map((el) => el.tagId)
  if (deselctedKey.length > 0) {
    form = {
      type: 'remove',
      tagIds: tagIds,
      deselctedKeys: deselctedKey
    }
  } else {
    form = {
      type: 'add',
      tagIds: tagIds
    }
  }
  emit('click', form)
}

const drawChart = computed(() => {
  return props.chartHistories
})

const selectEngine = () => {
  emit('filterEngine', selectedEngineName.value)
}

const searchDescription = ref('')
const searchByDescription = () => {
  historyInstance.value = getDxGridInstance(historyDetailGrid)
  historyInstance.value.searchByText(searchDescription.value)
}

watch(() => props.alarmDetailEngine,selectEngine, { immediate: true })


// const filteredEquipmentTags = computed(() => {
//   return props.equipmentTags.filter(item => item.tagId !== props.tagIdDetail);
// });
// watch(() => props.equipmentTags,{ immediate: true });

// let intervalId = null;

// const startBlinkingEffect = () => {
//   intervalId = setInterval(() => {
//     let series = drawChart.value.series[0].lineStyle;
//     // 반짝임 효과 색상 전환
//     if (series.color === '#5470C6') {
//       series.color = '#cad2ed';
//       series.shadowColor = 'rgba(255, 0, 0, 0.5)';
//     } else {
//       series.color = '#5470C6';
//       series.shadowColor = 'rgba(84, 112, 198, 0.5)';
//     }
//   }, 2000); // 1초 간격으로 반짝임 효과 적용
// };

// onMounted(() => {
//   startBlinkingEffect();
// });

// onBeforeUnmount(() => {
//   clearInterval(intervalId);
// });

</script>

<style>
#alertDetailGrid {
  height: 320px;
}

#alertDetailGrid td {
  height: 45px;
}

.desc {
  font-size: 1.2em;
}

.normal {
  color: #42d2a7;
  border-color: #42d2a7;
}

.warning {
  color: #fd8100;
}

.danger {
  color: #f04a4a;
  border-color: #f04a4a;
}

.charts-container {
  flex: 1 1 0;
}

.equipment-container {
  flex: 1 1 0;
}
</style>
