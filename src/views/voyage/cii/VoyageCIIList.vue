<template>
  <v-sheet class="detail-page rounded-lg h-100">
    <!-- 필터 -->
    <div class="d-flex justify-end ga-2 my-6">
      <div class="datePicker"><input type="date" v-model="startDate" :max="todayDate" /></div>
      <div class="datePicker">
        <input type="date" v-model="endDate" :min="startDate" :disabled="endDateStatus" />
      </div>
      <i-btn @click="filterDate()" text="조회" width="90"></i-btn>
    </div>

    <DxDataGrid
      id="cii-monitoring-grid"
      ref="ciiMonitoringGrid"
      class="tabs-date-filter-container"
      :data-source="ciiList"
      key-expr="id"
      :show-borders="true"
    >
      <DxSelection mode="single"></DxSelection>
      <DxColumn data-field="voyage" caption="id" alignment="center" :visible="false"></DxColumn>
      <DxColumn
        data-field="departure"
        caption="Departure"
        alignment="center"
        cell-template="departure-template"
        :allow-editing="false"
        width="10%"
        :calculate-sort-value="calculateSortDeparture"
      ></DxColumn>
      <template #departure-template="{ data: templateOptions }">
        <PortInfo
          :portName="templateOptions.data.departure"
          :time="templateOptions.data.departureTime"
          :country="templateOptions.data.departurePortInfo.country"
        >
        </PortInfo>
      </template>
      <DxColumn
        data-field="arrival"
        caption="Arrival"
        alignment="center"
        cell-template="arrival-template"
        :allow-editing="false"
        width="10%"
        :calculate-sort-value="calculateSortArrival"
      ></DxColumn>
      <template #arrival-template="{ data: templateOptions }">
        <PortInfo
          :portName="templateOptions.data.arrivalPortInfo.name"
          :time="templateOptions.data.arrivalTime"
          :country="templateOptions.data.arrivalPortInfo.country"
        >
        </PortInfo>
      </template>
      <DxColumn
        data-field="underway"
        caption="UnderWay(h)"
        alignment="center"
        header-cell-template="underway-header"
        :allow-editing="false"
        width="10%"
        :calculate-sort-value="calculateSortUnderway"
      >
      </DxColumn>
      <template #underway-header="{ data }">
        <p class="ellipsis">
          UnderWay <br />
          (h)
        </p>
      </template>
      <DxColumn
        data-field="distance"
        caption="Distance(nm)"
        alignment="center"
        header-cell-template="distance-header"
        :allow-editing="false"
        width="10%"
        :calculate-sort-value="calculateSortDistance"
      >
      </DxColumn>
      <template #distance-header="{ data }">
        <p class="ellipsis">
          Distance <br />
          (nm)
        </p>
      </template>
      <DxColumn
        data-field="speed"
        caption="Avg Speed(kn)"
        alignment="center"
        header-cell-template="speed-header"
        :allow-editing="false"
        width="10%"
        :calculate-sort-value="calculateSortAvgSpeed"
      >
      </DxColumn>
      <template #speed-header="{ data }">
        <p class="ellipsis">
          Avg <br />
          Speed<br />
          (kn)
        </p>
      </template>
      <DxColumn
        data-field="focMT"
        caption="FOC(mt)"
        alignment="center"
        header-cell-template="foc-header"
      >
        <DxColumn
          data-field="detailFocMap.MDO/MGO"
          caption="MDO/MGO"
          alignment="center"
          :visible="usedMDOMGO"
          :allow-editing="false"
          width="6%"
        />
        <DxColumn
          data-field="detailFocMap.HFO"
          caption="HFO"
          alignment="center"
          :visible="usedHFO"
          :allow-editing="false"
          width="6%"
          :calculate-sort-value="calculateSortHFO"
        />
        <DxColumn
          data-field="detailFocMap.LFO"
          caption="LFO"
          alignment="center"
          :visible="usedLFO"
          :allow-editing="false"
          width="6%"
          :calculate-sort-value="calculateSortLFO"
        />

        <DxColumn
          data-field="detailFocMap.LPG_P"
          caption="LPG"
          alignment="center"
          :visible="usedLPG"
          :allow-editing="false"
          width="6%"
          :calculate-sort-value="calculateSortLPG"
        />
        <DxColumn
          data-field="detailFocMap.LNG"
          caption="LNG"
          alignment="center"
          :visible="usedLNG"
          :allow-editing="false"
          width="6%"
          :calculate-sort-value="calculateSortLNG"
        />
      </DxColumn>
      <template #foc-header="{ data }">
        <p>
          FOC
          <br />
          (mt)
        </p>
      </template>
      <!-- Co2 Emission -->
      <DxColumn
        data-field="co2Emission"
        caption="Total CO₂,Emission(kn)"
        alignment="center"
        header-cell-template="totalEmission-header"
        :allow-editing="false"
        width="9%"
        :calculate-sort-value="calculateSortCO2"
      ></DxColumn>
      <template #totalEmission-header="{ data }">
        <p class="ellipsis">
          Total <br />
          Co2 Emission<br />
          (kn)
        </p>
      </template>
      <DxColumn
        data-field="requiredCii"
        caption="Required Cll"
        alignment="center"
        header-cell-template="requireCII-header"
        :allow-editing="false"
        width="9%"
        :calculate-sort-value="calculateSortRCII"
      >
      </DxColumn>
      <template #requireCII-header="{ data }">
        <p class="ellipsis">
          Required <br />
          CII<br />
          (value)
        </p>
      </template>
      <DxColumn
        data-field="attainedCii"
        caption="Attained Cll"
        alignment="center"
        header-cell-template="attainedCll-header"
        :allow-editing="false"
        width="9%"
        :calculate-sort-value="calculateSortACII"
      >
      </DxColumn>
      <template #attainedCll-header="{ data }">
        <p class="ellipsis">
          Attained <br />
          CII
          <br />
          (value)
        </p>
      </template>
      <DxColumn
        data-field="ciiRating"
        caption="Cll Rating"
        alignment="center"
        header-cell-template="rating-header"
        :allow-editing="false"
        width="9%"
        :calculate-sort-value="calculateSortCII"
      >
      </DxColumn>
      <template #rating-header="{ data }">
        <p class="ellipsis">
          CII <br />
          Rating <br />
          (%)
        </p>
      </template>

      <DxColumn
        data-field="ciiGrade"
        caption="Cll Grade"
        alignment="center"
        header-cell-template="grade-header"
        width="9%"
        :allow-editing="false"
      >
      </DxColumn>
      <template #grade-header="{ data }">
        <p class="ellipsis">
          CII <br />
          Grade
        </p>
      </template>

      <DxPaging />
      <DxScrolling mode="virtual"></DxScrolling>
    </DxDataGrid>
  </v-sheet>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import emitter from '@/composables/eventbus.js'
