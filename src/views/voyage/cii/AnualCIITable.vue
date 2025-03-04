<template>
  <!-- <v-data-table :headers="headers" :items="ciiData" :hide-default-footer="true" item-key="fuel">
    <template #body="{ items }">
      <tr v-for="(item, index) in items" :key="index">
        <td>{{ platformText(item.fuel) }}</td>
        <td class="text-center" v-for="(usage, month) in item.usage" :key="month">
          {{ usage }}
        </td>
      </tr>
    </template>
</v-data-table> -->
  <v-data-table
    ref="ciiTable"
    class="cii-table text-center pl-4"
    :headers="headers"
    :items="ciiData"
    style="--v-table-row-height: 38px"
    :style="ciiTableRowStyle"
  >
    <template v-slot:item.key="{ item }">
      {{ getKeyName(item.Key) }}
    </template>
    <template #bottom></template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useCiiStore } from '@/stores/ciiStore'
import { useToast } from '@/composables/useToast'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const ciiStore = useCiiStore()
// const { monthlyCiiData } = storeToRefs(ciiStore)
const { usedFuels } = storeToRefs(shipStore)
const { showResMsg } = useToast()

const props = defineProps({
  selectedYear: {
    type: String,
    default: ''
  }
})

const ciiTable = ref()

let tableElement = 0
let ciiTableHeight = ref(0)
let ciiTableRowHeight = ref(0)
let ciiTableRowStyle = ref()
let curSelectedImoNumber = null

const usedMDO = ref(false)
const usedMGO = ref(false)
const usedLFO = ref(false)
const usedHFO = ref(false)
const usedLPGP = ref(false)
const usedLPGB = ref(false)
const usedLNG = ref(false)

let ciiData = ref()
const fetchMonthlyCiiData = async () => {
  // ciiData.value = ciiData.value.fill('-');
  curSelectedImoNumber = curSelectedShip.value.imoNumber

  if (!curSelectedImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  ciiData.value = []

  const result = await ciiStore.fetchQuarterlyCiiData(curSelectedImoNumber, props.selectedYear)
  usedMDO.value = usedFuels.value.includes('MDO')
  usedMGO.value = usedFuels.value.includes('MGO')
  usedLFO.value = usedFuels.value.includes('LFO')
  usedHFO.value = usedFuels.value.includes('HFO')
  usedLNG.value = usedFuels.value.includes('LNG')
  usedLPGP.value = usedFuels.value.includes('LPGP')
  usedLPGB.value = usedFuels.value.includes('LPGB')

  if (result) {
    const {
      ciiGradeList,
      ciiRatingList,
      attainedCiiList,
      co2EmissionList,
      focTotalList,
      focHfoList,
      focMdoList,
      focMgoList,
      focLfoList,
      focLpgPList,
      focLpgBList,
      focLngList,
      speedList,
      distanceList
    } = result

    let data = {
      ciiGradeList,
      ciiRatingList,
      attainedCiiList,
      co2EmissionList,
      focTotalList,
      focHfoList,
      focLfoList,
      focMdoList,
      focMgoList,
      focLngList,
      focLpgPList,
      focLpgBList,
      speedList,
      distanceList
    }

    if (!usedMDO.value) {
      delete data.focMdoList
    }

    if (!usedMGO.value) {
      delete data.focMgoList
    }
    if (!usedLFO.value) {
      delete data.focLfoList
    }
    if (!usedHFO.value) {
      delete data.focHfoList
    }
    if (!usedLNG.value) {
      delete data.focLngList
    }
    if (!usedLPGP.value) {
      delete data.focLpgPList
    }
    if (!usedLPGB.value) {
      delete data.focLpgBList
    }

    lastYear.value = `${props.selectedYear - 1}년`
    thisYear.value = `${props.selectedYear}년`
    let monthlyCiiData = formattedData(data)

    ciiData.value = monthlyCiiData
    getTableRowHeight(monthlyCiiData)
  }
}

const getTableRowHeight = (test2) => {
  tableElement = document.querySelector('.cii-table')
  ciiTableHeight.value = tableElement.clientHeight
  console.log('길이')
  console.dir(test2)
  ciiTableRowHeight.value = (ciiTableHeight.value - 22) / ciiData.value.length
  nextTick(() => {
    console.log('행 개수')
    console.log(test2.length)

    console.log('테이블 높이')
    console.log(ciiTableHeight.value)

    console.log('행 높이')
    console.log(ciiTableRowHeight.value)
    tableElement.style.setProperty('--v-table-header-height', ciiTableRowHeight)
    ciiTableRowStyle.value = `--v-table-row-height: ${ciiTableRowHeight.value}px`
  })
}

const lastYear = ref()
const thisYear = ref()

const headers = computed(() => [
  { title: 'Key', align: 'start', value: 'key' },
  {
    title: lastYear.value,
    align: 'center',
    children: [
      { title: '1분기', value: '1' },
      { title: '2분기', value: '2' },
      { title: '3분기', value: '3' },
      { title: '4분기', value: '4' }
    ]
  },
  {
    title: thisYear.value,
    align: 'center',
    children: [
      { title: '1분기', value: '5' },
      { title: '2분기', value: '6' },
      { title: '3분기', value: '7' },
      { title: '4분기', value: '8' }
    ]
  }
])

const keyNames = {
  ciiGradeList: 'CII Grade',
  ciiRatingList: 'CII Rating',
  attainedCiiList: 'Attained CII',
  co2EmissionList: 'CO2 (t)',
  focTotalList: 'Fuel (t)',
  focHfoList: 'HFO (t)',
  focMdoList: 'MDO (t)',
  focMgoList: 'MGO (t)',
  focLfoList: 'LFO (t)',
  focLpgPList: 'LPG(P) (t)',
  focLpgBList: 'LPG(B) (t)',
  focLngList: 'LNG (t)',
  speedList: 'Speed(kn)',
  distanceList: 'Distance (nm)'
}

const formattedData = (data) => {
  let result = []
  for (const key in data) {
    const values = data[key]

    let obj = {}
    values.forEach((value, index) => {
      obj[index + 1] = value
    })
    obj['Key'] = key

    result.push(obj)
  }
  return result
}

const getKeyName = (key) => {
  return keyNames[key] || key
}

window.addEventListener('resize', getTableRowHeight)

watch(() => props.selectedYear, fetchMonthlyCiiData)
watch(curSelectedShip, fetchMonthlyCiiData)
</script>
<style lang="scss">
//복구
.v-data-table-footer {
  display: none !important;
}

.cii-table {
  > .v-table__wrapper {
    thead {
      background-color: #2f2f32;
    }
    > tr:nth-child(odd) {
      background-color: #222224;
    }
  }
}
</style>
