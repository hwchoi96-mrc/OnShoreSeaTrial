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
          <i-btn text="BDN 행 추가" color="#3D3D40" width="100" @click="addNewRow('bdn')"></i-btn>
          <i-btn
            text="Tank Oil 행 추가"
            color="#3D3D40"
            width="140"
            @click="addNewRow('tankOil')"
          ></i-btn>
          <i-btn
            text="Others 행 추가"
            color="#3D3D40"
            width="140"
            @click="addNewRow('others')"
          ></i-btn>
          <i-btn
            text="다운로드"
            @click="downloadBdnSummaries"
            color="#3D3D40"
            width="100"
            prepend-icon="mdi-download"
          ></i-btn>
        </div>
      </v-sheet>
      <v-sheet color="#222224" class="d-flex justify-center">
        <v-data-table class="fuelInfo-table report-table" :headers="bdnSummariesHeader">
          <template v-slot:colgroup>
            <colgroup>
              <col width="15%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="15%" />
            </colgroup>
          </template>
          <!--
          <thead style="height: 80px">
            <tr>
              <th rowspan="2">
                Date of Operations <br />
                (dd/mm/yyyy)
              </th>
              <th colspan="7">Fuel Oil Type/Mass(MT)</th>
              <th rowspan="2">Descriptions</th>
            </tr>
            <tr>
              <th>DO/GO</th>
              <th>LFO</th>
              <th>HFO</th>
              <th>LPG(P)</th>
              <th>LPG(B)</th>
              <th>LNG</th>
              <th>Others(CF)</th>
            </tr>
          </thead> -->
          <template v-slot:body>
            <tr>
              <td
                colspan="11"
                class="text-center"
                style="border-top: 1px solid #49494e; background-color: #2f2f32"
              >
                1. BDN
              </td>
            </tr>

            <tr v-for="(bdnData, index) in bdn" :key="index">
              <td class="date"><i-input v-model="bdn[index]['date']"></i-input></td>
              <td class="mdo"><i-input v-model="bdn[index]['mdo']"></i-input></td>
              <td class="lfo"><i-input v-model="bdn[index]['lfo']"></i-input></td>
              <td class="hfo"><i-input v-model="bdn[index]['hfo']"></i-input></td>
              <td class="lpg-p"><i-input v-model="bdn[index]['lpgP']"></i-input></td>
              <td class="lpg-b"><i-input v-model="bdn[index]['lpgB']"></i-input></td>
              <td class="lng"><i-input v-model="bdn[index]['lng']"></i-input></td>
              <td class="others"><i-input v-model="bdn[index]['others']"></i-input></td>
              <td class="description">
                <i-input v-model="bdn[index]['descriptions']"></i-input>
              </td>
              <td class="action">
                <i-btn text="삭제" @click="deleteRow('bdn', index)" color="#3D3D40"></i-btn>
              </td>
            </tr>

            <tr class="bdn-total">
              <th class="title text-center">1. Annual Supply Amount</th>
              <th class="title text-center">{{ getAnnualTotal('bdn', bdn, 'mdo') }}</th>
              <th class="title text-center">{{ getAnnualTotal('bdn', bdn, 'lfo') }}</th>
              <th class="title text-center">{{ getAnnualTotal('bdn', bdn, 'hfo') }}</th>
              <th class="title text-center">{{ getAnnualTotal('bdn', bdn, 'lpgP') }}</th>
              <th class="title text-center">{{ getAnnualTotal('bdn', bdn, 'lpgB') }}</th>
              <th class="title text-center">{{ getAnnualTotal('bdn', bdn, 'lng') }}</th>
              <th class="title text-center">{{ getAnnualTotal('bdn', bdn, 'others') }}</th>
              <th></th>
              <th></th>
            </tr>

            <tr>
              <td colspan="11" class="text-center" style="background-color: #2f2f32">
                2. Correction for the tank oil remainings
              </td>
            </tr>
            <tr v-for="(tankOilData, index) in correctionForTheTankOilRemainings" :key="index">
              <td class="date">
                <i-input v-model="correctionForTheTankOilRemainings[index]['date']"></i-input>
              </td>
              <td class="mdo">
                <i-input v-model="correctionForTheTankOilRemainings[index]['mdo']"></i-input>
              </td>
              <td class="lfo">
                <i-input v-model="correctionForTheTankOilRemainings[index]['lfo']"></i-input>
              </td>
              <td class="hfo">
                <i-input v-model="correctionForTheTankOilRemainings[index]['hfo']"></i-input>
              </td>
              <td class="lpg-p">
                <i-input v-model="correctionForTheTankOilRemainings[index]['lpgP']"></i-input>
              </td>
              <td class="lpg-b">
                <i-input v-model="correctionForTheTankOilRemainings[index]['lpgB']"></i-input>
              </td>
              <td class="lng">
                <i-input v-model="correctionForTheTankOilRemainings[index]['lng']"></i-input>
              </td>
              <td class="others">
                <i-input v-model="correctionForTheTankOilRemainings[index]['others']"></i-input>
              </td>
              <td class="description">
                <i-input
                  v-model="correctionForTheTankOilRemainings[index]['descriptions']"
                ></i-input>
              </td>
              <td class="action">
                <i-btn text="삭제" @click="deleteRow('tankOil', index)"></i-btn>
              </td>
            </tr>

            <tr class="bdn-total">
              <th class="title text-center">2. Correction for the tank oil remainings</th>
              <th class="title text-center">
                {{ getTankOilRemaining(correctionForTheTankOilRemainings, 'mdo') }}
              </th>
              <th class="title text-center">
                {{ getTankOilRemaining(correctionForTheTankOilRemainings, 'lfo') }}
              </th>
              <th class="title text-center">
                {{ getTankOilRemaining(correctionForTheTankOilRemainings, 'hfo') }}
              </th>
              <th class="title text-center">
                {{ getTankOilRemaining(correctionForTheTankOilRemainings, 'lpgP') }}
              </th>
              <th class="title text-center">
                {{ getTankOilRemaining(correctionForTheTankOilRemainings, 'lpgB') }}
              </th>
              <th class="title text-center">
                {{ getTankOilRemaining(correctionForTheTankOilRemainings, 'lng') }}
              </th>
              <th class="title text-center">
                {{ getTankOilRemaining(correctionForTheTankOilRemainings, 'others') }}
              </th>
              <th></th>
              <th></th>
            </tr>

            <tr>
              <td colspan="11" class="text-center" style="background-color: #2f2f32">
                3. Other corrections
              </td>
            </tr>
            <tr v-for="(othersData, index) in otherCorrections" :key="index">
              <td class="date"><i-input v-model="otherCorrections[index]['date']"></i-input></td>
              <td class="mdo"><i-input v-model="otherCorrections[index]['mdo']"></i-input></td>
              <td class="lfo"><i-input v-model="otherCorrections[index]['lfo']"></i-input></td>
              <td class="hfo"><i-input v-model="otherCorrections[index]['hfo']"></i-input></td>
              <td class="lpg-p"><i-input v-model="otherCorrections[index]['lpgP']"></i-input></td>
              <td class="lpg-b"><i-input v-model="otherCorrections[index]['lpgB']"></i-input></td>
              <td class="lng"><i-input v-model="otherCorrections[index]['lng']"></i-input></td>
              <td class="others">
                <i-input v-model="otherCorrections[index]['others']"></i-input>
              </td>
              <td class="description">
                <i-input v-model="otherCorrections[index]['descriptions']"></i-input>
              </td>
              <td class="action">
                <i-btn text="삭제" @click="deleteRow('others', index)"></i-btn>
              </td>
            </tr>

            <tr class="bdn-total">
              <th class="title text-center">3. Annual other corrections</th>
              <th class="title text-center">
                {{ getAnnualTotal('others', otherCorrections, 'mdo') }}
              </th>
              <th class="title text-center">
                {{ getAnnualTotal('others', otherCorrections, 'lfo') }}
              </th>
              <th class="title text-center">
                {{ getAnnualTotal('others', otherCorrections, 'hfo') }}
              </th>
              <th class="title text-center">
                {{ getAnnualTotal('others', otherCorrections, 'lpgP') }}
              </th>
              <th class="title text-center">
                {{ getAnnualTotal('others', otherCorrections, 'lpgB') }}
              </th>
              <th class="title text-center">
                {{ getAnnualTotal('others', otherCorrections, 'lng') }}
              </th>
              <th class="title text-center">
                {{ getAnnualTotal('others', otherCorrections, 'others') }}
              </th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <td colspan="11" class="text-center" style="background-color: #2f2f32">
                Annual fuel Consumption
              </td>
            </tr>
            <tr class="bdn-total">
              <th class="title text-center">
                Annual Fuel Consumption <br />
                (1+2+3)
              </th>
              <th class="title text-center">{{ getAnnualFuelConsumption('mdo') }}</th>
              <th class="title text-center">{{ getAnnualFuelConsumption('lfo') }}</th>
              <th class="title text-center">{{ getAnnualFuelConsumption('hfo') }}</th>
              <th class="title text-center">{{ getAnnualFuelConsumption('lpgP') }}</th>
              <th class="title text-center">{{ getAnnualFuelConsumption('lpgB') }}</th>
              <th class="title text-center">{{ getAnnualFuelConsumption('lng') }}</th>
              <th class="title text-center">{{ getAnnualFuelConsumption('others') }}</th>
              <th></th>
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

