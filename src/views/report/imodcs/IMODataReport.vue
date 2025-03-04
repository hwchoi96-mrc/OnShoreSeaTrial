<template>
  <v-sheet color="#222224" class="pt-3 imodcs-content-container">
    <v-sheet class="mx-auto" width="700">
      <div class="d-flex justify-space-between mb-3">
        <div class="w-20">
          <i-selectbox
            v-model="selectedYear"
            :items="years"
            variant="solo-filled"
            density="compact"
            hide-details
          >
          </i-selectbox>
        </div>
        <i-btn
          text="다운로드"
          @click="downloadImoReport"
          color="#3D3D40"
          width="100"
          prepend-icon="mdi-download"
        ></i-btn>
      </div>
    </v-sheet>

    <div class="d-flex justify-center">
      <table class="fuelInfo-table">
        <colgroup>
          <col width="25%" />
          <col width="25%" />
          <col width="50%" />
        </colgroup>
        <tbody>
          <tr>
            <th colspan="2" class="title">Start date (dd/mm/yyyy)</th>
            <td><i-input v-model="imoData.startDate"></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">End date (dd/mm/yyyy)</th>
            <td><i-input v-model="imoData.endDate"></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">IMO Number</th>
            <td><i-input v-model="imoData.imoNumber"></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">Ship Type</th>
            <td><i-input v-model="imoData.shipType"></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">Gross Tonnage</th>
            <td><i-input v-model="imoData.grossTonnage"></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">NT</th>
            <td><i-input v-model="imoData.nt"></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">DWT</th>
            <td><i-input v-model="imoData.dwt"></i-input></td>
          </tr>

          <tr>
            <th colspan="2" class="title">
              EEID (if applicable) <br />
              (gCO2/t.nm)
            </th>
            <td><i-input v-model="imoData.eedi"></i-input></td>
          </tr>

          <tr>
            <th colspan="2" class="title">Ice Class (if applicable)</th>
            <td><i-input v-model="imoData.icdClass"></i-input></td>
          </tr>

          <tr>
            <th rowspan="5">
              Power output <br />
              (rated power) <br />
              (kW)
            </th>
            <td class="text-center">
              Main <br />
              Propulsion <br />
              Power
            </td>
            <td><i-input v-model="imoData.mainPropulsionPower"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              No. 1 Auxiliary <br />
              Engine
            </td>
            <td><i-input v-model="imoData.no1AuxiliaryEnginePower"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              No. 2 Auxiliary <br />
              Engine
            </td>
            <td><i-input v-model="imoData.no2AuxiliaryEnginePower"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              No. 3 Auxiliary <br />
              Engine
            </td>
            <td><i-input v-model="imoData.no3AuxiliaryEnginePower"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              No. 4 Auxiliary <br />
              Engine
            </td>
            <td><i-input v-model="imoData.no4AuxiliaryEnginePower"></i-input></td>
          </tr>

          <tr>
            <th colspan="2" class="title">Distance Travelled (nm)</th>
            <td><i-input v-model="imoData.distance"></i-input></td>
          </tr>

          <tr>
            <th colspan="2" class="title">Hours underway (h)</th>
            <td><i-input v-model="imoData.underway"></i-input></td>
          </tr>

          <tr>
            <th rowspan="9" class="title">
              Fuel Oil <br />
              Consumption <br />
              (t)
            </th>
            <td class="text-center">
              Diesel / Gas Oil <br />
              (cf : 3.206)
            </td>
            <td><i-input v-model="imoData.dieselGasOil"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              LFO <br />
              (cf : 3.151)
            </td>
            <td><i-input v-model="imoData.lfo"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              HFO <br />
              (cf : 3.114)
            </td>
            <td><i-input v-model="imoData.hfo"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              LPG (Propane) <br />
              (Cf : 3.000)
            </td>
            <td><i-input v-model="imoData.lpgP"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              LPG (Butane) <br />
              (Cf : 3.030)
            </td>
            <td><i-input v-model="imoData.lpgB"></i-input></td>
          </tr>

          <tr>
            <td class="text-center">
              LNG <br />
              (Cf : 2.750)
            </td>
            <td><i-input v-model="imoData.lng"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              Methanol <br />
              (Cf : 1.375)
            </td>
            <td><i-input v-model="imoData.methanol"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              Ethanol <br />
              (Cf : 1.913)
            </td>
            <td><i-input v-model="imoData.ethanol"></i-input></td>
          </tr>
          <tr>
            <td class="text-center">
              Other (...) <br />
              (Cf : ...)
            </td>
            <td><i-input v-model="imoData.others"></i-input></td>
          </tr>
          <tr>
            <td colspan="2" class="text-center">
              Method used to measure <br />
              Fuel oil consumption
            </td>
            <td><i-input v-model="imoData.measureMethod"></i-input></td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import _ from 'lodash'