import PortInfo from '@/components/voyage/PortInfo.vue'
import cllRatingData from '@/assets/mockup/cllRatingData.json'
import { useToast } from '@/composables/useToast'
import { useCiiStore } from '@/stores/ciiStore'
import { useShipStore } from '@/stores/shipStore'
import { convertDateType, isValidDateRange, addDay } from '@/composables/util.js'
import { getDxGridInstance } from '@/composables/dxGridUtil.js'

const startDate = ref('')
const endDate = ref('')

const ciiStore = useCiiStore()
const { ciiList } = storeToRefs(ciiStore)

const shipStore = useShipStore()
const { curSelectedShip, usedFuels } = storeToRefs(shipStore)

const { showResMsg } = useToast()

const fules = ['mdo', 'lfo', 'hfo', 'lpg']

const usedMDOMGO = ref(false)
const usedLFO = ref(false)
const usedHFO = ref(false)
const usedLPG = ref(false)
const usedLNG = ref(false)

const todayDate = ref()
const endDateStatus = ref(true)

const ciiMonitoringGrid = ref('')
const ciiMonitoringInstance = ref('')
onMounted(() => {
  ciiMonitoringInstance.value = getDxGridInstance(ciiMonitoringGrid)

  let today = new Date()
  todayDate.value = convertDateType(today)
  fetchCiiListByImoNumber()
})

