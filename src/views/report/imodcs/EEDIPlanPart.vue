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
          <i-btn
            text="다운로드"
            @click="downloadEEDIPlanPart"
            color="#3D3D40"
            width="100"
            prepend-icon="mdi-download"
          ></i-btn>
        </div>
      </v-sheet>
      <v-sheet color="#222224" class="d-flex justify-center">
        <table class="fuelInfo-table report-table">
          <caption class="mb-4 text-left plan-title">
            1. Ship particulars
          </caption>
          <colgroup>
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="title">Name of Ship</th>
              <td colspan="3"><i-input v-model="shipParticulars.nameOfShip"></i-input></td>
            </tr>
            <tr>
              <th class="title">IMO Number</th>
              <td colspan="3"><i-input v-model="shipParticulars.imoNumber"></i-input></td>
            </tr>
            <tr>
              <th class="title">Company</th>
              <td colspan="3"><i-input v-model="shipParticulars.company"></i-input></td>
            </tr>
            <tr>
              <th class="title">Flag</th>
              <td colspan="3"><i-input v-model="shipParticulars.flag"></i-input></td>
            </tr>
            <tr>
              <th class="title">Ship Type</th>
              <td colspan="3"><i-input v-model="shipParticulars.shipType"></i-input></td>
            </tr>
            <tr>
              <th class="title">Gross Tonnage</th>
              <td colspan="3"><i-input v-model="shipParticulars.grossTonnage"></i-input></td>
            </tr>
            <tr>
              <th class="title">NT</th>
              <td colspan="3"><i-input v-model="shipParticulars.nt"></i-input></td>
            </tr>
            <tr>
              <th class="title">DWT</th>
              <td colspan="3"><i-input v-model="shipParticulars.dwt"></i-input></td>
            </tr>
            <tr>
              <th class="title">EEDI (if applicable)</th>
              <td colspan="3"><i-input v-model="shipParticulars.eedi"></i-input></td>
            </tr>
            <th class="title">Ice Class</th>
            <td colspan="3"><i-input v-model="shipParticulars.iceClass"></i-input></td>
          </tbody>
        </table>
      </v-sheet>
      <v-sheet class="d-flex justify-center mt-4">
        <!-- 선박 연료유 사용량 -->
        <table class="fuel-usage-table text-center">
          <caption class="mb-4 text-left plan-title">
            2. Record of revision of Fuel Oil Consumption Data Collection Plan
          </caption>
          <colgroup>
            <col width="25%" />
            <col width="75%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="title">Date of Revison</th>
              <th class="title">Revised Provision</th>
            </tr>
            <tr v-for="(list, index) in recordOfRevisionOfFuelConsumptionDataCollectionPlanList">
              <td>
                <i-input
                  v-model="
                    recordOfRevisionOfFuelConsumptionDataCollectionPlanList[index].dateOfRevision
                  "
                ></i-input>
              </td>
              <td colspan="3">
                <i-input
                  v-model="
                    recordOfRevisionOfFuelConsumptionDataCollectionPlanList[index].revisedProvision
                  "
                ></i-input>
              </td>
            </tr>
          </tbody>
        </table>
      </v-sheet>

      <v-sheet color="#222224" class="d-flex justify-center mt-4">
        <table class="fuelInfo-table oil-consumer">
          <caption class="mb-4 text-left plan-title">
            3. Ship engines and other fuel oil consumers and fuel oil types used
          </caption>
          <colgroup>
            <col width="10%" />
            <col width="40%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>
          <tbody>
            <tr class="pa-4">
              <th class="title"></th>
              <th class="title">Engines or other fuel oil consumers</th>
              <th class="title">Power</th>
              <th class="title">Fuel Oil Type</th>
            </tr>
            <tr>
              <td class="title">1</td>
              <td class="title">Type/model of main engine</td>
              <td class="d-flex ga-2 align-center">
                <i-input
                  v-model="engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList[0].power"
                ></i-input>
                (kW)
              </td>
              <td>
                <i-input
                  v-model="engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList[0].fuelOilType"
                ></i-input>
              </td>
            </tr>
            <tr>
              <td class="title">2</td>
              <td class="title">Type/model of auxiliary engine</td>
              <td class="d-flex ga-2 align-center">
                <i-input
                  v-model="engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList[1].power"
                ></i-input>
                (kW)
              </td>
              <td>
                <i-input
                  v-model="engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList[1].fuelOilType"
                ></i-input>
              </td>
            </tr>
            <tr>
              <td class="title">3</td>
              <td class="title">Boiler</td>
              <td class="d-flex ga-5 align-center">
                <i-input
                  v-model="engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList[2].power"
                ></i-input>
                (..)
              </td>
              <td>
                <i-input
                  v-model="engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList[2].fuelOilType"
                ></i-input>
              </td>
            </tr>
            <tr>
              <td class="title">4</td>
              <td class="title">Inert gas generator</td>
              <td class="d-flex ga-5 align-center">
                <i-input
                  v-model="engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList[3].power"
                ></i-input>
                (..)
              </td>
              <td>
                <i-input
                  v-model="engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList[3].fuelOilType"
                ></i-input>
              </td>
            </tr>
          </tbody>
        </table>
      </v-sheet>

      <!-- Emission Factor -->
      <v-sheet class="d-flex justify-center mt-4">
        <table class="fuel-usage-table text-center">
          <caption class="mb-4 text-left plan-title">
            4. Emission Factor
          </caption>
          <colgroup>
            <col width="70%" />
            <col width="30%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="title">Fuel Oil Type</th>
              <th class="title">
                CF <br />
                (t-Co2/t-Fuel)
              </th>
            </tr>
            <tr>
              <td>Diesel/Gas oil (e.g. ISO 8217 grades DMX through DMB)</td>
              <td><i-input v-model="emissionFactor.dgoCf"></i-input></td>
            </tr>
            <tr>
              <td>Light fuel oil (LFO) (e.g. ISO 8217 grades RMA through RMD)</td>
              <td><i-input v-model="emissionFactor.lfoCf"> </i-input></td>
            </tr>
            <tr>
              <td>Heavy fuel oil (HFO) (e.g. ISO 8217 grades RME through RMK)</td>
              <td><i-input v-model="emissionFactor.hfoCf"></i-input></td>
            </tr>
            <tr>
              <td>Liquefied petroleum gas (LPG) (Propane)</td>
              <td><i-input v-model="emissionFactor.lpgPCf"></i-input></td>
            </tr>
            <tr></tr>
            <tr>
              <td>Liquefied petroleum gas (LPG) (Butane)</td>
              <td><i-input v-model="emissionFactor.lgpBCf"></i-input></td>
            </tr>
            <tr>
              <td>Liquefied natural gas (LNG)</td>
              <td><i-input v-model="emissionFactor.lngCf"></i-input></td>
            </tr>

            <tr>
              <td>Methanol</td>
              <td><i-input v-model="emissionFactor.methanolCf"></i-input></td>
            </tr>
            <tr>
              <td>Ethanol</td>
              <td><i-input v-model="emissionFactor.ethanolCf"></i-input></td>
            </tr>

            <tr>
              <td>Other (………)</td>
              <td><i-input v-model="emissionFactor.OtherCf"></i-input></td>
            </tr>
          </tbody>
        </table>
      </v-sheet>

      <v-sheet class="d-flex justify-center mt-4">
        <!-- 선박 연료유 사용량 -->
        <table class="fuel-usage-table text-center">
          <caption class="mb-4 text-left plan-title">
            5. Method to measure fuel oil consumption
          </caption>
          <colgroup>
            <col width="25%" />
            <col width="75%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="title">Method</th>
              <th class="title">Description</th>
            </tr>
            <tr>
              <td><i-input v-model="methodToMeasureFuelOilConsumption.method"></i-input></td>
              <td><i-input v-model="methodToMeasureFuelOilConsumption.description"></i-input></td>
            </tr>
          </tbody>
        </table>
      </v-sheet>
      <v-sheet class="d-flex justify-center mt-4">
        <!-- 선박 연료유 사용량 -->
        <table class="fuel-usage-table text-center">
          <caption class="mb-4 text-left plan-title">
            6. Method to measure distance travelled
          </caption>
          <colgroup>
            <col width="100%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="title">Description</th>
            </tr>
            <tr>
              <td><i-input v-model="methodToMeasureDistanceTravelled"></i-input></td>
            </tr>
          </tbody>
        </table>
      </v-sheet>
      <v-sheet class="d-flex justify-center mt-4">
        <!-- 선박 연료유 사용량 -->
        <table class="fuel-usage-table text-center">
          <caption class="mb-4 text-left plan-title">
            7. Method to measure hours underway
          </caption>
          <colgroup>
            <col width="100%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="title">Description</th>
            </tr>
            <tr>
              <td><i-input v-model="methodToMeasureHoursUnderway"></i-input></td>
            </tr>
          </tbody>
        </table>
      </v-sheet>
      <v-sheet class="d-flex justify-center mt-4">
        <!-- 선박 연료유 사용량 -->
        <table class="fuel-usage-table text-center">
          <caption class="mb-4 text-left plan-title">
            8. Processes that will be used to report the data to the Administration
          </caption>
          <colgroup>
            <col width="100%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="title">Description</th>
            </tr>
            <tr>
              <td>
                <i-input
                  v-model="processesThatWillBeUsedToReportTheDataToTheAdministration"
                ></i-input>
              </td>
            </tr>
          </tbody>
        </table>
      </v-sheet>
      <v-sheet class="d-flex justify-center mt-4">
        <!-- 선박 연료유 사용량 -->
        <table class="fuel-usage-table text-center">
          <caption class="mb-4 text-left plan-title">
            9. Data quality
          </caption>
          <colgroup>
            <col width="100%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="title">Description</th>
            </tr>
            <tr>
              <td><i-input v-model="dataQuality"></i-input></td>
            </tr>
          </tbody>
        </table>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { isStatusOk } from '@/composables/util'
