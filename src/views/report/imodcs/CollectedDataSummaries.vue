<template>
  <v-sheet class="pt-3 imodcs-content-container">
    <v-sheet class="mx-auto" width="1440">
      <v-sheet class="d-flex justify-space-between">
        <div class="w-50">
          <i-selectbox
            v-model="selectedYear"
            :items="years"
            variant="solo-filled"
            density="compact"
            hide-details
            style="width: 20%"
          >
          </i-selectbox>
        </div>
        <div class="d-flex justify-end ga-2 mb-3">
          <i-btn text="행 추가" color="#3D3D40" width="80" @click="addDataNewRow"></i-btn>
          <i-btn
            text="다운로드"
            @click="downloadCollectdSummaries"
            color="#3D3D40"
            width="100"
            prepend-icon="mdi-download"
          ></i-btn>
        </div>
      </v-sheet>
      <v-sheet color="#222224" class="d-flex justify-center">
        <v-data-table
          class="fuelInfo-table collectd-summaries-table report-table"
          :headers="collectedDataHeader"
        >
          <template v-slot:colgroup>
            <colgroup>
              <col width="12%" />
              <col width="12%" />
              <col width="11%" />
              <col width="11%" />
              <col width="7%" />
              <col width="7%" />
              <col width="7%" />
              <col width="7%" />
              <col width="7%" />
              <col width="7%" />
              <col width="7%" />
            </colgroup>
          </template>

          <template v-slot:body>
            <tr v-for="(collectedData, index) in collectedDatas" :key="index">
              <td class="date-from">
                <i-input v-model="collectedDatas[index]['dateFrom']"></i-input>
              </td>
              <td class="date-to"><i-input v-model="collectedDatas[index]['dateTo']"></i-input></td>
              <td class="distanceTravelled">
                <i-input v-model="collectedDatas[index]['distanceTravelled']"></i-input>
              </td>
              <td class="hoursUnderway">
                <i-input v-model="collectedDatas[index]['hoursUnderway']"></i-input>
              </td>
              <td class="mdo"><i-input v-model="collectedDatas[index]['mdo']"></i-input></td>
              <td class="lfo"><i-input v-model="collectedDatas[index]['lfo']"></i-input></td>
              <td class="hfo"><i-input v-model="collectedDatas[index]['hfo']"></i-input></td>
              <td class="lpg-p"><i-input v-model="collectedDatas[index]['lpgP']"></i-input></td>
              <td class="lpg-b"><i-input v-model="collectedDatas[index]['lpgB']"></i-input></td>
              <td class="lng"><i-input v-model="collectedDatas[index]['lng']"></i-input></td>
              <td class="others"><i-input v-model="collectedDatas[index]['others']"></i-input></td>
              <td class="action">
                <i-btn text="삭제" @click="deleteDataRow(index)" color="#3D3D40"></i-btn>
              </td>
            </tr>

            <tr class="bdn-total">
              <th class="title text-center" colspan="2">Totals</th>
              <th class="title text-center">{{ getTotal('distanceTravelled') }}</th>
              <th class="title text-center">{{ getTotal('hoursUnderway') }}</th>
              <th class="title text-center">{{ getTotal('mdo') }}</th>
              <th class="title text-center">{{ getTotal('lfo') }}</th>
              <th class="title text-center">{{ getTotal('hfo') }}</th>
              <th class="title text-center">{{ getTotal('lpgP') }}</th>
              <th class="title text-center">{{ getTotal('lpgB') }}</th>
              <th class="title text-center">{{ getTotal('lng') }}</th>
              <th class="title text-center">{{ getTotal('others') }}</th>
              <th></th>
            </tr>
          </template>
          <template #bottom></template>
        </v-data-table>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useToast } from '@/composables/useToast'

import { getCollectdSummaries, downloadCollectdSummariesExcel } from '@/api/reportApi'
import { isStatusOk } from '@/composables/util'
import moment from 'moment'