const getUsedFuelStatus = () => {
  usedMDOMGO.value = usedFuels.value.includes('MDO') || usedFuels.value.includes('MGO')
  usedLFO.value = usedFuels.value.includes('LFO')
  usedHFO.value = usedFuels.value.includes('HFO')
  usedLNG.value = usedFuels.value.includes('LNG')
  usedLPG.value = usedFuels.value.includes('LPG')
}

const fetchCiiListByImoNumber = async () => {
  let imoNumber = curSelectedShip.value.imoNumber

  if (!imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  await ciiStore.fetchCiiListByImoNumber(imoNumber)
  getUsedFuelStatus()
}

const filterDate = () => {
  if (!startDate.value || !endDate.value) {
    ciiMonitoringInstance.value.clearFilter()
    return
  }
  if (!isValidDateRange(startDate.value, endDate.value)) {
    showResMsg('도착시각이 출발시각보다 빠릅니다')
    return
  }

  let addedEndDate = addDay(endDate.value, 1)
  addedEndDate = convertDateType(addedEndDate)

  ciiMonitoringInstance.value.filter(['departureTime', '>=', startDate.value], 'and', [
    'departureTime',
    '<=',
    addedEndDate
  ])
}

watch(startDate, () => {
  if (startDate.value) {
    endDateStatus.value = false
  } else {
    endDateStatus.value = true
  }
})

watch(curSelectedShip, fetchCiiListByImoNumber)

const calculateSortDeparture = (rowData) => {
  return rowData.departureTime
}
const calculateSortArrival = (rowData) => {
  return rowData.arrivalTime
}
const calculateSortDistance = (rowData) => {
  return calculateSort(rowData.distance)
}
const calculateSortUnderway = (rowData) => {
  return calculateSort(rowData.underway)
}
const calculateSortAvgSpeed = (rowData) => {
  return calculateSort(rowData.speed)
}
const calculateSortCO2 = (rowData) => {
  return calculateSort(rowData.co2Emission)
}
const calculateSortRCII = (rowData) => {
  return calculateSort(rowData.requiredCii)
}
const calculateSortACII = (rowData) => {
  return calculateSort(rowData.attainedCii)
}
// const calculateSortMDO = (rowData) =>{
//   return calculateSort(rowData.detailFocMap.MDO/MGO)
// }
const calculateSortLFO = (rowData) => {
  return calculateSort(rowData.detailFocMap.LFO)
}
const calculateSortHFO = (rowData) => {
  return calculateSort(rowData.detailFocMap.HFO)
}
const calculateSortLPG = (rowData) => {
  return calculateSort(rowData.detailFocMap.LPG_P)
}
const calculateSortLNG = (rowData) => {
  return calculateSort(rowData.detailFocMap.LNG)
}

const calculateSort = (value) => {
  if (value == undefined || value == null) {
    value = '0.0'
  }
  if (value.includes(',')) {
    value = value.replace(/,/g, '')
  }
  if (value.includes('-')) {
    value = value.replace(/-/g, '')
  }
  if (value.includes('.')) {
    //실수형이라면
    value = parseFloat(value)
  } else {
    //정수형이면
    value = parseInt(value)
  }

  return value
}
</script>

<style scoped>
.cargoCapacityContainer {
  background-color: #111115;
}

.v-btn.inactive {
  background-color: #111115;
  color: #ffffff80;
}

.v-btn.active {
  color: #fff;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