import { getBdnSummaries, downloadBdnSummariesExcel } from '@/api/reportApi'

import { useToast } from '@/composables/useToast'
import { isStatusOk } from '@/composables/util'

import _ from 'lodash'
import moment from 'moment'

const { showResMsg } = useToast()

const method = [
  '1.연료유공금서(BDN) 사용',
  '2. 유량계 사용',
  '3.벙커 탱크 모니터링',
  '4. LNG 화물탱크 모니터링',
  '5. LNG 이외의 화물을 연료로 사용하는 선박의 화물탱크 모니터링'
]
const years = ref([])
const selectedYear = ref()

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const bdnSummariesHeader = [
  // { title: '', key: 'id', align: 'd-none' },
  { title: 'Date of Operations (dd/mm/yyyy)' },
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
  { title: 'Descriptions', key: 'descriptions' },
  { title: '', key: 'action' }
]

const bdn = ref([
  {
    date: '',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  },
  {
    date: '',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  },
  {
    date: '',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  },
  {
    date: '',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  },
  {
    date: '',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  }
])

const annualSupplyAmount = ref({
  date: '28/05/2024',
  mdo: 0,
  lfo: 0,
  hfo: 0,
  lpgP: 0,
  lpgB: 0,
  lng: 0,
  others: 0,
  descriptions: ''
})