const { showResMsg } = useToast()
const years = ref([])
const selectedYear = ref()
const method = [
  '1.연료유공금서(BDN) 사용',
  '2. 유량계 사용',
  '3.벙커 탱크 모니터링',
  '4. LNG 화물탱크 모니터링',
  '5. LNG 이외의 화물을 연료로 사용하는 선박의 화물탱크 모니터링'
]

const collectedDataHeader = [
  { title: 'Date from (dd/mm/yyyy)', key: 'dateFrom', align: 'center' },
  { title: 'Date To (dd/mm/yyyy)', key: 'dateTo', align: 'center' },
  { title: 'Distance Travelled (n.m)', key: 'distanceTravelled', align: 'center' },
  { title: 'Hours Underway (hh.mm)', key: 'hoursUnderway', align: 'center' },
  {
    title: 'Fuel Oil type/MASS (M/T)',
    align: 'center',
    children: [
      { title: 'DO/GO', key: 'mdo' },
      { title: 'LFO', key: 'lfo' },
      { title: 'HFO', key: 'hfo' },
      { title: 'LPG(P)', key: 'lpgP' },
      { title: 'LPG(B)', key: 'lpgB' },
      { title: 'LNG', key: 'lng' },
      { title: 'Others(CF)', key: 'others' }
    ]
  },
  {
    title: ''
  }
]

const collectedDatas = ref([
  {
    dateFrom: '28/05/2024',
    dateTo: '30/05/2024',
    distanceTravelled: 0,
    hoursUnderway: 0,
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0
  },
  {
    dateFrom: '28/05/2024',
    dateTo: '30/05/2024',
    distanceTravelled: 0,
    hoursUnderway: 0,
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0
  },
  {
    dateFrom: '28/05/2024',
    dateTo: '30/05/2024',
    distanceTravelled: 0,
    hoursUnderway: 0,
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0
  },
  {
    dateFrom: '28/05/2024',
    dateTo: '30/05/2024',
    distanceTravelled: 0,
    hoursUnderway: 0,
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0
  },
  {
    dateFrom: '28/05/2024',
    dateTo: '30/05/2024',
    distanceTravelled: 0,
    hoursUnderway: 0,
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0
  }
])

const firstDayOfYear = ref()
const lastDayOfYear = ref()

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

onMounted(() => {
  fetchCollectdDataSummaries()
})