import { useShipStore } from '@/stores/shipStore'

import { getImoData, downloadImoReportExcel } from '@/api/reportApi'
import { useToast } from '@/composables/useToast'
import { isStatusOk } from '@/composables/util'


const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)
const { showResMsg } = useToast()

const years = ref([])
const selectedYear = ref()

const imoData = ref({
  startDate: 0,
  endDate: '',
  imoNumber: '',
  shipType: '',
  grossTonnage: 0,
  nt: 0,
  dwt: 0,
  eedi: 0,
  iceClass: '',
  mainPropulsionPower: 0,
  no1AuxiliaryEnginePower: 0,
  no2AuxiliaryEnginePower: 0,
  no3AuxiliaryEnginePower: 0,
  no4AuxiliaryEnginePower: 0,
  distance: 0,
  underway: 0,
  dieselGasOil: 0,
  lfo: 0,
  hfo: 0,
  lpgP: 0,
  lpgB: 0,
  lng: 0,
  methanol: 0,
  ethanol: 0,
  others: 0,
  measureMethod: 1
})




//년도 설렉트박스 만들기
const initImoData = async () => {
  years.value.length = 0; 

  const today = moment()

  let currentYear = null
  let lastYear = null

  let firstDayOfYear = null
  let lastDayOfYear = null

  currentYear = today.clone().utc().startOf('year').format('YYYY')//2024
  lastYear = today.clone().utc().subtract(1, 'year').format('YYYY')//2023

  years.value.push(currentYear, lastYear)//years 배열에 2024, 2023 추가
  selectedYear.value = years.value[0] //years 배열 첫번째 선택
  //Start date (dd/mm/yyyy) End date (dd/mm/yyyy)
  firstDayOfYear = today.clone().utc().startOf('year')
  lastDayOfYear = today.clone().utc().endOf('year')
  imoData.value.startDate = firstDayOfYear.format('DD/MM/YYYY')
  imoData.value.endDate = lastDayOfYear.format('DD/MM/YYYY')

  //선박데이터 가져오기
  fetchImoDcsData()
}

const fetchImoDcsData = async () => {
  let imoNumber = curSelectedShip.value.imoNumber
  let startDate = _.cloneDeep(imoData.value.startDate)
  let endtime = _.cloneDeep(imoData.value.endDate)

  let utcStartTime = moment(startDate, 'DD/MM/YYYY').utc().toISOString()
  let utcEndTime = moment(endtime, 'DD/MM/YYYY').utc().toISOString()

  if (imoNumber) {
    let form = {
      imoNumber: imoNumber,
      startTime: utcStartTime,
      endTime: utcEndTime
    }
    const {
      status,
      data: { data }
    } = await getImoData(form)

    Object.keys(data).forEach((el) => {
      if (el != 'imoNumber') {
        if (data[el] !== '' && !isNaN(data[el])) {
          data[el] = Number.parseFloat(data[el]).toFixed(1)
        }
      }
    })
    let originData = _.cloneDeep(imoData.value)
    imoData.value = { ...originData, ...data }
  } else {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
  }
}

const method = [
  '1.연료유공금서(BDN) 사용',
  '2. 유량계 사용',
  '3.벙커 탱크 모니터링',
  '4. LNG 화물탱크 모니터링',
  '5. LNG 이외의 화물을 연료로 사용하는 선박의 화물탱크 모니터링'
]

const downloadImoReport = async () => {
  const { status, data } = await downloadImoReportExcel(imoData.value)

  const url = window.URL.createObjectURL(
    new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  )
  let imoNumber = curSelectedShip.value.imoNumber
  let FileName = `IMO_Data_Report_${imoNumber}`

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${FileName}.xlsx`) // 다운로드 파일 이름 설정
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch(curSelectedShip, initImoData)

onMounted(() => {
  initImoData()
})
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
  min-width: 700px;
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

.w-20 {
  width: 20%;
}
</style>