import { getEEDIPlanPart, downloadEEDIPlanPartExcel } from '@/api/reportApi'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)
import { useToast } from '@/composables/useToast'

import moment from 'moment'

const years = ref([])
const selectedYear = ref()
const { showResMsg } = useToast()

onMounted(() => {
  fetchEEDIPlanPart()
})

const fetchEEDIPlanPart = async () => {
  years.value.length = 0;
  
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  if (!curSelectedShipImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  const today = moment()
  let currentYear = null
  let lastYear = null

  currentYear = today.utc().startOf('year').format('YYYY')
  lastYear = today.utc().subtract(1, 'year').format('YYYY')

  years.value.push(currentYear, lastYear)
  selectedYear.value = years.value[0]

  let firstDayOfYear = today.clone().utc().startOf('year').format('YYYY-MM-DD')
  let lastDayOfYear = today.clone().utc().endOf('year').format('YYYY-MM-DD')

  let parseStartTimeZone = moment.parseZone(firstDayOfYear.value)
  let parseEndTimeZone = moment.parseZone(lastDayOfYear.value)
  let utcStartTime = parseStartTimeZone.toISOString()
  let utcEndTime = parseEndTimeZone.toISOString()

  let requestForm = {
    imoNumber: curSelectedShipImoNumber,
    startTime: utcStartTime,
    endTime: utcEndTime
  }

  const {
    status,
    data: { data }
  } = await getEEDIPlanPart(requestForm)

  if (isStatusOk(status)) {
    shipParticulars.value = data
    // console.log('data')
    // console.dir(data)
  }
}

const downloadEEDIPlanPart = async () => {
  let requestForm = {
    shipParticulars: shipParticulars.value,
    recordOfRevisionOfFuelConsumptionDataCollectionPlanList:
      recordOfRevisionOfFuelConsumptionDataCollectionPlanList.value,
    engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList:
      engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList.value,
    emissionFactor: emissionFactor.value,
    methodToMeasureFuelOilConsumption: methodToMeasureFuelOilConsumption.value,
    methodToMeasureDistanceTravelled: methodToMeasureDistanceTravelled.value,
    methodToMeasureHoursUnderway: methodToMeasureHoursUnderway.value,
    processesThatWillBeUsedToReportTheDataToTheAdministration:
      processesThatWillBeUsedToReportTheDataToTheAdministration.value,
    dataQuality: dataQuality.value
  }

  console.dir(requestForm)
  const { status, data } = await downloadEEDIPlanPartExcel(requestForm)

  console.log(status)

  const url = window.URL.createObjectURL(
    new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  )

  let imoNumber = curSelectedShip.value.imoNumber
  let FileName = `Part Ⅱ of the SEEMP_${imoNumber}`

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${FileName}.xlsx`) // 다운로드 파일 이름 설정
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const shipParticulars = ref({
  nameOfShip: '',
  imoNumber: '',
  company: '',
  flag: '',
  shipType: '',
  grossTonnage: 0,
  nt: 0,
  dwt: 0,
  eedi: 0,
  iceClass: ''
})

const recordOfRevisionOfFuelConsumptionDataCollectionPlanList = ref([
  {
    dateOfRevision: '',
    revisedProvision: ''
  },
  {
    dateOfRevision: '',
    revisedProvision: ''
  },
  {
    dateOfRevision: '',
    revisedProvision: ''
  },
  {
    dateOfRevision: '',
    revisedProvision: ''
  }
])

const engineOrOtherFuelOilConsumersPowerAndFuelOilTypeUsedList = ref([
  {
    power: 0,
    fuelOilType: ''
  },
  {
    power: 0,
    fuelOilType: ''
  },
  {
    power: 0,
    fuelOilType: ''
  },
  {
    power: 0,
    fuelOilType: ''
  }
])

const emissionFactor = ref({
  dgoCf: '3.206',
  lfoCf: '3.151',
  hfoCf: '3.114',
  lpgPCf: '3.000',
  lgpBCf: '3.030',
  lngCf: '2.750',
  methanolCf: '1.375',
  ethanolCf: '1.913',
  OtherCf: '0'
})

const methodToMeasureFuelOilConsumption = ref({
  method: '',
  description: ''
})

const methodToMeasureDistanceTravelled = ref('')

const methodToMeasureHoursUnderway = ref('')

const processesThatWillBeUsedToReportTheDataToTheAdministration = ref('')

const dataQuality = ref('')

watch(curSelectedShip, fetchEEDIPlanPart)
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
  min-width: 1440px;
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

table.fuelInfo-table.oil-consumer td:not(:last-child) {
  border-right: 1px solid #49494e;
}

.plan-title {
  font-size: 1.2em;
}
</style>