const fetchCollectdDataSummaries = async () => {
  years.value.length = 0; 
  
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  if (!curSelectedShipImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  const today = moment()
  let currentYear = null
  let lastYear = null

  currentYear = today.clone().utc().startOf('year').format('YYYY')
  lastYear = today.clone().utc().subtract(1, 'year').format('YYYY')

  years.value.push(currentYear, lastYear)
  selectedYear.value = years.value[0]

  firstDayOfYear.value = today.clone().utc().startOf('year').format('YYYY-MM-DD')
  lastDayOfYear.value = today.clone().utc().endOf('year').format('YYYY-MM-DD')

  let parseStartTimeZone = moment.parseZone(firstDayOfYear.value)
  let parseEndTimeZone = moment.parseZone(lastDayOfYear.value)
  let utcStartTime = parseStartTimeZone.toISOString()
  let utcEndTime = parseEndTimeZone.toISOString()

  let requestForm = {
    imoNumber: curSelectedShip.value.imoNumber,
    startTime: utcStartTime,
    endTime: utcEndTime
  }

  const {
    status,
    data: { data }
  } = await getCollectdSummaries(requestForm)
  console.dir(data)
  if (isStatusOk(status)) {
    data.forEach((collectionData) => {
      for (let key in collectionData) {
        if (collectionData[key] && !isNaN(collectionData[key])) {
          collectionData[key] = parseFloat(collectionData[key]).toFixed(1)
        }
      }
    })
    collectedDatas.value = data
  }
}

const addDataNewRow = () => {
  let newRow = {
    dateFrom: '28/05/2024',
    dateTo: '30/05/2024',
    distanceTravelled: 0,
    hoursUnderway: 0,
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0
  }

  collectedDatas.value.push(newRow)
}
const annualCollectedDataSummaries = ref({
  dateFrom: 'Annual Total',
  dateTo: '',
  distanceTravelledTravelled: 0,
  hoursUnderway: 0,
  dgo: 0.0,
  lfo: 0.0,
  hfo: 0.0,
  lpgP: 0.0,
  lpgB: 0.0,
  lng: 0.0,
  others: 0.0
})

const deleteDataRow = (index) => {
  collectedDatas.value.splice(index, 1)
}

const getTotal = (key) => {
  let totalAmount = collectedDatas.value.reduce((a, b) => parseInt(a) + parseInt(b[key] || 0), 0)
  annualCollectedDataSummaries.value[key] = totalAmount
  return totalAmount
}

const downloadCollectdSummaries = async () => {
  const requestForm = {
    collectedDataSummariesList: collectedDatas.value,
    annualCollectedDataSummaries: annualCollectedDataSummaries.value
  }

  const { status, data } = await downloadCollectdSummariesExcel(requestForm)

  const url = window.URL.createObjectURL(
    new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  )
  let imoNumber = curSelectedShip.value.imoNumber
  let FileName = `COLLECTED_DATA_SUMMARIES_${imoNumber}`

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${FileName}.xlsx`) // 다운로드 파일 이름 설정
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch(curSelectedShip, fetchCollectdDataSummaries)
</script>

<style scoped>
.basic-container-title {
  flex: 1 1 0;
  font-size: 1.2em;
}

.basic-container-info {
  flex: 5 1 0;
}

.basic-container-item {
  width: 240px;
}

.basic-container-item.fuel {
  flex: 1 1 20%;
}

.basic-container-item.etc {
  flex: 1 1 0;
}

.fuel-container {
  flex: 2 1 auto;
}

/* 선박 기본 정보 및 선박 연료유 사용량 테이블 공통 CSS */

.fuelInfo-table,
.fuel-usage-table {
  border: 1px solid #49494e;
  min-width: 1240px;
  border-spacing: 0px;
}

/* 선박 기본 정보  테이블 관련 CSS */
table.fuelInfo-table .cii-purpose-tr.odd {
  background: #222224;
}

table.fuelInfo-table th {
  border-right: 1px solid #49494e;
}

table.fuelInfo-table tr:nth-child(odd) {
  background: #2f2f32;
}

table.fuelInfo-table td,
.fuel-usage-table td {
  padding: 10px 20px;
}

table.fuelInfo-table .cii-purpose-tr.even {
  background: #2f2f32;
}

table.fuelInfo-table tr.eedi-cf {
  background: #222224;
  border-top: 1px solid #49494e;
  border-bottom: 1px solid #49494e;
}

table.fuelInfo-table .eedi-cf-tr.odd {
  background: #2f2f32;
}

table.fuelInfo-table .eedi-cf-tr.even {
  background: #222224;
}

table.fuelInfo-table tr.cii-purpose th {
  border-bottom: 1px solid #49494e;
}

table.fuelInfo-table .title {
  font-size: 1em;
}

table.fuel-usage-table tr:nth-child(even) {
  background: #2f2f32;
}

table.fuel-usage-table .title {
  font-size: 1em;
}

.eedi-cf-th {
  border-left: 1px solid #49494e;
}

/* 선박 연료유 사용량  테이블 관련 CSS */
table.fuel-usage-table .fuel-usage th {
  border-right: 1px solid #49494e;
  background: #2f2f32;
}

table.fuel-usage-table tr.etc.odd {
  background: #2f2f32;
}

table.fuel-usage-table tr.etc.even {
  background: #222224;
}

table.fuel-usage-table tr.machine-output {
  background: #222224;
}

table.fuel-usage-table th.title {
  border-right: 1px solid #49494e;
}

.fuel-usage-table tr td:nth-child(2):not(:last-child) {
  border-left: 1px solid #49494e;
  border-right: 1px solid #49494e;
}

tr.fuel-usage th.title {
  border-bottom: 1px solid #49494e;
}

table.fuel-usage-table tr td:last-child {
  border-left: 1px solid #49494e;
}

.th-border {
  border-bottom: 1px solid #49494e;
}
</style>