const correctionForTheTankOilRemainings = ref([
  {
    id: 0,
    date: '28/05/2024',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  },
  {
    id: 1,
    date: '28/05/2024',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  }
])

const annualTankOilRemainings = ref({
  date: '28/05/2024',
  mdo: 0,
  lfo: 0,
  hfo: 0,
  lpgP: 0,
  lpgB: 0,
  lng: 0,
  others: 0,
  descriptions: ''
})

const otherCorrections = ref([
  {
    id: 0,
    date: '28/05/2024',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  },
  {
    id: 1,
    date: '28/05/2024',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  },
  {
    id: 2,
    date: '28/05/2024',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  }
])

const annualOtherCorrections = ref({
  mdo: 0,
  lfo: 0,
  hfo: 0,
  lpgP: 0,
  lpgB: 0,
  lng: 0,
  others: 0
})

const annualFuelConsumption = ref({
  mdo: 0,
  lfo: 0,
  hfo: 0,
  lpgP: 0,
  lpgB: 0,
  lng: 0,
  others: 0
})

onMounted(() => {
  fetchBenSummaries()
})

const firstDayOfYear = ref()
const lastDayOfYear = ref()

const fetchBenSummaries = async () => {
  years.value.length = 0;

  if (!curSelectedShip.value.imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
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
  } = await getBdnSummaries(requestForm)
  console.dir(data)
  if (isStatusOk(status)) {
    data.forEach((bdnData) => {
      for (let key in bdnData) {
        if (bdnData[key] && !isNaN(bdnData[key])) {
          bdnData[key] = parseFloat(bdnData[key]).toFixed(1)
        }
      }
    })
    bdn.value = data
  }
}

const getAnnualTotal = (type, data, key) => {
  let AnnualTotal = data.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur[key] || 0), 0)
  switch (type) {
    case 'bdn':
      annualSupplyAmount.value[key] = AnnualTotal
      break
    case 'others':
      annualOtherCorrections.value[key] = AnnualTotal
      break
  }
  return AnnualTotal
}

const getAnnualFuelConsumption = (key) => {
  let totalCunsumption = 0

  totalCunsumption =
    annualSupplyAmount.value[key] +
    annualTankOilRemainings.value[key] +
    annualOtherCorrections.value[key]

  annualFuelConsumption.value[key] = totalCunsumption

  console.log(totalCunsumption)

  return totalCunsumption
}

const getTankOilRemaining = (data, key) => {
  if (data.length === 0 || data == 'NaN' || Number.isNaN(data)) return 0 // 데이터가 빈 배열인 경우 0을 반환

  const tankOilRemainingData = data.map((obj) => obj[key])

  let result = tankOilRemainingData[0]

  if (result == 0) {
    annualTankOilRemainings.value[key] = result
    return result
  }

  for (let i = 1; i < tankOilRemainingData.length; i++) {
    result -= tankOilRemainingData[i]
  }

  if (result <= 0) {
    result = 0
  }
  annualTankOilRemainings.value[key] = result

  return result
}

const deleteRow = (type, index) => {
  switch (type) {
    case 'bdn':
      bdn.value.splice(index, 1)
      break
    case 'tankOil':
      correctionForTheTankOilRemainings.value.splice(index, 1)
      console.log('탱크 오일')
      console.dir(correctionForTheTankOilRemainings.value)
      break
    case 'others':
      otherCorrections.value.splice(index, 1)
      break
  }
}

const addNewRow = (type) => {
  let newData = {
    id: 0,
    date: '',
    mdo: 0,
    lfo: 0,
    hfo: 0,
    lpgP: 0,
    lpgB: 0,
    lng: 0,
    others: 0,
    descriptions: ''
  }

  switch (type) {
    case 'bdn':
      newData.id = bdn.value.length
      bdn.value.push({ ...newData })
      break
    case 'tankOil':
      newData.id = correctionForTheTankOilRemainings.value.length
      correctionForTheTankOilRemainings.value.push({ ...newData })
      break
    case 'others':
      newData.id = otherCorrections.value.length
      otherCorrections.value.push({ ...newData })
      break
  }
}

const downloadBdnSummaries = async () => {
  const requestForm = {
    bdnList: bdn.value,
    annualSupplyAmount: annualSupplyAmount.value,
    correctionForTheTankOilRemainingsList: correctionForTheTankOilRemainings.value,
    annualCorrectionForTheTankOilRemainings: annualTankOilRemainings.value,
    otherCorrectionsList: otherCorrections.value,
    annualOtherCorrections: annualOtherCorrections.value,
    annualFuelConsumption: annualFuelConsumption
  }
  const { status, data } = await downloadBdnSummariesExcel(requestForm)

  const url = window.URL.createObjectURL(
    new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  )
  let imoNumber = curSelectedShip.value.imoNumber
  let FileName = `BDN_SUMMARIES_${imoNumber}`

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${FileName}.xlsx`) // 다운로드 파일 이름 설정
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch(curSelectedShip, fetchBenSummaries)
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
</style>
